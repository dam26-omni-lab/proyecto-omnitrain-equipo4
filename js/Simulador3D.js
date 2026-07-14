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
let width = window.innerWidth;
let height = window.innerHeight;

// --- CONFIGURACIÓN DE ALTURA DE LA VISTA ---
// Ajusta este valor: entre más negativo, más baja estará la perspectiva.
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
    // Establecemos la altura inicial corregida
    perspectiveCamera.position.set(0, cameraHeight, 2); 
    
    // Iluminación
    ambientLight = new AmbientLight(0xffffff, 2.0); 
    scene.add(ambientLight); 

    directionalLight = new DirectionalLight(0xffffff, 1.5); 
    directionalLight.position.set(10, 15, 10); 
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Carga del modelo nuevo
    const rutaModelo = '../model/the_design_lab.glb';
    const loader = new GLTFLoader();

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
            
            // Colocamos la cámara a la altura configurada
            perspectiveCamera.position.set(-1.5, cameraHeight, 1.5);
        }, 
        function(xhr) { 
            console.log("Cargando oficina: " + Math.round(xhr.loaded / xhr.total * 100) + "%"); 
        }, 
        function(error) { 
            console.error("Error al cargar la oficina:", error);
        }
    );

    // Clic derecho para arrastrar perspectiva
    window.addEventListener('mousedown', (event) => {
        if (event.button === 2) { 
            isRightMouseDown = true;
        }
    });

    window.addEventListener('mouseup', (event) => {
        if (event.button === 2) {
            isRightMouseDown = false;
        }
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

    // Teclado WASD
    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (key in keysPressed) {
            keysPressed[key] = true;
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
    // 1. ROTACIÓN HORIZONTAL (Mantenemos la mirada nivelada a la altura de la cámara)
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

    // Forzamos rigurosamente que el jugador no se hunda ni flote al caminar
    perspectiveCamera.position.y = cameraHeight;

    renderer.render(scene, perspectiveCamera); 
}

function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    perspectiveCamera.aspect = width / height;
    perspectiveCamera.updateProjectionMatrix(); 
    
    renderer.setSize(width, height); 
}