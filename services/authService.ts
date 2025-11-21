import api from "@/lib/api";
import { AuthResponse, Credentials } from "@/types/auth";

export const login = async (
  credentials: Credentials
): Promise<AuthResponse> => {
  try {
    await api.post("/v1/auth/session", credentials);
    return { success: true };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { success: false, error: "Invalid credentials" };
    }
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
};

export const logout = async (): Promise<AuthResponse> => {
  try {
    await api.delete("/v1/auth/session");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
