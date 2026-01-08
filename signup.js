
document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    document.getElementById("output").innerText = "Email and password required";
    return;
  }

  if (password.length < 6) {
    document.getElementById("output").innerText = "Password must be at least 6 characters";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("output").innerText = "Registration successful! Redirecting to login...";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      document.getElementById("output").innerText = data.error || "Sign Up failed";
    }
  } catch (err) {
    document.getElementById("output").innerText = "Network error";
  }
});
