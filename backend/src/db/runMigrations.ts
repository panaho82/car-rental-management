import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();

    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        console.log(`Exécution de la migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        const { error } = await supabase.from('migrations').select('*').eq('name', file);
        
        if (!error) {
          console.log(`La migration ${file} a déjà été exécutée.`);
          continue;
        }

        const { error: migrationError } = await supabase.rpc('exec_sql', {
          sql_query: sql
        });

        if (migrationError) {
          throw migrationError;
        }

        await supabase.from('migrations').insert([{ name: file }]);
        console.log(`Migration ${file} exécutée avec succès.`);
      }
    }

    console.log('Toutes les migrations ont été exécutées avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'exécution des migrations:', error);
    process.exit(1);
  }
}

runMigrations();
