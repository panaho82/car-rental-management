-- Create reservation_status enum
CREATE TYPE reservation_status AS ENUM (
    'pending',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'late',
    'maintenance'
);

-- Update reservations table to use the new enum
ALTER TABLE reservations 
    DROP CONSTRAINT IF EXISTS reservations_status_check,
    ALTER COLUMN status TYPE reservation_status USING status::reservation_status;

-- Add new columns to reservations table
ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS late_return_fee DECIMAL(10,2),
    ADD COLUMN IF NOT EXISTS actual_return_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS insurance_option TEXT,
    ADD COLUMN IF NOT EXISTS additional_drivers TEXT[],
    ADD COLUMN IF NOT EXISTS pickup_location TEXT,
    ADD COLUMN IF NOT EXISTS return_location TEXT;

-- Create function to automatically update reservation status
CREATE OR REPLACE FUNCTION update_reservation_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status based on dates and actual return
    IF NEW.actual_return_date IS NOT NULL THEN
        NEW.status = 'completed';
    ELSIF NEW.actual_return_date IS NULL AND NEW.end_date < NOW() THEN
        NEW.status = 'late';
    ELSIF NEW.start_date <= NOW() AND NEW.end_date >= NOW() THEN
        NEW.status = 'in_progress';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic status updates
CREATE TRIGGER update_reservation_status_trigger
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_reservation_status();

-- Create function to check for reservation conflicts
CREATE OR REPLACE FUNCTION check_reservation_conflict()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM reservations
        WHERE vehicle_id = NEW.vehicle_id
        AND id != NEW.id  -- Exclude current reservation when updating
        AND status NOT IN ('cancelled', 'completed')
        AND (
            (NEW.start_date, NEW.end_date) OVERLAPS (start_date, end_date)
            OR
            (NEW.start_date BETWEEN start_date AND end_date)
            OR
            (NEW.end_date BETWEEN start_date AND end_date)
        )
    ) THEN
        RAISE EXCEPTION 'Reservation conflict: Vehicle is already reserved for this period';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for conflict checking
CREATE TRIGGER check_reservation_conflict_trigger
    BEFORE INSERT OR UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION check_reservation_conflict();

-- Create view for active reservations
CREATE OR REPLACE VIEW active_reservations AS
SELECT 
    r.*,
    c.first_name,
    c.last_name,
    c.phone,
    v.brand,
    v.model,
    v.registration
FROM reservations r
JOIN customers c ON r.customer_id = c.id
JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.status IN ('confirmed', 'in_progress', 'late');

-- Create view for upcoming reservations
CREATE OR REPLACE VIEW upcoming_reservations AS
SELECT 
    r.*,
    c.first_name,
    c.last_name,
    c.phone,
    v.brand,
    v.model,
    v.registration
FROM reservations r
JOIN customers c ON r.customer_id = c.id
JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.status = 'confirmed' 
AND r.start_date > NOW()
ORDER BY r.start_date ASC;

-- Create view for late returns
CREATE OR REPLACE VIEW late_returns AS
SELECT 
    r.*,
    c.first_name,
    c.last_name,
    c.phone,
    v.brand,
    v.model,
    v.registration,
    EXTRACT(EPOCH FROM (NOW() - r.end_date))/3600 as hours_late
FROM reservations r
JOIN customers c ON r.customer_id = c.id
JOIN vehicles v ON r.vehicle_id = v.id
WHERE r.status = 'late'
ORDER BY r.end_date ASC;
