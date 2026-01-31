import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  getDoctorProfile,
  updateDoctorProfile,
} from "../../services/doctor/profile/DoctorProfileApi";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const DOCTOR_IMAGE_KEY = "doctorProfileImage";

const INITIAL_PROFILE = {
  doctorName: "",
  degree: "",
  specialization: "",
  clinicName: "",
  city: "",
  address: "",
  consultationFee: "",
  timings: "",
  experienceYears: "",
  mobile: "",
  email: "",
};

export default function useDoctorProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem(DOCTOR_IMAGE_KEY) || DEFAULT_AVATAR;
  });
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PROFILE + IMAGE ================= */
  useEffect(() => {
    const loadProfileAndImage = async () => {
      try {
        // 1️⃣ Doctor profile data
        const res = await getDoctorProfile();
        const d = res.data.doctor;

        setProfile({
          doctorName: d.doctorName || "",
          degree: d.degree || "",
          specialization: d.specialization || "",
          clinicName: d.placeName || "",
          city: d.city || "",
          address: d.address || "",
          consultationFee: d.consultationFee || "",
          timings: d.timings || "",
          experienceYears: d.experienceYears || "",
          mobile: d.mobile || "",
          email: d.email || "",
        });

        // 2️⃣ Doctor profile image (SAME AS PATIENT)
        const imgRes = await api.get("/auth/getprofile-image");
        const imagePath = imgRes.data.imageUrl;
        if (imgRes.data?.imageUrl) {
          const fullUrl = imagePath.startsWith("http")
            ? imagePath
            : `${import.meta.env.VITE_API_URL}${imagePath}`;
            
          setProfileImage(fullUrl);
          localStorage.setItem(DOCTOR_IMAGE_KEY, fullUrl);
        } else {
          setProfileImage(DEFAULT_AVATAR);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load doctor profile");
        setProfileImage(DEFAULT_AVATAR);
      } finally {
        setLoading(false);
      }
    };

    loadProfileAndImage();
  }, []);

  /* ================= IMAGE UPLOAD / UPDATE ================= */
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const hasCustomImage = profileImage && !profileImage.includes("flaticon");

      const res = hasCustomImage
        ? await api.put("/auth/updateprofile-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await api.post("/auth/upload-profile-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      const fullUrl = `${import.meta.env.VITE_API_URL}/${res.data.imageUrl}?t=${Date.now()}`;

      setProfileImage(fullUrl);
      localStorage.setItem(DOCTOR_IMAGE_KEY, fullUrl);

      toast.success("Profile image updated");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Image upload failed");
    }
  };

  /* ================= REMOVE IMAGE ================= */
  const removeProfileImage = async () => {
    try {
      await api.delete("/auth/deleteprofile-image");

      setProfileImage(DEFAULT_AVATAR);
      localStorage.removeItem(DOCTOR_IMAGE_KEY);

      toast.success("Profile image removed");
    } catch (err) {
      toast.error("Failed to delete profile image");
    }
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      const payload = {
        doctorName: profile.doctorName || null,
        degree: profile.degree || null,
        specialization: profile.specialization || null,
        city: profile.city || null,
        address: profile.address || null,
        consultationFee: profile.consultationFee || null,
        timings: profile.timings || null,
        experienceYears: profile.experienceYears || null,
        mobile: profile.mobile || null,
        email: profile.email || null,
      };

      await updateDoctorProfile(payload);
      toast.success("Profile updated successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
      return false;
    }
  };

  return {
    profile,
    profileImage,
    loading,
    handleImageChange,
    removeProfileImage,
    handleChange,
    saveProfile,
  };
}
