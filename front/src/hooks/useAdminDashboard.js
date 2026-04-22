import { useCallback, useEffect, useState } from "react";
import { getStatsAdmin } from "@/api/admin.api.js";

export const useAdminDashboard = () => {
  const [state, setState] = useState({
    stats: {
      users: 0,
      onlineUsers: 0,
      activeSessions: 0,
    },
    loading: true,
    refreshing: false,
    error: null,
    lastUpdated: null,
  });

  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null,
      }));

      const data = await getStatsAdmin();

      setState((prev) => ({
        ...prev,
        stats: {
          users: data.users ?? 0,
          onlineUsers: data.onlineUsers ?? 0,
          activeSessions: data.activeSessions ?? 0,
        },
        loading: false,
        refreshing: false,
        lastUpdated: new Date(),
      }));
    } catch (e) {
      setState((prev) => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: e?.message || "Failed to load dashboard",
      }));
    }
  }, []);

  useEffect(() => {
    fetchStats(false);
  }, [fetchStats]);

  return {
    stats: state.stats,
    loading: state.loading,
    refreshing: state.refreshing,
    error: state.error,
    lastUpdated: state.lastUpdated,
    refetch: () => fetchStats(false),
    refresh: () => fetchStats(true),
  };
};