import * as THREE from 'three';

// camerqa setup
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
camera.position.set(-35, 70, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xbfd1e5);

// screen resizing
export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// animating
export function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// light
// ambient light
let hemiLight = new THREE.AmbientLight(0xffffff, 0.20);
scene.add(hemiLight);

//Add directional light
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 50, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 70;
dirLight.shadow.camera.bottom = -70;

function createSphere() {
    let radius = 4;
    let pos = { x: 15, y: radius, z: -15 };
  
    let sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), 
        new THREE.MeshPhongMaterial({ color: 0x43a1f4 }));
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);

    sphere.userData.clickable = true;
    sphere.userData.name = "Sphere";
}

function createBox() {
    let scale = { x: 6, y: 6, z: 6 }
    let pos = { x: 15, y: scale.y / 2, z: 15 }
  
    let box = new THREE.Mesh(new THREE.BoxGeometry(), 
        new THREE.MeshPhongMaterial({ color: 0xDC143C }));
    box.position.set(pos.x, pos.y, pos.z);
    box.scale.set(scale.x, scale.y, scale.z);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

    box.userData.name = "Box";
}


// raycasting
const raycaster = new THREE.Raycaster();
const mouseClickPos = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
let clickable;

// mouse click
window.addEventListener("click", event => {
    mouseClickPos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouseClickPos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouseClickPos, camera );
    const found = raycaster.intersectObjects( scene.children );

    if (found.length > 0 && found[0].object.userData.clickable){
        clickable = found[0].object;
        console.log(`found clickable! ${clickable.name}`);
    }
})

createBox();
createSphere();

animate();