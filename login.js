<<<<<<< HEAD
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("output").innerText = "Fill all fields";
=======

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
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
    return;
  }

  try {
<<<<<<< HEAD
    const res = await fetch("http://192.168.56.1:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
=======
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
<<<<<<< HEAD

      window.location.href = "dashboard.html";
    } else {
      document.getElementById("output").innerText = data.error || "Login failed";
    }

  } catch {
    document.getElementById("output").innerText = "Server not running";
  }
});
=======
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
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
