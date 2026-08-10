   const componentes = [
            { id: "cpu", nombre: "⚙️ Procesador CPU", slotId: "slot-cpu", slotNombre: "Socket CPU", adivinanza: "«El cerebro del sistema que procesa cada instrucción»" },
            { id: "ram", nombre: "🧠 Memoria RAM", slotId: "slot-ram", slotNombre: "Ranura DIMM RAM", adivinanza: "«Almaceno datos rápido y de forma temporal»" },
            { id: "gpu", nombre: "🎮 Tarjeta Gráfica GPU", slotId: "slot-gpu", slotNombre: "Puerto PCIe x16", adivinanza: "«Renderizo mundos gráficos y gráficos en alta definición»" },
            { id: "ssd", nombre: "💾 Almacenamiento SSD", slotId: "slot-ssd", slotNombre: "Puerto M.2 / SATA", adivinanza: "«Guardo tus archivos de forma permanente y veloz»" },
            { id: "psu", nombre: "⚡ Fuente de Poder", slotId: "slot-psu", slotNombre: "Bahía de Energía", adivinanza: "«Distribuyo la energía vital a todo el equipo»" },
            { id: "motherboard", nombre: "🧩 Tarjeta Madre", slotId: "slot-mb", slotNombre: "Chasis Principal", adivinanza: "«Conecto y comunico cada componente del equipo»" }
        ];

        let errores = 0;
        let colocados = 0;
        let estrellasRestantes = 6; 
        let juegoTerminado = false;
        let audioHabilitado = false;

        const bank = document.getElementById("components-bank");
        const slotsContainer = document.getElementById("slots-container");
        const statusMsg = document.getElementById("status-msg");
        const victoryModal = document.getElementById("victory-modal");
        const defeatModal = document.getElementById("defeat-modal");
        const modalErrors = document.getElementById("modal-errors");
        const starsDisplay = document.getElementById("stars-display");
        const modalStars = document.getElementById("modal-stars");

        // Elementos de Audio
        const bgMusic = document.getElementById("bg-music");
        const soundCorrect = document.getElementById("sound-correct");
        const soundError = document.getElementById("sound-error");
        const audioBtn = document.getElementById("audio-btn");

        bgMusic.volume = 0.3; // Volumen moderado para la música de fondo

        function intentarReproducirMusica() {
            if (!audioHabilitado) {
                bgMusic.play().then(() => {
                    audioHabilitado = true;
                    audioBtn.textContent = "🔊 Música: ON";
                }).catch(() => {
                    // El navegador bloqueó el autoplay hasta que haya interacción
                });
            }
        }

        function toggleAudio() {
            if (audioHabilitado) {
                bgMusic.pause();
                audioHabilitado = false;
                audioBtn.textContent = "🔇 Música: OFF";
            } else {
                bgMusic.play().then(() => {
                    audioHabilitado = true;
                    audioBtn.textContent = "🔊 Música: ON";
                }).catch(e => console.log("Reproducción bloqueada"));
            }
        }

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

        function iniciarJuego() {
            bank.innerHTML = "";
            slotsContainer.innerHTML = "";
            colocados = 0;
            errores = 0;
            estrellasRestantes = 6; 
            juegoTerminado = false;
            actualizarEstrellasHUD();
            victoryModal.classList.remove("active");
            defeatModal.classList.remove("active");

            // Intentar iniciar la música de fondo automáticamente al cargar
            intentarReproducirMusica();

            const componentesMezclados = [...componentes].sort(() => Math.random() - 0.5);
            const slotsMezclados = [...componentes].sort(() => Math.random() - 0.5);

            componentesMezclados.forEach(comp => {
                const item = document.createElement("div");
                item.className = "draggable-item";
                item.draggable = true;
                item.textContent = comp.nombre;
                item.id = `drag-${comp.id}`;

                item.addEventListener("dragstart", (e) => {
                    // Al primer arrastre garantizamos que la música despegue si el navegador la tenía pausada
                    intentarReproducirMusica();

                    if (juegoTerminado) {
                        e.preventDefault();
                        return;
                    }
                    e.dataTransfer.setData("text/plain", comp.id);
                });

                bank.appendChild(item);
            });

            slotsMezclados.forEach(comp => {
                const slot = document.createElement("div");
                slot.className = "drop-slot";
                slot.id = comp.slotId;
                slot.dataset.accepts = comp.id;
                slot.innerHTML = `<span>${comp.adivinanza}</span>`;

                slot.addEventListener("dragover", (e) => {
                    if (juegoTerminado) return;
                    e.preventDefault();
                    slot.classList.add("highlight");
                });

                slot.addEventListener("dragleave", () => {
                    slot.classList.remove("highlight");
                });

                slot.addEventListener("drop", (e) => {
                    e.preventDefault();
                    if (juegoTerminado) return;
                    slot.classList.remove("highlight");

                    const idArrastrado = e.dataTransfer.getData("text/plain");
                    const elementoArrastrado = document.getElementById(`drag-${idArrastrado}`);

                    if (idArrastrado === slot.dataset.accepts && !slot.classList.contains("filled")) {
                        slot.classList.add("filled");
                        slot.textContent = `✔ ${comp.slotNombre}\n[${elementoArrastrado.textContent}]`;
                        elementoArrastrado.remove();
                        colocados++;

                        // Reproducir sonido de correcto
                        soundCorrect.currentTime = 0;
                        soundCorrect.play().catch(e => {});

                        statusMsg.textContent = "💬 ¡Correcto! Componente ensamblado con éxito.";
                        statusMsg.style.borderColor = "#00ff88";
                        statusMsg.style.color = "#a7f3d0";

                        if (colocados === componentes.length) {
                            setTimeout(mostrarVictoria, 500);
                        }
                    } else {
                        errores++;
                        
                        // Reproducir sonido de error
                        soundError.currentTime = 0;
                        soundError.play().catch(e => {});

                        if (estrellasRestantes > 0) {
                            estrellasRestantes -= 1;
                            actualizarEstrellasHUD();
                        }

                        if (estrellasRestantes === 0) {
                            juegoTerminado = true;
                            statusMsg.textContent = "💬 ¡Sistema bloqueado por errores críticos!";
                            statusMsg.style.borderColor = "#ef4444";
                            statusMsg.style.color = "#f87171";
                            setTimeout(mostrarDerrota, 600);
                        } else {
                            statusMsg.textContent = "💬 ¡Error de puerto! Ese no es su lugar.";
                            statusMsg.style.borderColor = "#ef4444";
                            statusMsg.style.color = "#f87171";
                        }
                    }
                });

                slotsContainer.appendChild(slot);
            });
        }

        function mostrarVictoria() {
            victoryModal.classList.add("active");
            modalErrors.textContent = `Errores de montaje: ${errores}`;
            modalStars.textContent = starsDisplay.textContent;
        }

        function mostrarDerrota() {
            defeatModal.classList.add("active");
        }

        function reiniciarNivel() {
            iniciarJuego();
        }
        window.onload = iniciarJuego;