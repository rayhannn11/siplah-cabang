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
const OrdersUnconfirmed = lazy(() => import("../pages/orders/OrdersUnconfirmed"));

const DetailOrder = lazy(() => import("../pages/orders/DetailOrder"));

// Report
const PaymentSatdik = lazy(() => import("../pages/report/PaymentSatdik"));
const PaymentSchool = lazy(() => import("../pages/report/PaymentSchool"));
const PaymentEureka = lazy(() => import("../pages/report/PaymentEureka"));
const OrdersReport = lazy(() => import("../pages/report/OrdersReport"));
const ProviderTransactions = lazy(() => import("../pages/report/ProviderTransactions"));

const AdminRoutes = () => {
    const fullRoutes = [
        // Dashboard
        { path: "/internal/mitraku/dashboard", element: <Dashboard /> },

        // Dari CV
        { path: "/internal/mitraku/orders", element: <Orders mode="dariEureka" /> },
        {
            path: "/internal/mitraku/orders/unconfirmed",
            element: <OrdersUnconfirmed mode="dariEureka" />,
        },

        { path: "/internal/mitraku/orders/all", element: <Orders mode="all" /> },
        { path: "/internal/mitraku/orders/new", element: <Orders mode="new" /> },
        {
            path: "/internal/mitraku/orders/processing",
            element: <Orders mode="processing" />,
        },
        {
            path: "/internal/mitraku/orders/shipped",
            element: <Orders mode="shipped" />,
        },
        {
            path: "/internal/mitraku/orders/expired",
            element: <Orders mode="expired" />,
        },
        {
            path: "/internal/mitraku/orders/cancelled",
            element: <Orders mode="cancelled" />,
        },
        { path: "/internal/mitraku/orders/detail/:id", element: <DetailOrder /> },

        // Pembayaran
        {
            path: "/internal/mitraku/payments/all",
            element: <Payments mode="all" />,
        },
        {
            path: "/internal/mitraku/payments/incomplete",
            element: <Payments mode="incomplete" />,
        },
        {
            path: "/internal/mitraku/payments/verification",
            element: <Payments mode="verification" />,
        },

        {
            path: "/internal/mitraku/payments/unconfirmed",
            element: <Payments mode="unconfirmed" />,
        },
        { path: "/internal/mitraku/payments/:id", element: <DetailPayment /> },

        // Master
        { path: "/internal/mitraku/rekanan", element: <Mitra /> },
        {
            path: "/internal/mitraku/rekanan/orders/:id",
            element: <Orders mode="mitraOrders" />,
        },
        {
            path: "/internal/mitraku/rekanan/order/:id",
            element: <DetailOrder mode="mitraDetailOrder" />,
        },
        {
            path: "/internal/mitraku/rekanan/detail/:id",
            element: <MitraDetail />,
        },
        { path: "/internal/mitraku/rekanan/history", element: <MitraHistory /> },
        { path: "/internal/mitraku/rekanan/nonaktif", element: <MitraNonAktif /> },
        {
            path: "/internal/mitraku/rekanan/payments-report",
            element: <PaymentsReport />,
        },

        // Laporan Payment
        {
            path: "/internal/mitraku/report/payment-satdik",
            element: <PaymentSatdik />,
        },
        { path: "/internal/mitraku/report/payment-cv", element: <PaymentSchool /> },
        {
            path: "/internal/mitraku/report/payment-eureka",
            element: <PaymentEureka />,
        },
        {
            path: "/internal/mitraku/report/orders-report",
            element: <OrdersReport />,
        },
        {
            path: "/internal/mitraku/report/provider-transactions",
            element: <ProviderTransactions />,
        },

        // Lain-lain
        { path: "/internal/mitraku/profile", element: <Profile /> },
    ];

    return fullRoutes;
};

export default AdminRoutes;
