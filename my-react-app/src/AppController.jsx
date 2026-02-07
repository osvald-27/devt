import { useState } from 'react';
import Dashboard from './Dashboard'; 
import Login from './login'; 
import SignUp from './signup';

export default function AppController() {
  // 1. Initialize state directly from localStorage
  // This checks for the token ONLY ONCE when the app first opens
  const [view, setView] = useState(() => {
    const savedToken = localStorage.getItem("accessToken");
    return savedToken ? 'dashboard' : 'login';
  });

  // 2. Simple navigation functions
  const showDashboard = () => setView('dashboard');
  const showLogin = () => setView('login');
  const showSignUp = () => setView('signup');

  // 3. The "Switchboard"
  if (view === 'dashboard') {
    return <Dashboard onLogout={showLogin} />;
  }

  if (view === 'signup') {
    return (
      <SignUp 
        onSignUpSuccess={showLogin} 
        onSwitchToLogin={showLogin} 
      />
    );
  }

  // Default: Show Login
  return (
    <Login 
      onLoginSuccess={showDashboard} 
      onSwitchToSignUp={showSignUp} 
    />
  );
}