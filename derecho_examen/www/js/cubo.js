//textura de cubo
var Cube;
let loader = new THREE.TextureLoader()
loader.load('public/wall.jpg', function(texture) {
    var Geometry1 = new THREE.BoxGeometry(15, 15, 15);
    let Material1 = new THREE.MeshBasicMaterial({ map: texture })
    Cube = new THREE.Mesh(Geometry1, Material1);
    Cube.position.x = -25;
    Cube.position.y = 5;
    Cube.position.z = -10;
    //se añade la primitiva a la escena para que sea mostrada.
    Scene.add(Cube)
})


//textura de piramide
var cone;
let loader = new THREE.TextureLoader()
loader.load('public/wall.jpg', function(texture) {
        var geometry = new THREE.ConeGeometry(15, 5, 4);
        var material = new THREE.MeshBasicMaterial({
            map: texture
        })
        cone = new THREE.Mesh(geometry, material);
        cone.position.x = 20;
        cone.position.y = 25;
        Scene.add(cone);
    })
    //



// textura de donda
var torus;
let loader = new THREE.TextureLoader()
loader.load('public/wall.jpg', function(texture) {
        var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        var material = new THREE.MeshBasicMaterial({
            map: texture
        })
        var torus = new THREE.Mesh(geometry, material);
        torus.position.x = 5;
        torus.position.z = 5;
        Scene.add(torus);
    })
    //

var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var torus = new THREE.Mesh(geometry, material);
//posicion del toroide en la escena.
torus.position.x = 5;
torus.position.z = 5;
Scene.add(torus);



// funcion para las teclas para que cambien las texturas
document.body.onkeypress = function(e) {
    //la variable q cambiara segun la tecla que se presione
    var x = e.keycode
        //la textura que se pondra cuando se presione las teclas
    texture = new THREE.TextureLoader().load('public/wall.jpg');
    //si se presiona la letra "a" cambiara la textura del cubo
    if (x === 97) {
        Cube.Material1 = new THREE.MeshBasicMaterial({ map: texture });
    }
    //si se presiona la tecla "s" cambiara la textura de la piramide
    if (x === 115) {
        cone.material = new THREE.MeshBasicMaterial({ map: texture });
    }
    //si se presiona la tecla "d" cambiara la textura de la dona
    if (x === 100) {
        torus.material = new THREE.MeshBasicMaterial({ map: texture });
    }
}