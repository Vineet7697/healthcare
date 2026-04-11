import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { notify } from "../../utils/notify";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      notify.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      notify.success("Password reset successful");
      navigate("/login");

    } catch (err) {
      notify.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 px-4">
      
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mb-3">
            <Lock className="text-indigo-600" size={28} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Reset Password
          </h2>

          <p className="text-gray-500 text-sm text-center mt-1">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <label className="text-sm text-gray-600">
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              className="w-full mt-1 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 rounded-lg outline-none transition pr-10"
            />

            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="relative">
            <label className="text-sm text-gray-600">
              Confirm Password
            </label>

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full mt-1 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 p-2 rounded-lg outline-none transition pr-10"
            />

            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white p-2.5 rounded-lg font-medium shadow"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}