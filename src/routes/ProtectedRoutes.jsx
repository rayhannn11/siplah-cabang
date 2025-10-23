import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores";

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  // const token = "sss";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/cabang/login" state={{ from: location }} replace />;
  }

  return children;
}
