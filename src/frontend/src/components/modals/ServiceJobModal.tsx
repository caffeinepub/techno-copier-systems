import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ServiceJob } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface Props {
  job: ServiceJob | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ServiceJobModal({ job, onClose, onSaved }: Props) {
  const { actor } = useActor();
  const [form, setForm] = useState({
    customerName: job?.customerName ?? "",
    customerAddress: job?.customerAddress ?? "",
    customerPhone: job?.customerPhone ?? "",
    machineType: job?.machineType ?? "",
    issueDescription: job?.issueDescription ?? "",
    assignedTo: job?.assignedTo ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      await actor.createServiceJob(
        form.customerName,
        form.customerAddress,
        form.customerPhone,
        form.machineType,
        form.issueDescription,
        form.assignedTo,
      );
      toast.success("Service job created");
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

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
            {job ? "Edit Service Job" : "New Service Job"}
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
              id="sj-name"
              label="Customer Name"
              value={form.customerName}
              onChange={(v) => setForm((f) => ({ ...f, customerName: v }))}
              required
            />
            <F
              id="sj-phone"
              label="Phone"
              value={form.customerPhone}
              onChange={(v) => setForm((f) => ({ ...f, customerPhone: v }))}
              required
            />
          </div>
          <F
            id="sj-addr"
            label="Address"
            value={form.customerAddress}
            onChange={(v) => setForm((f) => ({ ...f, customerAddress: v }))}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <F
              id="sj-machine"
              label="Machine Type"
              value={form.machineType}
              onChange={(v) => setForm((f) => ({ ...f, machineType: v }))}
              required
            />
            <F
              id="sj-assigned"
              label="Assigned To"
              value={form.assignedTo}
              onChange={(v) => setForm((f) => ({ ...f, assignedTo: v }))}
            />
          </div>
          <div>
            <label
              htmlFor="sj-issue"
              className="block text-xs font-medium mb-1"
              style={{ color: "oklch(0.65 0.038 245)" }}
            >
              Issue Description
            </label>
            <textarea
              id="sj-issue"
              value={form.issueDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, issueDescription: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
              style={{
                background: "oklch(0.12 0.038 245)",
                border: "1px solid oklch(0.22 0.042 245)",
                color: "oklch(0.935 0.018 245)",
              }}
              required
            />
          </div>
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
