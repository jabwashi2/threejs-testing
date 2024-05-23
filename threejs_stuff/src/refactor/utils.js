// helper functions!

export const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
};

export const rand = (min, max) => {
    if (max === undefined) {
    max = min;
    min = 0;
    }
    return min + (max - min) * Math.random();
};

export const getCanvasRelativePosition = (event, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width  / rect.width,
        y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
};

export const setPickPosition = (event, canvas, position) => {
    const pos = getCanvasRelativePosition(event, canvas);
    position.x = (pos.x / canvas.width ) *  2 - 1;
    position.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
};

export const clearPickPosition = (pos) => {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pos.x = -100000;
    pos.y = -100000;
};

export const addStar = () => {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);

    scene.add(star);
};

export const showContent = (planet) => {
    if (planet.userData.name === 'gold'){
        console.log("You clicked gold!!");
        console.log(document.querySelector('#test-gold').style.opacity);
        document.querySelector('#test-gold').hidden = false;
        document.querySelector('#container').hidden = true;
    }
    if (planet.userData.name === 'green'){
        console.log("You clicked green!!");
        let page = document.querySelector('#test-green');
        page.hidden = false;
        document.querySelector('#container').hidden = true;
    }
    if (planet.userData.name === 'purple'){
        console.log("You clicked purple!!");
        document.querySelector('#test-purple').hidden = false;
        document.querySelector('#container').hidden = true;
    }
};

export const checkResize = (renderer, camera, aspect) => {
    // checking for the need to resize the canvas
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
}