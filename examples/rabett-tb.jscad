function main() {
    util.init(CSG);

    var part = Parts.Hexagon(20, 10).color('orange');
    var cbox = Boxes.Hollow(part, 3);

    var box = Boxes.RabettTopBottom(cbox, 3, 0.25);


    return union([
        box.parts.top.translate([0, 0, 20]),
        box.parts.middle.translate([0, 0, 10]),
        box.parts.bottom
    ]);
}

// include:js
// endinject
