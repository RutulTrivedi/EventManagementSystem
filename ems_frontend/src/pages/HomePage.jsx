"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    userEmail: "",
    userPassword: "",
  })
  const [registerData, setRegisterData] = useState({
    userFullName: "",
    userEmail: "",
    userMobile: "",
    userRole: "Participant",
    userPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const now = new Date()

  useEffect(() => {
    const expiry = localStorage.getItem("expiry")
    if (Number(expiry) > Date.now()) {
      const user = JSON.parse(localStorage.getItem("user"))
      if (user.userRole === "Creator") {
        navigate("/creator/dashboard");
      } else {
        navigate("/participant/dashboard");
      }
      return
    } else {
      // navigate("/");
    }
  }, [])

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:5251/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })
      const result = await response.json()

      console.log(result.success ? "Success" : "Error", result.message)

      if (result.success) {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Login successful.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#008000",
          color: "#ffffff"
        });
        localStorage.setItem("token", result.data.token)
        localStorage.setItem("user", JSON.stringify(result.data.user))
        localStorage.setItem("expiry", now.getTime() + 30 * 60 * 1000)
        setShowLogin(false)
        if (result.data.user.userRole === "Creator") {
          navigate("/creator/dashboard");
        } else {
          navigate("/participant/dashboard");
        }
      }
      else {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "error",
          title: "Login failed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#ff0000",
          color: "#ffffff"
        });
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Login failed")
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Login failed.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
    } finally {
      setLoading(false)
      setLoginData({ userEmail: "", userPassword: "" })
      setRegisterData({ userFullName: "", userEmail: "", userMobile: "", userRole: "Participant", userPassword: "" })
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:5251/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })
      const result = await response.json()

      // Toast notification would go here
      console.log(result.success ? "Success" : "Error", result.message)

      if (result.success) {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Registered successfully.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#008000",
          color: "#ffffff"
        });
        localStorage.setItem("token", result.data.token)
        localStorage.setItem("user", JSON.stringify(result.data.user))
        localStorage.setItem("expiry", now.getTime() + 30 * 60 * 60)
        setShowRegister(false)
        if (result.data.user.userRole === "Creator") {
          navigate("/creator/dashboard");
        } else {
          navigate("/participant/dashboard");
        }
      }
      else {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "error",
          title: "Registeration failed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#ff0000",
          color: "#ffffff"
        });
      }
    } catch (err) {
      console.error("Register error:", err)
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Registration failed.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
      setLoginData({ userEmail: "", userPassword: "" })
      setRegisterData({ userFullName: "", userEmail: "", userMobile: "", userRole: "Participant", userPassword: "" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary text-gray-800 font-sans">
      {/* Header */}
      <header className="w-full bg-secondary/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-extrabold text-primary">EventSync</span>
            <span className="text-lg italic text-primary opacity-80">An Event Management System</span>
          </div>
          <div className="space-x-3">
            <button
              onClick={() => setShowLogin(true)}
              className="relative text-primary font-medium group hover:text-primary/80 transition-colors"
            >
              Login
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </button>
            <button
              onClick={() => setShowRegister(true)}
              className="bg-primary hover:bg-primary/90 text-secondary px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-primary text-secondary py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center px-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Your Gateway to Seamless Events</h2>
          <p className="mb-8 text-lg md:text-xl opacity-90">
            Create and Manage events effortlessly with EventSync.
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-secondary hover:bg-secondary/90 text-primary px-8 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-secondary">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center text-primary mb-12"
          >
            How It Works
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-8">
            {["Register", "Explore & Create", "Participate"].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-secondary p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 text-center border border-gray-200 hover:-translate-y-1"
              >
                <h4 className="text-xl font-semibold mb-3 text-primary">
                  {index + 1}. {step}
                </h4>
                <p className="text-gray-600">
                  {
                    [
                      "Create your free account.",
                      "Find exciting events or create your own with ease.",
                      "Register and Manage events without hassle.",
                    ][index]
                  }
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="pb-20 bg-secondary">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-primary mb-8"
          >
            Why Choose EventSync?
          </motion.h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>Secure and reliable platform</li>
              <li>Easy participant registration</li>
              <li>Real-time event analytics</li>
              <li>Manage events effortlessly</li>
            </ul>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>Flexible event creation</li>
              <li>Accessible anytime, anywhere</li>
              <li>Multiple roles: Creator & Participant</li>
              <li>Designed for scalability and speed</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-primary mb-12"
          >
            What Our Users Say
          </motion.h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { text: `"This platform made my tech fest a huge success!"`, name: "Aarti, Creator" },
              { text: `"I discovered so many events I'd never known before."`, name: "Rahul, Participant" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-secondary p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <p className="italic text-gray-700">{t.text}</p>
                <p className="font-semibold mt-4 text-primary">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-secondary py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h4 className="font-bold text-lg">EventSync</h4>
            <p className="text-sm opacity-80">© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          <div className="space-y-2 text-sm">
            <p>📧 rutultrivedi7@gmail.com</p>
            <p>📞 +91 98765 43210</p>
            <div className="space-x-4">
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Terms
              </a>
              <a href="#" className="hover:underline">
                About
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-secondary bg-opacity-70 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-secondary/95 backdrop-blur-lg p-6 rounded-xl shadow-xl w-full max-w-md relative"
          >
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600 transition"
              onClick={() => {
                setShowLogin(false)
                setLoginData({ userEmail: "", userPassword: "" })
              }}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center text-primary">Login</h2>
            <form
              className={`mt-6 space-y-4 ${loading ? "pointer-events-none opacity-50" : ""}`}
              onSubmit={handleLogin}
            >
              <input
                type="text"
                name="userEmail"
                placeholder="Enter Email"
                value={loginData.userEmail}
                onChange={(e) => setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-secondary"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="userPassword"
                  placeholder="Enter Password"
                  value={loginData.userPassword}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none pr-10 bg-secondary"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary/90 text-secondary rounded-lg font-semibold shadow-sm transition"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-secondary/95 backdrop-blur-lg p-6 rounded-xl shadow-xl w-full max-w-md relative"
          >
            <button
              className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-600 transition"
              onClick={() => {
                setShowRegister(false)
                setRegisterData({
                  userFullName: "",
                  userEmail: "",
                  userMobile: "",
                  userRole: "Participant",
                  userPassword: "",
                })
              }}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center text-primary">Register</h2>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-secondary"
              />
              <input
                type="email"
                name="userEmail"
                placeholder="Email"
                value={registerData.userEmail}
                onChange={handleRegisterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-secondary"
              />
              <input
                type="text"
                name="userMobile"
                placeholder="Mobile Number"
                value={registerData.userMobile}
                onChange={handleRegisterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-secondary"
              />
              <input
                type="password"
                name="userPassword"
                placeholder="Password"
                value={registerData.userPassword}
                onChange={handleRegisterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-secondary"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary/90 text-secondary rounded-lg font-semibold shadow-sm transition"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default HomePage
