        const bgMusic = document.getElementById("bg-music");
        const audioBtn = document.getElementById("audio-btn");
        let audioHabilitado = false;

        bgMusic.volume = 0.4; // Volumen equilibrado

        function intentarReproducirMusica() {
            if (!audioHabilitado) {
                bgMusic.play().then(() => {
                    audioHabilitado = true;
                    audioBtn.textContent = "🔊 Música: ON";
                }).catch(() => {
                    // El navegador requiere interacción previa, se activará al primer clic/toque
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
                }).catch(e => console.log("Reproducción bloqueada por el navegador"));
            }
        }

        // Intentar reproducir al cargar la página y enganchar cualquier interacción inicial
        window.addEventListener("load", () => {
            intentarReproducirMusica();
        });

        document.addEventListener("click", () => {
            intentarReproducirMusica();
        }, { once: true });