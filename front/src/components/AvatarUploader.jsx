import { useState, useEffect, useRef } from "react";
import { Avatar, Spinner } from "@/components/ui";

export function AvatarUploader({ avatarUrl, onUpload, loading }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const foo = () => setPreview(avatarUrl || null);
    foo();
  }, [avatarUrl]);

  const handleFile = (file) => {
    if (!file || loading) return;

    const url = URL.createObjectURL(file);

    setPreview(url); // preview
    onUpload?.(file); // backend
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const openPicker = () => {
    if (loading) return;
    inputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="relative w-fit">
      {/* hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* clickable avatar */}
      <div onClick={openPicker} className="cursor-pointer relative group">
        <Avatar src={preview || "/default-avatar.png"} size="xl" />

        {/* hover overlay */}
        <div className="cursor-pointer absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
          <svg className="w-8 h-8 text-white">
            <use
              xlinkHref={`${import.meta.env.BASE_URL}icons/sprite/sprite.svg#edit`}
            />
          </svg>
        </div>
      </div>

      {/* loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
          <Spinner size="sm" className="text-white" />
        </div>
      )}
    </div>
  );
}
