import { ACCESKEYID, BUCKETNAME, REGION, SECRETACCESKEY } from '@/config';
import type { 
  S3UploadResponse, 
  S3MultipleUploadResponse, 
  S3DeleteResponse,
} from '@/types/s3';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Cliente S3 configurado para el navegador
const getS3Client = () => {
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESKEYID!,
      secretAccessKey: SECRETACCESKEY!,
    },
  });
};

/**
 * Subir una imagen directamente a S3 desde el cliente
 * @param file - Archivo a subir
 * @param folder - Carpeta en S3 (default: 'uploads')
 * @returns Promise con la respuesta de S3
 */
export async function uploadImage(
  file: File, 
  folder: string = 'uploads'
): Promise<S3UploadResponse> {
  try {
    // Validar archivo
    validateImageFile(file);

    const s3Client = getS3Client();

    const key = `${folder}/${Date.now()}-${file.name}`;

    // Convertir File a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Comando para subir a S3
    const command = new PutObjectCommand({
      Bucket: BUCKETNAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Construir URL pública
    const url = `https://${BUCKETNAME}.s3.${REGION}.amazonaws.com/${key}`;

    return {
      success: true,
      url,
      key,
      bucket: BUCKETNAME!,
    };
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al subir imagen');
  }
}

/**
 * Subir múltiples imágenes directamente a S3
 * @param files - Array de archivos
 * @param folder - Carpeta en S3
 * @returns Promise con array de respuestas
 */
export async function uploadMultipleImages(
  files: File[], 
  folder: string = 'uploads'
): Promise<S3MultipleUploadResponse> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      files: results,
    };
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    throw new Error('Error al subir imágenes');
  }
}

/**
 * Eliminar una imagen de S3
 * @param url - URL completa de la imagen en S3
 * @returns Promise con confirmación
 */
export async function deleteImage(url: string): Promise<S3DeleteResponse> {
  try {
    const s3Client = getS3Client();
    const key = getKeyFromUrl(url);

    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(command);

    return {
      success: true,
      message: 'Imagen eliminada correctamente',
    };
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw new Error('Error al eliminar imagen');
  }
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