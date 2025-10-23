import { lazy } from "react";

// Dashboard
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

// Auth
const Profile = lazy(() => import("../pages/auth/Profile"));

// Finance
const Payments = lazy(() => import("../pages/finance/Payments"));
const DetailPayment = lazy(() => import("../pages/finance/DetailPayment"));

// Master
const Mitra = lazy(() => import("../pages/master/Mitra"));
const MitraDetail = lazy(() => import("../pages/master/MitraDetail"));
const MitraHistory = lazy(() => import("../pages/master/MitraHistory"));
const MitraNonAktif = lazy(() => import("../pages/master/MitraNonAktive"));
const PaymentsReport = lazy(() => import("../pages/master/PaymentsReport"));

// Orders
const Orders = lazy(() => import("../pages/orders/Orders"));
const OrdersUnconfirmed = lazy(() =>
  import("../pages/orders/OrdersUnconfirmed")
);

const DetailOrder = lazy(() => import("../pages/orders/DetailOrder"));

// Report
const PaymentSatdik = lazy(() => import("../pages/report/PaymentSatdik"));
const PaymentSchool = lazy(() => import("../pages/report/PaymentSchool"));
const PaymentEureka = lazy(() => import("../pages/report/PaymentEureka"));
const OrdersReport = lazy(() => import("../pages/report/OrdersReport"));

const AdminRoutes = () => {
  const fullRoutes = [
    // Dashboard
    { path: "/cabang/dashboard", element: <Dashboard /> },

    // Dari CV
    { path: "/cabang/orders", element: <Orders mode="dariEureka" /> },
    {
      path: "/cabang/orders/unconfirmed",
      element: <OrdersUnconfirmed mode="dariEureka" />,
    },

    { path: "/cabang/orders/all", element: <Orders mode="all" /> },
    { path: "/cabang/orders/new", element: <Orders mode="new" /> },
    {
      path: "/cabang/orders/processing",
      element: <Orders mode="processing" />,
    },
    { path: "/cabang/orders/shipped", element: <Orders mode="shipped" /> },
    { path: "/cabang/orders/expired", element: <Orders mode="expired" /> },
    {
      path: "/cabang/orders/cancelled",
      element: <Orders mode="cancelled" />,
    },
    { path: "/cabang/orders/detail/:id", element: <DetailOrder /> },

    // Pembayaran
    { path: "/cabang/payments/all", element: <Payments mode="all" /> },
    {
      path: "/cabang/payments/incomplete",
      element: <Payments mode="incomplete" />,
    },
    {
      path: "/cabang/payments/verification",
      element: <Payments mode="verification" />,
    },

    {
      path: "/cabang/payments/unconfirmed",
      element: <Payments mode="unconfirmed" />,
    },
    { path: "/cabang/payments/:id", element: <DetailPayment /> },

    // Master
    { path: "/cabang/rekanan", element: <Mitra /> },
    {
      path: "/cabang/rekanan/orders/:id",
      element: <Orders mode="mitraOrders" />,
    },
    {
      path: "/cabang/rekanan/order/:id",
      element: <DetailOrder mode="mitraDetailOrder" />,
    },
    {
      path: "/cabang/rekanan/detail/:id",
      element: <MitraDetail />,
    },
    { path: "/cabang/rekanan/history", element: <MitraHistory /> },
    { path: "/cabang/rekanan/nonaktif", element: <MitraNonAktif /> },
    { path: "/cabang/rekanan/payments-report", element: <PaymentsReport /> },

    // Laporan Payment
    { path: "/cabang/report/payment-satdik", element: <PaymentSatdik /> },
    { path: "/cabang/report/payment-cv", element: <PaymentSchool /> },
    { path: "/cabang/report/payment-eureka", element: <PaymentEureka /> },
    { path: "/cabang/report/orders-report", element: <OrdersReport /> },

    // Lain-lain
    { path: "/cabang/profile", element: <Profile /> },
  ];

  return fullRoutes;
};

export default AdminRoutes;
