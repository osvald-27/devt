import { useState } from 'react';

// Added onSwitchToSignUp to the props here
function Login({ onLoginSuccess, onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://192.168.56.1:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        onLoginSuccess(); 
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessage("Server not running", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-info">
          <h1>GILLA<span>EKATI</span></h1>
          <p>Login to continue your 12-day learning streak.</p>
        </div>

        <div className="auth-form">
          <h2>Welcome Back</h2>

          <div className="input-box">
            <span className="material-symbols-rounded">mail</span>
            <input 
              type="email" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <span className="material-symbols-rounded">lock</span>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleLogin} disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>

          {message && <p id="output" style={{ color: 'red', marginTop: '10px' }}>{message}</p>}

          <p className="switch-text">
            Don't have an account? 
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              onSwitchToSignUp(); // This triggers the AppController to show SignUp
            }}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;