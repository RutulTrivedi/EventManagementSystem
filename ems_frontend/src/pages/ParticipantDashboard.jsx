import ParticipantHeader from "../components/ParticipantHeader";
import { useEffect, useState } from "react";
import placeholder from '../assets/placeholder1.jpg';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const ParticipantDashboard = () => {
    const [events, setEvents] = useState([]);
    const [upcomingCount, setUpcomingCount] = useState(0);
    const [pastCount, setPastCount] = useState(0);
    // const [totalParticipation, setTotalParticipation] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        const expiry = localStorage.getItem("expiry");
        if (!expiry || Number(expiry) < Date.now()) {
            localStorage.removeItem("user");
            localStorage.removeItem("expiry");
            localStorage.removeItem("token");
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "Session expired. Please login again.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "#ff0000",
                color: "#ffffff"
            }).then(() => {
                navigate("/");
            });
            return;
        }

        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5251/api/event", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });
                const result = await response.json();
                const sortedEvents = result.data.sort(
                    (a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime)
                );
                setEvents(sortedEvents);

                const now = new Date();
                setUpcomingCount(sortedEvents.filter(e => new Date(e.eventDateTime) > now).length);
                setPastCount(sortedEvents.filter(e => new Date(e.eventDateTime) <= now).length);
            } catch (error) {
                console.log(error);
            }
        };

        // const fetchParticipationData = async () => {
        //     try {
        //         const userId = JSON.parse(localStorage.getItem("user")).userID;
        //         const res = await fetch(`http://localhost:5251/api/registration/user/${userId}`);
        //         const data = await res.json();
        //         setTotalParticipation(data.reduce((sum, reg) => sum + (reg.participantsCount || 1), 0));
        //     } catch (error) {
        //         console.log(error);
        //     }
        // };

        fetchEvents();
        // fetchParticipationData();
    }, []);

    const Card = ({ title, value }) => (
        <div className="relative bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-xl border border-[#27548A] shadow-xl transform hover:scale-105 hover:shadow-2xl transition duration-500 group overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#27548A] to-[#183B4E] opacity-10 group-hover:opacity-20 transition"></div>

            <div className="flex flex-col items-start space-y-2 z-10 relative">
                <h3 className="text-lg font-semibold text-[#27548A]">{title}</h3>
                <p className="text-4xl font-extrabold text-[#27548A]">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F3F7FB] to-[#E6EEF6]">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50">
                <ParticipantHeader />
            </div>

            <main className="p-6">
                <h2 className="text-3xl font-bold text-[#27548A] mb-8 tracking-tight">
                    Participant Dashboard
                </h2>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <Card title="Total Events" value={events.length} />
                    <Card title="Upcoming Events" value={upcomingCount} />
                    <Card title="Past Events" value={pastCount} />
                    {/* <Card title="Total Participation" value={totalParticipation} /> */}
                </div>

                {/* Events List */}
                <h2 className="text-2xl font-bold text-[#27548A] mb-6">All Events</h2>
                <div className="space-y-5">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="group bg-white bg-opacity-90 backdrop-blur-md border border-gray-200 p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col md:flex-row gap-4 items-center overflow-hidden"
                        >
                            {/* Event Image */}
                            <div className="shrink-0 w-full md:w-48 relative">
                                <img
                                    className="w-full h-36 object-cover rounded-lg border border-gray-200 transform group-hover:scale-105 transition duration-500"
                                    src={placeholder}
                                    alt={`Event: ${event.eventTitle}`}
                                />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-[#27548A] mb-2">
                                    {event.eventTitle}
                                </h4>
                                <p className="text-gray-700 mb-3 leading-relaxed">
                                    {event.eventDescription}
                                </p>
                                <div className="text-sm text-gray-500 flex flex-wrap gap-2 items-center">
                                    📍 <span className="font-medium">{event.eventLocation}</span>
                                    <span className="text-gray-400">|</span>
                                    🗓️ {new Date(event.eventDateTime).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ParticipantDashboard;