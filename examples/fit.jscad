function main() {
    util.init(CSG);

    var cube = CSG.cube({
        radius: 10
    }).color('orange');

    // create a label, place it on top of the cube
    // and center it on the top face
    var label = util.label('hello')
        .snap(cube, 'z', 'outside-')
        .align(cube, 'xy');

    var s = cube.size();
    // fit the label to the cube (minus 2mm) while
    // keeping the aspect ratio of the text
    // and return the union
    return cube.union(label.fit([s.x - 2, s.y - 2, 0], true).color('blue'));
}

// include:js
// endinject
