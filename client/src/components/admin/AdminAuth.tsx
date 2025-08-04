"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface AdminAuthProps {
  readonly children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const { data: session, status } = useSession();
  const t = useTranslations("admin.common");

  useEffect(() => {
    if (status === "loading") return;

    if (process.env.NODE_ENV === "development") {
      console.log("AdminAuth Debug:", {
        status,
        session,
        userRole: session?.user?.role,
      });
    }

    if (!session) {
      redirect("/login");
      return;
    }

    if (session.user?.role !== "ADMIN") {
      redirect("/");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
