import { Debug } from './debug';
const debug = Debug('jscadUtils:util');
import {
  CSG,
  union,
  rectangular_extrude,
  vector_text,
  vector_char
} from './jscad';
// import jsCadCSG from '@jscad/csg';
// const { CSG } = jsCadCSG;
// import scadApi from '@jscad/scad-api';
// const { rectangular_extrude } = scadApi.extrusions;
// const { vector_text, vector_char } = scadApi.text;
// const { union } = scadApi.booleanOps;
import Group from './group';
import * as array from './array';
// import utilInit from '../src/add-prototype';
// utilInit(CSG);
// console.trace('CSG', CSG.prototype);

export var NOZZEL_SIZE = 0.4;

export const nearest = {
  /**
   * Return the largest number that is a multiple of the
   * nozzel size.
   * @param  {Number} desired                   Desired value
   * @param  {Number} [nozzel=NOZZEL_SIZE] Nozel size, defaults to `NOZZEL_SIZE`
   * @param  {Number} [nozzie=0]                Number of nozzel sizes to add to the value
   * @return {Number}                           Multiple of nozzel size
   */
  under: function(desired, nozzel = NOZZEL_SIZE, nozzie = 0) {
    return (Math.floor(desired / nozzel) + nozzie) * nozzel;
  },
  /**
   * Returns the largest number that is a multipel of the
   * nozzel size, just over the desired value.
   * @param  {Number} desired                   Desired value
   * @param  {Number} [nozzel=NOZZEL_SIZE] Nozel size, defaults to `NOZZEL_SIZE`
   * @param  {Number} [nozzie=0]                Number of nozzel sizes to add to the value
   * @return {Number}                           Multiple of nozzel size
   */
  over: function(desired, nozzel = NOZZEL_SIZE, nozzie = 0) {
    return (Math.ceil(desired / nozzel) + nozzie) * nozzel;
  }
};

/**
 * A function that reutrns the first argument.  Useful when
 * passing in a callback to modify something, and you want a
 * default functiont hat does nothing.
 * @param  {object} solid an object that will be returned
 * @return {object}       the first parameter passed into the function.
 * @function identity
 */
export function identity(solid) {
  return solid;
}

/**
 * If `f` is a funciton, it is executed with `object` as the
 * parameter.  This is used in `CSG.unionIf` and `CSG.subtractIf`,
 * allowing you to pass a function instead of an object.  Since the
 * function isn't exeuted until called, the object to `union` or
 * `subtract` can be assembled only if the conditional is true.
 * @param  {object} object the context to run the function with.
 * @param  {function|object} f if a funciton it is executed, othewise the object is returned.
 * @return {object}        the result of the function or the object.
 * @function result
 */
export function result(object, f) {
  if (typeof f === 'function') {
    return f.call(object);
  } else {
    return f;
  }
}

/**
 * Returns target object with default values assigned. If values already exist, they are not set.
 * @param  {object} target   The target object to return.
 * @param  {object} defaults Defalut values to add to the object if they don't already exist.
 * @return {object}          Target object with default values assigned.
 * @function defaults
 * @depricated
 */
export function defaults(target, defaults) {
  depreciated('defaults', true, 'use Object.assign instead');
  return Object.assign(defaults, target);
}

export function isEmpty(variable) {
  return typeof variable === 'undefined' || variable === null;
}

export function isNegative(n) {
  return ((n = +n) || 1 / n) < 0;
}

/**
 * Print a message and CSG object bounds and size to the conosle.
 * @param  {String} msg Message to print
 * @param  {CSG} o   A CSG object to print the bounds and size of.
 * @function
 * @depricated use Debug instead
 */
export function print(msg, o) {
  debug(
    msg,
    JSON.stringify(o.getBounds()),
    JSON.stringify(this.size(o.getBounds()))
  );
}

export function error(msg) {
  if (console && console.error) console.error(msg); // eslint-disable-line no-console
  throw new Error(msg);
}

export function depreciated(method, error, message) {
  var msg = method + ' is depreciated.' + (' ' + message || '');
  // eslint-disable-next-line no-console
  if (!error && console && console.error)
    console[error ? 'error' : 'warn'](msg); // eslint-disable-line no-console
  if (error) throw new Error(msg);
}

/**
 * Convert an imperial `inch` to metric `mm`.
 * @param  {Number} x Value in inches
 * @return {Number}   Result in mm
 * @function inch
 */
export function inch(x) {
  return x * 25.4;
}

/**
 * Convert metric `cm` to imperial `inch`.
 * @param  {Number} x Value in cm
 * @return {Number}   Result in inches
 * @function cm
 */
export function cm(x) {
  return x / 25.4;
}

export function label(text, x, y, width, height) {
  var l = vector_text(x || 0, y || 0, text); // l contains a list of polylines to draw
  var o = [];
  l.forEach(function(pl) {
    // pl = polyline (not closed)
    o.push(
      rectangular_extrude(pl, {
        w: width || 2,
        h: height || 2
      })
    ); // extrude it to 3D
  });
  // console.trace('label', Object.getPrototypeOf(union(o)));
  // var foo = union(o);
  // console.trace('typeof', typeof foo);
  return center(union(o));
}

export function text(text) {
  var l = vector_char(0, 0, text); // l contains a list of polylines to draw
  var char = l.segments.reduce(function(result, segment) {
    var path = new CSG.Path2D(segment);
    var cag = path.expandToCAG(2);
    // debug('reduce', result, segment, path, cag);
    return result ? result.union(cag) : cag;
  }, undefined);
  return char;
}

export function unitCube(length, radius) {
  radius = radius || 0.5;
  return CSG.cube({
    center: [0, 0, 0],
    radius: [radius, radius, length || 0.5]
  });
}

export function unitAxis(length, radius, centroid) {
  // echo(length, JSON.stringify(centroid));
  centroid = centroid || [0, 0, 0];
  return unitCube(length, radius)
    .union([
      unitCube(length, radius)
        .rotateY(90)
        .setColor(0, 1, 0),
      unitCube(length, radius)
        .rotateX(90)
        .setColor(0, 0, 1)
    ])
    .translate(centroid);
}

export function toArray(a) {
  return Array.isArray(a) ? a : [a];
}

export function ifArray(a, cb) {
  return Array.isArray(a) ? a.map(cb) : cb(a);
}

/**
 * Returns an array of positions along an object on a given axis.
 * @param  {CSG} object   The object to calculate the segments on.
 * @param  {number} segments The number of segments to create.
 * @param  {string} axis     Axis to create the sgements on.
 * @return {Array}          An array of segment positions.
 * @function segment
 */
export function segment(object, segments, axis) {
  var size = object.size()[axis];
  var width = size / segments;
  var result = [];
  for (var i = width; i < size; i += width) {
    result.push(i);
  }
  return result;
}

export function zipObject(names, values) {
  return names.reduce(function(result, value, idx) {
    result[value] = values[idx];
    return result;
  }, {});
}

/**
 * Object map function, returns an array of the object mapped into an array.
 * @param  {object} o Object to map
 * @param  {function} f function to apply on each key
 * @return {array}   an array of the mapped object.
 * @function map
 */
export function map(o, f) {
  return Object.keys(o).map(function(key) {
    return f(o[key], key, o);
  });
}

export function mapValues(o, f) {
  return Object.keys(o).map(function(key) {
    return f(o[key], key);
  });
}

export function pick(o, names) {
  return names.reduce(function(result, name) {
    result[name] = o[name];
    return result;
  }, {});
}

export function mapPick(o, names, f, options) {
  return names.reduce(function(result, name) {
    if (!o[name]) {
      throw new Error(
        `${name} not found in ${options.name}: ${Object.keys(o).join(',')}`
      );
    }
    result.push(f ? f(o[name]) : o[name]);
    return result;
  }, []);
}

export function divA(a, f) {
  return array.div(a, f);
}

export function divxyz(size, x, y, z) {
  return {
    x: size.x / x,
    y: size.y / y,
    z: size.z / z
  };
}

export function div(size, d) {
  return this.divxyz(size, d, d, d);
}

export function mulxyz(size, x, y, z) {
  return {
    x: size.x * x,
    y: size.y * y,
    z: size.z * z
  };
}

export function mul(size, d) {
  return this.divxyz(size, d, d, d);
}

export function xyz2array(size) {
  return [size.x, size.y, size.z];
}

export const rotationAxes = {
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1]
};

/**
 * Returns a `Vector3D` with the size of the object.
 * @param  {CSG} o A `CSG` like object or an array of `CSG.Vector3D` objects (the result of getBounds()).
 * @return {CSG.Vector3D}   Vector3d with the size of the object
 * @function size
 */
export function size(o) {
  var bbox = o.getBounds ? o.getBounds() : o;

  var foo = bbox[1].minus(bbox[0]);
  return foo;
}

/**
 * Returns a scale factor (0.0-1.0) for an object
 * that will resize it by a value in size units instead
 * of percentages.
 * @param  {number} size  Object size
 * @param  {number} value Amount to add (negative values subtract) from the size of the object.
 * @return {number}       Scale factor
 * @function scale
 */
export function scale(size, value) {
  if (value == 0) return 1;

  return 1 + 100 / (size / value) / 100;
}

export function center(object, objectSize) {
  objectSize = objectSize || size(object.getBounds());
  return centerY(centerX(object, objectSize), objectSize);
}

export function centerY(object, objectSize) {
  objectSize = objectSize || size(object.getBounds());
  return object.translate([0, -objectSize.y / 2, 0]);
}

export function centerX(object, objectSize) {
  objectSize = objectSize || size(object.getBounds());
  return object.translate([-objectSize.x / 2, 0, 0]);
}

/**
 * Enlarge an object by scale units, while keeping the same
 * centroid.  For example `enlarge(mycsg, 1, 1, 1)` enlarges
 * object *mycsg* by 1mm in each axis, while the centroid stays the same.
 * @param  {CSG} object [description]
 * @param  {number} x      [description]
 * @param  {number} y      [description]
 * @param  {number} z      [description]
 * @return {CSG}        [description]
 * @function enlarge
 */
export function enlarge(object, x, y, z) {
  var a;
  if (Array.isArray(x)) {
    a = x;
  } else {
    a = [x, y, z];
  }

  var objectSize = size(object);
  var objectCentroid = centroid(object, objectSize);

  var idx = 0;

  var t = map(objectSize, function(i) {
    return scale(i, a[idx++]);
  });

  var new_object = object.scale(t);
  var new_centroid = centroid(new_object);

  /// Calculate the difference between the original centroid and the new
  var delta = new_centroid.minus(objectCentroid).times(-1);

  return new_object.translate(delta);
}

/**
 * Fit an object inside a bounding box.  Often used
 * with text labels.
 * @param  {CSG} object            [description]
 * @param  {number | array} x                 [description]
 * @param  {number} y                 [description]
 * @param  {number} z                 [description]
 * @param  {boolean} keep_aspect_ratio [description]
 * @return {CSG}                   [description]
 * @function fit
 */
export function fit(object, x, y, z, keep_aspect_ratio) {
  var a;
  if (Array.isArray(x)) {
    a = x;
    keep_aspect_ratio = y;
    x = a[0];
    y = a[1];
    z = a[2];
  } else {
    a = [x, y, z];
  }

  var objectSize = size(object.getBounds());

  function scale(size, value) {
    if (value == 0) return 1;
    return value / size;
  }

  var s = [
    scale(objectSize.x, x),
    scale(objectSize.y, y),
    scale(objectSize.z, z)
  ];
  var min = array.min(s);
  return centerWith(
    object.scale(
      s.map(function(d, i) {
        if (a[i] === 0) return 1; // don't scale when value is zero
        return keep_aspect_ratio ? min : d;
      })
    ),
    'xyz',
    object
  );
}

export function shift(object, x, y, z) {
  var hsize = this.div(this.size(object.getBounds()), 2);
  return object.translate(this.xyz2array(this.mulxyz(hsize, x, y, z)));
}

export function zero(object) {
  var bounds = object.getBounds();
  return object.translate([0, 0, -bounds[0].z]);
}

export function mirrored4(x) {
  return x.union([
    x.mirroredY(90),
    x.mirroredX(90),
    x.mirroredY(90).mirroredX(90)
  ]);
}

export const flushSide = {
  'above-outside': [1, 0],
  'above-inside': [1, 1],
  'below-outside': [0, 1],
  'below-inside': [0, 0],
  'outside+': [0, 1],
  'outside-': [1, 0],
  'inside+': [1, 1],
  'inside-': [0, 0],
  'center+': [-1, 1],
  'center-': [-1, 0]
};

export function calcFlush(moveobj, withobj, axes, mside, wside) {
  depreciated('calcFlush', false, 'Use calcSnap instead.');

  var side;

  if (mside === 0 || mside === 1) {
    // wside = wside !== undefined ? wside : mside;
    side = [wside !== undefined ? wside : mside, mside];
  } else {
    side = flushSide[mside];
    if (!side) error('invalid side: ' + mside);
  }

  var m = moveobj.getBounds();
  var w = withobj.getBounds();

  // Add centroid if needed
  if (side[0] === -1) {
    w[-1] = array.toxyz(withobj.centroid());
  }

  return this.axisApply(axes, function(i, axis) {
    return w[side[0]][axis] - m[side[1]][axis];
  });
}

export function calcSnap(moveobj, withobj, axes, orientation, delta = 0) {
  var side = flushSide[orientation];

  if (!side) {
    var fix = {
      '01': 'outside+',
      '10': 'outside-',
      '11': 'inside+',
      '00': 'inside-',
      '-11': 'center+',
      '-10': 'center-'
    };

    error(
      'calcSnap: invalid side: ' +
        orientation +
        ' should be ' +
        fix['' + orientation + delta]
    );
  }

  var m = moveobj.getBounds();
  var w = withobj.getBounds();

  // Add centroid if needed
  if (side[0] === -1) {
    w[-1] = withobj.centroid();
  }

  var t = axisApply(axes, function(i, axis) {
    return w[side[0]][axis] - m[side[1]][axis];
  });

  return delta
    ? axisApply(axes, function(i) {
      return t[i] + delta;
    })
    : t;
}

export function snap(moveobj, withobj, axis, orientation, delta) {
  debug('snap', moveobj, withobj, axis, orientation, delta);
  var t = calcSnap(moveobj, withobj, axis, orientation, delta);
  return moveobj.translate(t);
}

/**
 * Moves an object flush with another object
 * @param  {CSG} moveobj Object to move
 * @param  {CSG} withobj Object to make flush with
 * @param  {String} axis    Which axis: 'x', 'y', 'z'
 * @param  {Number} mside   0 or 1
 * @param  {Number} wside   0 or 1
 * @return {CSG}         [description]
 */
export function flush(moveobj, withobj, axis, mside, wside) {
  return moveobj.translate(calcFlush(moveobj, withobj, axis, mside, wside));
}

export function axisApply(axes, valfun, a) {
  debug('axisApply', axes, valfun, a);
  var retval = a || [0, 0, 0];
  var lookup = {
    x: 0,
    y: 1,
    z: 2
  };
  axes.split('').forEach(function(axis) {
    retval[lookup[axis]] = valfun(lookup[axis], axis);
  });

  return retval;
}

export function axis2array(axes, valfun) {
  depreciated('axis2array');
  var a = [0, 0, 0];
  var lookup = {
    x: 0,
    y: 1,
    z: 2
  };

  axes.split('').forEach(function(axis) {
    var i = lookup[axis];
    a[i] = valfun(i, axis);
  });
  return a;
}

export function centroid(o, objectSize) {
  var bounds = o.getBounds();
  objectSize = objectSize || size(bounds);

  return bounds[0].plus(objectSize.dividedBy(2));
}

export function calcmidlineTo(o, axis, to) {
  var bounds = o.getBounds();
  var objectSize = size(bounds);

  return axisApply(axis, function(i, a) {
    return to - objectSize[a] / 2;
  });
}

export function midlineTo(o, axis, to) {
  return o.translate(calcmidlineTo(o, axis, to));
}

export function translator(o, axis, withObj) {
  var objectCentroid = centroid(o);
  var withCentroid = centroid(withObj);
  // echo('centerWith', centroid, withCentroid);
  var t = axisApply(axis, function(i) {
    return withCentroid[i] - objectCentroid[i];
  });

  return t;
}

export function calcCenterWith(o, axes, withObj, delta = 0) {
  var objectCentroid = centroid(o);
  var withCentroid = centroid(withObj);

  var t = axisApply(axes, function(i, axis) {
    return withCentroid[axis] - objectCentroid[axis];
  });

  return delta ? array.add(t, delta) : t;
}

export function centerWith(o, axis, withObj) {
  return o.translate(calcCenterWith(o, axis, withObj));
}

/**
 * Given an size, bounds and an axis, a Point
 * along the axis will be returned.  If no `offset`
 * is given, then the midway point on the axis is returned.
 * When the `offset` is positive, a point `offset` from the
 * mininum axis is returned.  When the `offset` is negative,
 * the `offset` is subtracted from the axis maximum.
 * @param  {Size} size    Size array of the object
 * @param  {Bounds} bounds  Bounds of the object
 * @param  {String} axis    Axis to find the point on
 * @param  {Number} offset  Offset from either end
 * @param  {Boolean} nonzero When true, no offset values under 1e-4 are allowed.
 * @return {Point}         The point along the axis.
 */
export function getDelta(size, bounds, axis, offset, nonzero) {
  if (!isEmpty(offset) && nonzero) {
    if (Math.abs(offset) < 1e-4) {
      offset = 1e-4 * (isNegative(offset) ? -1 : 1);
    }
  }
  // if the offset is negative, then it's an offset from
  // the positive side of the axis
  var dist = isNegative(offset) ? (offset = size[axis] + offset) : offset;
  return axisApply(axis, function(i, a) {
    return bounds[0][a] + (isEmpty(dist) ? size[axis] / 2 : dist);
  });
}

/**
 * Cut an object into two pieces, along a given axis. The offset
 * allows you to move the cut plane along the cut axis.  For example,
 * a 10mm cube with an offset of 2, will create a 2mm side and an 8mm side.
 *
 * Negative offsets operate off of the larger side of the axes.  In the previous example, an offset of -2 creates a 8mm side and a 2mm side.
 *
 * You can angle the cut plane and poistion the rotation point.
 *
 * ![bisect example](../images/bisect.png)
 * @param  {CSG} object object to bisect
 * @param  {string} axis   axis to cut along
 * @param  {number} offset offset to cut at
 * @param  {number} angle angle to rotate the cut plane to
 * @param  {string} rotateaxis
 * @param  {number} rotateoffset
 * @param  {Object} options
 * @return {object}  Returns a group object with a parts object.
 */
export function bisect(
  object,
  axis,
  offset,
  angle,
  rotateaxis,
  rotateoffset,
  options = {}
) {
  options = Object.assign(options, {
    addRotationCenter: false
  });
  angle = angle || 0;
  var info = normalVector(axis);
  var bounds = object.getBounds();
  var objectSize = size(object);

  rotateaxis =
    rotateaxis ||
    {
      x: 'y',
      y: 'x',
      z: 'x'
    }[axis];

  var cutDelta = options.cutDelta || getDelta(objectSize, bounds, axis, offset);
  var rotateOffsetAxis = {
    xy: 'z',
    yz: 'x',
    xz: 'y'
  }[[axis, rotateaxis].sort().join('')];
  var centroid = object.centroid();
  var rotateDelta = getDelta(
    objectSize,
    bounds,
    rotateOffsetAxis,
    rotateoffset
  );

  var rotationCenter =
    options.rotationCenter ||
    new CSG.Vector3D(
      axisApply('xyz', function(i, a) {
        if (a == axis) return cutDelta[i];
        if (a == rotateOffsetAxis) return rotateDelta[i];
        return centroid[a];
      })
    );
  var theRotationAxis = rotationAxes[rotateaxis];

  var cutplane = CSG.OrthoNormalBasis.GetCartesian(
    info.orthoNormalCartesian[0],
    info.orthoNormalCartesian[1]
  )
    .translate(cutDelta)
    .rotate(rotationCenter, theRotationAxis, angle);

  var g = Group('negative,positive', [
    object.cutByPlane(cutplane.plane).color('red'),
    object.cutByPlane(cutplane.plane.flipped()).color('blue')
  ]);

  if (options.addRotationCenter)
    g.add(
      unitAxis(objectSize.length() + 10, 0.5, rotationCenter),
      'rotationCenter'
    );

  return g;
}

/**
 * Wraps the `stretchAtPlane` call using the same
 * logic as `bisect`.
 * @param  {CSG} object   Object to stretch
 * @param  {String} axis     Axis to streatch along
 * @param  {Number} distance Distance to stretch
 * @param  {Number} offset   Offset along the axis to cut the object
 * @return {CSG}          The stretched object.
 */
export function stretch(object, axis, distance, offset) {
  var normal = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1]
  };
  var bounds = object.getBounds();
  var objectSize = size(object);
  var cutDelta = getDelta(objectSize, bounds, axis, offset, true);
  // debug('stretch.cutDelta', cutDelta, normal[axis]);
  return object.stretchAtPlane(normal[axis], cutDelta, distance);
}

/**
 * Takes two CSG polygons and createds a solid of `height`.
 * Similar to `CSG.extrude`, excdept you can resize either
 * polygon.
 * @param  {CAG} top    Top polygon
 * @param  {CAG} bottom Bottom polygon
 * @param  {number} height heigth of solid
 * @return {CSG}        generated solid
 */
export function poly2solid(top, bottom, height) {
  if (top.sides.length == 0) {
    // empty!
    return new CSG();
  }
  // var offsetVector = CSG.parseOptionAs3DVector(options, "offset", [0, 0, 10]);
  var offsetVector = CSG.Vector3D.Create(0, 0, height);
  var normalVector = CSG.Vector3D.Create(0, 1, 0);

  var polygons = [];
  // bottom and top
  polygons = polygons.concat(
    bottom._toPlanePolygons({
      translation: [0, 0, 0],
      normalVector: normalVector,
      flipped: !(offsetVector.z < 0)
    })
  );
  polygons = polygons.concat(
    top._toPlanePolygons({
      translation: offsetVector,
      normalVector: normalVector,
      flipped: offsetVector.z < 0
    })
  );
  // walls
  var c1 = new CSG.Connector(
    offsetVector.times(0),
    [0, 0, offsetVector.z],
    normalVector
  );
  var c2 = new CSG.Connector(
    offsetVector,
    [0, 0, offsetVector.z],
    normalVector
  );
  polygons = polygons.concat(
    bottom._toWallPolygons({
      cag: top,
      toConnector1: c1,
      toConnector2: c2
    })
  );
  // }

  return CSG.fromPolygons(polygons);
}

export function slices2poly(slices, options, axis) {
  var twistangle = (options && parseFloat(options.twistangle)) || 0;

  var twiststeps =
    (options && parseInt(options.twiststeps)) || CSG.defaultResolution3D;
  if (twistangle == 0 || twiststeps < 1) {
    twiststeps = 1;
  }

  var normalVector = options.si.normalVector;

  var polygons = [];

  // bottom and top
  var first = array.first(slices);
  var last = array.last(slices);
  var up = first.offset[axis] > last.offset[axis];

  // _toPlanePolygons only works in the 'z' axis.  It's hard coded
  // to create the poly using 'x' and 'y'.
  polygons = polygons.concat(
    first.poly._toPlanePolygons({
      translation: first.offset,
      normalVector: normalVector,
      flipped: !up
    })
  );

  var rotateAxis = 'rotate' + axis.toUpperCase();
  polygons = polygons.concat(
    last.poly._toPlanePolygons({
      translation: last.offset,
      normalVector: normalVector[rotateAxis](twistangle),
      flipped: up
    })
  );

  // rotate with quick short circut
  var rotate =
    twistangle === 0
      ? function rotateZero(v) {
        return v;
      }
      : function rotate(v, angle, percent) {
        return v[rotateAxis](angle * percent);
      };

  // walls
  var connectorAxis = last.offset.minus(first.offset).abs();
  // debug('connectorAxis', connectorAxis);
  slices.forEach(function(slice, idx) {
    if (idx < slices.length - 1) {
      var nextidx = idx + 1;
      var top = !up ? slices[nextidx] : slice;
      var bottom = up ? slices[nextidx] : slice;

      var c1 = new CSG.Connector(
        bottom.offset,
        connectorAxis,
        rotate(normalVector, twistangle, idx / slices.length)
      );
      var c2 = new CSG.Connector(
        top.offset,
        connectorAxis,
        rotate(normalVector, twistangle, nextidx / slices.length)
      );

      // debug('slices2poly.slices', c1.point, c2.point);
      polygons = polygons.concat(
        bottom.poly._toWallPolygons({
          cag: top.poly,
          toConnector1: c1,
          toConnector2: c2
        })
      );
    }
  });

  return CSG.fromPolygons(polygons);
}

export function normalVector(axis) {
  var axisInfo = {
    z: {
      orthoNormalCartesian: ['X', 'Y'],
      normalVector: CSG.Vector3D.Create(0, 1, 0)
    },
    x: {
      orthoNormalCartesian: ['Y', 'Z'],
      normalVector: CSG.Vector3D.Create(0, 0, 1)
    },
    y: {
      orthoNormalCartesian: ['X', 'Z'],
      normalVector: CSG.Vector3D.Create(0, 0, 1)
    }
  };
  if (!axisInfo[axis]) error('normalVector: invalid axis ' + axis);
  return axisInfo[axis];
}

export function sliceParams(orientation, radius, bounds) {
  var axis = orientation[0];
  var direction = orientation[1];

  var dirInfo = {
    'dir+': {
      sizeIdx: 1,
      sizeDir: -1,
      moveDir: -1,
      positive: true
    },
    'dir-': {
      sizeIdx: 0,
      sizeDir: 1,
      moveDir: 0,
      positive: false
    }
  };

  var info = dirInfo['dir' + direction];

  return Object.assign(
    {
      axis: axis,
      cutDelta: axisApply(axis, function(i, a) {
        return bounds[info.sizeIdx][a] + Math.abs(radius) * info.sizeDir;
      }),
      moveDelta: axisApply(axis, function(i, a) {
        return bounds[info.sizeIdx][a] + Math.abs(radius) * info.moveDir;
      })
    },
    info,
    normalVector(axis)
  );
}

// export function solidFromSlices(slices, heights) {
//     var si = {
//         axis: 'z',
//         cutDelta: {},
//         moveDelta: {},
//         orthoNormalCartesian: ['X', 'Y'],
//         normalVector: CSG.Vector3D.Create(0, 1, 0)
//     };
// },

export function reShape(object, radius, orientation, options, slicer) {
  options = options || {};
  var b = object.getBounds();
  var ar = Math.abs(radius);
  var si = sliceParams(orientation, radius, b);

  if (si.axis !== 'z')
    throw new Error(
      'reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.'
    );

  var cutplane = CSG.OrthoNormalBasis.GetCartesian(
    si.orthoNormalCartesian[0],
    si.orthoNormalCartesian[1]
  ).translate(si.cutDelta);

  var slice = object.sectionCut(cutplane);

  var first = axisApply(si.axis, function() {
    return si.positive ? 0 : ar;
  });

  var last = axisApply(si.axis, function() {
    return si.positive ? ar : 0;
  });

  var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();

  var slices = slicer(first, last, slice);

  var delta = slices2poly(
    slices,
    Object.assign(options, {
      si: si
    }),
    si.axis
  ).color(options.color);

  var remainder = object.cutByPlane(plane);
  return union([
    options.unionOriginal ? object : remainder,
    delta.translate(si.moveDelta)
  ]);
}

export function chamfer(object, radius, orientation, options) {
  return reShape(object, radius, orientation, options, function(
    first,
    last,
    slice
  ) {
    return [
      {
        poly: slice,
        offset: new CSG.Vector3D(first)
      },
      {
        poly: enlarge(slice, [-radius * 2, -radius * 2]),
        offset: new CSG.Vector3D(last)
      }
    ];
  });
}

export function fillet(object, radius, orientation, options) {
  options = options || {};
  return reShape(object, radius, orientation, options, function(
    first,
    last,
    slice
  ) {
    var v1 = new CSG.Vector3D(first);
    var v2 = new CSG.Vector3D(last);

    var res = options.resolution || CSG.defaultResolution3D;

    var slices = array.range(0, res).map(function(i) {
      var p = i > 0 ? i / (res - 1) : 0;
      var v = v1.lerp(v2, p);

      var size = -radius * 2 - Math.cos(Math.asin(p)) * (-radius * 2);

      return {
        poly: enlarge(slice, [size, size]),
        offset: v
      };
    });

    return slices;
  });
}

export function calcRotate(part, solid, axis /* , angle */) {
  var axes = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1]
  };
  var rotationCenter = solid.centroid();
  var rotationAxis = axes[axis];
  return { rotationCenter, rotationAxis };
}

export function rotateAround(part, solid, axis, angle) {
  var { rotationCenter, rotationAxis } = calcRotate(part, solid, axis, angle);

  return part.rotate(rotationCenter, rotationAxis, angle);
}

export function clone(o) {
  return CSG.fromPolygons(o.toPolygons());
}
