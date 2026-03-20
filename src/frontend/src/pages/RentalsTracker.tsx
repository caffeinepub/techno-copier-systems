import { Edit2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type RentalAgreement, RentalStatus } from "../backend";
import RentalModal from "../components/modals/RentalModal";
import { useActor } from "../hooks/useActor";

interface Props {
  isAdmin: boolean;
}

const statusColors: Record<string, string> = {
  active: "oklch(0.65 0.18 145)",
  upcoming: "oklch(0.55 0.22 255)",
  expired: "oklch(0.65 0.22 30)",
};

function daysLeft(endDateNs: bigint): number {
  const end = new Date(Number(endDateNs) / 1_000_000);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function RentalsTracker({ isAdmin }: Props) {
  const { actor } = useActor();
  const [rentals, setRentals] = useState<RentalAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | RentalStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [editRental, setEditRental] = useState<RentalAgreement | null>(null);

  const load = useCallback(() => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllRentals()
      .then(setRentals)
      .finally(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filter === "all" ? rentals : rentals.filter((r) => r.status === filter);

  const handleDelete = async (id: bigint) => {
    if (!actor || !confirm("Delete this rental?")) return;
    await actor.deleteRental(id);
    toast.success("Rental deleted");
    load();
  };

  const handleStatusChange = async (id: bigint, status: RentalStatus) => {
    if (!actor) return;
    await actor.updateRentalStatus(id, status);
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
              RentalStatus.active,
              RentalStatus.upcoming,
              RentalStatus.expired,
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
                : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setEditRental(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "oklch(0.73 0.148 200)",
              color: "oklch(0.12 0.038 245)",
            }}
          >
            <Plus className="w-4 h-4" /> Add Rental
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
            No rentals found
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
                    "Machine",
                    "Serial",
                    "Start",
                    "End",
                    "Monthly Fee",
                    "Days Left",
                    "Status",
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
                {filtered.map((r) => {
                  const days = daysLeft(r.endDate);
                  return (
                    <tr
                      key={String(r.id)}
                      style={{
                        borderBottom: "1px solid oklch(0.22 0.042 245 / 0.5)",
                      }}
                    >
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        #{String(r.id)}
                      </td>
                      <td className="px-4 py-3">
                        <div style={{ color: "oklch(0.935 0.018 245)" }}>
                          {r.customerName}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "oklch(0.65 0.038 245)" }}
                        >
                          {r.customerPhone}
                        </div>
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.935 0.018 245)" }}
                      >
                        {r.machineType}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        {r.machineSerial}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        {new Date(
                          Number(r.startDate) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        {new Date(
                          Number(r.endDate) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{ color: "oklch(0.935 0.018 245)" }}
                      >
                        ₹{String(r.monthlyFee)}/mo
                      </td>
                      <td className="px-4 py-3">
                        {r.status === RentalStatus.active ? (
                          <span
                            style={{
                              color:
                                days < 7
                                  ? "oklch(0.65 0.22 30)"
                                  : days < 30
                                    ? "oklch(0.78 0.19 80)"
                                    : "oklch(0.65 0.18 145)",
                            }}
                          >
                            {days > 0 ? `${days}d` : "Expired"}
                          </span>
                        ) : (
                          <span style={{ color: "oklch(0.65 0.038 245)" }}>
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={r.status}
                          onChange={(e) =>
                            handleStatusChange(
                              r.id,
                              e.target.value as RentalStatus,
                            )
                          }
                          className="text-xs px-2 py-1 rounded-full font-medium border-none outline-none cursor-pointer"
                          style={{
                            background: `${statusColors[r.status]} / 0.15`,
                            color: statusColors[r.status],
                          }}
                        >
                          <option value={RentalStatus.active}>Active</option>
                          <option value={RentalStatus.upcoming}>
                            Upcoming
                          </option>
                          <option value={RentalStatus.expired}>Expired</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {isAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditRental(r);
                                  setShowModal(true);
                                }}
                                className="p-1.5 rounded-lg"
                                style={{ color: "oklch(0.65 0.038 245)" }}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(r.id)}
                                className="p-1.5 rounded-lg"
                                style={{ color: "oklch(0.65 0.22 30)" }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <RentalModal
          rental={editRental}
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
