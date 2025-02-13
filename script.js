// Importa Three.js e il loader OBJ
import * as THREE from './path/to/three.module.js';
//import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.130.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.133.1/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.133.1/examples/jsm/loaders/OBJLoader.js';

// webpack.config.js
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

// Crea la scena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controlli orbitali per muovere la telecamera con il mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Aggiungi una luce ambientale e una direzionale
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Posiziona la telecamera
camera.position.set(0, 2, 5);

// Caricamento del file OBJ
const input = document.getElementById('file-input');
const loader = new OBJLoader();

input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async (e) => {
        const objText = e.target.result;
        const obj = loader.parse(objText);
        obj.position.set(0, 0, 0);

        // Rimuove il vecchio modello se presente
        scene.children.forEach(child => {
            if (child.type === "Group") {
                scene.remove(child);
            }
        });

        scene.add(obj);
        console.log("Modello OBJ caricato");
    };
});

// Animazione
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
