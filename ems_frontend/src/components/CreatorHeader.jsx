// 📁 src/components/CreatorHeader.jsx
import { Link, useNavigate } from "react-router-dom";
import { THEME_COLORS } from "../constants/colors";

const CreatorHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage and redirect
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiry");
    navigate("/");
  };

  return (
    <header className="bg-[#27548A] text-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="text-2xl text-white">
        <span className="font-bold pe-5 pb-5 text-5xl">EventSync</span>
        <span className="italic">Event Management System</span>
      </div>
      <nav className="space-x-6">
        <Link to="/creator/dashboard" className="text-white hover:underline">Dashboard</Link>
        <Link to="/creator/events" className="text-white hover:underline">My Events</Link>
        <Link to="/profile" className="text-white hover:underline">Profile</Link>
        <button
          onClick={handleLogout}
          className="bg-[#DDA853] text-white px-4 py-1 rounded hover:bg-[#c59440] transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default CreatorHeader; 