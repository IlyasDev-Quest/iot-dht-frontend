import api from "@/lib/api";
import { UserResponse } from "@/types/user";

export const getCurrentUser = async (): Promise<UserResponse> => {
  try {
    const response = await api.get("/v1/users/me");
    return { success: true, user: response.data };
  } catch (error: any) {
    if (error.response?.status === 401) {
      return { success: false, error: "Not authenticated" };
    }
    return { success: false, error: "Failed to fetch user" };
  }
};
