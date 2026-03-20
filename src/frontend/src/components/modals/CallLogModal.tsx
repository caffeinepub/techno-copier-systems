import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type CallLog, CallStatus, CallType } from "../../backend";
import { useActor } from "../../hooks/useActor";

interface Props {
  call: CallLog | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function CallLogModal({ call, onClose, onSaved }: Props) {
  const { actor } = useActor();
  const [form, setForm] = useState({
    customerName: call?.customerName ?? "",
    customerAddress: call?.customerAddress ?? "",
    customerPhone: call?.customerPhone ?? "",
    requirement: call?.requirement ?? "",
    callType: call?.callType ?? CallType.serviceEnquiry,
    notes: call?.notes ?? "",
  });
  const [statusUpdate, setStatusUpdate] = useState<CallStatus>(
    call?.status ?? CallStatus.open,
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      if (call) {
        await actor.updateCallStatus(call.id, statusUpdate);
        toast.success("Call updated");
      } else {
        await actor.createCallLog(
          form.customerName,
          form.customerAddress,
          form.customerPhone,
          form.requirement,
          form.callType,
          form.notes,
        );
        toast.success("Call logged");
      }
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
            {call ? "Update Call Log" : "New Call Log"}
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
          {call ? (
            <div>
              <label
                htmlFor="cl-status"
                className="block text-xs font-medium mb-1"
                style={{ color: "oklch(0.65 0.038 245)" }}
              >
                Status
              </label>
              <select
                id="cl-status"
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value as CallStatus)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "oklch(0.12 0.038 245)",
                  border: "1px solid oklch(0.22 0.042 245)",
                  color: "oklch(0.935 0.018 245)",
                }}
              >
                <option value={CallStatus.open}>Open</option>
                <option value={CallStatus.followUp}>Follow Up</option>
                <option value={CallStatus.closed}>Closed</option>
              </select>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <F
                  id="cl-name"
                  label="Customer Name"
                  value={form.customerName}
                  onChange={s("customerName")}
                  required
                />
                <F
                  id="cl-phone"
                  label="Phone"
                  value={form.customerPhone}
                  onChange={s("customerPhone")}
                  required
                />
              </div>
              <F
                id="cl-addr"
                label="Address"
                value={form.customerAddress}
                onChange={s("customerAddress")}
                required
              />
              <div>
                <label
                  htmlFor="cl-type"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "oklch(0.65 0.038 245)" }}
                >
                  Call Type
                </label>
                <select
                  id="cl-type"
                  value={form.callType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      callType: e.target.value as CallType,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    background: "oklch(0.12 0.038 245)",
                    border: "1px solid oklch(0.22 0.042 245)",
                    color: "oklch(0.935 0.018 245)",
                  }}
                >
                  <option value={CallType.serviceEnquiry}>
                    Service Enquiry
                  </option>
                  <option value={CallType.salesEnquiry}>Sales Enquiry</option>
                  <option value={CallType.general}>General</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="cl-req"
                  className="block text-xs font-medium mb-1"
                  style={{ color: "oklch(0.65 0.038 245)" }}
                >
                  Requirement
                </label>
                <textarea
                  id="cl-req"
                  value={form.requirement}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, requirement: e.target.value }))
                  }
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={{
                    background: "oklch(0.12 0.038 245)",
                    border: "1px solid oklch(0.22 0.042 245)",
                    color: "oklch(0.935 0.018 245)",
                  }}
                />
              </div>
              <F
                id="cl-notes"
                label="Notes"
                value={form.notes}
                onChange={s("notes")}
              />
            </>
          )}
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
