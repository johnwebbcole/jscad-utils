function main() {
  util.init(CSG, { debug: 'jscadUtils:boxes' });
  var cyl = Parts.Cylinder(20, 20);
  var cbox = Boxes.Hollow(cyl, 3, function (box) {
    return box.fillet(2, 'z+').fillet(2, 'z-');
  });
  var box = Boxes.Rabett(cbox, 3, 0.5, -7, 2);
  var object = box.parts.top.translate([0, 0, 20]).union(box.parts.bottom);
  return object;
}
// include:js
// endinject
