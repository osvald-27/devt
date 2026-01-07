export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("accessToken");

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  let res = await fetch(url, options);

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    const refreshRes = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      headers: { "Content-Type": "application/json" }
    });

    const data = await refreshRes.json();
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      options.headers.Authorization = `Bearer ${data.accessToken}`;
      res = await fetch(url, options);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return res;
}

