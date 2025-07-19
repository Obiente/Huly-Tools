export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  version: string;
}
