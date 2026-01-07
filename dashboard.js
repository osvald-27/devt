import { authFetch } from "./authFetch.js";

(async () => {
  const res = await authFetch("http://localhost:3000/api/auth/me");
  if (!res.ok) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "index.html";
  } else {
    const user = await res.json();
    document.getElementById("user").innerText = user.email;
  }

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "index.html";
  });

  document.getElementById("deleteBtn").addEventListener("click", async () => {
    const confirmDelete = confirm("Confirm delete with your password?");
    if (!confirmDelete) return;

    const password = prompt("Enter your password to delete account");
    if (!password) return alert("Password required");

    await authFetch("http://localhost:3000/api/auth/delete", {
      method: "DELETE",
      body: JSON.stringify({ password })
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "index.html";
  });
})();
