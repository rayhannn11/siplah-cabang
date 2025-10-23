import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoutes";
import { AuthLayout } from "../layouts/AuthLayout";

import AdminRoutes from "../routes/AdminRoutes";
// import ClientRoutes from "../routes/ClientRoutes";
// import { useAuthStore } from "../stores";

// === Loader ===
const AppLoader = lazy(() => import("../components/loader/app-loader"));

// === Pages ===
const Login = lazy(() => import("../pages/auth/Login"));
const NotFound = lazy(() => import("../pages/auth/NotFound"));

// const LoginCallback = lazy(() => import("../pages/auth/LoginCallback"));

export default function AppRoutes() {
  //   const { user } = useAuthStore();
  const combinedRoutes = [...AdminRoutes()];

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kalau path saat ini adalah '/' maka redirect ke '/login'
    if (location.pathname === "/") {
      navigate("/cabang/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem("tourSeen");

    if (stored) {
      const { seen, timestamp } = JSON.parse(stored);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

      // kalau sudah lebih dari 24 jam, reset lagi ke false
      if (now - timestamp > twentyFourHours) {
        localStorage.setItem(
          "tourSeen",
          JSON.stringify({ seen: false, timestamp: now })
        );
      }
    } else {
      // belum pernah diset
      localStorage.setItem(
        "tourSeen",
        JSON.stringify({ seen: false, timestamp: Date.now() })
      );
    }
  }, []);

  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        {/* === PUBLIC === */}
        <Route path="/cabang" element={<PublicRoutes />}>
          <Route index element={<Navigate to="/cabang/login" replace />} />

          <Route path="/cabang/login" element={<Login />} />
          {/* <Route path="login-callback" element={<LoginCallback />} /> */}
        </Route>

        {/* === PROTECTED === */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }
        >
          {combinedRoutes.map((route, i) => (
            <Route
              key={i}
              path={route.path.replace(/^\//, "")}
              element={route.element}
            />
          ))}
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
