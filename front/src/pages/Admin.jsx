import { useState } from "react";
import { PanelCard, Button, InlineMetrics, Tabs } from "@/components/ui";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

import { UsersTable } from "@/components/Admin/UsersTable";
import { SessionsTable } from "@/components/Admin/SessionsTable";

export default function Admin() {
  const TABS = {
    USERS: "users",
    SESSIONS: "sessions",
  };

  const [tab, setTab] = useState(TABS.USERS);

  const { stats, loading, refreshing, lastUpdated, refresh } =
    useAdminDashboard();

  return (
    <PanelCard className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center lg:items-start">
        <div className="text-center lg:text-left">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>

          <p className="text-xs text-gray-500 mt-1">
            {lastUpdated
              ? `Last update: ${lastUpdated.toLocaleTimeString()}`
              : "Loading system data..."}
          </p>
        </div>

        <div className="flex flex-row items-center gap-3">
          {/* ================= STATS (compact) ================= */}
          <InlineMetrics
            metrics={[
              { label: "Users", value: loading ? "..." : stats.users },
              { label: "Online", value: loading ? "..." : stats.onlineUsers },
              {
                label: "All sessions",
                value: loading ? "..." : stats.activeSessions,
              },
            ]}
          />

          {/* ================= Refresh Button ================= */}
          <Button onClick={refresh} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { label: "Users", value: TABS.USERS },
          { label: "Sessions", value: TABS.SESSIONS },
        ]}
      />

      {/* ================= CONTENT ================= */}
      <div>
        {tab === TABS.USERS && <UsersTable />}
        {tab === TABS.SESSIONS && <SessionsTable />}
      </div>
    </PanelCard>
  );
}
