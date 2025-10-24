import type { 
  S3UploadResponse, 
  S3MultipleUploadResponse, 
  S3DeleteResponse,
  S3SignedUrlResponse 
} from '@/types/s3';

/**
 * Subir una imagen a S3
 * @param file - Archivo a subir
 * @param folder - Carpeta en S3 (default: 'uploads')
 * @returns Promise con la respuesta de S3
 */
export async function uploadImage(
  file: File, 
  folder: string = 'uploads'
): Promise<S3UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al subir imagen');
  }

  return data;
}

/**
 * Subir múltiples imágenes a S3
 * @param files - Array de archivos
 * @param folder - Carpeta en S3
 * @returns Promise con array de respuestas
 */
export async function uploadMultipleImages(
  files: File[], 
  folder: string = 'uploads'
): Promise<S3MultipleUploadResponse> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  formData.append('folder', folder);

  const response = await fetch('/api/upload/multiple', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al subir imágenes');
  }

  return data;
}

/**
 * Eliminar una imagen de S3
 * @param url - URL completa de la imagen en S3
 * @returns Promise con confirmación
 */
export async function deleteImage(url: string): Promise<S3DeleteResponse> {
  const response = await fetch('/api/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al eliminar imagen');
  }

  return data;
}

/**
 * Obtener URL firmada temporal (para archivos privados)
 * @param url - URL de la imagen
 * @param expiresIn - Segundos de validez (default: 3600 = 1 hora)
 * @returns Promise con URL firmada temporal
 */
export async function getSignedUrl(
  url: string, 
  expiresIn: number = 3600
): Promise<string> {
  const response = await fetch('/api/signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, expiresIn }),
  });

  const data: S3SignedUrlResponse = await response.json();
  
  if (!data.success) {
    throw new Error('Error al generar URL');
  }

  return data.signedUrl;
}

/**
 * Validar que el archivo sea una imagen
 * @param file - Archivo a validar
 * @param maxSizeMB - Tamaño máximo en MB (default: 5)
 * @returns true si es válido
 * @throws Error si no es válido
 */
export function validateImageFile(file: File, maxSizeMB: number = 5): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = maxSizeMB * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
  }

  if (file.size > maxSize) {
    throw new Error(`El archivo es muy grande. Máximo ${maxSizeMB}MB`);
  }

  return true;
}

/**
 * Extraer el nombre del archivo desde la URL de S3
 * @param url - URL completa de S3
 * @returns Nombre del archivo
 */
export function getFileNameFromUrl(url: string): string {
  return url.split('/').pop() || '';
}

/**
 * Extraer la key del archivo desde la URL de S3
 * @param url - URL completa de S3
 * @returns Key del archivo en S3
 */
export function getKeyFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1);
  } catch {
    return url;
  }
}