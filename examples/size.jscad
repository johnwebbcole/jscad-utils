function main() {
  util.init(CSG);

  var cube = CSG.cube({
    radius: 10
  }).setColor(1, 0, 0);

  console.log('cube size', JSON.stringify(cube.size()));

  return cube;
}

// include:js
// endinject
