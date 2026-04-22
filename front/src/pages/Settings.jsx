import { useState } from "react";
import { updatePasswordUser, updateEmailUser } from "@/api/user.api";
import { Modal, Button, Input, FormField, PanelCard } from "@/components/ui";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const showModal = (title, message) => {
    setModal({ open: true, title, message });
  };

  const handlePassword = async () => {
    try {
      await updatePasswordUser({ currentPassword, newPassword });

      setCurrentPassword("");
      setNewPassword("");

      showModal("Success", "Password updated successfully");
    } catch (e) {
      showModal("Error", e.message || "Something went wrong");
    }
  };

  const handleEmail = async () => {
    try {
      await updateEmailUser({ newEmail, password: emailPassword });

      setNewEmail("");
      setEmailPassword("");

      showModal("Success", "Email updated successfully");
    } catch (e) {
      showModal("Error", e.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-full grid sm:grid-cols-2 gap-6">

      {/* PASSWORD */}
      <PanelCard title="Change Password">
        <FormField label="Current password">
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </FormField>

        <FormField label="New password">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormField>

        <div className="flex justify-end">
          <Button onClick={handlePassword}>
            Update password
          </Button>
        </div>
      </PanelCard>

      {/* EMAIL */}
      <PanelCard title="Change Email">
        <FormField label="New email">
          <Input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </FormField>

        <FormField label="Current password">
          <Input
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
          />
        </FormField>

        <div className="flex justify-end">
          <Button onClick={handleEmail}>
            Update email
          </Button>
        </div>
      </PanelCard>

      {/* MODAL */}
      <Modal
        open={modal.open}
        onOpenChange={(open) =>
          setModal((prev) => ({ ...prev, open }))
        }
        title={modal.title}
        description={modal.message}
      >
        <div className="flex justify-end mt-4">
          <Button
            onClick={() =>
              setModal((prev) => ({ ...prev, open: false }))
            }
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
}