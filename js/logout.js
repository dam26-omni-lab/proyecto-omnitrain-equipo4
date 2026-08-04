import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCA2TH-RB13iBVibZ8RkXcfvntk-GzvVNE", // Asegúrate de colocar tu API KEY real aquí
    authDomain: "formulario-1e3fb.firebaseapp.com",
    projectId: "formulario-1e3fb",
    storageBucket: "formulario-1e3fb.firebasestorage.app",
    messagingSenderId: "71309212065",
    appId: "1:71309212065:web:f795a26f6aefbcb4d173e0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const logoutBtn = document.getElementById("logoutBtn");

// Es una buena práctica verificar que el botón exista en la página antes de agregarle el evento
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);

            // Redirección inteligente dependiendo de la carpeta en la que estemos
            if (window.location.pathname.includes("Simulador2D") || window.location.pathname.includes("Simulador3D")) {
                // Si estamos dentro de una carpeta de simulador, retrocedemos un nivel
                window.location.href = "../index.html";
            } else {
                // Si estamos en el dashboard principal (raíz), vamos directo al index
                window.location.href = "index.html";
            }
            
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    });
}