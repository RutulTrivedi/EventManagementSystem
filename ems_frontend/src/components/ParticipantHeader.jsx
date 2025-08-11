// 📁 src/components/ParticipantHeader.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";

const ParticipantHeader = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiry");
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Logout successful.",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#008000",
      color: "#ffffff"
    });
    navigate("/");
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#27548A] to-[#1f4068] text-white shadow-lg py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        {/* Logo & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="font-bold text-4xl sm:text-5xl tracking-wide hover:scale-105 transition-transform duration-300 cursor-pointer">
            EventSync
          </span>
          <span className="italic text-sm sm:text-base text-gray-200">
            Event Management System
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4 sm:space-x-6 text-sm sm:text-base font-medium">
          <Link
            to="/participant/dashboard"
            className="relative group"
          >
            <span className="hover:text-[#DDA853] transition-colors">
              Dashboard
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#DDA853] transition-all group-hover:w-full"></span>
          </Link>
          <Link
            to="/participant/events"
            className="relative group"
          >
            <span className="hover:text-[#DDA853] transition-colors">
              My Events
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#DDA853] transition-all group-hover:w-full"></span>
          </Link>
          <Link
            to="/profile"
            className="relative group"
          >
            <span className="hover:text-[#DDA853] transition-colors">
              Profile
            </span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#DDA853] transition-all group-hover:w-full"></span>
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-[#DDA853] text-white px-4 py-2 rounded-md hover:bg-[#c59440] transition-colors duration-300 shadow-md"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center animate-slideUp">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogoutConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipantHeader;