import jsPDF from "jspdf";

export const generatePrescriptionPDF = (appointment) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Medical Prescription", 20, 20);

  doc.setFontSize(12);
  doc.text(`Doctor: ${appointment.doctorName}`, 20, 35);
  doc.text(`Date: ${appointment.date}`, 20, 45);
  doc.text(`Hospital: ${appointment.hospital}`, 20, 55);

  doc.text("Medicines:", 20, 70);

  appointment.prescription?.medicines?.forEach((med, i) => {
    doc.text(
      `• ${med.name} - ${med.dosage} (${med.duration})`,
      25,
      80 + i * 10
    );
  });

  doc.save(`Prescription_${appointment.id}.pdf`);
};
