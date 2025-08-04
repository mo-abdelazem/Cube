"use client";

import { StatsCard } from "@/components/admin/StatsCard";
import { useSalesReport, useCustomerAnalytics } from "@/hooks/useAdminData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Target,
  Globe,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function AnalyticsPage() {
  const t = useTranslations("admin.analytics");
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});

  const {
    data: salesData,
    loading: salesLoading,
    error: salesError,
  } = useSalesReport(dateRange.start, dateRange.end);
  const {
    data: customerData,
    loading: customerLoading,
    error: customerError,
  } = useCustomerAnalytics();

  if (salesError || customerError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error loading analytics
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {salesError || customerError}
          </p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t("metrics.uniqueVisitors")}
          value={
            customerLoading
              ? "..."
              : customerData?.summary.totalCustomers.toLocaleString() || "0"
          }
          change={{ value: "+8%", type: "increase" }}
          icon={Users}
        />
        <StatsCard
          title={t("metrics.avgOrderValue")}
          value={
            salesLoading
              ? "..."
              : `$${salesData?.summary.averageOrderValue.toFixed(2) || "0"}`
          }
          change={{ value: "+$12.30", type: "increase" }}
          icon={DollarSign}
        />
        <StatsCard
          title="New Customers This Month"
          value={
            customerLoading
              ? "..."
              : customerData?.summary.newCustomersThisMonth.toString() || "0"
          }
          change={{ value: "+15%", type: "increase" }}
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Revenue"
          value={
            salesLoading
              ? "..."
              : `$${salesData?.summary.totalRevenue.toLocaleString() || "0"}`
          }
          change={{ value: "+18%", type: "increase" }}
          icon={Clock}
        />
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Summary */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Summary
          </h3>
          {salesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Orders
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {salesData?.summary.totalOrders.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${salesData?.summary.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Average Order Value
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${salesData?.summary.averageOrderValue.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-3/5"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Customers
          </h3>
          {customerLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {customerData?.topCustomers.slice(0, 5).map((customer, index) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {customer.firstName.charAt(0)}
                        {customer.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.firstName} {customer.lastName}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {customer.orderCount} orders
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${customer.totalSpent.toFixed(2)}
                    </div>
                  </div>
                </div>
              )) || []}
            </div>
          )}
        </div>
      </div>

      {/* Daily Sales Chart */}
      {salesData?.dailySales && (
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Sales (Last 30 Days)
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {salesData.dailySales
              .slice(0, 30)
              .reverse()
              .map((day, index) => {
                const maxRevenue = Math.max(
                  ...salesData.dailySales.map((d) => Number(d.revenue))
                );
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 group"
                  >
                    <div className="relative w-full">
                      <div
                        className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                        style={{
                          height: `${
                            maxRevenue > 0
                              ? (Number(day.revenue) / maxRevenue) * 200
                              : 5
                          }px`,
                          minHeight: "5px",
                        }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {new Date(day.date).toLocaleDateString()}
                        <br />${Number(day.revenue).toFixed(2)}
                        <br />
                        {day.order_count} orders
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
