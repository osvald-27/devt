import React, { useEffect, useState } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "index.html";
      return;
    }

    fetch("https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUserEmail(data.email);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Session expired. Please login again.");
        setTimeout(() => (window.location.href = "index.html"), 2000);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "index.html";
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <h1>Welcome to GeEk</h1>
      <p>Email: {userEmail}</p>
      <button onClick={handleLogout} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}

ReactDOM.render(<Dashboard />, document.getElementById("dashboard-root"));