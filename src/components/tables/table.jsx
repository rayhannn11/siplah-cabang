import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  FileDown,
  FileText,
  ArrowUpAZ,
  ArrowDownAZ,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { isValid, parseISO, format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Select from "react-select";

const Table = ({
  dataSource,
  columnConfig = { showSearchInput: true },
  labelMapping = {},
  tableStyleMapping,
  name = "Table Data",
  excel_name = "data",
  isSorting = true,
  widgets = [], // ⬅️ tambahan untuk section paling atas (dinamis)
  tableConfig = {},
  filterConfig = {},
}) => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [columnSizing, setColumnSizing] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({});

  // set initial data
  useEffect(() => {
    if (dataSource) {
      const cleanedData = dataSource.map(({ original_id, ...rest }) => rest);
      setData(cleanedData);
    }
  }, [dataSource]);

  // filter options select
  const filterOptions = useMemo(() => {
    const options = {};
    columnConfig.filterFields?.forEach((field) => {
      options[field] = [...new Set(data.map((item) => item[field]))];
    });
    return options;
  }, [data, columnConfig.filterFields]);

  // filter handler
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // final filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesGlobal = globalFilter
        ? Object.values(item).some((val) =>
            String(val).toLowerCase().includes(globalFilter.toLowerCase())
          )
        : true;

      const matchesSelect = Object.entries(filters).every(([key, val]) =>
        val ? item[key] === val : true
      );

      return matchesGlobal && matchesSelect;
    });
  }, [data, globalFilter, filters]);

  const columnHelper = createColumnHelper();

  const dynamicColumns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const sample = data[0];
    const keys = Object.keys(sample);

    const columns = keys.map((key) =>
      columnHelper.accessor(key, {
        header: labelMapping[key] || key,
        cell: (info) => info.getValue(),
      })
    );

    if (columnConfig.actions && Array.isArray(columnConfig.actionsList)) {
      columns.push(
        columnHelper.display({
          id: "actions",
          header: () => labelMapping["action"] || "Operasi",
          enableSorting: false,
          enableResizing: false,
          size: 1,
          cell: ({ row }) => (
            <div className="flex items-center justify-center gap-3">
              {columnConfig.actionsList.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => action.onClick(row.original)}
                  className={action.colorClass ?? "text-slate-600 "}
                  title={action.title}
                >
                  <span className="flex items-center gap-1">
                    <action.icon className="w-4 h-4" /> {action.title}
                  </span>
                </button>
              ))}
            </div>
          ),
        })
      );
    }

    return columns;
  }, [data, columnConfig, labelMapping]);

  const table = useReactTable({
    data: filteredData,
    columns: dynamicColumns,
    state: {
      sorting,
      columnSizing,
      pagination: {
        pageIndex: tableConfig?.page - 1, // current page dari parent
        pageSize: tableConfig?.limit, // limit dari parent
      },
    },
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    // kalau mau biar Table bisa trigger ke parent saat ganti page/size
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;

      if (newState.pageSize !== tableConfig?.limit) {
        tableConfig?.onPageSizeChange(newState.pageSize); // callback ke parent
      }
      if (newState.pageIndex !== tableConfig?.page - 1) {
        tableConfig?.onPageChange(newState.pageIndex + 1); // callback ke parent
      }
    },
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // ⚡ penting untuk server-side pagination
    pageCount: Math.ceil(tableConfig?.pagination?.total / tableConfig?.limit), // dari backend (total item)
  });

  // export excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(
      new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${excel_name}.xlsx`
    );
  };

  // export pdf
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(name, 14, 10);
    const tableData = data.map((item) => Object.values(item));
    const tableHead = [Object.keys(data[0] || {})];
    doc.autoTable({ head: tableHead, body: tableData, startY: 15 });
    doc.save(`${excel_name}.pdf`);
  };

  return (
    <div className="overflow-x-auto space-y-4 bg-white p-6 shadow-md">
      {/* 1️⃣ Widgets */}
      <div className={widgets.widgetClass}>
        {widgets?.widgetsContent?.map((widget, idx) => (
          <div
            key={widget.key || idx}
            className={widget.wrapperClass || ""} // <-- dinamis
          >
            {/* Select Widget */}
            {widget.type === "select" && (
              <select
                onChange={(e) => widget.onChange?.(e.target.value)}
                className={
                  widget.selectClass ||
                  "border border-gray-300 rounded px-2 py-1 text-sm w-52"
                } // dinamis juga
              >
                {widget.options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* Button Widget */}
            {widget.type === "button" &&
              widget.buttons?.map((btn, i) => (
                <button key={i} onClick={btn.onClick} className={btn.classes}>
                  {btn.icon && <btn.icon className="w-4 h-4" />}
                  {btn.text}
                </button>
              ))}
          </div>
        ))}
      </div>

      {/* 2️⃣ Filters Section */}
      <div
        className={`flex flex-col md:flex-row md:items-center ${
          filterConfig?.isFilter ? "md:justify-between" : "md:justify-between"
        } gap-4`}
      >
        {/* show entries */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <select
            className="select select-sm select-bordered"
            value={tableConfig?.pagination?.pageSize || 10}
            onChange={(e) =>
              tableConfig?.onPageSizeChange?.(Number(e.target.value))
            }
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm">entries</span>
        </div>

        {/* filter + search */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
          {filterConfig?.isFilter &&
            filterConfig?.filters?.items?.map((f, idx) => {
              const options =
                f.options?.map((opt) => ({
                  value: opt.value ?? opt.id ?? opt,
                  label: opt.label ?? opt.name ?? String(opt),
                })) || [];

              // Normalize value agar selalu array
              const normalizedValue = Array.isArray(f.value)
                ? f.value
                : f.value
                ? [f.value]
                : [];

              // Cari yang cocok
              const selectedOptions = options.filter((opt) =>
                normalizedValue
                  .map((v) => String(v)) // pastikan semua ke string
                  .includes(String(opt.value))
              );

              // Default konfigurasi Select
              const isMulti = f.isMulti ?? false;
              const isSearchable = f.isSearchable ?? false;

              return (
                <div key={idx} className="flex flex-col gap-1 w-64">
                  <span className="text-xs font-medium">{f.label}</span>
                  <Select
                    classNamePrefix="custom-select"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    options={options}
                    value={selectedOptions}
                    onChange={(selected) => {
                      const values = Array.isArray(selected)
                        ? selected.map((s) => s.value)
                        : selected
                        ? [selected.value]
                        : [];
                      f.onChange?.(values);
                    }}
                    placeholder="Pilih status..."
                    isSearchable={isSearchable}
                    isMulti={isMulti}
                    className="text-sm"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "white",
                        borderColor: state.isFocused ? "#2563EB" : "#CBD5E1",
                        boxShadow: "none",
                        minHeight: "36px",
                        "&:hover": { borderColor: "#2563EB" },
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, backgroundColor: "white" }),
                      menuList: (base) => ({
                        ...base,
                        backgroundColor: "white",
                        color: "#1E293B",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#E2E8F0" : "white",
                        color: "#1E293B",
                        cursor: "pointer",
                      }),
                      singleValue: (base) => ({ ...base, color: "#1E293B" }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "#1E3A8A",
                      }),
                      placeholder: (base) => ({ ...base, color: "#64748B" }),
                    }}
                  />
                </div>
              );
            })}
          {columnConfig.showSearchInput && (
            <div className="relative w-full md:w-64 items-center">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500 z-40 mt-5" />
              <input
                type="text"
                className="input input-sm w-full pl-10 pr-3 border rounded-md mt-5"
                placeholder="Cari data..."
                value={tableConfig.search}
                onChange={(e) => tableConfig.onSearchChange(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* <div className="flex flex-wrap items-center gap-3">
          {columnConfig.showDateFilter && columnConfig.dateFilterComponent}

          {columnConfig.filterFields?.map((field) => (
            <select
              key={field}
              className="select select-sm select-bordered"
              value={filters[field] || ""}
              onChange={(e) => handleFilterChange(field, e.target.value)}
            >
              <option value="">Semua {field}</option>
              {filterOptions[field]?.map((option) => (
                <option key={option} value={option}>
                  {option || "-"}
                </option>
              ))}
            </select>
          ))}

          {columnConfig.showExportExcel && (
            <button
              onClick={handleExportExcel}
              className="btn btn-sm border bg-white text-slate-700"
            >
              <FileDown className="w-4 h-4 mr-1" /> Excel
            </button>
          )}
          {columnConfig.showExportPDF && (
            <button
              onClick={handleExportPDF}
              className="btn btn-sm border bg-white text-red-600"
            >
              <FileText className="w-4 h-4 mr-1" /> PDF
            </button>
          )}
        </div> */}

      {/* 3️⃣ Table */}
      <div className="overflow-x-auto">
        <table className="table w-full ">
          <thead className="text-black ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const columnId = header.column.id;

                  // 🚫 sembunyikan kolom id
                  if (columnId === "id") return null;
                  if (columnId === "mall_id") return null;
                  if (columnId === "actions") return null;

                  const headerClass =
                    tableStyleMapping?.header?.(columnId) || "";

                  return (
                    <th
                      key={header.id}
                      className={`px-3 py-2 text-center  ${headerClass}`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {tableConfig?.loading ? (
              <tr className="min-h-[120px]">
                <td
                  colSpan={table.getAllLeafColumns().length - 1}
                  className="text-center py-10"
                >
                  <span className="loading loading-spinner loading-lg"></span>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr className="min-h-[80px]">
                <td
                  colSpan={table.getAllLeafColumns().length - 1}
                  className="text-center py-4 font-bold bg-[#e3e5e8]"
                >
                  Tidak ada data ditemukan
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => {
                const rowData = row.original;
                const rowClass = tableStyleMapping?.row?.(rowData) || "";

                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const columnId = cell.column.id;
                      if (columnId === "id") return null;
                      if (columnId === "mall_id") return null;

                      let rawValue = rowData[columnId];
                      if (
                        rawValue === null ||
                        rawValue === undefined ||
                        (typeof rawValue === "string" && rawValue.trim() === "")
                      ) {
                        rawValue = "-";
                      }

                      const tdClass =
                        tableStyleMapping?.cellClass?.(columnId, rowData) || "";

                      // === RENDER CUSTOM PER KOLOM ===
                      if (columnId === "actions" && Array.isArray(rawValue)) {
                        return (
                          <td
                            key={cell.id}
                            className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center ${tdClass}`}
                            onClick={(e) => e.stopPropagation()} // prevent row click
                          >
                            <div className="flex justify-center gap-2">
                              {rawValue.map((action, idx) => {
                                const Icon = action.icon;
                                return (
                                  <button
                                    key={idx}
                                    onClick={action.onClick}
                                    className="text-slate-600 p-1.5 rounded-full rounded hover:bg-gray-50 cursor-pointer"
                                  >
                                    {Icon && <Icon className="w-4 h-4" />}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        );
                      }

                      if (columnId === tableConfig?.redirectField) {
                        return (
                          <td
                            key={cell.id}
                            className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center ${tdClass}`}
                          >
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                tableConfig?.onRowRedirect?.(rowData);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium transition-colors"
                            >
                              {rawValue}
                            </span>
                          </td>
                        );
                      }
                      if (columnId === "status_name") {
                        const statusConf = tableStyleMapping.cell.status_name;
                        return (
                          <td
                            key={cell.id}
                            className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center ${tdClass}`}
                          >
                            <span
                              className={`${statusConf.base} ${
                                statusConf.classes[rawValue] ||
                                statusConf.classes.default
                              }`}
                            >
                              {rawValue}
                            </span>
                          </td>
                        );
                      }

                      if (columnId === "approve") {
                        const approveConf = tableStyleMapping.cell.approve;
                        return (
                          <td
                            key={cell.id}
                            className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center ${tdClass}`}
                          >
                            <span
                              className={`${approveConf.base} ${
                                approveConf.classes[rawValue] ||
                                approveConf.classes.default
                              }`}
                            >
                              {rawValue}
                            </span>
                          </td>
                        );
                      }

                      if (columnId === "status") {
                        const statusConf = tableStyleMapping.cell.status;
                        return (
                          <td
                            key={cell.id}
                            className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center ${tdClass}`}
                          >
                            <span
                              className={`${statusConf.base} ${
                                statusConf.classes[rawValue] ||
                                statusConf.classes.default
                              }`}
                            >
                              {rawValue}
                            </span>
                          </td>
                        );
                      }

                      if (columnId === "stock") {
                        const stockConf = tableStyleMapping.cell.stock;
                        const isKosong = Number(rawValue) === 0;
                        return (
                          <td
                            key={cell.id}
                            className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center`}
                          >
                            <span
                              className={`${stockConf.base} ${
                                isKosong
                                  ? stockConf.classes.kosong
                                  : stockConf.classes.ada
                              }`}
                            >
                              {rawValue}
                            </span>
                          </td>
                        );
                      }

                      if (columnId === "image" && rawValue) {
                        return (
                          <td
                            key={cell.id}
                            className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center ${tdClass}`}
                          >
                            <img
                              src={rawValue}
                              alt="produk"
                              className={tableStyleMapping.cell.image.base}
                            />
                          </td>
                        );
                      }

                      // fallback default render
                      return (
                        <td
                          key={cell.id}
                          className={`border-t border-b border-[#DEE2E6] px-3 py-2 text-center ${tdClass}`}
                        >
                          {rawValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4️⃣ Pagination */}
      {tableConfig?.pagination && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-4">
          {/* Showing entries */}
          <div className="text-sm text-gray-600">
            {`Showing ${tableConfig?.pagination.from} to ${tableConfig?.pagination.to} of ${tableConfig?.pagination.total} entries`}
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <button
              className="cursor-pointer px-3 py-1 border border-gray-400 bg-white text-black rounded text-sm hover:bg-[#337AB7] hover:text-white disabled:opacity-50"
              onClick={() =>
                tableConfig?.onPageChange(pagination.currentPage - 1)
              }
              disabled={tableConfig?.pagination.currentPage === 1}
            >
              Previous
            </button>

            {Array.from(
              { length: tableConfig?.pagination.lastPage },
              (_, i) => i + 1
            ).map((p) => {
              if (
                p === 1 ||
                p === tableConfig?.pagination.lastPage ||
                (p >= tableConfig?.pagination.currentPage - 1 &&
                  p <= tableConfig?.pagination.currentPage + 1)
              ) {
                const isActive = tableConfig?.pagination.currentPage === p;
                return (
                  <button
                    key={p}
                    className={`cursor-pointer px-3 py-1 border border-gray-400 rounded text-sm transition-colors ${
                      isActive
                        ? "bg-[#337AB7] text-white"
                        : "bg-white text-black hover:bg-[#337AB7] hover:text-white"
                    }`}
                    onClick={() => tableConfig?.onPageChange(p)}
                  >
                    {p}
                  </button>
                );
              }
              if (
                p === tableConfig?.pagination.currentPage - 2 ||
                p === tableConfig?.pagination.currentPage + 2
              ) {
                return (
                  <span key={p} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              className="cursor-pointer px-3 py-1 border border-gray-400 bg-white text-black rounded text-sm hover:bg-[#337AB7] hover:text-white disabled:opacity-50"
              onClick={() =>
                tableConfig?.onPageChange(pagination.currentPage + 1)
              }
              disabled={
                tableConfig?.pagination.currentPage ===
                tableConfig?.pagination.lastPage
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
