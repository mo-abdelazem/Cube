"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Plus, UserCheck, UserX, Crown } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "banned";
  createdAt: string;
  lastLogin: string;
}

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-08-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-08-03",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "moderator",
    status: "inactive",
    createdAt: "2024-02-01",
    lastLogin: "2024-07-15",
  },
];

const getRoleIcon = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return <Crown className="w-4 h-4 text-yellow-500" />;
    case "moderator":
      return <UserCheck className="w-4 h-4 text-blue-500" />;
    default:
      return <UserCheck className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: User["status"]) => {
  const styles = {
    active: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    inactive:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    banned: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default function UsersPage() {
  const columns = [
    {
      key: "name" as keyof User,
      label: "Name",
      sortable: true,
      render: (value: string, row: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {value.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-gray-500 text-sm">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role" as keyof User,
      label: "Role",
      render: (value: User["role"]) => (
        <div className="flex items-center gap-2">
          {getRoleIcon(value)}
          <span className="capitalize">{value}</span>
        </div>
      ),
    },
    {
      key: "status" as keyof User,
      label: "Status",
      render: (value: User["status"]) => getStatusBadge(value),
    },
    {
      key: "createdAt" as keyof User,
      label: "Created",
      sortable: true,
    },
    {
      key: "lastLogin" as keyof User,
      label: "Last Login",
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your platform users and their permissions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            2,543
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Users
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-green-600">2,401</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Active Users
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-yellow-600">128</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Inactive Users
          </div>
        </div>
        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="text-2xl font-bold text-red-600">14</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Banned Users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        data={users}
        columns={columns}
        searchable
        filterable
        onRowClick={(user) => console.log("User clicked:", user)}
      />
    </div>
  );
}
