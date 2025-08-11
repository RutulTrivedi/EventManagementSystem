"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CreatorHeader from "../components/CreatorHeader"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const CreatorEvents = () => {
  const [myEvents, setMyEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState("All")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    eventID: 0,
    eventTitle: "",
    eventDescription: "",
    eventLocation: "",
    eventDateTime: "",
    userID: 0,
  })

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
    const role = JSON.parse(localStorage.getItem("user")).userRole;
    if (role === "Creator") {
      navigate("/creator/events");
    }
    else {
      navigate("/participant/dashboard");
    }
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    setLoading(true)
    try {
      const userId = JSON.parse(localStorage.getItem("user")).userID
      setFormData((prev) => ({ ...prev, userID: userId }))
      const response = await fetch(`http://localhost:5251/api/event/user/${userId}`)
      const result = await response.json()
      const sorted = result.data.sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime))

      for (var e in sorted) {
        var count = await fetchRegistrationCount(e)
        console.log(count)
      }
      setMyEvents(sorted)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (event) => {
    setSelectedEvent(event)
    setFormData({
      eventID: event.eventID,
      eventTitle: event.eventTitle,
      eventDescription: event.eventDescription,
      eventLocation: event.eventLocation,
      eventDateTime: event.eventDateTime,
      userID: JSON.parse(localStorage.getItem("user")).userID,
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = (event) => {
    setSelectedEvent(event)
    setShowDeleteModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5251/api/event/${selectedEvent.eventID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setShowEditModal(false)
        // console.log("Event updated successfully.")
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Event updated successfully.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#008000",
          color: "#ffffff"
        });
        fetchMyEvents()
      }
      else {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "error",
          title: "Event updation failed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#ff0000",
          color: "#ffffff"
        });
      }
    } catch (error) {
      console.log("Event update failed.", error)
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Event updation failed.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5251/api/event/${selectedEvent.eventID}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setShowDeleteModal(false)
        console.log("Event deleted successfully.")
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Event deleted failed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#008000",
          color: "#ffffff"
        });
        fetchMyEvents()
      }
      else {
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "error",
          title: "Event deletion failed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#ff0000",
          color: "#ffffff"
        });
      }
    } catch (error) {
      console.log("Event deletion failed.", error)
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Event deletion failed.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5251/api/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setShowAddModal(false)
        console.log("Event created successfully.")
        fetchMyEvents()
        Swal.fire({
          toast: true,
          position: "bottom-end",
          icon: "success",
          title: "Event created successfully.",
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
          title: "Event creation failed.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#ff0000",
          color: "#ffffff"
        });
      }
    } catch (error) {
      console.log("Event creation failed.", error)
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "error",
        title: "Event creation failed.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#ff0000",
        color: "#ffffff"
      });
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrationCount = async (id) => {
    try {
      const response = await fetch(`http://localhost:5251/api/registration/event/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        const result = await response.json()
        return result.eventData?.length || 0
      } else {
        return 0
      }
    } catch (ex) {
      console.error(`Error fetching count for event ${id}`, ex)
      return 0
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  const filteredEvents = myEvents.filter((event) => {
    const now = new Date()
    const eventDate = new Date(event.eventDateTime)
    if (activeTab === "Upcoming") {
      return eventDate > now
    } else if (activeTab === "Completed") {
      return eventDate < now
    }
    return true
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
        <CreatorHeader />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">My Events</h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setFormData({
                eventID: 0,
                eventTitle: "",
                eventDescription: "",
                eventLocation: "",
                eventDateTime: "",
                userID: JSON.parse(localStorage.getItem("user")).userID,
              })
              setShowAddModal(true)
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-secondary rounded-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-lg">+</span>
            Add Event
          </motion.button>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 sm:gap-4 mb-8"
        >
          {["All", "Upcoming", "Completed"].map((tab) => (
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

                  {/* Actions Section */}
                  <div className="flex flex-col justify-between items-end gap-4">
                    {/* Registration Count */}
                    <div className="text-center lg:text-right">
                      <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                        className="text-2xl sm:text-3xl font-extrabold text-primary"
                      >
                        10+
                      </motion.span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          navigate("/creator/events/detail", { state: { event } })
                          console.log("Navigate to event detail")
                        }}
                        className="px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 text-secondary rounded-lg font-medium transition-all duration-300 text-sm"
                      >
                        View
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditClick(event)}
                        className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary/80 text-secondary rounded-lg font-medium transition-all duration-300 text-sm"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteClick(event)}
                        className="px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-secondary rounded-lg font-medium transition-all duration-300 text-sm"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
            : !loading && <PlaceholderComponent message={`No ${activeTab.toLowerCase()} events found`} />}
        </motion.div>
      </main>

      {/* Edit Modal */}
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
                <h3 className="text-xl sm:text-2xl font-bold text-primary">Edit Event</h3>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
                  <input
                    type="text"
                    value={formData.eventTitle}
                    onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Description</label>
                  <textarea
                    value={formData.eventDescription}
                    onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Location</label>
                  <input
                    type="text"
                    value={formData.eventLocation}
                    onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Date & Time</label>
                  <input
                    type="datetime-local"
                    min={getMinDateTime()}
                    value={formData.eventDateTime.slice(0, 16)}
                    onChange={(e) => setFormData({ ...formData, eventDateTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    required
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
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-secondary rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
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
                <h3 className="text-xl sm:text-2xl font-bold text-primary">Add New Event</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                  ×
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
                  <input
                    type="text"
                    value={formData.eventTitle}
                    onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Description</label>
                  <textarea
                    value={formData.eventDescription}
                    onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Location</label>
                  <input
                    type="text"
                    value={formData.eventLocation}
                    onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Date & Time</label>
                  <input
                    type="datetime-local"
                    min={getMinDateTime()}
                    value={formData.eventDateTime}
                    onChange={(e) => setFormData({ ...formData, eventDateTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-secondary rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-secondary rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Event"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
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
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-primary mb-4">Confirm Delete</h3>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete the event{" "}
                  <span className="font-semibold text-primary">"{selectedEvent?.eventTitle}"</span>?
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-3 bg-gray-400 hover:bg-gray-500 text-secondary rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-secondary rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Delete"}
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

export default CreatorEvents
