    document.addEventListener("DOMContentLoaded", function () {
            const menuToggle = document.getElementById("menuToggle");
            const sidebarMenu = document.getElementById("sidebarMenu");

            if (menuToggle && sidebarMenu) {
                menuToggle.addEventListener("click", function () {
                    // Abre/cierra el menú usando CSS transform
                    sidebarMenu.classList.toggle("active");
                    
                    // Alterna el icono de la hamburguesa (Líneas / X)
                    const icon = menuToggle.querySelector("i");
                    if (sidebarMenu.classList.contains("active")) {
                        icon.classList.replace("bi-list", "bi-x-lg");
                    } else {
                        icon.classList.replace("bi-x-lg", "bi-list");
                    }
                });
            }
        });