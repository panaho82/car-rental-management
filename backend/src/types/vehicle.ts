export enum VehicleStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum VehicleCategory {
  ECONOMY = 'economy',
  COMPACT = 'compact',
  MIDSIZE = 'midsize',
  LUXURY = 'luxury',
  SUV = 'suv',
  VAN = 'van'
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  registration: string;
  mileage: number;
  status: VehicleStatus;
  category: VehicleCategory;
  daily_rate: number;  // Changed from dailyRate to daily_rate to match database column
  last_maintenance?: Date;
  next_maintenance_due?: Date;
  features: string[];
  images: string[];
  created_at?: Date;
  updated_at?: Date;
}
