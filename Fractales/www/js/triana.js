function fractal(x, y, wa) {
    var w = wa / 2;
    if (w >= 1) {
        var x1 = x - w;
        var y1 = y - w;
        var x2 = x + w;
        var y2 = y - w;
        var x3 = x - w;
        var y3 = y + w;
        fractal(x1, y1, w);
        if (wa != ww) {
            fractal(x2, y2, w);
            fractal(x3, y3, w);
        }
    }
    dibujarForma(x1, y1, x2, y2, x3, y3, w);
}