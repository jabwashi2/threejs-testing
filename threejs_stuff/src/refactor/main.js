// imports
import * as THREE from 'three';
import * as utils from './utils';
import {PickHelper} from './pick';
import * as setup from './setup'

const pickHelper = new PickHelper();

// cavnas setup
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
const tempV = new THREE.Vector3();
const raycaster = new THREE.Raycaster();

// mouse position handling
const mouseClickPos = new THREE.Vector2();
let clickable;
const pickPosition = {x: 0, y: 0};
utils.clearPickPosition(pickPosition);

// camera
const camera = setup.createCamera(60, 2, 0.1, 200, 50);
const aspect = camera.aspect;
const scene = setup.createScene(new THREE.Color('black'), new THREE.TextureLoader().load('images/whale shark2.jpg'));
camera.add(setup.createLights(0xFFFFFF, 1));
scene.add(camera);

// event listeners
window.addEventListener('click', event => {
    event.stopPropagation();
    mouseClickPos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouseClickPos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouseClickPos, camera );
    const found = raycaster.intersectObjects( scene.children );

    if (found.length > 0 && found[0].object.userData.clickable){
        clickable = found[0].object;
        console.log(`found clickable! ${clickable.userData.name}`);
        utils.showContent(clickable);
    }
})
window.addEventListener('mousemove', (event) => {utils.setPickPosition(event, canvas, pickPosition)});
window.addEventListener('mouseout', (event) => {utils.clearPickPosition(pickPosition)});
window.addEventListener('mouseleave', (event) => {utils.clearPickPosition(pickPosition)});
window.addEventListener('touchstart', (event) => {
    // prevent the window from scrolling
    event.preventDefault();
    utils.setPickPosition(event.touches[0], canvas, pickPosition);
    }, {passive: false});
window.addEventListener('touchmove', (event) => {
    utils.setPickPosition(event.touches[0], canvas, pickPosition);
});
window.addEventListener('touchend', (event) => {utils.clearPickPosition(pickPosition)});
let backButtons = document.querySelectorAll(".back-btn");
// rendering the scene
renderer.render(scene, camera);

// setting up spheres
const geometry = new THREE.SphereGeometry( 4, 32, 16 );
const spheres = [
    setup.createPlanet(geometry, 0x44aa88,  0, 'green'),
    setup.createPlanet(geometry, 0x8844aa, -10, 'purple'),
    setup.createPlanet(geometry, 0xaa8844,  10, 'gold')
];

// add spheres/planets to the scene
for (let s of spheres){
    scene.add(s.sphere);
}

// animating the scene
const animate = () => {
    // check for need to resize
    utils.checkResize(renderer, camera, aspect);

    // updating spheres
    setup.updateSpheres(spheres, tempV, raycaster, camera, scene, canvas);
    
    // object picking
    pickHelper.pick(pickPosition, scene, camera);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate(scene, camera);