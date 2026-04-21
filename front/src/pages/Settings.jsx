import { useState } from "react";
import { updatePassword, updateEmail } from "@/api/profile.api";
import { Modal, Button, Input, FormField } from "@/components/ui";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  // modal state
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const showModal = (title, message) => {
    setModal({
      open: true,
      title,
      message,
    });
  };

  const handlePassword = async () => {
    try {
      await updatePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      showModal("Success", "Password updated successfully");
    } catch (e) {
      showModal("Error", e.message || "Something went wrong");
    }
  };

  const handleEmail = async () => {
    try {
      await updateEmail({
        newEmail,
        password: emailPassword,
      });

      setNewEmail("");
      setEmailPassword("");

      showModal("Success", "Email updated successfully");
    } catch (e) {
      showModal("Error", e.message || "Something went wrong");
    }
  };

  return (
    <div className="space-y-10">
      {/* PASSWORD */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Change Password</h2>

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

        <Button onClick={handlePassword}>Update password</Button>
      </div>

      {/* EMAIL */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Change Email</h2>

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

        <Button onClick={handleEmail}>Update email</Button>
      </div>

      {/* MODAL */}
      <Modal
        open={modal.open}
        onOpenChange={(open) => setModal((prev) => ({ ...prev, open }))}
        title={modal.title}
        description="Operation completed successfully"
      >
        <p className="text-sm text-gray-600">{modal.message}</p>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => setModal((prev) => ({ ...prev, open: false }))}
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
}
