function main() {
    util.init(CSG);

    var cube = CSG.cube({
        radius: 10
    })

    var p = util.bisect(cube, 'x', 2);

    return p.combine();
}

// include:js
// endinject
