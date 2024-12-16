import * as THREE from "three";
import init from "./init.js";
import stopLoading from "./loading.js";


const { scene, canvas, sizes, camera, renderer, controls } = init();

const clock = new THREE.Clock();
var delta = null;
var elapsedTime = null;

const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(
        "Started loading file: " +
            url +
            ".\nLoaded " +
            itemsLoaded +
            " of " +
            itemsTotal +
            " files."
    );
};

manager.onLoad = function () {
    console.log("Loading complete!");
    stopLoading();
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(
        "Loading file: " +
            url +
            ".\nLoaded " +
            itemsLoaded +
            " of " +
            itemsTotal +
            " files."
    );
};

manager.onError = function (url) {
    console.log("There was an error loading " + url);
};
//
// ============Functions==============
//
function addSTar() {
    const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    star.position.x = Math.random() * 100 - 50;
    star.position.y = Math.random() * 100 - 50;
    star.position.z = Math.random() * 100 - 50;
    stars.add(star);
}
//
// ===================================
//

//
// ============Main code==============
//
camera.position.z = 30;
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const mesh = new THREE.Mesh(geometry, material);

const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.set(3, 3, 3);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

scene.add(mesh);

const stars = new THREE.Group();
for (let i = 0; i < 200; i++) {
    addSTar();
}
scene.add(stars);

const cubeTextureLoader = new THREE.CubeTextureLoader(manager);

const spaceTexture = cubeTextureLoader.setPath("./src/imgs/space/").load(
    ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    (event) => {
        console.log("Space loaded");
    },
    (progress) => {
        console.log("Space loading");
    },
    (error) => {
        console.log("Space loading error");
        console.log(error);
    }
);
scene.background = spaceTexture;

//
// ===================================
//

const tick = () => {
    delta = clock.getDelta();
    elapsedTime = clock.getElapsedTime();

    //
    mesh.rotation.x += delta;
    mesh.rotation.y += delta / 2;
    mesh.rotation.z += delta;
    //

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();
console.log("Sucessful ticks starting");

window.addEventListener("resize", (e) => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

// const rayCaster = new THREE.Raycaster();
// const handleClick = (e) => {
//     const pointer = new THREE.Vector2();

//     pointer.x = (e.clientX / sizes.width) * 2 - 1;
//     pointer.y = -((e.clientY / sizes.height) * 2 - 1);

//     rayCaster.setFromCamera(pointer, camera);
//     const intersections = rayCaster.intersectObjects(scene.children);

// };

// canvas.addEventListener("click", handleClick);
