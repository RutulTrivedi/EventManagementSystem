"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

const ParticipantHeader = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("expiry")
    console.log("Logout successful.")
    navigate("/");
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

  return (
    <>
      {/* HEADER */}
      <header
        className="bg-gradient-to-r from-primary to-primary/90 text-secondary shadow-lg py-4 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 sticky top-0 z-50"
      >
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-wide cursor-pointer"
          >
            EventSync
          </motion.span>
          <span className="italic text-sm sm:text-base text-secondary/80">Event Management System</span>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base font-medium"
        >
          <motion.a whileHover={{ scale: 1.05 }} href="/participant/dashboard" className="relative group">
            <span className="transition-colors">Dashboard</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-secondary transition-all group-hover:w-full"></span>
          </motion.a>

          <motion.a whileHover={{ scale: 1.05 }} href="/participant/events" className="relative group">
            <span className="transition-colors">My Events</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-secondary transition-all group-hover:w-full"></span>
          </motion.a>

          <motion.a whileHover={{ scale: 1.05 }} href="/profile" className="relative group">
            <span className=" transition-colors">Profile</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-secondary transition-all group-hover:w-full"></span>
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogoutModal(true)}
            className="bg-secondary bg-secondary/80 text-primary px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Logout
          </motion.button>
        </motion.nav>
      </header>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-secondary rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center"
            >
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4">Confirm Logout</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogoutConfirm}
                  className="bg-red-600 hover:bg-red-700 text-secondary px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Yes, Logout
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ParticipantHeader
