"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { ExportExcelButton } from "@/components/ui/ExportButton";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

// Dummy data sementara
const MOCK_UMKM = [
  {
    id: "U001",
    name: "Warung Bu Tejo",
    owner: "Ibu Tejo",
    category: "Food & Beverage",
    city: "Jakarta",
    joinDate: "2023-10-12",
  },
  {
    id: "U002",
    name: "Kerajinan Rotan Makmur",
    owner: "Pak Hadi",
    category: "Handicraft",
    city: "Cirebon",
    joinDate: "2024-01-05",
  },
  {
    id: "U003",
    name: "Toko Kelontong Berkah",
    owner: "Siti Aminah",
    category: "Retail",
    city: "Bandung",
    joinDate: "2024-02-20",
  },
];

export default function AdminUMKMPage() {
  const [umkms, setUmkms] = useState(MOCK_UMKM);

  const columns = [
    {
      key: "id",
      label: "UMKM ID",
      className: "font-mono text-xs text-slate-500 w-24",
    },
    {
      key: "name",
      label: "Business Name",
      render: (_: unknown, row: any) => (
        <div>
          <p className="font-medium text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-400">Owner: {row.owner}</p>
        </div>
      ),
    },
    { key: "category", label: "Category", className: "text-slate-600" },
    {
      key: "city",
      label: "Location",
      render: (val: unknown) => (
        <span className="flex items-center gap-1 text-slate-600 text-sm">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {String(val)}
        </span>
      ),
    },
    {
      key: "joinDate",
      label: "Join Date",
      className: "text-slate-500 text-sm",
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
              Data UMKM
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage Micro, Small & Medium Enterprises partners
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportExcelButton
              data={umkms}
              filename="Data_Mitra_UMKM"
              sheetName="UMKM"
              label="Export"
              className="h-8 px-3 text-xs shadow-sm"
            />
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add UMKM
            </Button>
          </div>
        </div>

        {/* Tabel Data UMKM */}
        <Table columns={columns as never} data={umkms} keyField="id" />
      </div>
    </DashboardLayout>
  );
}
