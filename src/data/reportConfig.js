const reportConfig = {
  reportSatdik: {
    title: "Pembayaran SATDIK",
    labelMapping: {
      no: "No",
      tglTransfer: "TGL TRANSFER",
      virtualAccount: "VIRTUAL ACCOUNT",
      satdik: "SATDIK",
      invoice: "INVOICE",
      totalInvoice: "TOTAL INVOICE",
      penyedia: "PENYEDIA",
      cabang: "CABANG",
      status: "STATUS",
    },
    tableStyleMapping: {
      cell: {
        status: {
          wrapper: "span",
          variant: "status",
          base: "px-2 py-1 rounded text-xs font-semibold whitespace-nowrap",
          classes: {
            "Diterima SIPLah Eureka": "bg-[#00A65A] text-white",
            "Berhasil Transfer ke Penyedia": "bg-[#0073B7] text-white",
            default: "bg-[#E7E7E7] text-black",
          },
        },
        totalInvoice: {
          wrapper: "span",
          variant: "currency",
          classes: "font-semibold px-2 py-1 block text-right",
        },
      },
    },
    dummyData: [
      {
        no: 1,
        tglTransfer: "2025-09-20",
        virtualAccount: "1234567890",
        satdik: "SD Negeri 01 Jakarta",
        invoice: "INV-001",
        totalInvoice: "Rp25.000.000",
        penyedia: "CV Sumber Makmur",
        cabang: "Jakarta",
        status: "Diterima SIPLah Eureka",
      },
      {
        no: 2,
        tglTransfer: "2025-09-21",
        virtualAccount: "9876543210",
        satdik: "SMP Negeri 02 Bandung",
        invoice: "INV-002",
        totalInvoice: "Rp15.500.000",
        penyedia: "PT Andalan Jaya",
        cabang: "Bandung",
        status: "Berhasil Transfer ke Penyedia",
      },
      {
        no: 3,
        tglTransfer: "2025-09-22",
        virtualAccount: "1122334455",
        satdik: "SMA Negeri 03 Surabaya",
        invoice: "INV-003",
        totalInvoice: "Rp40.000.000",
        penyedia: "CV Mitra Sejati",
        cabang: "Surabaya",
        status: "Diterima SIPLah Eureka",
      },
      {
        no: 4,
        tglTransfer: "2025-09-23",
        virtualAccount: "5566778899",
        satdik: "SD Negeri 05 Medan",
        invoice: "INV-004",
        totalInvoice: "Rp12.750.000",
        penyedia: "PT Cahaya Abadi",
        cabang: "Medan",
        status: "Berhasil Transfer ke Penyedia",
      },
      {
        no: 5,
        tglTransfer: "2025-09-24",
        virtualAccount: "6677889900",
        satdik: "SMP Negeri 07 Yogyakarta",
        invoice: "INV-005",
        totalInvoice: "Rp30.000.000",
        penyedia: "CV Berkah Utama",
        cabang: "Yogyakarta",
        status: "Diterima SIPLah Eureka",
      },
    ],
    widgets: {
      widgetClass: "flex justify-end gap-4",
      widgetsContent: [
        {
          key: "actions",
          type: "button",
          wrapperClass: "flex justify-end gap-2",
          buttons: [
            {
              text: "Export Data",
              classes:
                "bg-[#08447F] text-white px-4 py-1 rounded hover:bg-[#0C345B] cursor-pointer",
              onClick: () => alert("Export data transfer"),
            },
          ],
        },
      ],
    },
  },

  reportCV: {
    title: "Penerusan Dana",
    labelMapping: {
      no: "No",
      tglDiteruskan: "TGL DITERUSKAN DANA",
      totalDiteruskan: "TOTAL DITERUSKAN",
      ppn: "PPn",
      pph: "PPh",
      denda: "DENDA",
      adminBank: "ADMIN BANK",
      note: "NOTE",
      penyedia: "PENYEDIA",
      totalInvoice: "TOTAL INVOICE",
      virtualAccount: "VIRTUAL ACCOUNT",
      invoice: "INVOICE",
      sekolah: "SEKOLAH",
      cabang: "CABANG",
    },
    tableStyleMapping: {
      cell: {
        note: {
          wrapper: "span",
          variant: "text",
          classes: "text-[#31AE7F] font-medium",
        },
        virtualAccount: {
          wrapper: "span",
          variant: "text",
          classes: "font-bold",
        },
        sekolah: {
          wrapper: "span",
          variant: "text",
          classes: "font-bold",
        },
        totalInvoice: {
          wrapper: "span",
          variant: "currency",
          classes: "font-semibold px-2 py-1 block text-right",
        },
      },
    },
    dummyData: [
      {
        no: 1,
        tglDiteruskan: "6 September 2025 17:58",
        totalDiteruskan: "Rp9.529.570",
        ppn: 0,
        pph: "47.930",
        denda: 0,
        adminBank: "8.500",
        note: "Biaya admin sudah dikurangi PPH & PPN",
        penyedia: "CV HARLY PUTRA DINATA (HPD)",
        totalInvoice: "Rp9.586.000",
        virtualAccount: "12623791489",
        invoice: "250801791489",
        sekolah: "SD NEGERI 091626 BANDAR MARATUR",
        cabang: "Erlangga Siantar",
      },
      {
        no: 2,
        tglDiteruskan: "Thu, 25 September 2025 11:05",
        totalDiteruskan: "Rp10.203.131",
        ppn: 0,
        pph: "50.000",
        denda: 0,
        adminBank: "9.000",
        note: "Dana diteruskan sesuai invoice",
        penyedia: "CV MITRA SEJAHTERA",
        totalInvoice: "Rp10.262.131",
        virtualAccount: "250801791490",
        invoice: "10203131",
        sekolah: "SMP NEGERI 02 JAKARTA",
        cabang: "Erlangga Jakarta",
      },
    ],
    widgets: {
      widgetClass: "flex justify-end gap-4",
      widgetsContent: [
        {
          key: "actions",
          type: "button",
          wrapperClass: "flex justify-end gap-2",
          buttons: [
            {
              text: "Export Data",
              classes:
                "bg-[#08447F] text-white px-4 py-1 rounded hover:bg-[#0C345B] cursor-pointer",
              onClick: () => alert("Export data transfer"),
            },
          ],
        },
      ],
    },
  },
};

export default reportConfig;
