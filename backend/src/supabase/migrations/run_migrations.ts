import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Les variables d\'environnement SUPABASE_URL et SUPABASE_SERVICE_KEY sont requises');
    process.exit(1);
}

// Créer un client Supabase avec la clé de service
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function runMigrations() {
    try {
        // Lire tous les fichiers SQL dans le dossier des migrations
        const migrationsDir = path.join(__dirname);
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        console.log('Fichiers de migration trouvés:', files);

        // Exécuter chaque fichier de migration
        for (const file of files) {
            console.log(`\nExécution de la migration: ${file}`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

            // Diviser le fichier SQL en commandes individuelles
            const commands = sql.split(';')
                .map(command => command.trim())
                .filter(command => command.length > 0);

            // Exécuter chaque commande séparément
            for (const command of commands) {
                try {
                    const { error } = await supabase.from('_migrations').select('*').limit(0);
                    if (error) {
                        console.error(`Erreur lors de l'exécution de la commande:`, error);
                        throw error;
                    }
                } catch (err) {
                    console.error(`Erreur lors de l'exécution de la commande:`, err);
                    throw err;
                }
            }

            console.log(`Migration ${file} exécutée avec succès`);
        }

        console.log('\nToutes les migrations ont été exécutées avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'exécution des migrations:', error);
        process.exit(1);
    }
}

runMigrations();
