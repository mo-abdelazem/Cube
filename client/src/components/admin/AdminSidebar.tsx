"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: MenuItem[];
}

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { data: session } = useSession();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      title: t("navigation.dashboard"),
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("navigation.users"),
      href: "/admin/users",
      icon: Users,
      badge: "12",
    },
    {
      title: t("navigation.products"),
      href: "/admin/products",
      icon: Package,
      children: [
        {
          title: t("products.allProducts"),
          href: "/admin/products",
          icon: Package,
        },
        {
          title: t("products.addProductMenu"),
          href: "/admin/products/new",
          icon: Package,
        },
        {
          title: t("products.categories"),
          href: "/admin/products/categories",
          icon: Package,
        },
      ],
    },
    {
      title: t("navigation.orders"),
      href: "/admin/orders",
      icon: ShoppingCart,
      badge: "5",
    },
    {
      title: t("navigation.analytics"),
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: t("navigation.settings"),
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  const sidebarTranslation = isOpen
    ? "translate-x-0"
    : isRTL
    ? "translate-x-full"
    : "-translate-x-full";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-label="Close overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Sidebar"
        className={cn(
          "fixed top-0 z-50 h-full w-64 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isRTL ? "right-0 border-l" : "left-0 border-r",
          sidebarTranslation
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label={t("navigation.closeSidebar")}
            title={t("navigation.closeSidebar")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          expandedItems.includes(item.title) && "rotate-180"
                        )}
                      />
                    </button>
                    {expandedItems.includes(item.title) && (
                      <ul
                        className={cn(
                          "mt-2 space-y-1",
                          isRTL ? "mr-4" : "ml-4"
                        )}
                      >
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={`/${locale}${child.href}`}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive(child.href)
                                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                                isRTL && "flex-row-reverse"
                              )}
                            >
                              <child.icon className="w-4 h-4" />
                              <span>{child.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/${locale}${item.href}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full",
                          isRTL ? "mr-auto" : "ml-auto"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div
            className={cn(
              "flex items-center gap-3 mb-3",
              isRTL && "flex-row-reverse"
            )}
          >
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {session?.user?.name
                  ? getUserInitials(session.user.name)
                  : "AD"}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session?.user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              isRTL && "flex-row-reverse"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span>{t("navigation.signOut")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
