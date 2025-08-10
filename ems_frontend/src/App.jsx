import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import Dashboard from "./pages/Dashboard";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreatorEvents from "./pages/CreatorEvents";
import CreatorEventDetail from "./pages/CreatorEventDetail";
import ProfilePage from "./pages/ProfilePage";

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/creator/dashboard" element={<CreatorDashboard />} />
      <Route path="/creator/events" element={<CreatorEvents />} />
      <Route path="/creator/events/detail" element={<CreatorEventDetail />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;