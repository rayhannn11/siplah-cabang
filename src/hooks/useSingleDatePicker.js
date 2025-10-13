import { useState } from "react";
import { format } from "date-fns";
import { saveAs } from "file-saver";

/**
 * Hook export untuk laporan harian (single date)
 * @param {Function} apiFunction - Fungsi untuk ambil data/export
 * @param {string} filenamePrefix - Nama file prefix default "report"
 */
export default function useSingleDateExport(
  apiFunction,
  filenamePrefix = "report"
) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState(today);

  const handleExportExcel = async () => {
    try {
      const response = await apiFunction({ date });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const filename = `${filenamePrefix}-${date}.xlsx`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Gagal export excel:", error);
      alert("Export gagal. Cek konsol.");
    }
  };

  return {
    date,
    setDate,
    handleExportExcel,
  };
}
