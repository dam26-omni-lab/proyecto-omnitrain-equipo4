let faseActual = 0;
let tiempoRestantes = 90;
let estrellasRestantes = 5;
let temporizadorIntervalo;

const timerEl = document.getElementById('timer');
const timerBoxEl = document.getElementById('timer-box');
const starsContainerEl = document.getElementById('stars-container');
const challengeTitleEl = document.getElementById('challenge-title');
const challengeDescEl = document.getElementById('challenge-desc');
const workspaceEl = document.getElementById('interactive-workspace');
const currentQEl = document.getElementById('current-q');
const feedbackEl = document.getElementById('feedback');
const winScreenEl = document.getElementById('win-screen');
const loseScreenEl = document.getElementById('lose-screen');
const winMessageEl = document.getElementById('win-message');
const finalStarsDisplayEl = document.getElementById('final-stars-display');

function iniciarJuego() {
    iniciarContrareloj();
    cargarFase();
    actualizarEstrellasVisuales();
}

function iniciarContrareloj() {
    temporizadorIntervalo = setInterval(() => {
        tiempoRestantes--;
        let minutos = Math.floor(tiempoRestantes / 60);
        let segundos = tiempoRestantes % 60;
        timerEl.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        if (tiempoRestantes <= 30) {
            timerBoxEl.classList.add('timer-warning');
        }
        if (tiempoRestantes <= 0) {
            clearInterval(temporizadorIntervalo);
            derrota("Se agotó el tiempo límite del servidor.");
        }
    }, 1000);
}

function actualizarEstrellasVisuales() {
    const stars = starsContainerEl.children;
    for (let i = 0; i < stars.length; i++) {
        if (i < estrellasRestantes) {
            stars[i].classList.remove('lost');
        } else {
            stars[i].classList.add('lost');
        }
    }
}

function cargarFase() {
    if (faseActual === 0) cargarPruebaSliders();
    else if (faseActual === 1) cargarPruebaSecuencia();
    else if (faseActual === 2) cargarPruebaComando();
    else if (faseActual === 3) cargarPruebaConexionPuertos();
    else if (faseActual === 4) cargarPruebaBinaria();
    else victoria();

    currentQEl.textContent = faseActual + 1;
}

// RETO 1: Sliders de Búfer y Caché
function cargarPruebaSliders() {
    challengeTitleEl.textContent = "RETO 1: Calibración de Búfer y Caché de Datos";
    challengeDescEl.textContent = "Pregunta: ¿Qué porcentaje de asignación de Búfer de Consulta y Memoria Caché se requiere para estabilizar el flujo de transacciones masivas?";
    workspaceEl.innerHTML = `
        <div class="slider-group"><label>Asignación de Búfer de Consulta: <span id="val-bw">20</span>%</label><input type="range" id="slider-bw" min="0" max="100" value="20"></div>
        <div class="slider-group"><label>Memoria Caché del Servidor: <span id="val-mem">10</span>%</label><input type="range" id="slider-mem" min="0" max="100" value="10"></div>
        <button class="action-submit-btn" onclick="validarSliders()">VALIDAR CALIBRACIÓN</button>
    `;
    const sBw = document.getElementById('slider-bw');
    const sMem = document.getElementById('slider-mem');
    sBw.oninput = () => document.getElementById('val-bw').textContent = sBw.value;
    sMem.oninput = () => document.getElementById('val-mem').textContent = sMem.value;
}
window.validarSliders = function() {
    const bw = parseInt(document.getElementById('slider-bw').value);
    const mem = parseInt(document.getElementById('slider-mem').value);
    if (bw >= 70 && bw <= 80 && mem >= 45 && mem <= 55) exitoFase("¡Búfer y caché calibrados correctamente!");
    else falloFase("Valores incorrectos. El búfer sufre desbordamiento.");
};

// RETO 2: Selección de Nodos Vulnerables
function cargarPruebaSecuencia() {
    challengeTitleEl.textContent = "RETO 2: Detección de Tráfico Malicioso";
    challengeDescEl.textContent = "Pregunta: Analiza las bitácoras de red y selecciona únicamente los dos nodos comprometidos por intrusos:";
    workspaceEl.innerHTML = `
        <div class="node-grid">
            <div class="node-card" onclick="toggleNode(this)" data-infected="false">Nodo A: Gateway Seguro</div>
            <div class="node-card" onclick="toggleNode(this)" data-infected="true">Nodo B: Tráfico Troyano</div>
            <div class="node-card" onclick="toggleNode(this)" data-infected="false">Nodo C: Impresora LAN</div>
            <div class="node-card" onclick="toggleNode(this)" data-infected="true">Nodo D: Script Malicioso</div>
        </div>
        <button class="action-submit-btn" style="margin-top:10px;" onclick="validarNodos()">VERIFICAR AMENAZAS</button>
    `;
}
window.toggleNode = card => card.classList.toggle('selected');
window.validarNodos = function() {
    let ok = true;
    document.querySelectorAll('.node-card').forEach(c => {
        if ((c.getAttribute('data-infected') === 'true') !== c.classList.contains('selected')) ok = false;
    });
    if (ok) exitoFase("¡Amenazas detectadas y aisladas!");
    else falloFase("Selección errónea de nodos.");
};

// RETO 3: Consola de Comandos
function cargarPruebaComando() {
    challengeTitleEl.textContent = "RETO 3: Sintaxis de Emergencia del Firewall";
    challengeDescEl.textContent = "Pregunta: ¿Qué instrucción de comandos debes escribir en la terminal para reiniciar los servicios de red caídos?";
    workspaceEl.innerHTML = `
        <div class="terminal-input-group">
            <span class="terminal-prompt">admin@sys:~$</span>
            <input type="text" id="cmd-input" class="terminal-input" placeholder="Escribe tu comando aquí..." autofocus>
            <button class="action-submit-btn" onclick="validarComando()">PROBAR</button>
        </div>
    `;
    document.getElementById('cmd-input').addEventListener("keypress", e => { if (e.key === "Enter") validarComando(); });
}
window.validarComando = function() {
    if (document.getElementById('cmd-input').value.trim().toLowerCase() === "net restart services") exitoFase("¡Comando aceptado!");
    else falloFase("Sintaxis incorrecta.");
};

// RETO 4: Enrutamiento de Puertos
let origenSeleccionado = null;
function cargarPruebaConexionPuertos() {
    challengeTitleEl.textContent = "RETO 4: Mapeo Lógico de Dispositivos";
    challengeDescEl.textContent = "Pregunta: ¿Cómo se deben vincular correctamente los equipos de red con sus puertos correspondientes en el switch?";
    workspaceEl.innerHTML = `
        <div class="port-connection-grid">
            <div class="port-col" id="col-origenes">
                <p style="font-size:13px; color:#aaa;">Equipos:</p>
                <button class="port-btn" onclick="seleccionarOrigen(this, 'servidor')">Servidor Central</button>
                <button class="port-btn" onclick="seleccionarOrigen(this, 'db')">Base de Datos</button>
            </div>
            <div class="port-col" id="col-destinos">
                <p style="font-size:13px; color:#aaa;">Puertos:</p>
                <button class="port-btn" onclick="seleccionarDestino(this, 'servidor')">Puerto Principal (Eth0)</button>
                <button class="port-btn" onclick="seleccionarDestino(this, 'db')">Puerto Secundario (Eth1)</button>
            </div>
        </div>
    `;
    origenSeleccionado = null;
}
window.seleccionarOrigen = function(btn, tipo) {
    document.querySelectorAll('#col-origenes .port-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    origenSeleccionado = tipo;
};
window.seleccionarDestino = function(btn, tipo) {
    if (!origenSeleccionado) {
        feedbackEl.textContent = "ESTADO: ¡Selecciona primero un equipo de la izquierda!";
        return;
    }
    if (origenSeleccionado === tipo) {
        btn.classList.add('connected');
        btn.onclick = null;
        document.querySelectorAll('#col-origenes .port-btn').forEach(b => { if(b.classList.contains('active')) { b.classList.add('connected'); b.classList.remove('active'); } });
        origenSeleccionado = null;
        
        if (document.querySelectorAll('#col-destinos .port-btn.connected').length === 2) {
            exitoFase("¡Mapeo de puertos exitoso!");
        }
    } else {
        falloFase("¡Error de vinculación de puertos!");
        origenSeleccionado = null;
        document.querySelectorAll('#col-origenes .port-btn').forEach(b => b.classList.remove('active'));
    }
};

// RETO 5: Decodificación Binaria
function cargarPruebaBinaria() {
    challengeTitleEl.textContent = "RETO 5: Desencriptación de Código de Bloqueo";
    challengeDescEl.textContent = "Pregunta: El protocolo de emergencia indica el binario 00001101. ¿A qué valor decimal equivale para desbloquear el sistema?";
    workspaceEl.innerHTML = `
        <div class="terminal-input-group">
            <span class="terminal-prompt">VALOR DECIMAL:</span>
            <input type="number" id="bin-input" class="terminal-input" placeholder="Escribe el número..." autofocus>
            <button class="action-submit-btn" onclick="validarBinario()">VERIFICAR</button>
        </div>
    `;
    document.getElementById('bin-input').addEventListener("keypress", e => { if (e.key === "Enter") validarBinario(); });
}
window.validarBinario = function() {
    if (document.getElementById('bin-input').value.trim() === "13") {
        exitoFase("¡Código decimal correcto!");
    } else {
        falloFase("Valor decimal erróneo.");
    }
};

function exitoFase(mensaje) {
    feedbackEl.textContent = "ESTADO: " + mensaje;
    feedbackEl.style.color = "#00ff66";
    faseActual++;
    setTimeout(() => cargarFase(), 1200);
}

function falloFase(mensaje) {
    estrellasRestantes--;
    actualizarEstrellasVisuales();

    // Reproducir sonido de error automáticamente al fallar
    const audioError = document.getElementById('audio-error');
    if (audioError) {
        audioError.currentTime = 0;
        audioError.volume = 0.5;
        audioError.play().catch(e => console.log("Audio de error listo"));
    }

    feedbackEl.textContent = "ESTADO: " + mensaje;
    feedbackEl.style.color = "#ff3333";
    if (estrellasRestantes <= 0) {
        clearInterval(temporizadorIntervalo);
        derrota("Has perdido todas tus estrellas por fallos de operación.");
    }
}

function victoria() {
    clearInterval(temporizadorIntervalo);
    document.getElementById('quiz-container').style.display = 'none';
    finalStarsDisplayEl.textContent = "★".repeat(estrellasRestantes) + "☆".repeat(5 - estrellasRestantes);
    winMessageEl.textContent = `¡Diagnóstico superado con ${estrellasRestantes} de 5 estrellas!`;
    winScreenEl.style.display = 'flex';
}

function derrota(mensaje) {
    clearInterval(temporizadorIntervalo);
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('lose-message').textContent = mensaje;
    loseScreenEl.style.display = 'flex';
}

// Asegurar ejecución limpia al cargar el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarJuego);
} else {
    iniciarJuego();
}

document.addEventListener("DOMContentLoaded", () => {
    const musicaPc = document.getElementById('musica-pc');
    if (musicaPc) {
        musicaPc.volume = 0.25; // Volumen al 25%
        musicaPc.play().catch(e => console.log("Audio de PC listo tras interacción"));
    }
});

function exitoFase(mensaje) {
    // --- REPRODUCIR SONIDO DE ÉXITO ---
    const audioExito = document.getElementById('audio-exito');
    if (audioExito) {
        audioExito.currentTime = 0; // Reinicia el audio por si hubo un acierto previo
        audioExito.volume = 0.5;   // Volumen al 50%
        audioExito.play().catch(e => console.log("Audio de éxito listo"));
    }
    // ----------------------------------

    feedbackEl.textContent = "ESTADO: " + mensaje;
    feedbackEl.style.color = "#00ff66";
    faseActual++;
    setTimeout(() => cargarFase(), 1200);
}