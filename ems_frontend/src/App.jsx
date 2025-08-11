import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorEvents from "./pages/CreatorEvents";
import CreatorEventDetail from "./pages/CreatorEventDetail";
import ProfilePage from "./pages/ProfilePage";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import ParticipantEvents from "./pages/ParticipantEvents";

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/unauthorized" />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/creator/dashboard" element={<CreatorDashboard />} />
      <Route path="/creator/events" element={<CreatorEvents />} />
      <Route path="/creator/events/detail" element={<CreatorEventDetail />} />
      <Route path="/participant/dashboard" element={<ParticipantDashboard />} />
      <Route path="/participant/events" element={<ParticipantEvents />} />
    </Routes>
  );
}

export default App;