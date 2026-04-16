"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/Badge";
import { ExportExcelButton } from "@/components/ui/ExportButton";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Dummy data sementara
const MOCK_CUSTOMERS = [
  {
    id: "C001",
    name: "PT Sejahtera Abadi",
    email: "contact@sejahtera.co.id",
    phone: "081234567890",
    status: "active",
  },
  {
    id: "C002",
    name: "Budi Santoso",
    email: "budi.s@gmail.com",
    phone: "085678901234",
    status: "active",
  },
  {
    id: "C003",
    name: "CV Maju Bersama",
    email: "info@majubersama.com",
    phone: "089012345678",
    status: "inactive",
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);

  const columns = [
    {
      key: "id",
      label: "Customer ID",
      className: "font-mono text-xs text-slate-500 w-32",
    },
    {
      key: "name",
      label: "Customer Name",
      className: "font-medium text-slate-900",
    },
    { key: "email", label: "Email", className: "text-slate-600" },
    { key: "phone", label: "Phone Number", className: "text-slate-600" },
    {
      key: "status",
      label: "Status",
      render: (val: unknown) => (
        <StatusBadge status={val === "active" ? "in_stock" : "out_of_stock"} />
      ), // Meminjam warna badge dari inventory
    },
    {
      key: "actions",
      label: "",
      className: "w-20",
      render: () => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Customers
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your customer database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportExcelButton
              data={customers}
              filename="Data_Customer"
              sheetName="Customers"
              label="Export"
              className="h-8 px-3 text-xs shadow-sm"
            />
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Customer
            </Button>
          </div>
        </div>

        {/* Tabel Data Customer */}
        <Table columns={columns as never} data={customers} keyField="id" />
      </div>
    </DashboardLayout>
  );
}
