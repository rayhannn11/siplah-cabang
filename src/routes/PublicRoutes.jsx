import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores";

export default function PublicRoutes() {
  const { token } = useAuthStore();
  // const token = "sss"; // simulasi: belum login

  if (token) {
    return <Navigate to="/internal/mitraku/dashboard" replace />;
  }

  return (
    <div>
      {/* Bisa tambah layout public seperti logo/login background */}
      <Outlet />
    </div>
  );
}
