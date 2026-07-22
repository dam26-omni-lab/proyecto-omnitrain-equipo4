import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCA2TH-RB13iBVibZ8RkXcfvntk-GzvVNE",
    authDomain: "formulario-1e3fb.firebaseapp.com",
    projectId: "formulario-1e3fb",
    storageBucket: "formulario-1e3fb.firebasestorage.app",
    messagingSenderId: "71309212065",
    appId: "1:71309212065:web:f795a26f6aefbcb4d173e0",
    measurementId: "G-977M92NLG0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);

        alert("Inicio de sesión correcto");

        window.location.href = "dashboard.html";

    } catch (error) {

        alert("Correo o contraseña incorrectos");

        console.log(error);

    }

});