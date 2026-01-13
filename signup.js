
const signupBtn = document.getElementById("signupBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const output = document.getElementById("output");


signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    output.innerText = "";


    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    if (!name || !email || !password) {
        output.innerText = "Please fill all fields";
        return;
    }


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
    } catch (err) {
        console.error(err);
        output.innerText = "Server offline";
    }
});


// Clear output when user types again
nameInput.addEventListener("input", () => output.innerText = "");
emailInput.addEventListener("input", () => output.innerText = "");
passwordInput.addEventListener("input", () => output.innerText = "");


