function componentToHex (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

module.exports = {
    int2Rgb: function (num) {
        return {r: (0xff0000 & num) >> 16, g: (0x00ff00 & num) >> 8, b: (0x0000ff & num)};
    },
    rgb2Hex: function (r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    },
}