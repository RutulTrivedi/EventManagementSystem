// 📁 src/pages/RegisterPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { THEME_COLORS } from "../constants/colors";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
    userRole: "Participant", // default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.userEmail || !formData.userPassword || !formData.userRole) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // Simulated delay
    setTimeout(() => {
      console.log("Submitted Data:", formData);
      setLoading(false);
      alert("Registration successful. You can now login.");
    }, 3000);

    // Actual API logic (uncomment when needed)
    /*
    try {
      const response = await fetch("https://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed.");
      }

      alert("Registration successful. You can now login.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: THEME_COLORS.background }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md relative">
        {/* 🔄 Overlay Loader */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <Loader />
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-[#27548A]">Register</h2>

        <form
          className={`mt-6 space-y-4 ${loading ? "pointer-events-none opacity-50" : ""}`}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="userEmail"
            placeholder="Enter Email"
            value={formData.userEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />

          <input
            type="password"
            name="userPassword"
            placeholder="Enter Password"
            value={formData.userPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />

          {/* 👤 Role Selection (Radio Buttons) */}
          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700">Select Role:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="userRole"
                  value="Creator"
                  checked={formData.userRole === "Creator"}
                  onChange={handleChange}
                />
                <span>Creator</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="userRole"
                  value="Participant"
                  checked={formData.userRole === "Participant"}
                  onChange={handleChange}
                />
                <span>Participant</span>
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-[#27548A] text-white rounded hover:bg-[#183B4E] transition"
          >
            Register
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-[#DDA853] font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;