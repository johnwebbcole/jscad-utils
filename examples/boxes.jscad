function main() {
    util.init(CSG);

    var cyl = Parts.Cylinder(20, 20)
    var cbox = Boxes.Hollow(cyl, 3, function (box) {
        return box
            .fillet(2, 'z+')
            .fillet(2, 'z-');
    });
    var box = Boxes.Rabett(cbox, 3, 0.5, 11, 2)
    return box.parts.top.translate([0, 0, 10]).union(box.parts.bottom);
}

// include:js
// endinject
