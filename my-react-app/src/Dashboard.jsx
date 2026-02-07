import { useState, useEffect } from 'react';
import './index.css'; 
// Ensure authFetch.js is in your /src folder. 
// If it's a default export, remove the curly braces.
import { authFetch } from './authFetch'; 

function Dashboard() {
  // 1. STATE DEFINITIONS (Must be at the top)
  const [activeTab, setActiveTab] = useState('home');
  const [profilePic, setProfilePic] = useState('https://via.placeholder.com/150');
  const [user, setUser] = useState({ email: 'loading...', name: 'USER' });

  // 2. INITIALIZATION (The "window.onload" equivalent)
  useEffect(() => {
    // Load profile pic safely
    const saved = localStorage.getItem("pfp");
    if (saved) {
      setProfilePic(saved);
    }

    // Fetch user profile
    const initAuth = async () => {
      try {
        const res = await authFetch("http://localhost:3000/api/auth/me");
        if (!res.ok) {
          localStorage.clear();
          window.location.href = "index.html";
          return;
        }
        const data = await res.json();
        setUser({
          email: data.email,
          name: data.email.split("@")[0]
        });
      } catch (err) {
        console.error("Auth initialization failed", err);
      }
    };

    initAuth();
  }, []);

  // 3. EVENT HANDLERS
  const handleLogout = async () => {
    try {
      await fetch("http://192.168.56.1:3000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.clear();
      window.location.href = "index.html";
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm("Confirm delete?");
    if (!ok) return;

    const password = window.prompt("Enter password");
    if (!password) return;

    try {
      const res = await authFetch("http://192.168.56.1:3000/api/auth/delete", {
        method: "DELETE",
        body: JSON.stringify({ password })
      });
      if (res.ok) {
        localStorage.clear();
        window.location.href = "index.html";
      }
    } catch (err) {
      alert("Delete failed.", err);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      localStorage.setItem("pfp", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 4. THE UI
  return (
    <div className="app-shell">
      <header>
        <div className="header-container">
          <div className="icon-box" onClick={() => setActiveTab('home')}>
            <span className="material-symbols-rounded">notifications</span>
            <div className="pulse"></div>
          </div>
          <h2 id="view-title" style={{ textTransform: 'capitalize' }}>{activeTab}</h2>
          <div className="icon-box" onClick={handleLogout}>
            <span className="material-symbols-rounded">logout</span>
          </div>
        </div>
      </header>

      <main className="content-area">
        {activeTab === 'home' && (
          <section className="view active">
            <div className="hero">
              <h1>HEY! <span>{user.name.toUpperCase()}</span></h1>
              <p>Ready for <b>Day #12</b>? Small steps lead to big changes.</p>
            </div>
            <div className="responsive-grid">
              <StatCard tag="Finished" val="58" color="green" icon="check_circle" />
              <StatCard tag="Balance" val="2,874" color="yellow" icon="database" />
              <StatCard tag="Global" val="#80" color="purple" icon="emoji_events" />
              <div className="cta-card" onClick={() => setActiveTab('quizzes')}>
                <span className="label">PRACTICE</span>
                <span className="title">START QUIZ</span>
                <span className="material-symbols-rounded">rocket_launch</span>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="view active">
            <div className="profile-card">
              <div className="profile-banner"></div>
              <div className="profile-content">
                <div className="avatar-wrapper">
                  <img src={profilePic} alt="User" />
                  <label htmlFor="photo-upload" className="upload-btn">
                    <span className="material-symbols-rounded">photo_camera</span>
                  </label>
                  <input type="file" id="photo-upload" hidden onChange={handlePhotoUpload} />
                </div>
                <div className="profile-text">
                  <h2>{user.email}</h2>
                  <p>Level 14 Polymath • Daily Learner</p>
                  <button onClick={handleDeleteAccount} className="btn-primary">DELETE ACCOUNT</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'quizzes' && (
          <section className="view active">
            <div className="responsive-grid">
              <QuizCard title="Science" qs="15" icon="science" color="blue-bg" />
              <QuizCard title="History" qs="12" icon="history_edu" color="orange-bg" />
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <div className="nav-container">
          <NavItem icon="home" label="HOME" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon="quiz" label="QUIZZES" active={activeTab === 'quizzes'} onClick={() => setActiveTab('quizzes')} />
          <NavItem icon="forum" label="SOCIAL" active={activeTab === 'social'} onClick={() => setActiveTab('social')} />
          <NavItem icon="person" label="PROFILE" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>
    </div>
  );
}

// COMPONENT HELPERS
function StatCard({ tag, val, color, icon }) {
  return (
    <div className="stat-card">
      <span className="card-tag">{tag}</span>
      <div className="card-info">
        <div className={`icon-circle ${color}`}><span className="material-symbols-rounded">{icon}</span></div>
        <h2>{val}</h2>
      </div>
    </div>
  );
}

function QuizCard({ title, qs, icon, color }) {
  return (
    <div className="list-card">
      <div className={`icon-circle ${color}`}><span className="material-symbols-rounded">{icon}</span></div>
      <div className="list-text"><strong>{title}</strong><p>{qs} Questions</p></div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <a href="#" className={`nav-link ${active ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onClick(); }}>
      <span className="material-symbols-rounded">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

export default Dashboard;