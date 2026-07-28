import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";




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
const db = getFirestore(app);

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

       const credenciales = await signInWithEmailAndPassword(auth, email, password);

const uid = credenciales.user.uid;

// Buscar el documento del usuario
const docRef = doc(db, "usuarios", uid);
const docSnap = await getDoc(docRef);

if (!docSnap.exists()) {
    alert("Este usuario no tiene un rol asignado.");
    return;
}

console.log("Documento existe:", docSnap.exists());
console.log("Datos:", docSnap.data());
     console.log("UID:", uid);
        
const rol = docSnap.data().rol;

// Perfil seleccionado en el formulario
const perfilSeleccionado = document.getElementById("role").value;

// Verificar que coincidan
if (perfilSeleccionado !== rol) {
    alert("El perfil seleccionado no corresponde con este usuario.");
    return;
}

// Redireccionar
if (rol === "admin") {
    window.location.href = "dashboardAdmin.html";
} else {
    window.location.href = "dashboard.html";
}

    } catch (error) {

        alert("Correo o contraseña incorrectos");

        console.log(error);

    }

});
