const output = document.getElementById('output');

async function register() {
  const res = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: regUser.value,
      password: regPass.value
    })
  });

  output.textContent = JSON.stringify(await res.json(), null, 2);
}

async function login() {
  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: logUser.value,
      password: logPass.value
    })
  });

  const data = await res.json();
  localStorage.setItem('token', data.token);
  output.textContent = JSON.stringify(data, null, 2);
}

async function getProfile() {
  const token = localStorage.getItem('token');

  const res = await fetch('http://localhost:3000/api/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  output.textContent = JSON.stringify(await res.json(), null, 2);
}