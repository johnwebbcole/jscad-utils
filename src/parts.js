import { CSG, CAG, union } from './jscad';
import { fromxyz, div } from './array';
import * as util from './util';
import Group from './group';
import { Debug } from './debug';

const debug = Debug('jscadUtils:parts');

export default { BBox, Cube, RoundedCube, Cylinder, Cone };

export function BBox(...objects) {
  var box = object =>
    CSG.cube({
      center: object.centroid(),
      radius: object.size().dividedBy(2)
    });
  return objects.reduce(function(bbox, part) {
    var object = bbox ? union([bbox, box(part)]) : part;
    return box(object);
  });
}

export function Cube(width) {
  var r = div(fromxyz(width), 2);
  return CSG.cube({
    center: r,
    radius: r
  });
}

// export function Sphere(diameter) {
//   return CSG.sphere({
//     cener: [0, 0, 0],
//     radius: diameter / 2
//   });
// }
/**
 * Creates a cube with the `x` and `y` corners rounded.  The `z` faces are flat.
 * Intended to create circut boards and similar objects.
 *
 * @function RoundedCube
 * @param  {Number|CSG} x             The `x` dimension size or a CSG object to get dimensions from.
 * @param  {Number} y             The `y` dimension size
 * @param  {Number} [thickness=1.62]     Thickness in the `z` dimension of the cube.
 * @param  {Number} [corner_radius] Radius of the corners.
 * @return {CSG} A csg rounded cube.
 */
export function RoundedCube(x, y, thickness, corner_radius) {
  if (x.getBounds) {
    var size = util.size(x.getBounds());
    var r = [size.x / 2, size.y / 2];
    thickness = size.z;
    corner_radius = y;
  } else {
    var r = [x / 2, y / 2]; // eslint-disable-line no-redeclare
  }

  debug('RoundedCube', size, r, thickness, corner_radius);
  var roundedcube = CAG.roundedRectangle({
    center: [r[0], r[1], 0],
    radius: r,
    roundradius: corner_radius
  }).extrude({
    offset: [0, 0, thickness || 1.62]
  });

  return roundedcube;
}

/**
 * A Cylinder primative located at the origin.
 * @param {Number} diameter Diameter of the cylinder
 * @param {Number} height   Height of the cylinder
 * @param {Object} [options]  Options passed to the `CSG.cylinder` function.
 * @param {number} [options.resolution] The number of segments to create in 360 degrees of rotation.
 * @return {CSG} A CSG Cylinder
 */
export function Cylinder(diameter, height, options) {
  debug('parts.Cylinder', diameter, height, (options = {}));
  options = Object.assign(options, {
    start: [0, 0, 0],
    end: [0, 0, height],
    radius: diameter / 2
  });
  return CSG.cylinder(options);
}

/**
 * Creats a cone.
 * @function Cone
 * @param  {Number} diameter1 Radius of the bottom of the cone.
 * @param  {Number} diameter2 Radius of the top of the cone.
 * @param  {Number} height    Height of the cone.
 * @return {CSG} A CSG cone object.
 */
export function Cone(diameter1, diameter2, height) {
  return CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, height],
    radiusStart: diameter1 / 2,
    radiusEnd: diameter2 / 2
  });
}

/**
 * Creates a hexagon.
 * @param {number} diameter Outside diameter of the hexagon
 * @param {number} height   height of the hexagon
 */
export function Hexagon(diameter, height) {
  debug('hexagon', diameter, height);
  var radius = diameter / 2;
  var sqrt3 = Math.sqrt(3) / 2;
  var hex = CAG.fromPoints([
    [radius, 0],
    [radius / 2, radius * sqrt3],
    [-radius / 2, radius * sqrt3],
    [-radius, 0],
    [-radius / 2, -radius * sqrt3],
    [radius / 2, -radius * sqrt3]
  ]);

  return hex.extrude({
    offset: [0, 0, height]
  });
}

/**
 * Creats a 3 sided prisim
 * @function Triangle
 * @param  {Number} base   The base of the triangle.
 * @param  {Number} height The height of the prisim.
 * @return {CSG} A prisim object.
 */
export function Triangle(base, height) {
  var radius = base / 2;
  var tri = CAG.fromPoints([
    [-radius, 0],
    [radius, 0],
    [0, Math.sin(30) * radius]
  ]);

  return tri.extrude({
    offset: [0, 0, height]
  });
}

/**
 * Create a tube
 * @param {Number} outsideDiameter Outside diameter of the tube.
 * @param {Number} insideDiameter  Inside diameter of the tube.
 * @param {Number} height          Height of the tube.
 * @param {Object} [outsideOptions]  Options passed to the outside cylinder.
 * @param {number} [outsideOptions.resolution] The resolution option determines the number of segments to create in 360 degrees of rotation.
 * @param {Object} [insideOptions]   Options passed to the inside cylinder
 * @param {number} [insideOptions.resolution] The resolution option determines the number of segments to create in 360 degrees of rotation.
 * @returns {CSG}  A CSG Tube
 */
export function Tube(
  outsideDiameter,
  insideDiameter,
  height,
  outsideOptions,
  insideOptions
) {
  return Cylinder(outsideDiameter, height, outsideOptions).subtract(
    Cylinder(insideDiameter, height, insideOptions || outsideOptions)
  );
}

/**
 *
 * @param {Number} width
 * @param {Number} height
 */
export function Anchor(width = 10, height = 10) {
  var hole = Cylinder(width, height)
    .Center()
    .color('red');
  var post = Cylinder(height / 2, width * 0.66)
    .rotateX(90)
    .align(hole, 'xz')
    .snap(hole, 'y', 'inside-')
    .translate([0, 0, -height / 6])
    .color('purple');
  return Group({ post, hole });
}

export function Board(width, height, corner_radius, thickness) {
  var r = util.divA([width, height], 2);
  var board = CAG.roundedRectangle({
    center: [r[0], r[1], 0],
    radius: r,
    roundradius: corner_radius
  }).extrude({
    offset: [0, 0, thickness || 1.62]
  });

  return board;
}

export const Hardware = {
  Orientation: {
    up: {
      head: 'outside-',
      clear: 'inside+'
    },
    down: {
      head: 'outside+',
      clear: 'inside-'
    }
  },

  Screw: function(head, thread, headClearSpace, options) {
    options = Object.assign(options, {
      orientation: 'up',
      clearance: [0, 0, 0]
    });

    var orientation = Hardware.Orientation[options.orientation];
    var group = Group('head,thread', {
      head: head.color('gray'),
      thread: thread.snap(head, 'z', orientation.head).color('silver')
    });

    if (headClearSpace) {
      group.add(
        headClearSpace
          .enlarge(options.clearance)
          .snap(head, 'z', orientation.clear)
          .color('red'),
        'headClearSpace',
        true
      );
    }

    return group;
  },

  /**
   * Creates a `Group` object with a Pan Head Screw.
   * @param {number} headDiameter Diameter of the head of the screw
   * @param {number} headLength   Length of the head
   * @param {number} diameter     Diameter of the threaded shaft
   * @param {number} length       Length of the threaded shaft
   * @param {number} clearLength  Length of the clearance section of the head.
   * @param {object} options      Screw options include orientation and clerance scale.
   */
  PanHeadScrew: function(
    headDiameter,
    headLength,
    diameter,
    length,
    clearLength,
    options
  ) {
    var head = Cylinder(headDiameter, headLength);
    var thread = Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = Cylinder(headDiameter, clearLength);
    }

    return Hardware.Screw(head, thread, headClearSpace, options);
  },

  /**
   * Creates a `Group` object with a Hex Head Screw.
   * @param {number} headDiameter Diameter of the head of the screw
   * @param {number} headLength   Length of the head
   * @param {number} diameter     Diameter of the threaded shaft
   * @param {number} length       Length of the threaded shaft
   * @param {number} clearLength  Length of the clearance section of the head.
   * @param {object} options      Screw options include orientation and clerance scale.
   */
  HexHeadScrew: function(
    headDiameter,
    headLength,
    diameter,
    length,
    clearLength,
    options
  ) {
    var head = Hexagon(headDiameter, headLength);
    var thread = Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = Hexagon(headDiameter, clearLength);
    }

    return Hardware.Screw(head, thread, headClearSpace, options);
  },

  /**
   * Create a Flat Head Screw
   * @param {number} headDiameter head diameter
   * @param {number} headLength   head length
   * @param {number} diameter     thread diameter
   * @param {number} length       thread length
   * @param {number} clearLength  clearance length
   * @param {object} options      options
   */
  FlatHeadScrew: function(
    headDiameter,
    headLength,
    diameter,
    length,
    clearLength,
    options
  ) {
    var head = Cone(headDiameter, diameter, headLength);
    // var head = Cylinder(headDiameter, headLength);
    var thread = Cylinder(diameter, length);

    if (clearLength) {
      var headClearSpace = Cylinder(headDiameter, clearLength);
    }

    return Hardware.Screw(head, thread, headClearSpace, options);
  }
};
