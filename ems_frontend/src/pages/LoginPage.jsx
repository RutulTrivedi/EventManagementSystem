// 📁 src/pages/LoginPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { THEME_COLORS } from "../constants/colors";

const LoginPage = () => {
  const [formData, setFormData] = useState({ userEmail: "", userPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.userEmail || !formData.userPassword) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      console.log(formData);
      setLoading(false);
    }, 3000);

    // Actual fetch logic (commented for now)
    // try {
    //   const response = await fetch("https://localhost:5001/api/auth/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   if (!response.ok) throw new Error("Invalid credentials.");
    //   const data = await response.json();
    // } catch (err) {
    //   setError(err.message || "Login failed.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundColor: THEME_COLORS.background }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md relative">
        {/* 🔒 Overlay Loader */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <Loader />
          </div>
        )}

        <h2 className="text-2xl font-bold text-center text-[#27548A]">Login</h2>

        <form
          className={`mt-6 space-y-4 ${loading ? "pointer-events-none opacity-50" : ""}`}
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="userEmail"
            placeholder="User Email"
            value={formData.userEmail}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="userPassword"
              placeholder="Password"
              value={formData.userPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer select-none"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-[#27548A] text-white rounded hover:bg-[#183B4E] transition"
          >
            Login
          </button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#DDA853] font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;