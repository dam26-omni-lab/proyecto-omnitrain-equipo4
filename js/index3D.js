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
        });