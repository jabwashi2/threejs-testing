// scene setup etc.
import * as THREE from 'three';

export const createCamera = (fov, aspect, near, far, zPos) => {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = zPos;
    return camera;
};

export const createScene = (bgColor = null, texture = null) => {
    const scene = new THREE.Scene();
    if (bgColor){
        scene.background = bgColor;
    }

    if (texture){ 
        scene.background = texture;
    }

    return scene;
};

export const createPlanet = (geometry, color, x, name) => {
    const material = new THREE.MeshPhongMaterial({color});

    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.x = x;
    sphere.userData.clickable = true;
    sphere.userData.name = name;
    const elem = createElem();

    return {sphere, elem};
};

export const createLights = (color, intensity) => {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    return light;
}

export const updateSpheres = (spheres, _tempV, _raycast, _camera, _scene, _canvas) => {
    spheres.forEach((sphereInfo, ndx) => {
        const {sphere, elem} = sphereInfo;
  
        sphere.updateWorldMatrix(true, false);
        sphere.getWorldPosition(_tempV);
        
        _tempV.project(_camera);

        _raycast.setFromCamera(_tempV,  _camera);
        const intersectedObjects = _raycast.intersectObjects(_scene.children);
        const show = intersectedObjects.length && sphere === intersectedObjects[0].object;

        // un-hide the label
        elem.style.display = '';

        // convert the normalized position to CSS coordinates
        const x = (_tempV.x *  .5 + .5) * _canvas.clientWidth;
        const y = (_tempV.y * -.5 + .5) * _canvas.clientHeight;
        
        // move the elem to that position
        elem.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;    
    });
}

const createElem = () => {
    const labelContainerElem = document.querySelector('#labels');
    const elem = document.createElement('div');
    const content = document.createElement('p');
    content.innerHTML = `Hi there!`;
    elem.appendChild(content);
    labelContainerElem.appendChild(elem);
    return elem;
}

