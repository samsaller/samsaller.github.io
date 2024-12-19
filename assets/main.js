import * as THREE from "three";
import init from "./init.js";
import loading from "./loading.js";
import {
    GLTFLoader,
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
    Ready,
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
    Ready(stopLoadingAllowed, ()=>{
        tick()
        ambient.stop()
        setTimeout(() => {
            ambient.play()
        }, 1000);
    });
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
        loadingError.classList.add("red");
        loadingError.innerHTML = "Loading Error, see console";
    }, 500);
    cancelAnimationFrame(tickloop);
    console.error("There was an error loading " + url);
};

// ===================================

// const { scene, canvas, sizes, camera, renderer } = init();
const { scene, canvas, sizes, camera, controls, renderer } = init();
const clock = new THREE.Clock();
var delta = null;
var elapsedTime = null;
camera.position.z = 40;
camera.position.y = 10 * 10;

const MyHelper = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: alertColor })
);
// scene.add(MyHelper)

function myHelper(position) {
    MyHelper.position.set(position.x, position.y, position.z);
    console.log(MyHelper.position);
    scene.add(MyHelper);
}

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
    star.position.x =
        camera.position.x + (Math.random() * (distance * 2) - distance);
    star.position.y =
        camera.position.y + (Math.random() * (distance * 2) - distance);
    star.position.z =
        camera.position.z + (Math.random() * (distance * 2) - distance);
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

function addPoint(point, todo) {
    const pointConnector = new THREE.BoxGeometry(0.002, 0.002, 0.01);
    const pointMaterial = new THREE.MeshBasicMaterial({ color: mainColor });
    const pointMesh = new THREE.Mesh(pointConnector, pointMaterial);
    pointMesh.position.x = point.x;
    pointMesh.position.y = point.y;
    pointMesh.position.z = 0.055;
    todo(pointMesh);
}

const gltfLoader = new GLTFLoader(manager);

const loadModel = (modelName, todo) => {
    let realUrl = "./src/models/" + modelName + "/scene.gltf";
    gltfLoader.load(
        realUrl,
        (gltf) => {
            todo(gltf.scene);
            console.log('Successfully loaded "' + realUrl + '"', gltf);
        },
        (event) => {
            console.log('Loaded "' + realUrl + '"...');
        },
        (err) => {
            console.log('Loading "' + realUrl + '" error: ', err);
        }
    );
};

const audioLoader = new THREE.AudioLoader(manager);
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const audio = new THREE.Audio(audioListener);
const ambient = new THREE.Audio(audioListener);

audioLoader.load("./src/audios/neon.mp3", (data) => {
    audio.setBuffer(data);
    audio.stop()
    audio.setVolume(0.7);
});
audioLoader.load("./src/audios/ambient.mp3", (data) => {
    ambient.setBuffer(data);
    ambient.stop()
    ambient.setVolume(0.3);
});

let audioPlayed = false;
let glitchAllowed = false;
function defOffset(totalLength) {
    if (audioPlayed) {
        return 0;
    }
    return totalLength;
}
function startGlitch() {
    if (glitchAllowed) {
        strokeGroup.userData.update((stroke, strokeMaterial, totalLength) => {
            strokeMaterial.dashOffset =
                Math.floor(elapsedTime) % 3 == 0 && Math.floor(elapsedTime) != 0
                    ? playGlitch(totalLength)
                    : defOffset(totalLength);
        });
    }
}
function playGlitch(totalLength) {
    if (!audioPlayed) {
        audio.play();
        audioPlayed = true;
    }
    setTimeout(() => {
        glitchAllowed = false;
    }, 1100);
    return Math.round(Math.random() * 9) * totalLength;
}
//
// ===================================
//

//
// ============Main code==============
//

// const pointLight = new THREE.PointLight(0xffffff, 100);
// pointLight.position.set(3, 3, 3);
// scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLightTop = new THREE.DirectionalLight(0xffffff, 100);
const directionalLightHelperTop = new THREE.DirectionalLightHelper(
    directionalLightTop,
    10
);
directionalLightTop.position.set(-50, -50, -50);
directionalLightTop.rotation.z = Math.PI * -1.25;
directionalLightTop.rotation.x = Math.PI * 0.5;
directionalLightTop.rotation.y = Math.PI * 0.25;
scene.add(directionalLightTop);

const directionalLightDown = new THREE.DirectionalLight(0xffffff, 0.2);
const directionalLightHelperDown = new THREE.DirectionalLightHelper(
    directionalLightDown,
    10
);
directionalLightDown.rotation.x = Math.PI;
directionalLightDown.position.set(0, -20, 0);

scene.add(directionalLightDown);

const stars = new THREE.Group();
for (let i = 0; i < 1000; i++) {
    addSTar(100, stars);
}

scene.add(stars);

const cubeTextureLoader = new THREE.CubeTextureLoader(manager);
const ttfloader = new TTFLoader(manager);

const strokeGroup = new THREE.Group();
const templateMaterial = new LineMaterial({
    color: mainColor,
    dashed: true,
    linewidth: 1,
});

const samGroup = new THREE.Group();

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
    const textMaterial = new THREE.MeshPhysicalMaterial({
        roughness: 0.5,
        transmission: 1,
        transparent: true,
        thickness: 1,
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

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
    samGroup.add(textMesh);
    const shapes = font.generateShapes(message, 1);
    const pointsConnectorGroup = new THREE.Group();
    pointsConnectorGroup.scale.set(10, 10, 10);
    pointsConnectorGroup.position.x = centerOffsetX;
    pointsConnectorGroup.position.y = centerOffsetY;
    samGroup.add(pointsConnectorGroup);
    shapes.forEach((shape) => {
        let strokeMaterial = templateMaterial.clone();
        let points3d = [];
        let points = shape.getPoints();

        points.forEach((point, index) => {
            points3d.push(point.x, point.y, 0.12);
            addPoint(point, (pointConnectorMesh) => {
                pointsConnectorGroup.add(pointConnectorMesh);
            });
        });
        let pointsToLineGeometry = new LineGeometry().setPositions(points3d);
        let stroke = new Line2(pointsToLineGeometry, strokeMaterial);
        stroke.scale.set(10, 10, 10);
        if (shape.holes.length > 0) {
            shape.holes.forEach((hole) => {
                let holeMaterial = templateMaterial.clone();
                let holePoints3d = [];
                let holePoints = hole.getPoints();
                holePoints.forEach((point, index) => {
                    holePoints3d.push(point.x, point.y, 0.12);
                    addPoint(point, (pointConnectorMesh) => {
                        pointsConnectorGroup.add(pointConnectorMesh);
                    });
                });
                let holePointsToLineGeometry = new LineGeometry().setPositions(
                    holePoints3d
                );
                let holeStroke = new Line2(
                    holePointsToLineGeometry,
                    holeMaterial
                );
                holeStroke.computeLineDistances();
                let totalHoleLength = hole.getLength();
                holeMaterial.dashSize = totalHoleLength;
                holeMaterial.gapSize = totalHoleLength * 9;
                holeMaterial.dashOffset = totalHoleLength;

                holeStroke.userData.update = (todo) => {
                    todo(holeStroke, holeMaterial, totalHoleLength);
                };
                stroke.add(holeStroke);
            });
        }
        stroke.computeLineDistances();
        let totalLength = shape.getLength();
        strokeMaterial.dashSize = totalLength;
        strokeMaterial.gapSize = totalLength * 9;
        strokeMaterial.dashOffset = totalLength;
        stroke.userData.update = (todo) => {
            todo(stroke, strokeMaterial, totalLength);
            stroke.children.forEach((child) => {
                child.userData.update(todo);
            });
        };
        stroke.position.x = centerOffsetX;
        stroke.position.y = centerOffsetY;
        stroke.position.z = centerOffsetZ;
        strokeGroup.add(stroke);
    });
    // strokeGroup.translateOnAxis(new THREE.Vector3(centerOffsetX, centerOffsetY, centerOffsetZ), 1)

    strokeGroup.userData.update = (t) => {
        strokeGroup.children.forEach((child) => {
            child.userData.update(t);
        });
    };
    samGroup.add(strokeGroup);
});

function loadText(message, size = 5) {
    const textGroup = new THREE.Group();
    ttfloader.load("./src/fonts/Pacifico/Pacifico-Regular.ttf", (data) => {
        const font = new Font(data);
        const textGeometry = new TextGeometry(message, {
            font: font,
            size: size,
            depth: 0.5,
        });
        const textMaterial = new THREE.MeshStandardMaterial({
            // transmission: 1,
            transparent: true,
            color: "#ffffff",
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

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
        textGroup.add(textMesh);
    });
    return textGroup;
}

let satellite = new THREE.Group();

loadModel("space_satellite", (model) => {
    model.scale.set(10, 10, 10);
    model.position.y = -5;
    model.rotation.y = Math.PI / 2;
    satellite.add(model);
    scene.add(satellite);
});

const textIntro = loadText("Hi!");
textIntro.position.y = 10 * 10;
scene.add(textIntro);

const textIntro2 = loadText("Scroll down", 1);
textIntro2.position.y = 10 * 9;
scene.add(textIntro2);

const textIntro3 = loadText("Josh");
// scene.add(textIntro3);
samGroup.scale.set(0.5, 0.5, 0.5);
scene.add(samGroup);

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

const hemiGeo = new THREE.SphereGeometry(
    10,
    32,
    32,
    Math.PI,
    Math.PI,
    Math.PI,
    Math.PI
);
const hemiMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: false,
});
const hemiLight = new THREE.Mesh(hemiGeo, hemiMat);
hemiLight.rotation.y = Math.PI;
scene.add(hemiLight);

satellite.position.y = 50;
satellite.position.z = 100;
satellite.rotation.z = Math.PI * 0.5;
const tick = () => {
    delta = clock.getDelta();
    elapsedTime = clock.getElapsedTime();

    //

    moveStars(camera);

    samGroup.rotation.x = Math.sin(elapsedTime / 2) / 10;
    samGroup.rotation.y = Math.cos(elapsedTime / 2) / 10;
    textIntro2.position.y = 10 * 9.3 + Math.sin(elapsedTime * 5);
    camera.rotation.y = Math.PI * 2 * (camera.position.y / 100);
    startGlitch();

    satellite.rotation.x = elapsedTime;
    // satellite.rotation.y = elapsedTime
    // satellite.rotation.z = elapsedTime

    // controls.update();
    // samGroup.lookAt(camera.position)
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
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

// canvas.addEventListener("dblclick", (e) => {
//     document.fullscreenElement
//         ? document.exitFullscreen()
//         : canvas.requestFullscreen();
// });

let glitchAllowAllowed = true;
let camerastart = 100;
let camerafull = 0;
document.addEventListener("scroll", (e) => {
    let scrollY = window.scrollY;
    let scrollHeight = document.body.scrollHeight - window.innerHeight;
    camera.position.y =
        camerastart -
        ((((camerastart - camerafull) / 100) * scrollY) / scrollHeight) * 100;
    if (glitchAllowAllowed && camera.position.y < 5) {
        glitchAllowed = true;
        glitchAllowAllowed = false;
    }
});
