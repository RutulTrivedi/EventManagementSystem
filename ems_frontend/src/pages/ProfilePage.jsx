"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CreatorHeader from "../components/CreatorHeader"
import ParticipantHeader from "../components/ParticipantHeader"
import Swal from "sweetalert2"

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)
  const [passwordForUpdate, setPasswordForUpdate] = useState("")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const expiry = localStorage.getItem("expiry")
    if (!expiry || Number(expiry) < Date.now()) {
      localStorage.removeItem("user")
      localStorage.removeItem("expiry")
      localStorage.removeItem("token")
      console.log("Session expired. Please login again.")
      navigate("/");
      return
    }
    // Load User
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser) {
      setUser(storedUser)
      setEditFormData(storedUser)
    }
  }, [])

  const handleSaveClick = () => {
    setShowEditModal(false)
    setPasswordForUpdate("")
    setShowPasswordModal(true)
  }

  const verifyPasswordAndUpdate = async () => {
    setLoading(true)
    try {
      const checkRes = await fetch("http://localhost:5251/api/user/checkpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.userID,
          userPassword: passwordForUpdate,
        }),
      })
      const checkData = await checkRes.json()
      console.log(checkData)
      if (!checkData.success || !checkData.data) {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        console.log("Incorrect password.")
        setShowPasswordModal(false)
        setUser(storedUser);
        setEditFormData(storedUser)
        return
      }

      console.log(editFormData)
      editFormData.userPassword = passwordForUpdate
      // Step 2: Update profile
      const updateRes = await fetch(`http://localhost:5251/api/user/${user.userID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      })

      editFormData.userPassword = null
      if (updateRes.ok) {
        localStorage.setItem("user", JSON.stringify(editFormData))
        setUser(editFormData)
        setShowPasswordModal(false)
        console.log("Profile updated successfully.")
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Profile updated successfully.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#008000",
          color: "#ffffff"
        });
      }
      else {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "error",
          title: "Profile updation failed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#008000",
          color: "#ffffff"
        });
      }
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Profile updation failed.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Placeholder */}
      <div className="sticky top-0 z-50 bg-secondary shadow-sm border-b border-gray-200">
        {user.userRole == 'Creator' ? <CreatorHeader /> : <ParticipantHeader />}
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">My Profile</h2>
          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-secondary rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 sm:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-secondary">
                  {user.userFullName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary">{user.userFullName}</h3>
                <p className="text-gray-600">{user.userRole}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900">{user.userFullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-lg font-semibold text-gray-900">{user.userEmail}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Mobile</label>
                  <p className="text-lg font-semibold text-gray-900">{user.userMobile}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {user.userRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEditModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-secondary rounded-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
              >
                Edit Profile
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-secondary rounded-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-primary">Edit Profile</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSaveClick()
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.userFullName || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, userFullName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={editFormData.userEmail || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, userEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Mobile</label>
                  <input
                    type="text"
                    value={editFormData.userMobile || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, userMobile: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Role</label>
                  <input
                    type="text"
                    value={editFormData.userRole || ""}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-secondary rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-secondary rounded-lg font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Confirmation Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-secondary rounded-xl p-6 sm:p-8 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-bold text-primary mb-2">Confirm Update</h3>
                <p className="text-gray-600">Please enter your password to confirm changes.</p>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  value={passwordForUpdate}
                  onChange={(e) => setPasswordForUpdate(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  required
                />

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-secondary rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={verifyPasswordAndUpdate}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-secondary rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Confirming..." : "Confirm"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfilePage
