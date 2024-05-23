// npx vite

import * as THREE from 'three';
// import * as ThreeDom from '../src/threex.domevents'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

// creating the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// cube stuff
let left = false;
let right = true;
let shrink = true;
let grow = false;

let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let material = new THREE.MeshBasicMaterial( { color: 0x00ffa2 } );
let cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// camera things
camera.position.z = 5;
const controls = new OrbitControls(camera, renderer.domElement);
// controls.minDistance = 1;
// controls.maxDistance = 1000;

// mouse things
let mousePos = { x: undefined, y: undefined };
window.addEventListener('mouseenter', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
    //console.log(mousePos)
})
// end mouse


function animate() {

    // bouncing
    // if(right){
    //     cube.position.x += 0.01;
    //     if(cube.position.x >= 5 && right){
    //         right = false;
    //         left = true;
    //     }
    // }
    // if(left){
    //     cube.position.x -= 0.01;
    //     if(cube.position.x <= -5 && left){
    //         right = true;
    //         left = false;
    //     }
    // }

    //rotating
    //cube.rotation.x += 0.01;
    cube.rotation.y += 0.005;

    // scaling
    // if(shrink){
    //     cube.scale.x -= 0.01;
    //     cube.scale.y = cube.scale.z = cube.scale.x;
    //     if (cube.scale.x <= .04 && shrink){
    //         shrink = false;
    //         grow = true;
    //     }
    // }
    // if(grow){
    //     cube.scale.x += 0.01;
    //     cube.scale.y = cube.scale.z = cube.scale.x;
    //     if(cube.scale.x >= 1 && grow){
    //         grow = false;
    //         shrink = true;
    //     }
    // }

    //console.log(cube.position);
    controls.update();

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







// no man's land

/*class Cube {
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

        //this.START_SCALE = this.scale.x;

        let cube = new THREE.Mesh( this.geometry, this.material );

        this.position = this.cube.position;
        this.scale = this.cube.scale;
        this.rotation = this.cube.rotation;

        console.log(`this.cube.scale: ${this.cube.position}`)

        return cube;
    }


    // helper functions
    scaleCube(){
        if(this.shrink){
            this.scale.x -= 0.01;
            this.scale.y = this.scale.z = this.scale.x;
            if (this.scale.x <= .04 && this.shrink){
                this.shrink = false;
                this.grow = true;
            }
        }
        if(this.grow){
            this.scale.x += 0.01;
            this.scale.y = this.scale.z = this.scale.x;
            if(this.scale.x >= this.START_SCALE && this.grow){
                this.grow = false;
                this.shrink = true;
            }
        }
    }
    bounceCube(){
        if(this.right){
            //this.position.x += 0.01;

            if(this.position.x >= 5 && this.right){
                this.right = false;
                this.left = true;
            }
        }
        if(this.left){
            //this.position.x -= 0.01;

            if(this.position.x <= -5 && this.left){
                this.right = true;
                this.left = false;
            }
        }
    }
    rotateCube(){
        this.rotation.x += 0.01;
        this.rotation.y += 0.01;
    }
}
*/

// let cubeArray = [];
// cubeArray.push( new Cube(1, .7, 1, 0x00ffa2));

//let myCube = 
// cube.addEventListener('mousemove', (event) => {
//     let text = document.createElement("a-entity");
//     text.setAttribute("id", "sample-text");
//     text.setAttribute("text", "text: sample");
//     text.setAttribute("position", "-25 15 -15");
//     text.setAttribute("rotation", "0 45 0");
//     text.setAttribute("scale", "1 1 1");
//     scene.appendChild(text);
// })