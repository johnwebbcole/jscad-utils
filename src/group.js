import { Debug } from './debug';
const debug = Debug('jscadUtils:group');
import { CSG, union } from './jscad';

import {
  identity,
  toArray,
  calcSnap,
  mapPick,
  calcCenterWith,
  axisApply,
  zipObject
} from './util';

function group(names = [], parts = {}, holes = []) {
  this.name = '';
  this.names = names;
  this.parts = parts;
  this.holes = holes;
}

/**
 * Add a CSG object to the current group.
 * @param {CSG} object Object to add the parts dictionary.
 * @param {string} name   Name of the part
 * @param {boolean} hidden If true, then the part not be added during a default `combine()`
 * @param {string} subparts   Prefix for subparts if adding a group
 * @param {string} parts   When adding a group, you can pick the parts you want to include as the named part.
 * @function add
 */
group.prototype.add = function(object, name, hidden, subparts, parts) {
  var self = this;
  if (object.parts) {
    if (name) {
      // add the combined part
      if (!hidden) self.names.push(name);
      self.parts[name] = object.combine(parts);

      if (subparts) {
        Object.keys(object.parts).forEach(function(key) {
          self.parts[subparts + key] = object.parts[key];
        });
      }
    } else {
      Object.assign(self.parts, object.parts);
      self.names = self.names.concat(object.names);
    }
  } else {
    if (!hidden) self.names.push(name);
    self.parts[name] = object;
  }

  return self;
};

/**
 * @function combine
 * @param  {String} pieces  The parts to combine, if empty, then all named parts.
 * @param  {Object} options Combine options
 * @param  {Function} map     A function that is run before unioning the parts together.
 * @return {CSG} A single `CSG` object of the unioned parts.
 */
group.prototype.combine = function(pieces, options = {}, map = x => x) {
  var self = this;
  options = Object.assign(
    {
      noholes: false
    },
    options
  );

  pieces = pieces ? pieces.split(',') : self.names;
  if (pieces.length === 0) {
    throw new Error(
      `no pieces found in ${self.name} pieces: ${pieces} parts: ${Object.keys(
        self.parts
      )} names: ${self.names}`
    );
  }
  var g = union(
    mapPick(
      self.parts,
      pieces,
      function(value, key, object) {
        return map ? map(value, key, object) : identity(value);
      },
      self.name
    )
  );

  return g.subtractIf(
    self.holes && Array.isArray(self.holes) ? union(self.holes) : self.holes,
    self.holes && !options.noholes
  );
};

/**
 * Apply a function to each element in the group.
 * @param  {Function} cb Callback founction applied to each part.
 * It is called with the parameters `(value, key)`
 * @return {Object}      Returns this object so it can be chained
 * @function map
 */
group.prototype.map = function(cb) {
  var self = this;
  self.parts = Object.keys(self.parts)
    .filter(k => k !== 'holes')
    .reduce(function(result, key) {
      result[key] = cb(self.parts[key], key);
      return result;
    }, {});

  if (self.holes) {
    if (Array.isArray(self.holes)) {
      self.holes = self.holes.map(function(hole, idx) {
        return cb(hole, idx);
      });
    } else {
      self.holes = cb(self.holes, 'holes');
    }
  }
  return self;
};

/**
 * Clone a group into a new group.
 * @function clone
 * @param  {Function} map A function called on each part.
 * @return {group} The new group.
 */
group.prototype.clone = function(map) {
  var self = this;
  if (!map) map = identity;

  // console.warn('clone() has been refactored');
  var group = Group();
  Object.keys(self.parts).forEach(function(key) {
    var part = self.parts[key];
    var hidden = self.names.indexOf(key) == -1;
    group.add(map(CSG.fromPolygons(part.toPolygons())), key, hidden);
  });

  if (self.holes) {
    group.holes = toArray(self.holes).map(function(part) {
      return map(CSG.fromPolygons(part.toPolygons()), 'holes');
    });
  }
  return group;
};

/**
 * Rotate the group around a solids centroid. This mutates the group.
 * @param  {CSG|String} solid The solid to rotate the group around
 * @param  {String} axis  Axis to rotate
 * @param  {Number} angle Angle in degrees
 * @return {group}       The rotoated group.
 * @function rotate
 */
group.prototype.rotate = function(solid, axis, angle) {
  var self = this;
  var axes = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1]
  };
  if (typeof solid === 'string') {
    var _names = solid;
    solid = self.combine(_names);
  }
  var rotationCenter = solid.centroid();
  var rotationAxis = axes[axis];

  self.map(function(part) {
    return part.rotate(rotationCenter, rotationAxis, angle);
  });

  return self;
};

/**
 * Combines all parts, named and unnamed.
 * @function combineAll
 * @param  {Object} options Combine options.
 * @param  {Function} map     A function run on each part before unioning.
 * @return {CSG} A `CSG` object of all combined parts.
 */
group.prototype.combineAll = function(options, map) {
  var self = this;
  return self.combine(Object.keys(self.parts).join(','), options, map);
};

/**
 * Snaps a named part of a group to another `CSG` objects
 * bounding box.
 * @function snap
 * @param  {String} part       Comma separated list of parts in the group to snap.
 * @param  {CSG} to          A `CSG` object to snap the parts to.
 * @param  {String} axis        An axis string to snap on can be any combination of `x`, `y`, or `z`.
 * @param  {String} orientation This orientation to snap to on the axis.  A combination of `inside` or `outside` with a `+` or `-` sign.
 * @param  {Number} delta       An offset to apply with the snap, in millimeters.
 * @return {group} The group after snapping all parts to the `to` object.
 */
group.prototype.snap = function snap(part, to, axis, orientation, delta) {
  var self = this;
  // debug(', self);
  var t = calcSnap(self.combine(part), to, axis, orientation, delta);
  self.map(function(part) {
    return part.translate(t);
  });

  return self;
};

/**
 * Aligns all parts in a group to another `CSG` object.
 * @function align
 * @param  {String} part       Comma separated list of parts in the group to align.
 * @param  {CSG} to          A `CSG` object to align the parts to.
 * @param  {String} axis        An axis string to align on can be any combination of `x`, `y`, or `z`.
 * @param  {Number} delta       An offset to apply with the align, in millimeters.
 * @return {group} The group after aligning all parts to the `to` object.
 
 */
group.prototype.align = function align(part, to, axis, delta) {
  var self = this;
  var t = calcCenterWith(
    self.combine(part, { noholes: true }),
    axis,
    to,
    delta
  );
  self.map(function(part /*, name */) {
    return part.translate(t);
  });

  // if (self.holes)
  //     self.holes = util.ifArray(self.holes, function(hole) {
  //         return hole.translate(t);
  //     });

  return self;
};

/**
 * @function midlineTo
 * @param  {String} part       Comma separated list of parts in the group to align.
 * @param  {CSG} to          A `CSG` object to align the parts to.
 * @param  {String} axis        An axis string to align on can be any combination of `x`, `y`, or `z`.
 * @return {group} The group after aligning all parts to the `to` object.
 */
group.prototype.midlineTo = function midlineTo(part, axis, to) {
  var self = this;
  var size = self.combine(part).size();
  var t = axisApply(axis, function(i, a) {
    return to - size[a] / 2;
  });
  // debug(' part, t);
  // var t = util.calcCenterWith(self.combine(part), axis, to, delta);
  self.map(function(part) {
    return part.translate(t);
  });

  // if (self.holes)
  //     self.holes = util.ifArray(self.holes, function(hole) {
  //         return hole.translate(t);
  //     });

  return self;
};

/**
 * Translates a group by a given ammount
 * @function translate
 * @param  {Number|Array} x The `x` value or an array of x, y and z.
 * @param  {Number} y The `y` value.
 * @param  {Number} z The `z` value.
 * @return {group} The translated group.
 */
group.prototype.translate = function translate(x, y, z) {
  var self = this;

  var t = Array.isArray(x) ? x : [x, y, z];
  debug('translate', t);
  self.map(function(part) {
    return part.translate(t);
  });

  // if (self.holes)
  //     self.holes = util.ifArray(self.holes, function(hole) {
  //         return hole.translate(t);
  //     });

  return self;
};

/**
 * Returns a new group from the list of parts.
 * @function pick
 * @param  {String} parts A comma separted string of parts to include in the new group.
 * @param  {function} map   A function run on each part as its added to the new group.
 * @return {group} The new group with the picked parts.
 */
group.prototype.pick = function(parts, map) {
  var self = this;
  var p = (parts && parts.length > 0 && parts.split(',')) || self.names;
  if (!map) map = identity;

  var g = Group();
  p.forEach(function(name) {
    g.add(map(CSG.fromPolygons(self.parts[name].toPolygons()), name), name);
  });
  return g;
};

/**
 * Converts a group into an array of `CSG` objects.
 * @function array
 * @param  {String} parts A comma separated list of parts it include in the new array.
 * @param  {Function} map   A function run on each part as its added to the new array.
 * @return {Array} An array of `CSG` objects
 */
group.prototype.array = function(parts, map) {
  var self = this;
  var p = (parts && parts.length > 0 && parts.split(',')) || self.names;
  if (!map) map = identity;

  var a = [];
  p.forEach(function(name) {
    a.push(map(CSG.fromPolygons(self.parts[name].toPolygons()), name));
  });
  return a;
};

/**
 * Converts all pieces or the picked pieces of a group into an array of `CSG`
 * objects.
 * @function toArray
 * @param  {String} pieces Comma separated string of parts to convert.  All named parts if empty.
 * @return {Array} An array of `CSG` objects.
 * @deprecated Use `array` instead of `toArray`.
 */
group.prototype.toArray = function(pieces) {
  var self = this;
  var piecesArray = pieces ? pieces.split(',') : self.names;

  return piecesArray.map(function(piece) {
    if (!self.parts[piece])
      console.error(`Cannot find ${piece} in ${self.names}`);
    return self.parts[piece];
  });
};

/**
 * Creates a `group` object given a comma separated
 * list of names, and an array or object.  If an object
 * is given, then the names list is used as the default
 * parts used when the `combine()` function is called.
 *
 * You can call the `combine()` function with a list of parts you want combined into one.
 *
 * The `map()` funciton allows you to modify each part
 * contained in the group object.
 *
 * @param  {string} names   Comma separated list of part names.
 * @param  {array | object} objects Array or object of parts.  If Array, the names list is used as names for each part.
 * @return {object}         An object that has a parts dictionary, a `combine()` and `map()` function.
 */
var Group = function Group(...args) {
  debug('Group', args);
  var self = { name: '', names: [], parts: {} };
  if (args && args.length > 0) {
    if (args.length === 2) {
      var [names, objects] = args;

      self.names = (names && names.length > 0 && names.split(',')) || [];

      if (Array.isArray(objects)) {
        self.parts = zipObject(self.names, objects);
      } else if (objects instanceof CSG) {
        self.parts = zipObject(self.names, [objects]);
      } else {
        self.parts = objects || {};
      }
    } else {
      var [objects] = args; // eslint-disable-line no-redeclare
      self.names = Object.keys(objects).filter(k => k !== 'holes');
      self.parts = Object.assign({}, objects);
      self.holes = objects.holes;
    }
  }

  return new group(self.names, self.parts, self.holes);
};

export default Group;
export { Group };
