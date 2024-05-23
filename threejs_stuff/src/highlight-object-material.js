// the goal of this module:
// have a spinning 3D object highlight when hovered over
// BONUS: when the object is clicked, open my linkedin page in another tab

// okay so
// these 3D objects are basically like pictures, right? rendered objects
// in order to have the capabilities we have with objects included in the HTML file, we need to add it to the DOM as an object
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
  
    pick(normalizedPosition, scene, camera, time) {
      if (this.pickedObject) {
        this.pickedObject.scale.x = 1;
        this.pickedObject.scale.y = 1;
        this.pickedObject.scale.z = 1;
        this.pickedObject = undefined;
      }
      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(scene.children);
      if (intersectedObjects.length) {
        // pick the first object. It's the closest one
        this.pickedObject = intersectedObjects[0].object;
        // increase size
        this.pickedObject.scale.x = 1.5;
        this.pickedObject.scale.y = 1.5;
        this.pickedObject.scale.z = 1.5;
      }
    }
}

function main() {
  const pickHelper = new PickHelper();

  // cavnas setup
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
  const labelContainerElem = document.querySelector('#labels');
  const tempV = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  // mouse position handling
  const mouseClickPos = new THREE.Vector2();
  //const moveMouse = new THREE.Vector2();
  let clickable;
  const pickPosition = {x: 0, y: 0};
  clearPickPosition();

  // camera setup
  const fov = 60;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 200;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 50;
  

  // scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');
  const whaleTexture = new THREE.TextureLoader().load('images/whale shark2.jpg');
  scene.background = whaleTexture;
  scene.add(camera);

  // pic for a planet
  const teleTexture = new THREE.TextureLoader().load('images/tele-chugging away the pain.jpg');
  const teleMesh = new THREE.Mesh(
    new THREE.SphereGeometry(4,32,16),
    new THREE.MeshBasicMaterial({ map: teleTexture })
  );
  teleMesh.position.x = -15;
  scene.add(teleMesh);

  // sphere setup
  const geometry = new THREE.SphereGeometry( 4, 32, 16 ); 
  const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 

  renderer.render(scene, camera);

  // lighting
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  camera.add(light);

  // orbit
  const controls = new OrbitControls(camera, renderer.domElement);

  // adding our spheres to the scene
  const spheres = [
      makeInstance(geometry, 0x44aa88,  0, '1'),
      makeInstance(geometry, 0x8844aa, -10, '2'),
      makeInstance(geometry, 0xaa8844,  10, '3')
  ];

  // event listeners
  window.addEventListener('click', event => {
    event.stopPropagation();
    mouseClickPos.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  mouseClickPos.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouseClickPos, camera );
    const found = raycaster.intersectObjects( scene.children );

    if (found.length > 0 && found[0].object.userData.clickable){
        clickable = found[0].object;
        console.log(`found clickable! ${clickable.name}`);
        moveCamera(camera, found[0].object);
    }
  })
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);
  window.addEventListener('touchstart', (event) => {
      // prevent the window from scrolling
      event.preventDefault();
      setPickPosition(event.touches[0]);
      }, {passive: false});
  window.addEventListener('touchmove', (event) => {
  setPickPosition(event.touches[0]);
  });
  window.addEventListener('touchend', clearPickPosition);
  
  // stars
  Array(200).fill().forEach(addStar);

  // rendering
  function render(time) {
    time *= 0.001;  // convert time to seconds

    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    controls.update();

    // checking for the need to resize the canvas
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    spheres.forEach((sphereInfo, ndx) => {
      const {sphere, elem} = sphereInfo;
      //const speed = 1 + ndx * .1;
      //const rot = time * speed;

      // get the position of the center of the sphere
      sphere.updateWorldMatrix(true, false);
      sphere.getWorldPosition(tempV);
      
      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      tempV.project(camera);
      
      // ask the raycaster for all the objects that intersect
      // from the eye toward this object's position
      raycaster.setFromCamera(tempV, camera);
      const intersectedObjects = raycaster.intersectObjects(scene.children);
      // We're visible if the first intersection is this object.
      const show = intersectedObjects.length && sphere === intersectedObjects[0].object;
      
      if (!show || Math.abs(tempV.z) > 1) {
        // hide the label
        elem.style.display = 'none';
      } else {
        // un-hide the label
        elem.style.display = '';

        // convert the normalized position to CSS coordinates
        const x = (tempV.x *  .5 + .5) * canvas.clientWidth;
        const y = (tempV.y * -.5 + .5) * canvas.clientHeight;
        
        // move the elem to that position
        elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;    
      }
    });
    pickHelper.pick(pickPosition, scene, camera, time);

    renderer.render(scene, camera);
    
    requestAnimationFrame(render);
  }

  // helper functions
  function makeInstance(geometry, color, x, name) {
    const material = new THREE.MeshPhongMaterial({color});
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    sphere.position.x = x;

    const elem = document.createElement('div');
    const content = document.createElement('p');
    content.innerHTML = `Hi there!`;
    elem.appendChild(content);
    labelContainerElem.appendChild(elem);

    sphere.userData.clickable = true;
    
    return {sphere, elem};
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function rand(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + (max - min) * Math.random();
  }
    
  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
    x: (event.clientX - rect.left) * canvas.width  / rect.width,
    y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }
  
  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  }
  
  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    
    scene.add(star);
  }

  function moveCamera(camera, object) {
    //camera.position.x = object.position.x;
    camera.lookAt(object);
    // camera.position.z = object.position.z + 10;
    // for (let i = 0; i < 10; i++){
    //   camera.translateZ(-5);
    // }

    camera.position.set(object.position.x, object.position.y, object.position.z + 10);
  }

  requestAnimationFrame(render);

}

main();