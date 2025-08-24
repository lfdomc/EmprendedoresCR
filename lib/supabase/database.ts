import { createClient } from '@/lib/supabase/client';
import {
  Business,
  Product,
  Service,
  Category,
  ProductStat,
  ServiceStat,
  ProductWithDetails,
  ServiceWithDetails,
  BusinessFormData,
  ProductFormData,
  ServiceFormData,
  ProductFilters,
  ServiceFilters,
  BusinessFilters,
  ApiResponse
} from '@/lib/types/database';

// Types for WhatsApp stats - currently unused but kept for future features
// type ItemWithWhatsAppStats = {
//   whatsapp_stats?: Array<{ contact_count: number }>;
// };

// type ProductWithWhatsAppStats = Product & ItemWithWhatsAppStats;
// type ServiceWithWhatsAppStats = Service & ItemWithWhatsAppStats;
import { generateBusinessSlug, generateProductSlug, generateServiceSlug } from '@/lib/utils/slug';

// Cliente para operaciones del lado del cliente
const supabase = createClient();

// Funciones para Categorías
// Cache para categorías (se actualizan poco)
let categoriesCache: { data: Category[]; timestamp: number } | null = null;
const CATEGORIES_CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function getCategories(): Promise<Category[]> {
  // Verificar cache
  if (categoriesCache && Date.now() - categoriesCache.timestamp < CATEGORIES_CACHE_TTL) {
    return categoriesCache.data;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, description, created_at, updated_at')
    .order('name');

  if (error) throw error;
  
  // Actualizar cache
  categoriesCache = {
    data: data || [],
    timestamp: Date.now()
  };
  
  return data || [];
}

// Funciones para Emprendimientos
export async function getBusinesses(filters?: BusinessFilters): Promise<Business[]> {
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('is_active', true);

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  if (filters?.state) {
    query = query.eq('state', filters.state);
  }

  if (filters?.country) {
    query = query.eq('country', filters.country);
  }

  if (filters?.category_id) {
    if (Array.isArray(filters.category_id)) {
      query = query.in('category_id', filters.category_id);
    } else {
      query = query.eq('category_id', filters.category_id);
    }
  }

  if (filters?.provincia) {
    if (Array.isArray(filters.provincia)) {
      query = query.in('provincia', filters.provincia);
    } else {
      query = query.eq('provincia', filters.provincia);
    }
  }

  if (filters?.canton) {
    if (Array.isArray(filters.canton)) {
      query = query.in('canton', filters.canton);
    } else {
      query = query.eq('canton', filters.canton);
    }
  }

  // Paginación
  const limit = filters?.limit || 50;
  const page = filters?.page || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  // Determinar el tipo de ordenamiento
  const sortBy = filters?.sort_by || 'newest';
  
  if (sortBy === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sortBy === 'random') {
    // Para random, usar una función de base de datos más eficiente
    query = query.order('created_at', { ascending: false });
  } else if (sortBy === 'popularity') {
    // Ordenar por popularidad (por ahora usar fecha como fallback)
    query = query.order('created_at', { ascending: false });
  } else {
    // Fallback a ordenamiento por fecha
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getBusinessById(id: string, includeInactive: boolean = false): Promise<Business | null> {
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('id', id);

  // Solo filtrar por is_active si no se incluyen inactivos
  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query.single();

  if (error) throw error;
  return data;
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('is_active', true);

  if (error) throw error;
  if (!businesses) return null;

  // Find business by matching generated slug
  const business = businesses.find((b: Business) => generateBusinessSlug(b.name, b.id) === slug);
  return business || null;
}

export async function getBusinessByUserId(userId: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No business found
    }
    throw error;
  }
  
  return data;
}

export async function createBusiness(businessData: BusinessFormData): Promise<ApiResponse<Business>> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Usuario no autenticado' };
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert({
      ...businessData,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: 'Emprendimiento creado exitosamente' };
}

export async function updateBusiness(id: string, businessData: Partial<BusinessFormData>): Promise<ApiResponse<Business>> {
  const { data, error } = await supabase
    .from('businesses')
    .update(businessData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Si se está desactivando el emprendimiento, también desactivar productos y servicios
  if (businessData.is_active === false) {
    // Desactivar todos los productos del emprendimiento
    await supabase
      .from('products')
      .update({ is_active: false })
      .eq('business_id', id);

    // Desactivar todos los servicios del emprendimiento
    await supabase
      .from('services')
      .update({ is_active: false })
      .eq('business_id', id);
  }
  
  // Si se está reactivando el emprendimiento, también reactivar productos y servicios
  if (businessData.is_active === true) {
    // Reactivar todos los productos del emprendimiento
    await supabase
      .from('products')
      .update({ is_active: true })
      .eq('business_id', id);

    // Reactivar todos los servicios del emprendimiento
    await supabase
      .from('services')
      .update({ is_active: true })
      .eq('business_id', id);
  }

  return { data, message: 'Emprendimiento actualizado exitosamente' };
}

export async function deleteBusiness(id: string): Promise<ApiResponse<void>> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Usuario no autenticado' };
  }

  // Verificar que el usuario es el propietario del emprendimiento
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('user_id')
    .eq('id', id)
    .single();

  if (businessError) {
    return { error: 'Emprendimiento no encontrado' };
  }

  if (business.user_id !== user.id) {
    return { error: 'No tienes permisos para eliminar este emprendimiento' };
  }

  // Eliminar productos asociados
  const { error: productsError } = await supabase
    .from('products')
    .delete()
    .eq('business_id', id);

  if (productsError) {
    return { error: 'Error al eliminar productos asociados' };
  }

  // Eliminar servicios asociados
  const { error: servicesError } = await supabase
    .from('services')
    .delete()
    .eq('business_id', id);

  if (servicesError) {
    return { error: 'Error al eliminar servicios asociados' };
  }

  // Eliminar el emprendimiento
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { message: 'Emprendimiento eliminado exitosamente' };
}

// Función para verificar si el usuario actual es propietario del emprendimiento
export async function isBusinessOwner(businessId: string): Promise<boolean> {
  console.log('isBusinessOwner called with businessId:', businessId);
  
  const { data: { user } } = await supabase.auth.getUser();
  console.log('Current user:', user?.id);
  
  if (!user) {
    console.log('No user found');
    return false;
  }

  const { data: business, error } = await supabase
    .from('businesses')
    .select('user_id')
    .eq('id', businessId)
    .single();

  console.log('Business query result:', { business, error });

  if (error || !business) {
    console.log('Error or no business found:', error);
    return false;
  }

  const isOwner = business.user_id === user.id;
  console.log('Ownership check:', { businessUserId: business.user_id, currentUserId: user.id, isOwner });
  
  return isOwner;
}

// Funciones para Productos
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      business:businesses(*),
      category:categories(*)
    `)
    .eq('is_active', true)
    .eq('business.is_active', true);

  if (filters?.category_id) {
    if (Array.isArray(filters.category_id)) {
      query = query.in('category_id', filters.category_id);
    } else {
      query = query.eq('category_id', filters.category_id);
    }
  }

  if (filters?.business_id) {
    query = query.eq('business_id', filters.business_id);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.min_price !== undefined) {
    query = query.gte('price', filters.min_price);
  }

  if (filters?.max_price !== undefined) {
    query = query.lte('price', filters.max_price);
  }

  // is_featured column removed from products table

  // Location filters
  if (filters?.provincia) {
    if (Array.isArray(filters.provincia)) {
      query = query.in('provincia', filters.provincia);
    } else {
      query = query.eq('provincia', filters.provincia);
    }
  }

  if (filters?.canton) {
    if (Array.isArray(filters.canton)) {
      query = query.in('canton', filters.canton);
    } else {
      query = query.eq('canton', filters.canton);
    }
  }

  // Pagination
  const limit = filters?.limit || 50;
  const page = filters?.page || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  // Determinar el tipo de ordenamiento
  const sortBy = filters?.sort_by || 'random';
  
  if (sortBy === 'popularity') {
    // Optimización: Obtener IDs ordenados por popularidad primero
    const { data: statsData, error: statsError } = await supabase
      .from('whatsapp_stats')
      .select('product_id, contact_count')
      .not('product_id', 'is', null)
      .order('contact_count', { ascending: false })
      .range(from, to);

    if (statsError || !statsData?.length) {
      // Fallback a ordenamiento por fecha si no hay estadísticas
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    // Aplicar filtros adicionales a los productos populares
    const productIds = statsData.map(stat => stat.product_id);
    let popularQuery = supabase
      .from('products')
      .select(`
        *,
        business:businesses(*),
        category:categories(*)
      `)
      .in('id', productIds)
      .eq('is_active', true)
      .eq('business.is_active', true);

    // Aplicar los mismos filtros que la consulta original
    if (filters?.category_id) {
      if (Array.isArray(filters.category_id)) {
        popularQuery = popularQuery.in('category_id', filters.category_id);
      } else {
        popularQuery = popularQuery.eq('category_id', filters.category_id);
      }
    }

    if (filters?.business_id) {
      popularQuery = popularQuery.eq('business_id', filters.business_id);
    }

    if (filters?.search) {
      popularQuery = popularQuery.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.min_price !== undefined) {
      popularQuery = popularQuery.gte('price', filters.min_price);
    }

    if (filters?.max_price !== undefined) {
      popularQuery = popularQuery.lte('price', filters.max_price);
    }

    if (filters?.provincia) {
      if (Array.isArray(filters.provincia)) {
        popularQuery = popularQuery.in('provincia', filters.provincia);
      } else {
        popularQuery = popularQuery.eq('provincia', filters.provincia);
      }
    }

    if (filters?.canton) {
      if (Array.isArray(filters.canton)) {
        popularQuery = popularQuery.in('canton', filters.canton);
      } else {
        popularQuery = popularQuery.eq('canton', filters.canton);
      }
    }

    const { data, error } = await popularQuery;
    if (error) throw error;

    // Mantener el orden de popularidad
    const orderedProducts = productIds
      .map(id => data?.find(product => product.id === id))
      .filter(Boolean) as Product[];

    return orderedProducts;
  } else if (sortBy === 'newest') {
    // Ordenar por fecha de creación (más recientes primero)
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } else {
    // Ordenamiento por fecha de creación (más recientes primero)
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}

export async function getProductById(id: string): Promise<ProductWithDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      business:businesses(*),
      category:categories(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      business:businesses(*),
      category:categories(*)
    `)
    .eq('is_active', true);

  if (error) throw error;
  if (!products) return null;

  // Find product by matching generated slug
  const product = products.find((p: ProductWithDetails) => {
    if (p.business) {
      return generateProductSlug(p.business.name, p.name, p.id) === slug;
    }
    return false;
  });
  
  return product || null;
}

export async function createProduct(productData: ProductFormData & { business_id: string }): Promise<ApiResponse<Product>> {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: 'Producto creado exitosamente' };
}

export async function updateProduct(id: string, productData: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: 'Producto actualizado exitosamente' };
}

export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { message: 'Producto eliminado exitosamente' };
}

// Funciones para Servicios
export async function getServices(filters?: ServiceFilters): Promise<Service[]> {
  let query = supabase
    .from('services')
    .select(`
      *,
      business:businesses(*),
      category:categories(*)
    `)
    .eq('is_active', true)
    .eq('business.is_active', true);

  if (filters?.category_id) {
    if (Array.isArray(filters.category_id)) {
      query = query.in('category_id', filters.category_id);
    } else {
      query = query.eq('category_id', filters.category_id);
    }
  }

  if (filters?.business_id) {
    query = query.eq('business_id', filters.business_id);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters?.min_price !== undefined) {
    query = query.gte('price', filters.min_price);
  }

  if (filters?.max_price !== undefined) {
    query = query.lte('price', filters.max_price);
  }

  // is_featured column removed from services table

  if (filters?.min_duration !== undefined) {
    query = query.gte('duration_minutes', filters.min_duration);
  }

  if (filters?.max_duration !== undefined) {
    query = query.lte('duration_minutes', filters.max_duration);
  }

  // Location filters
  if (filters?.provincia) {
    if (Array.isArray(filters.provincia)) {
      query = query.in('provincia', filters.provincia);
    } else {
      query = query.eq('provincia', filters.provincia);
    }
  }

  if (filters?.canton) {
    if (Array.isArray(filters.canton)) {
      query = query.in('canton', filters.canton);
    } else {
      query = query.eq('canton', filters.canton);
    }
  }

  // Pagination
  const limit = filters?.limit || 50;
  const page = filters?.page || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  // Determinar el tipo de ordenamiento
  const sortBy = filters?.sort_by || 'random';
  
  if (sortBy === 'popularity') {
    // Optimización: Obtener IDs ordenados por popularidad primero
    const { data: statsData, error: statsError } = await supabase
      .from('whatsapp_stats')
      .select('service_id, contact_count')
      .not('service_id', 'is', null)
      .order('contact_count', { ascending: false })
      .range(from, to);

    if (statsError || !statsData?.length) {
      // Fallback a ordenamiento por fecha si no hay estadísticas
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    // Aplicar filtros adicionales a los servicios populares
    const serviceIds = statsData.map(stat => stat.service_id);
    let popularQuery = supabase
      .from('services')
      .select(`
        *,
        business:businesses(*),
        category:categories(*)
      `)
      .in('id', serviceIds)
      .eq('is_active', true)
      .eq('business.is_active', true);

    // Aplicar los mismos filtros que la consulta original
    if (filters?.category_id) {
      if (Array.isArray(filters.category_id)) {
        popularQuery = popularQuery.in('category_id', filters.category_id);
      } else {
        popularQuery = popularQuery.eq('category_id', filters.category_id);
      }
    }

    if (filters?.business_id) {
      popularQuery = popularQuery.eq('business_id', filters.business_id);
    }

    if (filters?.search) {
      popularQuery = popularQuery.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.min_price !== undefined) {
      popularQuery = popularQuery.gte('price', filters.min_price);
    }

    if (filters?.max_price !== undefined) {
      popularQuery = popularQuery.lte('price', filters.max_price);
    }

    if (filters?.min_duration !== undefined) {
      popularQuery = popularQuery.gte('duration_minutes', filters.min_duration);
    }

    if (filters?.max_duration !== undefined) {
      popularQuery = popularQuery.lte('duration_minutes', filters.max_duration);
    }

    if (filters?.provincia) {
      if (Array.isArray(filters.provincia)) {
        popularQuery = popularQuery.in('provincia', filters.provincia);
      } else {
        popularQuery = popularQuery.eq('provincia', filters.provincia);
      }
    }

    if (filters?.canton) {
      if (Array.isArray(filters.canton)) {
        popularQuery = popularQuery.in('canton', filters.canton);
      } else {
        popularQuery = popularQuery.eq('canton', filters.canton);
      }
    }

    const { data, error } = await popularQuery;
    if (error) throw error;

    // Mantener el orden de popularidad
    const orderedServices = serviceIds
      .map(id => data?.find(service => service.id === id))
      .filter(Boolean) as Service[];

    return orderedServices;
  } else if (sortBy === 'newest') {
    // Ordenar por fecha de creación (más recientes primero)
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } else {
    // Ordenamiento por fecha de creación (más recientes primero)
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
}

export async function getServiceById(id: string): Promise<ServiceWithDetails | null> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      business:businesses(*),
      category:categories(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

export async function getServiceBySlug(slug: string): Promise<ServiceWithDetails | null> {
  const { data: services, error } = await supabase
    .from('services')
    .select(`
      *,
      business:businesses(*),
      category:categories(*)
    `)
    .eq('is_active', true);

  if (error) throw error;
  if (!services) return null;

  // Find service by matching generated slug
  const service = services.find((s: ServiceWithDetails) => {
    if (s.business) {
      return generateServiceSlug(s.business.name, s.name, s.id) === slug;
    }
    return false;
  });
  
  return service || null;
}

export async function createService(serviceData: ServiceFormData & { business_id: string }): Promise<ApiResponse<Service>> {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: 'Servicio creado exitosamente' };
}

export async function updateService(id: string, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data, message: 'Servicio actualizado exitosamente' };
}

export async function deleteService(id: string): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { message: 'Servicio eliminado exitosamente' };
}

// Funciones para Reseñas


// Funciones de búsqueda combinada
export async function searchAll(query: string): Promise<{
  businesses: Business[];
  products: Product[];
  services: Service[];
}> {
  const [businesses, products, services] = await Promise.all([
    getBusinesses({ search: query }),
    getProducts({ search: query }),
    getServices({ search: query })
  ]);

  return { businesses, products, services };
}

// Función para obtener estadísticas del dashboard
export async function getDashboardStats(businessId: string): Promise<{
  totalProducts: number;
  totalServices: number;
  whatsappStats: {
    totalContacts: number;
    productContacts: number;
    serviceContacts: number;
  };
}> {
  const [productsResult, servicesResult, whatsappResult] = await Promise.all([
    supabase
      .from('products')
      .select('id')
      .eq('business_id', businessId),
    supabase
      .from('services')
      .select('id')
      .eq('business_id', businessId),
    supabase
      .from('whatsapp_stats')
      .select('contact_count, product_id, service_id')
      .eq('business_id', businessId)
  ]);

  const totalProducts = productsResult.data?.length || 0;
  const totalServices = servicesResult.data?.length || 0;
  
  type WhatsAppStatData = {
    contact_count: number;
    product_id: string | null;
    service_id: string | null;
  };
  
  const whatsappData: WhatsAppStatData[] = whatsappResult.data || [];
  const totalContacts = whatsappData.reduce((sum: number, stat: WhatsAppStatData) => sum + stat.contact_count, 0);
  const productContacts = whatsappData
    .filter((stat: WhatsAppStatData) => stat.product_id)
    .reduce((sum: number, stat: WhatsAppStatData) => sum + stat.contact_count, 0);
  const serviceContacts = whatsappData
    .filter((stat: WhatsAppStatData) => stat.service_id)
    .reduce((sum: number, stat: WhatsAppStatData) => sum + stat.contact_count, 0);

  return {
    totalProducts,
    totalServices,
    whatsappStats: {
      totalContacts,
      productContacts,
      serviceContacts
    }
  };
}

// Get products by business ID
export async function getProductsByBusinessId(businessId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      business:businesses(canton, provincia)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Get services by business ID
export async function getServicesByBusinessId(businessId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return data || [];
}

// Get business with full details for public profile
export async function getBusinessWithDetails(businessId: string) {
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .eq('is_active', true)
    .single();

  if (businessError) {
    console.error('Error fetching business:', businessError);
    throw businessError;
  }

  if (!business) {
    throw new Error('Business not found');
  }

  return business;
}



// Get public products for a business (only active ones)
export async function getPublicProductsByBusinessId(businessId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      business:businesses(canton, provincia)
    `)
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public products:', error);
    throw error;
  }

  return data || [];
}

// Get public services for a business (only active ones)
export async function getPublicServicesByBusinessId(businessId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public services:', error);
    throw error;
  }

  return data || [];
}

// Funciones para obtener productos y servicios más populares por WhatsApp
export async function getPopularProducts(limit: number = 50): Promise<Product[]> {
  try {
    // Optimización: Usar una vista materializada o consulta optimizada
    // Primero obtenemos solo los IDs ordenados por popularidad
    const { data: statsData, error: statsError } = await supabase
      .from('whatsapp_stats')
      .select('product_id, contact_count')
      .not('product_id', 'is', null)
      .order('contact_count', { ascending: false })
      .limit(limit);

    if (statsError || !statsData?.length) {
      // Fallback: productos recientes si no hay estadísticas
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          business:businesses!inner(*),
          category:categories(*)
        `)
        .eq('is_active', true)
        .eq('business.is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      return data || [];
    }

    // Obtener los productos completos usando los IDs ordenados
    const productIds = statsData.map(stat => stat.product_id);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        business:businesses!inner(*),
        category:categories(*)
      `)
      .in('id', productIds)
      .eq('is_active', true)
      .eq('business.is_active', true);

    if (error) {
      console.error('Error fetching popular products:', error);
      return [];
    }

    // Mantener el orden de popularidad
    const orderedProducts = productIds
      .map(id => data?.find(product => product.id === id))
      .filter(Boolean) as Product[];

    return orderedProducts;
  } catch (error) {
    console.error('Error fetching popular products:', error);
    return [];
  }
}

export async function getPopularServices(limit: number = 50): Promise<Service[]> {
  try {
    // Optimización: Usar una vista materializada o consulta optimizada
    // Primero obtenemos solo los IDs ordenados por popularidad
    const { data: statsData, error: statsError } = await supabase
      .from('whatsapp_stats')
      .select('service_id, contact_count')
      .not('service_id', 'is', null)
      .order('contact_count', { ascending: false })
      .limit(limit);

    if (statsError || !statsData?.length) {
      // Fallback: servicios recientes si no hay estadísticas
      const { data } = await supabase
        .from('services')
        .select(`
          *,
          business:businesses!inner(*),
          category:categories(*)
        `)
        .eq('is_active', true)
        .eq('business.is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      return data || [];
    }

    // Obtener los servicios completos usando los IDs ordenados
    const serviceIds = statsData.map(stat => stat.service_id);
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        business:businesses!inner(*),
        category:categories(*)
      `)
      .in('id', serviceIds)
      .eq('is_active', true)
      .eq('business.is_active', true);

    if (error) {
      console.error('Error fetching popular services:', error);
      return [];
    }

    // Mantener el orden de popularidad
    const orderedServices = serviceIds
      .map(id => data?.find(service => service.id === id))
      .filter(Boolean) as Service[];

    return orderedServices;
  } catch (error) {
    console.error('Error fetching popular services:', error);
    return [];
  }
}

// Funciones para estadísticas de WhatsApp
export async function recordWhatsAppContact(
  businessId: string,
  productId?: string,
  serviceId?: string
): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase.rpc('record_whatsapp_contact', {
      p_business_id: businessId,
      p_product_id: productId || null,
      p_service_id: serviceId || null
    });

    if (error) {
      console.error('Error recording WhatsApp contact:', error);
      return { error: error.message };
  }

  return { message: 'Contacto registrado exitosamente' };
} catch (error) {
  console.error('Error recording WhatsApp contact:', error);
  return { error: 'Error interno del servidor' };
  }
}

export async function getWhatsAppStats(businessId: string): Promise<{
  products: Array<{ id: string; name: string; contact_count: number; last_contact_at: string }>;
  services: Array<{ id: string; name: string; contact_count: number; last_contact_at: string }>;
  total_contacts: number;
}> {
  try {
    // Obtener estadísticas de productos
    const { data: productStats, error: productError } = await supabase
      .from('whatsapp_stats')
      .select(`
        contact_count,
        last_contact_at,
        products!inner(id, name)
      `)
      .eq('business_id', businessId)
      .not('product_id', 'is', null)
      .order('contact_count', { ascending: false });

    if (productError) {
      console.error('Error fetching product stats:', productError);
    }

    // Obtener estadísticas de servicios
    const { data: serviceStats, error: serviceError } = await supabase
      .from('whatsapp_stats')
      .select(`
        contact_count,
        last_contact_at,
        services!inner(id, name)
      `)
      .eq('business_id', businessId)
      .not('service_id', 'is', null)
      .order('contact_count', { ascending: false });

    if (serviceError) {
      console.error('Error fetching service stats:', serviceError);
    }

    // Formatear datos de productos
    const products = (productStats || []).map((stat: ProductStat) => ({
      id: stat.products[0]?.id || '',
      name: stat.products[0]?.name || '',
      contact_count: stat.contact_count || 0,
      last_contact_at: stat.last_contact_at || ''
    }));

    // Formatear datos de servicios
    const services = (serviceStats || []).map((stat: ServiceStat) => ({
      id: stat.services[0]?.id || '',
      name: stat.services[0]?.name || '',
      contact_count: stat.contact_count || 0,
      last_contact_at: stat.last_contact_at || ''
    }));

    // Calcular total de contactos
    const total_contacts = [...products, ...services].reduce(
      (sum: number, item: { contact_count: number }) => sum + item.contact_count,
      0
    );

    return {
      products,
      services,
      total_contacts
    };
  } catch (error) {
    console.error('Error fetching WhatsApp stats:', error);
    return {
      products: [],
      services: [],
      total_contacts: 0
    };
  }
}