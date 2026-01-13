
const signupBtn = document.getElementById("signupBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const output = document.getElementById("output");

signupBtn.addEventListener("click", async () => {
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!name || !email || !password) {
    output.innerText = "All fields are required";
    return;
  }

  try {
    const res = await fetch("https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      output.innerText = "Account created! Redirecting...";
      setTimeout(() => window.location.href = "index.html", 2000);
    } else {
      output.innerText = data.error || "Registration failed";
    }
  } catch (err) {
    output.innerText = "Server offline";
  }
});
