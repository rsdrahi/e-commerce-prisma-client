const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}

export const api = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 — token expired or invalid
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if we're on a protected page, not on login/register
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }

    // Try to parse JSON; some error responses may not be JSON
    let data: ApiResponse<T>;
    try {
      data = await response.json();
    } catch {
      return {
        success: false,
        message: "Server returned an unexpected response",
        data: null as T,
      };
    }

    return data;
  } catch (error) {
    // Network error — backend is down or unreachable
    return {
      success: false,
      message: "Unable to connect to the server. Please try again later.",
      data: null as T,
    };
  }
};
