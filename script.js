function switchTab(tabId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const target = document.getElementById(tabId + '-view');
    if (target) target.classList.add('active');

    // Highlight the clicked nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.innerText.toLowerCase().includes(tabId)) link.classList.add('active');
    });

    // Update Header
    document.getElementById('view-title').innerText = tabId;
    const icon = document.getElementById('header-icon');
    icon.innerText = (tabId === 'home') ? 'notifications' : 'arrow_back';
}

function goHome() {
    switchTab('home');
}

function loadPhoto(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('user-photo').src = reader.result;
        localStorage.setItem('user_pfp', reader.result);
    };
    if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

window.onload = () => {
    const saved = localStorage.getItem('user_pfp');
    if(saved) document.getElementById('user-photo').src = saved;
};


// AUTHENTICATION LOGIC
function handleSignup() {
    const name = document.getElementById('sign-name').value;
    const email = document.getElementById('sign-email').value;
    const pass = document.getElementById('sign-pass').value;

    if (name && email && pass) {
        localStorage.setItem('elite_user', JSON.stringify({ name, email, pass }));
        alert("Account Created! Redirecting to login...");
        window.location.href = "login.html";
    } else {
        alert("Please fill in all fields.");
    }
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const savedUser = JSON.parse(localStorage.getItem('elite_user'));

    if (savedUser && email === savedUser.email && pass === savedUser.pass) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials. Please Sign Up first.");
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = "login.html";
}


