document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    document.getElementById("output").innerText = "Fill all fields";
    return;
  }

  try {
    const res = await fetch("http://192.168.56.1:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      window.location.href = "dashboard.html";
    } else {
      document.getElementById("output").innerText = data.error || "Login failed";
    }

  } catch {
    document.getElementById("output").innerText = "Server not running";
  }
});