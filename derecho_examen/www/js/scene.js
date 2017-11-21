(function() {
    //Creamos la escena que contendra todo.
    var Scene = new THREE.Scene();
    Scene.background = new THREE.Color(0xeeeeee);
    //Es el aspecto que tendra nuestra camara usada en la escena, es usada al declarar la camara.
    var Aspectratio = window.innerWidth / window.innerHeight;
    //Creamos nuestra camara para poder visualizar las primitivas.
    var Camera = new THREE.PerspectiveCamera(75, Aspectratio, 1, 100);
    //Se crea el renderer el cual junto con la escena y la camara nos permiten visualizar lo que agreguemos a la escena.
    var renderer = new THREE.WebGLRenderer();
    //Al renderer le asignamos un tamaño el cual sera renderizado, en este caso toda la pantalla.
    renderer.setSize(window.innerWidth, window.innerHeight);
    //Se agrega el renderer a el documento html, el cual es un "canvas" para poder mostrar la escena que creamos. 
    document.body.appendChild(renderer.domElement);

    //Primer Primitiva: Cubo    
    //Geomtery es la variable que contiene la geometria de la primitiva a dibujar
    var Geometry1 = new THREE.BoxGeometry(15, 15, 15);
    //Material toma de un objeto las propiedades que seran aplicadas a la geometria.
    var Material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //Mesh es ub objeto el cual requiere de una Geometria a la cual le aplicara el Material declarado anteriormente.
    var Cube = new THREE.Mesh(Geometry1, Material1);
    //se le asigna una posicion a el cubo en la escena
    Cube.position.x = -25;
    Cube.position.y = 5;
    Cube.position.z = -10;
    //se añade la primitiva a la escena para que sea mostrada.
    Scene.add(Cube);

    //Segunda Primitiva: Pramide    
    /*usamos un cono para poder dibujar la piramide, solo cambiamos el numero de caras que estaran 
    alrededor de la circunferencia del cono*/
    var geometry = new THREE.ConeGeometry(15, 5, 4);
    //wireframe es para poder ver las lineas que componen a la piramide.
    var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    var cone = new THREE.Mesh(geometry, material);
    //le damos una posicion dentro de la escena.
    cone.position.x = 20;
    cone.position.y = 25;
    Scene.add(cone);

    //Tercer Primitiva: Toroide
    var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    var torus = new THREE.Mesh(geometry, material);
    //posicion del toroide en la escena.
    torus.position.x = 5;
    torus.position.z = 5;
    Scene.add(torus);
    //posicion de la camara para poder visualizar las primitivas
    Camera.position.z = 60;
    Camera.position.y = 10;

    function animate() {
        //Se crea un ciclo infinito el cual dibujara 60 veces por segundo la escena y lo que contenga.
        requestAnimationFrame(animate);
        renderer.render(Scene, Camera);
        //se les da una rotatacion a cada primitiva que fue agregada en la escena.
        Cube.rotation.y += 0.01;
        cone.rotation.z += 0.01;
        torus.rotation.x += 0.1;
    }
    // se le manda llamar a la funcion animate para que se este redibujando la escena. 
    animate();

    let planeGeometry = new THREE.PlaneGeometry(200, 900);
    //makeRotatiion es para que el plano se redibuje una y otra vez.
    planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    let groundMaterial = new THREE.MeshPhongMaterial({
        color: 0xfffffff
    });
    let plane = new THREE.Mesh(planeGeometry, groundMaterial);
    plane.receiveShadow = true;


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

})();