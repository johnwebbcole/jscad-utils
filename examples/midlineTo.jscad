function main() {
    util.init(CSG);

    // create a RPi hat board
    var board = Parts.Board(65, 56.5, 3).color('green');

    // a 40 pin gpio
    var gpio = Parts.Cube([52.2, 5, 8.5])
        .snap(board, 'z', 'outside+')
        .midlineTo('x', 29 + 3.5)
        .midlineTo('y', 49 + 3.5)
        .color('black')

    var camera_flex_slot = Parts.Board(2, 17, 1)
        .midlineTo('x', 45)
        .midlineTo('y', 11.5)
        .color('red');

    // This is more complex, due to the outside 1mm roundover.
    // Create a board to work from first.  The spec
    // has the edge offset, not the midline listed as 19.5mm.
    // Bisect the cutout into two parts.
    var display_flex_cutout = Parts.Board(5, 17, 1)
        .translate([0, 19.5, 0])
        .bisect('x');

    // Bisect the outside (negative) part.
    var edges = display_flex_cutout.parts.negative.bisect('y');

    // Create a cube, and align it with the rounded edges
    // of the edge, subtract the edge from it and move it
    // to the other side of the coutout.
    var round1 = Parts.Cube([2, 2, 2])
        .snap(edges.parts.positive, 'xyz', 'inside-')
        .subtract(edges.parts.positive)
        .translate([0, 17, 0]);

    // Repeat for the opposite corner
    var round2 = Parts.Cube([2, 2, 2])
        .snap(edges.parts.negative, 'yz', 'inside+')
        .snap(edges.parts.negative, 'x', 'inside-')
        .subtract(edges.parts.negative)
        .translate([0, -17, 0]);

    // Create a cube cutout so the outside is square instead of rounded.
    // The `round1` and `round2` parts will be used to subtract off the rounded outside corner.
    var cutout = Parts.Cube(display_flex_cutout.parts.negative.size()).align(display_flex_cutout.parts.negative, 'xyz');

    return board
        .union(gpio)
        .subtract(camera_flex_slot)
        .subtract(union([display_flex_cutout.parts.positive,
            cutout
        ]))
        .subtract(round1)
        .subtract(round2);
}

// include:js
// endinject
