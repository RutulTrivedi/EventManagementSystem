import { useEffect, useState } from "react";
import CreatorHeader from "../components/CreatorHeader";
import placeholder from "../assets/placeholder1.jpg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Placeholder from "../components/Placeholder";

const ParticipantEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [registeredEventIds, setRegisteredEventIds] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const user = JSON.parse(localStorage.getItem("user"));
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [viewModel, setViewModel] = useState(false);
    const [viewModelData, setViewModelData] = useState(null);

    useEffect(() => {
        const expiry = localStorage.getItem("expiry");
        if (!expiry || Number(expiry) < Date.now()) {
            localStorage.clear();
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "Session expired. Please login again.",
                showConfirmButton: false,
                timer: 3000,
                background: "#ff0000",
                color: "#ffffff"
            }).then(() => navigate("/"));
            return;
        }
        fetchEvents();
        fetchUserRegistrations();
    }, []);

    const openRegisterModal = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setShowModal(false);
    };

    const closeViewModal = () => {
        setViewModelData(null);
        setViewModel(false);
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch(`http://localhost:5251/api/event`);
            const result = await res.json();
            if (result?.data) {
                const sorted = result.data.sort(
                    (a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime)
                );
                setEvents(sorted);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUserRegistrations = async () => {
        try {
            const res = await fetch(`http://localhost:5251/api/registration/user/${user.userID}`);
            const result = await res.json();
            if (Array.isArray(result?.data)) {
                const ids = result.data.map(r => r.eventID);
                setRegisteredEventIds(ids);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRegister = async (eventID) => {
        try {
            const res = await fetch(`http://localhost:5251/api/registration`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventID, userID: user.userID })
            });
            if (res.ok) {
                Swal.fire({
                    toast: true,
                    position: "bottom-end",
                    icon: "success",
                    title: "Registered successfully.",
                    showConfirmButton: false,
                    timer: 3000,
                    background: "#008000",
                    color: "#ffffff"
                });
                setRegisteredEventIds(prev => [...prev, eventID]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredEvents = events.filter(event => {
        const now = new Date();
        const eventDate = new Date(event.eventDateTime);
        const isRegistered = registeredEventIds.includes(event.eventID);

        if (activeTab === "Upcoming") {
            return eventDate > now && !isRegistered;
        } else if (activeTab === "Completed") {
            return eventDate < now && !isRegistered;
        } else if (activeTab === "Registered") {
            return isRegistered;
        }
        return !isRegistered;
    });

    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <div className="sticky top-0 z-50">
                <CreatorHeader />
            </div>
            <main className="p-6">
                <h2 className="text-3xl font-bold text-[#27548A] mb-6">Events</h2>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    {["All", "Upcoming", "Completed", "Registered"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md transition ${activeTab === tab
                                ? "bg-[#27548A] text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Event List */}
                <div className="space-y-4">
                    {filteredEvents.length > 0 ? (
                        <>
                            {filteredEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition flex flex-col md:flex-row gap-4 items-center"
                                >
                                    <div className="shrink-0">
                                        <img
                                            className="w-full h-36 object-cover rounded-md border border-gray-200 hover:scale-105 transition-transform"
                                            src={placeholder}
                                            alt={`Event: ${event.eventTitle}`}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-2xl font-bold text-[#27548A] mb-1">{event.eventTitle}</h4>
                                        <p className="text-gray-700 mb-2">{event.eventDescription}</p>
                                        <div className="text-sm text-gray-500">
                                            📍 <span className="font-medium">{event.eventLocation}</span> &nbsp;|&nbsp;
                                            🗓️ {new Date(event.eventDateTime).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setViewModel(true);
                                                setViewModelData(event);
                                            }}
                                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center gap-1"
                                        >
                                            View
                                        </button>
                                        {registeredEventIds.includes(event.eventID) ? (
                                            <button
                                                disabled
                                                className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                                            >
                                                Registered
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => openRegisterModal(event)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                            >
                                                Register
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Register Modal */}
                            {showModal && selectedEvent && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
                                        <button
                                            onClick={closeModal}
                                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                                        >
                                            ✖
                                        </button>
                                        <h2 className="text-3xl font-extrabold mb-6 text-[#27548A]">Event Details</h2>
                                        <div className="space-y-4 text-lg">
                                            <p><span className="font-bold">Event Title :</span> {selectedEvent.eventTitle}</p>
                                            <p><span className="font-bold">Description :</span> {selectedEvent.eventDescription}</p>
                                            <p><span className="font-bold">Location :</span> {selectedEvent.eventLocation}</p>
                                            <p><span className="font-bold">Date & Time :</span> {new Date(selectedEvent.eventDateTime).toLocaleString()}</p>
                                        </div>
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={() => {
                                                    handleRegister(selectedEvent.eventID);
                                                    closeModal();
                                                }}
                                                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-lg"
                                            >
                                                Register Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* View Modal */}
                            {viewModel && viewModelData && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
                                        <button
                                            onClick={closeViewModal}
                                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
                                        >
                                            ✖
                                        </button>
                                        <h2 className="text-3xl font-extrabold mb-6 text-[#27548A]">Event Details</h2>
                                        <div className="space-y-4 text-lg">
                                            <p><span className="font-bold">Event Title :</span> {viewModelData.eventTitle}</p>
                                            <p><span className="font-bold">Description :</span> {viewModelData.eventDescription}</p>
                                            <p><span className="font-bold">Location :</span> {viewModelData.eventLocation}</p>
                                            <p><span className="font-bold">Date & Time :</span> {new Date(viewModelData.eventDateTime).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <Placeholder message={`No ${activeTab.toLowerCase()} events found`} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default ParticipantEvents;