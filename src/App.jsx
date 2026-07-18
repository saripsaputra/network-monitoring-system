import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      localStorage.getItem("isLoggedIn") ===
      "true"
  );

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const handleLogin = () => {
    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  if (currentPage === "monitoring") {
    return (
      <Monitoring
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "analytics") {
    return (
      <Analytics
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "settings") {
    return (
      <Settings
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === "profile") {
    return (
      <Profile
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Dashboard
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
    />
  );
}

export default App;