-- Création de la table des clients
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    driver_license TEXT UNIQUE NOT NULL,
    driver_license_expiry DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();

-- Création de la table des réservations
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_price DECIMAL(10,2) NOT NULL,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'partial', 'paid')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_reservations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_reservations_updated_at();

-- Création de la table des contrats de location
CREATE TABLE IF NOT EXISTS rental_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID NOT NULL REFERENCES reservations(id),
    contract_number TEXT UNIQUE NOT NULL,
    signed_at TIMESTAMPTZ,
    initial_mileage INTEGER NOT NULL,
    final_mileage INTEGER,
    damage_notes TEXT,
    additional_charges DECIMAL(10,2) DEFAULT 0,
    insurance_details JSONB,
    terms_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_rental_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_rental_contracts_updated_at
    BEFORE UPDATE ON rental_contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_rental_contracts_updated_at();

-- Activation de RLS pour toutes les tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_contracts ENABLE ROW LEVEL SECURITY;

-- Politiques pour les clients
CREATE POLICY customers_select_policy
    ON customers FOR SELECT
    USING (true);

CREATE POLICY customers_insert_policy
    ON customers FOR INSERT
    WITH CHECK (true);

CREATE POLICY customers_update_policy
    ON customers FOR UPDATE
    USING (true);

CREATE POLICY customers_delete_policy
    ON customers FOR DELETE
    USING (true);

-- Politiques pour les réservations
CREATE POLICY reservations_select_policy
    ON reservations FOR SELECT
    USING (true);

CREATE POLICY reservations_insert_policy
    ON reservations FOR INSERT
    WITH CHECK (true);

CREATE POLICY reservations_update_policy
    ON reservations FOR UPDATE
    USING (true);

CREATE POLICY reservations_delete_policy
    ON reservations FOR DELETE
    USING (true);

-- Politiques pour les contrats
CREATE POLICY rental_contracts_select_policy
    ON rental_contracts FOR SELECT
    USING (true);

CREATE POLICY rental_contracts_insert_policy
    ON rental_contracts FOR INSERT
    WITH CHECK (true);

CREATE POLICY rental_contracts_update_policy
    ON rental_contracts FOR UPDATE
    USING (true);

CREATE POLICY rental_contracts_delete_policy
    ON rental_contracts FOR DELETE
    USING (true);
