import { MaintenanceRecord } from '../types/maintenance';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportService = {
  exportMaintenanceToPDF: (maintenanceRecords: MaintenanceRecord[], vehicleInfo: any) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Maintenance Records Report', 14, 15);

    // Add vehicle info
    doc.setFontSize(12);
    doc.text(`Vehicle: ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year})`, 14, 25);
    doc.text(`VIN: ${vehicleInfo.vin}`, 14, 32);

    // Create table data
    const tableData = maintenanceRecords.map(record => [
      new Date(record.scheduled_date).toLocaleDateString(),
      record.maintenance_type.replace('_', ' ').toUpperCase(),
      record.status,
      `$${record.cost?.toFixed(2) || '0.00'}`,
      record.performed_by || '-',
      record.notes || '-'
    ]);

    // Add table
    (doc as any).autoTable({
      head: [['Date', 'Type', 'Status', 'Cost', 'Performed By', 'Notes']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 139, 202] }
    });

    // Save the PDF
    doc.save(`maintenance_report_${vehicleInfo.vin}.pdf`);
  },

  exportMaintenanceToExcel: (maintenanceRecords: MaintenanceRecord[], vehicleInfo: any) => {
    // Prepare data for Excel
    const data = maintenanceRecords.map(record => ({
      Date: new Date(record.scheduled_date).toLocaleDateString(),
      'Maintenance Type': record.maintenance_type.replace('_', ' ').toUpperCase(),
      Status: record.status,
      Cost: record.cost || 0,
      'Performed By': record.performed_by || '-',
      Notes: record.notes || '-',
      'Created At': new Date(record.created_at).toLocaleDateString(),
      'Updated At': new Date(record.updated_at).toLocaleDateString()
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Maintenance Records');

    // Save to file
    XLSX.writeFile(wb, `maintenance_report_${vehicleInfo.vin}.xlsx`);
  },

  exportVehicleStatsToPDF: (stats: any, vehicleInfo: any) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Vehicle Performance Report', 14, 15);

    // Add vehicle info
    doc.setFontSize(12);
    doc.text(`Vehicle: ${vehicleInfo.make} ${vehicleInfo.model} (${vehicleInfo.year})`, 14, 25);
    doc.text(`VIN: ${vehicleInfo.vin}`, 14, 32);

    // Add key metrics
    doc.setFontSize(11);
    const metrics = [
      ['Total Rentals:', stats.totalRentals],
      ['Total Revenue:', `$${stats.totalRevenue.toFixed(2)}`],
      ['Average Rental Duration:', `${stats.averageRentalDuration} days`],
      ['Maintenance Costs:', `$${stats.maintenanceCosts.toFixed(2)}`],
      ['Utilization Rate:', `${stats.utilization}%`]
    ];

    let y = 45;
    metrics.forEach(([label, value]) => {
      doc.text(`${label} ${value}`, 14, y);
      y += 8;
    });

    // Add upcoming maintenances
    y += 10;
    doc.setFontSize(12);
    doc.text('Upcoming Maintenances:', 14, y);
    y += 8;
    doc.setFontSize(11);
    stats.upcomingMaintenances.forEach((maintenance: any) => {
      doc.text(`- ${maintenance.maintenance_type.replace('_', ' ').toUpperCase()} (${new Date(maintenance.scheduled_date).toLocaleDateString()})`, 20, y);
      y += 7;
    });

    // Save the PDF
    doc.save(`vehicle_stats_${vehicleInfo.vin}.pdf`);
  }
};

export default exportService;
