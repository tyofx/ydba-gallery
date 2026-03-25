"use client";

import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useInventoryStore } from "@/store/inventory.store";
import type { InventoryItem } from "@/types";
import { useState, useEffect } from "react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: InventoryItem | null;
}

const CATEGORY_OPTIONS = [
  { value: "electronics", label: "Electronics" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "furniture", label: "Furniture" },
  { value: "consumables", label: "Consumables" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "electronics" as InventoryItem["category"],
  quantity: 0,
  minQuantity: 5,
  unitPrice: 0,
  supplier: "",
  location: "",
  sku: "",
};

export function ItemModal({ isOpen, onClose, editItem }: ItemModalProps) {
  const { addItem, updateItem } = useInventoryStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});

  useEffect(() => {
    if (editItem) {
      setForm({
        name: editItem.name,
        description: editItem.description ?? "",
        category: editItem.category,
        quantity: editItem.quantity,
        minQuantity: editItem.minQuantity,
        unitPrice: editItem.unitPrice,
        supplier: editItem.supplier ?? "",
        location: editItem.location ?? "",
        sku: editItem.sku,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editItem, isOpen]);

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (form.unitPrice <= 0) e.unitPrice = "Price must be > 0" as never;
    if (form.quantity < 0) e.quantity = "Qty cannot be negative" as never;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editItem) {
      updateItem(editItem.id, { ...form });
    } else {
      addItem(form);
    }
    onClose();
  };

  const field = (key: keyof typeof EMPTY_FORM) => ({
    value: String(form[key]),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({
        ...prev,
        [key]:
          key === "quantity" || key === "minQuantity" || key === "unitPrice"
            ? Number(e.target.value)
            : e.target.value,
      })),
    error: errors[key] as string | undefined,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editItem ? "Edit Item" : "Add New Item"}
      description={editItem ? `Editing: ${editItem.sku}` : "Add a new item to inventory"}
      size="lg"
    >
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Item Name *" placeholder="e.g. Dell Latitude 5540" {...field("name")} />
          <Input label="SKU *" placeholder="e.g. ELC-001ABC" {...field("sku")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value as InventoryItem["category"],
              }))
            }
          />
          <Input label="Supplier" placeholder="Supplier name" {...field("supplier")} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Quantity *" type="number" min={0} {...field("quantity")} />
          <Input label="Min. Quantity" type="number" min={0} {...field("minQuantity")} />
          <Input label="Unit Price (IDR) *" type="number" min={0} {...field("unitPrice")} />
        </div>
        <Input label="Location" placeholder="e.g. Warehouse A - Shelf 3" {...field("location")} />
        <Input label="Description" placeholder="Optional description" {...field("description")} />
      </div>

      <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {editItem ? "Save Changes" : "Add Item"}
        </Button>
      </div>
    </Modal>
  );
}
