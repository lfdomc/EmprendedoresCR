/**
 * Utilidades para procesamiento de imágenes
 * Convierte imágenes a WebP y las comprime para optimizar el almacenamiento
 */

export interface ImageProcessingOptions {
  quality?: number; // 0.1 a 1.0, por defecto 0.8
  maxWidth?: number; // Ancho máximo en píxeles, por defecto 1200
  maxHeight?: number; // Alto máximo en píxeles, por defecto 1200
}

/**
 * Convierte una imagen a WebP y la comprime
 * @param file - Archivo de imagen original
 * @param options - Opciones de procesamiento
 * @returns Promise<File> - Archivo WebP procesado
 */
export async function convertToWebP(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<File> {
  const {
    quality = 0.8,
    maxWidth = 1200,
    maxHeight = 1200
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('No se pudo crear el contexto del canvas'));
      return;
    }

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo la proporción
      let { width, height } = img;
      
      // Validar que las dimensiones sean válidas para evitar división por cero
      if (width <= 0 || height <= 0) {
        reject(new Error('Dimensiones de imagen inválidas'));
        return;
      }
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Configurar canvas
      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a WebP
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Error al convertir la imagen'));
            return;
          }

          // Crear nuevo archivo WebP
          const webpFile = new File(
            [blob],
            `${file.name.split('.')[0]}.webp`,
            { type: 'image/webp' }
          );

          resolve(webpFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    // Cargar imagen
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Valida si el archivo es una imagen válida
 * @param file - Archivo a validar
 * @returns boolean
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Obtiene información sobre la reducción de tamaño
 * @param originalFile - Archivo original
 * @param processedFile - Archivo procesado
 * @returns Información de la compresión
 */
export function getCompressionInfo(originalFile: File, processedFile: File) {
  const originalSize = originalFile.size;
  const processedSize = processedFile.size;
  const reduction = ((originalSize - processedSize) / originalSize) * 100;
  
  return {
    originalSize,
    processedSize,
    reduction: Math.round(reduction),
    originalSizeMB: (originalSize / (1024 * 1024)).toFixed(2),
    processedSizeMB: (processedSize / (1024 * 1024)).toFixed(2)
  };
}

/**
 * Formatea el tamaño de archivo en formato legible
 * @param bytes - Tamaño en bytes
 * @returns String formateado
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}