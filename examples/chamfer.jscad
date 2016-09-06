function main() {
    util.init(CSG);

    var cube = CSG.cube({
        radius: 10
    });

    return cube.chamfer(2, 'z+').color('orange');
}

// include:js
// endinject
