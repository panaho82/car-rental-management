import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
    try {
        // Check vehicle_category enum values
        const { data: enumValues, error: enumError } = await supabase
            .from('pg_enum')
            .select('*')
            .eq('enumtypid', 'vehicle_category'::regtype);

        if (enumError) {
            console.error('Error fetching enum values:', enumError);
            return;
        }

        console.log('Vehicle category enum values:', enumValues);

        // Check vehicles table structure
        const { data: vehicles, error: vehiclesError } = await supabase
            .from('vehicles')
            .select('*')
            .limit(1);

        if (vehiclesError) {
            console.error('Error fetching vehicles:', vehiclesError);
            return;
        }

        console.log('Vehicles table structure:', vehicles);

    } catch (error) {
        console.error('Error:', error);
    }
}

checkDatabase();
