function fractalB(x, y, ba, ha) {
    var b = ba / 2;
    var h = ha / 2;
    if ((b >= 1) && (h >= 1)) {
        var x2 = x + b / 2;
        var y2 = y + h;
        var x3 = x - b / 2;
        var y3 = y + h;
        fractalB(x, y, b, h);
        fractalB(x2, y2, b, h);
        fractalB(x3, y3, b, h);
    }
    dibujarFormaB(x, y + 2 * h, x2, y2, x3, y3);
}