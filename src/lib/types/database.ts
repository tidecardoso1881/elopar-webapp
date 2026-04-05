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
      clients: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          updated_at?: string
        }
      }
      professionals: {
        Row: {
          id: string
          os: number | null
          name: string
          email: string | null
          manager: string | null
          contact: string | null
          profile: string | null
          position: string | null
          seniority: string | null
          status: string
          contract_type: string | null
          date_start: string | null
          date_end: string | null
          contract_start: string | null
          contract_end: string | null
          renewal_deadline: string | null
          hourly_rate: number | null
          value_clt: number
          value_strategic: number
          hours_worked: number
          payment_value: number
          other_values: number
          billing_rate: number
          renewal_billing: number
          total_billing: number
          client_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          os?: number | null
          name: string
          email?: string | null
          manager?: string | null
          contact?: string | null
          profile?: string | null
          position?: string | null
          seniority?: string | null
          status?: string
          contract_type?: string | null
          date_start?: string | null
          date_end?: string | null
          contract_start?: string | null
          contract_end?: string | null
          renewal_deadline?: string | null
          hourly_rate?: number | null
          value_clt?: number
          value_strategic?: number
          hours_worked?: number
          payment_value?: number
          other_values?: number
          billing_rate?: number
          renewal_billing?: number
          total_billing?: number
          client_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          os?: number | null
          name?: string
          email?: string | null
          manager?: string | null
          contact?: string | null
          profile?: string | null
          position?: string | null
          seniority?: string | null
          status?: string
          contract_type?: string | null
          date_start?: string | null
          date_end?: string | null
          contract_start?: string | null
          contract_end?: string | null
          renewal_deadline?: string | null
          hourly_rate?: number | null
          value_clt?: number
          value_strategic?: number
          hours_worked?: number
          payment_value?: number
          other_values?: number
          billing_rate?: number
          renewal_billing?: number
          total_billing?: number
          client_id?: string
          updated_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          professional_name: string
          company: string | null
          machine_model: string | null
          machine_type: string | null
          office_package: boolean
          software_details: string | null
          created_at: string
        }
        Insert: {
          id?: string
          professional_name: string
          company?: string | null
          machine_model?: string | null
          machine_type?: string | null
          office_package?: boolean
          software_details?: string | null
          created_at?: string
        }
        Update: {
          professional_name?: string
          company?: string | null
          machine_model?: string | null
          machine_type?: string | null
          office_package?: boolean
          software_details?: string | null
        }
      }
      vacations: {
        Row: {
          id: string
          client_area: string | null
          leadership: string | null
          professional_name: string
          admission_date: string | null
          acquisition_start: string | null
          acquisition_end: string | null
          concession_start: string | null
          concession_end: string | null
          days_balance: number
          vacation_start: string | null
          vacation_end: string | null
          bonus_days: number
          total_days: number
          created_at: string
        }
        Insert: {
          id?: string
          client_area?: string | null
          leadership?: string | null
          professional_name: string
          admission_date?: string | null
          acquisition_start?: string | null
          acquisition_end?: string | null
          concession_start?: string | null
          concession_end?: string | null
          days_balance?: number
          vacation_start?: string | null
          vacation_end?: string | null
          bonus_days?: number
          total_days?: number
          created_at?: string
        }
        Update: {
          client_area?: string | null
          leadership?: string | null
          professional_name?: string
          admission_date?: string | null
          acquisition_start?: string | null
          acquisition_end?: string | null
          concession_start?: string | null
          concession_end?: string | null
          days_balance?: number
          vacation_start?: string | null
          vacation_end?: string | null
          bonus_days?: number
          total_days?: number
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          role?: string
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
      [_ in never]: never
    }
  }
}
