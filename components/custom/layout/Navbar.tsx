"use client";

import { LogOut, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { getRoleName } from "@/types/user";

export function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      // Logout only, no navigation
      await logout();
    } else {
      // Navigate to login
      router.push("/login");
    }
  };

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Guest";

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "G";

  const userRole = user ? getRoleName(user.user_role) : "Guest";

  return (
    <nav className="border-b border-gray-700 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left side - User Info */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {initials}
              </span>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-white">{userRole}</p>
              <p className="text-xs text-gray-400">{displayName}</p>
            </div>
          </div>

          {/* Right side - Auth Status */}
          <button
            onClick={handleAuthClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white transition-colors"
          >
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium">Logout</span>
                <LogOut className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="text-sm font-medium">Login</span>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
