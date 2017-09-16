/*new Rect(10, 10, 100, 100) dibuja un rectangulo
    .addTo(stage)
    .attr('fillColor', 'black')*/

/*new Circle(100, 100, 100)  dibuja un circulo
    .addTo(stage)
    .attr('fillColor', 'black')
    */

//se mueve el circulo por la pantalla

var x = 350;
var y = 250;
var movx = 5;
var movy = 3;
$(document).ready(inicio);

function inicio() {
    movimiento();
}

function movimiento() {
    var lienzo = document.getElementById("lienzo");
    var contexto = lienzo.getContext("2d");
    if (x >= 680 || x <= 20)
        movx = movx * -1;
    if (y >= 480 || y <= 20)
        movy = movy * -1;
    x = x + movx;
    y = y + movy;
    //dibujo de la pelota
    contexto.beginPath();
    contexto.clearRect(0, 0, 700, 500);
    contexto.fillStyle = "rgb(255,0,0)";
    contexto.rect(x, y, 100, 50);//10, 10, 100, 100
    contexto.fill();
    setTimeout("movimiento()", 20);
}