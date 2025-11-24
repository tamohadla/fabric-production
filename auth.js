// auth.js - صفحة تسجيل الدخول
import { auth } from "./firebase-init.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("login-form");
const errorEl = document.getElementById("login-error");

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "home.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "home.html";
  } catch (err) {
    console.error(err);
    errorEl.textContent = "خطأ في الدخول، تأكد من البريد وكلمة المرور.";
  }
});
