import { useState } from 'react';

function SignUp({ onSignUpSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setMessage("Fill all fields");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://192.168.56.1:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created! Redirecting...");
        setTimeout(() => onSignUpSuccess(), 2000);
      } else {
        setMessage(data.error || "Registration failed");
      }
    } catch (err) {
      setMessage("Server offline", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-info">
          <h1>JOIN<span>GILLA EKATI</span></h1>
          <p>Create your account and start mastering new skills today.</p>
        </div>
        <div className="auth-form">
          <h2>Create Account</h2>
          <div className="input-box">
            <span className="material-symbols-rounded">person</span>
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="input-box">
            <span className="material-symbols-rounded">mail</span>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-box">
            <span className="material-symbols-rounded">lock</span>
            <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={handleSignUp} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          {message && <p id="output" style={{ color: message.includes('created') ? 'green' : 'red', marginTop: '10px' }}>{message}</p>}
          <p className="switch-text">
            Already a member? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;