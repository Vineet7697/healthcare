import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { searchVisitDoctors } from "../../../services/patientService";

const Cards = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [cityQuery, setCityQuery] = useState("");
  const [diseaseQuery, setDiseaseQuery] = useState("");

  const [activeType, setActiveType] = useState("ALL"); // ✅ NEW

  const BASE_URL = "http://localhost:4000";

  /* ================= LOAD DOCTORS FROM API ================= */
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
        console.error("Doctor fetch failed", err.response?.data);
      }
    };

    loadDoctors();
  }, [location.search]);

  /* ================= DROPDOWN DATA ================= */
  const uniqueCities = [...new Set(allDoctors.map((d) => d.city))];
  const uniqueDiseases = [...new Set(allDoctors.map((d) => d.specialization))];

  const filteredCities = uniqueCities.filter((c) =>
    c.toLowerCase().includes(cityQuery.toLowerCase()),
  );

  const filteredDiseases = uniqueDiseases.filter((d) =>
    d.toLowerCase().includes(diseaseQuery.toLowerCase()),
  );

  /* ================= FILTER BY TYPE ================= */
  const displayedDoctors = filteredDoctors.filter((doc) => {
    if (activeType === "ALL") return true;
    if (activeType === "CLINIC") return doc.appointmentType === "CLINIC";
    if (activeType === "ONLINE") return doc.appointmentType === "ONLINE";
    return true;
  });

  /* ================= UI ================= */
  return (
    <section className="p-6 min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] g">
      <Container>
        {/* ================= TOP FILTER BUTTONS ================= */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveType("ALL")}
            className={`px-6 py-2 rounded-full font-medium ${
              activeType === "ALL"
                ? "bg-blue-700 text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            All Doctors
          </button>

          <button
            onClick={() => setActiveType("CLINIC")}
            className={`px-6 py-2 rounded-full font-medium ${
              activeType === "CLINIC"
                ? "bg-blue-700 text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Clinic Visit
          </button>

          <button
            onClick={() => setActiveType("ONLINE")}
            className={`px-6 py-2 rounded-full font-medium ${
              activeType === "ONLINE"
                ? "bg-blue-700 text-white"
                : "bg-white border text-gray-700"
            }`}
          >
            Hospital Visit{" "}
          </button>
        </div>

        {/* ================= DOCTOR CARDS ================= */}
        <Row className="g-4 justify-center mt-4 ">
          {displayedDoctors.length > 0 ? (
            displayedDoctors.map((doctor) => (
              <Col
                key={doctor.doctorId}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="flex justify-center"
              >
                <Card
                  className="
    flex flex-col
    md:flex-row
    bg-white shadow-md hover:shadow-xl transition-shadow duration-300
    rounded-xl overflow-hidden
   w-full sm:w-[95%] md:w-[85%] lg:w-[60%]
    p-4 border-gray-300
    justify-between mb-10
  "
                >
                  {/* ================= LEFT SIDE ================= */}
                  <div
                    className="
      flex flex-col items-center
      md:items-start
      mb-4 md:mb-0
    "
                  >
                    <Card.Img
                      variant="top"
                      src={
                        doctor.profile_image
                          ? `${BASE_URL}${doctor.profile_image}`
                          : "/images/default-doctor.png"
                      }
                      alt={doctor.doctorName}
                      className="object-cover rounded-md border border-gray-300 mb-3"
                      style={{
                        height: "120px",
                        width: "120px",
                        objectFit: "cover",
                      }}
                    />

                    <Button
                      className="
        bg-gray-600 hover:bg-gray-700 text-white
        px-4 py-2 rounded-lg text-sm
       md:w-full lg:w-auto
      "
                      onClick={() =>
                        navigate(`/client/doctor-profile/${doctor.doctorId}`, {
                          state: { doctor },
                        })
                      }
                    >
                      View Profile
                    </Button>
                  </div>

                  {/* ================= RIGHT SIDE ================= */}
                  <Card.Body
                    className="
      flex flex-col
      md:flex-row
      justify-between
      md:w-[80%]
      text-center md:text-left
      gap-4
    "
                  >
                    {/* DETAILS */}
                    <div>
                      <Card.Title className="text-lg font-bold text-gray-900 mb-1">
                        {doctor.doctorName}
                      </Card.Title>

                      <Card.Subtitle className="text-blue-700 text-sm font-medium mb-1">
                        {doctor.specialization}
                        {doctor.degree && ` • ${doctor.degree}`}
                      </Card.Subtitle>

                      <p className="text-gray-600 text-sm mb-2">
                        City: {doctor.city}
                      </p>

                      {doctor.experience && (
                        <p className="text-gray-600 text-sm mb-2">
                          Experience: {doctor.experience} Years
                        </p>
                      )}

                      {doctor.rating && (
                        <p className="text-gray-600 text-sm mb-2">
                          Rating ⭐ {doctor.rating}
                        </p>
                      )}

                      {doctor.consultationFee && (
                        <p className="text-gray-600 text-sm mb-2">
                          Clinic Fees: ₹{doctor.consultationFee}
                        </p>
                      )}

                      {doctor.description && (
                        <p className="text-gray-600 text-sm mb-2">
                          {doctor.description}
                        </p>
                      )}
                    </div>

                    {/* BUTTONS */}
                    <div
                      className="
        flex flex-col
        justify-center
        gap-3
        w-full md:w-auto
      "
                    >
                      <Button
                        className="
          bg-blue-700 hover:bg-blue-800 text-white
          py-2 px-3 rounded-lg text-sm
           w-full md:w-full lg:w-auto
        "
                        onClick={() =>
                          navigate(
                            `/client/bookappointmentpage/${doctor.doctorId}`,
                            { state: { doctor } },
                          )
                        }
                      >
                        Book Appointment
                      </Button>

                      <Button
                        className="
          bg-green-700 hover:bg-green-800 text-white
          px-5 py-2 rounded-lg text-sm
          w-full md:w-full lg:w-auto
        "
                        onClick={() =>
                          navigate(`/contact-doctor/${doctor.doctorId}`)
                        }
                      >
                        📞 Contact
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center w-full text-gray-600 mt-4">
              No doctors available for this category.
            </p>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Cards;

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
//         <Row className="g-4 justify-center mt-4">
//           {displayedDoctors.length > 0 ? (
//             displayedDoctors.map((doctor) => (
//               <Col
//                 key={doctor.doctorId}
//                 xs={12}
//                 sm={6}
//                 lg={4}
//                 xl={3}
//                 className="flex justify-center"
//               >
//                 <Card className="w-full max-w-sm sm:max-w-md bg-white shadow-md hover:shadow-xl transition rounded-2xl overflow-hidden p-4">
//                   {/* ================= TOP (IMAGE + PROFILE BTN) ================= */}
//                   <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4">
//                     <img
//                       src={
//                         doctor.profile_image
//                           ? `${BASE_URL}${doctor.profile_image}`
//                           : "/images/default-doctor.png"
//                       }
//                       alt={doctor.doctorName}
//                       className="w-28 h-28 rounded-xl object-cover border"
//                     />

//                     <div className="flex flex-col items-center sm:items-start gap-2">
//                       <h3 className="text-lg font-bold text-gray-900 text-center sm:text-left">
//                         {doctor.doctorName}
//                       </h3>

//                       <p className="text-blue-700 text-sm font-medium">
//                         {doctor.specialization}
//                         {doctor.degree && ` • ${doctor.degree}`}
//                       </p>

//                       <p className="text-gray-600 text-sm">
//                         City: {doctor.city}
//                       </p>

//                       <Button
//                         className="bg-gray-600 hover:bg-gray-700 text-white text-sm px-4 py-1 rounded-lg w-full sm:w-auto"
//                         onClick={() =>
//                           navigate(
//                             `/client/doctor-profile/${doctor.doctorId}`,
//                             {
//                               state: { doctor },
//                             },
//                           )
//                         }
//                       >
//                         View Profile
//                       </Button>
//                     </div>
//                   </div>

//                   {/* ================= DETAILS ================= */}
//                   <div className="mt-4 text-sm text-gray-600 space-y-1">
//                     {doctor.experience && (
//                       <p>Experience: {doctor.experience} Years</p>
//                     )}

//                     {doctor.rating && <p>Rating ⭐ {doctor.rating}</p>}

//                     {doctor.consultationFee && (
//                       <p>Clinic Fees: ₹{doctor.consultationFee}</p>
//                     )}

//                     {doctor.description && (
//                       <p className="line-clamp-2">{doctor.description}</p>
//                     )}
//                   </div>

//                   {/* ================= ACTION BUTTONS ================= */}
//                   <div className="mt-4 flex flex-col sm:flex-row gap-3">
//                     <Button
//                       className="bg-blue-700 hover:bg-blue-800 text-white w-full py-2 rounded-lg text-sm"
//                       onClick={() =>
//                         navigate(
//                           `/client/bookappointmentpage/${doctor.doctorId}`,
//                           { state: { doctor } },
//                         )
//                       }
//                     >
//                       Book Appointment
//                     </Button>

//                     <Button
//                       className="bg-green-700 hover:bg-green-800 text-white w-full py-2 rounded-lg text-sm"
//                       onClick={() =>
//                         navigate(`/contact-doctor/${doctor.doctorId}`)
//                       }
//                     >
//                       📞 Contact
//                     </Button>
//                   </div>
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
