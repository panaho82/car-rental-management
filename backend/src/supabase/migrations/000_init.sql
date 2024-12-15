-- Create vehicle_status enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_status') THEN
    CREATE TYPE vehicle_status AS ENUM ('available', 'rented', 'maintenance', 'unavailable');
  END IF;
END $$;

-- Create vehicle_category enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_category') THEN
    CREATE TYPE vehicle_category AS ENUM ('COMPACT', 'SEDAN', 'SUV', 'LUXURY', 'VAN', 'TRUCK');
  END IF;
END $$;

-- Create vehicles table if it doesn't exist
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  registration VARCHAR(20) NOT NULL UNIQUE,
  mileage INTEGER NOT NULL,
  status vehicle_status NOT NULL DEFAULT 'available',
  category vehicle_category NOT NULL,
  daily_rate DECIMAL(10, 2) NOT NULL,
  last_maintenance TIMESTAMP WITH TIME ZONE,
  next_maintenance_due TIMESTAMP WITH TIME ZONE,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vehicles_updated_at') THEN
    CREATE TRIGGER update_vehicles_updated_at
      BEFORE UPDATE ON vehicles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON vehicles;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON vehicles;
DROP POLICY IF EXISTS "Enable insert access for service role" ON vehicles;

-- Create policies
CREATE POLICY "Enable read access for all users" ON vehicles
  FOR SELECT
  USING (true);

CREATE POLICY "Enable write access for authenticated users" ON vehicles
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for service role" ON vehicles
  FOR INSERT
  TO service_role
  WITH CHECK (true);
