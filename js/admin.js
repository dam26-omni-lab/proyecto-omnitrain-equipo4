
        import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
        import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
        import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

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

        // 1. Proteger la ruta (Solo admins)
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const role = docSnap.data().rol;
                    if (role !== 'admin') {
                        // Si es colaborador, lo regresamos a su simulador 3D base
                        window.location.href = "index.html"; 
                    } else {
                        // Es admin válido, cargamos los datos
                        cargarPuntajes();
                    }
                }
            } else {
                window.location.href = "../index.html"; // Al login si no hay sesión
            }
        });

        // 2. Función para obtener los colaboradores de Firestore
        async function cargarPuntajes() {
            const tbody = document.getElementById("scoresTableBody");
            
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                tbody.innerHTML = ""; // Limpiar tabla
                
                let colaboradoresEncontrados = false;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    
                    // Solo mostramos a los colaboradores
                    if (data.rol === 'colaborador' || data.rol !== 'admin') {
                        colaboradoresEncontrados = true;
                        
                        // NOTA: Si en tu base de datos manejas un campo diferente para el progreso 3D
                        // (ejemplo: data.progreso3D), cámbialo aquí abajo.
                        const email = data.correo || data.email || 'Sin correo';
                        const xp = data.xp || 0; 
                        const progreso = data.progreso || '0%';

                        const fila = `
                            <tr>
                                <td><strong>${email}</strong></td>
                                <td><span class="badge" style="background-color: #8b5cf6;">Colaborador</span></td>
                                <td>${xp} XP</td>
                                <td>
                                    <div class="progress" style="height: 10px; margin-top: 5px;">
                                        <div class="progress-bar" style="width: ${parseInt(progreso)}%; background-color: #8b5cf6;"></div>
                                    </div>
                                    <small>${progreso}</small>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-outline-light"><i class="bi bi-eye"></i> Detalles</button>
                                </td>
                            </tr>
                        `;
                        tbody.innerHTML += fila;
                    }
                });

                if (!colaboradoresEncontrados) {
                    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No hay colaboradores registrados.</td></tr>`;
                }

            } catch (error) {
                console.error("Error cargando puntajes:", error);
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error al cargar los datos. Verifica la consola.</td></tr>`;
            }
        }
