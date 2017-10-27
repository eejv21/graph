const COLOR_LIST = ["red", "green", "yellow", "pink", "brown", "purple", "cyan", "blue", "orange"];
// el color que van a tener los puntos
function punto(x, y) {
    var p = {
        x: x,
        y: y
    };
    return p;
}

function puntoMedio(p, q) {
    var m = {
        x: Math.round((p.x + q.x) / 2),
        y: Math.round((p.y + q.y) / 2)
    };
    return m;
} //la posicion que tendran los puntos en el plano

function getRandomColor() {
    return COLOR_LIST[Math.floor(COLOR_LIST.length * Math.random())];
} //el color que se generara aleatoriamente para que se pinte en el plano

function dibujarPunto(ctx, p, size) {
    ctx.fillStyle = getRandomColor();
    ctx.fillRect(p.x, p.y, size, size);
} //la ubicacion donde se dibujara el punto y el tamaño que tendra

function $(id) {
    return document.getElementById(id);
}

function get(id) {
    return Math.round(document.getElementById(id).value);
}

function main() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var interval;

    $("start").addEventListener("click", function() {

        var size = get("size");
        var vertex = [punto(get("a-x"), get("a-y")), punto(get("b-x"), get("b-y")), punto(get("c-x"), get("c-y"))];

        let p = punto(get("s-x"), get("s-y"));

        dibujarPunto(ctx, p, size);

        interval = setInterval(function() {
            var q = vertex[Math.floor(3 * Math.random())];
            p = puntoMedio(p, q);
            dibujarPunto(ctx, p, size);
        }, get("speed"));
    }); //el boton de inicio que hara dibujar un punto para crear el triangulo de Sierpinski

    $("stop").addEventListener("click", function() {
        clearInterval(interval);
    }); //el boton de detener para que dejen de colocarse puntos de forma "aleatoria"

    $("reset").addEventListener("click", function() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 600, 600);
    });
} //el boton de reinicio para volver a empezar a colocar las puntos en el plano para crear el triangulo de Sierpinski

window.addEventListener("DOMContentLoaded", main);

// https://blog.adrianistan.eu/2017/05/24/triangulo-sierpinski-javascript/