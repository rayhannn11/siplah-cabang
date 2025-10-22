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

const AdminRoutes = () => {
    const fullRoutes = [
        // Dashboard
        { path: "/dashboard", element: <Dashboard /> },

        // Dari CV
        { path: "/orders", element: <Orders mode="dariEureka" /> },
        {
            path: "/orders/unconfirmed",
            element: <OrdersUnconfirmed mode="dariEureka" />,
        },

        { path: "/orders/all", element: <Orders mode="all" /> },
        { path: "/orders/new", element: <Orders mode="new" /> },
        { path: "/orders/processing", element: <Orders mode="processing" /> },
        { path: "/orders/shipped", element: <Orders mode="shipped" /> },
        { path: "/orders/expired", element: <Orders mode="expired" /> },
        { path: "/orders/cancelled", element: <Orders mode="cancelled" /> },
        { path: "/orders/detail/:id", element: <DetailOrder /> },

        // Pembayaran
        { path: "/payments/all", element: <Payments mode="all" /> },
        { path: "/payments/incomplete", element: <Payments mode="incomplete" /> },
        {
            path: "/payments/verification",
            element: <Payments mode="verification" />,
        },

        { path: "/payments/unconfirmed", element: <Payments mode="unconfirmed" /> },
        { path: "/payments/:id", element: <DetailPayment /> },

        // Master
        { path: "/rekanan", element: <Mitra /> },
        { path: "/rekanan/orders/:id", element: <Orders mode="mitraOrders" /> },
        {
            path: "/rekanan/order/:id",
            element: <DetailOrder mode="mitraDetailOrder" />,
        },
        {
            path: "/rekanan/detail/:id",
            element: <MitraDetail />,
        },
        { path: "/rekanan/history", element: <MitraHistory /> },
        { path: "/rekanan/nonaktif", element: <MitraNonAktif /> },
        { path: "/rekanan/payments-report", element: <PaymentsReport /> },

        // Laporan Payment
        { path: "/report/payment-satdik", element: <PaymentSatdik /> },
        { path: "/report/payment-cv", element: <PaymentSchool /> },
        { path: "/report/payment-eureka", element: <PaymentEureka /> },

        // Lain-lain
        { path: "/profile", element: <Profile /> },
    ];

    return fullRoutes;
};

export default AdminRoutes;
