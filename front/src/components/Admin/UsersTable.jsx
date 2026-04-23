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
  RoleBadge,
  MobileList,
  Pagination,
} from "@/components/ui";

import { useModalStore } from "@/store/modal.store.js";
import { useAdminStore } from "@/store/admin.store.js";

export const UsersTable = () => {
  const {
    users,
    admins,
    usersPage,
    usersMeta,
    usersLoading,
    deletingUserId,
    fetchUsers,
    setUsersPage,
    deleteUser,
  } = useAdminStore();

  const openConfirm = useModalStore((s) => s.openConfirm);

  const baseIndex = (usersPage - 1) * 10;

  const regularUsers = users;

  /* ================= INIT ================= */
  useEffect(() => {
    fetchUsers(usersPage);
  }, [usersPage]);


  /* ================= DELETE ================= */
  const handleDelete = (user) => {
    openConfirm({
      title: "Delete user",
      description: `Are you sure you want to delete ${user.email}?`,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await deleteUser(user.id);
          toast.success("User deleted");
        } catch {
          toast.error("Failed to delete user");
        }
      },
    });
  };

  /* ================= EMPTY ================= */
  if (!usersLoading && !users.length) {
    return (
      <div className="text-center py-10 text-sm text-gray-500">
        No users found
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
          renderItem={(user) => (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium truncate max-w-[75%]">
                  {user.email}
                </span>

                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                  SYSTEM
                </span>
              </div>

              <div className="mt-1">
                <RoleBadge role={user.role} />
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </>
          )}
        />

        {/* USERS */}
        <MobileList
          items={regularUsers}
          renderItem={(user, index) => (
            <>
              <div className="flex items-center gap-2">
                <span>{baseIndex + index + 1}.</span>

                <span className="font-medium truncate">
                  {user.email}
                </span>
              </div>

              <div className="mt-1">
                <RoleBadge role={user.role} />
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </div>

              <Button
                className="mt-3 w-full"
                variant="danger"
                disabled={deletingUserId === user.id}
                onClick={() => handleDelete(user)}
              >
                {deletingUserId === user.id ? "Deleting..." : "Delete"}
              </Button>
            </>
          )}
        />
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        <div className="w-full overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHead>
              <tr>
                <TableHeaderCell className="w-[1.875rem]">#</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
                <TableHeaderCell className="text-right">
                  Actions
                </TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {/* ADMINS */}
              {admins.map((user) => (
                <TableRow key={user.id} className="bg-yellow-100">
                  <TableCell />
                  <TableCell className="font-medium truncate">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}

              {/* USERS */}
              {regularUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="text-gray-400">
                    {baseIndex + index + 1}
                  </TableCell>

                  <TableCell className="font-medium truncate">
                    {user.email}
                  </TableCell>

                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>

                  <TableCell className="text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="danger"
                      disabled={deletingUserId === user.id}
                      onClick={() => handleDelete(user)}
                    >
                      {deletingUserId === user.id ? "..." : "Delete"}
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
        page={usersPage}
        totalPages={usersMeta?.pages || 1}
        onChange={(p) => {
          if (p < 1 || p > (usersMeta?.pages || 1)) return;
          setUsersPage(p);
        }}
      />
    </>
  );
};