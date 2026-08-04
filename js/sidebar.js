
        document.addEventListener("DOMContentLoaded", function () {
            const menuToggle = document.getElementById("menuToggle");
            const sidebarMenu = document.getElementById("sidebarMenu");

            if (menuToggle && sidebarMenu) {
                menuToggle.addEventListener("click", function () {
                    sidebarMenu.classList.toggle("active");
                    const icon = menuToggle.querySelector("i");
                    icon.classList.replace(
                        sidebarMenu.classList.contains("active") ? "bi-list" : "bi-x-lg",
                        sidebarMenu.classList.contains("active") ? "bi-x-lg" : "bi-list"
                    );
                });
            }
        });
