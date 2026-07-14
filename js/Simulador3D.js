import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader.js';
// Destructuramos las clases necesarias
const {
Scene,
PerspectiveCamera,
OrthographicCamera,
WebGLRenderer,
BoxGeometry,
PlaneGeometry,
CircleGeometry,
SphereGeometry,
MeshStandardMaterial,
MeshBasicMaterial,
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
let cube, esfera, triangle, plane, ambientLight, directionalLight;
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
floorTexture.repeat.set(4, 4);

// Textura para las paredes de la escena
const wallTexture = textureLoader.load('./texturas/pared.jpg'); 
wallTexture.wrapS = RepeatWrapping;
wallTexture.wrapT = RepeatWrapping;
wallTexture.repeat.set(4, 2); // Repite la textura


// --- OBJETOS DE LA ESCENA ---

// 1. El Cubo (Se queda en el centro y se mueve arriba/abajo)
const boxGeometry = new BoxGeometry(1, 1, 1);
const boxMaterials = [
    new MeshBasicMaterial({ color: 0xff0000 }), 
    new MeshBasicMaterial({ color: 0x00ff00 }), 
    new MeshBasicMaterial({ color: 0x0000ff }), 
    new MeshBasicMaterial({ color: 0xffff00 }), 
    new MeshBasicMaterial({ color: 0xff00ff }), 
    new MeshBasicMaterial({ color: 0x00ffff })  
];
cube = new Mesh(boxGeometry, boxMaterials);
cube.position.set(0, 1, 0); // Lo subimos un poco sobre el suelo
scene.add(cube);


// 2. La Esfera (A la izquierda, material metálico pulido para que BRILLE)
const esferaGeometry = new SphereGeometry(1, 32, 32); 
const esferaMaterial = new MeshStandardMaterial({ 
    color: 0xff0000, 
    roughness: 0.05, 
    metalness: 0.9   
}); 
esfera = new Mesh(esferaGeometry, esferaMaterial); 
esfera.position.set(-4, 1, 0); 
scene.add(esfera);


// 3. El Triángulo (A la derecha, creado con un círculo de 3 lados, gira en Z)
const triangleGeometry = new CircleGeometry(1.5, 3); 
const triangleMaterial = new MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
triangle = new Mesh(triangleGeometry, triangleMaterial); 
triangle.position.set(4, 1, 0); 
scene.add(triangle);


// --- ESTRUCTURA DE LA HABITACIÓN (SUELO, PAREDES Y TECHO) ---

// Material para las paredes (bloquea reflejos para simular ladrillo/yeso)
const wallMaterial = new MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.9
});

// Suelo
const planeGeometry = new PlaneGeometry(20, 20); 
const planeMaterial = new MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.8,
}); 
plane = new Mesh(planeGeometry, planeMaterial); 
plane.rotation.x = -Math.PI / 2; // Plano horizontal
plane.position.y = -1; // Suelo base
scene.add(plane); 

// Pared de Fondo
const wallGeometryFondo = new PlaneGeometry(20, 10); // Ancho 20, Alto 10
wallFondo = new Mesh(wallGeometryFondo, wallMaterial);
wallFondo.position.set(0, 4, -10); // Al fondo de la caja (Z = -10)
scene.add(wallFondo);

// Pared Izquierda
const wallGeometryLateral = new PlaneGeometry(20, 10); // Ancho 20 (profundidad), Alto 10
wallIzquierda = new Mesh(wallGeometryLateral, wallMaterial);
wallIzquierda.position.set(-10, 4, 0); // Desplazada a la izquierda (X = -10)
wallIzquierda.rotation.y = Math.PI / 2; // Rotada 90 grados para cerrar el lateral
scene.add(wallIzquierda);

// Pared Derecha
wallDerecha = new Mesh(wallGeometryLateral, wallMaterial);
wallDerecha.position.set(10, 4, 0); // Desplazada a la derecha (X = 10)
wallDerecha.rotation.y = -Math.PI / 2; // Rotada -90 grados para cerrar el lateral
scene.add(wallDerecha);

// Techo
const techoGeometry = new PlaneGeometry(20, 20);
techo = new Mesh(techoGeometry, wallMaterial);
techo.position.set(0, 9, 0); // Situado arriba de la escena (Y = 9)
techo.rotation.x = Math.PI / 2; // Rotado horizontalmente mirando hacia abajo
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


const loader = new GLTFLoader();

loader.load(
    './model/zx_spectrum_48k (1).glb',

    function(gltf){

        console.log("MODELO CARGADO");
        console.log(gltf);

        const modelo = gltf.scene;

        modelo.position.set(0,0,0);

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
targetX = mouseX * 6;           // Un poco más de rango para apreciar los laterales
targetY = -mouseY * 4 + 2;    

perspectiveCamera.position.x += (targetX - perspectiveCamera.position.x) * 0.05;
perspectiveCamera.position.y += (targetY - perspectiveCamera.position.y) * 0.05;
perspectiveCamera.lookAt(0, 2, 0); // La cámara apunta un poco más arriba para ver las paredes


// --- ANIMACIONES DE LOS OBJETOS ---
cube.position.y = 1 + Math.sin(elapsedTime * 2) * 1; 
cube.rotation.x += 0.01; 
cube.rotation.y += 0.01;

triangle.rotation.z = elapsedTime * 1.5;
esfera.rotation.y = elapsedTime * 0.5;


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
