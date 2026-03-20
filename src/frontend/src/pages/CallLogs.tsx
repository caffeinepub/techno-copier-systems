import { Edit2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type CallLog, CallStatus, CallType } from "../backend";
import CallLogModal from "../components/modals/CallLogModal";
import { useActor } from "../hooks/useActor";

interface Props {
  isAdmin: boolean;
}

const statusColors: Record<string, string> = {
  open: "oklch(0.65 0.22 30)",
  followUp: "oklch(0.78 0.19 80)",
  closed: "oklch(0.65 0.18 145)",
};
const typeColors: Record<string, string> = {
  serviceEnquiry: "oklch(0.78 0.19 80)",
  salesEnquiry: "oklch(0.55 0.22 255)",
  general: "oklch(0.65 0.038 245)",
};
const typeLabels: Record<string, string> = {
  serviceEnquiry: "Service",
  salesEnquiry: "Sales",
  general: "General",
};

export default function CallLogs({ isAdmin }: Props) {
  const { actor } = useActor();
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | CallStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [editCall, setEditCall] = useState<CallLog | null>(null);

  const load = useCallback(() => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllCallLogs()
      .then(setCalls)
      .finally(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filter === "all" ? calls : calls.filter((c) => c.status === filter);

  const handleDelete = async (id: bigint) => {
    if (!actor || !confirm("Delete this call log?")) return;
    await actor.deleteCallLog(id);
    toast.success("Call log deleted");
    load();
  };

  const handleStatusChange = async (id: bigint, status: CallStatus) => {
    if (!actor) return;
    await actor.updateCallStatus(id, status);
    toast.success("Status updated");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {(
            [
              "all",
              CallStatus.open,
              CallStatus.followUp,
              CallStatus.closed,
            ] as const
          ).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{
                background:
                  filter === key
                    ? "oklch(0.73 0.148 200)"
                    : "oklch(0.165 0.045 245)",
                color:
                  filter === key
                    ? "oklch(0.12 0.038 245)"
                    : "oklch(0.65 0.038 245)",
                border: "1px solid oklch(0.22 0.042 245)",
              }}
            >
              {key === "all"
                ? "All"
                : key === "followUp"
                  ? "Follow Up"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setEditCall(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "oklch(0.73 0.148 200)",
              color: "oklch(0.12 0.038 245)",
            }}
          >
            <Plus className="w-4 h-4" /> Add Call Log
          </button>
        )}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "oklch(0.165 0.045 245)",
          border: "1px solid oklch(0.22 0.042 245)",
        }}
      >
        {loading ? (
          <div
            className="p-8 text-center"
            style={{ color: "oklch(0.65 0.038 245)" }}
          >
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="p-8 text-center"
            style={{ color: "oklch(0.65 0.038 245)" }}
          >
            No call logs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid oklch(0.22 0.042 245)",
                    background: "oklch(0.14 0.04 245)",
                  }}
                >
                  {[
                    "#",
                    "Customer",
                    "Phone",
                    "Address",
                    "Requirement",
                    "Type",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={String(c.id)}
                    style={{
                      borderBottom: "1px solid oklch(0.22 0.042 245 / 0.5)",
                    }}
                  >
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      #{String(c.id)}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.935 0.018 245)" }}
                    >
                      {c.customerName}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {c.customerPhone}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {c.customerAddress}
                    </td>
                    <td className="px-4 py-3 max-w-40">
                      <span
                        className="truncate block"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        {c.requirement}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          background: `${typeColors[c.callType]} / 0.15`,
                          color: typeColors[c.callType],
                        }}
                      >
                        {typeLabels[c.callType]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusChange(c.id, e.target.value as CallStatus)
                        }
                        className="text-xs px-2 py-1 rounded-full font-medium border-none outline-none cursor-pointer"
                        style={{
                          background: `${statusColors[c.status]} / 0.15`,
                          color: statusColors[c.status],
                        }}
                      >
                        <option value={CallStatus.open}>Open</option>
                        <option value={CallStatus.followUp}>Follow Up</option>
                        <option value={CallStatus.closed}>Closed</option>
                      </select>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {new Date(
                        Number(c.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditCall(c);
                            setShowModal(true);
                          }}
                          className="p-1.5 rounded-lg"
                          style={{ color: "oklch(0.65 0.038 245)" }}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg"
                            style={{ color: "oklch(0.65 0.22 30)" }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <CallLogModal
          call={editCall}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}
