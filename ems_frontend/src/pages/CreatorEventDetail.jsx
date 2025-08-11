import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import CreatorHeader from "../components/CreatorHeader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";

const CreatorEventDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const event = state?.event;
    const [activeTab, setActiveTab] = useState("details");
    const [participants, setParticipants] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5251/api/event/participants/${event.eventID}/` + JSON.parse(localStorage.getItem("user")).userID);
            const data = await res.json();
            setParticipants(data.users || []);
        } catch (err) {
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
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
        finally{
            setLoading(false)
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
                icon: "error",
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

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [39, 84, 138] }
        });

        doc.save(`${event.eventTitle || "event"}_participants.pdf`);
    };

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

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4 text-primary">Loading event details...</p>
      </div>
    )
  }

  return (
    <>
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">{event?.eventTitle}</h2>
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditFormData({
                  ...event,
                  eventDateTime: event.eventDateTime.slice(0, 16), // for datetime-local
                })
                setShowEditModal(true)
              }}
              className="px-4 py-2 bg-blue-600 text-secondary rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Edit Event
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-secondary rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300"
            >
              Delete Event
            </motion.button>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200 mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-lg font-medium transition-all duration-300 ${
                activeTab === "details"
                  ? "border-b-2 border-primary text-primary bg-secondary shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Event Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-lg font-medium transition-all duration-300 ${
                activeTab === "participants"
                  ? "border-b-2 border-primary text-primary bg-secondary shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("participants")}
            >
              Participants
            </motion.button>
          </motion.div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-secondary p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 space-y-4"
            >
              <div>
                <h3 className="font-semibold text-primary mb-1">Description</h3>
                <p className="text-gray-700 text-base sm:text-lg">{event?.eventDescription}</p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Location</h3>
                <p className="text-gray-700 text-base sm:text-lg">{event?.eventLocation}</p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-1">Date & Time</h3>
                <p className="text-gray-700 text-base sm:text-lg">{new Date(event?.eventDateTime).toLocaleString()}</p>
              </div>
            </motion.div>
          )}

          {activeTab === "participants" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadParticipantsPDF}
                className="mb-4 px-4 py-2 bg-green-600 text-secondary rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all duration-300"
              >
                Download PDF
              </motion.button>
              <div className="bg-secondary p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : participants.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-center py-4 text-lg"
                  >
                    No participants registered for this event.
                  </motion.p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 border-b text-left text-primary text-sm sm:text-base">Sr. No.</th>
                          <th className="px-4 py-3 border-b text-left text-primary text-sm sm:text-base">Full Name</th>
                          <th className="px-4 py-3 border-b text-left text-primary text-sm sm:text-base">Email</th>
                          <th className="px-4 py-3 border-b text-left text-primary text-sm sm:text-base">Mobile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((p, i) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 border-b text-gray-800 text-sm sm:text-base">{i + 1}</td>
                            <td className="px-4 py-3 border-b text-gray-800 text-sm sm:text-base">{p.userFullName}</td>
                            <td className="px-4 py-3 border-b text-gray-800 text-sm sm:text-base">{p.userEmail}</td>
                            <td className="px-4 py-3 border-b text-gray-800 text-sm sm:text-base">{p.userMobile}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>

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
              className="bg-secondary rounded-xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
              >
                ×
              </button>
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">✏️</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Edit Event</h3>
                <p className="text-gray-600">Update the details of your event</p>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
                  <input
                    type="text"
                    value={editFormData.eventTitle || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, eventTitle: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-secondary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Description</label>
                  <textarea
                    value={editFormData.eventDescription || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, eventDescription: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors resize-none bg-secondary"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Location</label>
                  <input
                    type="text"
                    value={editFormData.eventLocation || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, eventLocation: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-secondary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Date & Time</label>
                  <input
                    type="datetime-local"
                    min={getMinDateTime()}
                    value={editFormData.eventDateTime || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, eventDateTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-3 sm:p-4 text-base sm:text-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors bg-secondary"
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
              className="bg-secondary rounded-xl p-6 sm:p-8 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl z-10"
              >
                ×
              </button>
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">Confirm Delete</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete the event{" "}
                  <span className="font-semibold text-primary">"{event.eventTitle}"</span>? This action cannot be
                  undone.
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
    </>
  );
};

export default CreatorEventDetail;