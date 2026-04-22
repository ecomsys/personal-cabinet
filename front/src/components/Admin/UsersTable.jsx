import { useEffect, useState } from "react";
import { getUsersAdmin, deleteUserAdmin } from "@/api/admin.api.js";

import toast from "react-hot-toast";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  Button,
  RoleBadge,
  MobileList,
} from "@/components/ui";

import { useModalStore } from "@/store/modal.store.js";

/* ========================= */
export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const openConfirm = useModalStore((s) => s.openConfirm);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersAdmin();
      setUsers(data || []);
    } finally {
      setLoading(false);
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;

    // вторичная сортировка (например по дате)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  /* ================= DELETE ================= */
  const handleDelete = (user) => {
    openConfirm({
      title: "Delete user",
      description: `Are you sure you want to delete ${user.email}?`,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          setDeletingId(user.id);

          await deleteUserAdmin(user.id);

          setUsers((prev) => prev.filter((u) => u.id !== user.id));

          toast.success("User deleted");
        } catch {
          toast.error("Failed to delete user");
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= EMPTY ================= */
  if (!loading && !users.length) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <>
      {/* ================= MOBILE ================= */}
      <MobileList
        items={sortedUsers}
        renderItem={(user) => (
          <>
            {/* EMAIL */}
            <div className="font-medium truncate">{user.email}</div>

            {/* ROLE */}
            <div className="mt-1">
              <RoleBadge role={user.role} />
            </div>

            {/* INFO */}
            <div className="mt-2 text-sm text-gray-500">
              Created: {new Date(user.createdAt).toLocaleDateString()}
            </div>

            {/* ACTION */}
            {user.role !== "admin" && (
              <Button
                className="mt-3 w-full"
                variant="danger"
                disabled={deletingId === user.id}
                onClick={() => handleDelete(user)}
              >
                {deletingId === user.id ? "Deleting..." : "Delete"}
              </Button>
            )}
          </>
        )}
      />

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHead>
              <tr>               
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                 
                  <TableCell className="font-medium">{user.email}</TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {user.role !== "admin" && (
                      <Button
                        variant="danger"
                        disabled={deletingId === user.id}
                        onClick={() => handleDelete(user)}
                      >
                        {deletingId === user.id ? "..." : "Delete"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
