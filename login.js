
//login.js
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const output = document.getElementById("output");

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    output.innerText = "Please fill in all fields";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      window.location.href = "/dashboard";
    } else {
      output.innerText = data.error || "Invalid Credentials";
    }
  } catch (err) {
    output.innerText = "Server offline";
    console.error(err);
  }
});

// Clear error when user types
[emailInput, passwordInput].forEach(el => el.addEventListener("input", () => output.innerText = ""));
