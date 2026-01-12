
export async function authFetch(url, options = {}) {

  const token = localStorage.getItem("accessToken");

  options.headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}` // FIXED
  };

  let res = await fetch(url, options);

  if (res.status === 401) {

    const refreshToken = localStorage.getItem("refreshToken");

    const refreshRes = await fetch( "https://gilla-ekati.versel.app/api/auth/refresh",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      }
    );

    const data = await refreshRes.json();

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      options.headers.Authorization = `Bearer ${data.accessToken}`;
      res = await fetch(url, options);
    }
  }

  return res;
}






