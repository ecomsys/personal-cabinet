import { useAuthStore } from "@/store/auth.store";
import { Navigate } from "react-router-dom";
import { FullscreenLoader } from "@/components/FullScreenLoader";

export function ProtectedRoute({ children, role }) {
  const { user, loading, logined } = useAuthStore();

  //  ВАЖНО: ждём пока init закончится
  if (loading)
    return <FullscreenLoader />;

  if (!user && !logined) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
