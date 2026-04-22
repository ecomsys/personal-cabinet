import { useEffect, useState } from "react";
import {
  getSessionsUser,
  deleteSessionUser,
  deleteOtherSessionsUser,
} from "@/api/user.api";

import { useModalStore } from "@/store/modal.store.js";
import { Card, Button } from "@/components/ui";
import toast from "react-hot-toast";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);

  const openConfirm = useModalStore((s) => s.openConfirm);

  const load = () => {
    getSessionsUser().then(setSessions);
  };

  useEffect(() => {
    load();
  }, []);

  const removeSession = (id) => {
    openConfirm({
      title: "Remove session",
      description: "Are you sure you want to remove this session?",
      confirmText: "Remove",
      onConfirm: async () => {
        try {
          await deleteSessionUser(id);
          toast.success("Session removed");
          load();
        } catch {
          toast.error("Error");
        }
      },
    });
  };

  const removeOthers = () => {
    openConfirm({
      title: "Logout other sessions",
      description: "This will log out all other devices except this one.",
      confirmText: "Logout others",
      onConfirm: async () => {
        try {
          await deleteOtherSessionsUser();
          toast.success("Other sessions removed");
          load();
        } catch {
          toast.error("Error");
        }
      },
    });
  };

  return (
    <div className="w-full">

      <Card>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">Sessions</h1>

          <Button variant="danger" size="sm" onClick={removeOthers}>
            Logout others
          </Button>
        </div>

        {/* LIST */}
        <div className="divide-y">

          {sessions.length === 0 && (
            <p className="text-sm text-gray-500 py-4">
              No active sessions
            </p>
          )}

          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-start py-3 gap-4"
            >
              {/* INFO */}
              <div className="flex flex-col gap-1 min-w-0">

                <span className="text-sm font-medium">
                  {s.ip}
                </span>

                <span className="text-xs text-gray-500 break-all">
                  {s.userAgent}
                </span>

                {s.isCurrent && (
                  <span className="text-xs text-green-600 font-medium">
                    Current session
                  </span>
                )}

              </div>

              {/* ACTION */}
              {!s.isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSession(s.id)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}

        </div>
      </Card>

    </div>
  );
}