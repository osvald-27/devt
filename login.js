document.getElementById("loginBtn").addEventListener("click", async () => {
  const loginForm = document.getElementById("loginBtn");
  const loginOutput = document.getElementById("output");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const res = await fetch("https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/login", {
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
        output.innerText = data.error;
      }

    } catch {
      output.innerText = "Server not running";
    }
  });

  loginForm.email.addEventListener("input", () => output.innerText = "");
  loginForm.password.addEventListener("input", () => output.innerText = "");
  fetch("https://tetchy-kaycee-nonlustrously.ngrok-free.dev/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

});