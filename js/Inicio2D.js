        function mostrarNiveles() {
            document.getElementById('menu-principal').classList.add('oculto');
            document.getElementById('menu-niveles').classList.remove('oculto');
        }

        function mostrarPrincipal() {
            document.getElementById('menu-niveles').classList.add('oculto');
            document.getElementById('menu-principal').classList.remove('oculto');
        }

        // Lógica de reproducción automática
        window.onload = () => {
            const audioIntro = document.getElementById('audio-intro');
            
            // Intenta reproducir apenas carga la página
            const playPromise = audioIntro.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Autoplay permitido
                }).catch(error => {
                    // Autoplay bloqueado: El usuario debe hacer clic en cualquier lugar para iniciar
                    window.addEventListener('click', () => {
                        audioIntro.play();
                    }, { once: true });
                });
            }
        };