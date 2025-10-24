export interface S3UploadResponse {
  success: boolean;
  url: string;
  key: string;
  bucket: string;
}

export interface S3MultipleUploadResponse {
  success: boolean;
  files: S3UploadResponse[];
}

export interface S3DeleteResponse {
  success: boolean;
  message: string;
}

export interface S3SignedUrlResponse {
  success: boolean;
  signedUrl: string;
}

export interface S3ErrorResponse {
  error: string;
  details?: string;
}