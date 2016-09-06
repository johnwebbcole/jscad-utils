function main() {
    util.init(CSG);

    var cube = CSG.cube({
        radius: 10
    }).setColor(1, 0, 0);


    echo(JSON.stringify(cube.size()));

    return cube;
}

// include:js
// endinject
