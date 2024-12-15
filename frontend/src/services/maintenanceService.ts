import { supabase } from '../lib/supabaseClient';
import {
  MaintenanceRecord,
  VehicleInspection,
  DamageReport,
  VehicleStats,
  CustomerStats,
} from '../types/maintenance';

export const maintenanceService = {
  // Maintenance Records
  async createMaintenanceRecord(record: Omit<MaintenanceRecord, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateMaintenanceRecord(id: string, record: Partial<MaintenanceRecord>) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .update(record)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getMaintenanceRecords(vehicleId?: string) {
    const query = supabase
      .from('maintenance_records')
      .select('*')
      .order('scheduled_date', { ascending: false });

    if (vehicleId) {
      query.eq('vehicle_id', vehicleId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Vehicle Inspections
  async createVehicleInspection(inspection: Omit<VehicleInspection, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('vehicle_inspections')
      .insert(inspection)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateVehicleInspection(id: string, inspection: Partial<VehicleInspection>) {
    const { data, error } = await supabase
      .from('vehicle_inspections')
      .update(inspection)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getVehicleInspections(reservationId: string) {
    const { data, error } = await supabase
      .from('vehicle_inspections')
      .select('*')
      .eq('reservation_id', reservationId)
      .order('inspection_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Damage Reports
  async createDamageReport(report: Omit<DamageReport, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('damage_reports')
      .insert(report)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDamageReport(id: string, report: Partial<DamageReport>) {
    const { data, error } = await supabase
      .from('damage_reports')
      .update(report)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getDamageReports(vehicleId?: string, reservationId?: string) {
    let query = supabase
      .from('damage_reports')
      .select('*')
      .order('report_date', { ascending: false });

    if (vehicleId) {
      query = query.eq('vehicle_id', vehicleId);
    }
    if (reservationId) {
      query = query.eq('reservation_id', reservationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Statistics
  async getVehicleStats(vehicleId: string) {
    const { data, error } = await supabase
      .from('vehicle_stats')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .single();
    if (error) throw error;
    return data;
  },

  async getCustomerStats(customerId: string) {
    const { data, error } = await supabase
      .from('customer_stats')
      .select('*')
      .eq('customer_id', customerId)
      .single();
    if (error) throw error;
    return data;
  },

  // File Upload
  async uploadFile(file: File, path: string): Promise<string> {
    const filename = `${Date.now()}-${file.name}`;
    const fullPath = `${path}/${filename}`;
    
    const { error } = await supabase.storage
      .from('car-rental-files')
      .upload(fullPath, file);
    
    if (error) throw error;

    const { data } = supabase.storage
      .from('car-rental-files')
      .getPublicUrl(fullPath);

    return data.publicUrl;
  },

  async uploadFiles(files: File[], path: string): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, path));
    return Promise.all(uploadPromises);
  }
};
