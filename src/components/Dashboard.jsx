import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase";
import { signOut } from "firebase/auth";
import Students from "../pages/Students";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [activePage, setActivePage] = useState(false);
  const navigate = useNavigate();

  function handleActivePage() {
    setActivePage(prev => !prev);
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <h2>Dashboard</h2>


        <button onClick={handleActivePage} className={activePage ? "active" : ""}>
          Student Page
        </button>


        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="main-content">

        {activePage && <Students />}
      </div>
    </div>
  );
};

export default Dashboard;
