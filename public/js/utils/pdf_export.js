// PDF Export Function
function exportToPDF() {
  try {
    // Create new PDF document
    var doc = new jsPDF();

    // Set page margins and width
    var pageWidth = doc.internal.pageSize.width;
    var pageMargin = 20;
    var usableWidth = pageWidth - 2 * pageMargin;

    // Helper function to center text
    function centerText(text, y) {
      var textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      var x = (pageWidth - textWidth) / 2;
      doc.text(text, x, y);
    }

    // Common table settings
    var tableSettings = {
      margin: { top: 10, right: pageMargin, bottom: 0, left: pageMargin },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    };

    // Add title centered
    doc.setFontSize(16);
    centerText("Laporan SIMUAS", 20);

    // Add timestamp
    doc.setFontSize(10);
    doc.text("Generated: " + new Date().toLocaleString(), pageMargin, 30);

    // Export Mahasiswa table
    doc.setFontSize(14);
    doc.text("Data Mahasiswa", pageMargin, 40);
    doc.autoTable({
      startY: 45,
      head: [["NBI", "Nama", "Alamat", "IPK"]],
      body: mahasiswaData.map(function (student) {
        return [student.nbi, student.nama, student.alamat, student.ipk];
      }),
      ...tableSettings,
    });

    // Add new page for Dosen
    doc.addPage();

    // Export Dosen table on new page
    doc.setFontSize(14);
    doc.text("Data Dosen", pageMargin, 20);
    doc.autoTable({
      startY: 25,
      head: [["Kode Dosen", "Nama", "Alamat", "Program Studi"]],
      body: dosenData.map(function (dosen) {
        return [dosen.kodedsn, dosen.nama, dosen.alamat, dosen.prodi];
      }),
      ...tableSettings,
    });

    // Add new page for Matakuliah
    doc.addPage();

    // Export Matakuliah table on new page
    doc.setFontSize(14);
    doc.text("Data Mata Kuliah", pageMargin, 20);
    doc.autoTable({
      startY: 25,
      head: [["Kode MK", "Nama", "SKS", "Jumlah Kelas"]],
      body: matakuliahData.map(function (mk) {
        return [mk.kodemk, mk.nama_matkul, mk.sks, mk.jumlah_kelas];
      }),
      ...tableSettings,
    });

    // Save the PDF
    doc.save("laporan_simuas.pdf");

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}
