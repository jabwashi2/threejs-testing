import * as THREE from 'three';

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }

  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }
  
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex(0xFF0000);
    }
  }
}

function main() {
    // cavnas setup
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    // mouse position handling
    const pickPosition = {x: 0, y: 0};
    clearPickPosition();

    // camera setup
    const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 30;

    // scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
 
    // put the camera on a pole (parent it to an object)
    // so we can spin the pole to move the camera around the scene
    const cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera);

    // box setup
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue
    // const cube = new THREE.Mesh(geometry, material);

    // scene.add(cube);
    renderer.render(scene, camera);

    // lighting
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);

    // more cubes!
    const cubes = [
        makeInstance(geometry, 0x44aa88,  0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844,  2),
    ];

    const numObjects = 100;
    for (let i = 0; i < numObjects; ++i) {
    const material = new THREE.MeshPhongMaterial({
        color: randomColor(),
    });
    
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
    cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
    cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
    }

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

    const pickHelper = new PickHelper();

    // rendering
    function render(time) {
        time *= 0.001;  // convert time to seconds

        // checking for the need to resize the canvas
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
 
        cubes.forEach((cube, ndx) => {
          const speed = 1 + ndx * .1;
          const rot = time * speed;
          cube.rotation.x = rot;
          cube.rotation.y = rot;
        });

        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();

        pickHelper.pick(pickPosition, scene, camera, time);

        // spinning the camera pole
        cameraPole.rotation.y = time * .1;

        renderer.render(scene, camera);
       
        requestAnimationFrame(render);
    }

    // helper functions
    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color});
       
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
       
        cube.position.x = x;
       
        return cube;
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
       
    function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
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

    requestAnimationFrame(render);

}

main();