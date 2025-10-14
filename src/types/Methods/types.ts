export interface ApiResponse<T> {
  Code: string;
  Message: string;
  Data?: T;
}
