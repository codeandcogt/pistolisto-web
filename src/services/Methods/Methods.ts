import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { API_BASE_URL } from "@/config";
import { ApiResponse } from "@/types";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleRequest = async <T>(
  request: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<ApiResponse<T>> => {
  try {
    console.log(API_BASE_URL, "valores")
    const response = await request;
    console.log(response, "entra aqui");
    return {
      code: response.data.code,
      message: response.data.message || "Success",
      data: response.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<T>>;
      return {
        code: String(axiosError.response?.status || 500),
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred",
        data: null as T,
      };
    }

    return {
      code: "500",
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      data: null as T,
    };
  }
};

const createRequestConfig = (token?: string): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {};
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
};

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
  handleRequest<T>(
    api.post<ApiResponse<T>>(url, data, createRequestConfig(token))
  );

export const put = async <T>(
  url: string,
  data: unknown,
  token?: string
): Promise<ApiResponse<T>> =>
  handleRequest<T>(
    api.put<ApiResponse<T>>(url, data, createRequestConfig(token))
  );

export const patch = async <T>(
  url: string,
  data: unknown, 
  token?: string
): Promise<ApiResponse<T>> =>
  handleRequest<T>(
    api.patch<ApiResponse<T>>(url, data, createRequestConfig(token))
  );

export const remove = async <T>(
  url: string,
  token?: string
): Promise<ApiResponse<T>> =>
  handleRequest<T>(api.delete<ApiResponse<T>>(url, createRequestConfig(token)));
