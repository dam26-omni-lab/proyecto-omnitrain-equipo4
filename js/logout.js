import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "formulario-1e3fb.firebaseapp.com",
    projectId: "formulario-1e3fb",
    storageBucket: "formulario-1e3fb.firebasestorage.app",
    messagingSenderId: "71309212065",
    appId: "1:71309212065:web:f795a26f6aefbcb4d173e0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("logoutBtn").addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "index.html";

});