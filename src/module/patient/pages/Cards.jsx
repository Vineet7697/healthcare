// import { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import { useNavigate, useLocation } from "react-router-dom";
// import { searchVisitDoctors } from "../../../services/patientService";

// const Cards = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [allDoctors, setAllDoctors] = useState([]);
//   const [filteredDoctors, setFilteredDoctors] = useState([]);

//   const [cityQuery, setCityQuery] = useState("");
//   const [diseaseQuery, setDiseaseQuery] = useState("");

//   const [activeType, setActiveType] = useState("ALL"); // ✅ NEW

//   const BASE_URL = "http://localhost:4000";

//   /* ================= LOAD DOCTORS FROM API ================= */
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const city = params.get("city") || "";
//     const search = params.get("search") || "";

//     const loadDoctors = async () => {
//       try {
//         const res = await searchVisitDoctors({ city, search });
//         const doctors = res.data.doctors || [];

//         setAllDoctors(doctors);
//         setFilteredDoctors(doctors);
//       } catch (err) {
//         console.error("Doctor fetch failed", err.response?.data);
//       }
//     };

//     loadDoctors();
//   }, [location.search]);

//   /* ================= DROPDOWN DATA ================= */
//   const uniqueCities = [...new Set(allDoctors.map((d) => d.city))];
//   const uniqueDiseases = [...new Set(allDoctors.map((d) => d.specialization))];

//   const filteredCities = uniqueCities.filter((c) =>
//     c.toLowerCase().includes(cityQuery.toLowerCase()),
//   );

//   const filteredDiseases = uniqueDiseases.filter((d) =>
//     d.toLowerCase().includes(diseaseQuery.toLowerCase()),
//   );

//   /* ================= FILTER BY TYPE ================= */
//   const displayedDoctors = filteredDoctors.filter((doc) => {
//     if (activeType === "ALL") return true;
//     if (activeType === "CLINIC") return doc.appointmentType === "CLINIC";
//     if (activeType === "ONLINE") return doc.appointmentType === "ONLINE";
//     return true;
//   });

//   /* ================= UI ================= */
//   return (
//     <section className="p-6 min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] g">
//       <Container>
//         {/* ================= TOP FILTER BUTTONS ================= */}
//         <div className="flex justify-center gap-4 mb-8">
//           <button
//             onClick={() => setActiveType("ALL")}
//             className={`px-6 py-2 rounded-full font-medium ${
//               activeType === "ALL"
//                 ? "bg-blue-700 text-white"
//                 : "bg-white border text-gray-700"
//             }`}
//           >
//             All Doctors
//           </button>

//           <button
//             onClick={() => setActiveType("CLINIC")}
//             className={`px-6 py-2 rounded-full font-medium ${
//               activeType === "CLINIC"
//                 ? "bg-blue-700 text-white"
//                 : "bg-white border text-gray-700"
//             }`}
//           >
//             Clinic Visit
//           </button>

//           <button
//             onClick={() => setActiveType("ONLINE")}
//             className={`px-6 py-2 rounded-full font-medium ${
//               activeType === "ONLINE"
//                 ? "bg-blue-700 text-white"
//                 : "bg-white border text-gray-700"
//             }`}
//           >
//             Hospital Visit{" "}
//           </button>
//         </div>

//         {/* ================= DOCTOR CARDS ================= */}
//         <Row className="g-4 justify-center mt-4 ">
//           {displayedDoctors.length > 0 ? (
//             displayedDoctors.map((doctor) => (
//               <Col
//                 key={doctor.doctorId}
//                 xs={12}
//                 sm={6}
//                 md={4}
//                 lg={3}
//                 className="flex justify-center"
//               >
//                 <Card
//                   className="
//     flex flex-col
//     md:flex-row
//     bg-white shadow-md hover:shadow-xl transition-shadow duration-300
//     rounded-xl overflow-hidden
//    w-full sm:w-[95%] md:w-[85%] lg:w-[60%]
//     p-4 border-gray-300
//     justify-between mb-10
//   "
//                 >
//                   {/* ================= LEFT SIDE ================= */}
//                   <div
//                     className="
//       flex flex-col items-center
//       md:items-start
//       mb-4 md:mb-0
//     "
//                   >
//                     <Card.Img
//                       variant="top"
//                       src={
//                         doctor.profile_image
//                           ? `${BASE_URL}${doctor.profile_image}`
//                           : "/images/default-doctor.png"
//                       }
//                       alt={doctor.doctorName}
//                       className="object-cover rounded-md border border-gray-300 mb-3"
//                       style={{
//                         height: "120px",
//                         width: "120px",
//                         objectFit: "cover",
//                       }}
//                     />

//               <Button
//                 className="
//   bg-gray-600 hover:bg-gray-700 text-white
//   px-4 py-2 rounded-lg text-sm
//  md:w-full lg:w-auto
// "
//                 onClick={() =>
//                   navigate(`/client/doctor-profile/${doctor.doctorId}`, {
//                     state: { doctor },
//                   })
//                 }
//               >
//                 View Profile
//               </Button>
//                   </div>

//                   {/* ================= RIGHT SIDE ================= */}
//                   <Card.Body
//                     className="
//       flex flex-col
//       md:flex-row
//       justify-between
//       md:w-[80%]
//       text-center md:text-left
//       gap-4
//     "
//                   >
//                     {/* DETAILS */}
//                     <div>
//                       <Card.Title className="text-lg font-bold text-gray-900 mb-1">
//                         {doctor.doctorName}
//                       </Card.Title>

//                       <Card.Subtitle className="text-blue-700 text-sm font-medium mb-1">
//                         {doctor.specialization}
//                         {doctor.degree && ` • ${doctor.degree}`}
//                       </Card.Subtitle>

//                       <p className="text-gray-600 text-sm mb-2">
//                         City: {doctor.city}
//                       </p>

//                       {doctor.experience && (
//                         <p className="text-gray-600 text-sm mb-2">
//                           Experience: {doctor.experience} Years
//                         </p>
//                       )}

//                       {doctor.rating && (
//                         <p className="text-gray-600 text-sm mb-2">
//                           Rating ⭐ {doctor.rating}
//                         </p>
//                       )}

//                       {doctor.consultationFee && (
//                         <p className="text-gray-600 text-sm mb-2">
//                           Clinic Fees: ₹{doctor.consultationFee}
//                         </p>
//                       )}

//                       {doctor.description && (
//                         <p className="text-gray-600 text-sm mb-2">
//                           {doctor.description}
//                         </p>
//                       )}
//                     </div>

//                     {/* BUTTONS */}
//                     <div
//                       className="
//         flex flex-col
//         justify-center
//         gap-3
//         w-full md:w-auto
//       "
//                     >
//                       <Button
//                         className="
//           bg-blue-700 hover:bg-blue-800 text-white
//           py-2 px-3 rounded-lg text-sm
//            w-full md:w-full lg:w-auto
//         "
//                         onClick={() =>
//                           navigate(
//                             `/client/bookappointmentpage/${doctor.doctorId}`,
//                             { state: { doctor } },
//                           )
//                         }
//                       >
//                         Book Appointment
//                       </Button>

//                       <Button
//                         className="
//           bg-green-700 hover:bg-green-800 text-white
//           px-5 py-2 rounded-lg text-sm
//           w-full md:w-full lg:w-auto
//         "
//                         onClick={() =>
//                           navigate(`/contact-doctor/${doctor.doctorId}`)
//                         }
//                       >
//                         📞 Contact
//                       </Button>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))
//           ) : (
//             <p className="text-center w-full text-gray-600 mt-4">
//               No doctors available for this category.
//             </p>
//           )}
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default Cards;

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchVisitDoctors } from "../../../services/patientService";

export default function Cards() {
  const navigate = useNavigate();
  const location = useLocation();

  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [activeType, setActiveType] = useState("ALL");

  const BASE_URL = "http://localhost:4000";

  /* ================= LOAD DOCTORS ================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city") || "";
    const search = params.get("search") || "";

    const loadDoctors = async () => {
      try {
        const res = await searchVisitDoctors({ city, search });
        const doctors = res.data.doctors || [];
        setAllDoctors(doctors);
        setFilteredDoctors(doctors);
      } catch (err) {
        console.error("Doctor fetch failed", err);
      }
    };

    loadDoctors();
  }, [location.search]);

  /* ================= FILTER BY TYPE ================= */
  const displayedDoctors = filteredDoctors.filter((doc) => {
    if (activeType === "ALL") return true;
    if (activeType === "CLINIC") return doc.appointmentType === "CLINIC";
    return true;
  });

  return (
    <div className="bg-gray-200 min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          {displayedDoctors.length > 0 ? (
            displayedDoctors.map((doctor) => (
              <div
                key={doctor.doctorId}
                className="bg-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  
                  {/* LEFT SIDE */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    
                    {/* IMAGE + VIEW PROFILE */}
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={
                          doctor.profile_image
                            ? `${BASE_URL}${doctor.profile_image}`
                            : "/images/default-doctor.png"
                        }
                        className="w-20 h-20 rounded-xl object-cover"
                        alt={doctor.doctorName}
                      />

                      <button
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm w-full transition"
                        onClick={() =>
                          navigate(
                            `/client/doctor-profile/${doctor.doctorId}`,
                            { state: { doctor } }
                          )
                        }
                      >
                        View Profile
                      </button>
                    </div>

                    {/* DOCTOR INFO */}
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {doctor.doctorName}
                      </h2>

                      <span className="font-semibold text-xs rounded-md">
                        {doctor.specialization}
                      </span>

                      {doctor.consultationFee && (
                        <p className="text-xs text-gray-800 font-medium">
                          Consultation Fee: ₹{doctor.consultationFee}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 text-sm text-gray-700 mt-1">
                        {doctor.placeName && <span>🏥 {doctor.placeName}</span>}
                        <span>📍 {doctor.city}</span>
                        {doctor.experience && (
                          <span>🩺 {doctor.experience} Years</span>
                        )}
                        {doctor.rating && <span>⭐ {doctor.rating}</span>}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
                    <button
                      onClick={() =>
                        navigate(
                          `/client/bookappointmentpage/${doctor.doctorId}`,
                          { state: { doctor } }
                        )
                      }
                      className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-full font-semibold shadow text-sm w-full sm:w-auto transition"
                    >
                      📅 Book Appointment
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/client/bookappointmentpage/${doctor.doctorId}`,
                          { state: { doctor } }
                        )
                      }
                      className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-full font-semibold shadow text-sm w-full sm:w-auto transition"
                    >
                      📞 Contact Doctor
                    </button>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No doctors available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}