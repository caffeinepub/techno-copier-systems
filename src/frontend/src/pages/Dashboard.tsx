import { Package, Phone, ShoppingCart, TrendingUp, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CallLog, DashboardStats, ServiceJob } from "../backend";
import { useActor } from "../hooks/useActor";

const statusColors: Record<string, string> = {
  inTransit: "oklch(0.73 0.148 200)",
  inProgress: "oklch(0.55 0.22 255)",
  done: "oklch(0.65 0.18 145)",
  delayed: "oklch(0.65 0.22 30)",
  open: "oklch(0.65 0.22 30)",
  followUp: "oklch(0.78 0.19 80)",
  closed: "oklch(0.65 0.18 145)",
};

const statusLabels: Record<string, string> = {
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

export default function Dashboard() {
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
      color: "oklch(0.73 0.148 200)",
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

  if (loading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-5 rounded-xl"
            style={{
              background: "oklch(0.165 0.045 245)",
              border: "1px solid oklch(0.22 0.042 245)",
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm" style={{ color: "oklch(0.65 0.038 245)" }}>
                {label}
              </p>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${color} / 0.15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <p
              className="text-4xl font-bold"
              style={{ color: "oklch(0.935 0.018 245)" }}
            >
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
          style={{
            background: "oklch(0.165 0.045 245)",
            border: "1px solid oklch(0.22 0.042 245)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp
              className="w-4 h-4"
              style={{ color: "oklch(0.73 0.148 200)" }}
            />
            <h2
              className="font-semibold text-sm"
              style={{ color: "oklch(0.935 0.018 245)" }}
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
                tick={{ fill: "oklch(0.65 0.038 245)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.65 0.038 245)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.18 0.045 245)",
                  border: "1px solid oklch(0.22 0.042 245)",
                  borderRadius: 8,
                  color: "oklch(0.935 0.018 245)",
                }}
              />
              <Bar
                dataKey="jobs"
                fill="oklch(0.73 0.148 200)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="p-5 rounded-xl"
          style={{
            background: "oklch(0.165 0.045 245)",
            border: "1px solid oklch(0.22 0.042 245)",
          }}
        >
          <h2
            className="font-semibold text-sm mb-4"
            style={{ color: "oklch(0.935 0.018 245)" }}
          >
            Recent Service Jobs
          </h2>
          {recentJobs.length === 0 ? (
            <p className="text-sm" style={{ color: "oklch(0.65 0.038 245)" }}>
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
                      style={{ color: "oklch(0.935 0.018 245)" }}
                    >
                      {job.customerName}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {job.machineType}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      background: `${statusColors[job.status]} / 0.15`,
                      color: statusColors[job.status],
                    }}
                  >
                    {statusLabels[job.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="p-5 rounded-xl"
        style={{
          background: "oklch(0.165 0.045 245)",
          border: "1px solid oklch(0.22 0.042 245)",
        }}
      >
        <h2
          className="font-semibold text-sm mb-4"
          style={{ color: "oklch(0.935 0.018 245)" }}
        >
          Recent Call Logs
        </h2>
        {recentCalls.length === 0 ? (
          <p className="text-sm" style={{ color: "oklch(0.65 0.038 245)" }}>
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
                        style={{ color: "oklch(0.65 0.038 245)" }}
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
                    <td
                      className="py-2 pr-4"
                      style={{ color: "oklch(0.935 0.018 245)" }}
                    >
                      {call.customerName}
                    </td>
                    <td
                      className="py-2 pr-4"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {call.customerPhone}
                    </td>
                    <td
                      className="py-2 pr-4 max-w-32 truncate"
                      style={{ color: "oklch(0.65 0.038 245)" }}
                    >
                      {call.requirement}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "oklch(0.73 0.148 200 / 0.15)",
                          color: "oklch(0.73 0.148 200)",
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
                          background: `${statusColors[call.status]} / 0.15`,
                          color: statusColors[call.status],
                        }}
                      >
                        {statusLabels[call.status]}
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

function LoadingState() {
  const skeletons = ["a", "b", "c", "d"];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skeletons.map((k) => (
          <div
            key={k}
            className="h-32 rounded-xl animate-pulse"
            style={{ background: "oklch(0.165 0.045 245)" }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="h-64 rounded-xl animate-pulse"
          style={{ background: "oklch(0.165 0.045 245)" }}
        />
        <div
          className="h-64 rounded-xl animate-pulse"
          style={{ background: "oklch(0.165 0.045 245)" }}
        />
      </div>
    </div>
  );
}
