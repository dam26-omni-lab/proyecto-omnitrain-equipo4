 const incidentes = [
            {
                titulo: "INC #104: Caída de Conexión en el área de Ventas",
                descripcion: "Los usuarios reportan intermitencia total y pérdida de paquetes hacia el Gateway principal. Se detecta que el enlace físico presenta fluctuaciones.",
                opciones: [
                    { texto: "A) Reiniciar el Switch de acceso del piso y revisar cables UTP dañados.", correcta: true },
                    { texto: "B) Formatear todas las computadoras del departamento.", correcta: false },
                    { texto: "C) Cambiar la contraseña del correo electrónico del personal.", correcta: false }
                ]
            },
            {
                titulo: "INC #105: Saturación de Ancho de Banda",
                descripcion: "La red corporativa está extremadamente lenta. Al monitorear el tráfico, se observa un consumo masivo de descargas ajenas a la operación.",
                opciones: [
                    { texto: "A) Implementar reglas de QoS (Calidad de Servicio) en el router y bloquear tráfico no autorizado.", correcta: true },
                    { texto: "B) Desconectar físicamente el cable principal de internet para siempre.", correcta: false },
                    { texto: "C) Comprar una impresora nueva para la oficina.", correcta: false }
                ]
            },
            {
                titulo: "INC #106: Falla de Resolución de Nombres (DNS)",
                descripcion: "Las estaciones de trabajo no pueden acceder a los servicios internos ni páginas web mediante nombres de dominio, aunque responden a IPs fijas.",
                opciones: [
                    { texto: "A) Verificar el estado del servicio DNS corporativo, limpiar caché IP (ipconfig /flushdns) y corregir servidores asignados.", correcta: true },
                    { texto: "B) Cambiar los escritorios de lugar.", correcta: false },
                    { texto: "C) Apagar el suministro eléctrico de todo el edificio.", correcta: false }
                ]
            }
        ];

        let indiceActual = 0;
        let errores = 0;
        let estrellasRestantes = 6;
        let juegoTerminado = false;

        const incidentCounter = document.getElementById("incident-counter");
        const ticketTitle = document.getElementById("ticket-title");
        const ticketDesc = document.getElementById("ticket-desc");
        const solutionsContainer = document.getElementById("solutions-container");
        const statusMsg = document.getElementById("status-msg");
        const starsDisplay = document.getElementById("stars-display");
        const victoryModal = document.getElementById("victory-modal");
        const defeatModal = document.getElementById("defeat-modal");
        const modalStars = document.getElementById("modal-stars");
        const modalErrors = document.getElementById("modal-errors");
        const questionFadeWrapper = document.getElementById("question-fade-wrapper");

        // Elementos de Audio
        const audioLevel = document.getElementById("audio-level");
        const audioCorrect = document.getElementById("audio-correct");
        const audioError = document.getElementById("audio-error");

        function actualizarEstrellasHUD() {
            let htmlStars = "";
            let estrellasOscuras = 6 - estrellasRestantes;

            for (let i = 0; i < estrellasRestantes; i++) {
                htmlStars += "⭐";
            }
            for (let i = 0; i < estrellasOscuras; i++) {
                htmlStars += "🌑";
            }

            starsDisplay.textContent = htmlStars;
        }

        function cargarIncidente() {
            if (juegoTerminado) return;

            incidentCounter.classList.remove("pulse-anim");
            void incidentCounter.offsetWidth; 
            incidentCounter.classList.add("pulse-anim");

            questionFadeWrapper.classList.remove("fade-content");
            void questionFadeWrapper.offsetWidth;
            questionFadeWrapper.classList.add("fade-content");

            const inc = incidentes[indiceActual];
            incidentCounter.textContent = `INCIDENTE ${indiceActual + 1} DE ${incidentes.length}`;
            ticketTitle.textContent = inc.titulo;
            ticketDesc.textContent = inc.descripcion;

            solutionsContainer.innerHTML = "";

            const opcionesMezcladas = [...inc.opciones].sort(() => Math.random() - 0.5);

            opcionesMezcladas.forEach((opcion) => {
                const btn = document.createElement("button");
                btn.className = "solution-btn";
                btn.textContent = opcion.texto;

                btn.onclick = () => {
                    if (juegoTerminado) return;

                    if (opcion.correcta) {
                        audioCorrect.currentTime = 0;
                        audioCorrect.play();

                        statusMsg.textContent = "💬 ¡Excelente diagnóstico! Incidente resuelto.";
                        statusMsg.style.borderColor = "#00ff88";
                        statusMsg.style.color = "#00ff88";
                        
                        indiceActual++;
                        if (indiceActual < incidentes.length) {
                            setTimeout(() => {
                                if (juegoTerminado) return;
                                statusMsg.textContent = "💬 ¡Analiza el siguiente reporte de red!";
                                statusMsg.style.borderColor = "#00bfff";
                                statusMsg.style.color = "#bae6fd";
                                cargarIncidente();
                            }, 1500);
                        } else {
                            juegoTerminado = true;
                            setTimeout(mostrarVictoria, 800);
                        }
                    } else {
                        audioError.currentTime = 0;
                        audioError.play();

                        errores++;
                        if (estrellasRestantes > 0) {
                            estrellasRestantes -= 1;
                            actualizarEstrellasHUD();
                        }

                        if (estrellasRestantes === 0) {
                            juegoTerminado = true;
                            statusMsg.textContent = "💬 ¡Red colapsada por errores!";
                            statusMsg.style.borderColor = "#ef4444";
                            statusMsg.style.color = "#f87171";
                            setTimeout(mostrarDerrota, 800);
                        } else {
                            statusMsg.textContent = "💬 ¡Falla de diagnóstico! Revisa el procedimiento.";
                            statusMsg.style.borderColor = "#ef4444";
                            statusMsg.style.color = "#f87171";
                        }
                    }
                };

                solutionsContainer.appendChild(btn);
            });
        }

        function mostrarVictoria() {
            victoryModal.classList.add("active");
            modalErrors.textContent = `Errores de diagnóstico: ${errores}`;
            modalStars.textContent = starsDisplay.textContent;
            audioLevel.pause();
        }

        function mostrarDerrota() {
            defeatModal.classList.add("active");
            audioLevel.pause();
        }

        function reiniciarNivel() {
            indiceActual = 0;
            errores = 0;
            estrellasRestantes = 6;
            juegoTerminado = false;
            actualizarEstrellasHUD();
            victoryModal.classList.remove("active");
            defeatModal.classList.remove("active");
            statusMsg.textContent = "💬 ¡Listo para revisar los reportes de la red!";
            statusMsg.style.borderColor = "#00bfff";
            statusMsg.style.color = "#bae6fd";
            audioLevel.currentTime = 0;
            audioLevel.play();
            cargarIncidente();
        }

        // Iniciar audio al primer clic para sortear restricciones de autoplay de los navegadores
        window.addEventListener('click', () => {
            if (audioLevel.paused) {
                audioLevel.play().catch(e => console.log("Autoplay bloqueado"));
            }
        }, { once: true });

        window.onload = () => {
            actualizarEstrellasHUD();
            cargarIncidente();
        };