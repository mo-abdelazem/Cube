"use client";

import { useTranslations } from "next-intl";

interface ChartData {
  dailySales: Array<{
    date: string;
    order_count: number;
    revenue: number;
  }>;
}

interface RealTimeChartProps {
  data: ChartData;
  loading?: boolean;
}

export function RealTimeChart({ data, loading }: RealTimeChartProps) {
  const t = useTranslations("admin.dashboard.sections");

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("salesOverview")}
        </h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Get last 7 days of data
  const chartData = data.dailySales.slice(0, 7).reverse();
  const maxRevenue = Math.max(...chartData.map((d) => Number(d.revenue)));

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t("salesOverview")} - Last 7 Days
      </h3>

      <div className="h-64 flex items-end justify-between gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full group">
              <div
                className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
                style={{
                  height: `${
                    maxRevenue > 0
                      ? (Number(item.revenue) / maxRevenue) * 200
                      : 10
                  }px`,
                  minHeight: "10px",
                }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ${Number(item.revenue).toFixed(2)}
                <br />
                {item.order_count} orders
              </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
