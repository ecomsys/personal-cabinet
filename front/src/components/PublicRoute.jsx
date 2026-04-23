import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { FullscreenLoader } from "@/components/FullScreenLoader";

export const PublicRoute = ({ children }) => {
  const { user, loading, logined } = useAuthStore();

  if (loading)
    return <FullscreenLoader />;

  if (user && logined) {
    return <Navigate to="/" replace />;
  }

  return children;
};
