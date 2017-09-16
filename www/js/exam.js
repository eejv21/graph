var x1 = new Object(30)
var x2 = new Object(50)
var y1 = new Object(42)
var y2 = new Object(62)

distancia(x1, x2, y1, y2);

function distancia(x1, x2, y1, y2) {
    a1 = x1;
    a2 = x2;
    b1 = y1;
    b2 = y2;

    const dist = Math.sqrt((Math.pow((a2 - a1), 2)) + (Math.pow((b2 - b1), 2)));
    console.log(`distancia entre ellos  ${dist}`)
}