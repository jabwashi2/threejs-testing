// class for object picking
import * as THREE from 'three';

export class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
  
    pick(normalizedPosition, scene, camera) {
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