-- Drop tables that depend on the enums
DROP TABLE IF EXISTS rental_contracts;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS vehicles;

-- Drop enums
DROP TYPE IF EXISTS vehicle_status;
DROP TYPE IF EXISTS vehicle_category;
