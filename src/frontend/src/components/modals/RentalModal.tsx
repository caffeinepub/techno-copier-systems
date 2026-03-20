import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { RentalAgreement } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface Props {
  rental: RentalAgreement | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function RentalModal({ rental, onClose, onSaved }: Props) {
  const { actor } = useActor();
  const toDateStr = (ns: bigint) =>
    new Date(Number(ns) / 1_000_000).toISOString().split("T")[0];
  const [form, setForm] = useState({
    customerName: rental?.customerName ?? "",
    customerAddress: rental?.customerAddress ?? "",
    customerPhone: rental?.customerPhone ?? "",
    machineType: rental?.machineType ?? "",
    machineSerial: rental?.machineSerial ?? "",
    startDate: rental ? toDateStr(rental.startDate) : "",
    endDate: rental ? toDateStr(rental.endDate) : "",
    monthlyFee: rental ? String(rental.monthlyFee) : "",
    notes: rental?.notes ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const startNs =
        BigInt(new Date(form.startDate).getTime()) * BigInt(1_000_000);
      const endNs =
        BigInt(new Date(form.endDate).getTime()) * BigInt(1_000_000);
      await actor.createRental(
        form.customerName,
        form.customerAddress,
        form.customerPhone,
        form.machineType,
        form.machineSerial,
        startNs,
        endNs,
        BigInt(Number(form.monthlyFee)),
        form.notes,
      );
      toast.success("Rental created");
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
            {rental ? "Edit Rental" : "New Rental Agreement"}
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
          <div className="grid grid-cols-2 gap-4">
            <F
              id="r-name"
              label="Customer Name"
              value={form.customerName}
              onChange={s("customerName")}
              required
            />
            <F
              id="r-phone"
              label="Phone"
              value={form.customerPhone}
              onChange={s("customerPhone")}
              required
            />
          </div>
          <F
            id="r-addr"
            label="Address"
            value={form.customerAddress}
            onChange={s("customerAddress")}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <F
              id="r-machine"
              label="Machine Type"
              value={form.machineType}
              onChange={s("machineType")}
              required
            />
            <F
              id="r-serial"
              label="Machine Serial"
              value={form.machineSerial}
              onChange={s("machineSerial")}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FDate
              id="r-start"
              label="Start Date"
              value={form.startDate}
              onChange={s("startDate")}
              required
            />
            <FDate
              id="r-end"
              label="End Date"
              value={form.endDate}
              onChange={s("endDate")}
              required
            />
          </div>
          <F
            id="r-fee"
            label="Monthly Fee"
            value={form.monthlyFee}
            onChange={s("monthlyFee")}
            required
          />
          <F
            id="r-notes"
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
function FDate({
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
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{
          background: "oklch(0.12 0.038 245)",
          border: "1px solid oklch(0.22 0.042 245)",
          color: "oklch(0.935 0.018 245)",
          colorScheme: "dark",
        }}
      />
    </div>
  );
}
