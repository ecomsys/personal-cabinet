import { useEffect } from "react";
import { useAdminStore } from "@/store/admin.store.js";

export const useAdminStats = () => {
  const stats = useAdminStore((s) => s.stats);
  const loading = useAdminStore((s) => s.statsLoading);
  const refreshing = useAdminStore((s) => s.statsRefreshing);
  const error = useAdminStore((s) => s.statsError);
  const lastUpdated = useAdminStore((s) => s.lastUpdated);
  const fetchStats = useAdminStore((s) => s.fetchStats);

  useEffect(() => {
    fetchStats(false);
  }, [fetchStats]);

  return {
    stats,
    loading,
    refreshing,
    error,
    lastUpdated,
    refetch: () => fetchStats(false),
    refresh: () => fetchStats(true),
  };
};