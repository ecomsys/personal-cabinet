import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Pagination, MobileList } from "@/components/ui";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  Button,
} from "@/components/ui";

import { useModalStore } from "@/store/modal.store.js";
import { getAllSessionsAdmin, deleteSessionAdmin } from "@/api/admin.api.js";

/* ========================= */
export const SessionsTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const openConfirm = useModalStore((s) => s.openConfirm);

  /* ================= FETCH ================= */
  const fetchSessions = async (page = 1) => {
    setLoading(true);

    try {
      const res = await getAllSessionsAdmin({
        page,
        limit: 10,
      });

      setSessions(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(page);
  }, [page]);

  /* ================= DELETE ================= */
  const handleDelete = (session) => {
    openConfirm({
      title: "Terminate session",
      description: `${session.user.email} will be logged out.`,
      confirmText: "Terminate",
      onConfirm: async () => {
        try {
          setDeletingId(session.id);

          await deleteSessionAdmin(session.id);

          setSessions((prev) =>
            prev.filter((s) => s.id !== session.id)
          );

          toast.success("Session terminated");
        } catch {
          toast.error("Failed to terminate session");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  /* ================= EMPTY ================= */
  if (!loading && !sessions.length) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No sessions found
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE ================= */}
      <MobileList
        items={sessions}
        renderItem={(s) => (
          <>
            {/* USER */}
            <div className="truncate font-medium">
              {s.user?.email}
            </div>
            <div className="text-xs text-gray-500">
              {s.user?.role}
            </div>

            {/* INFO */}
            <div className="mt-2 text-sm space-y-1">
              <div>Device: {s.deviceId || "unknown"}</div>
              <div>IP: {s.ip || "—"}</div>
              <div>
                Last:{" "}
                {new Date(s.lastUsedAt).toLocaleString()}
              </div>
              <div>
                Status:{" "}
                <span
                  className={
                    s.isValid
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {s.isValid ? "Active" : "Revoked"}
                </span>
              </div>
            </div>

            {/* ACTION */}
            <Button
              className="mt-3 w-full"
              variant="danger"
              disabled={deletingId === s.id}
              onClick={() => handleDelete(s)}
            >
              {deletingId === s.id
                ? "Terminating..."
                : "Terminate"}
            </Button>
          </>
        )}
      />

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHead>
              <tr>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Device</TableHeaderCell>
                <TableHeaderCell className="hidden lg:table-cell">
                  IP
                </TableHeaderCell>
                <TableHeaderCell>Last active</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">
                      {s.user?.email}
                    </div>
                    <div className="text-xs text-gray-400">
                      {s.user?.role}
                    </div>
                  </TableCell>

                  <TableCell>
                    {s.deviceId || "unknown"}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {s.ip || "—"}
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {new Date(
                      s.lastUsedAt
                    ).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        s.isValid
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {s.isValid ? "Active" : "Revoked"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="danger"
                      disabled={deletingId === s.id}
                      onClick={() => handleDelete(s)}
                    >
                      {deletingId === s.id
                        ? "..."
                        : "Terminate"}
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
        page={page}
        totalPages={meta?.pages || 1}
        onChange={(p) => {
          if (p < 1 || p > (meta?.pages || 1)) return;
          setPage(p);
        }}
      />
    </>
  );
};