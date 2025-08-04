import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  adminAPI,
  DashboardStats,
  SalesReport,
  CustomerAnalytics,
} from "@/lib/api/admin";

export function useDashboardStats() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        setError(null);
        const stats = await adminAPI.getDashboardStats(session.user.token);
        setData(stats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch dashboard stats"
        );
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.token]);

  return { data, loading, error, refetch: () => fetchData() };
}

export function useSalesReport(startDate?: Date, endDate?: Date) {
  const { data: session } = useSession();
  const [data, setData] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        setError(null);
        const report = await adminAPI.getSalesReport(
          session.user.token,
          startDate,
          endDate
        );
        setData(report);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch sales report"
        );
        console.error("Sales report error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.token, startDate, endDate]);

  return { data, loading, error };
}

export function useCustomerAnalytics() {
  const { data: session } = useSession();
  const [data, setData] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.token) return;

      try {
        setLoading(true);
        setError(null);
        const analytics = await adminAPI.getCustomerAnalytics(
          session.user.token
        );
        setData(analytics);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch customer analytics"
        );
        console.error("Customer analytics error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.token]);

  return { data, loading, error };
}
