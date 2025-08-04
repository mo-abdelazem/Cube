"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { RealRecentActivity } from "@/components/admin/RealRecentActivity";
import { RealTopProducts } from "@/components/admin/RealTopProducts";
import { RealTimeChart } from "@/components/admin/RealTimeChart";
import { useDashboardStats, useSalesReport } from "@/hooks/useAdminData";
import { useTranslations } from "next-intl";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const tStats = useTranslations("admin.dashboard.stats");

  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useDashboardStats();
  const { data: salesData, loading: salesLoading } = useSalesReport();

  if (dashboardError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error loading dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{dashboardError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t("subtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={tStats("totalUsers")}
          value={
            dashboardLoading
              ? "..."
              : dashboardData?.overview.totalUsers.toLocaleString() || "0"
          }
          change={{ value: "+12%", type: "increase" }}
          icon={Users}
        />
        <StatsCard
          title={tStats("totalProducts")}
          value={
            dashboardLoading
              ? "..."
              : dashboardData?.overview.totalProducts.toLocaleString() || "0"
          }
          change={{ value: "+3%", type: "increase" }}
          icon={Package}
        />
        <StatsCard
          title={tStats("totalOrders")}
          value={
            dashboardLoading
              ? "..."
              : dashboardData?.overview.totalOrders.toLocaleString() || "0"
          }
          change={{ value: "-2%", type: "decrease" }}
          icon={ShoppingCart}
        />
        <StatsCard
          title={tStats("revenue")}
          value={
            dashboardLoading
              ? "..."
              : `$${Number(
                  dashboardData?.overview.totalRevenue || 0
                ).toLocaleString()}`
          }
          change={{ value: "+8%", type: "increase" }}
          icon={DollarSign}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart - spans 2 columns */}
        <div className="lg:col-span-2">
          <RealTimeChart
            data={{ dailySales: salesData?.dailySales || [] }}
            loading={salesLoading}
          />
        </div>

        {/* Top Products */}
        <div>
          <RealTopProducts
            products={dashboardData?.topProducts || []}
            loading={dashboardLoading}
          />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RealRecentActivity
          orders={dashboardData?.recentOrders || []}
          loading={dashboardLoading}
        />

        {/* Quick Stats */}
        <div className="space-y-4">
          <StatsCard
            title={tStats("pendingOrders")}
            value={
              dashboardLoading
                ? "..."
                : dashboardData?.overview.pendingOrders.toString() || "0"
            }
            change={{ value: "+5%", type: "increase" }}
            icon={Eye}
          />
          <StatsCard
            title={tStats("lowStock")}
            value={
              dashboardLoading
                ? "..."
                : dashboardData?.overview.lowStockProducts.toString() || "0"
            }
            change={{ value: "-2", type: "increase" }}
            icon={TrendingUp}
          />
        </div>
      </div>
    </div>
  );
}
