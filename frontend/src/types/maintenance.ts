export type MaintenanceType =
  | 'oil_change'
  | 'filter_change'
  | 'brake_service'
  | 'tire_service'
  | 'general_inspection'
  | 'technical_control'
  | 'repair'
  | 'other';

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type DamageSeverity = 'minor' | 'moderate' | 'major' | 'critical';

export interface MaintenanceRecord {
  id: string;
  vehicle_id: string;
  maintenance_type: MaintenanceType;
  status: MaintenanceStatus;
  scheduled_date: string;
  completed_date?: string;
  mileage_at_maintenance?: number;
  cost?: number;
  performed_by?: string;
  notes?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface VehicleInspection {
  id: string;
  reservation_id: string;
  type: 'check_in' | 'check_out';
  inspection_date: string;
  mileage: number;
  fuel_level: number;
  exterior_condition: {
    [key: string]: {
      condition: 'good' | 'fair' | 'poor';
      notes?: string;
      photos?: string[];
    };
  };
  interior_condition: {
    [key: string]: {
      condition: 'good' | 'fair' | 'poor';
      notes?: string;
      photos?: string[];
    };
  };
  inspector_notes?: string;
  customer_signature?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface DamageReport {
  id: string;
  vehicle_id: string;
  reservation_id?: string;
  inspection_id?: string;
  report_date: string;
  damage_severity: DamageSeverity;
  damage_description: string;
  damage_location: {
    area: string;
    coordinates: { x: number; y: number };
  };
  repair_estimate?: number;
  repair_status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  insurance_claim_number?: string;
  photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface VehicleStats {
  id: string;
  vehicle_id: string;
  total_rentals: number;
  total_revenue: number;
  total_days_rented: number;
  avg_rental_duration: number;
  maintenance_costs: number;
  damage_incidents: number;
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerStats {
  id: string;
  customer_id: string;
  total_rentals: number;
  total_spent: number;
  avg_rental_duration: number;
  cancelled_reservations: number;
  damage_incidents: number;
  last_rental_date?: string;
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}
