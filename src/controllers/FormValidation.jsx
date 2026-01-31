// ✅ Validation for Client Login Form
export const validateLoginForm = ({ identifier, password }) => {
  const errors = {};

  if (!identifier) {
    errors.identifier = "Phone number or email is required";
  } else {
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const isPhone = /^[6-9]\d{9}$/.test(identifier);

    if (!isEmail && !isPhone) {
      errors.identifier = "Enter valid phone number or email";
    }
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};


// validation for client RegisterForm
export const validateRegisterForm = (formData) => {
  const errors = {};

  // Full Name
  if (!formData.fullName?.trim()) {
    errors.fullName = "Full name is required.";
  }

  // Phone
  if (!formData.phone?.trim()) {
    errors.phone = "Mobile number is required";
  } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    errors.phone = "Mobile number must be 10 digits";
  }

  // Email
  if (!formData.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  // Password
  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (
    !/[A-Z]/.test(formData.password) ||
    !/[a-z]/.test(formData.password) ||
    !/[0-9]/.test(formData.password) ||
    !/[!@#$%^&*]/.test(formData.password)
  ) {
    errors.password =
      "Password must contain uppercase, lowercase, number & special character.";
  }

  // Confirm Password
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  // Gender
  if (!formData.gender) {
    errors.gender = "Gender is required.";
  }

  // DOB
  if (!formData.dob) {
    errors.dob = "Date of birth is required.";
  }

  return errors;
};

// validation for DoctorLogin
export const validateDoctorLogin = (values) => {
  const errors = {};

  if (!values.identifier) {
    errors.identifier = "Email or mobile number is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};


// validation for DoctorRegistration
export const validateDoctorRegistration = (values) => {
  const errors = {};

  // ---------------- Doctor Information ----------------
  if (!values.doctorName?.trim()) {
    errors.doctorName = "Doctor Name is required";
  } else if (values.doctorName.length < 3) {
    errors.doctorName = "Doctor Name must be at least 3 characters";
  }

  if (!values.degree?.trim()) {
    errors.degree = "Degree is required";
  }

  if (!values.licenseNumber?.trim()) {
    errors.licenseNumber = "License Number is required";
  }

  // ---------------- Email ----------------

  if (!values.email?.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
// ---------------- Mobile Number ----------------
  if (!values.phone?.trim()) {
    errors.phone = "Mobile Number is required";
  } else if (!/^[6-9]\d{9}$/.test(values.phone)) {
    errors.phone = "Mobile Number must be a valid 10-digit number";
  }
  
  // -------- Password --------
  if (!values.password?.trim()) {
    errors.password = "Password is required";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
      values.password
    )
  ) {
    errors.password =
      "Password must be at least 6 characters and include uppercase, lowercase, number & special character";
  }

  // -------- Confirm Password --------
  if (!values.confirmPassword?.trim()) {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // ---------------- Clinic Information ----------------
  if (!values.clinicName?.trim()) {
    errors.clinicName = "Clinic Name is required";
  }

  if (!values.city?.trim()) {
    errors.city = "City is required";
  }

  if (!values.address?.trim()) {
    errors.address = "Address is required";
  }

  // ---------------- Consultation Details ----------------
  if (values.consultationFee && Number(values.consultationFee) < 0) {
    errors.consultationFee = "Consultation fee must be a positive number";
  }

  if (!values.timings?.trim()) {
    errors.timings = "Timings are required";
  }

  if (!values.availableDays || values.availableDays.length === 0) {
    errors.availableDays = "Select at least one available day";
  }

  return errors;
};

// Book Appoinmentpage validation

export const validateFamilyMember = (member) => {
  const errors = {};

  if (!member.name.trim()) {
    errors.name = "Name is required";
  }

  if (!member.age || isNaN(member.age) || member.age <= 0) {
    errors.age = "Please enter a valid age";
  }

  if (!member.Aadhar || !/^\d{12}$/.test(member.Aadhar)) {
    errors.Aadhar = "Aadhar must be a 12-digit number";
  }

  if (!member.MobileNumber || !/^[6-9]\d{9}$/.test(member.MobileNumber)) {
    errors.MobileNumber = "Enter a valid 10-digit mobile number";
  }

  return errors;
};

// change password validation

export const validatePasswordFields = (fields) => {
  const { currentPassword, newPassword, confirmPassword } = fields;
  const errors = {};

  // Current password validation
  if (!currentPassword.trim()) {
    errors.currentPassword = "Current password is required";
  }

  // New password validation
  if (!newPassword.trim()) {
    errors.newPassword = "New password is required";
  } else if (newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters long";
  } else if (!/[A-Z]/.test(newPassword)) {
    errors.newPassword = "Password must include at least one uppercase letter";
  } else if (!/[a-z]/.test(newPassword)) {
    errors.newPassword = "Password must include at least one lowercase letter";
  } else if (!/[0-9]/.test(newPassword)) {
    errors.newPassword = "Password must include at least one number";
  } else if (!/[!@#$%^&*]/.test(newPassword)) {
    errors.newPassword =
      "Password must include at least one special character (!@#$%^&*)";
  }

  // Confirm password validation
  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
