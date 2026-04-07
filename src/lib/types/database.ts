export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          acao: string
          criado_em: string
          dados_antes: Json | null
          dados_depois: Json | null
          entidade: string
          entidade_id: string
          id: string
          user_id: string
        }
        Insert: {
          acao: string
          criado_em?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          entidade: string
          entidade_id: string
          id?: string
          user_id: string
        }
        Update: {
          acao?: string
          criado_em?: string
          dados_antes?: Json | null
          dados_depois?: Json | null
          entidade?: string
          entidade_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_notifications: {
        Row: {
          client_name: string | null
          created_at: string
          days_until_expiry: number
          id: string
          professional_id: string | null
          professional_name: string
          read_at: string | null
          renewal_deadline: string | null
          sent_at: string
          urgency: string
        }
        Insert: {
          client_name?: string | null
          created_at?: string
          days_until_expiry: number
          id?: string
          professional_id?: string | null
          professional_name: string
          read_at?: string | null
          renewal_deadline?: string | null
          sent_at?: string
          urgency: string
        }
        Update: {
          client_name?: string | null
          created_at?: string
          days_until_expiry?: number
          id?: string
          professional_id?: string | null
          professional_name?: string
          read_at?: string | null
          renewal_deadline?: string | null
          sent_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_notifications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_notifications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "v_renewal_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          company: string | null
          created_at: string
          id: string
          machine_model: string | null
          machine_type: string | null
          office_package: boolean | null
          professional_name: string
          software_details: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          id?: string
          machine_model?: string | null
          machine_type?: string | null
          office_package?: boolean | null
          professional_name: string
          software_details?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          id?: string
          machine_model?: string | null
          machine_type?: string | null
          office_package?: boolean | null
          professional_name?: string
          software_details?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      kanban_metrics_snapshot: {
        Row: {
          created_at: string | null
          cycle_time_avg: number | null
          efficiency_rate: number | null
          id: string
          lead_time_avg: number | null
          metric_date: string
          rework_rate: number | null
          throughput: number | null
          wip_total: number | null
        }
        Insert: {
          created_at?: string | null
          cycle_time_avg?: number | null
          efficiency_rate?: number | null
          id?: string
          lead_time_avg?: number | null
          metric_date?: string
          rework_rate?: number | null
          throughput?: number | null
          wip_total?: number | null
        }
        Update: {
          created_at?: string | null
          cycle_time_avg?: number | null
          efficiency_rate?: number | null
          id?: string
          lead_time_avg?: number | null
          metric_date?: string
          rework_rate?: number | null
          throughput?: number | null
          wip_total?: number | null
        }
        Relationships: []
      }
      professional_notes: {
        Row: {
          id: string
          professional_id: string
          author_id: string
          content: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          professional_id: string
          author_id: string
          content: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          professional_id?: string
          author_id?: string
          content?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_notes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      professionals: {
        Row: {
          billing_rate: number | null
          client_id: string
          contact: string | null
          contract_end: string | null
          contract_start: string | null
          contract_type: string | null
          created_at: string
          date_end: string | null
          date_start: string | null
          email: string | null
          hourly_rate: number | null
          hours_worked: number | null
          id: string
          manager: string | null
          name: string
          os: number | null
          other_values: number | null
          payment_value: number | null
          position: string | null
          profile: string | null
          renewal_billing: number | null
          renewal_deadline: string | null
          seniority: string | null
          status: string
          total_billing: number | null
          updated_at: string
          value_clt: number | null
          value_strategic: number | null
        }
        Insert: {
          billing_rate?: number | null
          client_id: string
          contact?: string | null
          contract_end?: string | null
          contract_start?: string | null
          contract_type?: string | null
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          email?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          manager?: string | null
          name: string
          os?: number | null
          other_values?: number | null
          payment_value?: number | null
          position?: string | null
          profile?: string | null
          renewal_billing?: number | null
          renewal_deadline?: string | null
          seniority?: string | null
          status?: string
          total_billing?: number | null
          updated_at?: string
          value_clt?: number | null
          value_strategic?: number | null
        }
        Update: {
          billing_rate?: number | null
          client_id?: string
          contact?: string | null
          contract_end?: string | null
          contract_start?: string | null
          contract_type?: string | null
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          email?: string | null
          hourly_rate?: number | null
          hours_worked?: number | null
          id?: string
          manager?: string | null
          name?: string
          os?: number | null
          other_values?: number | null
          payment_value?: number | null
          position?: string | null
          profile?: string | null
          renewal_billing?: number | null
          renewal_deadline?: string | null
          seniority?: string | null
          status?: string
          total_billing?: number | null
          updated_at?: string
          value_clt?: number | null
          value_strategic?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_client_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "professionals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "v_renewal_alerts"
            referencedColumns: ["client_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          permissions: Json | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          permissions?: Json | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_health_logs: {
        Row: {
          branch: string | null
          commit_sha: string | null
          coverage_files_covered: number
          coverage_files_total: number
          coverage_percent: number
          created_at: string | null
          e2e_duration_ms: number | null
          e2e_failed: number
          e2e_passed: number
          e2e_total: number
          id: string
          integration_duration_ms: number | null
          integration_failed: number
          integration_passed: number
          integration_total: number
          notes: string | null
          recorded_at: string
          triggered_by: string | null
        }
        Insert: {
          branch?: string | null
          commit_sha?: string | null
          coverage_files_covered?: number
          coverage_files_total?: number
          coverage_percent?: number
          created_at?: string | null
          e2e_duration_ms?: number | null
          e2e_failed?: number
          e2e_passed?: number
          e2e_total?: number
          id?: string
          integration_duration_ms?: number | null
          integration_failed?: number
          integration_passed?: number
          integration_total?: number
          notes?: string | null
          recorded_at?: string
          triggered_by?: string | null
        }
        Update: {
          branch?: string | null
          commit_sha?: string | null
          coverage_files_covered?: number
          coverage_files_total?: number
          coverage_percent?: number
          created_at?: string | null
          e2e_duration_ms?: number | null
          e2e_failed?: number
          e2e_passed?: number
          e2e_total?: number
          id?: string
          integration_duration_ms?: number | null
          integration_failed?: number
          integration_passed?: number
          integration_total?: number
          notes?: string | null
          recorded_at?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      vacations: {
        Row: {
          acquisition_end: string | null
          acquisition_start: string | null
          admission_date: string | null
          bonus_days: number | null
          client_area: string | null
          concession_end: string | null
          concession_start: string | null
          created_at: string
          days_balance: number | null
          id: string
          leadership: string | null
          professional_name: string
          total_days: number | null
          updated_at: string
          vacation_end: string | null
          vacation_start: string | null
        }
        Insert: {
          acquisition_end?: string | null
          acquisition_start?: string | null
          admission_date?: string | null
          bonus_days?: number | null
          client_area?: string | null
          concession_end?: string | null
          concession_start?: string | null
          created_at?: string
          days_balance?: number | null
          id?: string
          leadership?: string | null
          professional_name: string
          total_days?: number | null
          updated_at?: string
          vacation_end?: string | null
          vacation_start?: string | null
        }
        Update: {
          acquisition_end?: string | null
          acquisition_start?: string | null
          admission_date?: string | null
          bonus_days?: number | null
          client_area?: string | null
          concession_end?: string | null
          concession_start?: string | null
          created_at?: string
          days_balance?: number | null
          id?: string
          leadership?: string | null
          professional_name?: string
          total_days?: number | null
          updated_at?: string
          vacation_end?: string | null
          vacation_start?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      v_client_summary: {
        Row: {
          active_count: number | null
          client_id: string | null
          client_name: string | null
          terminated_count: number | null
          total_billing: number | null
          total_count: number | null
        }
        Relationships: []
      }
      v_dashboard_kpis: {
        Row: {
          renewals_critical: number | null
          renewals_pending: number | null
          total_active: number | null
          total_all: number | null
          total_terminated: number | null
        }
        Relationships: []
      }
      v_renewal_alerts: {
        Row: {
          client_id: string | null
          client_name: string | null
          contract_end: string | null
          days_until_expiry: number | null
          email: string | null
          id: string | null
          name: string | null
          profile: string | null
          renewal_deadline: string | null
          renewal_status: string | null
          seniority: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_gerente_or_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
