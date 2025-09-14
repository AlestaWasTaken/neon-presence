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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      profile_views: {
        Row: {
          browser_type: string | null
          created_at: string
          id: string
          profile_user_id: string
          user_agent: string | null
          viewer_ip: string | null
          viewer_ip_hash: string | null
          viewer_user_id: string | null
        }
        Insert: {
          browser_type?: string | null
          created_at?: string
          id?: string
          profile_user_id: string
          user_agent?: string | null
          viewer_ip?: string | null
          viewer_ip_hash?: string | null
          viewer_user_id?: string | null
        }
        Update: {
          browser_type?: string | null
          created_at?: string
          id?: string
          profile_user_id?: string
          user_agent?: string | null
          viewer_ip?: string | null
          viewer_ip_hash?: string | null
          viewer_user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accent_color: string | null
          animated_title: boolean | null
          audio_url: string | null
          avatar_url: string | null
          background_effect: string | null
          background_video_url: string | null
          bio: string | null
          created_at: string
          cursor_style: string | null
          custom_cursor_url: string | null
          enable_gradient: boolean | null
          id: string
          location: string | null
          monochrome_icons: boolean | null
          primary_color: string | null
          profile_blur: number | null
          profile_opacity: number | null
          sequential_id: number
          theme: string | null
          updated_at: string
          user_id: string
          username: string
          username_effect: string | null
          view_count: number | null
          volume_control: boolean | null
        }
        Insert: {
          accent_color?: string | null
          animated_title?: boolean | null
          audio_url?: string | null
          avatar_url?: string | null
          background_effect?: string | null
          background_video_url?: string | null
          bio?: string | null
          created_at?: string
          cursor_style?: string | null
          custom_cursor_url?: string | null
          enable_gradient?: boolean | null
          id?: string
          location?: string | null
          monochrome_icons?: boolean | null
          primary_color?: string | null
          profile_blur?: number | null
          profile_opacity?: number | null
          sequential_id?: number
          theme?: string | null
          updated_at?: string
          user_id: string
          username: string
          username_effect?: string | null
          view_count?: number | null
          volume_control?: boolean | null
        }
        Update: {
          accent_color?: string | null
          animated_title?: boolean | null
          audio_url?: string | null
          avatar_url?: string | null
          background_effect?: string | null
          background_video_url?: string | null
          bio?: string | null
          created_at?: string
          cursor_style?: string | null
          custom_cursor_url?: string | null
          enable_gradient?: boolean | null
          id?: string
          location?: string | null
          monochrome_icons?: boolean | null
          primary_color?: string | null
          profile_blur?: number | null
          profile_opacity?: number | null
          sequential_id?: number
          theme?: string | null
          updated_at?: string
          user_id?: string
          username?: string
          username_effect?: string | null
          view_count?: number | null
          volume_control?: boolean | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          color: string | null
          created_at: string
          icon: string
          id: string
          is_visible: boolean | null
          name: string
          order_index: number | null
          url: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon: string
          id?: string
          is_visible?: boolean | null
          name: string
          order_index?: number | null
          url: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string
          id?: string
          is_visible?: boolean | null
          name?: string
          order_index?: number | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_sequential_ids: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_profile_views: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hash_ip_address: {
        Args: { ip_address: string }
        Returns: string
      }
      sanitize_user_agent: {
        Args: { user_agent_input: string }
        Returns: string
      }
      track_profile_view: {
        Args: {
          p_profile_user_id: string
          p_user_agent?: string
          p_viewer_ip?: string
          p_viewer_user_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
