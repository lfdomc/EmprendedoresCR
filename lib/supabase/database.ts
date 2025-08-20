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
import { generateBusinessSlug, generateProductSlug, generateServiceSlug } from '@/lib/utils/slug';

// Cliente para operaciones del lado del cliente
const supabase = createClient();

// Funciones para Categorías
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
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

  if (filters?.provincia) {
    query = query.eq('provincia', filters.provincia);
  }

  if (filters?.canton) {
    query = query.eq('canton', filters.canton);
  }

  // Paginación
  const limit = filters?.limit || 50;
  const page = filters?.page || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error } = await query.order('created_at', { ascending: false });

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
    query = query.eq('category_id', filters.category_id);
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
    query = query.eq('provincia', filters.provincia);
  }

  if (filters?.canton) {
    query = query.eq('canton', filters.canton);
  }

  // Pagination
  const limit = filters?.limit || 50;
  const page = filters?.page || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
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
    query = query.eq('category_id', filters.category_id);
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
    query = query.eq('business.provincia', filters.provincia);
  }

  if (filters?.canton) {
    query = query.eq('business.canton', filters.canton);
  }

  // Pagination
  const limit = filters?.limit || 50;
  const page = filters?.page || 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
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