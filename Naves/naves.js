/**
 * Inicializar el juego y comenzarlo.
 */
var game = new Game();

function init() {
    game.init();
}


/**
 * Definir un objeto para mantener todas nuestras imágenes para el juego para imágenes
 * sólo se han creado una vez. Este tipo de objeto se conoce como un Singleton.
 */
var imageRepository = new function() {
    // Define images
    this.background = new Image();
    this.spaceship = new Image();
    this.bullet = new Image();
    this.enemy = new Image();
    this.enemyBullet = new Image();

    // Asegúrese de que todas las imágenes han cargado antes de iniciar el juego
    var numImages = 5;
    var numLoaded = 0;

    function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
            window.init();
        }
    }
    this.background.onload = function() {
        imageLoaded();
    }
    this.spaceship.onload = function() {
        imageLoaded();
    }
    this.bullet.onload = function() {
        imageLoaded();
    }
    this.enemy.onload = function() {
        imageLoaded();
    }
    this.enemyBullet.onload = function() {
            imageLoaded();
        }
        // Definir imágenes src
    this.background.src = "imgs/space.jpg";
    this.spaceship.src = "imgs/capsula-espacial.png";
    this.bullet.src = "imgs/bullet.png";
    this.enemy.src = "imgs/ovni.png";
    this.enemyBullet.src = "imgs/bullet_enemy.png";
}

/**
 * Crea el objeto dibujable que será la clase base para
 * todos los objetos dibujables en el juego. Configura variables defualt
 * que todos los objetos secundarios van a heredar, así como el defualt funciones.
 */
function Drawable() {
    this.init = function(x, y, width, height) {
        // Variables Default
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    this.speed = 20;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.collidableWith = "";
    this.isColliding = false;
    this.type = "";

    // Definir la función abstracta que se implementará en objetos secundarios
    this.draw = function() {};
    this.move = function() {};
    this.isCollidableWith = function(object) {
        return (this.collidableWith === object.type);
    };
}

/*
 * Crea el objeto de fondo que se convertirá en un hijo de
 * el objeto dibujable. El fondo se dibuja en el "fondo"
 * Canvas y crea la ilusión de moverse por la panorámica de la imagen.
 */
function Background() {
    // Redefina la velocidad del fondo para paneo

    // Implementar la función abstracta
    this.draw = function() {
        // Fondo de pan
        this.y += this.speed;
        this.context.drawImage(imageRepository.background, this.x, this.y);

        // Dibuje otra imagen en el borde superior de la primera imagen
        this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);

        // Si la imagen se desplaza fuera de la pantalla, reinicie
        if (this.y >= this.canvasHeight)
            this.y = 0;
    };
}
// Establecer fondo para heredar propiedades de dibujable
Background.prototype = new Drawable();
/**
 * Crea el objeto Bullet que el buque dispara. Las balas son
 * dibujado en el lienzo "Main".
 */
function Bullet(object) {
    this.alive = false; // Es true si la viñeta está actualmente en uso
    var self = object;
    /*
     * Establece los valores de viñeta
     */
    this.spawn = function(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
    };

    /*
     * Utiliza un "drity rectangle" para borrar la viñeta y la mueve.
     * Devuelve true si la bala se movió de la pantalla, lo que indica que
     * la bala está lista para ser despejada por la piscina, de lo contrario dibuja
     * la bala.
     */
    this.draw = function() {
        this.context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
        this.y -= this.speed;

        if (this.isColliding) {
            return true;
        } else if (self === "bullet" && this.y <= 0 - this.height) {
            return true;
        } else if (self === "enemyBullet" && this.y >= this.canvasHeight) {
            return true;
        } else {
            if (self === "bullet") {
                this.context.drawImage(imageRepository.bullet, this.x, this.y);
            } else if (self === "enemyBullet") {
                this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
            }

            return false;
        }
    };

    /*
     * Restablece los valores de viñeta
     */
    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
Bullet.prototype = new Drawable();

/**
 * Objeto QuadTree.
 *
 * Los índices del cuadrante se numeran como abajo:
 *     |
 *  1  |  0
 * ----+----
 *  2  |  3
 *     |
 */
function QuadTree(boundBox, lvl) {
    var maxObjects = 10;
    this.bounds = boundBox || {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };
    var objects = [];
    this.nodes = [];
    var level = lvl || 0;
    var maxLevels = 5;

    /*
     * Borra el quadTree y todos los nodos de los objetos
     */
    this.clear = function() {
        objects = [];

        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].clear();
        }

        this.nodes = [];
    };

    /*
     * Obtener todos los objetos en el quadTree
     */

    this.getAllObjects = function(returnedObjects) {
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].getAllObjects(returnedObjects);
        }

        for (var i = 0, len = objects.length; i < len; i++) {
            returnedObjects.push(objects[i]);
        }

        return returnedObjects;
    };

    /*
     * Devolver todos los objetos que el objeto podría chocar con
     */

    this.findObjects = function(returnedObjects, obj) {
        if (typeof obj === "undefined") {
            console.log("UNDEFINED OBJECT");
            return;
        }

        var index = this.getIndex(obj);
        if (index != -1 && this.nodes.length) {
            this.nodes[index].findObjects(returnedObjects, obj);
        }

        for (var i = 0, len = objects.length; i < len; i++) {
            returnedObjects.push(objects[i]);
        }

        return returnedObjects;
    };

    /*
     * Inserte el objeto en el quadTree. Si el árbol
     * excede la capacidad, se dividirá y añadirá todo
     * objetos a sus nodos correspondientes.
     */

    this.insert = function(obj) {
        if (typeof obj === "undefined") {
            return;
        }

        if (obj instanceof Array) {
            for (var i = 0, len = obj.length; i < len; i++) {
                this.insert(obj[i]);
            }

            return;
        }

        if (this.nodes.length) {
            var index = this.getIndex(obj);
            //Sólo agregue el objeto a un subnodo si puede encajar completamente
            //dentro de un
            if (index != -1) {
                this.nodes[index].insert(obj);

                return;
            }
        }

        objects.push(obj);

        // Impedir la división infinita
        if (objects.length > maxObjects && level < maxLevels) {
            if (this.nodes[0] == null) {
                this.split();
            }

            var i = 0;
            while (i < objects.length) {

                var index = this.getIndex(objects[i]);
                if (index != -1) {
                    this.nodes[index].insert((objects.splice(i, 1))[0]);
                } else {
                    i++;
                }
            }
        }
    };

    /*
     * Determine a qué nodo pertenece el objeto. -1 significa
     * el objeto no puede encajar completamente dentro de un nodo y es parte
     * del nodo actual
     */

    this.getIndex = function(obj) {

        var index = -1;
        var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
        var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

        // El objeto puede caber completamente dentro del cuadrante superior
        var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
        // El objeto puede caber totalmente dentro del quandrant inferior
        var bottomQuadrant = (obj.y > horizontalMidpoint);

        // El objeto puede caber completamente dentro de los cuadrantes izquierdos
        if (obj.x < verticalMidpoint &&
            obj.x + obj.width < verticalMidpoint) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }
        }
        // El objeto puede fijar totalmente dentro del quandrants derecho
        else if (obj.x > verticalMidpoint) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;
    };

    /*
     * Divide el nodo en 4 subnodos
     */

    this.split = function() {
        // Bitwise or [html5rocks]
        var subWidth = (this.bounds.width / 2) | 0;
        var subHeight = (this.bounds.height / 2) | 0;

        this.nodes[0] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, level + 1);
        this.nodes[1] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y,
            width: subWidth,
            height: subHeight
        }, level + 1);
        this.nodes[2] = new QuadTree({
            x: this.bounds.x,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, level + 1);
        this.nodes[3] = new QuadTree({
            x: this.bounds.x + subWidth,
            y: this.bounds.y + subHeight,
            width: subWidth,
            height: subHeight
        }, level + 1);
    };
}

/**
 * Objeto de Pool personalizado. Contiene objetos de viñeta que se administran para evitar
* recolección de basura.
* La piscina funciona de la siguiente manera:
-Cuando la piscina se inicializa, popoulates un array con
* obJetos de bala.
-Cuando la piscina necesita crear un nuevo objeto para su uso, se ve
* el último elemento de la matriz y comprueba si está actualmente
* en uso o no. Si está en uso, la piscina está llena. Si es
* no está en uso, la piscina "desova" el último elemento de la matriz y
* Luego aparece desde el final y lo empujó de nuevo en la parte delantera de
* la matriz. Esto hace que la piscina tiene objetos libres en la parte posterior
* y objetos usados en el frente.
-Cuando la piscina anima sus objetos, comprueba si el
* el objeto está en uso (no es necesario dibujar objetos no utilizados) y si lo es,
* lo dibuja. Si la función Draw () devuelve true, el objeto se
* listo para ser limpiado por lo que "despeja" el objeto y utiliza el
empalme de la función del * array () para quitar el artículo de la matriz y
* empuja hacia atrás.
* Haciendo esto crea/destruye objetos en la piscina
* constante.
 */

function Pool(maxSize) {
    var size = maxSize; // Max balas permitidas en la piscina
    var pool = [];

    this.getPool = function() {
        var obj = [];
        for (var i = 0; i < size; i++) {
            if (pool[i].alive) {
                obj.push(pool[i]);
            }
        }
        return obj;
    }

    /*
     * Rellena la matriz de Pool con el objeto dado
     */

    this.init = function(object) {
        if (object == "bullet") {
            for (var i = 0; i < size; i++) {
                // Inicialice el objeto
                var bullet = new Bullet("bullet");
                bullet.init(0, 0, imageRepository.bullet.width,
                    imageRepository.bullet.height);
                bullet.collidableWith = "enemy";
                bullet.type = "bullet";
                pool[i] = bullet;
            }
        } else if (object == "enemy") {
            for (var i = 0; i < size; i++) {
                var enemy = new Enemy();
                enemy.init(0, 0, imageRepository.enemy.width,
                    imageRepository.enemy.height);
                pool[i] = enemy;
            }
        } else if (object == "enemyBullet") {
            for (var i = 0; i < size; i++) {
                var bullet = new Bullet("enemyBullet");
                bullet.init(0, 0, imageRepository.enemyBullet.width,
                    imageRepository.enemyBullet.height);
                bullet.collidableWith = "ship";
                bullet.type = "enemyBullet";
                pool[i] = bullet;
            }
        }
    };

    /*
     * Toma el último elemento de la lista e inicializa y
     * empuja al frente de la matriz.
     */

    this.get = function(x, y, speed) {
        if (!pool[size - 1].alive) {
            pool[size - 1].spawn(x, y, speed);
            pool.unshift(pool.pop());
        }
    };

    /*
     * Utilizado para la nave para poder conseguir dos balas a la vez. Si
     * sólo la función get () se utiliza dos veces, la nave es capaz de
     * fuego y sólo tienen 1 bala desovar en lugar de 2.
     */
    this.getTwo = function(x1, y1, speed1, x2, y2, speed2) {
        if (!pool[size - 1].alive && !pool[size - 2].alive) {
            this.get(x1, y1, speed1);
            this.get(x2, y2, speed2);
        }
    };

    /*
     * Dibuja cualquier viñeta de uso. Si una bala sale de la pantalla,
     * lo despeja y lo empuja al frente de la matriz.
     */
    this.animate = function() {
        for (var i = 0; i < size; i++) {
            // Sólo dibujar hasta que encontremos una bala que no está viva
            if (pool[i].alive) {
                if (pool[i].draw()) {
                    pool[i].clear();
                    pool.push((pool.splice(i, 1))[0]);
                }
            } else
                break;
        }
    };
}

/**
 * Cree el objeto Ship que controla el reproductor. La nave es
 * dibujado en el "buque" lienzo y utiliza rectángulos sucios para mover
 * alrededor de la pantalla.
 */
function Ship() {
    this.speed = 3;
    this.bulletPool = new Pool(30);
    var fireRate = 15;
    var counter = 0;
    this.collidableWith = "enemyBullet";
    this.type = "ship";

    this.init = function(x, y, width, height) {
        // Variables defualt
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alive = true;
        this.isColliding = false;
        this.bulletPool.init("bullet");
    }

    this.draw = function() {
        this.context.drawImage(imageRepository.spaceship, this.x, this.y);
    };
    this.move = function() {
        counter++;
        // Determinar si la acción es mover acción
        if (KEY_STATUS.left || KEY_STATUS.right ||
            KEY_STATUS.down || KEY_STATUS.up) {
            // La nave se movió, así que borre su imagen actual para que pueda
            //ser redibujado en su nueva ubicación
            this.context.clearRect(this.x, this.y, this.width, this.height);

            // Actualizar x y y de acuerdo a la dirección para mover y
            //redibujen la nave. Cambiar la otra si las sentencias if
            //para tener movimiento diagonal.
            if (KEY_STATUS.left) {
                this.x -= this.speed
                if (this.x <= 0) // mantener Player dentro de la pantalla
                    this.x = 0;
            } else if (KEY_STATUS.right) {
                this.x += this.speed
                if (this.x >= this.canvasWidth - this.width)
                    this.x = this.canvasWidth - this.width;
            } else if (KEY_STATUS.up) {
                this.y -= this.speed
                if (this.y <= this.canvasHeight / 4 * 3)
                    this.y = this.canvasHeight / 4 * 3;
            } else if (KEY_STATUS.down) {
                this.y += this.speed
                if (this.y >= this.canvasHeight - this.height)
                    this.y = this.canvasHeight - this.height;
            }
        }

        // Redibujar la nave
        if (!this.isColliding) {
            this.draw();
        } else {
            this.alive = false;
            game.gameOver();
        }

        if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {
            this.fire();
            counter = 0;
        }
    };

    /*
     * Disparar Balas
     */

    this.fire = function() {
        this.bulletPool.getTwo(this.x + 20, this.y, 5,
            this.x + 20, this.y, 5);
        game.laser.get();
    };
}
Ship.prototype = new Drawable();


/**
 * Crear el objeto de la nave enemiga.
 */

function Enemy() {
    var percentFire = .01;
    var chance = 0;
    this.alive = false;
    this.collidableWith = "bullet";
    this.type = "enemy";

    /*
     * Establece los valores enemigos
     */

    this.spawn = function(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.speedX = 0;
        this.speedY = speed;
        this.alive = true;
        this.leftEdge = this.x - 90;
        this.rightEdge = this.x + 90;
        this.bottomEdge = this.y + 140;
    };

    /*
     * Mover al enemigo
     */

    this.draw = function() {
        this.context.clearRect(this.x - 1, this.y, this.width + 1, this.height);
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x <= this.leftEdge) {
            this.speedX = this.speed;
        } else if (this.x >= this.rightEdge + this.width) {
            this.speedX = -this.speed;
        } else if (this.y >= this.bottomEdge) {
            this.speed = 1.5;
            this.speedY = 0;
            this.y -= 5;
            this.speedX = -this.speed;
        }

        if (!this.isColliding) {
            this.context.drawImage(imageRepository.enemy, this.x, this.y);

            // Enemigo tiene la oportunidad de disparar a todos los movimientos
            chance = Math.floor(Math.random() * 101);
            if (chance / 100 < percentFire) {
                this.fire();
            }

            return false;
        } else {
            game.playerScore += 10;
            game.explosion.get();
            return true;
        }
    };

    /*
     * Disparar las Balas
     */

    this.fire = function() {
        game.enemyBulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
    };

    /*
     * Restablece los valores enemigos
     */

    this.clear = function() {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
Enemy.prototype = new Drawable();


/**
 * Crea el objeto Game que llevará a cabo todos los objetos y datos para
 * el juego.
 */

function Game() {
    /*
     * Obtiene información de lienzo y contexto y configura todo el juego
	objetos.
* Devuelve true si el lienzo es compatible y false si
* no lo es. Esto es para detener el script de animación constantemente
* ejecutándose en navegadores que no soportan el lienzo.
     */

    this.init = function() {
        // Obtener los elementos de lienzo
        this.bgCanvas = document.getElementById('background');
        this.shipCanvas = document.getElementById('ship');
        this.mainCanvas = document.getElementById('main');

        // Prueba para ver si el lienzo está soportado. Sólo tiene que
        //comprobar un lienzo
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.shipContext = this.shipCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');

            // Inicializar objetos para contener su contexto y lienzo
            //información
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;

            Ship.prototype.context = this.shipContext;
            Ship.prototype.canvasWidth = this.shipCanvas.width;
            Ship.prototype.canvasHeight = this.shipCanvas.height;

            Bullet.prototype.context = this.mainContext;
            Bullet.prototype.canvasWidth = this.mainCanvas.width;
            Bullet.prototype.canvasHeight = this.mainCanvas.height;

            Enemy.prototype.context = this.mainContext;
            Enemy.prototype.canvasWidth = this.mainCanvas.width;
            Enemy.prototype.canvasHeight = this.mainCanvas.height;

            // Inicializar el objeto de fondo
            this.background = new Background();
            this.background.init(0, 0); // Definir punto de dibujo de 0,0

            // Inicializar el objeto Ship
            this.ship = new Ship();
            // Fije la nave para comenzar cerca del centro inferior del lienzo
            this.shipStartX = this.shipCanvas.width / 2 - imageRepository.spaceship.width;
            this.shipStartY = this.shipCanvas.height / 4 * 3 + imageRepository.spaceship.height * 2;
            this.ship.init(this.shipStartX, this.shipStartY,
                imageRepository.spaceship.width, imageRepository.spaceship.height);

            // Inicializar el objeto de Pool enemigo
            this.enemyPool = new Pool(30);
            this.enemyPool.init("enemy");
            this.spawnWave();

            this.enemyBulletPool = new Pool(50);
            this.enemyBulletPool.init("enemyBullet");

            // Iniciar QuadTree
            this.quadTree = new QuadTree({ x: 0, y: 0, width: this.mainCanvas.width, height: this.mainCanvas.height });

            this.playerScore = 0;

            // Archivos de audio
            this.laser = new SoundPool(10);
            this.laser.init("laser");

            this.explosion = new SoundPool(20);
            this.explosion.init("explosion");

            this.backgroundAudio = new Audio("sounds/kick_shock.wav");
            this.backgroundAudio.loop = true;
            this.backgroundAudio.volume = .30;
            this.backgroundAudio.load();

            this.gameOverAudio = new Audio("sounds/game_over.wav");
            this.gameOverAudio.loop = true;
            this.gameOverAudio.volume = .30;
            this.gameOverAudio.load();

            this.checkAudio = window.setInterval(function() { checkReadyState() }, 1000);
        }
    };

    // Desovar una nueva ola de enemigos
    this.spawnWave = function() {
        var height = imageRepository.enemy.height;
        var width = imageRepository.enemy.width;
        var x = 100;
        var y = -height;
        var spacer = y * 1.5;
        for (var i = 1; i <= 18; i++) {
            this.enemyPool.get(x, y, 2);
            x += width + 25;
            if (i % 6 == 0) {
                x = 100;
                y += spacer
            }
        }
    }

    // Iniciar el bucle de animación
    this.start = function() {
        this.ship.draw();
        this.backgroundAudio.play();
        animate();
    };

    // Reiniciar el juego
    this.restart = function() {
        this.gameOverAudio.pause();

        document.getElementById('game-over').style.display = "none";
        this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        this.shipContext.clearRect(0, 0, this.shipCanvas.width, this.shipCanvas.height);
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

        this.quadTree.clear();

        this.background.init(0, 0);
        this.ship.init(this.shipStartX, this.shipStartY,
            imageRepository.spaceship.width, imageRepository.spaceship.height);

        this.enemyPool.init("enemy");
        this.spawnWave();
        this.enemyBulletPool.init("enemyBullet");

        this.playerScore = 0;

        this.backgroundAudio.currentTime = 0;
        this.backgroundAudio.play();

        this.start();
    };

    // Fin
    this.gameOver = function() {
        this.backgroundAudio.pause();
        this.gameOverAudio.currentTime = 0;
        this.gameOverAudio.play();
        document.getElementById('game-over').style.display = "block";
    };
}

/**
 * Asegúrese de que el sonido del juego se ha cargado antes de iniciar el juego
 */
function checkReadyState() {
    if (game.gameOverAudio.readyState === 4 && game.backgroundAudio.readyState === 4) {
        window.clearInterval(game.checkAudio);
        document.getElementById('loading').style.display = "none";
        game.start();
    }
}


/**
 *Un pool de sonidos que se utiliza para los efectos de sonido
 */
function SoundPool(maxSize) {
    var size = maxSize; // Max balas permitidas en la piscina
    var pool = [];
    this.pool = pool;
    var currSound = 0;

    /*
     * Rellena la matriz de Pool con el objeto dado
     */
    this.init = function(object) {
        if (object == "laser") {
            for (var i = 0; i < size; i++) {
                // Inicialice el objeto
                laser = new Audio("sounds/laser.wav");
                laser.volume = .12;
                laser.load();
                pool[i] = laser;
            }
        } else if (object == "explosion") {
            for (var i = 0; i < size; i++) {
                var explosion = new Audio("sounds/explosion.wav");
                explosion.volume = .10;
                explosion.load();
                pool[i] = explosion;
            }
        }
    };

    /*
     * Toca un sonido
     */
    this.get = function() {
        if (pool[currSound].currentTime == 0 || pool[currSound].ended) {
            pool[currSound].play();
        }
        currSound = (currSound + 1) % size;
    };
}


/**
 * El bucle de animación. Llama a la cuña requestAnimationFrame para
* optimizar el bucle de juego y dibuja todos los objetos del juego. Este
* function debe ser una función globales y no puede estar dentro de un
objeto.
 */
function animate() {
    document.getElementById('score').innerHTML = game.playerScore;

    // Insertar objetos en Quadtree
    game.quadTree.clear();
    game.quadTree.insert(game.ship);
    game.quadTree.insert(game.ship.bulletPool.getPool());
    game.quadTree.insert(game.enemyPool.getPool());
    game.quadTree.insert(game.enemyBulletPool.getPool());

    detectCollision();

    // No mas enemigo
    if (game.enemyPool.getPool().length === 0) {
        game.spawnWave();
    }

    // Animar objetos de juego
    if (game.ship.alive) {
        requestAnimFrame(animate);

        game.background.draw();
        game.ship.move();
        game.ship.bulletPool.animate();
        game.enemyPool.animate();
        game.enemyBulletPool.animate();
    }
}

function detectCollision() {
    var objects = [];
    game.quadTree.getAllObjects(objects);

    for (var x = 0, len = objects.length; x < len; x++) {
        game.quadTree.findObjects(obj = [], objects[x]);

        for (y = 0, length = obj.length; y < length; y++) {

            // Detectar algoritmo de colisión
            if (objects[x].collidableWith === obj[y].type &&
                (objects[x].x < obj[y].x + obj[y].width &&
                    objects[x].x + objects[x].width > obj[y].x &&
                    objects[x].y < obj[y].y + obj[y].height &&
                    objects[x].y + objects[x].height > obj[y].y)) {
                objects[x].isColliding = true;
                obj[y].isColliding = true;
            }
        }
    }
};


// El códigos que se asignará cuando un usuario presiona un botón.

KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
}

// Crea la matriz para mantener el KEY_CODES y establece todos sus valores
//a la verdad. Comprobación de true/Flase es la forma más rápida de comprobar el estado
//de una prensa clave y cuál se presionó al determinar
//Cuándo moverse y en qué dirección.
KEY_STATUS = {};
for (code in KEY_CODES) {
    KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * Configura el documento para escuchar los eventos de ((desencadenados cuando
 * cualquier tecla en el teclado es presionada). Cuando se presiona una tecla,
 * establece la dirección adecuada a true para hacernos saber que
 * llave fue.
 */
document.onkeydown = function(e) {
        // Firefox y opera utilizan charCode en lugar de código clave para
        //devolver Qué tecla se presionó.
        var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
        if (KEY_CODES[keyCode]) {
            e.preventDefault();
            KEY_STATUS[KEY_CODES[keyCode]] = true;
        }
    }
    /**
     * Configura el documento para escuchar los eventos de ownkeyup (desencadenados cuando
     * cualquier tecla en el teclado es liberado). Cuando se suelta una tecla,
     * establece la dirección adecuada a false para hacernos saber que
     * llave fue.
     */
document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
}


/**
 * capa de requestAnim Shim de Paul Irish
 * Encuentra la primera API que trabaja para optimizar el bucle de animación,
 * de lo contrario se omite a setTimeout ().
 */
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* funcion */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 100 / 15);
        };
})();