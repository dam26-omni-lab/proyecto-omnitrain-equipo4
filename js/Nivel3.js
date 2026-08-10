 const estrategias = [
            {
                titulo: "CASO #01: Migración a Arquitectura Cloud Híbrida",
                descripcion: "El directorio exige reducir un 35% los costos de infraestructura local manteniendo alta disponibilidad para bases de datos transaccionales críticas.",
                opciones: [
                    { texto: "Migrar workloads transaccionales y bases de datos a un modelo cloud híbrido con balanceo multirregional y esquemas IaaS/PaaS.", correcta: true },
                    { texto: "Apagar todos los servidores físicos y rentar computadoras personales para el personal.", correcta: false },
                    { texto: "Mantener toda la infraestructura inalterada y recortar personal técnico de soporte.", correcta: false }
                ]
            },
            {
                titulo: "CASO #02: Auditoría de Gobernanza y Ciberseguridad (COBIT / ISO 27001)",
                descripcion: "Se requiere certificar urgentemente los procesos de gestión de activos de información para cumplir con normativas internacionales de cumplimiento y evitar penalizaciones legales.",
                opciones: [
                    { texto: "Implementar marcos de gobernanza y controles de seguridad alineados a ISO 27001, estableciendo gestión de riesgos y auditorías periódicas.", correcta: true },
                    { texto: "Comprar un software antivirus económico para las PC de oficina y omitir la auditoría.", correcta: false },
                    { texto: "Declarar que la empresa está exenta de regulaciones internacionales.", correcta: false }
                ]
            },
            {
                titulo: "CASO #03: Plan de Continuidad de Negocio (BCP) y Recuperación ante Desastres (DRP)",
                descripcion: "Ante posibles fallas geológicas o ciberataques de tipo ransomware masivo, la empresa necesita asegurar un RPO (Objetivo de Punto de Recuperación) inferior a 15 minutos.",
                opciones: [
                    { texto: "Diseñar un DRP automatizado en la nube con réplicas sincrónicas de bases de datos y respaldos inmutables fuera de línea.", correcta: true },
                    { texto: "Contratar a un empleado para que guarde respaldos en una memoria USB cada fin de semana.", correcta: false },
                    { texto: "Confiar en la suerte corporativa y no invertir en respaldos redundantes.", correcta: false }
                ]
            },
            {
                titulo: "CASO #04: Arquitectura de Datos y Gobierno de Información (Data Governance)",
                descripcion: "La dirección general requiere integrar un repositorio analítico centralizado corporativo (Data Lakehouse) que garantice la trazabilidad, calidad y cumplimiento normativo (GDPR/Ley de Datos) sobre millones de registros transaccionales multifuente.",
                opciones: [
                    { texto: "Arquitectura de Data Lakehouse con linaje de datos automatizado, políticas de calidad, enmascaramiento PII y catálogos de metadatos centralizados bajo gobierno estricto.", correcta: true },
                    { texto: "Duplicar manualmente todas las hojas de cálculo de Excel en correos electrónicos compartidos entre gerencias.", correcta: false },
                    { texto: "Almacenar todos los datos sin estructurar en un disco duro externo conectado a la PC de recepción.", correcta: false }
                ]
            },
            {
                titulo: "CASO #05: Gestión de Servicios de TI (ITIL v4)",
                descripcion: "Los reportes de incidencias de los usuarios internos tardan demasiado en resolverse, generando cuellos de botella y baja productividad operativa.",
                opciones: [
                    { texto: "Establecer un sistema de Mesa de Ayuda (Help Desk) con flujos automatizados de gestión de incidentes y catálogo de servicios basado en ITIL.", correcta: true },
                    { texto: "Ignorar los reportes de los empleados hasta que decidan renunciar.", correcta: false },
                    { texto: "Desconectar los teléfonos de soporte técnico.", correcta: false }
                ]
            },
            {
                titulo: "CASO #06: Arquitectura de Microservicios y Resiliencia Empresarial",
                descripcion: "El sistema monolítico core de comercio electrónico sufre caídas recurrentes ante picos de tráfico estacional, comprometiendo la escalabilidad horizontal y el pipeline de despliegue continuo (CI/CD).",
                opciones: [
                    { texto: "Desacoplar el monolito en microservicios contenerizados con Kubernetes, orquestación de mallas de servicios (Service Mesh) y despliegues canary automatizados.", correcta: true },
                    { texto: "Conectar un cable Ethernet adicional al servidor principal y reiniciar la computadora una vez al mes.", correcta: false },
                    { texto: "Imprimir catálogos físicos y obligar a los clientes a realizar sus compras por teléfono fijo.", correcta: false }
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
        const questionWrapper = document.getElementById("question-wrapper");
        const victoryModal = document.getElementById("victory-modal");
        const defeatModal = document.getElementById("defeat-modal");
        const modalStars = document.getElementById("modal-stars");
        const modalErrors = document.getElementById("modal-errors");

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

        function cargarCaso() {
            if (juegoTerminado) return;

            const caso = estrategias[indiceActual];
            incidentCounter.textContent = `CASO ESTRATÉGICO ${indiceActual + 1} DE ${estrategias.length}`;
            ticketTitle.textContent = caso.titulo;
            ticketDesc.textContent = caso.descripcion;

            solutionsContainer.innerHTML = "";

            const opcionesMezcladas = [...caso.opciones].sort(() => Math.random() - 0.5);

            opcionesMezcladas.forEach((opcion) => {
                const btn = document.createElement("button");
                btn.className = "solution-btn";
                btn.textContent = opcion.texto;

                btn.onclick = () => {
                    if (juegoTerminado) return;

                    if (opcion.correcta) {
                        statusMsg.textContent = "💬 ¡Excelente decisión gerencial! Estrategia aprobada.";
                        statusMsg.style.borderColor = "#00ff88";
                        statusMsg.style.color = "#00ff88";
                        
                        indiceActual++;
                        if (indiceActual < estrategias.length) {
                            setTimeout(() => {
                                if (juegoTerminado) return;
                                
                                // Inicia animación de salida (1.5 segundos configurados en CSS)
                                questionWrapper.classList.add("fade-out");

                                setTimeout(() => {
                                    cargarCaso();
                                    // Remueve la clase para hacer la animación de entrada suave
                                    questionWrapper.classList.remove("fade-out");
                                    statusMsg.textContent = "💬 ¡Analiza el siguiente caso corporativo!";
                                    statusMsg.style.borderColor = "#a855f7";
                                    statusMsg.style.color = "#d8b4fe";
                                }, 750); // Mitad de la transición para cambiar el contenido con suavidad

                            }, 1000);
                        } else {
                            juegoTerminado = true;
                            setTimeout(mostrarVictoria, 500);
                        }
                    } else {
                        errores++;
                        if (estrellasRestantes > 0) {
                            estrellasRestantes -= 1;
                            actualizarEstrellasHUD();
                        }

                        if (estrellasRestantes === 0) {
                            juegoTerminado = true;
                            statusMsg.textContent = "💬 ¡Gobernanza vulnerada por errores!";
                            statusMsg.style.borderColor = "#ef4444";
                            statusMsg.style.color = "#f87171";
                            setTimeout(mostrarDerrota, 600);
                        } else {
                            statusMsg.textContent = "💬 ¡Error táctico! Esa decisión afecta la gobernanza.";
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
            modalErrors.textContent = `Errores de planificación: ${errores}`;
            modalStars.textContent = starsDisplay.textContent;
        }

        function mostrarDerrota() {
            defeatModal.classList.add("active");
        }

        function reiniciarNivel() {
            indiceActual = 0;
            errores = 0;
            estrellasRestantes = 6;
            juegoTerminado = false;
            actualizarEstrellasHUD();
            victoryModal.classList.remove("active");
            defeatModal.classList.remove("active");
            questionWrapper.classList.remove("fade-out");
            statusMsg.textContent = "💬 ¡Demuestra tu visión estratégica para liderar la corporación!";
            statusMsg.style.borderColor = "#a855f7";
            statusMsg.style.color = "#d8b4fe";
            cargarCaso();
        }

        window.onload = () => {
            actualizarEstrellasHUD();
            cargarCaso();
        };