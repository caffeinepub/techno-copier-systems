import { Edit2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type ServiceJob, ServiceJobStatus } from "../backend";
import ServiceJobModal from "../components/modals/ServiceJobModal";
import { useActor } from "../hooks/useActor";

interface Props {
  isAdmin: boolean;
}

const statusColors: Record<string, string> = {
  inTransit: "oklch(0.73 0.148 200)",
  inProgress: "oklch(0.55 0.22 255)",
  done: "oklch(0.65 0.18 145)",
  delayed: "oklch(0.65 0.22 30)",
};

export default function ServiceTracker({ isAdmin }: Props) {
  const { actor } = useActor();
  const [jobs, setJobs] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ServiceJobStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [editJob, setEditJob] = useState<ServiceJob | null>(null);

  const load = useCallback(() => {
    if (!actor) return;
    setLoading(true);
    actor
      .getAllServiceJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const handleDelete = async (id: bigint) => {
    if (!actor || !confirm("Delete this service job?")) return;
    await actor.deleteServiceJob(id);
    toast.success("Service job deleted");
    load();
  };

  const handleStatusChange = async (id: bigint, status: ServiceJobStatus) => {
    if (!actor) return;
    await actor.updateServiceJob(id, status);
    toast.success("Status updated");
    load();
  };

  const filterBtns: Array<{ key: "all" | ServiceJobStatus; label: string }> = [
    { key: "all", label: "All" },
    { key: ServiceJobStatus.inTransit, label: "In Transit" },
    { key: ServiceJobStatus.inProgress, label: "In Progress" },
    { key: ServiceJobStatus.done, label: "Done" },
    { key: ServiceJobStatus.delayed, label: "Delayed" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {filterBtns.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
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
              {label}
            </button>
          ))}
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setEditJob(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{
              background: "oklch(0.73 0.148 200)",
              color: "oklch(0.12 0.038 245)",
            }}
          >
            <Plus className="w-4 h-4" /> Add Service Job
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
            No service jobs found
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
                    "Machine",
                    "Issue",
                    "Assigned To",
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
                {filtered.map((job) => (
                  <tr
                    key={String(job.id)}
                    style={{
                      borderBottom: "1px solid oklch(0.22 0.042 245 / 0.5)",
                    }}
                  >
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      #{String(job.id)}
                    </td>
                    <td className="px-4 py-3">
                      <div style={{ color: "oklch(0.935 0.018 245)" }}>
                        {job.customerName}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        {job.customerAddress}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {job.customerPhone}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.935 0.018 245)" }}
                    >
                      {job.machineType}
                    </td>
                    <td className="px-4 py-3 max-w-40">
                      <span
                        className="truncate block"
                        style={{ color: "oklch(0.65 0.038 245)" }}
                      >
                        {job.issueDescription}
                      </span>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {job.assignedTo}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleStatusChange(
                            job.id,
                            e.target.value as ServiceJobStatus,
                          )
                        }
                        className="text-xs px-2 py-1 rounded-full font-medium border-none outline-none cursor-pointer"
                        style={{
                          background: `${statusColors[job.status]} / 0.15`,
                          color: statusColors[job.status],
                        }}
                      >
                        <option value={ServiceJobStatus.inTransit}>
                          In Transit
                        </option>
                        <option value={ServiceJobStatus.inProgress}>
                          In Progress
                        </option>
                        <option value={ServiceJobStatus.done}>Done</option>
                        <option value={ServiceJobStatus.delayed}>
                          Delayed
                        </option>
                      </select>
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {new Date(
                        Number(job.createdAt) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditJob(job);
                                setShowModal(true);
                              }}
                              className="p-1.5 rounded-lg"
                              style={{ color: "oklch(0.65 0.038 245)" }}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(job.id)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ServiceJobModal
          job={editJob}
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
