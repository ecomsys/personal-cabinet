import { useState } from "react";
import toast from "react-hot-toast";
import { mapAuthError } from "../utils/error-map";

export function useAuthForm(authFn, onSuccess) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (email, password, e) => {
    if (e) e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await authFn(email, password);

      if (!res.ok) {
        const message = mapAuthError(res.code);

        setError(message);

        toast.dismiss();
        toast.error(message);

        return;
      }

      onSuccess?.();
    } catch (err) {
      const msg = "Something went wrong";

      if (err) {
        setError(msg);
        toast.dismiss();
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    handleSubmit,
  };
}
