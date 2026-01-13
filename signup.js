const registerForm = document.getElementById("authForm");
const output = document.getElementById("output");


registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  output.innerText = "";

  const name = registerForm.name.value;
  const email = registerForm.email.value;
  const password = registerForm.password.value;


  try {
    const res = await fetch("https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      output.innerText = "Account created! Redirecting...";
      setTimeout(() => window.location.href = "index.html", 2000);
    } else {
      output.innerText = data.error;
    }

  } catch {
    output.innerText = "Server offline";
  }
});
