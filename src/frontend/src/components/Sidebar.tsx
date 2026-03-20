import {
  LayoutDashboard,
  LogOut,
  Package,
  Phone,
  Printer,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}

const navItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "service", label: "Service", icon: Wrench },
  { id: "rentals", label: "Rentals", icon: Package },
  { id: "sales", label: "Sales & Orders", icon: ShoppingCart },
  { id: "calls", label: "Calls & Enquiries", icon: Phone },
];

export default function Sidebar({
  currentPage,
  onNavigate,
  isAdmin,
}: SidebarProps) {
  const { clear } = useInternetIdentity();

  return (
    <aside
      className="w-64 flex flex-col shrink-0 h-full"
      style={{
        background: "oklch(0.108 0.038 245)",
        borderRight: "1px solid oklch(0.22 0.042 245)",
      }}
    >
      <div
        className="p-5"
        style={{ borderBottom: "1px solid oklch(0.22 0.042 245)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.73 0.148 200)" }}
          >
            <Printer
              className="w-5 h-5"
              style={{ color: "oklch(0.12 0.038 245)" }}
            />
          </div>
          <div>
            <p
              className="font-bold text-sm leading-tight"
              style={{ color: "oklch(0.935 0.018 245)" }}
            >
              TECHNO COPIER
            </p>
            <p className="text-xs" style={{ color: "oklch(0.65 0.038 245)" }}>
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
            color: isAdmin ? "oklch(0.73 0.148 200)" : "oklch(0.65 0.038 245)",
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
                background: active ? "oklch(0.73 0.148 200)" : "transparent",
                color: active
                  ? "oklch(0.12 0.038 245)"
                  : "oklch(0.65 0.038 245)",
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div
        className="p-3"
        style={{ borderTop: "1px solid oklch(0.22 0.042 245)" }}
      >
        <button
          type="button"
          onClick={clear}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: "oklch(0.65 0.038 245)" }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
