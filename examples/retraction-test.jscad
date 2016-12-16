function main() {
    util.init(CSG);

    // draws a blue hexagon
    return union(
        [0, 40, 80, 160].map(function (x) {
            return Parts.Tube(10, 5, 10).translate([x, 0, 0])
        })
    ).Center();
}

// include:js
// endinject
