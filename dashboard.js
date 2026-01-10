import { authFetch } from "./authFetch.js";

/* TAB SWITCH */
function switchTab(tab) {
document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
document.getElementById(tab+"-view").classList.add('active');

document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
event.currentTarget.classList.add('active');

document.getElementById("view-title").innerText = tab;
}
window.switchTab = switchTab;


function goHome(){ switchTab('home'); }
window.goHome = goHome;


/* PROFILE IMAGE */
function loadPhoto(e){
const reader = new FileReader();
reader.onload=()=>{
document.getElementById("user-photo").src=reader.result;
localStorage.setItem("pfp",reader.result);
}
reader.readAsDataURL(e.target.files[0]);
}
window.loadPhoto=loadPhoto;

window.onload=()=>{
const saved=localStorage.getItem("pfp");
if(saved) document.getElementById("user-photo").src=saved;
};


/* AUTH CHECK */
(async()=>{
const res = await authFetch("http://localhost:3000/api/auth/me");

if(!res.ok){
localStorage.clear();
location.href="index.html";
return;
}

const user = await res.json();
document.getElementById("userName").innerText = user.email.split("@")[0];
document.getElementById("profileEmail").innerText = user.email;
})();


/* LOGOUT */
document.getElementById("logoutBtn").onclick=async()=>{
await fetch("http://192.168.56.1:3000/api/auth/logout",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({ refreshToken:localStorage.getItem("refreshToken") })
});
localStorage.clear();
location.href="index.html";
};


/* DELETE ACCOUNT */
document.getElementById("deleteBtn").onclick=async()=>{

const ok = confirm("Confirm delete?");
if(!ok) return;

const password = prompt("Enter password");
if(!password) return;

await authFetch("http://192.168.56.1:3000/api/auth/delete",{
method:"DELETE",
body:JSON.stringify({password})
});

localStorage.clear();
location.href="index.html";
};

