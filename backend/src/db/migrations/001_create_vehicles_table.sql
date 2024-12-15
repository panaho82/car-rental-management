-- Create enum types
CREATE TYPE vehicle_status AS ENUM (
  'available',
  'reserved',
  'maintenance',
  'out_of_service'
);

CREATE TYPE vehicle_category AS ENUM (
  'economy',
  'compact',
  'midsize',
  'luxury',
  'suv',
  'van'
);

-- Create vehicles table
CREATE TABLE vehicles (
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

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
