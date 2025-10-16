import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL } from "../config/Config";
import { ApiResponse } from "./types";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Configuración adicional para CORS
  withCredentials: false, // false porque tu backend usa "*" en Allow-Origin
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar requests
api.interceptors.request.use(
  (config) => {
    // Log para debugging (opcional)
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Manejo especial para errores CORS
    if (!error.response) {
      console.error('Network/CORS error:', error.message);
      // Esto podría ser un error CORS o de red
      if (error.message === 'Network Error') {
        console.error('Possible CORS issue - check backend configuration');
      }
    }
    return Promise.reject(error);
  }
);

const handleRequest = async <T>(
  request: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> => {
  try {
    const response = await request;
    return {
      Code: response.data.Code,
      Message: response.data.Message || "Success",
      Data: response.data.Data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<T>>;
      
      // Manejo especial para errores CORS/Network
      if (!axiosError.response) {
        return {
          Code: "0",
          Message: "Network error - unable to connect to server",
          Data: null as T,
        };
      }
      
      return {
        Code: String(axiosError.response.status),
        Message:
          axiosError.response.data?.Message || 
          axiosError.message || 
          "An error occurred",
        Data: null as T,
      };
    }
    
    return {
      Code: "500",
      Message: error instanceof Error ? error.message : "An unknown error occurred",
      Data: null as T,
    };
  }
};

const createRequestConfig = (token?: string): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {
    headers: {}
  };
  
  if (token) {
    // Authorization header está permitido en tu CORS
    config.headers!.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

// Métodos HTTP que coinciden con tu CORS configuration
export const get = async <T>(
  url: string, 
  token?: string
): Promise<ApiResponse<T>> =>
  handleRequest<T>(api.get<ApiResponse<T>>(url, createRequestConfig(token)));

export const post = async <T>(
  url: string,
  data: unknown,
  token?: string
): Promise<ApiResponse<T>> => 
  handleRequest<T>(api.post<ApiResponse<T>>(url, data, createRequestConfig(token)));

export const put = async <T>(
  url: string,
  data: unknown,
  token?: string
): Promise<ApiResponse<T>> =>
  handleRequest<T>(api.put<ApiResponse<T>>(url, data, createRequestConfig(token)));

export const remove = async <T>(
  url: string, 
  token?: string
): Promise<ApiResponse<T>> =>
  handleRequest<T>(api.delete<ApiResponse<T>>(url, createRequestConfig(token)));

// Función adicional para manejar OPTIONS (preflight)
export const checkCORS = async (url: string): Promise<boolean> => {
  try {
    await api.options(url);
    return true;
  } catch (error) {
    console.error('CORS preflight check failed:', error);
    return false;
  }
};