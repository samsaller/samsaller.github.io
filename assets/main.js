import * as THREE from "three";
import init from "./init.js";
import loading from "./loading.js";
import {
    LineGeometry,
    LineMaterial,
    TextGeometry,
    TTFLoader,
} from "three/examples/jsm/Addons.js";
import { Font } from "three/examples/jsm/Addons.js";
import { Line2 } from "three/addons/lines/Line2.js";

// ========Manager and loading========

var mainColor = window
    .getComputedStyle(document.body)
    .getPropertyValue("--main-color");
var gradient1Color = window
    .getComputedStyle(document.body)
    .getPropertyValue("--gradient1-color");
var gradient2Color = window
    .getComputedStyle(document.body)
    .getPropertyValue("--gradient2-color");
var gradient3Color = window
    .getComputedStyle(document.body)
    .getPropertyValue("--gradient3-color");
var gradient4Color = window
    .getComputedStyle(document.body)
    .getPropertyValue("--gradient4-color");
var alertColor = window
    .getComputedStyle(document.body)
    .getPropertyValue("--alert-color");

let {
    percentageSet,
    stopLoading,
    loadingError,
    loadingPercentage,
    loadingErrorSet,
} = loading();
let stopLoadingAllowed = true;
let percentageAllowed = true;
const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    let percentage = Math.floor((itemsLoaded / itemsTotal) * 100);
    if (percentageAllowed) {
        console.log(percentage + "%");
        loadingPercentage.innerHTML = `${percentage}%`;
        percentageSet(percentage);
    }
};

manager.onLoad = function () {
    console.log("Loading complete!");
    tick();
    setTimeout(() => {
        stopLoading(stopLoadingAllowed);
    }, 500);
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    let percentage = Math.floor((itemsLoaded / itemsTotal) * 100);
    if (percentageAllowed) {
        console.log(percentage + "%");
        percentageSet(percentage);
    }
};

manager.onError = function (url) {
    stopLoadingAllowed = false;
    percentageAllowed = false;
    setTimeout(() => {
        loadingPercentage.classList.add("red");
        loadingError.innerHTML = "Loading Error, see console";
    }, 500);
    cancelAnimationFrame(tickloop);
    console.error("There was an error loading " + url);
};

// ===================================

const { scene, canvas, sizes, camera, renderer, controls } = init();
const clock = new THREE.Clock();
var delta = null;
var elapsedTime = null;

//
// ============Functions==============
//
function addSTar(distance = 50, group, color = gradient4Color) {
    const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: color })
    );
    star.relativePosition = new THREE.Vector3();
    star.relativeDistance = distance;
    star.position.x = Math.random() * (distance * 2) - distance;
    star.position.y = Math.random() * (distance * 2) - distance;
    star.position.z = Math.random() * (distance * 2) - distance;
    star.speed = Math.random() * 20;
    group.add(star);
}
function moveStars(object) {
    stars.children.forEach((star, index) => {
        let toRelativeX = star.position.x - object.position.x;
        let toRelativeY = star.position.y - object.position.y;
        let toRelativeZ = star.position.z - object.position.z;
        let relativeDistance = star.relativeDistance;
        if (toRelativeX > relativeDistance) {
            star.position.x =
                object.position.x +
                (Math.random() * (relativeDistance / 5) - relativeDistance);
            star.position.y =
                object.position.y +
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.z =
                object.position.z +
                (Math.random() * (relativeDistance * 2) - relativeDistance);
        }
        if (toRelativeX < -relativeDistance) {
            star.position.x =
                object.position.x -
                (Math.random() * (relativeDistance / 5) - relativeDistance);
            star.position.y =
                object.position.y -
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.z =
                object.position.z -
                (Math.random() * (relativeDistance * 2) - relativeDistance);
        }
        if (toRelativeZ > relativeDistance) {
            star.position.x =
                object.position.x +
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.y =
                object.position.y +
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.z =
                object.position.z +
                (Math.random() * (relativeDistance / 5) - relativeDistance);
        }
        if (toRelativeZ < -relativeDistance) {
            star.position.x =
                object.position.x -
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.y =
                object.position.y -
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.z =
                object.position.z -
                (Math.random() * (relativeDistance / 5) - relativeDistance);
        }
        if (toRelativeY > relativeDistance) {
            star.position.x =
                object.position.x +
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.y =
                object.position.y +
                (Math.random() * (relativeDistance / 5) - relativeDistance);
            star.position.z =
                object.position.z +
                (Math.random() * (relativeDistance * 2) - relativeDistance);
        }
        if (toRelativeY < -relativeDistance) {
            star.position.x =
                object.position.x -
                (Math.random() * (relativeDistance * 2) - relativeDistance);
            star.position.y =
                object.position.y -
                (Math.random() * (relativeDistance / 5) - relativeDistance);
            star.position.z =
                object.position.z -
                (Math.random() * (relativeDistance * 2) - relativeDistance);
        }
        star.position.x += delta * star.speed;
        // camera.rotation.y += delta*0.01;
    });
}
//
// ===================================
//

//
// ============Main code==============
//
camera.position.z = 40;
const geometry = new THREE.OctahedronGeometry(10);
const material = new THREE.MeshStandardMaterial({ color: mainColor });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// const pointLight = new THREE.PointLight(0xffffff, 100);
// pointLight.position.set(3, 3, 3);
// scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLightTop = new THREE.DirectionalLight(0xffffff, 2);
const directionalLightHelperTop = new THREE.DirectionalLightHelper(
    directionalLightTop,
    10
);
directionalLightTop.position.set(10, 10, 0);
directionalLightTop.rotation.z = Math.PI * -0.25;
directionalLightTop.rotation.x = Math.PI * 0.25;
scene.add(directionalLightTop);

const directionalLightDown = new THREE.DirectionalLight(0xffffff, 0.2);
const directionalLightHelperDown = new THREE.DirectionalLightHelper(
    directionalLightDown,
    10
);
directionalLightDown.rotation.x = Math.PI;
directionalLightDown.position.set(0, -10, 0);

scene.add(directionalLightDown);

const stars = new THREE.Group();
for (let i = 0; i < 400; i++) {
    addSTar(100, stars);
}

scene.add(stars);

const cubeTextureLoader = new THREE.CubeTextureLoader(manager);
const ttfloader = new TTFLoader(manager);

const strokeGroup = new THREE.Group();
const strokeMaterial = new LineMaterial({
    color: 0xffffff,
    dashed: true,
	linewidth: 3,
    dashSize: 0.1,
    gapSize: 0.1,
    dashOffset: 0.0
});

ttfloader.load("./src/fonts/ChakraPetch/ChakraPetch-Medium.ttf", (data) => {
    const font = new Font(data);
    const message = "Sam";
    const textGeometry = new TextGeometry(message, {
        font: font,
        size: 10,
        depth: 1,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5,
    });
    const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshPhongMaterial({ color: mainColor })
    );
    textGeometry.computeBoundingBox();
    const centerOffsetX =
        -0.5 *
        (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
    const centerOffsetY =
        -0.5 *
        (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y);
    const centerOffsetZ =
        -0.5 *
        (textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z);
    textMesh.position.x = centerOffsetX;
    textMesh.position.y = centerOffsetY;
    textMesh.position.z = centerOffsetZ;
    scene.add(textMesh);
    const shapes = font.generateShapes(message, 1);
    shapes.forEach((shape) => {

        let points3d = [];
        let points = shape.getPoints();
        points.forEach((point, index) => {
            points3d.push(point.x, point.y, 0.11);
        });
        let pointsToLineGeometry = new LineGeometry().setPositions(points3d);
        let stroke = new Line2(pointsToLineGeometry, strokeMaterial);
        stroke.scale.set(10, 10, 10);
        if (shape.holes.length > 0) {
            shape.holes.forEach((hole) => {
                let holePoints3d = [];
                let holePoints = hole.getPoints();
                holePoints.forEach((point, index) => {
                    holePoints3d.push(point.x, point.y, 0.11);
                });
                let holePointsToLineGeometry = new LineGeometry().setPositions(
                    holePoints3d
                );
                let holeStroke = new Line2(
                    holePointsToLineGeometry,
                    strokeMaterial
                );
                holeStroke.computeLineDistances()
                stroke.add(holeStroke);
            });
        }
        stroke.computeLineDistances()
        strokeGroup.add(stroke);
        strokeGroup.userData.update = (t)=>{
            strokeMaterial.dashOffset = t*0.1
        }
        // points.forEach((point, index) => {
        //     points3d.push(new THREE.Vector3(point.x, point.y, 0.11));
        // });
        // let pointsToGeometry = new THREE.BufferGeometry().setFromPoints(
        //     points3d
        // );
        // let stroke = new THREE.Line(pointsToGeometry, strokeMaterial);
        // strokeGroup.add(stroke);
        // stroke.scale.set(10, 10, 10);
        // if (shape.holes.length > 0) {
        //     shape.holes.forEach((hole) => {
        //         let holePoints3d = [];
        //         let holePoints = hole.getPoints();
        //         holePoints.forEach((holePoint, index) => {
        //             holePoints3d.push(
        //                 new THREE.Vector3(holePoint.x, holePoint.y, 0.11)
        //             );
        //         });
        //         let holePointsToGeometry =
        //             new THREE.BufferGeometry().setFromPoints(holePoints3d);
        //         let holestroke = new THREE.Line(
        //             holePointsToGeometry,
        //             strokeMaterial
        //         );
        //         strokeGroup.add(holestroke);
        //         holestroke.scale.set(10, 10, 10);
        //     });
        // }
    });
    strokeGroup.position.x = centerOffsetX;
    strokeGroup.position.y = centerOffsetY;
    strokeGroup.position.z = centerOffsetZ;
    scene.add(strokeGroup);
});
mesh.visible = false;
const spaceTexture = cubeTextureLoader.setPath("./src/imgs/space/").load(
    ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
    (event) => {
        console.log("Space loaded");
    },
    (progress) => {
        console.log("Space loading");
    },
    (error) => {
        console.error("Space loading error");
        console.error(error);
    }
);
scene.background = spaceTexture;

//
// ===================================
//

let tickloop;

const tick = (timestamp=0) => {
    delta = clock.getDelta();
    elapsedTime = clock.getElapsedTime();

    //
    mesh.rotation.x += delta + delta - 0.01;
    mesh.rotation.y += delta + delta;
    mesh.rotation.z += delta + delta - 0.03;
    moveStars(camera);
    strokeGroup.userData.update(elapsedTime)
    //

    controls.update();
    renderer.render(scene, camera);
    tickloop = window.requestAnimationFrame(tick);
};


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

//
// Uncomment code below to enable double click full screen
//

canvas.addEventListener("dblclick", (e) => {
    document.fullscreenElement
        ? document.exitFullscreen()
        : canvas.requestFullscreen();
});
