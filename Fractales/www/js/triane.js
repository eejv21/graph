function fractalRecta(xa, ya, xb, yb) {
    var largo = Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2));
    if (largo > 1) {
        //Dividimos la recta en 3 partes
        var sx = (xb - xa) / 3;
        var sy = (yb - ya) / 3;
        //Buscamos los puntos de las 4 rectas
        var x1 = xa;
        var y1 = ya;
        var x2 = xa + sx;
        var y2 = ya + sy;
        var vx = (Math.sqrt(3) / 6) * (xb - xa);
        var vy = (Math.sqrt(3) / 6) * (yb - ya);
        var x3 = x1 + ((xb - xa) / 2) - vy;
        var y3 = y1 + ((yb - ya) / 2) + vx;
        var x4 = xb - sx;
        var y4 = yb - sy;
        var x5 = xb;
        var y5 = yb;
        //Borramos recta anterior
        cwxe.beginPath();
        cwxe.moveTo(xa, -ya + he);
        cwxe.lineTo(xb, -yb + he);
        cwxe.stroke();
        cwxe.closePath();
        //Pintamos las 4 nuevas rectas
        cwxe.beginPath();
        cwxe.moveTo(x1, -y1 + he);
        cwxe.lineTo(x2, -y2 + he);
        cwxe.lineTo(x3, -y3 + he);
        cwxe.lineTo(x4, -y4 + he);
        cwxe.lineTo(x5, -y5 + he);
        cwxe.fill();
        cwxe.closePath();
        //Nueva llamada recursiva a cada segmento
        fractalRecta(x1, y1, x2, y2);
        fractalRecta(x2, y2, x3, y3);
        fractalRecta(x3, y3, x4, y4);
        fractalRecta(x4, y4, x5, y5);
    }
}