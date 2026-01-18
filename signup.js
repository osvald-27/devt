// signup.js
const signupBtn = document.getElementById("signupBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const output = document.getElementById("output");

signupBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name || !email || !password) {
    output.innerText = "All fields are required";
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
      output.innerText = "Account created! Redirecting...";
      setTimeout(() => window.location.href = "login.html", 2000);
    } else {
      output.innerText = data.error || "Registration failed";
    }
  } catch (err) {
    output.innerText = "Server offline";
    console.error(err);
  }
});















