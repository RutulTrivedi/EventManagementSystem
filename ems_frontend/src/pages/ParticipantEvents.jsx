"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ParticipantHeader from "../components/ParticipantHeader"
import Swal from "sweetalert2"

const ParticipantEvents = () => {
  const [events, setEvents] = useState([])
  const [registeredEventIds, setRegisteredEventIds] = useState([])
  const [activeTab, setActiveTab] = useState("All")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [viewModel, setViewModel] = useState(false)
  const [viewModelData, setViewModelData] = useState(null)
  const [loading, setLoading] = useState(false)
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const navigate = useNavigate()
  useEffect(() => {
    const expiry = localStorage.getItem("expiry")
    if (!expiry || Number(expiry) < Date.now()) {
      localStorage.clear()
      console.log("Session expired. Please login again.")
      navigate("/");
      return
    }

    const role = JSON.parse(localStorage.getItem("user")).userRole;
    if (role === "Creator") {
      navigate("/creator/events");
    }
    else {
      navigate("/participant/events");
    }
    fetchEvents()
    fetchUserRegistrations()
  }, [])

  const openRegisterModal = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedEvent(null)
    setShowModal(false)
  }

  const closeViewModal = () => {
    setViewModelData(null)
    setViewModel(false)
  }

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5251/api/event`)
      const result = await res.json()
      if (result?.data) {
        const sorted = result.data.sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime))
        setEvents(sorted)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRegistrations = async () => {
    try {
      const res = await fetch(`http://localhost:5251/api/registration/user/${user.userID}`)
      const result = await res.json()
      if (Array.isArray(result?.data)) {
        const ids = result.data.map((r) => r.eventID)
        setRegisteredEventIds(ids)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleRegister = async (eventID) => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5251/api/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventID, userID: user.userID }),
      })
      if (res.ok) {
        console.log("Registered successfully.")
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
        setRegisteredEventIds((prev) => [...prev, eventID])
      }
      else {
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
      }
    } catch (err) {
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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const now = new Date()
    const eventDate = new Date(event.eventDateTime)
    const isRegistered = registeredEventIds.includes(event.eventID)

    if (activeTab === "Upcoming") {
      return eventDate > now && !isRegistered
    } else if (activeTab === "Completed") {
      return eventDate < now && !isRegistered
    } else if (activeTab === "Registered") {
      return isRegistered
    }
    return !isRegistered
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
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

  const PlaceholderComponent = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 bg-secondary rounded-xl border border-gray-200"
    >
      <div className="text-6xl mb-4">📅</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Placeholder */}
      <div className="sticky top-0 z-50 bg-secondary shadow-sm border-b border-gray-200">
        <ParticipantHeader />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">Events</h2>
          <div className="w-16 h-1 bg-primary rounded-full"></div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 sm:gap-4 mb-8"
        >
          {["All", "Upcoming", "Completed", "Registered"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab
                  ? "bg-primary text-secondary shadow-lg"
                  : "bg-secondary text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Events List */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 sm:space-y-6">
          {!loading && filteredEvents.length > 0
            ? filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-secondary p-4 sm:p-6 rounded-xl shadow-md border border-gray-100 hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* Event Image */}
                  <div className="w-full lg:w-48 xl:w-56 shrink-0">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 group-hover:border-primary/30 transition-colors duration-300">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-32 sm:h-36 lg:h-32 xl:h-36 object-contain"
                        src="../../src/assets/placeholder1.jpg"
                        alt={`Event: ${event.eventTitle}`}
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></div>

                      {/* Event Status Badge */}
                      <div className="absolute top-2 right-2">
                        {registeredEventIds.includes(event.eventID) ? (
                          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Registered
                          </span>
                        ) : new Date(event.eventDateTime) > new Date() ? (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Upcoming
                          </span>
                        ) : (
                          <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Past
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <motion.h4
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-2 group-hover:text-primary/80 transition-colors duration-300 line-clamp-2"
                    >
                      {event.eventTitle}
                    </motion.h4>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 lg:line-clamp-3"
                    >
                      {event.eventDescription}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600"
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-primary">📍</span>
                        <span className="font-medium truncate">{event.eventLocation}</span>
                      </div>
                      <div className="hidden sm:block text-gray-400">|</div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary">🗓️</span>
                        <span className="font-medium">{new Date(event.eventDateTime).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-end items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setViewModel(true)
                        setViewModelData(event)
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-secondary rounded-lg font-medium transition-all duration-300 text-sm"
                    >
                      View
                    </motion.button>

                    {registeredEventIds.includes(event.eventID) ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-400 text-secondary rounded-lg cursor-not-allowed text-sm font-medium"
                      >
                        Registered
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openRegisterModal(event)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-secondary rounded-lg font-medium transition-all duration-300 text-sm"
                      >
                        Register
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
            : !loading && <PlaceholderComponent message={`No ${activeTab.toLowerCase()} events found`} />}
        </motion.div>
      </main>

      {/* Register Modal */}
      <AnimatePresence>
        {showModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-secondary rounded-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
              >
                ×
              </button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🎟️</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Event Registration</h2>
                <p className="text-gray-600">Confirm your registration for this event</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Event Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Title:</span> {selectedEvent.eventTitle}
                    </p>
                    <p>
                      <span className="font-medium">Description:</span> {selectedEvent.eventDescription}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {selectedEvent.eventLocation}
                    </p>
                    <p>
                      <span className="font-medium">Date & Time:</span>{" "}
                      {new Date(selectedEvent.eventDateTime).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-secondary rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleRegister(selectedEvent.eventID)
                    closeModal()
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-secondary rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register Now"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {viewModel && viewModelData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-secondary rounded-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
              >
                ×
              </button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📋</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Event Details</h2>
                <p className="text-gray-600">Complete information about this event</p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Event Title</h3>
                      <p className="text-gray-700">{viewModelData.eventTitle}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Description</h3>
                      <p className="text-gray-700">{viewModelData.eventDescription}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Location</h3>
                      <p className="text-gray-700">{viewModelData.eventLocation}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">Date & Time</h3>
                      <p className="text-gray-700">{new Date(viewModelData.eventDateTime).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={closeViewModal}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-secondary rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ParticipantEvents
