import React, { useEffect, useState } from "react";
import "./Dashboard.css"; // if you converted your style.css to this folder

const Dashboard = () => {
  const [user, setUser] = useState({ name: "USER", email: "" });

  useEffect(() => {
    // Fetch user info from /me API
    fetch("/me", {
      credentials: "include", // send cookies if you use sessions
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // if using JWT
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser({ name: data.name, email: data.email }))
      .catch(() => {
        // redirect if not authenticated
        window.location.href = "/login";
      });
  }, []);

  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "/login";
    });
  };

  return (
    <div className="app-shell">
      <header>
        <div className="header-container">
          <div className="icon-box" onClick={() => alert("Go home!")}>
            <span className="material-symbols-rounded" id="header-icon">
              notifications
            </span>
            <div className="pulse"></div>
          </div>

          <h2 id="view-title">Dashboard</h2>

          <div className="icon-box" id="logoutBtn" onClick={handleLogout}>
            <span className="material-symbols-rounded">logout</span>
          </div>
        </div>
      </header>

      <main className="content-area">
        <section id="home-view" className="view active">
          <div className="hero">
            <h1>
              HEY! <span id="userName">{user.name}</span>
            </h1>
            <p>
              Ready for <b>Day #12</b>? Small steps lead to big changes.
            </p>
          </div>

          <div className="responsive-grid">
            <div className="stat-card">
              <span className="card-tag">Finished</span>
              <div className="card-info">
                <div className="icon-circle green">
                  <span className="material-symbols-rounded">check_circle</span>
                </div>
                <h2>58</h2>
              </div>
            </div>

            <div className="stat-card">
              <span className="card-tag">Balance</span>
              <div className="card-info">
                <div className="icon-circle yellow">
                  <span className="material-symbols-rounded">database</span>
                </div>
                <h2>2,874</h2>
              </div>
            </div>

            <div className="stat-card">
              <span className="card-tag">Global</span>
              <div className="card-info">
                <div className="icon-circle purple">
                  <span className="material-symbols-rounded">emoji_events</span>
                </div>
                <h2>#80</h2>
              </div>
            </div>

            <a href="#" className="cta-card" onClick={() => alert("Start Quiz!")}>
              <span className="label">PRACTICE</span>
              <span className="title">START QUIZ</span>
              <span className="material-symbols-rounded">rocket_launch</span>
            </a>
          </div>
        </section>
      </main>

      <nav className="bottom-nav">
        <div className="nav-container">
          <a href="#" className="nav-link active" onClick={() => alert("Home!")}>
            <span className="material-symbols-rounded">home</span>
            <span>HOME</span>
          </a>
          <a href="#" className="nav-link" onClick={() => alert("Quizzes!")}>
            <span className="material-symbols-rounded">quiz</span>
            <span>QUIZZES</span>
          </a>
          <a href="#" className="nav-link" onClick={() => alert("Social!")}>
            <span className="material-symbols-rounded">forum</span>
            <span>SOCIAL</span>
          </a>
          <a href="#" className="nav-link" onClick={() => alert("Profile!")}>
            <span className="material-symbols-rounded">person</span>
            <span>PROFILE</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;