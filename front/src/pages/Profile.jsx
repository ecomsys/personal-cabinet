import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { updateProfileUser, uploadAvatarUser } from "@/api/user.api";
import { AvatarUploader } from "@/components/AvatarUploader";

import { Input, Button, Textarea, FormField, Card } from "@/components/ui";
import toast from "react-hot-toast";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [error] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setStatus(user.status || "");
    setAvatarPreview(user.avatarUrl || null);
    setAvatarFile(null);
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarSelect = (file) => {
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      let avatarUrl = user?.avatarUrl;

      if (avatarFile) {
        const avatarRes = await uploadAvatarUser(avatarFile);
        avatarUrl = avatarRes.avatarUrl;
      }

      //  формируем payload нормально
      const payload = {};

      if (name.trim()) payload.name = name.trim();
      if (status.trim()) payload.status = status.trim();

      let profileRes = {};

      // вызываем только если есть что обновлять
      if (Object.keys(payload).length > 0) {
        profileRes = await updateProfileUser(payload);
      }

      const updatedUser = {
        ...user,
        ...profileRes,
        avatarUrl,
      };

      setUser(updatedUser);

      toast.success("Profile updated");

      setAvatarFile(null);
    } catch (e) {
      toast.error(e?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="w-full space-y-6">
        <h1 className="text-xl font-semibold text-center">Profile</h1>

        {/* AVATAR */}
        <div className="flex flex-col items-center space-y-4">
          <AvatarUploader
            avatarUrl={avatarPreview}
            loading={loading}
            onUpload={handleAvatarSelect}
          />

          <p className="text-sm text-gray-500">Click avatar to change</p>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <FormField label="Name" error={error}>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>

          <FormField label="Status" error={error}>
            <Textarea
              value={status}
              rows={3}
              onChange={(e) => setStatus(e.target.value)}
            />
          </FormField>
        </div>

        {/* SAVE */}
        <Button
          onClick={saveProfile}
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </Card>
    </div>
  );
}
