import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/" element={<Login />} />
        ) : (
          <Route path="/" element={<Dashboard />} />
        )}
        <Route path="/students" element={<Dashboard />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
