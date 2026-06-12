import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportBookingsToPDF = (bookings) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add Report Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Hotel Lanka Pro - Reservations Ledger', 14, 20);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
  doc.text(`Total Bookings Listed: ${bookings.length}`, 14, 31);
  
  // Table Configuration
  const tableColumn = [
    "Booking ID", 
    "Customer Name", 
    "Customer Email",
    "Room / Suite", 
    "Check In", 
    "Check Out", 
    "Nights", 
    "Total (LKR)", 
    "Status"
  ];
  
  const tableRows = bookings.map(b => [
    b.bookingId,
    b.customerName,
    b.customerEmail,
    `${b.roomId?.name || 'Deleted Room'} (Rm ${b.roomId?.roomNumber || 'N/A'})`,
    new Date(b.checkIn).toLocaleDateString(),
    new Date(b.checkOut).toLocaleDateString(),
    b.nights,
    b.totalAmount.toLocaleString(),
    b.status
  ]);

  doc.autoTable({
    startY: 36,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    styles: { 
      fontSize: 8.5, 
      font: 'helvetica',
      cellPadding: 3
    },
    headStyles: { 
      fillColor: [5, 150, 105], // Tropical Emerald Green (primary-600)
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { 
      fillColor: [248, 250, 252] // slate-50 alternate rows
    },
    margin: { left: 14, right: 14 }
  });

  doc.save(`Reservations_Ledger_${new Date().toISOString().split('T')[0]}.pdf`);
};
