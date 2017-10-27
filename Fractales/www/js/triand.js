function fractalD(x, y, w, h) {
    var w = w / 3;
    var h = h / 3;
    if ((w > 1) && (h > 1)) {
        var desp = Array(-2, 1, 4);
        for (var i = 0; i < desp.length; i++) {
            var xd = x + desp[i] * w;
            for (var j = 0; j < desp.length; j++) {
                if (!((i == 1) && (j == 1))) {
                    var yd = y + desp[j] * h;
                    cwxd.fillRect(xd, yd, w, h);
                    fractalD(xd, yd, w, h);
                }
            }
        }
    }
}