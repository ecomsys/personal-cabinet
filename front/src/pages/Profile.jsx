import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { updateProfile, uploadAvatar } from "@/api/profile.api";
import { AvatarUploader } from "@/components/AvatarUploader";

import { Input, Button, Textarea, FormField } from "@/components/ui";
import toast from "react-hot-toast";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const [error] = useState(false);

  // draft avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // sync user → form
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setStatus(user.status || "");
    setAvatarPreview(user.avatarUrl || null);
    setAvatarFile(null);
  }, [user]);

  // cleanup blob
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // select avatar (draft only)
  const handleAvatarSelect = (file) => {
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      let avatarUrl = user?.avatarUrl;

      // 1. upload avatar ONLY if changed
      if (avatarFile) {
        const avatarRes = await uploadAvatar(avatarFile);
        avatarUrl = avatarRes.avatarUrl;
      }

      // 2. update profile
      const profileRes = await updateProfile({
        name,
        status,
      });

      // 3. SAFE merge (нормализация)
      const updatedUser = {
        ...user,
        ...profileRes,
        avatarUrl, // <- всегда один источник истины
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
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h1 className="text-xl font-semibold text-center">Profile</h1>

      {/* AVATAR CENTERED */}
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
      <div className="flex justify-center">
        <Button onClick={saveProfile} disabled={loading} variant="primary" className="w-full">
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
