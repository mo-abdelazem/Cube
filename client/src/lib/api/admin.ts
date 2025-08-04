import { useSession } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

interface DashboardStats {
  overview: {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    lowStockProducts: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  topProducts: Array<{
    id: string;
    slug: string;
    basePrice: number;
    totalSold: number;
    orderCount: number;
    translations: Array<{
      language: string;
      name: string;
      description?: string;
    }>;
    images: Array<{
      url: string;
      alt?: string;
    }>;
  }>;
}

interface SalesReport {
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: Array<{
      product: {
        translations: Array<{
          language: string;
          name: string;
        }>;
      };
    }>;
  }>;
  dailySales: Array<{
    date: string;
    order_count: number;
    revenue: number;
  }>;
  monthlySales: Array<{
    month: string;
    order_count: number;
    revenue: number;
  }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
}

interface CustomerAnalytics {
  summary: {
    totalCustomers: number;
    newCustomersThisMonth: number;
  };
  topCustomers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    totalSpent: number;
    orderCount: number;
    createdAt: string;
  }>;
  customersByLocation: Array<{
    country: string;
    customer_count: number;
  }>;
}

class AdminAPI {
  private getAuthHeaders(token?: string) {
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getDashboardStats(token: string): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch dashboard stats: ${response.statusText}`
      );
    }

    return response.json();
  }

  async getSalesReport(
    token: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<SalesReport> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());

    const url = `${API_BASE_URL}/admin/sales-report${
      params.toString() ? `?${params}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sales report: ${response.statusText}`);
    }

    return response.json();
  }

  async getCustomerAnalytics(token: string): Promise<CustomerAnalytics> {
    const response = await fetch(`${API_BASE_URL}/admin/customers`, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch customer analytics: ${response.statusText}`
      );
    }

    return response.json();
  }
}

export const adminAPI = new AdminAPI();
export type { DashboardStats, SalesReport, CustomerAnalytics };
