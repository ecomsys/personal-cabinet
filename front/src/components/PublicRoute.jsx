import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export const PublicRoute = ({ children }) => {
  const { user, loading, logined } = useAuthStore();

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Public route Loading...
      </div>
    );

  if (user && logined) {
    return <Navigate to="/" replace />;
  }

  return children;
};
