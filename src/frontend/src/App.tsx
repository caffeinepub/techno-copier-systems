import {
  Bell,
  Edit2,
  LayoutDashboard,
  LogOut,
  Package,
  Phone,
  Plus,
  Printer,
  Search,
  ShoppingCart,
  Trash2,
  TrendingUp,
  Wrench,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  type CallLog,
  CallStatus,
  CallType,
  type DashboardStats,
  OrderType,
  type RentalAgreement,
  RentalStatus,
  type SalesOrder,
  type ServiceJob,
  ServiceJobStatus,
} from "./backend";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Page = "dashboard" | "service" | "rentals" | "sales" | "calls";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const BG_BASE = "oklch(0.12 0.038 245)";
const BG_CARD = "oklch(0.165 0.045 245)";
const BG_HEADER = "oklch(0.108 0.038 245)";
const BORDER = "1px solid oklch(0.22 0.042 245)";
const TEXT_PRIMARY = "oklch(0.935 0.018 245)";
const TEXT_MUTED = "oklch(0.65 0.038 245)";
const ACCENT = "oklch(0.73 0.148 200)";
const ACCENT_DARK = "oklch(0.12 0.038 245)";

function FieldInput({
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
        style={{ color: TEXT_MUTED }}
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
        style={{ background: BG_BASE, border: BORDER, color: TEXT_PRIMARY }}
      />
    </div>
  );
}

function FieldDate({
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
        style={{ color: TEXT_MUTED }}
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
          background: BG_BASE,
          border: BORDER,
          color: TEXT_PRIMARY,
          colorScheme: "dark",
        }}
      />
    </div>
  );
}

function ModalWrapper({
  children,
  onClose,
}: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      // biome-ignore lint/a11y/useSemanticElements: custom modal overlay
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ background: BG_CARD, border: BORDER }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  onClose,
}: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-semibold" style={{ color: TEXT_PRIMARY }}>
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-lg"
        style={{ color: TEXT_MUTED }}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function ModalFooter({
  onClose,
  saving,
}: { onClose: () => void; saving: boolean }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-lg text-sm"
        style={{ background: "oklch(0.22 0.042 245)", color: TEXT_MUTED }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
        style={{ background: ACCENT, color: ACCENT_DARK }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function Login() {
  const { login, isLoggingIn } = useInternetIdentity();
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: BG_BASE }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ background: BG_CARD, border: BORDER }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: ACCENT }}
          >
            <Printer className="w-8 h-8" style={{ color: ACCENT_DARK }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: TEXT_PRIMARY }}>
            TECHNO COPIER
          </h1>
          <p className="text-sm mt-1" style={{ color: TEXT_MUTED }}>
            SYSTEMS
          </p>
          <p className="text-sm mt-4" style={{ color: TEXT_MUTED }}>
            Sign in to access the management portal
          </p>
        </div>
        <button
          type="button"
          onClick={login}
          disabled={isLoggingIn}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
          style={{ background: ACCENT, color: ACCENT_DARK }}
        >
          {isLoggingIn ? "Connecting..." : "Sign In with Internet Identity"}
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "service", label: "Service", icon: Wrench },
  { id: "rentals", label: "Rentals", icon: Package },
  { id: "sales", label: "Sales & Orders", icon: ShoppingCart },
  { id: "calls", label: "Calls & Enquiries", icon: Phone },
];

function Sidebar({
  currentPage,
  onNavigate,
  isAdmin,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}) {
  const { clear } = useInternetIdentity();
  return (
    <aside
      className="w-64 flex flex-col shrink-0 h-full"
      style={{ background: BG_HEADER, borderRight: BORDER }}
    >
      <div className="p-5" style={{ borderBottom: BORDER }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: ACCENT }}
          >
            <Printer className="w-5 h-5" style={{ color: ACCENT_DARK }} />
          </div>
          <div>
            <p
              className="font-bold text-sm leading-tight"
              style={{ color: TEXT_PRIMARY }}
            >
              TECHNO COPIER
            </p>
            <p className="text-xs" style={{ color: TEXT_MUTED }}>
              SYSTEMS
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 py-3">
        <span
          className="text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background: isAdmin
              ? "oklch(0.73 0.148 200 / 0.15)"
              : "oklch(0.65 0.038 245 / 0.15)",
            color: isAdmin ? ACCENT : TEXT_MUTED,
          }}
        >
          {isAdmin ? "Admin" : "Staff"}
        </span>
      </div>
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
              style={{
                background: active ? ACCENT : "transparent",
                color: active ? ACCENT_DARK : TEXT_MUTED,
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="p-3" style={{ borderTop: BORDER }}>
        <button
          type="button"
          onClick={clear}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: TEXT_MUTED }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  service: "Service Tracker",
  rentals: "Rentals Tracker",
  sales: "Sales & Consumables",
  calls: "Calls & Enquiries",
};

function Layout({
  children,
  currentPage,
  onNavigate,
  isAdmin,
}: {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: BG_BASE }}
    >
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isAdmin={isAdmin}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: BORDER, background: BG_HEADER }}
        >
          <h1 className="text-xl font-semibold" style={{ color: TEXT_PRIMARY }}>
            {pageTitles[currentPage]}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: TEXT_MUTED }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-full text-sm outline-none"
                style={{
                  background: BG_CARD,
                  border: BORDER,
                  color: TEXT_PRIMARY,
                  width: 200,
                }}
              />
            </div>
            <button
              type="button"
              className="relative p-2 rounded-full"
              style={{ background: BG_CARD }}
            >
              <Bell className="w-5 h-5" style={{ color: TEXT_MUTED }} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: ACCENT }}
              />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: ACCENT, color: ACCENT_DARK }}
            >
              {isAdmin ? "A" : "S"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const dashStatusColors: Record<string, string> = {
  inTransit: ACCENT,
  inProgress: "oklch(0.55 0.22 255)",
  done: "oklch(0.65 0.18 145)",
  delayed: "oklch(0.65 0.22 30)",
  open: "oklch(0.65 0.22 30)",
  followUp: "oklch(0.78 0.19 80)",
  closed: "oklch(0.65 0.18 145)",
};
const dashStatusLabels: Record<string, string> = {
  inTransit: "In Transit",
  inProgress: "In Progress",
  done: "Done",
  delayed: "Delayed",
  open: "Open",
  followUp: "Follow Up",
  closed: "Closed",
};
const chartData = [
  { name: "Jan", jobs: 12 },
  { name: "Feb", jobs: 19 },
  { name: "Mar", jobs: 15 },
  { name: "Apr", jobs: 22 },
  { name: "May", jobs: 18 },
  { name: "Jun", jobs: 25 },
  { name: "Jul", jobs: 30 },
];

function Dashboard() {
  const { actor } = useActor();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<ServiceJob[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    Promise.all([
      actor.getDashboardStats(),
      actor.getAllServiceJobs(),
      actor.getAllCallLogs(),
    ])
      .then(([s, jobs, calls]) => {
        setStats(s);
        setRecentJobs(jobs.slice(-5).reverse());
        setRecentCalls(calls.slice(-5).reverse());
      })
      .finally(() => setLoading(false));
  }, [actor]);

  const kpiCards = [
    {
      label: "Active Rentals",
      value: stats ? Number(stats.activeRentals) : 0,
      icon: Package,
      color: ACCENT,
    },
    {
      label: "Open Service Jobs",
      value: stats ? Number(stats.openServiceJobs) : 0,
      icon: Wrench,
      color: "oklch(0.65 0.22 30)",
    },
    {
      label: "Open Calls",
      value: stats ? Number(stats.openCalls) : 0,
      icon: Phone,
      color: "oklch(0.78 0.19 80)",
    },
    {
      label: "Total Orders",
      value: stats ? Number(stats.totalOrders) : 0,
      icon: ShoppingCart,
      color: "oklch(0.55 0.22 255)",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["a", "b", "c", "d"].map((k) => (
            <div
              key={k}
              className="h-32 rounded-xl animate-pulse"
              style={{ background: BG_CARD }}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className="h-64 rounded-xl animate-pulse"
            style={{ background: BG_CARD }}
          />
          <div
            className="h-64 rounded-xl animate-pulse"
            style={{ background: BG_CARD }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-5 rounded-xl"
            style={{ background: BG_CARD, border: BORDER }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm" style={{ color: TEXT_MUTED }}>
                {label}
              </p>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${color} / 0.15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <p className="text-4xl font-bold" style={{ color: TEXT_PRIMARY }}>
              {value}
            </p>
            <div
              className="mt-3 h-1 rounded-full"
              style={{ background: "oklch(0.22 0.042 245)" }}
            >
              <div
                className="h-1 rounded-full"
                style={{
                  background: color,
                  width: `${Math.min((value / 30) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="p-5 rounded-xl"
          style={{ background: BG_CARD, border: BORDER }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: ACCENT }} />
            <h2
              className="font-semibold text-sm"
              style={{ color: TEXT_PRIMARY }}
            >
              Monthly Service Jobs
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.22 0.042 245)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: TEXT_MUTED, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.045 245)",
                  border: BORDER,
                  borderRadius: 8,
                  color: TEXT_PRIMARY,
                }}
              />
              <Bar dataKey="jobs" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="p-5 rounded-xl"
          style={{ background: BG_CARD, border: BORDER }}
        >
          <h2
            className="font-semibold text-sm mb-4"
            style={{ color: TEXT_PRIMARY }}
          >
            Recent Service Jobs
          </h2>
          {recentJobs.length === 0 ? (
            <p className="text-sm" style={{ color: TEXT_MUTED }}>
              No service jobs yet
            </p>
          ) : (
            <div className="space-y-2">
              {recentJobs.map((job) => (
                <div
                  key={String(job.id)}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: "1px solid oklch(0.22 0.042 245)" }}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: TEXT_PRIMARY }}
                    >
                      {job.customerName}
                    </p>
                    <p className="text-xs" style={{ color: TEXT_MUTED }}>
                      {job.machineType}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      background: `${dashStatusColors[job.status]} / 0.15`,
                      color: dashStatusColors[job.status],
                    }}
                  >
                    {dashStatusLabels[job.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="p-5 rounded-xl"
        style={{ background: BG_CARD, border: BORDER }}
      >
        <h2
          className="font-semibold text-sm mb-4"
          style={{ color: TEXT_PRIMARY }}
        >
          Recent Call Logs
        </h2>
        {recentCalls.length === 0 ? (
          <p className="text-sm" style={{ color: TEXT_MUTED }}>
            No calls logged yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.22 0.042 245)" }}>
                  {["Customer", "Phone", "Requirement", "Type", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left pb-2 pr-4 font-medium"
                        style={{ color: TEXT_MUTED }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr
                    key={String(call.id)}
                    style={{
                      borderBottom: "1px solid oklch(0.22 0.042 245 / 0.5)",
                    }}
                  >
                    <td className="py-2 pr-4" style={{ color: TEXT_PRIMARY }}>
                      {call.customerName}
                    </td>
                    <td className="py-2 pr-4" style={{ color: TEXT_MUTED }}>
                      {call.customerPhone}
                    </td>
                    <td
                      className="py-2 pr-4 max-w-32 truncate"
                      style={{ color: TEXT_MUTED }}
                    >
                      {call.requirement}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "oklch(0.73 0.148 200 / 0.15)",
                          color: ACCENT,
                        }}
                      >
                        {call.callType === "serviceEnquiry"
                          ? "Service"
                          : call.callType === "salesEnquiry"
                            ? "Sales"
                            : "General"}
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: `${dashStatusColors[call.status]} / 0.15`,
                          color: dashStatusColors[call.status],
                        }}
                      >
                        {dashStatusLabels[call.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Service Job Modal ────────────────────────────────────────────────────────

function ServiceJobModal({
  job,
  onClose,
  onSaved,
}: { job: ServiceJob | null; onClose: () => void; onSaved: () => void }) {
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
    <ModalWrapper onClose={onClose}>
      <ModalHeader
        title={job ? "Edit Service Job" : "New Service Job"}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            id="sj-name"
            label="Customer Name"
            value={form.customerName}
            onChange={(v) => setForm((f) => ({ ...f, customerName: v }))}
            required
          />
          <FieldInput
            id="sj-phone"
            label="Phone"
            value={form.customerPhone}
            onChange={(v) => setForm((f) => ({ ...f, customerPhone: v }))}
            required
          />
        </div>
        <FieldInput
          id="sj-addr"
          label="Address"
          value={form.customerAddress}
          onChange={(v) => setForm((f) => ({ ...f, customerAddress: v }))}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            id="sj-machine"
            label="Machine Type"
            value={form.machineType}
            onChange={(v) => setForm((f) => ({ ...f, machineType: v }))}
            required
          />
          <FieldInput
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
            style={{ color: TEXT_MUTED }}
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
            required
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
            style={{ background: BG_BASE, border: BORDER, color: TEXT_PRIMARY }}
          />
        </div>
        <ModalFooter onClose={onClose} saving={saving} />
      </form>
    </ModalWrapper>
  );
}

// ─── Service Tracker ──────────────────────────────────────────────────────────

const svcStatusColors: Record<string, string> = {
  inTransit: ACCENT,
  inProgress: "oklch(0.55 0.22 255)",
  done: "oklch(0.65 0.18 145)",
  delayed: "oklch(0.65 0.22 30)",
};

function ServiceTracker({ isAdmin }: { isAdmin: boolean }) {
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
                background: filter === key ? ACCENT : BG_CARD,
                color: filter === key ? ACCENT_DARK : TEXT_MUTED,
                border: BORDER,
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
            style={{ background: ACCENT, color: ACCENT_DARK }}
          >
            <Plus className="w-4 h-4" /> Add Service Job
          </button>
        )}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: BG_CARD, border: BORDER }}
      >
        {loading ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            No service jobs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: BORDER,
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
                      style={{ color: TEXT_MUTED }}
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
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      #{String(job.id)}
                    </td>
                    <td className="px-4 py-3">
                      <div style={{ color: TEXT_PRIMARY }}>
                        {job.customerName}
                      </div>
                      <div className="text-xs" style={{ color: TEXT_MUTED }}>
                        {job.customerAddress}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      {job.customerPhone}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_PRIMARY }}>
                      {job.machineType}
                    </td>
                    <td className="px-4 py-3 max-w-40">
                      <span
                        className="truncate block"
                        style={{ color: TEXT_MUTED }}
                      >
                        {job.issueDescription}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
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
                          background: `${svcStatusColors[job.status]} / 0.15`,
                          color: svcStatusColors[job.status],
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
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
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
                              style={{ color: TEXT_MUTED }}
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

// ─── Rental Modal ─────────────────────────────────────────────────────────────

function RentalModal({
  rental,
  onClose,
  onSaved,
}: {
  rental: RentalAgreement | null;
  onClose: () => void;
  onSaved: () => void;
}) {
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
  const s = (field: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [field]: v }));

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

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader
        title={rental ? "Edit Rental" : "New Rental Agreement"}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            id="r-name"
            label="Customer Name"
            value={form.customerName}
            onChange={s("customerName")}
            required
          />
          <FieldInput
            id="r-phone"
            label="Phone"
            value={form.customerPhone}
            onChange={s("customerPhone")}
            required
          />
        </div>
        <FieldInput
          id="r-addr"
          label="Address"
          value={form.customerAddress}
          onChange={s("customerAddress")}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            id="r-machine"
            label="Machine Type"
            value={form.machineType}
            onChange={s("machineType")}
            required
          />
          <FieldInput
            id="r-serial"
            label="Machine Serial"
            value={form.machineSerial}
            onChange={s("machineSerial")}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldDate
            id="r-start"
            label="Start Date"
            value={form.startDate}
            onChange={s("startDate")}
            required
          />
          <FieldDate
            id="r-end"
            label="End Date"
            value={form.endDate}
            onChange={s("endDate")}
            required
          />
        </div>
        <FieldInput
          id="r-fee"
          label="Monthly Fee"
          value={form.monthlyFee}
          onChange={s("monthlyFee")}
          required
        />
        <FieldInput
          id="r-notes"
          label="Notes"
          value={form.notes}
          onChange={s("notes")}
        />
        <ModalFooter onClose={onClose} saving={saving} />
      </form>
    </ModalWrapper>
  );
}

// ─── Rentals Tracker ──────────────────────────────────────────────────────────

const rentalStatusColors: Record<string, string> = {
  active: "oklch(0.65 0.18 145)",
  upcoming: "oklch(0.55 0.22 255)",
  expired: "oklch(0.65 0.22 30)",
};

function daysLeft(endDateNs: bigint): number {
  const end = new Date(Number(endDateNs) / 1_000_000);
  return Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function RentalsTracker({ isAdmin }: { isAdmin: boolean }) {
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
                background: filter === key ? ACCENT : BG_CARD,
                color: filter === key ? ACCENT_DARK : TEXT_MUTED,
                border: BORDER,
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
            style={{ background: ACCENT, color: ACCENT_DARK }}
          >
            <Plus className="w-4 h-4" /> Add Rental
          </button>
        )}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: BG_CARD, border: BORDER }}
      >
        {loading ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            No rentals found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: BORDER,
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
                      style={{ color: TEXT_MUTED }}
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
                      <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                        #{String(r.id)}
                      </td>
                      <td className="px-4 py-3">
                        <div style={{ color: TEXT_PRIMARY }}>
                          {r.customerName}
                        </div>
                        <div className="text-xs" style={{ color: TEXT_MUTED }}>
                          {r.customerPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: TEXT_PRIMARY }}>
                        {r.machineType}
                      </td>
                      <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                        {r.machineSerial}
                      </td>
                      <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                        {new Date(
                          Number(r.startDate) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                        {new Date(
                          Number(r.endDate) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3" style={{ color: TEXT_PRIMARY }}>
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
                          <span style={{ color: TEXT_MUTED }}>—</span>
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
                            background: `${rentalStatusColors[r.status]} / 0.15`,
                            color: rentalStatusColors[r.status],
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
                                style={{ color: TEXT_MUTED }}
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

// ─── Sales Order Modal ────────────────────────────────────────────────────────

function SalesOrderModal({
  defaultType,
  onClose,
  onSaved,
}: {
  defaultType: "machineSale" | "consumable";
  onClose: () => void;
  onSaved: () => void;
}) {
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
  const s = (field: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [field]: v }));

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

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader title="New Sales Order" onClose={onClose} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="so-type"
            className="block text-xs font-medium mb-1"
            style={{ color: TEXT_MUTED }}
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
            style={{ background: BG_BASE, border: BORDER, color: TEXT_PRIMARY }}
          >
            <option value="machineSale">Machine Sale</option>
            <option value="consumable">Consumable</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            id="so-name"
            label="Customer Name"
            value={form.customerName}
            onChange={s("customerName")}
            required
          />
          <FieldInput
            id="so-phone"
            label="Phone"
            value={form.customerPhone}
            onChange={s("customerPhone")}
            required
          />
        </div>
        <FieldInput
          id="so-addr"
          label="Address"
          value={form.customerAddress}
          onChange={s("customerAddress")}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <FieldInput
            id="so-item"
            label="Item Name"
            value={form.itemName}
            onChange={s("itemName")}
            required
          />
          <FieldInput
            id="so-qty"
            label="Quantity"
            value={form.quantity}
            onChange={s("quantity")}
            required
          />
        </div>
        <FieldInput
          id="so-notes"
          label="Notes"
          value={form.notes}
          onChange={s("notes")}
        />
        <ModalFooter onClose={onClose} saving={saving} />
      </form>
    </ModalWrapper>
  );
}

// ─── Sales Orders ─────────────────────────────────────────────────────────────

function SalesOrders({ isAdmin }: { isAdmin: boolean }) {
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
          style={{ background: BG_CARD, border: BORDER }}
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
                background: tab === key ? ACCENT : "transparent",
                color: tab === key ? ACCENT_DARK : TEXT_MUTED,
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
            style={{ background: ACCENT, color: ACCENT_DARK }}
          >
            <Plus className="w-4 h-4" /> Add Order
          </button>
        )}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: BG_CARD, border: BORDER }}
      >
        {loading ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: BORDER,
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
                      style={{ color: TEXT_MUTED }}
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
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      #{String(o.id)}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_PRIMARY }}>
                      {o.customerName}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      {o.customerPhone}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      {o.customerAddress}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_PRIMARY }}>
                      {o.itemName}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      {String(o.quantity)}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      {new Date(
                        Number(o.orderDate) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 max-w-32">
                      <span
                        className="truncate block"
                        style={{ color: TEXT_MUTED }}
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

// ─── Call Log Modal ───────────────────────────────────────────────────────────

function CallLogModal({
  call,
  onClose,
  onSaved,
}: { call: CallLog | null; onClose: () => void; onSaved: () => void }) {
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
  const s = (field: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [field]: v }));

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

  return (
    <ModalWrapper onClose={onClose}>
      <ModalHeader
        title={call ? "Update Call Log" : "New Call Log"}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        {call ? (
          <div>
            <label
              htmlFor="cl-status"
              className="block text-xs font-medium mb-1"
              style={{ color: TEXT_MUTED }}
            >
              Status
            </label>
            <select
              id="cl-status"
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value as CallStatus)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: BG_BASE,
                border: BORDER,
                color: TEXT_PRIMARY,
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
              <FieldInput
                id="cl-name"
                label="Customer Name"
                value={form.customerName}
                onChange={s("customerName")}
                required
              />
              <FieldInput
                id="cl-phone"
                label="Phone"
                value={form.customerPhone}
                onChange={s("customerPhone")}
                required
              />
            </div>
            <FieldInput
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
                style={{ color: TEXT_MUTED }}
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
                  background: BG_BASE,
                  border: BORDER,
                  color: TEXT_PRIMARY,
                }}
              >
                <option value={CallType.serviceEnquiry}>Service Enquiry</option>
                <option value={CallType.salesEnquiry}>Sales Enquiry</option>
                <option value={CallType.general}>General</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="cl-req"
                className="block text-xs font-medium mb-1"
                style={{ color: TEXT_MUTED }}
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
                  background: BG_BASE,
                  border: BORDER,
                  color: TEXT_PRIMARY,
                }}
              />
            </div>
            <FieldInput
              id="cl-notes"
              label="Notes"
              value={form.notes}
              onChange={s("notes")}
            />
          </>
        )}
        <ModalFooter onClose={onClose} saving={saving} />
      </form>
    </ModalWrapper>
  );
}

// ─── Call Logs ────────────────────────────────────────────────────────────────

const callStatusColors: Record<string, string> = {
  open: "oklch(0.65 0.22 30)",
  followUp: "oklch(0.78 0.19 80)",
  closed: "oklch(0.65 0.18 145)",
};
const callTypeColors: Record<string, string> = {
  serviceEnquiry: "oklch(0.78 0.19 80)",
  salesEnquiry: "oklch(0.55 0.22 255)",
  general: TEXT_MUTED,
};
const callTypeLabels: Record<string, string> = {
  serviceEnquiry: "Service",
  salesEnquiry: "Sales",
  general: "General",
};

function CallLogs({ isAdmin }: { isAdmin: boolean }) {
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
                background: filter === key ? ACCENT : BG_CARD,
                color: filter === key ? ACCENT_DARK : TEXT_MUTED,
                border: BORDER,
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
            style={{ background: ACCENT, color: ACCENT_DARK }}
          >
            <Plus className="w-4 h-4" /> Add Call Log
          </button>
        )}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: BG_CARD, border: BORDER }}
      >
        {loading ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center" style={{ color: TEXT_MUTED }}>
            No call logs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: BORDER,
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
                      style={{ color: TEXT_MUTED }}
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
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      #{String(c.id)}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_PRIMARY }}>
                      {c.customerName}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      {c.customerPhone}
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
                      {c.customerAddress}
                    </td>
                    <td className="px-4 py-3 max-w-40">
                      <span
                        className="truncate block"
                        style={{ color: TEXT_MUTED }}
                      >
                        {c.requirement}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          background: `${callTypeColors[c.callType]} / 0.15`,
                          color: callTypeColors[c.callType],
                        }}
                      >
                        {callTypeLabels[c.callType]}
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
                          background: `${callStatusColors[c.status]} / 0.15`,
                          color: callStatusColors[c.status],
                        }}
                      >
                        <option value={CallStatus.open}>Open</option>
                        <option value={CallStatus.followUp}>Follow Up</option>
                        <option value={CallStatus.closed}>Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3" style={{ color: TEXT_MUTED }}>
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
                          style={{ color: TEXT_MUTED }}
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

// ─── App (root) ───────────────────────────────────────────────────────────────

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor } = useActor();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (actor && identity) {
      actor
        .isCallerAdmin()
        .then(setIsAdmin)
        .catch(() => setIsAdmin(false));
    }
  }, [actor, identity]);

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: BG_BASE }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: TEXT_MUTED }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) return <Login />;

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "service":
        return <ServiceTracker isAdmin={isAdmin} />;
      case "rentals":
        return <RentalsTracker isAdmin={isAdmin} />;
      case "sales":
        return <SalesOrders isAdmin={isAdmin} />;
      case "calls":
        return <CallLogs isAdmin={isAdmin} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      isAdmin={isAdmin}
    >
      {renderPage()}
    </Layout>
  );
}
