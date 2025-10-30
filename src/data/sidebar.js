import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Wallet,
  Circle,
  Users,
  ChartNoAxesCombined,
  User,
  LogOut,
  BadgeAlert,
  Building2,
  History,
  ShieldAlert,
  Package2,
  FileWarning,
} from "lucide-react";

// export const adminNavigation = [
//   {
//     section: "",
//     items: [
//       {
//         name: "Dashboard",
//         href: "/dashboard",
//         icon: LayoutDashboard,
//       },
//     ],
//   },
//   {
//     section: "ORDER",
//     items: [
//       {
//         name: "Semua Pesanan",
//         href: "/orders",
//         icon: Package2,
//       },
//       {
//         name: "Pesanan Belum Konfirmasi",
//         href: "/orders/unconfirmed",
//         icon: FileWarning,
//       },
//       // {
//       //   name: "Dari CV",
//       //   icon: Building2,
//       //   submenu: [
//       //     { name: "Semua Pesanan", href: "/orders/all", icon: Circle },
//       //     { name: "Pesanan Baru", href: "/orders/new", icon: Circle },
//       //     {
//       //       name: "Pesanan Diproses",
//       //       href: "/orders/processing",
//       //       icon: Circle,
//       //     },
//       //     { name: "Pesanan Dikirim", href: "/orders/shipped", icon: Circle },
//       //     {
//       //       name: "Pesanan Kedaluwarsa",
//       //       href: "/orders/expired",
//       //       icon: Circle,
//       //     },
//       //     {
//       //       name: "Pesanan Dibatalkan",
//       //       href: "/orders/cancelled",
//       //       icon: Circle,
//       //     },
//       //   ],
//       // },
//     ],
//   },
//   {
//     section: "FINANCE",
//     items: [
//       {
//         name: "Pembayaran",
//         href: "/payments/all",
//         icon: Wallet,
//       },
//     ],
//   },
//   // {
//   //   section: "FINANCE",
//   //   items: [
//   //     {
//   //       name: "Pembayaran",
//   //       icon: Wallet,
//   //       submenu: [
//   //         { name: "Semua", href: "/payments/all", icon: Circle },
//   //         {
//   //           name: "Kurang Lengkap",
//   //           href: "/payments/incomplete",
//   //           icon: Circle,
//   //         },
//   //         { name: "Verifikasi", href: "/payments/verification", icon: Circle },
//   //       ],
//   //     },
//   //     {
//   //       name: "Belum Konfirmasi Bayar",
//   //       href: "/payments/unconfirmed",
//   //       icon: BadgeAlert,
//   //     },
//   //   ],
//   // },
//   {
//     section: "MASTER",
//     items: [
//       {
//         name: "Mitra Active",
//         href: "/mitra",
//         icon: Users,
//       },
//       {
//         name: "Mitra Inactive",
//         href: "/mitra/nonaktif",
//         icon: ShieldAlert,
//       },
//       {
//         name: "Mitra History",
//         href: "/mitra/history",
//         icon: History,
//       },
//       // {
//       //   name: "Laporan Payment",
//       //   icon: FileText,
//       //   submenu: [
//       //     {
//       //       name: "Pemabayaran Dari Sekolah",
//       //       href: "/report/payment-satdik",
//       //       icon: Circle,
//       //     },
//       //     {
//       //       name: "Pembayaran Ke CV",
//       //       href: "/report/payment-cv",
//       //       icon: Circle,
//       //     },
//       //   ],
//       // },
//     ],
//   },
//   {
//     section: "LAIN-LAIN",
//     items: [
//       {
//         name: "Profil",
//         href: "/profile",
//         icon: User,
//       },
//       // {
//       //   name: "Logout",
//       //   icon: LogOut,
//       // },
//     ],
//   },
// ];

export const adminNavigation = [
  {
    section: "",
    items: [
      {
        name: "Dashboard",
        href: "/internal/mitraku/dashboard",
        icon: LayoutDashboard,
        tourId: "menu-dashboard", // ✅ tambahin ini
      },
    ],
  },
  {
    section: "ORDER",
    items: [
      {
        name: "Semua Pesanan",
        href: "/internal/mitraku/orders",
        icon: Package2,
        tourId: "menu-orders", // ✅
      },
      {
        name: "Pesanan Belum Konfirmasi",
        href: "/internal/mitraku/orders/unconfirmed",
        icon: FileWarning,
        tourId: "menu-unconfirmed", // ✅
      },
    ],
  },
  {
    section: "FINANCE",
    items: [
      {
        name: "Pembayaran",
        href: "/internal/mitraku/payments/all",
        icon: Wallet,
        tourId: "menu-finance", // ✅
      },
    ],
  },
  {
    section: "MASTER",
    items: [
      {
        name: "Rekanan Aktif",
        href: "/internal/mitraku/rekanan",
        icon: Users,
        tourId: "menu-rekanan-active", // ✅
      },
      {
        name: "Rekanan Nonaktif",
        href: "/internal/mitraku/rekanan/nonaktif",
        icon: ShieldAlert,
        tourId: "menu-rekanan-inactive", // ✅
      },
      {
        name: "Rekanan History",
        href: "/internal/mitraku/rekanan/history",
        icon: History,
        tourId: "menu-rekanan-history", // ✅
      },
    ],
  },
  {
    section: "LAPORAN",
    items: [
      {
        name: "Tagihan Eureka",
        href: "/internal/mitraku/report/payment-eureka",
        icon: FileText,
        tourId: "menu-tagihan-eureka",
        visibleFor: [49], // Only visible for cabang_id 49
      },
      {
        name: "Tagihan Cabang",
        href: "/internal/mitraku/report/orders-report",
        icon: ChartNoAxesCombined,
        tourId: "menu-tagihan-cabang",
        visibleFor: [49],
      },
    ],
  },
  {
    section: "LAIN-LAIN",
    items: [
      {
        name: "Profil",
        href: "/internal/mitraku/profile",
        icon: User,
        tourId: "menu-profile", // ✅
      },
    ],
  },
];
