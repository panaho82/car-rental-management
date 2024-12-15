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
          status: 'available' | 'reserved' | 'maintenance' | 'out_of_service'
          category: 'economy' | 'compact' | 'midsize' | 'luxury' | 'suv' | 'van'
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
          status?: 'available' | 'reserved' | 'maintenance' | 'out_of_service'
          category: 'economy' | 'compact' | 'midsize' | 'luxury' | 'suv' | 'van'
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
          status?: 'available' | 'reserved' | 'maintenance' | 'out_of_service'
          category?: 'economy' | 'compact' | 'midsize' | 'luxury' | 'suv' | 'van'
          daily_rate?: number
          last_maintenance?: string | null
          next_maintenance_due?: string | null
          features?: string[]
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      vehicle_status: 'available' | 'reserved' | 'maintenance' | 'out_of_service'
      vehicle_category: 'economy' | 'compact' | 'midsize' | 'luxury' | 'suv' | 'van'
    }
  }
}
