// src/utils/doctorNotes.js

export const saveNotes = (data) => {
  const notes = JSON.parse(localStorage.getItem("doctorNotes")) || [];
  notes.push(data);
  localStorage.setItem("doctorNotes", JSON.stringify(notes));
};



// 📁 Doctor Notes Page me use 

// src/pages/DoctorNotesPage.jsx

// Notes ka DATA STRUCTURE
// {
//   appointmentId,
//   patientId,
//   doctorId,
//   notes,
//   diagnosis,
//   medicines,
//   createdAt: new Date().toISOString()
// }
