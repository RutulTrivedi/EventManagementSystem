import { useEffect, useState } from "react";
import CreatorHeader from "../components/CreatorHeader";
import placeholder from "../assets/placeholder1.jpg";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Placeholder from "../components/Placeholder";

const CreatorEvents = () => {
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    // const [registrationsCount, setRegistrationsCount] = useState([]);

    const [formData, setFormData] = useState({
        eventID: 0,
        eventTitle: "",
        eventDescription: "",
        eventLocation: "",
        eventDateTime: "",
        userID: 0
    });

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
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem("user")).userID;
            setFormData((prev) => ({ ...prev, userID: userId }));

            const response = await fetch(`http://localhost:5251/api/event/user/${userId}`);
            const result = await response.json();

            const sorted = result.data.sort(
                (a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime)
            );

            // console.log(sorted);

            for(var e in sorted){
                // console.log();
                var count = await fetchRegistrationCount(e);
                console.log(count);
            }

            setMyEvents(sorted);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditClick = (event) => {
        setSelectedEvent(event);
        setFormData({
            eventID: event.eventID,
            eventTitle: event.eventTitle,
            eventDescription: event.eventDescription,
            eventLocation: event.eventLocation,
            eventDateTime: event.eventDateTime,
            userID: JSON.parse(localStorage.getItem("user")).userID
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (event) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:5251/api/event/${selectedEvent.eventID}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }
            );

            if (response.ok) {
                setShowEditModal(false);
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
                fetchMyEvents();
            }
        } catch (error) {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "Event updation failed..",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "#ff0000",
                color: "#ffffff"
            });
            console.log(error);
        }
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(
                `http://localhost:5251/api/event/${selectedEvent.eventID}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                setShowDeleteModal(false);
                Swal.fire({
                    toast: true,
                    position: "bottom-end",
                    icon: "success",
                    title: "Event deleted successfully.",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: "#008000",
                    color: "#ffffff"
                });
                fetchMyEvents();
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "success",
                title: "Event deletion failed.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "#ff0000",
                color: "#ffffff"
            });
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5251/api/event`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowAddModal(false);
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
                fetchMyEvents();
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "success",
                title: "Event creation failed.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "#008000",
                color: "#ffffff"
            });
        }
    };

    const fetchRegistrationCount = async (id) => {
    try {
        const response = await fetch(`http://localhost:5251/api/registration/event/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            const result = await response.json();
            return result.eventData?.length || 0;
        } else {
            return 0;
        }
    } catch (ex) {
        console.error(`Error fetching count for event ${id}`, ex);
        return 0;
    }
}



    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const filteredEvents = myEvents.filter(event => {
        const now = new Date();
        const eventDate = new Date(event.eventDateTime);

        if (activeTab === "Upcoming") {
            return eventDate > now;
        } else if (activeTab === "Completed") {
            return eventDate < now;
        }
        return true; // "All"
    });


    return (
        <div className="min-h-screen bg-[#F9F9F9]">
            <div className="sticky top-0 z-50">
                <CreatorHeader />
            </div>
            <main className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#27548A]">My Events</h2>
                    <button
                        onClick={() => {
                            setFormData({
                                eventID: 0,
                                eventTitle: "",
                                eventDescription: "",
                                eventLocation: "",
                                eventDateTime: "",
                                userID: JSON.parse(localStorage.getItem("user")).userID
                            });
                            setShowAddModal(true);
                        }}
                        className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                        + Add Event
                    </button>
                </div>

                <div className="flex gap-4 mb-6">
                    {["All", "Upcoming", "Completed"].map(tab => (
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


                <div className="space-y-4">
                    {filteredEvents.length > 0 ? (filteredEvents.map((event, index) => (
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

                            <div className="">
                                <div className="px-4 py-2 flex items-center gap-1">
                                    <span className="bold text-2xl">Total Registerations : </span>
                                    <span className="font-extrabold text-3xl">10+</span>
                                </div>
                                <div className="flex gap-2">

                                {/* Eye Button */}
                                <button
                                    onClick={() => navigate("/creator/events/detail", { state: { event } })}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center gap-1"
                                >
                                    View
                                </button>

                                {/* Edit */}
                                <button
                                    onClick={() => handleEditClick(event)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Edit
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDeleteClick(event)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                                
                                </div>
                            </div>
                        </div>
                    ))) : <Placeholder message={`No ${activeTab.toLowerCase()} events found`} />}
                </div>
            </main>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-8 w-[800px] max-w-3xl">
                        <h3 className="text-2xl font-bold mb-6">Edit Event</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Title</label>
                                <input
                                    type="text"
                                    value={formData.eventTitle}
                                    onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Description</label>
                                <textarea
                                    value={formData.eventDescription}
                                    onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    rows="6"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Location</label>
                                <input
                                    type="text"
                                    value={formData.eventLocation}
                                    onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Date & Time</label>
                                <input
                                    type="datetime-local"
                                    min={getMinDateTime()}
                                    value={formData.eventDateTime.slice(0, 16)}
                                    onChange={(e) => setFormData({ ...formData, eventDateTime: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-8 w-[800px] max-w-3xl">
                        <h3 className="text-2xl font-bold mb-6">Add Event</h3>
                        <form onSubmit={handleAddSubmit} className="space-y-4">

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Title</label>
                                <input
                                    type="text"
                                    value={formData.eventTitle}
                                    onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Description</label>
                                <textarea
                                    value={formData.eventDescription}
                                    onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    rows="6"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Location</label>
                                <input
                                    type="text"
                                    value={formData.eventLocation}
                                    onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Date & Time</label>
                                <input
                                    type="datetime-local"
                                    min={getMinDateTime()}
                                    value={formData.eventDateTime}
                                    onChange={(e) => setFormData({ ...formData, eventDateTime: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-5 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete the event <b>{selectedEvent?.eventTitle}</b>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatorEvents;