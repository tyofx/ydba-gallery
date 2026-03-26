"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useState } from "react";

interface ExportExcelButtonProps {
  data: any[];
  filename?: string;
  sheetName?: string;
  label?: string;
  className?: string;
}

export function ExportExcelButton({
  data,
  filename = "Data_Export",
  sheetName = "Sheet 1",
  label = "Export to Excel",
  className,
}: ExportExcelButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!data || data.length === 0) {
      alert("Tidak ada data untuk diekspor");
      return;
    }

    try {
      setIsExporting(true);

      // 1. Inisialisasi Workbook dan Worksheet baru
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);

      // 2. Ambil kunci (keys) dari object pertama untuk dijadikan header
      const headers = Object.keys(data[0]);

      // 3. Konfigurasi Kolom (Mencoba menyesuaikan lebar kolom secara dinamis)
      worksheet.columns = headers.map((header) => ({
        header: header.toUpperCase(), // Header dibuat huruf besar
        key: header,
        width: Math.max(header.length + 5, 15), // Lebar minimal 15
      }));

      // 4. Masukkan data ke dalam baris
      data.forEach((item) => {
        worksheet.addRow(item);
      });

      // ==========================================
      // KUSTOMISASI DESAIN EXCEL DIMULAI DI SINI
      // ==========================================

      // A. Desain Header (Baris Pertama)
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 }; // Teks Putih, Tebal
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F172A" }, // Background Slate-900 (Warna Tailwind)
      };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
      headerRow.height = 25; // Tinggi baris header

      // B. Kustomisasi Border & Teks untuk Semua Sel (Baris Data)
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          // Tambahkan border tipis di setiap sel
          cell.border = {
            top: { style: "thin", color: { argb: "FFCBD5E1" } }, // Slate-300
            left: { style: "thin", color: { argb: "FFCBD5E1" } },
            bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
            right: { style: "thin", color: { argb: "FFCBD5E1" } },
          };

          // Ratakan tengah untuk data selain header (Opsional, tergantung selera)
          if (rowNumber > 1) {
            cell.alignment = { vertical: "middle", horizontal: "left" };
          }
        });
      });

      // ==========================================
      // PROSES DOWNLOAD FILE
      // ==========================================
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `${filename}.xlsx`);
    } catch (error) {
      console.error("Gagal mengekspor data:", error);
      alert("Terjadi kesalahan saat mengekspor file.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md transition-colors",
        "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 disabled:opacity-50",
        className,
      )}
    >
      <Download className={cn("w-4 h-4", isExporting && "animate-bounce")} />
      {isExporting ? "Memproses..." : label}
    </button>
  );
}
