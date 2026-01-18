<<<<<<< HEAD



document.getElementById("signupBtn").addEventListener("click", async () => {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    output.innerText = "Fill all fields";
=======
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
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
    return;
  }

  try {
<<<<<<< HEAD
    const res = await fetch("http://192.168.56.1:3000/api/auth/register", {
=======
    const res = await fetch("http://localhost:3000/api/auth/register", {
>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      output.innerText = "Account created! Redirecting...";
<<<<<<< HEAD
      setTimeout(() => window.location.href = "index.html", 2000);
    } else {
      output.innerText = data.error;
    }

  } catch {
    output.innerText = "Server offline";
  }
});
=======
      setTimeout(() => window.location.href = "login.html", 2000);
    } else {
      output.innerText = data.error || "Registration failed";
    }
  } catch (err) {
    output.innerText = "Server offline";
    console.error(err);
  }
});















>>>>>>> a640273afc49d8f5c0bacb18c69c24c6002c4baf
