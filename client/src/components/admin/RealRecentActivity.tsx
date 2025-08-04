"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentOrder {
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
}

interface RealRecentActivityProps {
  orders: RecentOrder[];
  loading?: boolean;
}

export function RealRecentActivity({
  orders,
  loading,
}: Readonly<RealRecentActivityProps>) {
  const t = useTranslations("admin.dashboard.sections");

  const getActivityIcon = (status: string) => {
    const icons = {
      PENDING: "⏳",
      PROCESSING: "🔄",
      SHIPPED: "🚚",
      DELIVERED: "✅",
      CANCELLED: "❌",
    };
    return icons[status as keyof typeof icons] || "📦";
  };

  const getStatusVariant = (status: string) => {
    const variants = {
      PENDING: "secondary",
      PROCESSING: "default",
      SHIPPED: "outline",
      DELIVERED: "default",
      CANCELLED: "destructive",
    } as const;
    return variants[status as keyof typeof variants] || "secondary";
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("recentActivity")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i+1} className="flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentActivity")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{getActivityIcon(order.status)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium">
                  New order #{order.orderNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.user.firstName} {order.user.lastName} • $
                  {Number(order.total).toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getStatusVariant(order.status)}
                    className="text-xs"
                  >
                    {order.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {getTimeAgo(order.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
