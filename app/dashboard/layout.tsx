// app/dashboard/layout.tsx
import { Navbar } from "@/components/custom/layout/Navbar";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
