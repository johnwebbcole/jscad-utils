function main() {
  util.init(CSG, { debug: 'jscadUtils:boxes' });
  var t = 5;
  var bbox = Parts.Cube([93.5, 60, 18.82]).Center();
  var exterior = bbox
    .enlarge(t, t, t)
    .stretch('z', 10, 0)
    .snap(bbox, 'z', 'inside+');
  var e = exterior.size();
  // var shell = exterior.subtract(bbox);
  var rexterior = Parts.RoundedCube(e.x, e.y, e.z, 2)
    .align(bbox, 'xyz')
    // .stretch('z', 2, 0)
    // .snap(shell, 'z', 'inside+')
    .subtract(bbox);
  var box = Boxes.Rabett(rexterior, 3, 0.5, -7, 3);
  var object = union([
    box.parts.top.translate([0, 0, 30]),
    box.parts.bottom,
    box.parts['middle-top'].translate([0, 0, 20]),
    box.parts['middle-bottom'].translate([0, 0, 10])
  ]);
  return object;

  // return [bbox];
}
// include:js
// endinject
