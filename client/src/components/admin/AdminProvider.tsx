"use client";

import { SessionProvider } from "next-auth/react";
import { AdminAuth } from "./AdminAuth";

interface AdminProviderProps {
  children: React.ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  return (
    <SessionProvider>
      <AdminAuth>{children}</AdminAuth>
    </SessionProvider>
  );
}
