import { useTranslations } from "next-intl";

export function Chart() {
  const t = useTranslations("admin.dashboard.sections");

  const data = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t("salesOverview")}
      </h3>

      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-blue-500 rounded-t-md transition-all duration-300 hover:bg-blue-600"
              style={{
                height: `${(item.value / maxValue) * 200}px`,
                minHeight: "10px",
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
