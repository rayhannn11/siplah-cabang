import {
  ShoppingCart,
  Users,
  FileText,
  BarChart3,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
  Building2,
  Package,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import useFetch from "../../hooks/useFetch";
import { fetchOrdersStats, fetchPaymentsSummary } from "../../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Fetch order stats
  const {
    data: dataOrdersStats,
    initialLoading: initialLoadingStats,
    error: errorStats,
  } = useFetch(["ordersStats"], fetchOrdersStats, {
    refetchOnWindowFocus: false,
  });

  console.log(dataOrdersStats, "dataOrdersStats");

  const {
    data: dataPaymentsStats,
    initialLoading: initialLoadingPaymentsSummary,
    error: errorPaymentsSummary,
  } = useFetch(["paymentsSummary"], fetchPaymentsSummary, {
    refetchOnWindowFocus: false,
  });

  console.log(dataPaymentsStats?.data);

  // 🔹 Gunakan useMemo agar tidak trigger re-render berulang
  const stats = useMemo(() => {
    if (!dataOrdersStats?.data) return [];

    const byStatus = dataOrdersStats.data.by_status || {};

    return [
      {
        label: "Pesanan Baru",
        value: byStatus[0]?.count || 0,
        color: "bg-sky-500",
        icon: ShoppingCart,
      },
      {
        label: "Diproses",
        value: byStatus[2]?.count || 0,
        color: "bg-indigo-500",
        icon: Truck,
      },
      {
        label: "Dikirim",
        value: byStatus[3]?.count || 0,
        color: "bg-blue-500",
        icon: Truck,
      },
      {
        label: "Selesai",
        value: byStatus[20]?.count || 0,
        color: "bg-emerald-600",
        icon: CheckCircle2,
      },
      {
        label: "Dibatalkan",
        value: byStatus[7]?.count || 0,
        color: "bg-rose-600",
        icon: XCircle,
      },
      {
        label: "Total Pesanan",
        value: dataOrdersStats.data.total_orders || 0,
        color: "bg-green-600",
        icon: BarChart3,
      },
      {
        label: "Total Nilai Pesanan",
        value: dataOrdersStats.data.total_amount_formatted || "Rp0",
        color: "bg-amber-600",
        icon: Package,
      },
      {
        label: "Total Cabang",
        value: dataOrdersStats.data.malls_count || 0,
        color: "bg-violet-600",
        icon: Building2,
      },
    ];
  }, [dataOrdersStats]);

  // memoized chart data & options (important for react-chartjs-2)
  const chartData = useMemo(
    () => ({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agt",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
      datasets: [
        {
          label: "Grafik Perkembangan Perolehan",
          data: [0, 0, 0, 0, 1000000, 15000000, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#F39C19",
          borderRadius: 6,
        },
      ],
    }),
    []
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" },
      },
    }),
    []
  );

  const malls = dataOrdersStats?.data?.top_malls || [];

  // === Definisi Kolom ===
  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor("rank", {
        header: "Rank",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("mall_name", {
        header: "Nama Mall",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("transaction_count", {
        header: "Jumlah Transaksi",
        cell: (info) => info.getValue().toLocaleString("id-ID"),
      }),
      columnHelper.accessor("total_amount_formatted", {
        header: "Total Nilai Transaksi",
        cell: (info) => info.getValue(),
      }),
    ],
    []
  );

  // === Inisialisasi Table ===
  const table = useReactTable({
    data: malls,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`card shadow-md text-white ${stat.color} transition-transform hover:scale-[1.02]`}
          >
            <div className="card-body p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div
                    className={`flex flex-col ${
                      stat.label.includes("Pembayaran") ? "items-start" : ""
                    }`}
                  >
                    <p
                      className={`font-bold leading-tight ${
                        stat.label.includes("Pembayaran")
                          ? "text-base sm:text-lg  max-w-[160px]"
                          : "text-2xl"
                      }`}
                    >
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString("id-ID")
                        : stat.value}
                    </p>
                    <p
                      className={`${
                        stat.label.includes("Pembayaran")
                          ? "text-xs mt-1"
                          : "text-sm"
                      }`}
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
                <stat.icon className="h-10 w-10 opacity-80" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table lainnya */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg mb-3">Statistik Pembayaran</h2>

            {/* === RINGKASAN TOTAL === */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="text-lg font-semibold text-gray-800">
                  {dataPaymentsStats?.data?.total_payment_formatted || "-"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-500">30 Hari Terakhir</p>
                <p className="text-lg font-semibold text-gray-800">
                  {dataPaymentsStats?.data?.recent_payment_30days_formatted ||
                    "-"}
                </p>
              </div>
            </div>

            {/* === BY ORDER STATUS === */}
            <h3 className="text-md font-semibold mb-2">Per Status Pesanan</h3>
            <div className="overflow-x-auto mb-6">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr>
                    <th className="w-1/3">Status</th>
                    <th className="text-center">Jumlah Order</th>
                    <th className="text-right">Total Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(
                    dataPaymentsStats?.data?.by_order_status || {}
                  ).map((item) => (
                    <tr key={item.status_id}>
                      <td className="font-medium">{item.status_name}</td>
                      <td className="text-center">{item.order_count}</td>
                      <td className="text-right">
                        {item.total_amount_formatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* === BY VA STATUS === */}
            <h3 className="text-md font-semibold mb-2">
              Per Status Virtual Account
            </h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr>
                    <th className="w-1/3">Status VA</th>
                    <th className="text-center">Jumlah Order</th>
                    <th className="text-right">Total Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(
                    dataPaymentsStats?.data?.by_va_status || {}
                  ).map((item) => (
                    <tr key={item.va_status}>
                      <td className="font-medium capitalize">
                        {item.va_status}
                      </td>
                      <td className="text-center">{item.order_count}</td>
                      <td className="text-right">
                        {item.total_amount_formatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Table Top REkanan */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-lg">Produk Populer</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
