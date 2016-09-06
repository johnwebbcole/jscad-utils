function main() {
    util.init(CSG);

    var cube = Parts.Cube([10, 10, 10]).fillet(2, 'z+') // roundover on top (positive fillet)
        .fillet(-2, 'z-') // fillet on the bottom (negative fillet)
        .color('orange');

    var cylinder = Parts.Cylinder(10, 10)
        .translate([0, 20, 0])
        .align(cube, 'x')
        .fillet(2, 'z+')
        .color('blue');

    return union(cube, cylinder);
}

// include:js
// endinject
