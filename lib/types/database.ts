// Tipos TypeScript para la base de datos de emprendimientos

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;
      };
      businesses: {
        Row: Business;
        Insert: Omit<Business, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>;
      };
      service_schedules: {
        Row: ServiceSchedule;
        Insert: Omit<ServiceSchedule, 'id'>;
        Update: Partial<Omit<ServiceSchedule, 'id'>>;
      };

    };
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  category_id?: string;
  name: string;
  description?: string;
  logo_url?: string;
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  canton?: string;
  provincia?: string;
  google_maps_link?: string;
  opening_hours?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  business_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price?: number;
  currency: string;
  sku?: string;
  image_url?: string;
  canton?: string;
  provincia?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  business_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price?: number;
  currency: string;
  image_url?: string;
  canton?: string;
  provincia?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceSchedule {
  id: string;
  service_id: string;
  day_of_week: number; // 0 = Domingo, 6 = Sábado
  start_time: string;
  end_time: string;
  is_available: boolean;
}



// Tipos extendidos con relaciones
export interface BusinessWithDetails extends Business {
  products?: Product[];
  services?: Service[];
  category?: Category;
}

export interface ProductWithDetails extends Product {
  business?: Business;
  category?: Category;
}

export interface ServiceWithDetails extends Service {
  business?: Business;
  category?: Category;
  schedules?: ServiceSchedule[];
}



// Tipos para formularios
export interface BusinessFormData {
  name: string;
  description?: string;
  category_id?: string;
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  canton?: string;
  provincia?: string;
  google_maps_link?: string;
  opening_hours?: string;
  is_active?: boolean;
  user_id?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  category_id?: string;
  price?: number;
  currency?: string;
  sku?: string;
  image_url?: string;
  canton?: string;
  provincia?: string;
  is_active?: boolean;
  business_id: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  category_id?: string;
  price?: number;
  currency?: string;
  image_url?: string;
  is_active?: boolean;
  business_id: string;
}

// Tipos para filtros
export interface ProductFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  business_id?: string;
  provincia?: string;
  canton?: string;
  country?: string;
  page?: number;
  limit?: number;
  sort_by?: 'random' | 'popularity' | 'newest';
}

export interface ServiceFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  business_id?: string;
  provincia?: string;
  canton?: string;
  min_duration?: number;
  max_duration?: number;
  country?: string;
  page?: number;
  limit?: number;
  sort_by?: 'random' | 'popularity' | 'newest';
}

export interface BusinessFilters {
  search?: string;
  category_id?: string;
  canton?: string;
  provincia?: string;
  city?: string;
  state?: string;
  country?: string;
  has_products?: boolean;
  has_services?: boolean;
  page?: number;
  limit?: number;
  sort_by?: 'random' | 'popularity' | 'newest';
}

// Interfaces para estadísticas
export interface ProductStat {
  products: {
    id: string;
    name: string;
  }[];
  contact_count: number;
  last_contact_at: string;
}

export interface ServiceStat {
  services: {
    id: string;
    name: string;
  }[];
  contact_count: number;
  last_contact_at: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Enums
export enum Currency {
  CRC = 'CRC',
  USD = 'USD',
  EUR = 'EUR'
}

export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}