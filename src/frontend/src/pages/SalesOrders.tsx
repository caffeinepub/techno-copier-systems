import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderType, type SalesOrder } from "../backend";
import SalesOrderModal from "../components/modals/SalesOrderModal";
import { useActor } from "../hooks/useActor";

interface Props {
  isAdmin: boolean;
}

export default function SalesOrders({ isAdmin }: Props) {
  const { actor } = useActor();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"machineSale" | "consumable">("machineSale");
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(() => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllSalesOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = orders.filter((o) => o.orderType === tab);

  const handleDelete = async (id: bigint) => {
    if (!actor || !confirm("Delete this order?")) return;
    await actor.deleteSalesOrder(id);
    toast.success("Order deleted");
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{
            background: "oklch(0.165 0.045 245)",
            border: "1px solid oklch(0.22 0.042 245)",
          }}
        >
          {(
            [
              { key: "machineSale", label: "Machine Sales" },
              { key: "consumable", label: "Consumables" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background:
                  tab === key ? "oklch(0.73 0.148 200)" : "transparent",
                color:
                  tab === key
                    ? "oklch(0.12 0.038 245)"
                    : "oklch(0.65 0.038 245)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "oklch(0.73 0.148 200)",
              color: "oklch(0.12 0.038 245)",
            }}
          >
            <Plus className="w-4 h-4" /> Add Order
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
            No orders found
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
                    "Item",
                    "Qty",
                    "Date",
                    "Notes",
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
                {filtered.map((o) => (
                  <tr
                    key={String(o.id)}
                    style={{
                      borderBottom: "1px solid oklch(0.22 0.042 245 / 0.5)",
                    }}
                  >
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      #{String(o.id)}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.935 0.018 245)" }}
                    >
                      {o.customerName}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {o.customerPhone}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {o.customerAddress}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.935 0.018 245)" }}
                    >
                      {o.itemName}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {String(o.quantity)}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {new Date(
                        Number(o.orderDate) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 max-w-32">
                      <span
                        className="truncate block"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        {o.notes}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(o.id)}
                          className="p-1.5 rounded-lg"
                          style={{ color: "oklch(0.65 0.22 30)" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <SalesOrderModal
          defaultType={tab}
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
