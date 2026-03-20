import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderType } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface Props {
  defaultType: "machineSale" | "consumable";
  onClose: () => void;
  onSaved: () => void;
}

export default function SalesOrderModal({
  defaultType,
  onClose,
  onSaved,
}: Props) {
  const { actor } = useActor();
  const [form, setForm] = useState({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    orderType: defaultType as "machineSale" | "consumable",
    itemName: "",
    quantity: "1",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      await actor.createSalesOrder(
        form.customerName,
        form.customerAddress,
        form.customerPhone,
        form.orderType === "machineSale"
          ? OrderType.machineSale
          : OrderType.consumable,
        form.itemName,
        BigInt(Number(form.quantity)),
        form.notes,
      );
      toast.success("Order created");
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const s = (field: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [field]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{
          background: "oklch(0.165 0.045 245)",
          border: "1px solid oklch(0.22 0.042 245)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="font-semibold"
            style={{ color: "oklch(0.935 0.018 245)" }}
          >
            New Sales Order
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg"
            style={{ color: "oklch(0.65 0.038 245)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="so-type"
              className="block text-xs font-medium mb-1"
              style={{ color: "oklch(0.65 0.038 245)" }}
            >
              Order Type
            </label>
            <select
              id="so-type"
              value={form.orderType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  orderType: e.target.value as "machineSale" | "consumable",
                }))
              }
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: "oklch(0.12 0.038 245)",
                border: "1px solid oklch(0.22 0.042 245)",
                color: "oklch(0.935 0.018 245)",
              }}
            >
              <option value="machineSale">Machine Sale</option>
              <option value="consumable">Consumable</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <F
              id="so-name"
              label="Customer Name"
              value={form.customerName}
              onChange={s("customerName")}
              required
            />
            <F
              id="so-phone"
              label="Phone"
              value={form.customerPhone}
              onChange={s("customerPhone")}
              required
            />
          </div>
          <F
            id="so-addr"
            label="Address"
            value={form.customerAddress}
            onChange={s("customerAddress")}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <F
              id="so-item"
              label="Item Name"
              value={form.itemName}
              onChange={s("itemName")}
              required
            />
            <F
              id="so-qty"
              label="Quantity"
              value={form.quantity}
              onChange={s("quantity")}
              required
            />
          </div>
          <F
            id="so-notes"
            label="Notes"
            value={form.notes}
            onChange={s("notes")}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm"
              style={{
                background: "oklch(0.22 0.042 245)",
                color: "oklch(0.65 0.038 245)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{
                background: "oklch(0.73 0.148 200)",
                color: "oklch(0.12 0.038 245)",
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function F({
  id,
  label,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium mb-1"
        style={{ color: "oklch(0.65 0.038 245)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{
          background: "oklch(0.12 0.038 245)",
          border: "1px solid oklch(0.22 0.042 245)",
          color: "oklch(0.935 0.018 245)",
        }}
      />
    </div>
  );
}
