var jscadUtils = (function (exports, jsCadCSG, scadApi) {
  'use strict';

  jsCadCSG = jsCadCSG && jsCadCSG.hasOwnProperty('default') ? jsCadCSG['default'] : jsCadCSG;
  scadApi = scadApi && scadApi.hasOwnProperty('default') ? scadApi['default'] : scadApi;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  /**
   * Convert degrees to radians.
   * @param  {Number} deg value in degrees
   * @return {Number}     value in radians
   */
  var toRadians = function toRadians(deg) {
    return deg / 180 * Math.PI;
  };
  /**
   * Convert radians to degrees.
   * @param  {Number} rad value in radians
   * @return {Number}     value in degrees
   */

  var toDegrees = function toDegrees(rad) {
    return rad * (180 / Math.PI);
  };
  /**
   * Solve a 90 degree triangle from two points.
   * @param  {Number} p1.x Point 1 x coordinate
   * @param  {Number} p1.y Point 1 y coordinate
   * @param  {Number} p2.x Point 2 x coordinate
   * @param  {Number} p2.y Point 2 y coordinate
   * @return {Object}    A triangle object {A,B,C,a,b,c}
   */

  var solve = function solve(p1, p2) {
    var r = {
      c: 90,
      A: Math.abs(p2.x - p1.x),
      B: Math.abs(p2.y - p1.y)
    };
    var brad = Math.atan2(r.B, r.A);
    r.b = this.toDegrees(brad); // r.C = Math.sqrt(Math.pow(r.B, 2) + Math.pow(r.A, 2));

    r.C = r.B / Math.sin(brad);
    r.a = 90 - r.b;
    return r;
  };
  /**
   * Solve a partial triangle object. Angles are in degrees.
   * Angle `C` is set to 90 degrees. Requires a Side and an
   * Angle.
   * @param  {Number} r.a Length of side `a`
   * @param  {Number} r.A Angle `A` in degrees
   * @param  {Number} r.b Length of side `b`
   * @param  {Number} r.B Angle `B` in degrees
   * @param  {Number} r.c Length of side `c`
   * @return {Object}   A solved triangle object {A,B,C,a,b,c}
   */

  var solve90SA = function solve90SA(r) {
    r = Object.assign(r, {
      C: 90
    });
    r.A = r.A || 90 - r.B;
    r.B = r.B || 90 - r.A;
    var arad = toRadians(r.A); // sinA = a/c
    // a = c * sinA
    // tanA = a/b
    // a = b * tanA

    r.a = r.a || (r.c ? r.c * Math.sin(arad) : r.b * Math.tan(arad)); // sinA = a/c

    r.c = r.c || r.a / Math.sin(arad); // tanA = a/b

    r.b = r.b || r.a / Math.tan(arad);
    return r;
  };
  var solve90ac = function solve90ac(r) {
    r = Object.assign(r, {
      C: 90
    }); // sinA = a/c
    // a = arcsin(a/c)

    var arad = Math.asin(r.a / r.c);
    r.A = toDegrees(arad);
    r.B = 90 - r.A; // tanA = a/b
    //   r.b = r.a / Math.tan(arad);
    // or
    // a*a + b*b = c*c
    // b*b = c*c - a*a
    // b = sqr(c*c - a*a)

    r.b = Math.sqrt(Math.pow(r.c, 2) - Math.pow(r.a, 2));
    return r;
  };

  var triangle = /*#__PURE__*/Object.freeze({
    toRadians: toRadians,
    toDegrees: toDegrees,
    solve: solve,
    solve90SA: solve90SA,
    solve90ac: solve90ac
  });

  /**
   * Divides all elements in th array by `f`
   * @param {Array} a
   * @param {Number} f
   */
  var div = function div(a, f) {
    return a.map(function (e) {
      return e / f;
    });
  };
  var addValue = function addValue(a, f) {
    return a.map(function (e) {
      return e + f;
    });
  };
  var addArray = function addArray(a, f) {
    return a.map(function (e, i) {
      return e + f[i];
    });
  };
  var add = function add(a) {
    return Array.prototype.slice.call(arguments, 1).reduce(function (result, arg) {
      if (Array.isArray(arg)) {
        result = util.array.addArray(result, arg);
      } else {
        result = util.array.addValue(result, arg);
      }

      return result;
    }, a);
  };
  /**
   * Converts an object with x, y, and z properties into
   * an array, or an array if passed an array.
   * @param {Object|Array} object
   */

  var fromxyz = function fromxyz(object) {
    return Array.isArray(object) ? object : [object.x, object.y, object.z];
  };
  var toxyz = function toxyz(a) {
    return {
      x: a[0],
      y: a[1],
      z: a[2]
    };
  };
  var first = function first(a) {
    return a ? a[0] : undefined;
  };
  var last = function last(a) {
    return a && a.length > 0 ? a[a.length - 1] : undefined;
  };
  var min = function min(a) {
    return a.reduce(function (result, value) {
      return value < result ? value : result;
    }, Number.MAX_VALUE);
  };
  var range = function range(a, b) {
    var result = [];

    for (var i = a; i < b; i++) {
      result.push(i);
    }

    return result;
  };

  var array = /*#__PURE__*/Object.freeze({
    div: div,
    addValue: addValue,
    addArray: addArray,
    add: add,
    fromxyz: fromxyz,
    toxyz: toxyz,
    first: first,
    last: last,
    min: min,
    range: range
  });

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

  var Group = function Group() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var self = {
      name: '',
      names: [],
      parts: {}
    };

    if (args && args.length > 0) {
      if (args.length === 2) {
        var names = args[0],
            objects = args[1];
        self.names = names && names.length > 0 && names.split(',') || [];

        if (Array.isArray(objects)) {
          self.parts = util.zipObject(self.names, objects);
        } else if (objects instanceof CSG) {
          self.parts = util.zipObject(self.names, [objects]);
        } else {
          self.parts = objects || {};
        }
      } else {
        var objects = args[0]; // eslint-disable-line no-redeclare

        self.names = Object.keys(objects).filter(function (k) {
          return k !== 'holes';
        });
        self.parts = Object.assign({}, objects);
        self.holes = objects.holes;
      }
    }
    /**
     * Apply a function to each element in the group.
     * @param  {Function} cb Callback founction applied to each part.
     * It is called with the parameters `(value, key)`
     * @return {Object}      Returns this object so it can be chained
     */


    self.map = function (cb) {
      self.parts = Object.keys(self.parts).filter(function (k) {
        return k !== 'holes';
      }).reduce(function (result, key) {
        result[key] = cb(self.parts[key], key);
        return result;
      }, {});

      if (self.holes) {
        if (Array.isArray(self.holes)) {
          self.holes = self.holes.map(function (hole, idx) {
            return cb(hole, idx);
          });
        } else {
          self.holes = cb(self.holes, 'holes');
        }
      }

      return self;
    };
    /**
     * Add a CSG object to the current group.
     * @param {CSG} object Object to add the parts dictionary.
     * @param {string} name   Name of the part
     * @param {boolean} hidden If true, then the part not be added during a default `combine()`
     * @param {string} subparts   Prefix for subparts if adding a group
     * @param {string} parts   When adding a group, you can pick the parts you want to include as the named part.
     */


    self.add = function (object, name, hidden, subparts, parts) {
      if (object.parts) {
        if (name) {
          // add the combined part
          if (!hidden) self.names.push(name);
          self.parts[name] = object.combine(parts);

          if (subparts) {
            Object.keys(object.parts).forEach(function (key) {
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

    self.clone = function (map) {
      if (!map) map = util.identity; // console.warn('clone() has been refactored');

      var group = util.group();
      Object.keys(self.parts).forEach(function (key) {
        var part = self.parts[key];
        var hidden = self.names.indexOf(key) == -1;
        group.add(map(CSG.fromPolygons(part.toPolygons())), key, hidden);
      });

      if (self.holes) {
        group.holes = util.toArray(self.holes).map(function (part) {
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
     * @return {Group}       The rotoated group.
     */


    self.rotate = function (solid, axis, angle) {
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
      self.map(function (part) {
        return part.rotate(rotationCenter, rotationAxis, angle);
      });
      return self;
    };

    self.combine = function (pieces, options, map) {
      options = Object.assign({
        noholes: false
      }, options);
      pieces = pieces ? pieces.split(',') : self.names;

      if (pieces.length === 0) {
        throw new Error("no pieces found in ".concat(self.name, " pieces: ").concat(pieces, " parts: ").concat(Object.keys(self.parts), " names: ").concat(self.names));
      }

      var g = union(util.mapPick(self.parts, pieces, function (value, key, object) {
        return map ? map(value, key, object) : util.identity(value);
      }, self.name));
      return g.subtractIf(self.holes && Array.isArray(self.holes) ? union(self.holes) : self.holes, self.holes && !options.noholes);
    };

    self.combineAll = function (options, map) {
      return self.combine(Object.keys(self.parts).join(','), options, map);
    };

    self.toArray = function (pieces) {
      pieces = pieces ? pieces.split(',') : self.names;
      return pieces.map(function (piece) {
        if (!self.parts[piece]) console.error("Cannot find ".concat(piece, " in ").concat(self.names));
        return self.parts[piece];
      });
    };

    self.snap = function snap(part, to, axis, orientation, delta) {
      // console.log('group.snap', part, self);
      var t = util.calcSnap(self.combine(part), to, axis, orientation, delta);
      self.map(function (part) {
        return part.translate(t);
      });
      return self;
    };

    self.align = function align(part, to, axis, delta) {
      var t = util.calcCenterWith(self.combine(part, {
        noholes: true
      }), axis, to, delta);
      self.map(function (part
      /*, name */
      ) {
        return part.translate(t);
      }); // if (self.holes)
      //     self.holes = util.ifArray(self.holes, function(hole) {
      //         return hole.translate(t);
      //     });

      return self;
    };

    self.midlineTo = function midlineTo(part, axis, to) {
      var size = self.combine(part).size();
      var t = util.axisApply(axis, function (i, a) {
        return to - size[a] / 2;
      }); // console.log('group.midlineTo', part, t);
      // var t = util.calcCenterWith(self.combine(part), axis, to, delta);

      self.map(function (part) {
        return part.translate(t);
      }); // if (self.holes)
      //     self.holes = util.ifArray(self.holes, function(hole) {
      //         return hole.translate(t);
      //     });

      return self;
    };

    self.translate = function translate() {
      var t = Array.prototype.slice.call(arguments, 0).reduce(function (result, arg) {
        // console.log('arg', arg);
        result = util.array.addArray(result, arg);
        return result;
      }, [0, 0, 0]); // console.log('group.translate', t);

      self.map(function (part) {
        return part.translate(t);
      }); // if (self.holes)
      //     self.holes = util.ifArray(self.holes, function(hole) {
      //         return hole.translate(t);
      //     });

      return self;
    };

    self.pick = function (parts, map) {
      var p = parts && parts.length > 0 && parts.split(',') || self.names;
      if (!map) map = util.identity;
      var g = util.group();
      p.forEach(function (name) {
        g.add(map(CSG.fromPolygons(self.parts[name].toPolygons()), name), name);
      });
      return g;
    };

    self.array = function (parts, map) {
      var p = parts && parts.length > 0 && parts.split(',') || self.names;
      if (!map) map = util.identity;
      var a = [];
      p.forEach(function (name) {
        a.push(map(CSG.fromPolygons(self.parts[name].toPolygons()), name));
      });
      return a;
    };

    return self;
  };

  // import array from 'src/array';
  var CSG$1 = jsCadCSG.CSG;
  var vector_text = scadApi.vector_text,
      rectangular_extrude = scadApi.rectangular_extrude,
      vector_char = scadApi.vector_char;
  var NOZZEL_SIZE = 0.4;
  var nearest = {
    /**
     * Return the largest number that is a multiple of the
     * nozzel size.
     * @param  {Number} desired                   Desired value
     * @param  {Number} [nozzel=NOZZEL_SIZE] Nozel size, defaults to `NOZZEL_SIZE`
     * @param  {Number} [nozzie=0]                Number of nozzel sizes to add to the value
     * @return {Number}                           Multiple of nozzel size
     */
    under: function under(desired) {
      var nozzel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOZZEL_SIZE;
      var nozzie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
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
    over: function over(desired) {
      var nozzel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOZZEL_SIZE;
      var nozzie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return (Math.ceil(desired / nozzel) + nozzie) * nozzel;
    }
  };
  /**
   * A function that reutrns the first argument.  Useful when
   * passing in a callback to modify something, and you want a
   * default functiont hat does nothing.
   * @param  {object} solid an object that will be returned
   * @return {object}       the first parameter passed into the function.
   */

  var identity = function identity(solid) {
    return solid;
  };
  /**
   * If `f` is a funciton, it is executed with `object` as the
   * parameter.  This is used in `CSG.unionIf` and `CSG.subtractIf`,
   * allowing you to pass a function instead of an object.  Since the
   * function isn't exeuted until called, the object to `union` or
   * `subtract` can be assembled only if the conditional is true.
   * @param  {object} object the context to run the function with.
   * @param  {function|object} f if a funciton it is executed, othewise the object is returned.
   * @return {object}        the result of the function or the object.
   */

  var result = function result(object, f) {
    if (typeof f === 'function') {
      return f.call(object);
    } else {
      return f;
    }
  };
  /**
   * Returns target object with default values assigned. If values already exist, they are not set.
   * @param  {object} target   The target object to return.
   * @param  {object} defaults Defalut values to add to the object if they don't already exist.
   * @return {object}          Target object with default values assigned.
   */

  var defaults = function defaults(target, _defaults) {
    depreciated('defaults', true, 'use Object.assign instead');
    return Object.assign(_defaults, target);
  };
  var isEmpty = function isEmpty(variable) {
    return typeof variable === 'undefined' || variable === null;
  };
  var isNegative = function isNegative(n) {
    return ((n = +n) || 1 / n) < 0;
  };
  /**
   * Print a message and CSG object bounds and size to the conosle.
   * @param  {String} msg Message to print
   * @param  {CSG} o   A CSG object to print the bounds and size of.
   */

  var print = function print(msg, o) {
    echo(msg, JSON.stringify(o.getBounds()), JSON.stringify(this.size(o.getBounds())));
  };
  var error = function error(msg) {
    if (console && console.error) console.error(msg); // eslint-disable-line no-console

    throw new Error(msg);
  };
  var depreciated = function depreciated(method, error, message) {
    var msg = method + ' is depreciated.' + (' ' + message || ''); // eslint-disable-next-line no-console

    if (!error && console && console.error) console[error ? 'error' : 'warn'](msg); // eslint-disable-line no-console

    if (error) throw new Error(msg);
  };
  /**
   * Convert an imperial `inch` to metric `mm`.
   * @param  {Number} x Value in inches
   * @return {Number}   Result in mm
   */

  function inch(x) {
    return x * 25.4;
  }
  /**
   * Convert metric `cm` to imperial `inch`.
   * @param  {Number} x Value in cm
   * @return {Number}   Result in inches
   */

  function cm(x) {
    return x / 25.4;
  }
  function label(text, x, y, width, height) {
    var l = vector_text(x || 0, y || 0, text); // l contains a list of polylines to draw

    var o = [];
    l.forEach(function (pl) {
      // pl = polyline (not closed)
      o.push(rectangular_extrude(pl, {
        w: width || 2,
        h: height || 2
      })); // extrude it to 3D
    });
    return this.center(union(o));
  }
  function text(text) {
    var l = vector_char(0, 0, text); // l contains a list of polylines to draw

    var _char = l.segments.reduce(function (result, segment) {
      var path = new CSG$1.Path2D(segment);
      var cag = path.expandToCAG(2); // console.log('reduce', result, segment, path, cag);

      return result ? result.union(cag) : cag;
    }, undefined);

    return _char;
  }
  var unitCube = function unitCube(length, radius) {
    radius = radius || 0.5;
    return CSG$1.cube({
      center: [0, 0, 0],
      radius: [radius, radius, length || 0.5]
    });
  };
  var unitAxis = function unitAxis(length, radius, centroid) {
    // echo(length, JSON.stringify(centroid));
    centroid = centroid || [0, 0, 0];
    return unitCube(length, radius).union([unitCube(length, radius).rotateY(90).setColor(0, 1, 0), unitCube(length, radius).rotateX(90).setColor(0, 0, 1)]).translate(centroid);
  };
  var toArray = function toArray(a) {
    return Array.isArray(a) ? a : [a];
  };
  var ifArray = function ifArray(a, cb) {
    return Array.isArray(a) ? a.map(cb) : cb(a);
  };
  /**
   * Returns an array of positions along an object on a given axis.
   * @param  {CSG} object   The object to calculate the segments on.
   * @param  {number} segments The number of segments to create.
   * @param  {string} axis     Axis to create the sgements on.
   * @return {Array}          An array of segment positions.
   */

  var segment = function segment(object, segments, axis) {
    var size = object.size()[axis];
    var width = size / segments;
    var result = [];

    for (var i = width; i < size; i += width) {
      result.push(i);
    }

    return result;
  };
  var zipObject = function zipObject(names, values) {
    return names.reduce(function (result, value, idx) {
      result[value] = values[idx];
      return result;
    }, {});
  }; // map: function (o, callback) {
  //     _.forIn(o, function (value, key) {
  //         // echo('util.map', key);
  //         if (value instanceof CSG) {
  //             // echo('key', value instanceof CSG);
  //             return value = callback(value, key);
  //         }
  //         return value;
  //     });
  //     return o;
  // },

  /**
   * Object map function, returns an array of the object mapped into an array.
   * @param  {object} o Object to map
   * @param  {function} f function to apply on each key
   * @return {array}   an array of the mapped object.
   */

  var map = function map(o, f) {
    return Object.keys(o).map(function (key) {
      return f(o[key], key, o);
    });
  };
  var mapValues = function mapValues(o, f) {
    return Object.keys(o).map(function (key) {
      return f(o[key], key);
    });
  };
  var pick = function pick(o, names) {
    return names.reduce(function (result, name) {
      result[name] = o[name];
      return result;
    }, {});
  };
  var mapPick = function mapPick(o, names, f, options) {
    return names.reduce(function (result, name) {
      if (!o[name]) {
        throw new Error("".concat(name, " not found in ").concat(options.name, ": ").concat(Object.keys(o).join(',')));
      }

      result.push(f ? f(o[name]) : o[name]);
      return result;
    }, []);
  };
  var divA = function divA(a, f) {
    return div(a, f);
  };
  var divxyz = function divxyz(size, x, y, z) {
    return {
      x: size.x / x,
      y: size.y / y,
      z: size.z / z
    };
  };
  var div$1 = function div(size, d) {
    return this.divxyz(size, d, d, d);
  };
  var mulxyz = function mulxyz(size, x, y, z) {
    return {
      x: size.x * x,
      y: size.y * y,
      z: size.z * z
    };
  };
  var mul = function mul(size, d) {
    return this.divxyz(size, d, d, d);
  };
  var xyz2array = function xyz2array(size) {
    return [size.x, size.y, size.z];
  };
  var rotationAxes = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1]
  };
  /**
   * Returns a `Vector3D` with the size of the object.
   * @param  {CSG} o A `CSG` like object or an array of `CSG.Vector3D` objects (the result of getBounds()).
   * @return {CSG.Vector3D}   Vector3d with the size of the object
   */

  var size = function size(o) {
    var bbox = o.getBounds ? o.getBounds() : o;
    var foo = bbox[1].minus(bbox[0]);
    return foo;
  };
  /**
   * Returns a scale factor (0.0-1.0) for an object
   * that will resize it by a value in size units instead
   * of percentages.
   * @param  {number} size  Object size
   * @param  {number} value Amount to add (negative values subtract) from the size of the object.
   * @return {number}       Scale factor
   */

  var scale = function scale(size, value) {
    if (value == 0) return 1;
    return 1 + 100 / (size / value) / 100;
  };
  var center = function center(object, size) {
    size = size || this.size(object.getBounds());
    return this.centerY(this.centerX(object, size), size);
  };
  var centerY = function centerY(object, size) {
    size = size || this.size(object.getBounds());
    return object.translate([0, -size.y / 2, 0]);
  };
  var centerX = function centerX(object, size) {
    size = size || this.size(object.getBounds());
    return object.translate([-size.x / 2, 0, 0]);
  };
  /**
   * Enlarge an object by scale units, while keeping the same
   * centroid.  For example util.enlarge(o, 1, 1, 1) enlarges
   * object o by 1mm in each access, while the centroid stays the same.
   * @param  {CSG} object [description]
   * @param  {number} x      [description]
   * @param  {number} y      [description]
   * @param  {number} z      [description]
   * @return {CSG}        [description]
   */

  var enlarge = function enlarge(object, x, y, z) {
    var a;

    if (Array.isArray(x)) {
      a = x;
    } else {
      a = [x, y, z];
    }

    var size = util.size(object);
    var centroid = util.centroid(object, size);
    var idx = 0;
    var t = util.map(size, function (i) {
      return util.scale(i, a[idx++]);
    });
    var new_object = object.scale(t);
    var new_centroid = util.centroid(new_object); /// Calculate the difference between the original centroid and the new

    var delta = new_centroid.minus(centroid).times(-1);
    return new_object.translate(delta);
  };
  /**
   * Fit an object inside a bounding box.  Often used
   * with text labels.
   * @param  {CSG} object            [description]
   * @param  {number | array} x                 [description]
   * @param  {number} y                 [description]
   * @param  {number} z                 [description]
   * @param  {boolean} keep_aspect_ratio [description]
   * @return {CSG}                   [description]
   */

  var fit = function fit(object, x, y, z, keep_aspect_ratio) {
    var a;

    if (Array.isArray(x)) {
      a = x;
      keep_aspect_ratio = y;
      x = a[0];
      y = a[1];
      z = a[2];
    } else {
      a = [x, y, z];
    } // var c = util.centroid(object);


    var size = this.size(object.getBounds());

    function scale(size, value) {
      if (value == 0) return 1;
      return value / size;
    }

    var s = [scale(size.x, x), scale(size.y, y), scale(size.z, z)];
    var min = util.array.min(s);
    return util.centerWith(object.scale(s.map(function (d, i) {
      if (a[i] === 0) return 1; // don't scale when value is zero

      return keep_aspect_ratio ? min : d;
    })), 'xyz', object);
  };
  function shift(object, x, y, z) {
    var hsize = this.div(this.size(object.getBounds()), 2);
    return object.translate(this.xyz2array(this.mulxyz(hsize, x, y, z)));
  }
  function zero(object) {
    var bounds = object.getBounds();
    return object.translate([0, 0, -bounds[0].z]);
  }
  function mirrored4(x) {
    return x.union([x.mirroredY(90), x.mirroredX(90), x.mirroredY(90).mirroredX(90)]);
  }
  var flushSide = {
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
  function calcFlush(moveobj, withobj, axes, mside, wside) {
    util.depreciated('calcFlush', false, 'Use util.calcSnap instead.');
    var side;

    if (mside === 0 || mside === 1) {
      // wside = wside !== undefined ? wside : mside;
      side = [wside !== undefined ? wside : mside, mside];
    } else {
      side = util.flushSide[mside];
      if (!side) util.error('invalid side: ' + mside);
    }

    var m = moveobj.getBounds();
    var w = withobj.getBounds(); // Add centroid if needed

    if (side[0] === -1) {
      w[-1] = util.array.toxyz(withobj.centroid());
    }

    return this.axisApply(axes, function (i, axis) {
      return w[side[0]][axis] - m[side[1]][axis];
    });
  }
  function calcSnap(moveobj, withobj, axes, orientation, delta) {
    var side = util.flushSide[orientation];

    if (!side) {
      var fix = {
        '01': 'outside+',
        '10': 'outside-',
        '11': 'inside+',
        '00': 'inside-',
        '-11': 'center+',
        '-10': 'center-'
      };
      util.error('util.calcSnap: invalid side: ' + orientation + ' should be ' + fix['' + orientation + delta]);
    }

    var m = moveobj.getBounds();
    var w = withobj.getBounds(); // Add centroid if needed

    if (side[0] === -1) {
      w[-1] = withobj.centroid();
    }

    var t = this.axisApply(axes, function (i, axis) {
      return w[side[0]][axis] - m[side[1]][axis];
    });
    return delta ? this.axisApply(axes, function (i) {
      return t[i] + delta;
    }) : t;
  }
  function snap(moveobj, withobj, axis, orientation, delta) {
    return moveobj.translate(util.calcSnap(moveobj, withobj, axis, orientation, delta));
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

  function flush(moveobj, withobj, axis, mside, wside) {
    return moveobj.translate(util.calcFlush(moveobj, withobj, axis, mside, wside));
  }
  var axisApply = function axisApply(axes, valfun, a) {
    var retval = a || [0, 0, 0];
    var lookup = {
      x: 0,
      y: 1,
      z: 2
    };
    axes.split('').forEach(function (axis) {
      retval[lookup[axis]] = valfun(lookup[axis], axis);
    });
    return retval;
  };
  var axis2array = function axis2array(axes, valfun) {
    util.depreciated('axis2array');
    var a = [0, 0, 0];
    var lookup = {
      x: 0,
      y: 1,
      z: 2
    };
    axes.split('').forEach(function (axis) {
      var i = lookup[axis];
      a[i] = valfun(i, axis);
    });
    return a;
  };
  var centroid = function centroid(o, size) {
    var bounds = o.getBounds();
    size = size || util.size(bounds);
    return bounds[0].plus(size.dividedBy(2));
  };
  function calcmidlineTo(o, axis, to) {
    var bounds = o.getBounds();
    var size = util.size(bounds); // var centroid = bounds[0].plus(size.dividedBy(2));
    // console.log('bounds', JSON.stringify(bounds), 'size', size, 'centroid', centroid);

    return util.axisApply(axis, function (i, a) {
      return to - size[a] / 2;
    });
  }
  function midlineTo(o, axis, to) {
    return o.translate(util.calcmidlineTo(o, axis, to));
  }
  function translator(o, axis, withObj) {
    var centroid = util.centroid(o);
    var withCentroid = util.centroid(withObj); // echo('centerWith', centroid, withCentroid);

    var t = util.axisApply(axis, function (i) {
      return withCentroid[i] - centroid[i];
    });
    return t;
  }
  function calcCenterWith(o, axes, withObj, delta) {
    var centroid = util.centroid(o);
    var withCentroid = util.centroid(withObj);
    var t = util.axisApply(axes, function (i, axis) {
      return withCentroid[axis] - centroid[axis];
    });
    return delta ? util.array.add(t, delta) : t;
  }
  function centerWith(o, axis, withObj) {
    return o.translate(util.calcCenterWith(o, axis, withObj));
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

  function getDelta(size, bounds, axis, offset, nonzero) {
    if (!util.isEmpty(offset) && nonzero) {
      if (Math.abs(offset) < 1e-4) {
        offset = 1e-4 * (util.isNegative(offset) ? -1 : 1);
      }
    } // if the offset is negative, then it's an offset from
    // the positive side of the axis


    var dist = util.isNegative(offset) ? offset = size[axis] + offset : offset;
    return util.axisApply(axis, function (i, a) {
      return bounds[0][a] + (util.isEmpty(dist) ? size[axis] / 2 : dist);
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
   * @return {object}  Returns a group object with a parts object.
   */

  function bisect(object, axis, offset, angle, rotateaxis, rotateoffset) {
    var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
    options = Object.assign(options, {
      addRotationCenter: false
    });
    angle = angle || 0;
    var info = util.normalVector(axis);
    var bounds = object.getBounds();
    var size = util.size(object);
    rotateaxis = rotateaxis || {
      x: 'y',
      y: 'x',
      z: 'x'
    }[axis]; // function getDelta(axis, offset) {
    //     // if the offset is negative, then it's an offset from
    //     // the positive side of the axis
    //     var dist = util.isNegative(offset) ? offset = size[axis] + offset : offset;
    //     return util.axisApply(axis, function (i, a) {
    //         return bounds[0][a] + (util.isEmpty(dist) ? size[axis] / 2 : dist);
    //     });
    // }

    var cutDelta = options.cutDelta || util.getDelta(size, bounds, axis, offset);
    var rotateOffsetAxis = {
      xy: 'z',
      yz: 'x',
      xz: 'y'
    }[[axis, rotateaxis].sort().join('')];
    var centroid = object.centroid();
    var rotateDelta = util.getDelta(size, bounds, rotateOffsetAxis, rotateoffset);
    var rotationCenter = options.rotationCenter || new CSG$1.Vector3D(util.axisApply('xyz', function (i, a) {
      if (a == axis) return cutDelta[i];
      if (a == rotateOffsetAxis) return rotateDelta[i];
      return centroid[a];
    }));
    var rotationAxis = util.rotationAxes[rotateaxis];
    var cutplane = CSG$1.OrthoNormalBasis.GetCartesian(info.orthoNormalCartesian[0], info.orthoNormalCartesian[1]).translate(cutDelta).rotate(rotationCenter, rotationAxis, angle);
    var g = Group('negative,positive', [object.cutByPlane(cutplane.plane).color('red'), object.cutByPlane(cutplane.plane.flipped()).color('blue')]);
    if (options.addRotationCenter) g.add(util.unitAxis(size.length() + 10, 0.5, rotationCenter), 'rotationCenter');
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

  function stretch(object, axis, distance, offset) {
    var normal = {
      x: [1, 0, 0],
      y: [0, 1, 0],
      z: [0, 0, 1]
    };
    var bounds = object.getBounds();
    var size = util.size(object);
    var cutDelta = util.getDelta(size, bounds, axis, offset, true); // console.log('stretch.cutDelta', cutDelta, normal[axis]);

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

  function poly2solid(top, bottom, height) {
    if (top.sides.length == 0) {
      // empty!
      return new CSG$1();
    } // var offsetVector = CSG.parseOptionAs3DVector(options, "offset", [0, 0, 10]);


    var offsetVector = CSG$1.Vector3D.Create(0, 0, height);
    var normalVector = CSG$1.Vector3D.Create(0, 1, 0);
    var polygons = []; // bottom and top

    polygons = polygons.concat(bottom._toPlanePolygons({
      translation: [0, 0, 0],
      normalVector: normalVector,
      flipped: !(offsetVector.z < 0)
    }));
    polygons = polygons.concat(top._toPlanePolygons({
      translation: offsetVector,
      normalVector: normalVector,
      flipped: offsetVector.z < 0
    })); // walls

    var c1 = new CSG$1.Connector(offsetVector.times(0), [0, 0, offsetVector.z], normalVector);
    var c2 = new CSG$1.Connector(offsetVector, [0, 0, offsetVector.z], normalVector);
    polygons = polygons.concat(bottom._toWallPolygons({
      cag: top,
      toConnector1: c1,
      toConnector2: c2
    })); // }

    return CSG$1.fromPolygons(polygons);
  }
  function slices2poly(slices, options, axis) {
    // console.log('util.slices2poly', options);
    // var resolution = slices.length;
    // var offsetVector = new CSG.Vector3D(options.offset);
    // var twistangle = CSG.parseOptionAsFloat(options, 'twistangle', 0);
    var twistangle = options && parseFloat(options.twistangle) || 0; // var twiststeps = CSG.parseOptionAsInt(
    //     options,
    //     'twiststeps',
    //     CSG.defaultResolution3D
    // );

    var twiststeps = options && parseInt(options.twiststeps) || CSG$1.defaultResolution3D;

    if (twistangle == 0 || twiststeps < 1) {
      twiststeps = 1;
    }

    var normalVector = options.si.normalVector;
    var polygons = []; // bottom and top

    var first = util.array.first(slices);
    var last = util.array.last(slices);
    var up = first.offset[axis] > last.offset[axis]; // _toPlanePolygons only works in the 'z' axis.  It's hard coded
    // to create the poly using 'x' and 'y'.

    polygons = polygons.concat(first.poly._toPlanePolygons({
      translation: first.offset,
      normalVector: normalVector,
      flipped: !up
    }));
    var rotateAxis = 'rotate' + axis.toUpperCase();
    polygons = polygons.concat(last.poly._toPlanePolygons({
      translation: last.offset,
      normalVector: normalVector[rotateAxis](twistangle),
      flipped: up
    })); // rotate with quick short circut

    var rotate = twistangle === 0 ? function rotateZero(v) {
      return v;
    } : function rotate(v, angle, percent) {
      return v[rotateAxis](angle * percent);
    }; // walls

    var connectorAxis = last.offset.minus(first.offset).abs(); // console.log('connectorAxis', connectorAxis);

    slices.forEach(function (slice, idx) {
      if (idx < slices.length - 1) {
        var nextidx = idx + 1;
        var top = !up ? slices[nextidx] : slice;
        var bottom = up ? slices[nextidx] : slice;
        var c1 = new CSG$1.Connector(bottom.offset, connectorAxis, rotate(normalVector, twistangle, idx / slices.length));
        var c2 = new CSG$1.Connector(top.offset, connectorAxis, rotate(normalVector, twistangle, nextidx / slices.length)); // console.log('slices2poly.slices', c1.point, c2.point);

        polygons = polygons.concat(bottom.poly._toWallPolygons({
          cag: top.poly,
          toConnector1: c1,
          toConnector2: c2
        }));
      }
    });
    return CSG$1.fromPolygons(polygons);
  }
  function normalVector(axis) {
    var axisInfo = {
      z: {
        orthoNormalCartesian: ['X', 'Y'],
        normalVector: CSG$1.Vector3D.Create(0, 1, 0)
      },
      x: {
        orthoNormalCartesian: ['Y', 'Z'],
        normalVector: CSG$1.Vector3D.Create(0, 0, 1)
      },
      y: {
        orthoNormalCartesian: ['X', 'Z'],
        normalVector: CSG$1.Vector3D.Create(0, 0, 1)
      }
    };
    if (!axisInfo[axis]) util.error('util.normalVector: invalid axis ' + axis);
    return axisInfo[axis];
  }
  function sliceParams(orientation, radius, bounds) {
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
    return Object.assign({
      axis: axis,
      cutDelta: util.axisApply(axis, function (i, a) {
        return bounds[info.sizeIdx][a] + Math.abs(radius) * info.sizeDir;
      }),
      moveDelta: util.axisApply(axis, function (i, a) {
        return bounds[info.sizeIdx][a] + Math.abs(radius) * info.moveDir;
      })
    }, info, util.normalVector(axis));
  } // export function solidFromSlices(slices, heights) {
  //     var si = {
  //         axis: 'z',
  //         cutDelta: {},
  //         moveDelta: {},
  //         orthoNormalCartesian: ['X', 'Y'],
  //         normalVector: CSG.Vector3D.Create(0, 1, 0)
  //     };
  // },

  function reShape(object, radius, orientation, options, slicer) {
    options = options || {};
    var b = object.getBounds(); // var s = util.size(b);

    var ar = Math.abs(radius);
    var si = util.sliceParams(orientation, radius, b);
    if (si.axis !== 'z') throw new Error('util.reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.');
    var cutplane = CSG$1.OrthoNormalBasis.GetCartesian(si.orthoNormalCartesian[0], si.orthoNormalCartesian[1]).translate(si.cutDelta);
    var slice = object.sectionCut(cutplane);
    var first = util.axisApply(si.axis, function () {
      return si.positive ? 0 : ar;
    });
    var last = util.axisApply(si.axis, function () {
      return si.positive ? ar : 0;
    });
    var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();
    var slices = slicer(first, last, slice);
    var delta = util.slices2poly(slices, Object.assign(options, {
      si: si
    }), si.axis).color(options.color);
    var remainder = object.cutByPlane(plane);
    return union([options.unionOriginal ? object : remainder, delta.translate(si.moveDelta)]);
  }
  function chamfer(object, radius, orientation, options) {
    return util.reShape(object, radius, orientation, options, function (first, last, slice) {
      return [{
        poly: slice,
        offset: new CSG$1.Vector3D(first)
      }, {
        poly: util.enlarge(slice, [-radius * 2, -radius * 2]),
        offset: new CSG$1.Vector3D(last)
      }];
    });
  }
  function fillet(object, radius, orientation, options) {
    options = options || {};
    return util.reShape(object, radius, orientation, options, function (first, last, slice) {
      var v1 = new CSG$1.Vector3D(first);
      var v2 = new CSG$1.Vector3D(last);
      var res = options.resolution || CSG$1.defaultResolution3D;
      var slices = util.array.range(0, res).map(function (i) {
        var p = i > 0 ? i / (res - 1) : 0;
        var v = v1.lerp(v2, p);
        var size = -radius * 2 - Math.cos(Math.asin(p)) * (-radius * 2);
        return {
          poly: util.enlarge(slice, [size, size]),
          offset: v
        };
      });
      return slices;
    });
  }
  function calcRotate(part, solid, axis
  /* , angle */
  ) {
    var axes = {
      x: [1, 0, 0],
      y: [0, 1, 0],
      z: [0, 0, 1]
    };
    var rotationCenter = solid.centroid();
    var rotationAxis = axes[axis];
    return {
      rotationCenter: rotationCenter,
      rotationAxis: rotationAxis
    };
  }
  function rotateAround(part, solid, axis, angle) {
    var _util$calcRotate = util.calcRotate(part, solid, axis, angle),
        rotationCenter = _util$calcRotate.rotationCenter,
        rotationAxis = _util$calcRotate.rotationAxis;

    return part.rotate(rotationCenter, rotationAxis, angle);
  }

  var util$1 = /*#__PURE__*/Object.freeze({
    NOZZEL_SIZE: NOZZEL_SIZE,
    nearest: nearest,
    identity: identity,
    result: result,
    defaults: defaults,
    isEmpty: isEmpty,
    isNegative: isNegative,
    print: print,
    error: error,
    depreciated: depreciated,
    inch: inch,
    cm: cm,
    label: label,
    text: text,
    unitCube: unitCube,
    unitAxis: unitAxis,
    toArray: toArray,
    ifArray: ifArray,
    segment: segment,
    zipObject: zipObject,
    map: map,
    mapValues: mapValues,
    pick: pick,
    mapPick: mapPick,
    divA: divA,
    divxyz: divxyz,
    div: div$1,
    mulxyz: mulxyz,
    mul: mul,
    xyz2array: xyz2array,
    rotationAxes: rotationAxes,
    size: size,
    scale: scale,
    center: center,
    centerY: centerY,
    centerX: centerX,
    enlarge: enlarge,
    fit: fit,
    shift: shift,
    zero: zero,
    mirrored4: mirrored4,
    flushSide: flushSide,
    calcFlush: calcFlush,
    calcSnap: calcSnap,
    snap: snap,
    flush: flush,
    axisApply: axisApply,
    axis2array: axis2array,
    centroid: centroid,
    calcmidlineTo: calcmidlineTo,
    midlineTo: midlineTo,
    translator: translator,
    calcCenterWith: calcCenterWith,
    centerWith: centerWith,
    getDelta: getDelta,
    bisect: bisect,
    stretch: stretch,
    poly2solid: poly2solid,
    slices2poly: slices2poly,
    normalVector: normalVector,
    sliceParams: sliceParams,
    reShape: reShape,
    chamfer: chamfer,
    fillet: fillet,
    calcRotate: calcRotate,
    rotateAround: rotateAround
  });

  /**
   * Color utilities for jscad.  Makes setting colors easier using css color names.  Using `.init()` adds a `.color()` function to the CSG object.
   * > You must use `Colors.init(CSG)` in the `main()` function.  The `CSG` class is not available before this.
   * @example
   *include('jscad-utils-color.jscad');
   *
   *function mainx(params) {
   *   Colors.init(CSG);
   *
   *   // draws a purple cube
   *   return CSG.cube({radius: [10, 10, 10]}).color('purple');
   *}
   * @type {Object}
   * @module jscad-utils-color
   */

  var Colors = {
    nameArray: {
      aliceblue: '#f0f8ff',
      antiquewhite: '#faebd7',
      aqua: '#00ffff',
      aquamarine: '#7fffd4',
      azure: '#f0ffff',
      beige: '#f5f5dc',
      bisque: '#ffe4c4',
      black: '#000000',
      blanchedalmond: '#ffebcd',
      blue: '#0000ff',
      blueviolet: '#8a2be2',
      brown: '#a52a2a',
      burlywood: '#deb887',
      cadetblue: '#5f9ea0',
      chartreuse: '#7fff00',
      chocolate: '#d2691e',
      coral: '#ff7f50',
      cornflowerblue: '#6495ed',
      cornsilk: '#fff8dc',
      crimson: '#dc143c',
      cyan: '#00ffff',
      darkblue: '#00008b',
      darkcyan: '#008b8b',
      darkgoldenrod: '#b8860b',
      darkgray: '#a9a9a9',
      darkgrey: '#a9a9a9',
      darkgreen: '#006400',
      darkkhaki: '#bdb76b',
      darkmagenta: '#8b008b',
      darkolivegreen: '#556b2f',
      darkorange: '#ff8c00',
      darkorchid: '#9932cc',
      darkred: '#8b0000',
      darksalmon: '#e9967a',
      darkseagreen: '#8fbc8f',
      darkslateblue: '#483d8b',
      darkslategray: '#2f4f4f',
      darkslategrey: '#2f4f4f',
      darkturquoise: '#00ced1',
      darkviolet: '#9400d3',
      deeppink: '#ff1493',
      deepskyblue: '#00bfff',
      dimgray: '#696969',
      dimgrey: '#696969',
      dodgerblue: '#1e90ff',
      firebrick: '#b22222',
      floralwhite: '#fffaf0',
      forestgreen: '#228b22',
      fuchsia: '#ff00ff',
      gainsboro: '#dcdcdc',
      ghostwhite: '#f8f8ff',
      gold: '#ffd700',
      goldenrod: '#daa520',
      gray: '#808080',
      grey: '#808080',
      green: '#008000',
      greenyellow: '#adff2f',
      honeydew: '#f0fff0',
      hotpink: '#ff69b4',
      indianred: '#cd5c5c',
      indigo: '#4b0082',
      ivory: '#fffff0',
      khaki: '#f0e68c',
      lavender: '#e6e6fa',
      lavenderblush: '#fff0f5',
      lawngreen: '#7cfc00',
      lemonchiffon: '#fffacd',
      lightblue: '#add8e6',
      lightcoral: '#f08080',
      lightcyan: '#e0ffff',
      lightgoldenrodyellow: '#fafad2',
      lightgray: '#d3d3d3',
      lightgrey: '#d3d3d3',
      lightgreen: '#90ee90',
      lightpink: '#ffb6c1',
      lightsalmon: '#ffa07a',
      lightseagreen: '#20b2aa',
      lightskyblue: '#87cefa',
      lightslategray: '#778899',
      lightslategrey: '#778899',
      lightsteelblue: '#b0c4de',
      lightyellow: '#ffffe0',
      lime: '#00ff00',
      limegreen: '#32cd32',
      linen: '#faf0e6',
      magenta: '#ff00ff',
      maroon: '#800000',
      mediumaquamarine: '#66cdaa',
      mediumblue: '#0000cd',
      mediumorchid: '#ba55d3',
      mediumpurple: '#9370d8',
      mediumseagreen: '#3cb371',
      mediumslateblue: '#7b68ee',
      mediumspringgreen: '#00fa9a',
      mediumturquoise: '#48d1cc',
      mediumvioletred: '#c71585',
      midnightblue: '#191970',
      mintcream: '#f5fffa',
      mistyrose: '#ffe4e1',
      moccasin: '#ffe4b5',
      navajowhite: '#ffdead',
      navy: '#000080',
      oldlace: '#fdf5e6',
      olive: '#808000',
      olivedrab: '#6b8e23',
      orange: '#ffa500',
      orangered: '#ff4500',
      orchid: '#da70d6',
      palegoldenrod: '#eee8aa',
      palegreen: '#98fb98',
      paleturquoise: '#afeeee',
      palevioletred: '#d87093',
      papayawhip: '#ffefd5',
      peachpuff: '#ffdab9',
      peru: '#cd853f',
      pink: '#ffc0cb',
      plum: '#dda0dd',
      powderblue: '#b0e0e6',
      purple: '#800080',
      red: '#ff0000',
      rosybrown: '#bc8f8f',
      royalblue: '#4169e1',
      saddlebrown: '#8b4513',
      salmon: '#fa8072',
      sandybrown: '#f4a460',
      seagreen: '#2e8b57',
      seashell: '#fff5ee',
      sienna: '#a0522d',
      silver: '#c0c0c0',
      skyblue: '#87ceeb',
      slateblue: '#6a5acd',
      slategray: '#708090',
      slategrey: '#708090',
      snow: '#fffafa',
      springgreen: '#00ff7f',
      steelblue: '#4682b4',
      tan: '#d2b48c',
      teal: '#008080',
      thistle: '#d8bfd8',
      tomato: '#ff6347',
      turquoise: '#40e0d0',
      violet: '#ee82ee',
      wheat: '#f5deb3',
      white: '#ffffff',
      whitesmoke: '#f5f5f5',
      yellow: '#ffff00',
      yellowgreen: '#9acd32'
    },
    name2hex: function name2hex(n) {
      n = n.toLowerCase();
      if (!Colors.nameArray[n]) return 'Invalid Color Name';
      return Colors.nameArray[n];
    },
    hex2rgb: function hex2rgb(h) {
      h = h.replace(/^\#/, '');

      if (h.length === 6) {
        return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
      }
    },
    _name2rgb: {},
    name2rgb: function name2rgb(n) {
      if (!Colors._name2rgb[n]) Colors._name2rgb[n] = this.hex2rgb(this.name2hex(n));
      return Colors._name2rgb[n];
    },
    color: function color(o, r, g, b, a) {
      if (typeof r !== 'string') return this.setColor(r, g, b, a);
      if (r === '') return o; // shortcut for no color

      var c = Colors.name2rgb(r).map(function (x) {
        return x / 255;
      });
      c[3] = g || 1.0;
      return o.setColor(c);
    },

    /**
     * Initialize the Color utility.  This adds a `.color()` prototype to the `CSG` object.
     * @param  {CSG} CSG The global `CSG` object
     * @memberof module:jscad-utils-color
     * @augments CSG
     */
    init: function init(proto) {
      // if (proto.setColor) {
      var _setColor = proto.setColor; // eslint-disable-line no-unused-vars

      /**
       * Set the color of a CSG object using a css color name.  Also accepts the normal `setColor()` values.
       * @example
       * // creates a red cube
       * var redcube = CSG.cube({radius: [1, 1, 1]}).color('red');
       *
       * // creates a blue cube with the alpha channel at 50%
       * var bluecube =  CSG.cube({radius: [1, 1, 1]}).color('blue', 0.5);
       *
       * // creates a green cube with the alpha channel at 25%
       * // this is the same as the standard setColor
       * var greencube =  proto.cube({radius: [1, 1, 1]}).color(0, 1, 0, 0.25);
       * @param  {(String | Number)} [red or css name] - Css color name or the red color channel value (0.0 - 1.0)
       * @param  {Number} [green or alpha] - green color channel value (0.0 - 1.0) or the alpha channel when used with a css color string
       * @param  {Number} [blue] - blue color channel value (0.0 - 1.0)
       * @param  {Number} [alpha] - alpha channel value (0.0 - 1.0)
       * @return {CSG}   Returns a `CSG` object set to the desired color.
       * @memberof module:CSG
       * @alias color
       * @chainable
       * @augments CSG
       */

      proto.prototype.color = function (r, g, b, a) {
        if (!r) return this; // shortcut empty color values to do nothing.

        return Colors.color(this, r, g, b, a);
      }; // } else {
      //   console.error(
      //     `"${proto}" does not have a setColor function to add the Colors prototype to.  Make sure the object your trying to decorate with '.color' is correct.`
      //   );
      // }

    }
  };

  /**
   * Initialize `jscad-utils` and add utilities to the `proto` object.
   * @param  {proto} proto The global `proto` object
   * @augments proto
   */

  function init(proto) {
    Colors.init(proto);

    proto.prototype.flush = function flush(to, axis, mside, wside) {
      return util.flush(this, to, axis, mside, wside);
    };

    proto.prototype.snap = function snap(to, axis, orientation, delta) {
      return util.snap(this, to, axis, orientation, delta);
    };

    proto.prototype.calcSnap = function calcSnap(to, axis, orientation, delta) {
      return util.calcSnap(this, to, axis, orientation, delta);
    };

    proto.prototype.midlineTo = function midlineTo(axis, to) {
      return util.midlineTo(this, axis, to);
    };

    proto.prototype.calcmidlineTo = function midlineTo(axis, to) {
      return util.calcmidlineTo(this, axis, to);
    };

    proto.prototype.centerWith = function centerWith(axis, to) {
      util.depreciated('centerWith', true, 'Use align instead.');
      return util.centerWith(this, axis, to);
    };

    if (proto.center) echo('proto already has .center');

    proto.prototype.center = function center(axis) {
      // console.log('center', axis, this.getBounds());
      return util.centerWith(this, axis || 'xyz', util.unitCube(), 0);
    };

    proto.prototype.calcCenter = function centerWith(axis) {
      return util.calcCenterWith(this, axis || 'xyz', util.unitCube(), 0);
    };

    proto.prototype.align = function align(to, axis) {
      // console.log('align', to.getBounds(), axis);
      return util.centerWith(this, axis, to);
    };

    proto.prototype.calcAlign = function calcAlign(to, axis, delta) {
      return util.calcCenterWith(this, axis, to, delta);
    };

    proto.prototype.enlarge = function enlarge(x, y, z) {
      return util.enlarge(this, x, y, z);
    };

    proto.prototype.fit = function fit(x, y, z, a) {
      return util.fit(this, x, y, z, a);
    };

    if (proto.size) echo('proto already has .size');

    proto.prototype.size = function () {
      return util.size(this.getBounds());
    };

    proto.prototype.centroid = function () {
      return util.centroid(this);
    };

    proto.prototype.Zero = function zero() {
      return util.zero(this);
    };

    proto.prototype.Center = function Center(axes) {
      return this.align(util.unitCube(), axes || 'xy');
    };

    proto.Vector2D.prototype.map = function Vector2D_map(cb) {
      return new proto.Vector2D(cb(this.x), cb(this.y));
    };

    proto.prototype.fillet = function fillet(radius, orientation, options) {
      return util.fillet(this, radius, orientation, options);
    };

    proto.prototype.chamfer = function chamfer(radius, orientation, options) {
      return util.chamfer(this, radius, orientation, options);
    };

    proto.prototype.bisect = function bisect(axis, offset, angle, rotateaxis, rotateoffset, options) {
      return util.bisect(this, axis, offset, angle, rotateaxis, rotateoffset, options);
    };

    proto.prototype.stretch = function stretch(axis, distance, offset) {
      return util.stretch(this, axis, distance, offset);
    };

    proto.prototype.unionIf = function unionIf(object, condition) {
      return condition ? this.union(util.result(this, object)) : this;
    };

    proto.prototype.subtractIf = function subtractIf(object, condition) {
      return condition ? this.subtract(util.result(this, object)) : this;
    };

    proto.prototype._translate = proto.prototype.translate;
    /**
     * This modifies the normal `proto.translate` method to accept
     * multiple translations, adding the translations together.
     * The original translate is available on `proto._translate` and
     * a short circut is applied when only one parameter is given.
     * @return {proto} The resulting object.
     */

    proto.prototype.translate = function translate() {
      if (arguments.length === 1) {
        return this._translate(arguments[0]);
      } else {
        var t = Array.prototype.slice.call(arguments, 0).reduce(function (result, arg) {
          // console.log('arg', arg);
          result = util.array.addArray(result, arg);
          return result;
        }, [0, 0, 0]); // console.log('translate', t);

        return this._translate(t);
      }
    };
  }

  var init$1 = /*#__PURE__*/Object.freeze({
    'default': init
  });

  var CSG$2 = jsCadCSG.CSG;
  var parts = {
    BBox: BBox,
    Cube: Cube,
    RoundedCube: RoundedCube,
    Cylinder: Cylinder,
    Cone: Cone
  };
  function BBox() {
    var box = function box(object) {
      return CSG$2.cube({
        center: object.centroid(),
        radius: object.size().dividedBy(2)
      });
    };

    for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
      objects[_key] = arguments[_key];
    }

    return objects.reduce(function (bbox, part) {
      var object = bbox ? union([bbox, box(part)]) : part;
      return box(object);
    });
  }
  function Cube(width) {
    var r = div(fromxyz(width), 2);
    return CSG$2.cube({
      center: r,
      radius: r
    });
  }
  function RoundedCube() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (args[0].getBounds) {
      var size$1 = size(args[0].getBounds());
      var r = [size$1.x / 2, size$1.y / 2];
      var thickness = size$1.z;
      var corner_radius = args[1];
    } else {
      var r = [args[0] / 2, args[1] / 2]; // eslint-disable-line no-redeclare

      var thickness = args[2]; // eslint-disable-line no-redeclare

      var corner_radius = args[3]; // eslint-disable-line no-redeclare
    } // console.log('RoundedCube.args', size, r, thickness, corner_radius);


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
   * [Cylinder description]
   * @param {Number} diameter Diameter of the cylinder
   * @param {Number} height   Height of the cylinder
   * @param {Number} options  Options passed to the `CSG.cylinder` function.
   * @return {CSG} A CSG Cylinder
   */

  function Cylinder(diameter, height, options) {
    console.log('parts.Cylinder', diameter, height, options);
    options = _objectSpread2({}, options, {
      start: [0, 0, 0],
      end: [0, 0, height],
      radius: diameter / 2
    });
    return CSG$2.cylinder(options);
  }
  function Cone(diameter1, diameter2, height) {
    return CSG$2.cylinder({
      start: [0, 0, 0],
      end: [0, 0, height],
      radiusStart: diameter1 / 2,
      radiusEnd: diameter2 / 2
    });
  }
  /**
   * Crate a hexagon.
   * @param {number} diameter Outside diameter of the hexagon
   * @param {number} height   height of the hexagon
   */

  function Hexagon(diameter, height) {
    var radius = diameter / 2;
    var sqrt3 = Math.sqrt(3) / 2;
    var hex = CAG.fromPoints([[radius, 0], [radius / 2, radius * sqrt3], [-radius / 2, radius * sqrt3], [-radius, 0], [-radius / 2, -radius * sqrt3], [radius / 2, -radius * sqrt3]]);
    return hex.extrude({
      offset: [0, 0, height]
    });
  }
  function Triangle(base, height) {
    var radius = base / 2;
    var tri = CAG.fromPoints([[-radius, 0], [radius, 0], [0, Math.sin(30) * radius]]);
    return tri.extrude({
      offset: [0, 0, height]
    });
  }
  /**
   * Create a tube
   * @param {Number} outsideDiameter Outside diameter of the tube
   * @param {Number} insideDiameter  Inside diameter of the tube
   * @param {Number} height          Height of the tube
   * @param {Object} outsideOptions  Options passed to the outside cylinder
   * @param {Object} insideOptions   Options passed to the inside cylinder
   * @returns {CSG}  A CSG Tube
   */

  function Tube(outsideDiameter, insideDiameter, height, outsideOptions, insideOptions) {
    return Cylinder(outsideDiameter, height, outsideOptions).subtract(Cylinder(insideDiameter, height, insideOptions || outsideOptions));
  }
  /**
   *
   * @param {Number} width
   * @param {Number} height
   */

  function Anchor() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    var hole = Cylinder(width, height).Center().color('red');
    var post = Cylinder(height / 2, width * 0.66).rotateX(90).align(hole, 'xz').snap(hole, 'y', 'inside-').translate([0, 0, -height / 6]).color('purple');
    return Group({
      post: post,
      hole: hole
    });
  }
  function Board(width, height, corner_radius, thickness) {
    var r = divA([width, height], 2);
    var board = CAG.roundedRectangle({
      center: [r[0], r[1], 0],
      radius: r,
      roundradius: corner_radius
    }).extrude({
      offset: [0, 0, thickness || 1.62]
    });
    return board;
  }
  var Hardware = {
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
    Screw: function Screw(head, thread, headClearSpace, options) {
      options = defaults(options, {
        orientation: 'up',
        clearance: [0, 0, 0]
      });
      var orientation = Hardware.Orientation[options.orientation];
      var group = Group('head,thread', {
        head: head.color('gray'),
        thread: thread.snap(head, 'z', orientation.head).color('silver')
      });

      if (headClearSpace) {
        group.add(headClearSpace.enlarge(options.clearance).snap(head, 'z', orientation.clear).color('red'), 'headClearSpace', true);
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
    PanHeadScrew: function PanHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
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
    HexHeadScrew: function HexHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
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
    FlatHeadScrew: function FlatHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
      var head = Cone(headDiameter, diameter, headLength); // var head = Cylinder(headDiameter, headLength);

      var thread = Cylinder(diameter, length);

      if (clearLength) {
        var headClearSpace = Cylinder(headDiameter, clearLength);
      }

      return Hardware.Screw(head, thread, headClearSpace, options);
    }
  };

  var parts$1 = /*#__PURE__*/Object.freeze({
    'default': parts,
    BBox: BBox,
    Cube: Cube,
    RoundedCube: RoundedCube,
    Cylinder: Cylinder,
    Cone: Cone,
    Hexagon: Hexagon,
    Triangle: Triangle,
    Tube: Tube,
    Anchor: Anchor,
    Board: Board,
    Hardware: Hardware
  });

  /**
   * jscad box and join utilities.  This should be considered experimental,
   * but there are some usefull utilities here.
   *
   * ![parts example](../images/rabett.png)
   * @example
   *include('dist/jscad-utils.jscad');
   *
   *function mainx(params) {
   *     util.init(CSG);
   *
   *     var cyl = Parts.Cylinder(20, 20)
   *     var cbox = Boxes.Hollow(cyl, 3, function (box) {
   *       return box
   *           .fillet(2, 'z+')
   *           .fillet(2, 'z-');
   *     });
   *     var box = Boxes.Rabett(cbox, 3, 0.5, 11, 2)
   *     return box.parts.top.translate([0, 0, 10]).union(box.parts.bottom);
   *}
   * @type {Object}
   * @module Boxes
   */

  var Boxes = {
    /**
     * Create a [rabbet joint](https://en.wikipedia.org/wiki/Rabbet) in a CSG solid.
     * This was designed for cubes, but should work on other types of objects.
     *
     * Splits a CGS object into a top and bottom objects.  The two objects will
     * fit together with a rabbet join.
     * @param {CGS} box          [description]
     * @param {Number} thickness    [description]
     * @param {Number} cutHeight    [description]
     * @param {Number} rabbetHeight [description]
     * @param {Number} cheekGap     [description]
     * @return {Object} An object with `top` and `bottom` CGS objects.
     */
    RabbetJoin: function RabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap) {
      return rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap);
    },
    TopMiddleBottom: function topMiddleBottom(box, thickness) {
      // var r = util.array.add(getRadius(box), 1);
      // var negative = CSG.cube({
      //     center: r,
      //     radius: r
      // }).align(box, 'xyz').color('green');
      // var top = box.subtract(negative.translate([0, 0, -(thickness + 1)])).color('red');
      var bottom = box.bisect('z', thickness);
      var top = bottom.parts.positive.bisect('z', -thickness); // var bottom = box.subtract(negative.translate([0, 0, thickness])).color('blue');
      // var middle = box.subtract([top, bottom]);
      // return util.group('top,middle,bottom,negative', [top, middle, bottom, negative.translate([0, 0, -(thickness + 1)])]);

      return util.group('top,middle,bottom', [top.parts.positive, top.parts.negative.color('green'), bottom.parts.negative]);
    },

    /**
     * This will bisect an object using a rabett join.  Returns a
     * `group` object with `positive` and `negative` parts.
     * @param {CSG} box       The object to bisect.
     * @param {Number} thickness Thickness of the objects walls.
     * @param {Number} gap       Gap between the join cheeks.
     * @param {Number} height    Offset from the bottom to bisect the object at.  Negative numbers offset from the top.
     * @param {Number} face      Size of the join face.
     * @return {group} A group object with `positive`, `negative` parts.
     * @memberof module:Boxes
     */
    Rabett: function Rabett(box, thickness, gap, height, face) {
      gap = gap || 0.25;
      var inside = -thickness - gap;
      var outside = -thickness + gap;
      var group = util.group();
      var top = box.bisect('z', height);
      var bottom = top.parts.negative.bisect('z', height - face);
      group.add(union([top.parts.positive, bottom.parts.positive.subtract(bottom.parts.positive.enlarge(outside, outside, 0)).color('green')]), 'top');
      group.add(union([bottom.parts.negative, bottom.parts.positive.intersect(bottom.parts.positive.enlarge(inside, inside, 0)).color('yellow')]), 'bottom');
      return group;
    },

    /**
     * Used on a hollow object, this will rabett out the top and/or
     * bottom of the object.
     *
     * ![A hollow hexagon with removable top and bottom](../images/rabett-tb.png)
     *
     * @example
     *include('dist/jscad-utils.jscad');
     *
     *function mainx(params) {
     *     util.init(CSG);
     *     var part = Parts.Hexagon(20, 10).color('orange');
     *     var cbox = Boxes.Hollow(part, 3);
     *
     *     var box = Boxes.RabettTopBottom(cbox, 3, 0.25);
     *
     *
     *     return union([
     *         box.parts.top.translate([0, 0, 20]),
     *         box.parts.middle.translate([0, 0, 10]),
     *         box.parts.bottom
     *     ]);
     *}
     *
     * @param {CSG} box       A hollow object.
     * @param {Number} thickness The thickness of the object walls
     * @param {Number} gap       The gap between the top/bottom and the walls.
     * @param {Object} options   Options to have a `removableTop` or `removableBottom`.  Both default to `true`.
     * @param {Boolean} options.removableTop   The top will be removable.
     * @param {Boolean} options.removableBottom   The bottom will be removable.
     * @return {group} An A hollow version of the original object..
     * @memberof module:Boxes
     */
    RabettTopBottom: function rabbetTMB(box, thickness, gap) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      options = Object.assign(options, {
        removableTop: true,
        removableBottom: true,
        topWidth: -thickness,
        bottomWidth: thickness
      }); // console.log('RabettTopBottom', options);

      gap = gap || 0.25;
      var group = util.group('', {
        box: box
      });
      var inside = -thickness - gap;
      var outside = -thickness + gap;

      if (options.removableTop) {
        var top = box.bisect('z', options.topWidth);
        group.add(top.parts.positive.enlarge([inside, inside, 0]), 'top');
        if (!options.removableBottom) group.add(box.subtract(top.parts.positive.enlarge([outside, outside, 0])), 'bottom');
      }

      if (options.removableBottom) {
        // console.log('bottomWidth', options.bottomWidth);
        var bottom = box.bisect('z', options.bottomWidth);
        group.add(bottom.parts.negative.enlarge([outside, outside, 0]), 'bottomCutout', true);
        group.add(bottom.parts.negative.enlarge([inside, inside, 0]), 'bottom');
        if (!options.removableTop) group.add(box.subtract(group.parts.bottomCutout), 'top');
      }

      if (options.removableBottom && options.removableTop) {
        group.add(box.subtract(union([bottom.parts.negative.enlarge([outside, outside, 0]), top.parts.positive.enlarge([outside, outside, 0])])), 'middle');
      }

      return group;
    },
    CutOut: function cutOut(o, h, box, plug, gap) {
      gap = gap || 0.25; // console.log('cutOut', o.size(), h, b.size());
      // var r = getRadius(o);

      var s = o.size();
      var cutout = o.intersect(box);
      var cs = o.size();
      var clear = Parts.Cube([s.x, s.y, h]).align(o, 'xy').color('yellow');
      var top = clear.snap(o, 'z', 'center+').union(o);
      var back = Parts.Cube([cs.x + 6, 2, cs.z + 2.5]).align(cutout, 'x').snap(cutout, 'z', 'center+').snap(cutout, 'y', 'outside-');
      var clip = Parts.Cube([cs.x + 2 - gap, 1 - gap, cs.z + 2.5]).align(cutout, 'x').snap(cutout, 'z', 'center+').snap(cutout, 'y', 'outside-');
      return util.group('insert', {
        top: top,
        bottom: clear.snap(o, 'z', 'center-').union(o),
        cutout: union([o, top]),
        back: back.subtract(plug).subtract(clip.enlarge(gap, gap, gap)).subtract(clear.translate([0, 5, 0])),
        clip: clip.subtract(plug).color('red'),
        insert: union([o, top]).intersect(box).subtract(o).enlarge([-gap, 0, 0]).union(clip.subtract(plug).enlarge(-gap, -gap, 0)).color('blue')
      });
    },
    Rectangle: function Rectangle(size, thickness, cb) {
      thickness = thickness || 2;
      var s = util.array.div(util.xyz2array(size), 2);
      var r = util.array.add(s, thickness);
      var box = CSG.cube({
        center: r,
        radius: r
      }).subtract(CSG.cube({
        center: r,
        radius: s
      }));
      if (cb) box = cb(box); // return rabbetTMB(box.color('gray'), thickness, gap, options);

      return box;
    },

    /**
     * Takes a solid object and returns a hollow version with a selected
     * wall thickness.  This is done by reducing the object by half the
     * thickness and subtracting the reduced version from the original object.
     *
     * ![A hollowed out cylinder](../images/rabett.png)
     *
     * @param {CSG}   object    A CSG object
     * @param {Number}   thickness The thickness of the walls.
     * @param {Function} interiorcb        A callback that allows processing the object before returning.
     * * @param {Function} exteriorcb        A callback that allows processing the object before returning.
     * @return {CSG} An A hollow version of the original object..
     * @memberof module:Boxes
     */
    Hollow: function Hollow(object, thickness, interiorcb, exteriorcb) {
      thickness = thickness || 2;
      var size = -thickness * 2;
      interiorcb = interiorcb || util.identity;
      var box = object.subtract(interiorcb(object.enlarge([size, size, size])));
      if (exteriorcb) box = exteriorcb(box);
      return box;
    },

    /**
     * Create a box that surounds the object.
     * @param {CSG} o The object to create a bounding box for.
     * @return {CSG} The bounding box aligned with the object.
     * @memberof module:Boxes
     */
    BBox: function BBox(o) {
      var s = util.array.div(util.xyz2array(o.size()), 2);
      return CSG.cube({
        center: s,
        radius: s
      }).align(o, 'xyz');
    }
  };

  function getRadius(o) {
    return util.array.div(util.xyz2array(o.size()), 2);
  } // function cutBox(box, thickness, cutHeight, rabbetHeight, cheekGap) {
  //     var s = box.size();
  //     var r = util.array.add(getRadius(box), 1);
  //
  //     rabbetHeight = rabbetHeight || 5;
  //     var cutter = CSG.cube({
  //         center: [r[0], r[1], rabbetHeight],
  //         radius: [r[0], r[1], rabbetHeight]
  //     }).translate([0, 0, (cutHeight - rabbetHeight)]);
  //
  //     var negative = CSG.cube({
  //         center: r,
  //         radius: r
  //     }).color('green', .25);
  //
  //     var c = box.intersect(cutter);
  //
  //     cheekGap = cheekGap || 0.25;
  //
  //     var fRabbet = -thickness - cheekGap;
  //     var female = c.subtract(c.enlarge(fRabbet, fRabbet, 0)).color('yellow', 0.5);
  //     var mRabbet = -thickness + cheekGap;
  //     var male = c.subtract(c.enlarge(mRabbet, mRabbet, 0)).color('green', 0.5);
  //
  //     var toplip = c.subtract(female).color('red', 0.5);
  //     var bottomlip = male.color('blue', 0.5);
  //
  //     var top = box.subtract(cutter.union(negative.snap(cutter, 'z', 'outside-'))).color('white', 0.25).union(toplip);
  //     var bottom = box.subtract(cutter.union(negative.snap(cutter, 'z', 'outside+'))).color('white', 0.25).union(bottomlip);
  //     return {
  //         top: top.subtract(negative.snap(top, 'z', 'inside+').translate([0, 0, -thickness])),
  //         topsides: top.subtract(negative.snap(top, 'z', 'outside+').translate([0, 0, -thickness])),
  //         bottomsides: bottom.subtract(negative.snap(bottom, 'z', 'outside-').translate([0, 0, thickness])),
  //         bottom: bottom.subtract(negative.snap(bottom, 'z', 'inside-').translate([0, 0, thickness]))
  //     };
  // }


  function rabbetJoin(box, thickness, gap) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    // console.log('rabbetTMB', gap, options)
    options = Object.assign(options, {
      removableTop: true,
      removableBottom: true
    });
    gap = gap || 0.25;
    var r = util.array.add(getRadius(box), -thickness / 2);
    r[2] = thickness / 2;
    var cutter = CSG.cube({
      center: r,
      radius: r
    }).align(box, 'xy').color('green');
    var topCutter = cutter.snap(box, 'z', 'inside+'); // var placeholder = Boxes.topMiddleBottom(box, thickness);

    var group = util.group('', {
      topCutter: topCutter,
      bottomCutter: cutter // top: box.intersect(topCutter.enlarge([-gap, -gap, 0])),
      // middle: box.subtract(cutter.enlarge([gap, gap, 0])).subtract(topCutter.enlarge([gap, gap, 0])),
      // bottom: placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0]))

    }); // if (options.removableTop && options.removableBottom) {
    //     group.add(box.intersect(topCutter.enlarge([-gap, -gap, 0])), 'top');
    //     group.add(box.subtract(cutter.enlarge([gap, gap, 0])).subtract(topCutter.enlarge([gap, gap, 0])), 'middle');
    //     group.add(placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0])), 'bottom');
    // }
    //
    // if (options.removableTop && !options.removableBottom) {
    //     group.add(box.intersect(topCutter.enlarge([-gap, -gap, 0])), 'top');
    //     group.add(box.subtract(topCutter.enlarge([gap, gap, 0])), 'bottom');
    //     // group.add(placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0])), 'bottom');
    // }
    //
    // if (!options.removableTop && options.removableBottom) {
    //     // group.add(box.intersect(topCutter.enlarge([-gap, -gap, 0])), 'top');
    //     group.add(box.subtract(cutter.enlarge([gap, gap, 0])), 'top');
    //     group.add(placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0])), 'bottom');
    // }

    group.add(box.subtract(cutter.enlarge([gap, gap, 0])).color('blue'), 'top');
    group.add(box.subtract(topCutter.enlarge([gap, gap, 0])).color('red'), 'bottom');
    return group;
  } // function rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap) {
  //     var r = util.array.add(getRadius(box), 1);
  //
  //     rabbetHeight = rabbetHeight || 5;
  //     var rh = rabbetHeight / 2;
  //     // console.log('rabbetJoin', cutHeight, rabbetHeight, getRadius(box), r)
  //     var cutter = CSG.cube({
  //             center: [r[0], r[1], rh],
  //             radius: [r[0], r[1], rh]
  //         })
  //         .midlineTo('z', cutHeight);
  //
  //     var c = box.intersect(cutter).color('green');
  //
  //     cheekGap = cheekGap || 0.25;
  //     var fRabbet = -thickness - cheekGap;
  //     var female = c.subtract(c.enlarge(fRabbet, fRabbet, 0)).color('purple');
  //     var mRabbet = -thickness + cheekGap;
  //     var male = c.subtract(c.enlarge(mRabbet, mRabbet, 0)).color('orange');
  //
  //     var airGap = airGap || 0.35;
  //
  //     var b = util.bisect(box, 'z', cutHeight);
  //     b.parts.positive = b.parts.positive.subtract(female);
  //     b.parts.positiveCutout = util.bisect(female, 'z', rh + (cheekGap / 2)).parts.positive.color('orange');
  //     b.parts.positiveSupport = union([
  //             b.parts.positiveCutout.enlarge([airGap * 2, airGap * 2, 0]),
  //             b.parts.positiveCutout.enlarge([thickness / 2, thickness / 2, 0]),
  //             b.parts.positiveCutout.enlarge([thickness, thickness, 0])
  //         ])
  //         .enlarge([0, 0, -airGap]).translate([0, 0, -airGap / 2]).color('gray');
  //     b.parts.negative = b.parts.negative.subtract(c.subtract(male));
  //     b.parts.negativeCutout = util.bisect(c.subtract(male), 'z', rh + (cheekGap / 2)).parts.negative.color('orange');
  //     b.parts.negativeSupport = union([
  //             b.parts.negativeCutout.enlarge([-airGap * 2, -airGap * 2, 0]),
  //             b.parts.negativeCutout.enlarge([-thickness / 2, -thickness / 2, 0]),
  //             b.parts.negativeCutout.enlarge([-thickness, -thickness, 0])
  //         ])
  //         .enlarge([0, 0, -airGap]).translate([0, 0, airGap / 2]).color('gray');
  //     // b.parts.negativeCutout = c.subtract(male).color('orange');
  //     // console.log('b', b);
  //     return b;
  // }

  var compatV1 = _objectSpread2({}, util$1, {
    group: Group,
    init: init$1,
    triangle: triangle,
    array: array,
    parts: parts$1,
    Boxes: Boxes
  });

  exports.Boxes = Boxes;
  exports.Group = Group;
  exports.array = array;
  exports.compatV1 = compatV1;
  exports.init = init$1;
  exports.parts = parts$1;
  exports.triangle = triangle;
  exports.util = util$1;

  return exports;

}({}, jsCadCSG, scadApi));
