"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import CreatorHeader from "../components/CreatorHeader"
import EventPlaceholer from "../assets/placeholder.jpg";
import Placeholder from "../components/Placeholder"

const CreatorDashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([])
    const [myEvents, setMyEvents] = useState([])
    const [registrationData, setRegistrationData] = useState({})

    useEffect(() => {
        const expiry = localStorage.getItem("expiry")
        if (!expiry || Number(expiry) < Date.now()) {
            localStorage.removeItem("user")
            localStorage.removeItem("expiry")
            localStorage.removeItem("token")
            // Show toast notification
            console.log("Session expired. Please login again.")
            navigate("/");
            return
        }

        const role = JSON.parse(localStorage.getItem("user")).userRole;
    if (role === "Creator") {
      navigate("/creator/dashboard");
    }
    else{
      navigate("/participant/dashboard");
    }

        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5251/api/event", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const result = await response.json()
                // Sort by eventDateTime ascending (closest date first)
                const sortedEvents = result.data.sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime))
                setEvents(sortedEvents)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchMyEvents = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5251/api/event/user/" + JSON.parse(localStorage.getItem("user")).userID,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                )
                const result = await response.json()
                setMyEvents(result.data)
            } catch (error) {
                console.log(error)
            }
        }

        const fetchRegistrations = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5251/api/event/participants/count/" + JSON.parse(localStorage.getItem("user")).userID,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                )
                const result = await response.json()
                setRegistrationData(result)
            } catch (error) {
                console.log(error)
            }
        }

        fetchEvents()
        fetchMyEvents()
        fetchRegistrations()
    }, [])

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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3,
            },
        },
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Placeholder */}
            <div className="sticky top-0 z-50 bg-secondary shadow-sm border-b border-gray-200">
               <CreatorHeader />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Page Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">Admin Dashboard</h2>
                    <div className="w-20 h-1 bg-primary rounded-full"></div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 lg:mb-12"
                >
                    {/* Events Hosted Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="relative bg-secondary bg-opacity-95 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-xl border border-primary/20 shadow-lg group overflow-hidden cursor-pointer"
                    >
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-500"></div>

                        {/* Decorative Circle */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <motion.div
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                                    className="text-primary/30"
                                >
                                    ✨
                                </motion.div>
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">Events Hosted</h3>
                            <p
                                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary"
                            >
                                {myEvents.length}
                            </p>
                        </div>
                    </motion.div>

                    {/* Total Participation Card */}
                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        className="relative bg-secondary bg-opacity-95 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-xl border border-primary/20 shadow-lg group overflow-hidden cursor-pointer"
                    >
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-500"></div>

                        {/* Decorative Circle */}
                        <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                                    <svg
                                        className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                                    className="text-primary/30"
                                >
                                    👥
                                </motion.div>
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-primary mb-2">Total Participation</h3>
                            <p
                                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary"
                            >
                                {registrationData.totalParticipants || 0}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Events Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">Upcoming Events</h2>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="text-primary/60"
                        >
                            🎯
                        </motion.div>
                    </div>
                    <div className="w-16 h-1 bg-primary rounded-full"></div>
                </motion.div>

                {/* Events List */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 sm:space-y-6">
                    {events.length === 0 ? (
                        <motion.div
                            variants={itemVariants}
                            className="text-center py-12 bg-secondary rounded-xl border border-gray-200"
                        >
                            <div className="text-4xl mb-4">📅</div>
                            <p className="text-gray-500 text-lg">No upcoming events found</p>
                        </motion.div>
                    ) : (
                        events.map((event, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                }}
                                className="bg-secondary p-3 sm:p-4 lg:p-6 rounded-xl shadow-md border border-gray-100 hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center">
                                    {/* Event Image */}
                                    <div className="w-full lg:w-48 xl:w-56 shrink-0">
                                        <div className="relative overflow-hidden rounded-lg border border-gray-200 group-hover:border-primary/30 transition-colors  duration-300">
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full h-32 sm:h-36 lg:h-32 xl:h-36 object-contain"
                                                src='../../src/assets/placeholder1.jpg'
                                                alt={`Event: ${event.eventTitle}`}
                                            />
                                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 object-cover transition-colors duration-300"></div>
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
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </main>
        </div>
    )
}

export default CreatorDashboard;