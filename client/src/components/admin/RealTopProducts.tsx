"use client";

import { useTranslations, useLocale } from "next-intl";

interface Product {
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
}

interface RealTopProductsProps {
  products: Product[];
  loading?: boolean;
}

export function RealTopProducts({ products, loading }: RealTopProductsProps) {
  const t = useTranslations("admin.dashboard.sections");
  const tCommon = useTranslations("admin.common");
  const locale = useLocale();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("topProducts")}
        </h3>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getProductName = (translations: Product["translations"]) => {
    const translation =
      translations.find((t) => t.language === locale) || translations[0];
    return translation?.name || "Unknown Product";
  };

  const getProductImage = (images: Product["images"]) => {
    return images[0]?.url || "/images/no-image.webp";
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t("topProducts")}
      </h3>

      <div className="space-y-4">
        {products.slice(0, 5).map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400">
              {index + 1}
            </div>
            <img
              src={getProductImage(product.images)}
              alt={getProductName(product.translations)}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {getProductName(product.translations)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {product.totalSold} {tCommon("sales")} • {product.orderCount}{" "}
                orders
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ${Number(product.basePrice).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
