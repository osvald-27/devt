


document.getElementById("signupBtn").addEventListener("click", async () => {

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    output.innerText = "Fill all fields";
    return;
  }

  try {
    const res = await fetch("http://192.168.56.1:3000/api/auth/register", {
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
