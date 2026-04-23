import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { PanelCard, Button, InlineMetrics, Tabs } from "@/components/ui";
import { useAdminStats } from "@/hooks/useAdminStats";

import { UsersTable } from "@/components/Admin/UsersTable";
import { SessionsTable } from "@/components/Admin/SessionsTable";

export default function Admin() {
  const TABS = {
    USERS: "users",
    SESSIONS: "sessions",
  };

  const [searchParams, setSearchParams] = useSearchParams();

  //  РЕАЛЬНОЕ значение из URL (без fallback)
  const tabFromUrl = searchParams.get("tab");

  //  вычисленное значение для UI
  const currentTab = tabFromUrl || TABS.USERS;

  //  инициализация URL при первом заходе
  useEffect(() => {
    if (!tabFromUrl) {
      setSearchParams({ tab: TABS.USERS }, { replace: true });
    }
  }, [tabFromUrl, setSearchParams]);

  const setTab = (value) => {
    setSearchParams({ tab: value });
  };

  const { stats, loading, refreshing, lastUpdated, refresh } =
    useAdminStats();

  return (
    <PanelCard className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center lg:items-start">
        <div className="text-center lg:text-left">
          <h1 className="text-xl font-semibold">Admin Panel</h1>

          <p className="text-xs text-gray-500 mt-1">
            {lastUpdated
              ? `Last update: ${lastUpdated.toLocaleTimeString()}`
              : "Loading system data..."}
          </p>
        </div>

        <div className="flex flex-row md:items-center gap-3">
          <InlineMetrics
            metrics={[
              { label: "Users", value: loading ? "..." : stats.users },
              { label: "Online", value: loading ? "..." : stats.onlineUsers },
              {
                label: "All sessions",
                value: loading ? "..." : stats.activeSessions,
              },
            ]}
          >
            <Button onClick={refresh} disabled={refreshing}>
              {refreshing ? "Processing..." : "Refresh"}
            </Button>
          </InlineMetrics>
        </div>
      </div>

      {/* TABS */}
      <Tabs
        value={currentTab}
        onChange={setTab}
        tabs={[
          { label: "Users", value: TABS.USERS },
          { label: "Sessions", value: TABS.SESSIONS },
        ]}
      />

      {/* CONTENT */}
      <div>
        {currentTab === TABS.USERS && <UsersTable />}
        {currentTab === TABS.SESSIONS && <SessionsTable />}
      </div>
    </PanelCard>
  );
}