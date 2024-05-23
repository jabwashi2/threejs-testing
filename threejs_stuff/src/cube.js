import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();

/* 
// npx vite

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

class Cube {
    constructor(width=1, height=1, depth=1, color=0x00ffa2){
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.color = color;

        this.left = false;
        this.right = true;
        this.shrink = true;
        this.grow = false;

        this.geometry = new THREE.BoxGeometry( this.width, this.height, this.depth );
        this.material = new THREE.MeshBasicMaterial( { color: this.color } );
        
        // this.position = this.createCube.position;
        // this.scale = this.createCube.scale;
        // this.rotation = this.createCube.rotation;
    }


    // helper functions
    createCube(){
        let cube = new THREE.Mesh( this.geometry, this.material );
        scene.add(cube);
        return cube;
    }
    scaleCube(scale){
        if(this.shrink){
            scale.x -= 0.01;
            scale.y = scale.z = scale.x;
            if (scale.x <= .04 && this.shrink){
                this.shrink = false;
                this.grow = true;
            }
        }
        if(this.grow){
            scale.x += 0.01;
            scale.y = scale.z = scale.x;
            if(scale.x >= 1 && this.grow){
                this.grow = false;
                this.shrink = true;
            }
        }
    }
    bounceCube(position){
        if(this.right){
            //this.position.x += 0.01;

            if(position.x >= 5 && this.right){
                this.right = false;
                this.left = true;
            }
        }
        if(this.left){
            //this.position.x -= 0.01;

            if(position.x <= -5 && this.left){
                this.right = true;
                this.left = false;
            }
        }
    }
    rotateCube(rotation){
        rotation.x += 0.01;
        rotation.y += 0.01;
    }
}

// mouse things
let mousePos = { x: undefined, y: undefined };
window.addEventListener('mousemove', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
})
// end mouse

let cubeArray = [];
cubeArray.push( new Cube(1, .7, 1, 0x00ffa2));

// creating the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// cube stuff
camera.position.z = 5;

function animate() {
    for (let c of cubeArray){
        c.bounceCube(c.createCube().position);
        //c.scaleCube();
        //c.rotateCube();
    }

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

// webgl check
if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}

*/