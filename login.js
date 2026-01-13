const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const output = document.getElementById("output");


loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    output.innerText = "";


    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    if (!email || !password) {
        output.innerText = "Please enter email and password";
        return;
    }


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
    } catch (err) {
        console.error(err);
        output.innerText = "Server not running";
    }
});


// Clear output when user types again
emailInput.addEventListener("input", () => output.innerText = "");
passwordInput.addEventListener("input", () => output.innerText = "");