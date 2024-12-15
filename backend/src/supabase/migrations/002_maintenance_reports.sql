-- Create maintenance_type enum
CREATE TYPE maintenance_type AS ENUM (
    'oil_change',
    'filter_change',
    'brake_service',
    'tire_service',
    'general_inspection',
    'technical_control',
    'repair',
    'other'
);

-- Create maintenance_status enum
CREATE TYPE maintenance_status AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
);

-- Create damage_severity enum
CREATE TYPE damage_severity AS ENUM (
    'minor',
    'moderate',
    'major',
    'critical'
);

-- Create maintenance_records table
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    maintenance_type maintenance_type NOT NULL,
    status maintenance_status NOT NULL DEFAULT 'scheduled',
    scheduled_date TIMESTAMPTZ NOT NULL,
    completed_date TIMESTAMPTZ,
    mileage_at_maintenance INTEGER,
    cost DECIMAL(10,2),
    performed_by TEXT,
    notes TEXT,
    documents TEXT[], -- URLs to stored documents
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicle_inspections table (for check-in/check-out)
CREATE TABLE IF NOT EXISTS vehicle_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID NOT NULL REFERENCES reservations(id),
    type TEXT NOT NULL CHECK (type IN ('check_in', 'check_out')),
    inspection_date TIMESTAMPTZ NOT NULL,
    mileage INTEGER NOT NULL,
    fuel_level INTEGER NOT NULL CHECK (fuel_level BETWEEN 0 AND 100),
    exterior_condition JSONB,
    interior_condition JSONB,
    inspector_notes TEXT,
    customer_signature TEXT, -- URL to stored signature
    photos TEXT[], -- URLs to stored photos
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create damage_reports table
CREATE TABLE IF NOT EXISTS damage_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    reservation_id UUID REFERENCES reservations(id),
    inspection_id UUID REFERENCES vehicle_inspections(id),
    report_date TIMESTAMPTZ NOT NULL,
    damage_severity damage_severity NOT NULL,
    damage_description TEXT NOT NULL,
    damage_location JSONB NOT NULL,
    repair_estimate DECIMAL(10,2),
    repair_status TEXT CHECK (repair_status IN ('pending', 'scheduled', 'in_progress', 'completed')),
    insurance_claim_number TEXT,
    photos TEXT[], -- URLs to stored photos
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vehicle_stats table for caching statistics
CREATE TABLE IF NOT EXISTS vehicle_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    total_rentals INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    total_days_rented INTEGER DEFAULT 0,
    avg_rental_duration DECIMAL(10,2) DEFAULT 0,
    maintenance_costs DECIMAL(10,2) DEFAULT 0,
    damage_incidents INTEGER DEFAULT 0,
    last_calculated_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_stats table for caching statistics
CREATE TABLE IF NOT EXISTS customer_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    total_rentals INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    avg_rental_duration DECIMAL(10,2) DEFAULT 0,
    cancelled_reservations INTEGER DEFAULT 0,
    damage_incidents INTEGER DEFAULT 0,
    last_rental_date TIMESTAMPTZ,
    last_calculated_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_maintenance_records_updated_at
    BEFORE UPDATE ON maintenance_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_inspections_updated_at
    BEFORE UPDATE ON vehicle_inspections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_damage_reports_updated_at
    BEFORE UPDATE ON damage_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_stats_updated_at
    BEFORE UPDATE ON vehicle_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_stats_updated_at
    BEFORE UPDATE ON customer_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all new tables
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for maintenance_records
CREATE POLICY "Enable read access for all authenticated users" ON maintenance_records
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write access for authenticated users" ON maintenance_records
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for vehicle_inspections
CREATE POLICY "Enable read access for all authenticated users" ON vehicle_inspections
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write access for authenticated users" ON vehicle_inspections
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for damage_reports
CREATE POLICY "Enable read access for all authenticated users" ON damage_reports
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write access for authenticated users" ON damage_reports
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create policies for stats tables
CREATE POLICY "Enable read access for all authenticated users" ON vehicle_stats
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all authenticated users" ON customer_stats
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create function to update vehicle stats
CREATE OR REPLACE FUNCTION update_vehicle_stats(vehicle_id_param UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO vehicle_stats (
        vehicle_id,
        total_rentals,
        total_revenue,
        total_days_rented,
        avg_rental_duration,
        maintenance_costs,
        damage_incidents,
        last_calculated_at
    )
    SELECT
        v.id,
        COUNT(r.id) as total_rentals,
        COALESCE(SUM(r.total_price), 0) as total_revenue,
        COALESCE(SUM(EXTRACT(EPOCH FROM (r.end_date - r.start_date)) / 86400), 0)::INTEGER as total_days_rented,
        COALESCE(AVG(EXTRACT(EPOCH FROM (r.end_date - r.start_date)) / 86400), 0) as avg_rental_duration,
        COALESCE(SUM(m.cost), 0) as maintenance_costs,
        COUNT(d.id) as damage_incidents,
        NOW() as last_calculated_at
    FROM vehicles v
    LEFT JOIN reservations r ON v.id = r.vehicle_id AND r.status = 'completed'
    LEFT JOIN maintenance_records m ON v.id = m.vehicle_id AND m.status = 'completed'
    LEFT JOIN damage_reports d ON v.id = d.vehicle_id
    WHERE v.id = vehicle_id_param
    GROUP BY v.id
    ON CONFLICT (vehicle_id)
    DO UPDATE SET
        total_rentals = EXCLUDED.total_rentals,
        total_revenue = EXCLUDED.total_revenue,
        total_days_rented = EXCLUDED.total_days_rented,
        avg_rental_duration = EXCLUDED.avg_rental_duration,
        maintenance_costs = EXCLUDED.maintenance_costs,
        damage_incidents = EXCLUDED.damage_incidents,
        last_calculated_at = EXCLUDED.last_calculated_at;
END;
$$ LANGUAGE plpgsql;

-- Create function to update customer stats
CREATE OR REPLACE FUNCTION update_customer_stats(customer_id_param UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO customer_stats (
        customer_id,
        total_rentals,
        total_spent,
        avg_rental_duration,
        cancelled_reservations,
        damage_incidents,
        last_rental_date,
        last_calculated_at
    )
    SELECT
        c.id,
        COUNT(r.id) FILTER (WHERE r.status = 'completed') as total_rentals,
        COALESCE(SUM(r.total_price) FILTER (WHERE r.status = 'completed'), 0) as total_spent,
        COALESCE(AVG(EXTRACT(EPOCH FROM (r.end_date - r.start_date)) / 86400) FILTER (WHERE r.status = 'completed'), 0) as avg_rental_duration,
        COUNT(r.id) FILTER (WHERE r.status = 'cancelled') as cancelled_reservations,
        COUNT(d.id) as damage_incidents,
        MAX(r.end_date) FILTER (WHERE r.status = 'completed') as last_rental_date,
        NOW() as last_calculated_at
    FROM customers c
    LEFT JOIN reservations r ON c.id = r.customer_id
    LEFT JOIN vehicle_inspections vi ON r.id = vi.reservation_id
    LEFT JOIN damage_reports d ON vi.id = d.inspection_id
    WHERE c.id = customer_id_param
    GROUP BY c.id
    ON CONFLICT (customer_id)
    DO UPDATE SET
        total_rentals = EXCLUDED.total_rentals,
        total_spent = EXCLUDED.total_spent,
        avg_rental_duration = EXCLUDED.avg_rental_duration,
        cancelled_reservations = EXCLUDED.cancelled_reservations,
        damage_incidents = EXCLUDED.damage_incidents,
        last_rental_date = EXCLUDED.last_rental_date,
        last_calculated_at = EXCLUDED.last_calculated_at;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update stats
CREATE OR REPLACE FUNCTION trigger_update_vehicle_stats()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_vehicle_stats(
        CASE
            WHEN TG_TABLE_NAME = 'reservations' THEN NEW.vehicle_id
            WHEN TG_TABLE_NAME = 'maintenance_records' THEN NEW.vehicle_id
            WHEN TG_TABLE_NAME = 'damage_reports' THEN NEW.vehicle_id
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trigger_update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_customer_stats(NEW.customer_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_stats_on_reservation
    AFTER INSERT OR UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_vehicle_stats();

CREATE TRIGGER update_vehicle_stats_on_maintenance
    AFTER INSERT OR UPDATE ON maintenance_records
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_vehicle_stats();

CREATE TRIGGER update_vehicle_stats_on_damage
    AFTER INSERT OR UPDATE ON damage_reports
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_vehicle_stats();

CREATE TRIGGER update_customer_stats_on_reservation
    AFTER INSERT OR UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_customer_stats();
