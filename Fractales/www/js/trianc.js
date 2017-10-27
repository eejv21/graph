function fractalC(x, y, numPuntos) {
    for (var i = 0; i < numPuntos; i++) {
        var vn = ((parseInt(Math.random() * 1000)) % 3);
        x = x - ((x - vert[vn][0]) / 2);
        y = y - ((y - vert[vn][1]) / 2);
        cwxc.fillRect(x, y, 1, 1);
    }
}