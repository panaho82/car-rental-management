export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string
          brand: string
          model: string
          year: number
          registration: string
          mileage: number
          status: string
          category: string
          daily_rate: number
          last_maintenance: string | null
          next_maintenance_due: string | null
          features: string[]
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          year: number
          registration: string
          mileage: number
          status: string
          category: string
          daily_rate: number
          last_maintenance?: string | null
          next_maintenance_due?: string | null
          features?: string[]
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          year?: number
          registration?: string
          mileage?: number
          status?: string
          category?: string
          daily_rate?: number
          last_maintenance?: string | null
          next_maintenance_due?: string | null
          features?: string[]
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          address: string | null
          driver_license: string
          driver_license_expiry: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          address?: string | null
          driver_license: string
          driver_license_expiry: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          driver_license?: string
          driver_license_expiry?: string
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          customer_id: string
          vehicle_id: string
          start_date: string
          end_date: string
          status: string
          total_price: number
          payment_status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          vehicle_id: string
          start_date: string
          end_date: string
          status: string
          total_price: number
          payment_status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          vehicle_id?: string
          start_date?: string
          end_date?: string
          status?: string
          total_price?: number
          payment_status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rental_contracts: {
        Row: {
          id: string
          reservation_id: string
          contract_number: string
          signed_at: string | null
          initial_mileage: number
          final_mileage: number | null
          damage_notes: string | null
          additional_charges: number
          insurance_details: Json | null
          terms_accepted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reservation_id: string
          contract_number: string
          signed_at?: string | null
          initial_mileage: number
          final_mileage?: number | null
          damage_notes?: string | null
          additional_charges?: number
          insurance_details?: Json | null
          terms_accepted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reservation_id?: string
          contract_number?: string
          signed_at?: string | null
          initial_mileage?: number
          final_mileage?: number | null
          damage_notes?: string | null
          additional_charges?: number
          insurance_details?: Json | null
          terms_accepted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
