"use client"

import { motion, AnimatePresence} from "framer-motion"
import { useState } from "react";
import { useNavigate } from "react-router-dom"

const CreatorHeader = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("expiry")
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
      <header
        className="bg-gradient-to-r from-primary via-primary/90 to-primary text-secondary shadow-lg py-4 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="font-bold text-3xl sm:text-4xl lg:text-5xl text-secondary cursor-pointer"
          >
            EventSync
          </motion.span>
          <span className="italic text-sm sm:text-base text-secondary/80">Event Management System</span>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/creator/dashboard"
            className="relative group text-secondary hover:text-secondary/80 transition-colors duration-300 font-medium"
          >
            Dashboard
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/creator/events"
            className="relative group text-secondary hover:text-secondary/80 transition-colors duration-300 font-medium"
          >
            My Events
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/profile"
            className="relative group text-secondary hover:text-secondary/80 transition-colors duration-300 font-medium"
          >
            Profile
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogoutModal(true)}
            className="bg-secondary text-primary px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
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
                  onClick={handleLogout}
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

export default CreatorHeader
