"use client";

import { Menu, Bell, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface AdminHeaderProps {
  readonly onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const t = useTranslations("admin.common");
  const { data: session } = useSession();

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label={t("toggle_menu")}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("search")}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <button
            className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={t("notifications")}
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {session?.user?.name ? getUserInitials(session.user.name) : "AD"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
