"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Plus, Package, Eye, Edit } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  image: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "Electronics",
    price: 999,
    stock: 45,
    status: "active",
    createdAt: "2024-01-15",
    image: "/images/no-image.webp",
  },
  {
    id: "2",
    name: "MacBook Air M3",
    category: "Electronics",
    price: 1299,
    stock: 12,
    status: "active",
    createdAt: "2024-01-20",
    image: "/images/no-image.webp",
  },
  {
    id: "3",
    name: "Nike Air Max",
    category: "Fashion",
    price: 149,
    stock: 0,
    status: "inactive",
    createdAt: "2024-02-01",
    image: "/images/no-image.webp",
  },
];

const getStatusBadge = (status: Product["status"]) => {
  const styles = {
    active: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    inactive: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function ProductsPage() {
  const columns = [
    {
      key: "name" as keyof Product,
      label: "Product",
      sortable: true,
      render: (value: string, row: Product) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image}
            alt={value}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-gray-500 text-sm">{row.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: "price" as keyof Product,
      label: "Price",
      sortable: true,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: "stock" as keyof Product,
      label: "Stock",
      sortable: true,
      render: (value: number) => (
        <span
          className={
            value === 0
              ? "text-red-600"
              : value < 20
              ? "text-yellow-600"
              : "text-green-600"
          }
        >
          {value}
        </span>
      ),
    },
    {
      key: "status" as keyof Product,
      label: "Status",
      render: (value: Product["status"]) => getStatusBadge(value),
    },
    {
      key: "createdAt" as keyof Product,
      label: "Created",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Products Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            1,234
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Products
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-green-600">987</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Products
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-yellow-600">42</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Low Stock
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-red-600">23</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Out of Stock
          </div>
        </div>
      </div>

      {/* Products Table */}
      <DataTable
        data={products}
        columns={columns}
        searchable
        filterable
        onRowClick={(product) => console.log("Product clicked:", product)}
      />
    </div>
  );
}
