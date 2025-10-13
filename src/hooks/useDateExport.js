// hooks/useDateExport.js
import { useState } from "react";
import { format, subMonths } from "date-fns";
import { saveAs } from "file-saver";

export default function useDateExport(apiFunction, filenamePrefix = "report") {
  const today = format(new Date(), "yyyy-MM-dd");
  const lastMonth = format(subMonths(new Date(), 1), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState(lastMonth);
  const [endDate, setEndDate] = useState(today);

  const handleExportExcel = async () => {
    try {
      const response = await apiFunction({
        start_date: startDate,
        end_date: endDate,
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const filename = `${filenamePrefix}-${startDate}_to_${endDate}.xlsx`;
      saveAs(blob, filename);
    } catch (error) {
      console.error("Gagal export excel:", error);
      alert("Export gagal. Cek konsol.");
    }
  };

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handleExportExcel,
  };
}
