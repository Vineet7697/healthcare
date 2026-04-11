import { useState } from "react";
import { forgotPassword } from "../../services/authService";
import { notify } from "../../utils/notify";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      notify.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      notify.success(res.data.message);
      setEmail("");
    } catch (err) {
      notify.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-4">
      
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mb-3">
            <Mail className="text-blue-600" size={28} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Forgot Password
          </h2>

          <p className="text-gray-500 text-sm text-center mt-1">
            Enter your email and we will send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Email Address</label>

            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2 rounded-lg outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-2.5 rounded-lg font-medium shadow"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <button
              onClick={() => navigate(-1)}
              className="text-blue-500 font-medium hover:underline cursor-pointer"
            >
              Login here
            </button>
        </p>

      </div>
    </div>
  );
}