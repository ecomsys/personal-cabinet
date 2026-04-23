import { useEffect } from "react";
import toast from "react-hot-toast";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  Button,
  MobileList,
  Pagination,
} from "@/components/ui";

import { useModalStore } from "@/store/modal.store.js";
import { useAdminStore } from "@/store/admin.store.js";

export const SessionsTable = () => {
  const {
    sessions,
    sessionsPage,
    sessionsMeta,
    sessionsLoading,
    deletingSessionId,
    setSessionsPage,
    fetchSessions,
    deleteSession,
  } = useAdminStore();

  const openConfirm = useModalStore((s) => s.openConfirm);

  const baseIndex = (sessionsPage - 1) * 10;

  /* ================= INIT ================= */
  useEffect(() => {
    fetchSessions(sessionsPage);
  }, [sessionsPage, fetchSessions]);

  /* ================= DERIVED ================= */
  const admins = sessions.filter((s) => s.user?.role === "admin");
  const users = sessions.filter((s) => s.user?.role !== "admin");

  /* ================= DELETE ================= */
  const handleDelete = (session) => {
    openConfirm({
      title: "Terminate session",
      description: `Terminate session for ${session.user?.email}?`,
      confirmText: "Terminate",
      onConfirm: async () => {
        try {
          await deleteSession(session.id);
          toast.success("Session terminated");
        } catch {
          toast.error("Failed to terminate session");
        }
      },
    });
  };

  /* ================= EMPTY ================= */
  if (!sessionsLoading && !sessions.length) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No sessions found
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="space-y-3">
        {/* ADMINS */}
        <MobileList
          items={admins}
          renderItem={(s) => (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium truncate max-w-[75%]">
                  {s.user?.email}
                </span>

                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                  SYSTEM
                </span>
              </div>

              <div className="text-xs text-gray-500">
                {s.deviceId || "unknown"} · {s.ip || "—"}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Last: {new Date(s.lastUsedAt).toLocaleString()}
              </div>
            </>
          )}
        />

        {/* USERS */}
        <MobileList
          items={users}
          renderItem={(s, index) => (
            <>
              <div className="flex items-center gap-2">
                <span>{baseIndex + index + 1}.</span>

                <span className="font-medium truncate max-w-[75%]">
                  {s.user?.email}
                </span>
              </div>

              <div className="text-xs text-gray-500">
                {s.deviceId || "unknown"} · {s.ip || "—"}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Last: {new Date(s.lastUsedAt).toLocaleString()}
              </div>

              <Button
                className="mt-3 w-full"
                variant="danger"
                disabled={deletingSessionId === s.id}
                onClick={() => handleDelete(s)}
              >
                {deletingSessionId === s.id
                  ? "Terminating..."
                  : "Terminate"}
              </Button>
            </>
          )}
        />
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto">
          <Table className="w-full">
            <TableHead>
              <tr>
                <TableHeaderCell className="w-[2.5rem]">#</TableHeaderCell>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Device</TableHeaderCell>
                <TableHeaderCell className="hidden lg:table-cell">
                  IP
                </TableHeaderCell>
                <TableHeaderCell>Last active</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Actions
                </TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {sessions.map((s, index) => (
                <TableRow
                  key={s.id}
                  className={s.user?.role === "admin" ? "bg-yellow-100" : ""}
                >
                  <TableCell className="text-gray-400">
                    {baseIndex + index + 1}
                  </TableCell>

                  <TableCell className="font-medium">
                    {s.user?.email}
                  </TableCell>

                  <TableCell>{s.deviceId || "unknown"}</TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {s.ip || "—"}
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {new Date(s.lastUsedAt).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        s.isValid ? "text-green-600" : "text-red-500"
                      }
                    >
                      {s.isValid ? "Active" : "Revoked"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="danger"
                      disabled={deletingSessionId === s.id}
                      onClick={() => handleDelete(s)}
                    >
                      {deletingSessionId === s.id ? "..." : "Terminate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      <Pagination
        page={sessionsPage}
        totalPages={sessionsMeta?.pages || 1}
        onChange={(p) => {
          if (p < 1 || p > (sessionsMeta?.pages || 1)) return;
          setSessionsPage(p);
        }}
      />
    </>
  );
};