import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";
import type { Page } from "../App";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isAdmin: boolean;
}

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard",
  service: "Service Tracker",
  rentals: "Rentals Tracker",
  sales: "Sales & Consumables",
  calls: "Calls & Enquiries",
};

export default function Layout({
  children,
  currentPage,
  onNavigate,
  isAdmin,
}: LayoutProps) {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "oklch(0.12 0.038 245)" }}
    >
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isAdmin={isAdmin}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{
            borderBottom: "1px solid oklch(0.22 0.042 245)",
            background: "oklch(0.108 0.038 245)",
          }}
        >
          <h1
            className="text-xl font-semibold"
            style={{ color: "oklch(0.935 0.018 245)" }}
          >
            {pageTitles[currentPage]}
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "oklch(0.65 0.038 245)" }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 rounded-full text-sm outline-none"
                style={{
                  background: "oklch(0.165 0.045 245)",
                  border: "1px solid oklch(0.22 0.042 245)",
                  color: "oklch(0.935 0.018 245)",
                  width: 200,
                }}
              />
            </div>
            <button
              type="button"
              className="relative p-2 rounded-full"
              style={{ background: "oklch(0.165 0.045 245)" }}
            >
              <Bell
                className="w-5 h-5"
                style={{ color: "oklch(0.65 0.038 245)" }}
              />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "oklch(0.73 0.148 200)" }}
              />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "oklch(0.73 0.148 200)",
                color: "oklch(0.12 0.038 245)",
              }}
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
