import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const formatHeader = (key) =>
  key
    .replace(/_/g, " ") // hapus underscore
    .replace(/\b\w/g, (char) => char.toUpperCase());

export function formatNumberToRupiah(value, { to = "formatted" } = {}) {
  if (value === null || value === undefined || value === "") return "-";

  // Hilangkan semua karakter non-digit, koma, titik
  const cleaned = String(value).replace(/[^\d.,]/g, "");

  // Jika tujuannya ke "number" (misal input dari "Rp 1.000.000")
  if (to === "number") {
    const normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
    const num = parseFloat(normalized);
    return isNaN(num) ? 0 : num;
  }

  // 🔧 Fix di sini:
  // Hapus titik pemisah ribuan sebelum dijadikan Number
  const numeric = cleaned.replace(/\./g, "").replace(/,/g, ".");
  const num = Number(numeric);
  if (isNaN(num)) return value;

  return num.toLocaleString("id-ID");
}

export function redirectToOrderDetail(orderId, orderData) {
  let payload;

  // Kalau datanya object/array => stringify
  if (typeof orderData === "object") {
    payload = JSON.stringify(orderData);
  } else {
    // Kalau string/number langsung pakai
    payload = orderData;
  }

  const query = new URLSearchParams({
    typeOrder: payload,
  }).toString();

  window.location.href = `/orders/${orderId}?${query}`;
}

export const toTitleCase = (str) =>
  str
    ?.toLowerCase()
    ?.split(" ")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");

export function truncateName(name = "", maxWords = 1) {
  const words = name.trim().split(" ");
  if (words.length <= maxWords) return name;
  return words.slice(0, maxWords).join(" ") + "...";
}

// util: parse date yang fleksibel
export function parseDateFlexible(raw) {
  if (!raw) return null;
  if (raw instanceof Date && !isNaN(raw.getTime())) return raw;

  const s = String(raw).trim();

  // 1) coba Date native (untuk ISO, RFC, "Thu, 25 Sep 2025 11:05:00 GMT", dsb)
  let d = new Date(s);
  if (!isNaN(d.getTime())) return d;

  // 2) hilangkan weekday diawal seperti "Thu, "
  const withoutWeekday = s.replace(/^[A-Za-z]{3,},\s*/, "");

  // 3) pattern: "6 September 2025 17:58" atau "6 Sep 2025 17:58"
  const m1 = withoutWeekday.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?$/
  );
  if (m1) {
    const day = parseInt(m1[1], 10);
    const monthName = m1[2].toLowerCase();
    const year = parseInt(m1[3], 10);
    const timePart = m1[4] || "00:00:00";

    // map nama bulan (cari berdasarkan 3 huruf pertama)
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const idx = months.findIndex((mn) => mn.startsWith(monthName.slice(0, 3)));
    const monthIndex = idx >= 0 ? idx : 0;

    const [hh = "0", mm = "0", ss = "0"] = timePart.split(":");
    return new Date(
      year,
      monthIndex,
      day,
      parseInt(hh, 10),
      parseInt(mm, 10),
      parseInt(ss, 10)
    );
  }

  // 4) pattern: "dd/mm/yyyy" atau "dd-mm-yyyy" dengan waktu opsional
  const m2 = withoutWeekday.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?$/
  );
  if (m2) {
    const day = parseInt(m2[1], 10);
    const month = parseInt(m2[2], 10) - 1;
    const year = parseInt(m2[3], 10);
    const timePart = m2[4] || "00:00:00";
    const [hh = "0", mm = "0", ss = "0"] = timePart.split(":");
    return new Date(
      year,
      month,
      day,
      parseInt(hh, 10),
      parseInt(mm, 10),
      parseInt(ss, 10)
    );
  }

  // 5) coba angka timestamp
  const asNum = Number(s);
  if (!isNaN(asNum)) {
    const dnum = new Date(asNum);
    if (!isNaN(dnum.getTime())) return dnum;
  }

  // gagal parse
  return null;
}

const getBase64FromUrl = async (url) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const printInboundPDF = ({
  inboundDetail,
  inboundItems,
  clientName,
  warehouseName,
}) => {
  const doc = new jsPDF();
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();

  const formattedDate = new Date(inboundDetail.inbound_date).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // ========== CONTAINER 1: HEADER ==========
  doc.addImage(
    "data:image/png;base64,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",
    "PNG",
    margin,
    10,
    30,
    20
  ); // x, y, width, height
  doc.setFont("helvetica", "bold");
  doc.setTextColor(36, 91, 199); // Biru
  doc.setFontSize(18);
  doc.text("INBOUND RECEIPT", margin, 44);

  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("RAJA CEPAT NUSANTARA", pageWidth - margin, 20, { align: "right" });

  // ========== CONTAINER 2: COMPANY INFO ==========
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const companyY = 28;
  doc.text("JL. H. BAPING RAYA NO. 100,", pageWidth - margin, companyY, {
    align: "right",
  });
  doc.text(
    "CIRACAS PASAR REBO, JAKARTA 13740",
    pageWidth - margin,
    companyY + 5,
    {
      align: "right",
    }
  );
  doc.text(
    "TELP (021) 87796010 FAX (021) 87790903",
    pageWidth - margin,
    companyY + 10,
    {
      align: "right",
    }
  );

  // ========== CONTAINER 3: DETAIL INBOUND (Box 2 kolom) ==========
  const infoStartY = companyY + 25;
  const boxHeight = 38;
  const boxPadding = 5;
  const labelFontSize = 10;

  // Draw gray box
  // Background putih
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, infoStartY, pageWidth - margin * 2, boxHeight, "F");
  // Left info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(labelFontSize);
  doc.setTextColor(0);
  doc.text(`Nomor Inbound:`, margin + boxPadding, infoStartY + 8);
  doc.text(`Tanggal:`, margin + boxPadding, infoStartY + 15);
  doc.text(`Client:`, margin + boxPadding, infoStartY + 22);
  doc.text(`Gudang:`, margin + boxPadding, infoStartY + 29);

  doc.setFont("helvetica", "normal");
  doc.text(
    inboundDetail?.reference_code?.replace(/^(INB|INR)-/, "RFIN-"),
    margin + 40,
    infoStartY + 8
  );
  doc.text(formattedDate, margin + 40, infoStartY + 15);
  doc.text(clientName || "-", margin + 40, infoStartY + 22);
  doc.text(warehouseName || "-", margin + 40, infoStartY + 29);

  // Right info
  const rightStartX = pageWidth / 2 + 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Status:`, rightStartX, infoStartY + 8);

  doc.setFont("helvetica", "normal");
  doc.text(inboundDetail.status, rightStartX + 30, infoStartY + 8);

  // ========== CONTAINER 4: TABEL ITEM ==========
  const tableStartY = infoStartY + boxHeight + 10;

  autoTable(doc, {
    startY: tableStartY,
    head: [["No", "SKU", "Nama Produk", "Qty", "Satuan"]],
    body: inboundItems.map((item, i) => [
      i + 1,
      item.product_id || "-",
      item.product_name || "-",
      item.qty || "-",
      item.satuan_name,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [255, 255, 255], // Putih
      textColor: 0, // Hitam
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
      lineWidth: 0.3,
      lineColor: [180, 180, 180], // Border abu-abu
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" }, // No
      1: { cellWidth: 20, halign: "center" }, // SKU
      2: { cellWidth: 110 }, // Nama Produk (besar, default left align)
      3: { cellWidth: 20, halign: "center" }, // Satuan
      4: { cellWidth: 20, halign: "center" }, // Qty
    },
    styles: {
      font: "helvetica",
    },
  });

  // ========== CONTAINER 5: TANDA TANGAN ==========
  const finalY = doc.lastAutoTable.finalY + 30;
  const signatureWidth = 60;

  const centerX1 = pageWidth / 2 - signatureWidth - 20;
  const centerX2 = pageWidth / 2 + 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("Diperiksa oleh:", centerX1 + signatureWidth / 2, finalY, {
    align: "center",
  });
  doc.text("Diterima oleh:", centerX2 + signatureWidth / 2, finalY, {
    align: "center",
  });

  // Signature lines
  doc.line(centerX1, finalY + 25, centerX1 + signatureWidth, finalY + 25);
  doc.line(centerX2, finalY + 25, centerX2 + signatureWidth, finalY + 25);

  // ========== SAVE ==========
  // ========== OPEN PREVIEW PRINT WINDOW ==========
  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);

  const printWindow = window.open(blobUrl, "_blank");
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  } else {
    alert("Pop-up blocked! Please allow pop-ups for this site.");
  }
};

export const printInboundHTML = ({
  inboundDetail,
  inboundItems,
  clientName,
  warehouseName,
}) => {
  const formattedDate = new Date(inboundDetail.inbound_date).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const referenceCode = inboundDetail.reference_code.replace(
    /^(INB|INR)-/,
    "RFIN-"
  );

  let htmlContent = `
    <html>
      <head>
        <title>Print Inbound</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          h1, h2 { margin-bottom: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
          th { background-color: #245BC7; color: white; }
          .info { margin-top: 20px; font-size: 14px; }
          .signature { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature div { text-align: center; width: 40%; }
          .signature-line { margin-top: 60px; border-top: 1px solid #000; width: 100%; }
        </style>
      </head>
      <body onload="print()">
        <h1>INBOUND RECEIPT</h1>
        <h2>Raja Gudang</h2>
        <div class="info">
          <div>Nomor Inbound: <strong>${referenceCode}</strong></div>
          <div>Tanggal: <strong>${formattedDate}</strong></div>
          <div>Client: <strong>${clientName || "-"}</strong></div>
          <div>Gudang: <strong>${warehouseName || "-"}</strong></div>
          <div>Status: <strong>${inboundDetail.status}</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>SKU</th>
              <th>Nama Produk</th>
              <th>Satuan</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            ${inboundItems
              .map(
                (item, i) => `
              <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td style="text-align: center;">${item.product_id || "-"}</td>
                <td>${item.product_name || "-"}</td>
                <td style="text-align: center;">${item.satuan_name || "-"}</td>
                <td style="text-align: center;">${item.qty}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>

        <div class="signature">
          <div>
            Diperiksa oleh:
            <div class="signature-line"></div>
          </div>
          <div>
            Diterima oleh:
            <div class="signature-line"></div>
          </div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    alert("Pop-up blocked! Harap aktifkan pop-up untuk situs ini.");
  }
};

export const printOutboundPDF = ({
  orderDetail,
  orderItems,
  clientName,
  warehouseName,
}) => {
  const doc = new jsPDF();
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();

  const formattedDate = new Date(orderDetail.order_date).toLocaleDateString(
    "id-ID",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // ========== HEADER ==========
  doc.addImage(
    "data:image/png;base64,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",
    "PNG",
    margin,
    10,
    30,
    20
  ); // x, y, width, height
  doc.setFont("helvetica", "bold");
  doc.setTextColor(36, 91, 199); // Biru
  doc.setFontSize(18);
  doc.text("OUTBOUND RECEIPT", margin, 44);

  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("RAJA CEPAT NUSANTARA", pageWidth - margin, 20, { align: "right" });

  // ========== COMPANY INFO ==========
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const companyY = 28;
  doc.text("JL. H. BAPING RAYA NO. 100,", pageWidth - margin, companyY, {
    align: "right",
  });
  doc.text(
    "CIRACAS PASAR REBO, JAKARTA 13740",
    pageWidth - margin,
    companyY + 5,
    { align: "right" }
  );
  doc.text(
    "TELP (021) 87796010 FAX (021) 87790903",
    pageWidth - margin,
    companyY + 10,
    { align: "right" }
  );

  // ========== ORDER INFO BOX ==========
  const infoStartY = companyY + 25;
  const boxHeight = 50;
  const boxPadding = 5;

  // Background putih
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, infoStartY, pageWidth - margin * 2, boxHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0);
  // Left Info
  doc.text(`Kode Order:`, margin + boxPadding, infoStartY + 8);
  doc.text(`Tanggal:`, margin + boxPadding, infoStartY + 15);
  doc.text(`Client:`, margin + boxPadding, infoStartY + 22);
  doc.text(`Keterangan:`, margin + boxPadding, infoStartY + 29);

  doc.setFont("helvetica", "normal");
  doc.text(
    orderDetail.order_code.replace(/^ORD-/, "RFOU-"),
    margin + 40,
    infoStartY + 8
  );
  doc.text(formattedDate, margin + 40, infoStartY + 15);
  doc.text(clientName || "-", margin + 40, infoStartY + 22);
  doc.text(warehouseName || "-", margin + 40, infoStartY + 29);
  doc.text(orderDetail.nama_driver || "-", margin + 40, infoStartY + 36);

  // Right Info
  const rightStartX = pageWidth / 2 + 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Ekspedisi:`, rightStartX, infoStartY + 8);
  doc.text(`Status:`, rightStartX, infoStartY + 15);
  doc.text(`Gudang:`, rightStartX, infoStartY + 22);
  doc.text(`Nama Driver:`, rightStartX, infoStartY + 29);

  doc.setFont("helvetica", "normal");
  doc.text(orderDetail.ekspedisi || "-", rightStartX + 30, infoStartY + 8);
  doc.text(orderDetail.status, rightStartX + 30, infoStartY + 15);
  doc.text(orderDetail.keterangan || "-", rightStartX + 30, infoStartY + 22, {
    maxWidth: pageWidth / 2 - 40,
  });

  // ========== TABLE ==========
  const tableStartY = infoStartY + boxHeight + 10;

  autoTable(doc, {
    startY: tableStartY,
    head: [["No", "SKU", "Nama Produk", "Qty", "Satuan"]],
    body: orderItems.map((item, i) => [
      i + 1,
      item.product_id || "-", // <- tambahkan kode produk di sini
      item.product_name,
      item.qty || "-",
      item.satuan_name,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [255, 255, 255], // Putih
      textColor: 0, // Hitam
      fontStyle: "bold",
      halign: "center",
      fontSize: 10,
      lineWidth: 0.3,
      lineColor: [180, 180, 180], // Border abu-abu
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 30 },
      3: { cellWidth: 30, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
    },
    styles: {
      halign: "left",
      font: "helvetica",
    },
  });

  // ========== SIGNATURE ==========
  const finalY = doc.lastAutoTable.finalY + 30;
  const signatureWidth = 60;
  const centerX1 = pageWidth / 2 - signatureWidth - 20;
  const centerX2 = pageWidth / 2 + 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("Yang Menyerahkan", centerX1 + signatureWidth / 2, finalY, {
    align: "center",
  });
  doc.text("Penerima", centerX2 + signatureWidth / 2, finalY, {
    align: "center",
  });

  doc.line(centerX1, finalY + 25, centerX1 + signatureWidth, finalY + 25);
  doc.line(centerX2, finalY + 25, centerX2 + signatureWidth, finalY + 25);

  // ========== SAVE ==========
  // ========== SAVE ==========
  // ========== OPEN PREVIEW PRINT WINDOW ==========
  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);

  const printWindow = window.open(blobUrl, "_blank");
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  } else {
    alert("Pop-up blocked! Please allow pop-ups for this site.");
  }
};
