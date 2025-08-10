import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import CreatorHeader from "../components/CreatorHeader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CreatorEventDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const event = state?.event;
    const [activeTab, setActiveTab] = useState("details");
    const [participants, setParticipants] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});

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
        if (event) {
            fetchParticipants();
        }
    }, [event, activeTab]);

    const fetchParticipants = async () => {
        try {
            const res = await fetch(`http://localhost:5251/api/event/participants/${event.eventID}/` + JSON.parse(localStorage.getItem("user")).userID);
            const data = await res.json();
            setParticipants(data.users || []);
        } catch (err) {
            console.log(err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:5251/api/event/${event.eventID}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...editFormData,
                        userID: event.user.userID
                    })
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
                navigate("/creator/events");
            }
        } catch (error) {
            Swal.fire({
                toast: true,
                position: "bottom-end",
                icon: "error",
                title: "Event update failed.",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: "#ff0000",
                color: "#ffffff"
            });
            console.log(error);
        }
    };


    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(
                `http://localhost:5251/api/event/${event.eventID}`,
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
                navigate("/creator/events");
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

    const downloadParticipantsPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(event.eventTitle || "Event", 14, 20);

        doc.setFontSize(12);
        doc.text(`Description: ${event.eventDescription || "-"}`, 14, 30);
        doc.text(`Location: ${event.eventLocation || "-"}`, 14, 37);
        doc.text(
            `Date & Time: ${new Date(event.eventDateTime).toLocaleString()}`,
            14,
            44
        );

        const tableColumn = ["Sr. No.", "Full Name", "Email", "Mobile"];
        const tableRows = participants.map((p, index) => [
            index + 1,
            p.userFullName || "-",
            p.userEmail || "-",
            p.userMobile || "-"
        ]);

        // ✅ Use plugin function, passing doc
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 84, 138] }
        });

        // Save PDF
        doc.save(`${event.eventTitle || "event"}_participants.pdf`);
    };


    return (
        <>
            <div className="min-h-screen bg-[#F9F9F9]">
                <CreatorHeader />
                <main className="p-6">
                    <h2 className="text-3xl font-bold text-[#27548A] mb-4">{event?.eventTitle}</h2>

                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => {
                                setEditFormData({
                                    ...event,
                                    eventDateTime: event.eventDateTime.slice(0, 16) // for datetime-local
                                });
                                setShowEditModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => { setShowDeleteModal(true) }}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b mb-4">
                        <button
                            className={`px-4 py-2 ${activeTab === "details" ? "border-b-2 border-blue-600" : ""}`}
                            onClick={() => setActiveTab("details")}
                        >
                            Event Details
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === "participants" ? "border-b-2 border-blue-600" : ""}`}
                            onClick={() => setActiveTab("participants")}
                        >
                            Participants
                        </button>
                    </div>

                    {activeTab === "details" && (
                        <div className="bg-white p-6 rounded-lg shadow space-y-3">
                            <p>
                                <b>Description:</b> {event?.eventDescription}
                            </p>
                            <p>
                                <b>Location:</b> {event?.eventLocation}
                            </p>
                            <p>
                                <b>Date & Time:</b> {new Date(event?.eventDateTime).toLocaleString()}
                            </p>
                        </div>
                    )}


                    {activeTab === "participants" && (
                        <>
                            <button
                                onClick={downloadParticipantsPDF}
                                className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Download PDF
                            </button>

                            <div className="bg-white p-6 rounded-lg shadow">
                                {participants.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No participants registered.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200 rounded-lg">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 border-b text-left">Sr. No.</th>
                                                    <th className="px-4 py-2 border-b text-left">Full Name</th>
                                                    <th className="px-4 py-2 border-b text-left">Email</th>
                                                    <th className="px-4 py-2 border-b text-left">Mobile</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {participants.map((p, i) => (
                                                    <tr key={i} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border-b">{i + 1}</td>
                                                        <td className="px-4 py-2 border-b">{p.userFullName}</td>
                                                        <td className="px-4 py-2 border-b">{p.userEmail}</td>
                                                        <td className="px-4 py-2 border-b">{p.userMobile}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>)}

                </main>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-8 w-[800px] max-w-3xl">
                        <h3 className="text-2xl font-bold mb-6">Edit Event</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Title</label>
                                <input
                                    type="text"
                                    value={editFormData.eventTitle || ""}
                                    onChange={(e) => setEditFormData({ ...editFormData, eventTitle: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />

                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Description</label>
                                <textarea
                                    value={editFormData.eventDescription || ""}
                                    onChange={(e) => setEditFormData({ ...editFormData, eventDescription: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    rows="6"
                                    required
                                />

                            </div>

                            <div>
                                <label className="block text-lg font-semibold mb-2">Event Location</label>
                                <input
                                    type="text"
                                    value={editFormData.eventLocation || ""}
                                    onChange={(e) => setEditFormData({ ...editFormData, eventLocation: e.target.value })}
                                    className="w-full border rounded p-4 text-lg"
                                    required
                                />

                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Event Date & Time</label>
                                <input
                                    type="datetime-local"
                                    min={getMinDateTime()}
                                    value={event.eventDateTime.slice(0, 16)}
                                    onChange={(e) => event.eventDateTime = e.target.value}
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete the event <b>{event.eventTitle}</b>?</p>
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
        </>
    );
};

export default CreatorEventDetail;