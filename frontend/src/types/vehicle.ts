export enum VehicleStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable'
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  status: VehicleStatus;
  dailyRate: number;
  imageUrl?: string;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  created_at?: Date;
  updated_at?: Date;
}
