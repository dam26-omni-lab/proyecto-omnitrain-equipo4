import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader.js';

const {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    Color,
    Box3,
    Vector3
} = THREE;

// Variables globales
let scene, renderer, perspectiveCamera;
let ambientLight, directionalLight;
let laptopMesh; 
let width = window.innerWidth;
let height = window.innerHeight;

// --- CONFIGURACIÓN DE ALTURA DE LA VISTA ---
const cameraHeight = -0.18; 

// --- VARIABLES PARA ROTACIÓN 360° ---
let theta = 0; 
let isRightMouseDown = false; 
const rotationSpeed = 0.005; 

// --- CONTROLES DE MOVIMIENTO WASD ---
const keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false
};
const moveSpeed = 0.07; 

// --- ESTADOS DE INTERACCIÓN ---
let cercaDeLaptop = false;
let cercaDePuerta = false;

// --- COORDENADAS DE LA PUERTA (Exactamente donde apareces al iniciar) ---
let puertaPos = new Vector3(-2.89, -0.18, -4.5); 

init();
renderer.setAnimationLoop(animate);

function init() {
    scene = new Scene();
    scene.background = new Color(0xdddddd); 

    renderer = new WebGLRenderer({ antialias: true }); 
    renderer.setSize(width, height); 
    renderer.outputColorSpace = THREE.SRGBColorSpace; 
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap; 
    
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2; 
    
    document.body.appendChild(renderer.domElement); 

    perspectiveCamera = new PerspectiveCamera(60, width / height, 0.1, 1000);
    
    // --- AQUÍ APARECES: Cerca de la puerta al iniciar ---
    perspectiveCamera.position.set(-2.89, cameraHeight, -4.5); 
    
    // Iluminación
    ambientLight = new AmbientLight(0xffffff, 2.0); 
    scene.add(ambientLight); 

    directionalLight = new DirectionalLight(0xffffff, 1.5); 
    directionalLight.position.set(10, 15, 10); 
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    // 1. Carga del escenario
    const rutaModelo = '../model/escenario.glb';
    console.log("Intentando cargar el modelo desde la ruta:", rutaModelo);

    loader.load(
        rutaModelo, 
        function(gltf) {
            console.log("¡OFICINA CARGADA CORRECTAMENTE!");
            const oficina = gltf.scene;
            
            oficina.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    
                    if (node.material) {
                        node.material.side = THREE.DoubleSide; 
                        node.material.depthWrite = true;
                        
                        if (node.material.isGLTFSpecularGlossinessMaterial || !node.material.roughness) {
                            const prevMaterial = node.material;
                            node.material = new THREE.MeshStandardMaterial({
                                map: prevMaterial.map,
                                normalMap: prevMaterial.normalMap,
                                roughnessMap: prevMaterial.roughnessMap || prevMaterial.specularMap,
                                metalness: 0.1, 
                                roughness: 0.6, 
                                color: prevMaterial.color,
                                transparent: prevMaterial.transparent,
                                opacity: prevMaterial.opacity
                            });
                        }
                    }
                }
            });

            // Centrado y escalado automático
            const box = new Box3().setFromObject(oficina);
            const size = box.getSize(new Vector3());
            const center = box.getCenter(new Vector3());
            
            oficina.position.x += (oficina.position.x - center.x);
            oficina.position.y += (oficina.position.y - center.y);
            oficina.position.z += (oficina.position.z - center.z);
            
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
                const scaleFactor = 20 / maxDim;
                oficina.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }
            
            scene.add(oficina);
        }, 
        function(xhr) { 
            console.log("Cargando oficina: " + Math.round(xhr.loaded / xhr.total * 100) + "%"); 
        }, 
        function(error) { 
            console.error("Error al cargar la oficina:", error);
        }
    );

    // 2. Carga de la laptop
    const rutaLaptop = '../model/sci_fi_laptop_alternative_90s.glb';
    
    loader.load(
        rutaLaptop, 
        function(gltf) {
            console.log("¡LAPTOP CARGADA CORRECTAMENTE!");
            laptopMesh = gltf.scene; 
            
            laptopMesh.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            laptopMesh.scale.set(3, 3, 3); 
            laptopMesh.position.set(-3.2, -1.45, 1); 

            scene.add(laptopMesh);
        }, 
        function(xhr) { 
            console.log("Cargando laptop: " + Math.round(xhr.loaded / xhr.total * 100) + "%"); 
        }, 
        function(error) { 
            console.error("Error al cargar la laptop:", error);
        }
    );

    // Lógica del botón de instrucciones y reproducción de música inmediata
    const btnComenzar = document.getElementById('btn-comenzar');
    const modalInstrucciones = document.getElementById('modal-instrucciones');
    const musicaFondo = document.getElementById('musica-fondo');

    if (btnComenzar && modalInstrucciones) {
        btnComenzar.addEventListener('click', () => {
            modalInstrucciones.style.display = 'none'; 
            
            // Iniciar música de fondo al hacer clic en comenzar
            if (musicaFondo) {
                musicaFondo.volume = 0.3; // Volumen al 30%
                musicaFondo.play().catch(error => {
                    console.log("Audio iniciado correctamente");
                });
            }
        });
    }

    // Eventos de mouse
    window.addEventListener('mousedown', (event) => {
        if (event.button === 2) isRightMouseDown = true;
    });

    window.addEventListener('mouseup', (event) => {
        if (event.button === 2) isRightMouseDown = false;
    });

    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    document.addEventListener('mousemove', onDocumentMouseMove); 

    // Zoom
    window.addEventListener('wheel', (event) => {
        perspectiveCamera.fov += event.deltaY * 0.05;
        perspectiveCamera.fov = Math.max(15, Math.min(90, perspectiveCamera.fov));
        perspectiveCamera.updateProjectionMatrix();
    });

    // Teclado WASD, Espacio (Laptop) y X (Puerta)
    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (key in keysPressed) {
            keysPressed[key] = true;
        }

        if (event.code === 'Space' && cercaDeLaptop) {
            window.location.href = 'pc.html'; 
        }

        if (key === 'x' && cercaDePuerta) {
            console.log("Saliendo al dashboard...");
            window.location.href = 'dashboard.html';
        }
    });

    window.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (key in keysPressed) {
            keysPressed[key] = false;
        }
    });

    window.addEventListener('resize', onWindowResize);
}

function onDocumentMouseMove(event) {
    if (isRightMouseDown) {
        theta -= event.movementX * rotationSpeed;
    }
}

function animate() {
    // 1. ROTACIÓN HORIZONTAL
    const target = new Vector3(
        perspectiveCamera.position.x + Math.sin(theta),
        perspectiveCamera.position.y, 
        perspectiveCamera.position.z - Math.cos(theta) 
    );
    
    perspectiveCamera.lookAt(target);

    // 2. DESPLAZAMIENTO WASD
    const forward = new Vector3();
    perspectiveCamera.getWorldDirection(forward);
    forward.y = 0; 
    forward.normalize();

    const right = new Vector3();
    right.crossVectors(forward, perspectiveCamera.up).normalize();

    if (keysPressed.w) perspectiveCamera.position.addScaledVector(forward, moveSpeed);
    if (keysPressed.s) perspectiveCamera.position.addScaledVector(forward, -moveSpeed);
    if (keysPressed.a) perspectiveCamera.position.addScaledVector(right, -moveSpeed);
    if (keysPressed.d) perspectiveCamera.position.addScaledVector(right, moveSpeed);

    perspectiveCamera.position.y = cameraHeight;

    // 3. DETECTAR PROXIMIDAD A LA LAPTOP
    const laptopTargetPos = new Vector3(-1.21, cameraHeight, 3.53);
    const distanciaLaptop = perspectiveCamera.position.distanceTo(laptopTargetPos);
    const promptLaptop = document.getElementById('prompt-laptop');

    if (distanciaLaptop < 1.2) {
        cercaDeLaptop = true;
        if (promptLaptop) promptLaptop.style.display = 'block';
    } else {
        cercaDeLaptop = false;
        if (promptLaptop) promptLaptop.style.display = 'none';
    }

    // 4. DETECTAR PROXIMIDAD A LA PUERTA (Radio amplio de 3.0 para asegurar visibilidad)
    const distanciaPuerta = perspectiveCamera.position.distanceTo(puertaPos);
    const promptPuerta = document.getElementById('prompt-puerta');
    
    if (distanciaPuerta < 3.0) {
        cercaDePuerta = true;
        if (promptPuerta) promptPuerta.style.display = 'block';
    } else {
        cercaDePuerta = false;
        if (promptPuerta) promptPuerta.style.display = 'none';
    }

    renderer.render(scene, perspectiveCamera); 
}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    perspectiveCamera.aspect = width / height;
    perspectiveCamera.updateProjectionMatrix(); 
    renderer.setSize(width, height); 
}