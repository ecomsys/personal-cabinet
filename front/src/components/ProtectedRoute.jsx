import { useAuthStore } from "@/store/auth.store";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, role }) {
  const { user, loading, logined } = useAuthStore();

  //  ВАЖНО: ждём пока init закончится
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Protected route Loading...
      </div>
    );

  if (!user && !logined) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
