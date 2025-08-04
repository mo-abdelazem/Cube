import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "text-sm mt-2 flex items-center gap-1",
                change.type === "increase"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              <span>{change.type === "increase" ? "↑" : "↓"}</span>
              {change.value}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );
}
