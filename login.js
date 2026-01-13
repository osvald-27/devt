
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const output = document.getElementById("output");

// Clear error on typing
nameInput.addEventListener("input", () => output.innerText = "");
emailInput.addEventListener("input", () => output.innerText = "");

// Standard Login
loginBtn.addEventListener("click", async () => {
  output = "";
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    output.innerText = "Please fill in all fields";
    return;
  }

  try {
    const res = await fetch("https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "dashboard.html";
    } else {
      output.innerText = data.error || "Login failed";
    }
  } catch (err) {
    output.innerText = "Server not running";
  }
});

// Google redirect tokens
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const refresh = urlParams.get("refresh");

  if (token && refresh) {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refresh);
    window.location.href = "dashboard.html";
  }
};

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    try {
        const res = await fetch("https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("accessToken", data.accessToken);
            return data.accessToken;
        } else {
            console.warn(data.error);
            return null;
        }
    } catch {
        return null;
    }
}
