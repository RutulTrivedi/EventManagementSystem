import CreatorHeader from "../components/CreatorHeader";
import { THEME_COLORS } from "../constants/colors";
import { useEffect, useState } from "react";
import placeholder from '../assets/placeholder1.jpg';
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom';

const CreatorDashboard = () => {
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [registrationData, setRegistrationData] = useState({});

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
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const result = await response.json();

                // Sort by eventDateTime ascending (closest date first)
                const sortedEvents = result.data.sort((a, b) =>
                    new Date(a.eventDateTime) - new Date(b.eventDateTime)
                );

                setEvents(sortedEvents);
            }
            catch (error) {
                console.log(error);
            }
        };


        const fetchMyEvents = async () => {
            try {
                const response = await fetch("http://localhost:5251/api/event/user/" + JSON.parse(localStorage.getItem("user")).userID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const result = await response.json();
                setMyEvents(result.data);
            }
            catch (error) {
                console.log(error);
            }
        };

        const fetchRegistrations = async () => {
            try {
                const response = await fetch("http://localhost:5251/api/event/participants/count/" + JSON.parse(localStorage.getItem("user")).userID, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const result = await response.json();
                // console.log(result);
                setRegistrationData(result);
            }
            catch (error) {
                console.log(error);
            }
        }

        fetchEvents();
        fetchMyEvents();
        fetchRegistrations();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <CreatorHeader />

            <main className="p-6">
                <h2 className="text-3xl font-bold text-[#27548A] mb-6">Admin Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Card 1 */}
                    <div className="relative bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-xl border border-[#27548A] shadow-xl transform hover:scale-105 transition duration-500 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#27548A] to-[#183B4E] opacity-10 group-hover:opacity-20 transition"></div>
                        <div className="flex items-center space-x-4 z-10 relative">
                            <div>
                                <h3 className="text-lg font-semibold text-[#27548A]">Events Hosted</h3>
                                <p className="text-4xl font-extrabold text-[#27548A] mt-1">{myEvents.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 1 */}
                    <div className="relative bg-white bg-opacity-90 backdrop-blur-md p-6 rounded-xl border border-[#27548A] shadow-xl transform hover:scale-105 transition duration-500 group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#27548A] to-[#183B4E] opacity-10 group-hover:opacity-20 transition"></div>
                        <div className="flex items-center space-x-4 z-10 relative">
                            <div>
                                <h3 className="text-lg font-semibold text-[#27548A]">Total Participation</h3>
                                <p className="text-4xl font-extrabold text-[#27548A] mt-1">{registrationData.totalParticipants}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events List */}
                <h2 className="text-2xl font-bold text-[#27548A] mb-6">Upcoming Events</h2>
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition flex flex-col md:flex-row gap-4 items-center"
                        >
                            {/* Event Image */}
                            <div className="shrink-0">
                                <img
                                    className="w-full h-36 object-cover rounded-md border border-gray-200 hover:scale-105 transition-transform"
                                    src={placeholder}
                                    alt={`Event: ${event.eventTitle}`}
                                />
                            </div>

                            {/* Event Details */}
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-[#27548A] mb-1">{event.eventTitle}</h4>
                                <p className="text-gray-700 mb-2">{event.eventDescription}</p>
                                <div className="text-sm text-gray-500">
                                    📍 <span className="font-medium">{event.eventLocation}</span> &nbsp;|&nbsp;
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

export default CreatorDashboard;