function main() {
  // var jscadUtils = initJscadutils();
  util.init(CSG, { debug: 'jscadUtils:group' });

  var cube = CSG.cube({
    radius: 10
  });

  var p = util.bisect(cube, 'x', 2);

  p.add(
    Parts.Cylinder(5, 10)
      .snap(cube, 'z', 'outside-')
      .color('orange'),
    'can'
  );

  var q = p
    .clone()
    .rotate('can', 'y', 180)
    .snap('can', p.parts.can, 'z', 'outside-', 10)
    .map(part => part.rotateY(45))
    .align('can', cube, 'z')
    .translate(0, 0, 10)
    .translate([0, 0, 10]);

  var can = q.pick('can').translate([0, 0, 20]);

  return [p.combine(), q.combineAll(), ...can.toArray()];
}

// include:js
// endinject
