export default function TableSkeleton({ rows = 6 }) {
  return (
    <div className="p-6  bg-white rounded-lg shadow-md space-y-6">
      {/* 🔹 Title */}
      <div className="h-6 w-48 bg-slate-200 rounded-md animate-pulse" />

      {/* 🔹 Top controls (show entries + search) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Show entries */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-10 bg-slate-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-10 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Search input */}
        <div className="h-8 w-60 bg-slate-200 rounded animate-pulse" />
      </div>

      {/* 🔹 Table Header */}
      <div className="grid grid-cols-6 gap-4 bg-slate-100 p-2 rounded-md">
        {["No.", "Customer", "Sekolah", "Barang", "Tanggal", "Status"].map(
          (col, i) => (
            <div
              key={i}
              className="h-4 w-full bg-slate-300 rounded animate-pulse"
            />
          )
        )}
      </div>

      {/* 🔹 Table Rows */}
      <div className="space-y-3">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-4 items-center">
            {[...Array(6)].map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 w-full bg-slate-200 rounded animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>

      {/* 🔹 Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-10 bg-slate-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
