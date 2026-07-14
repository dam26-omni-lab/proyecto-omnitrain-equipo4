import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader.js';

// Destructuramos las clases necesarias (se eliminaron las primitivas)
const {
    Scene,
    PerspectiveCamera,
    OrthographicCamera,
    WebGLRenderer,
    PlaneGeometry,
    MeshStandardMaterial,
    Mesh,
    AmbientLight,
    DirectionalLight,
    Color,
    TextureLoader,
    RepeatWrapping,
    Clock
} = THREE;


// Variables globales
let scene, renderer;
let perspectiveCamera, orthographicCamera, activeCamera;
let plane, ambientLight, directionalLight;
let clock;
let width = window.innerWidth;
let height = window.innerHeight;

// Variables de las paredes
let wallFondo, wallIzquierda, wallDerecha, techo;

// Variables globales para el control nativo del mouse
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;


// Llamamos a la función init para inicializar la escena
init();

// Inicializamos un bucle de animación
renderer.setAnimationLoop(animate);


function init() {
    // Inicializamos el reloj
    clock = new Clock();

    // Creamos la escena
    scene = new Scene();
    scene.background = new Color(0x009040); // Color de fondo de la escena
    renderer = new WebGLRenderer({ antialias: true }); // Creamos el renderizador y suavizamos
    renderer.setSize(width, height); // Establecemos el tamaño del renderizador
    document.body.appendChild(renderer.domElement); // Añadimos el renderizador al DOM

    // Cámara perspectiva y ortográfica
    perspectiveCamera = new PerspectiveCamera(
        75, // Campo de visión vertical
        width / height, // Relación de aspecto
        0.1, // Plano cercano
        1000 // Plano lejano
    );
    perspectiveCamera.position.set(0, 1.6, 8); // Posición inicial de la cámara
    perspectiveCamera.lookAt(0, 1, 0); // La cámara mira al centro de los objetos

    // Cámara ortográfica
    const frustumSize = 10; // Tamaño del frustum
    const aspect = width / height; // Relación de aspecto
    const orthoHalfHeight = frustumSize / 2; // Mitad de la altura de frustum
    const orthoHalfWidth = orthoHalfHeight * aspect;
    orthographicCamera = new OrthographicCamera(
        -orthoHalfWidth,
        orthoHalfWidth,
        orthoHalfHeight,
        -orthoHalfHeight,
        0.1,
        1000
    );
    orthographicCamera.position.set(0, 1.6, 8);
    orthographicCamera.lookAt(0, 1, 0);

    // Elección de la cámara activa
    activeCamera = perspectiveCamera; // Por defecto, usamos la cámara perspectiva

    // Texturas
    const textureLoader = new TextureLoader();

    // Texturas para el suelo
    const floorTexture = textureLoader.load('./texturas/suelo.jpg');
    floorTexture.wrapS = RepeatWrapping;
    floorTexture.wrapT = RepeatWrapping;
    // Aumentamos la repetición para que se adapte al nuevo tamaño inmenso del suelo
    floorTexture.repeat.set(20, 20); 

    // Textura para las paredes de la escena
    const wallTexture = textureLoader.load('./texturas/pared.jpg'); 
    wallTexture.wrapS = RepeatWrapping;
    wallTexture.wrapT = RepeatWrapping;
    // Aumentamos la repetición de las paredes
    wallTexture.repeat.set(20, 10); 


    // --- ESTRUCTURA DE LA HABITACIÓN (TAMAÑO MASIVO PARA CUBRIR LA PANTALLA) ---

    // Material para las paredes (bloquea reflejos para simular ladrillo/yeso)
    const wallMaterial = new MeshStandardMaterial({
        map: wallTexture,
        roughness: 0.9
    });

    // Suelo (Aumentado a 100x100)
    const planeGeometry = new PlaneGeometry(100, 100); 
    const planeMaterial = new MeshStandardMaterial({
        map: floorTexture,
        roughness: 0.8,
    }); 
    plane = new Mesh(planeGeometry, planeMaterial); 
    plane.rotation.x = -Math.PI / 2; // Plano horizontal
    plane.position.y = -1; // Suelo base
    scene.add(plane); 

    // Pared de Fondo (Ancho 100, Alto 50)
    const wallGeometryFondo = new PlaneGeometry(100, 50); 
    wallFondo = new Mesh(wallGeometryFondo, wallMaterial);
    wallFondo.position.set(0, 24, -50); // Empujada muy al fondo (Z = -50)
    scene.add(wallFondo);

    // Pared Izquierda (Profundidad 100, Alto 50)
    const wallGeometryLateral = new PlaneGeometry(100, 50); 
    wallIzquierda = new Mesh(wallGeometryLateral, wallMaterial);
    wallIzquierda.position.set(-50, 24, 0); // Empujada muy a la izquierda (X = -50)
    wallIzquierda.rotation.y = Math.PI / 2; // Rotada 90 grados
    scene.add(wallIzquierda);

    // Pared Derecha
    wallDerecha = new Mesh(wallGeometryLateral, wallMaterial);
    wallDerecha.position.set(50, 24, 0); // Empujada muy a la derecha (X = 50)
    wallDerecha.rotation.y = -Math.PI / 2; // Rotada -90 grados
    scene.add(wallDerecha);

    // Techo (Aumentado a 100x100)
    const techoGeometry = new PlaneGeometry(100, 100);
    techo = new Mesh(techoGeometry, wallMaterial);
    techo.position.set(0, 49, 0); // Situado muy arriba de la escena (Y = 49)
    techo.rotation.x = Math.PI / 2; // Rotado horizontalmente
    scene.add(techo);


    // --- LUCES ---
    ambientLight = new AmbientLight(0xffffff, 0.4); // Luz ambiental para ver los rincones
    scene.add(ambientLight); 

    // Luz direccional potente para simular el foco principal que ilumina la habitación
    directionalLight = new DirectionalLight(0xffffff, 1.5); 
    directionalLight.position.set(5, 8, 5); 
    directionalLight.target = plane; 
    scene.add(directionalLight);
    scene.add(directionalLight.target); 


    // --- MODELO DEL ESPECTRO ---
    const loader = new GLTFLoader();
    loader.load(
        './model/zx_spectrum_48k (1).glb',
        function(gltf){
            console.log("MODELO CARGADO");
            const modelo = gltf.scene;
            modelo.position.set(0,0,0); // Quedará posicionado en el centro de esta gran habitación
            modelo.scale.set(1,1,1);
            scene.add(modelo);
        },
        function(xhr){
            console.log(xhr.loaded / xhr.total * 100 + "%");
        },
        function(error){
            console.log(error);
        }
    );

    // Eventos del navegador
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onDocumentMouseMove); // Captura el mouse
}


function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / windowHalfX;
    mouseY = (event.clientY - windowHalfY) / windowHalfY;
}


function animate() {
    const elapsedTime = clock.getElapsedTime();

    // --- MOVIMIENTO DE LA CÁMARA CON EL MOUSE (Efecto habitación 3D) ---
    targetX = mouseX * 6;          
    targetY = -mouseY * 4 + 2;    

    perspectiveCamera.position.x += (targetX - perspectiveCamera.position.x) * 0.05;
    perspectiveCamera.position.y += (targetY - perspectiveCamera.position.y) * 0.05;
    perspectiveCamera.lookAt(0, 2, 0); // La cámara apunta un poco más arriba


    // --- ANIMACIÓN DE LA LUZ ---
    directionalLight.position.x = Math.cos(elapsedTime) * 6;
    directionalLight.position.z = Math.sin(elapsedTime) * 6;

    renderer.render(scene, activeCamera); 
}


function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    windowHalfX = width / 2;
    windowHalfY = height / 2;

    perspectiveCamera.aspect = width / height;
    perspectiveCamera.updateProjectionMatrix(); 

    const frustumSize = 10; 
    const aspect = width / height;
    const orthoHalfHeight = frustumSize / 2; 
    const orthoHalfWidth = orthoHalfHeight * aspect;

    orthographicCamera.left = -orthoHalfWidth;
    orthographicCamera.right = orthoHalfWidth;
    orthographicCamera.top = orthoHalfHeight;
    orthographicCamera.bottom = -orthoHalfHeight;
    orthographicCamera.updateProjectionMatrix(); 

    renderer.setSize(width, height); 
}