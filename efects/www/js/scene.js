var scene;
var camera;
var startTexture;

var cubemesh;

var num = 32;

var star = new Array(num);
var spin = 0;

initializeScene();

animateScene();

function initializeScene() {
    webGLAvailable = false;
    //if (Detector.webGL) {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    webGLAvailable = true;
    //} else {
    renderer = new THREE.CanvasRenderer();
    renderer.setClearColorHex(0x000000, 1);
    //}
    canvasWidht = window.innerWidth - 10;
    canvasHeight = window.innerHeight - 20;

    renderer.setSize(canvasWidht, canvasHeight);

    document.getElementById("WebGLCanvas").appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvasWidht / canvasHeight, 1, 100);
    camera.position.set(0, 0, 15);
    camera.lookAt(scene.position); //pone en perspectiva la camara con respecto a la escena que estas visualizando
    camera.add(camera);

    startTexture = new THREE.ImageUtils.loadTexture("public/img/Star.jpg");
    //la promesa es sincrona
    for (i = 0; i < num; i++) {
        var squareGeometry = new THREE.Geometry();
        squareGeometry.vertices.push(new THREE.Vector3(-1, -1, 0));
        squareGeometry.vertices.push(new THREE.Vector3(1, -1, 0));
        squareGeometry.vertices.push(new THREE.Vector3(1, 1, 0));
        squareGeometry.vertices.push(new THREE.Vector3(-1, 1, 0));
        squareGeometry.faces.push(new THREE.Face4(0, 1, 2, 3));
        squareGeometry.faceVertexUvs[0].push([
            new THREE.UV(0.0, 0.0),
            new THREE.UV(1.0, 0.0),
            new THREE.UV(1.0, 1.0),
            new THREE.UV(0.0, 1.0)
        ]);

        var squareMaterial = new THREE.MeshBasicMaterial({
            map: startTexture,
            transparent: true,
            combine: THREE.MixOperation,
            blending: THREE.AdditiveBlemnding,
            color: 0xFFFFFF
        });

        var squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
        squareMesh.position.set(0.0, 0.0, 0.0);
        scene.add(squareMesh);

        star[i] = new Object();
        star[i].angle = 0.0;
        star[i].r = Math.random();
        star[i].g = Math.random();
        star[i].b = Math.random();
        star[i].mesh = squareMesh;
    }

    function animateScene() {
        requestAnimationFrame(animateScene);

        for (i = 0; i < num; i++) {
            spin += Math.PI * 2 / num;

            if (spin > (Math.PI * 2)) {
                spin = 0;
                star[i].angle += 1 / num;
                star[i].dist -= 0.01;
                if (star[i].dist < 0.0) {
                    star[i].dist += 0.5;

                    star[i].r = Math.random();
                    star[i].g = Math.random();
                    star[i].b = Math.random();
                }
            }

            star[i].mesh.matrix.setPosition(new THREE.Vector3(satr[i].dist, 0, 0));
            var mr = new THREE.Matrix4();
            mr.makeRotationZ();
            star[i].mesh.applyMatrix(mr);

            star[i].mesh.material.color.setRGB(star[i].r, star[i].g, star[i].b);
        }
        renderScene();
    }

}

function renderScene() {
    renderer.render(scene, camera);
}