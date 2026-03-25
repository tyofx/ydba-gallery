"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { ItemModal } from "@/components/inventory/ItemModal";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useInventoryStore } from "@/store/inventory.store";
import { formatCurrency } from "@/lib/utils";
import type { InventoryItem } from "@/types";
import { Plus, Download, Package, AlertTriangle } from "lucide-react";

export default function AdminInventoryPage() {
  const { items, deleteItem } = useInventoryStore();
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const totalValue = items.reduce((s, i) => s + i.totalValue, 0);
  const lowStock = items.filter((i) => i.status === "low_stock").length;
  const outOfStock = items.filter((i) => i.status === "out_of_stock").length;

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setItemModalOpen(true);
  };

  const handleCloseModal = () => {
    setItemModalOpen(false);
    setEditItem(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Inventory
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {items.length} items · Total value:{" "}
              <span className="font-medium text-slate-700">
                {formatCurrency(totalValue)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Export
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setItemModalOpen(true)}
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Alert banner */}
        {(lowStock > 0 || outOfStock > 0) && (
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800">
              {outOfStock > 0 && (
                <span className="font-medium">{outOfStock} out of stock</span>
              )}
              {outOfStock > 0 && lowStock > 0 && " · "}
              {lowStock > 0 && (
                <span className="font-medium">{lowStock} low stock</span>
              )}
              <span className="text-amber-600"> — consider restocking soon</span>
            </p>
          </div>
        )}

        {/* Filters */}
        <InventoryFilters />

        {/* Table */}
        <InventoryTable onEdit={handleEdit} onDelete={setDeleteTarget} />
      </div>

      {/* Add / Edit Modal */}
      <ItemModal
        isOpen={itemModalOpen}
        onClose={handleCloseModal}
        editItem={editItem}
      />

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Item"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        size="sm"
      >
        <div className="flex items-center justify-end gap-2 px-6 py-4">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleteTarget) {
                deleteItem(deleteTarget.id);
                setDeleteTarget(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
