function main() {
    util.init(CSG);

    var cube = CSG.cube({
        radius: 10
    }).setColor(1, 0, 0);

    var sphere = CSG.sphere({
        radius: 5
    }).setColor(0, 0, 1);

    return cube.union(sphere.snap(cube, 'z', 'outside-'));
}

// include:js
// endinject
