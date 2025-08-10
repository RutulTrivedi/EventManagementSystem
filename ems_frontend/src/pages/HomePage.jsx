import { useEffect, useState } from "react";
import { THEME_COLORS } from "../constants/colors";
import Swal from "sweetalert2";
import Loader from "../components/Loader";
import ModalBackdrop from "../components/ModalBackdrop";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    userEmail: "",
    userPassword: "",
  });

  const [registerData, setRegisterData] = useState({
    userFullName: "",
    userEmail: "",
    userMobile: "",
    userRole: "Participant",
    userPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const now = new Date();

  useEffect(() => {
    const expiry = localStorage.getItem("expiry");
    if (Number(expiry) > Date.now()) {
      const user = JSON.parse(localStorage.getItem("user"));
      
      if(user.userRole == "Creator"){
        navigate("/creator/dashboard");
      }
      return;
    }
    else{
      navigate("/");
      // Swal.fire({
      //   toast: true,
      //   position: "bottom-end",
      //   icon: error,
      //   title: "Login again.",
      //   showConfirmButton: false,
      //   timer: 3000,
      //   timerProgressBar: true,
      //   background: "#ff0000",
      //   color: "#ffffff"
      // });
    }
  }, []);

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5251/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: result.success ? "success" : "error",
        title: result.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#008000",
        color: "#ffffff"
      });

      if (result.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("expiry", now.getTime() + (30 * 60 * 1000));
        setShowLogin(false);
        navigate("/creator/dashboard");
      }
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message || "Login failed",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
    } finally {
      setLoading(false);
      setLoginData({ userEmail: "", userPassword: "" });
      setRegisterData({ userFullName: "", userEmail: "", userMobile: "", userRole: "Participant", userPassword: "" });
    }
  };



  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5251/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: result.success ? "success" : "error",
        title: result.message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#008000",
        color: "#ffffff"
      });

      if (result.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("expiry", now.getTime() + (30 * 60 * 60));
        setShowRegister(false);
        navigate("/creator/dashboard");
      }
    } catch (err) {
      console.error("Register error:", err);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message || "Login failed",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
    } finally {
      setLoading(false);
      setLoginData({ userEmail: "", userPassword: "" });
      setRegisterData({ userFullName: "", userEmail: "", userMobile: "", userRole: "Participant", userPassword: "" });
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="w-full bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <span>
            <span className="text-2xl font-bold text-[#27548A] pe-5">EventSync</span>
            <span className="text-xl italic text-[#27548A]">An Event Management System</span>
          </span>
          <div className="space-x-4">
            <button onClick={() => setShowLogin(true)} className="text-[#27548A] hover:underline">
              Login
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="bg-[#27548A] text-white px-4 py-2 rounded hover:bg-[#183B4E]"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#27548A] text-white py-20">
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Your Gateway to Seamless Events</h2>
          <p className="mb-6 text-lg">
            Create, Manage, and Attend events effortlessly with EventSync.
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-[#DDA853] text-[#27548A] px-6 py-3 font-semibold rounded hover:bg-yellow-500"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-[#27548A] mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {["Register", "Explore & Create", "Participate"].map((step, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded shadow text-center">
                <h4 className="text-xl font-semibold mb-2">{index + 1}. {step}</h4>
                <p>{[
                  "Create your free account as a Creator or Participant.",
                  "Find exciting events or create your own with ease.",
                  "Book, manage, and attend events without hassle."
                ][index]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="pb-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-[#27548A] mb-8">Why Choose EventSync?</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <ul className="list-disc list-inside space-y-2">
              <li>🔒 Secure and reliable platform</li>
              <li>🎫 Easy participant registration</li>
              <li>📊 Real-time event analytics</li>
              <li>⚙️ Manage events effortlessly</li>
            </ul>
            <ul className="list-disc list-inside space-y-2">
              <li>📅 Flexible event creation</li>
              <li>🌐 Accessible anytime, anywhere</li>
              <li>👥 Multiple roles: Creator & Participant</li>
              <li>🚀 Designed for scalability and speed</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-[#27548A] mb-12">What Our Users Say</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <p className="italic">"This platform made my tech fest a huge success!"</p>
              <p className="font-semibold mt-4">– Aarti, Event Organizer</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="italic">"I discovered so many events I’d never known before."</p>
              <p className="font-semibold mt-4">– Rahul, Participant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#27548A] text-white py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="font-bold text-lg">EventSync</h4>
            <p className="text-sm">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p>Contact: rutultrivedi7@gmail.com</p>
            <p>Phone: +91 98765 43210</p>
            <div className="space-x-4">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">About</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <ModalBackdrop>
          <button
            className="absolute top-2 right-3 text-xl"
            onClick={() => {
              setShowLogin(false);
              setLoginData({
                userEmail: "",
                userPassword: ""
              })
            }}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-center text-[#27548A]">Login</h2>

          <form
            className={`mt-6 space-y-4 ${loading ? "pointer-events-none opacity-50" : ""}`}
            onSubmit={handleLogin}
          >
            <input
              type="text"
              name="userEmail"
              placeholder="Enter Email"
              value={loginData.userEmail}
              onChange={(e) =>
                setLoginData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border rounded focus:outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="userPassword"
                placeholder="Enter Password"
                value={loginData.userPassword}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded focus:outline-none pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer"
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
          </form>
        </ModalBackdrop>
      )}

      {/* Register Modal */}
      {showRegister && (
        <ModalBackdrop>
          <button className="absolute top-2 right-3 text-xl" onClick={() => {
            setShowRegister(false);
            setRegisterData({
              userFullName: "",
              userEmail: "",
              userMobile: "",
              userRole: "Participant",
              userPassword: ""
            })
          }}>×</button>
          <h2 className="text-2xl font-bold text-center text-[#27548A]">Register</h2>
          <form
            className={`mt-6 space-y-4 ${loading ? "pointer-events-none opacity-50" : ""}`}
            onSubmit={handleRegister}
          >
            <input
              type="text"
              name="userFullName"
              placeholder="Full Name"
              value={registerData.userFullName}
              onChange={handleRegisterChange}
              className="w-full px-4 py-2 border rounded focus:outline-none"
            />
            <input
              type="email"
              name="userEmail"
              placeholder="Email"
              value={registerData.userEmail}
              onChange={handleRegisterChange}
              className="w-full px-4 py-2 border rounded focus:outline-none"
            />
            <input
              type="text"
              name="userMobile"
              placeholder="Mobile Number"
              value={registerData.userMobile}
              onChange={handleRegisterChange}
              className="w-full px-4 py-2 border rounded focus:outline-none"
            />
            <input
              type="password"
              name="userPassword"
              placeholder="Password"
              value={registerData.userPassword}
              onChange={handleRegisterChange}
              className="w-full px-4 py-2 border rounded focus:outline-none"
            />
            {/* Role */}
            <div className="flex flex-col space-y-2">
              <label className="font-medium text-gray-700">Select Role:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="userRole"
                    value="Creator"
                    checked={registerData.userRole === "Creator"}
                    onChange={handleRegisterChange}
                  />
                  <span>Creator</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="userRole"
                    value="Participant"
                    checked={registerData.userRole === "Participant"}
                    onChange={handleRegisterChange}
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
          </form>
        </ModalBackdrop>
      )}
    </div>
  );
};

export default HomePage;