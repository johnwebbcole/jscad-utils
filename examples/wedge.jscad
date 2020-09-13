function main() {
  util.init(CSG);
  var wedge = util.wedge(
    CSG.cube({
      radius: 10
    }),
    30,
    -30,
    'x'
  );

  return wedge
    .map((part, name) => {
      if (name == 'wedge') return part.translate([0, 5, 0]);
      return part;
    })
    .combine();
}

// include:js
// endinject
