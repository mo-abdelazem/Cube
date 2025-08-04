"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
  createdAt: string;
  shippingAddress: string;
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    total: 299.99,
    status: "pending",
    items: 2,
    createdAt: "2024-08-03",
    shippingAddress: "123 Main St, New York, NY 10001",
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    total: 149.99,
    status: "processing",
    items: 1,
    createdAt: "2024-08-02",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
  },
  {
    id: "ORD-003",
    customerName: "Bob Johnson",
    customerEmail: "bob@example.com",
    total: 599.99,
    status: "shipped",
    items: 3,
    createdAt: "2024-08-01",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
  },
  {
    id: "ORD-004",
    customerName: "Alice Brown",
    customerEmail: "alice@example.com",
    total: 99.99,
    status: "delivered",
    items: 1,
    createdAt: "2024-07-30",
    shippingAddress: "321 Cedar Rd, Miami, FL 33101",
  },
];

const getStatusBadge = (status: Order["status"]) => {
  const styles = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    shipped:
      "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    delivered:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };

  const icons = {
    pending: <Package className="w-3 h-3" />,
    processing: <Package className="w-3 h-3" />,
    shipped: <Truck className="w-3 h-3" />,
    delivered: <CheckCircle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const columns = [
    {
      key: "id" as keyof Order,
      label: "Order ID",
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      ),
    },
    {
      key: "customerName" as keyof Order,
      label: "Customer",
      sortable: true,
      render: (value: string, row: Order) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-gray-500 text-sm">{row.customerEmail}</div>
        </div>
      ),
    },
    {
      key: "total" as keyof Order,
      label: "Total",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">${value.toFixed(2)}</span>
      ),
    },
    {
      key: "items" as keyof Order,
      label: "Items",
      render: (value: number) => `${value} item${value !== 1 ? "s" : ""}`,
    },
    {
      key: "status" as keyof Order,
      label: "Status",
      render: (value: Order["status"]) => getStatusBadge(value),
    },
    {
      key: "createdAt" as keyof Order,
      label: "Date",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage customer orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            987
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Orders
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-yellow-600">45</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Pending
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-blue-600">123</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Processing
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-purple-600">67</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Shipped
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-green-600">752</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Delivered
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        data={orders}
        columns={columns}
        searchable
        filterable
        onRowClick={(order) => setSelectedOrder(order)}
      />

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details - ${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Customer Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedOrder.customerName}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedOrder.customerEmail}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {selectedOrder.shippingAddress}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Order Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Order ID:</span>{" "}
                    {selectedOrder.id}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {selectedOrder.createdAt}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>{" "}
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div>
                    <span className="font-medium">Total:</span> $
                    {selectedOrder.total.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Order Items
              </h4>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedOrder.items} item
                  {selectedOrder.items !== 1 ? "s" : ""} in this order
                </p>
                {/* You can expand this to show actual items */}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Update Status
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Print Invoice
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Send Email
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
