import { create } from "zustand";

import {
  getUsersAdmin,
  getAllSessionsAdmin,
  deleteUserAdmin,
  deleteSessionAdmin,
  getStatsAdmin,
} from "@/api/admin.api";

export const useAdminStore = create((set, get) => ({
  /* ================= USERS ================= */
  users: [],
  admins: [],
  usersPage: 1,
  usersMeta: null,
  usersLoading: false,
  deletingUserId: null,

  setUsersPage: (page) => {
    set({ usersPage: page });
    get().fetchUsers(page);
  },

  fetchUsers: async (page = 1) => {
    set({ loading: true });

    try {
      const res = await getUsersAdmin({ page, limit: 10 });

      set({
        users: res.users || [],
        admins: res.admins || [],
        usersMeta: res.meta,
        usersPage: page,
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ deletingUserId: id });

    try {
      await deleteUserAdmin(id);

      const { users, usersPage } = get();
      const updated = users.filter((u) => u.id !== id);

      // если страница пустая → назад
      if (updated.length === 0 && usersPage > 1) {
        const prevPage = usersPage - 1;
        set({ usersPage: prevPage });
        await get().fetchUsers(prevPage);
        return;
      }

      set({ users: updated });

      get().fetchStats();
    } finally {
      set({ deletingUserId: null });
    }
  },

  /* ================= SESSIONS ================= */
  sessions: [],
  sessionsPage: 1,
  sessionsMeta: null,
  sessionsLoading: false,
  deletingSessionId: null,

  setSessionsPage: (page) => {
    set({ sessionsPage: page });
    get().fetchSessions(page);
  },

  fetchSessions: async (page = 1) => {
    set({ sessionsLoading: true });

    try {
      const res = await getAllSessionsAdmin({ page, limit: 10 });

      set({
        sessions: res.data || [],
        sessionsMeta: res.meta,
        sessionsPage: page,
      });
    } finally {
      set({ sessionsLoading: false });
    }
  },

  deleteSession: async (id) => {
    set({ deletingSessionId: id });

    try {
      await deleteSessionAdmin(id);

      const { sessions, sessionsPage } = get();
      const updated = sessions.filter((s) => s.id !== id);

      if (updated.length === 0 && sessionsPage > 1) {
        const prevPage = sessionsPage - 1;
        set({ sessionsPage: prevPage });
        await get().fetchSessions(prevPage);
        return;
      }

      set({ sessions: updated });

      get().fetchStats();
    } finally {
      set({ deletingSessionId: null });
    }
  },

  /* ================= STATS ================= */
  stats: {
    users: 0,
    onlineUsers: 0,
    activeSessions: 0,
  },

  statsLoading: false,
  statsRefreshing: false,
  statsError: null,
  lastUpdated: null,

  fetchStats: async (isRefresh = false) => {
    try {
      set({
        statsLoading: !isRefresh,
        statsRefreshing: isRefresh,
        statsError: null,
      });

      const data = await getStatsAdmin();

      set({
        stats: {
          users: data.users ?? 0,
          onlineUsers: data.onlineUsers ?? 0,
          activeSessions: data.activeSessions ?? 0,
        },
        statsLoading: false,
        statsRefreshing: false,
        lastUpdated: new Date(),
      });
    } catch (e) {
      set({
        statsLoading: false,
        statsRefreshing: false,
        statsError: e?.message || "Failed to load dashboard",
      });
    }
  },

  /* ================= FULL SYNC ================= */
  syncAll: async () => {
    const { usersPage, sessionsPage } = get();

    await Promise.all([
      get().fetchStats(),
      get().fetchUsers(usersPage),
      get().fetchSessions(sessionsPage),
    ]);
  },
}));
