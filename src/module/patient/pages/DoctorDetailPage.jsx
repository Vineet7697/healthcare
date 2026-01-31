import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import api from "../../../services/api";
import { toast } from "react-toastify";

const DoctorDetailPage = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(state?.doctor || null);
  const [loading, setLoading] = useState(!state?.doctor);

  /* ================= FETCH IF STATE MISSING ================= */
  useEffect(() => {
    if (doctor) return;

    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/patient/visit/doctors/${id}`);
        setDoctor(res.data.doctor);
      } catch {
        toast.error("Doctor not found");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctor, id, navigate]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading doctor details...
      </p>
    );
  }

  if (!doctor) {
    return <p className="text-center mt-10">Doctor data not found</p>;
  }

  return (
    <section className="min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT */}
        <Card className="md:col-span-2 p-6 shadow rounded-xl bg-white">
          <div className="flex flex-col sm:flex-row gap-6">
            <img
              src={doctor.image || "/images/default-doctor.png"}
              alt={doctor.doctorName}
              className="w-40 h-40 rounded-xl object-cover border"
            />

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {doctor.doctorName}
              </h2>

              <p className="text-blue-700 font-medium">
                {doctor.specialization} {doctor.degree && `• ${doctor.degree}`}
              </p>

              {doctor.rating && (
                <p className="text-sm mt-1">⭐ {doctor.rating} / 5</p>
              )}
            </div>
          </div>

          <hr className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><b>Clinic Name:</b> {doctor.clinicName}</p>
            <p><b>City:</b> {doctor.city}</p>
            <p><b>Address:</b> {doctor.address}</p>
            <p><b>License No:</b> {doctor.licenseNumber}</p>
            <p><b>Consultation Fee:</b> ₹{doctor.consultationFee}</p>
            <p><b>Timings:</b> {doctor.timings}</p>
            <p>
              <b>Available Days:</b>{" "}
              {Array.isArray(doctor.availableDays)
                ? doctor.availableDays.join(", ")
                : doctor.availableDays}
            </p>
          </div>

          {doctor.description && (
            <>
              <hr className="my-4" />
              <h4 className="font-semibold mb-1">About Doctor</h4>
              <p className="text-gray-600 text-sm">{doctor.description}</p>
            </>
          )}
        </Card>

        {/* RIGHT */}
        <Card className="p-5 shadow rounded-xl h-fit sticky top-24">
          <h4 className="font-bold mb-4 text-center">Take Action</h4>

          <Button
            className="w-full bg-blue-700 hover:bg-blue-800 mb-3"
            onClick={() =>
              navigate(`/client/bookappointmentpage/${doctor.doctorId}`, {
                state: { doctor },
              })
            }
          >
            Book Appointment
          </Button>

          <Button
            className="w-full bg-green-700 hover:bg-green-800"
            onClick={() =>
              navigate(`/contact-doctor/${doctor.doctorId}`)
            }
          >
            📞 Contact Us
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default DoctorDetailPage;
