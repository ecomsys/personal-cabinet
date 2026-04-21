import { useEffect, useState } from "react";
import {
  getSessions,
  deleteSession,
  deleteOtherSessions,
} from "@/api/profile.api";

import { useModalStore } from "@/store/modal.store.js";
import toast from "react-hot-toast";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);

  const openConfirm = useModalStore((s) => s.openConfirm);

  const load = () => {
    getSessions().then(setSessions);
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
          await deleteSession(id);
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
          await deleteOtherSessions();
          toast.success("Other sessions removed");
          load();
        } catch {
          toast.error("Error");
        }
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Sessions</h1>

        <button
          onClick={removeOthers}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout others
        </button>
      </div>

      {sessions.map((s) => (
        <div
          key={s.id}
          className="border p-3 rounded flex justify-between items-center"
        >
          <div>
            <p className="text-sm">{s.ip}</p>
            <p className="text-xs text-gray-500">{s.userAgent}</p>

            {s.isCurrent && (
              <span className="text-green-600 text-xs">
                current session
              </span>
            )}
          </div>

          {!s.isCurrent && (
            <button
              onClick={() => removeSession(s.id)}
              className="text-red-500 text-sm"
            >
              remove
            </button>
          )}
        </div>
      ))}

    </div>
  );
}