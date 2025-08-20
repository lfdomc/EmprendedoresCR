/**
 * Utility functions for generating URL-friendly slugs
 */

/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove any character that is not alphanumeric or hyphen
    .replace(/[^a-z0-9-]/g, '')
    // Replace multiple consecutive hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a business slug from business name and ID
 * @param name - Business name
 * @param id - Business ID (fallback)
 * @returns Business slug
 */
export function generateBusinessSlug(name: string | undefined | null, id: string | undefined | null): string {
  if (!name && !id) return '';
  const slug = generateSlug(name || '');
  return slug || id || ''; // Fallback to ID if slug is empty
}

/**
 * Generates a product slug from business name, product name and ID
 * @param businessName - Business name
 * @param productName - Product name
 * @param id - Product ID (fallback)
 * @returns Product slug
 */
export function generateProductSlug(businessName: string | undefined | null, productName: string | undefined | null, id: string | undefined | null): string {
  if (!businessName && !productName && !id) return '';
  
  const businessSlug = generateSlug(businessName || '');
  const productSlug = generateSlug(productName || '');
  
  if (businessSlug && productSlug) {
    return `${businessSlug}-${productSlug}`;
  }
  
  return id || ''; // Fallback to ID if slugs are empty
}

/**
 * Generates a service slug from business name, service name and ID
 * @param businessName - Business name
 * @param serviceName - Service name
 * @param id - Service ID (fallback)
 * @returns Service slug
 */
export function generateServiceSlug(businessName: string | undefined | null, serviceName: string | undefined | null, id: string | undefined | null): string {
  if (!businessName && !serviceName && !id) return '';
  
  const businessSlug = generateSlug(businessName || '');
  const serviceSlug = generateSlug(serviceName || '');
  
  if (businessSlug && serviceSlug) {
    return `${businessSlug}-${serviceSlug}`;
  }
  
  return id || ''; // Fallback to ID if slugs are empty
}

/**
 * Extracts ID from a slug that might contain ID at the end
 * @param slug - The slug that might contain an ID
 * @returns The extracted ID or the original slug if no ID pattern found
 */
export function extractIdFromSlug(slug: string): string {
  // If the slug looks like a UUID, return it as is
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slug)) {
    return slug;
  }
  
  // For now, we'll need to implement a lookup mechanism
  // This function will be used when we need to find the actual ID from a slug
  return slug;
}