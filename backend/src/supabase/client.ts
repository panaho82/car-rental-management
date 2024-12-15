import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/schema';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement depuis le fichier .env
const envPath = path.resolve(__dirname, '../../.env');
console.log('Chemin du fichier .env:', envPath);
dotenv.config({ path: envPath });

console.log('Variables d\'environnement:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: !!process.env.SUPABASE_KEY,
  SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  console.error('Variables manquantes:', {
    url: !supabaseUrl,
    key: !supabaseKey,
    serviceKey: !supabaseServiceKey
  });
  throw new Error('Les variables d\'environnement Supabase sont manquantes');
}

// Client public pour les opérations de lecture
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Client avec la clé de service pour les opérations d'écriture
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);
