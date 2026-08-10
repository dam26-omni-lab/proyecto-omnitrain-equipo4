        document.addEventListener("DOMContentLoaded", function () {
            const menuToggle = document.getElementById("menuToggle");
            const sidebarMenu = document.getElementById("sidebarMenu");

            if (menuToggle && sidebarMenu) {
                menuToggle.addEventListener("click", function () {
                    sidebarMenu.classList.toggle("active");
                    const icon = menuToggle.querySelector("i");
                    if (sidebarMenu.classList.contains("active")) {
                        icon.classList.replace("bi-list", "bi-x-lg");
                    } else {
                        icon.classList.replace("bi-x-lg", "bi-list");
                    }
                });
            }

            cargarPuntajes();
        });

        const scores = {
            nivel1: parseInt(localStorage.getItem("score_lvl1")) || 85,
            nivel2: parseInt(localStorage.getItem("score_lvl2")) || 95,
            nivel3: parseInt(localStorage.getItem("score_lvl3")) || 70
        };

        function cargarPuntajes() {
            document.getElementById("score-lvl1").innerText = scores.nivel1 + " / 100";
            document.getElementById("score-lvl2").innerText = scores.nivel2 + " / 100";
            document.getElementById("score-lvl3").innerText = scores.nivel3 + " / 100";
            
            document.getElementById("badge-pct-1").innerText = scores.nivel1 + "%";
            document.getElementById("badge-pct-2").innerText = scores.nivel2 + "%";
            document.getElementById("badge-pct-3").innerText = scores.nivel3 + "%";

            renderizarEstrellas("stars-lvl1", scores.nivel1, 1);
            renderizarEstrellas("stars-lvl2", scores.nivel2, 2);
            renderizarEstrellas("stars-lvl3", scores.nivel3, 3);

            actualizarPuntajeMaximo();
        }

        function renderizarEstrellas(containerId, score, levelNumber) {
            const container = document.getElementById(containerId);
            if (!container) return;

            let cantEstrellas = Math.round((score / 100) * 6);
            if (cantEstrellas < 1) cantEstrellas = 1;
            if (cantEstrellas > 6) cantEstrellas = 6;

            let htmlStars = "";
            for (let i = 1; i <= 6; i++) {
                if (i <= cantEstrellas) {
                    htmlStars += `<i class="bi bi-star-fill active-star-${levelNumber}"></i>`;
                } else {
                    htmlStars += `<i class="bi bi-star"></i>`;
                }
            }
            container.innerHTML = htmlStars;
        }

        function actualizarPuntajeMaximo() {
            const maxScore = Math.max(scores.nivel1, scores.nivel2, scores.nivel3);
            document.getElementById("global-high-score").innerText = maxScore;
        }

        function iniciarNivel(numNivel) {
            console.log("Iniciando Nivel: " + numNivel);
        }