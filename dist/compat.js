/* eslint-disable */
var Parts, Boxes, Group, Debug, array, triUtils;
function initJscadutils(_CSG, options = {}) {
  options = Object.assign({ debug: '' }, options);
  var jsCadCSG = { CSG, CAG };
  var scadApi = {
    vector_text,
    rectangular_extrude,
    vector_char,
    primitives3d: {
      cube,
      sphere,
      cylinder
    },
    extrusions: {
      rectangular_extrude
    },
    text: {
      vector_text,
      vector_char
    },
    booleanOps: {
      union
    }
  };

  var jscadUtilsDebug = (options.debug.split(',') || []).reduce(
    (checks, check) => {
      if (check.startsWith('-')) {
        checks.disabled.push(
          new RegExp(`^${check.slice(1).replace(/\*/g, '.*?')}$`)
        );
      } else {
        checks.enabled.push(new RegExp(`^${check.replace(/\*/g, '.*?')}$`));
      }
      return checks;
    },
    { enabled: [], disabled: [] }
  );

  // include:compat
  // ../dist/index.js
var jscadUtils = (function (exports, jsCadCSG, scadApi) {
  'use strict';

  jsCadCSG = jsCadCSG && Object.prototype.hasOwnProperty.call(jsCadCSG, 'default') ? jsCadCSG['default'] : jsCadCSG;
  scadApi = scadApi && Object.prototype.hasOwnProperty.call(scadApi, 'default') ? scadApi['default'] : scadApi;

  var util = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get NOZZEL_SIZE () { return NOZZEL_SIZE; },
    get nearest () { return nearest; },
    get identity () { return identity; },
    get result () { return result; },
    get defaults () { return defaults; },
    get isEmpty () { return isEmpty; },
    get isNegative () { return isNegative; },
    get print () { return print; },
    get jscadToString () { return jscadToString; },
    get error () { return error; },
    get depreciated () { return depreciated; },
    get inch () { return inch; },
    get cm () { return cm; },
    get label () { return label; },
    get text () { return text; },
    get unitCube () { return unitCube; },
    get unitAxis () { return unitAxis; },
    get toArray () { return toArray; },
    get ifArray () { return ifArray; },
    get segment () { return segment; },
    get zipObject () { return zipObject; },
    get map () { return map; },
    get mapValues () { return mapValues; },
    get pick () { return pick; },
    get mapPick () { return mapPick; },
    get divA () { return divA; },
    get divxyz () { return divxyz; },
    get div () { return div$1; },
    get mulxyz () { return mulxyz; },
    get mul () { return mul; },
    get xyz2array () { return xyz2array; },
    get rotationAxes () { return rotationAxes; },
    get size () { return size; },
    get scale () { return scale; },
    get center () { return center; },
    get centerY () { return centerY; },
    get centerX () { return centerX; },
    get enlarge () { return enlarge; },
    get fit () { return fit; },
    get shift () { return shift; },
    get zero () { return zero; },
    get mirrored4 () { return mirrored4; },
    get flushSide () { return flushSide; },
    get calcFlush () { return calcFlush; },
    get calcSnap () { return calcSnap; },
    get snap () { return snap; },
    get flush () { return flush; },
    get axisApply () { return axisApply; },
    get axis2array () { return axis2array; },
    get centroid () { return centroid; },
    get calcmidlineTo () { return calcmidlineTo; },
    get midlineTo () { return midlineTo; },
    get translator () { return translator; },
    get calcCenterWith () { return calcCenterWith; },
    get centerWith () { return centerWith; },
    get getDelta () { return getDelta; },
    get bisect () { return bisect; },
    get slice () { return slice; },
    get wedge () { return wedge; },
    get stretch () { return stretch; },
    get poly2solid () { return poly2solid; },
    get slices2poly () { return slices2poly; },
    get normalVector () { return normalVector; },
    get sliceParams () { return sliceParams; },
    get reShape () { return reShape; },
    get chamfer () { return chamfer; },
    get fillet () { return fillet; },
    get calcRotate () { return calcRotate; },
    get rotateAround () { return rotateAround; },
    get clone () { return clone; },
    get addConnector () { return addConnector; }
  });

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

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
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /** @module triangle */

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
   *
   *       /\
   *      / B\
   *   c /    \  a
   *    /      \
   *   /A      C\
   *  /----------\
   *        b
   *
   *           /|
   *          /B|
   *         /  |
   *       c/   |a
   *       /A  C|
   *      /_____|
   *         b
   *
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
  /**
   * @function solveab
   * Solve a partial right triangle object from two sides (a and b). Angles are in degrees.
   * Angle `C` is set to 90 degrees. Requires a Side and an
   * Angle.
   *
   *           /|
   *          /B|
   *         /  |
   *       c/   |a
   *       /A  C|
   *      /_____|
   *         b
   *
   * @param  {Number} r.a Length of side `a`
   * @param  {Number} r.b Length of side `b`
   * @return {Object}   A solved triangle object {A,B,C,a,b,c}
   */

  function solveab(r) {
    r = Object.assign(r, {
      C: 90
    }); // c = sqr(a*a + b*b)

    r.c = Math.sqrt(Math.pow(r.a, 2) + Math.pow(r.b, 2)); // A = arcsin(a/c)

    r.A = toDegrees(Math.asin(r.a / r.c)); // B = arcsin(b/c);

    r.B = toDegrees(Math.asin(r.b / r.c));
    return r;
  }

  var triUtils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    toRadians: toRadians,
    toDegrees: toDegrees,
    solve: solve,
    solve90SA: solve90SA,
    solve90ac: solve90ac,
    solveab: solveab
  });

  /**
   * A set of array utilities.
   * @module array
   */

  /**
   * Divides all elements in th array by `f`
   * @function div
   * @param {Array} a
   * @param {Number} f
   * @memberof! array
   */
  var div = function div(a, f) {
    return a.map(function (e) {
      return e / f;
    });
  };
  /**
   * Adds a value to each element of an array of numbers.
   * @function addValue
   * @param  {Array} a Array of numbers.
   * @param  {Number} f A value to add to each element of the original array.
   * @return {Array} A new array with the values added together.
   */

  var addValue = function addValue(a, f) {
    return a.map(function (e) {
      return e + f;
    });
  };
  /**
   * Adds two arrays together.  The shorter array must be the first argument.
   *
   * @function addArray
   * @param  {Array} a An array of numbers.
   * @param  {Array} f Another array of numbers, if
   * @return {Array} A new array with the two values added together.
   */

  var addArray = function addArray(a, f) {
    return a.map(function (e, i) {
      return e + f[i];
    });
  };
  /**
   * Adds a value or array to another array.
   * @function add
   * @param  {Array} a An array of numbers .
   * @return {Array} A new array with the two values added together.
   */

  var add = function add(a) {
    return Array.prototype.slice.call(arguments, 1).reduce(function (result, arg) {
      if (Array.isArray(arg)) {
        result = addArray(result, arg);
      } else {
        result = addValue(result, arg);
      }

      return result;
    }, a);
  };
  /**
   * Converts an object with x, y, and z properties into
   * an array, or an array if passed an array.
   * @function fromxyz
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
  /**
   * Returns the first value of an array.
   * @function first
   * @param  {Array} a An array of numbers.
   * @return {Number} The value of the first element of the array or undefined.
   */

  var first = function first(a) {
    return a ? a[0] : undefined;
  };
  /**
   * @function last
   * @param  {Array} a An array of numbers.
   * @return {Number} The value of the last element of the array or undefined.
   */

  var last = function last(a) {
    return a && a.length > 0 ? a[a.length - 1] : undefined;
  };
  /**
   * Finds the minimum value of an array.
   * @function min
   * @param  {Array} a An array of numbers.
   * @return {Number} The minimum value in an array of numbers.
   */

  var min = function min(a) {
    return a.reduce(function (result, value) {
      return value < result ? value : result;
    }, Number.MAX_VALUE);
  };
  /**
   * Creates a array of numbers given the start and end points.
   * @function range
   * @param  {Number} a The starting value.
   * @param  {Number} b The ending value.
   * @return {Array} An array of values from `a` to `b`.
   */

  var range = function range(a, b) {
    var result = [];

    for (var i = a; i < b; i++) {
      result.push(i);
    }

    return result;
  };

  var array = /*#__PURE__*/Object.freeze({
    __proto__: null,
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

  /* globals jscadUtilsDebug */
  var debugColors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'];
  var termColors = ['\\033[0;34m', '\\033[0;32m', '\\033[0;36m', '\\033[0;31m', '\\033[0;35m', '\\033[0;33m', '\\033[1;33m', '\\033[0;30m', '\\033[1;34m'];
  var debugCount = 0;
  /**
   * Creates a function that uses `console.log` with a styled name.  The name
   * is checked against the `jscadUtilsDebug` settings `enabled` and `disabled` list.
   *
   * If the name is enabled, a function that uses `console.log` is returned, if it is
   * disabled, an empty function is returned.
   *
   * You can enable a debug logger in the `util.init` method by including a string of
   * comma separated names.  Wild cards with `*` are supported, and you can disable a
   * specific name using a `-` sign in front of the name.
   *
   * @example
   * util.init(CSG, { debug: 'jscadUtils:group' });
   *
   * @function Debug
   * @param  {String} name The name of the debug function.
   * @return {Function} A debug function if enabled otherwise an empty function.
   */

  var Debug = function Debug(name) {
    var checks = Object.assign({
      enabled: [],
      disabled: [],
      options: {
        browser: true
      }
    }, jscadUtilsDebug || {});
    var style = checks.options.browser ? "color:".concat(debugColors[debugCount++ % debugColors.length]) : "".concat(termColors[debugCount++ % termColors.length]);
    var enabled = checks.enabled.some(function checkEnabled(check) {
      return check.test(name);
    }) && !checks.disabled.some(function checkEnabled(check) {
      return check.test(name);
    });
    var logger = enabled ? checks.options.browser ? function () {
      var _console;

      for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
        msg[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['%c%s', style, name].concat(msg));
    } : function () {
      var _console2;

      for (var _len2 = arguments.length, msg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        msg[_key2] = arguments[_key2];
      }

      (_console2 = console).log.apply(_console2, ["".concat(name)].concat(msg));
    } : function () {
      return undefined;
    };
    logger.enabled = enabled;
    return logger;
  };

  /**
   * Color utilities for jscad.  Makes setting colors easier using css color names.  Using `.init()` adds a `.color()` function to the CSG object.
   * > You must use `Colors.init(CSG)` in the `main()` function.  The `CSG` class is not available before
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
   */
  var nameArray = {
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
  };
  function name2hex(n) {
    n = n.toLowerCase();
    if (!nameArray[n]) return 'Invalid Color Name';
    return nameArray[n];
  }
  function hex2rgb(h) {
    h = h.replace(/^\#/, '');

    if (h.length === 6) {
      return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
    }
  }
  var _name2rgb = {};
  function name2rgb(n) {
    if (!_name2rgb[n]) _name2rgb[n] = hex2rgb(name2hex(n));
    return _name2rgb[n];
  }
  function color(o, r, g, b, a) {
    if (typeof r !== 'string') return o.setColor(r, g, b, a);
    if (r === '') return o; // shortcut for no color

    var c = name2rgb(r).map(function (x) {
      return x / 255;
    });
    c[3] = g || 1.0;
    return o.setColor(c);
  }
  /**
   * Initialize the Color utility.  This adds a `.color()` prototype to the `CSG` object.
   * @param  {CSG} CSG The global `CSG` object
   * @memberof module:jscad-utils-color
   * @augments CSG
   */
  // init: function init(proto) {
  //   // if (proto.setColor) {
  //   var _setColor = proto.setColor; // eslint-disable-line no-unused-vars
  //   /**
  //    * Set the color of a CSG object using a css color name.  Also accepts the normal `setColor()` values.
  //    * @example
  //    * // creates a red cube
  //    * var redcube = CSG.cube({radius: [1, 1, 1]}).color('red');
  //    *
  //    * // creates a blue cube with the alpha channel at 50%
  //    * var bluecube =  CSG.cube({radius: [1, 1, 1]}).color('blue', 0.5);
  //    *
  //    * // creates a green cube with the alpha channel at 25%
  //    * // this is the same as the standard setColor
  //    * var greencube =  proto.cube({radius: [1, 1, 1]}).color(0, 1, 0, 0.25);
  //    * @param  {(String | Number)} [red or css name] - Css color name or the red color channel value (0.0 - 1.0)
  //    * @param  {Number} [green or alpha] - green color channel value (0.0 - 1.0) or the alpha channel when used with a css color string
  //    * @param  {Number} [blue] - blue color channel value (0.0 - 1.0)
  //    * @param  {Number} [alpha] - alpha channel value (0.0 - 1.0)
  //    * @return {CSG}   Returns a `CSG` object set to the desired color.
  //    * @memberof module:CSG
  //    * @alias color
  //    * @chainable
  //    * @augments CSG
  //    */
  //   proto.prototype.color = function(r, g, b, a) {
  //     if (!r) return this; // shortcut empty color values to do nothing.
  //     return Colors.color(this, r, g, b, a);
  //   };
  //   // } else {
  //   //   console.error(
  //   //     `"${proto}" does not have a setColor function to add the Colors prototype to.  Make sure the object your trying to decorate with '.color' is correct.`
  //   //   );
  //   // }
  // }

  /**
   * Initialize `jscad-utils` and add utilities to the `proto` object.
   * @param  {proto} proto The global `proto` object
   * @augments proto
   */

  function init(proto) {
    /**
     * Short circut out if the prototypes have alrady been added.
     */
    if (proto.prototype._jscadutilsinit) return; // Colors.init(proto);

    proto.prototype.color = function (r, g, b, a) {
      if (!r) return this; // shortcut empty color values to do nothing.

      return color(this, r, g, b, a);
    };

    proto.prototype.flush = function flush$1(to, axis, mside, wside) {
      return flush(this, to, axis, mside, wside);
    };

    proto.prototype.snap = function snap$1(to, axis, orientation, delta) {
      return snap(this, to, axis, orientation, delta);
    };

    proto.prototype.calcSnap = function calcSnap$1(to, axis, orientation, delta) {
      return calcSnap(this, to, axis, orientation, delta);
    };

    proto.prototype.midlineTo = function midlineTo$1(axis, to) {
      return midlineTo(this, axis, to);
    };

    proto.prototype.calcmidlineTo = function midlineTo(axis, to) {
      return calcmidlineTo(this, axis, to);
    };

    proto.prototype.centerWith = function centerWith$1(axis, to) {
      depreciated('centerWith', true, 'Use align instead.');
      return centerWith(this, axis, to);
    };

    if (proto.center) echo('proto already has .center');

    proto.prototype.center = function center(axis) {
      // console.log('center', axis, this.getBounds());
      return centerWith(this, axis || 'xyz', unitCube());
    };

    proto.prototype.calcCenter = function centerWith(axis) {
      return calcCenterWith(this, axis || 'xyz', unitCube(), 0);
    };

    proto.prototype.align = function align(to, axis) {
      // console.log('align', to.getBounds(), axis);
      return centerWith(this, axis, to);
    };

    proto.prototype.calcAlign = function calcAlign(to, axis, delta) {
      return calcCenterWith(this, axis, to, delta);
    };

    proto.prototype.enlarge = function enlarge$1(x, y, z) {
      return enlarge(this, x, y, z);
    };

    proto.prototype.fit = function fit$1(x, y, z, a) {
      return fit(this, x, y, z, a);
    };

    if (proto.size) echo('proto already has .size');

    proto.prototype.size = function () {
      return size(this.getBounds());
    };

    proto.prototype.centroid = function () {
      return centroid(this);
    };

    proto.prototype.Zero = function zero$1() {
      return zero(this);
    };

    proto.prototype.Center = function Center(axes) {
      return this.align(unitCube(), axes || 'xy');
    };

    proto.Vector2D.prototype.map = function Vector2D_map(cb) {
      return new proto.Vector2D(cb(this.x), cb(this.y));
    };

    proto.prototype.fillet = function fillet$1(radius, orientation, options) {
      return fillet(this, radius, orientation, options);
    };

    proto.prototype.chamfer = function chamfer$1(radius, orientation, options) {
      return chamfer(this, radius, orientation, options);
    };

    proto.prototype.bisect = function bisect$1() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return bisect.apply(util, [this].concat(args));
    };

    proto.prototype.slice = function slice$1() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return slice.apply(util, [this].concat(args));
    };

    proto.prototype.wedge = function wedge$1() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return wedge.apply(util, [this].concat(args));
    };

    proto.prototype.stretch = function stretch$1(axis, distance, offset) {
      return stretch(this, axis, distance, offset);
    };

    proto.prototype.unionIf = function unionIf(object, condition) {
      return condition ? this.union(result(this, object)) : this;
    };

    proto.prototype.subtractIf = function subtractIf(object, condition) {
      return condition ? this.subtract(result(this, object)) : this;
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
          result = undefined(result, arg);
          return result;
        }, [0, 0, 0]); // console.log('translate', t);

        return this._translate(t);
      }
    };

    proto.prototype.addConnector = function addConnector$1(name, point, axis, normal) {
      return addConnector(this, name, point, axis, normal);
    };

    proto.prototype.connect = function connectTo(myConnectorName, otherConnector) {
      var mirror = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var normalrotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var myConnector = myConnectorName.split('.').reduce(function (a, v) {
        return a[v];
      }, this.properties);
      /**
       * Check for missing property.
       */

      if (!myConnector) {
        error("The connector '".concat(myConnectorName, "' does not exist on the object [").concat(Object.keys(this.properties).join(','), "]"), 'Missing connector property');
      }

      return this.connectTo(myConnector, otherConnector, mirror, normalrotation);
    };

    proto.prototype._jscadutilsinit = true; // console.trace('init', proto.prototype);
  }

  var init$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': init
  });

  var CSG = jsCadCSG.CSG,
      CAG = jsCadCSG.CAG;
  var rectangular_extrude = scadApi.extrusions.rectangular_extrude;
  var _scadApi$text = scadApi.text,
      vector_text = _scadApi$text.vector_text,
      vector_char = _scadApi$text.vector_char;
  var union = scadApi.booleanOps.union;
  init(CSG);

  var debug = Debug('jscadUtils:group');
  /**
   * @function JsCadUtilsGroup
   * @param  {string[]} names An array of object names in the group.
   * @param  {object} parts An object with all parts in name value pairs.
   * @param  {CSG[]} holes An array of CSG objects that will be subtracted after combination.
   * @namespace JsCadUtilsGroup
   */

  function JsCadUtilsGroup() {
    var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var parts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var holes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    this.name = '';
    this.names = names;
    this.parts = parts;
    this.holes = holes;
  }
  /**
   * Add a CSG object to the current group.
   * @param {CSG|JsCadUtilsGroup} object Object to add the parts dictionary.
   * @param {string} name   Name of the part
   * @param {boolean} [hidden] If true, then the part will not be added during a default `combine()`
   * @param {string} [subparts]   Prefix for subparts if adding a group
   * @param {string} [parts]   When adding a group, you can pick the parts you want to include as the named part.
   * @function add
   * @memberof! JsCadUtilsGroup
   */

  JsCadUtilsGroup.prototype.add = function (object, name, hidden, subparts, parts) {
    debug('add', object, name, hidden, subparts, parts);
    var self = this;

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
        if (!hidden) self.names = self.names.concat(object.names);
      }
    } else {
      if (!hidden) self.names.push(name);
      self.parts[name] = object;
    }

    return self;
  };
  /**
   * @function combine
   * @param  {String} [pieces]  The parts to combine, if empty, then all named parts.
   * @param  {Object} options Combine options
   * @param  {Function} map     A function that is run before unioning the parts together.
   * @return {CSG} A single `CSG` object of the unioned parts.
   */


  JsCadUtilsGroup.prototype.combine = function (pieces) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (x) {
      return x;
    };

    try {
      var self = this;
      options = Object.assign({
        noholes: false
      }, options);
      pieces = pieces ? pieces.split(',') : self.names;

      if (pieces.length === 0) {
        throw new Error("no pieces found in ".concat(self.name, " pieces: ").concat(pieces, " parts: ").concat(Object.keys(self.parts), " names: ").concat(self.names));
      }

      debug('combine', self.names, self.parts);
      var g = union(mapPick(self.parts, pieces, function (value, key, index, object) {
        // debug('combine', value, key, object);
        return map ? map(value, key, index, object) : identity(value);
      }, self.name));
      return g.subtractIf(self.holes && Array.isArray(self.holes) ? union(self.holes) : self.holes, self.holes && !options.noholes);
    } catch (err) {
      debug('combine error', this, pieces, options, err);
      throw error("group::combine error \"".concat(err.message || err.toString(), "\"\nthis: ").concat(this, "\npieces: \"").concat(pieces, "\"\noptions: ").concat(JSON.stringify(options, null, 2), "\nstack: ").concat(err.stack, "\n"), 'JSCAD_UTILS_GROUP_ERROR');
    }
  };
  /**
   * Apply a function to each element in the group.
   * @param  {Function} cb Callback founction applied to each part.
   * It is called with the parameters `(value, key)`
   * @return {Object}      Returns this object so it can be chained
   * @function map
   */


  JsCadUtilsGroup.prototype.map = function (cb) {
    var self = this;
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
   * Clone a group into a new group.
   * @function clone
   * @param  {String} [name] A new name for the cloned group.
   * @param  {Function} [map] A function called on each part.
   * @return {JsCadUtilsGroup} The new group.
   */


  JsCadUtilsGroup.prototype.clone = function (name, map) {
    debug('clone', name, _typeof(name), map);
    var self = this;
    /**
     * For backwards compatibility
     */

    if (typeof name == 'function') {
      map = name;
      name = undefined;
    }

    if (!map) map = identity; // console.warn('clone() has been refactored');

    var group = Group(name);
    Object.keys(self.parts).forEach(function (key) {
      var part = self.parts[key];
      var hidden = self.names.indexOf(key) == -1;
      group.add(map(clone(part)), key, hidden);
    });

    if (self.holes) {
      group.holes = toArray(self.holes).map(function (part) {
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
   * @return {JsCadUtilsGroup}       The rotoated group.
   * @function rotate
   */


  JsCadUtilsGroup.prototype.rotate = function (solid, axis, angle) {
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
    self.map(function (part) {
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


  JsCadUtilsGroup.prototype.combineAll = function (options, map) {
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
   * @param  {Number} [delta=0]       An offset to apply with the snap, in millimeters.
   * @return {JsCadUtilsGroup} The group after snapping all parts to the `to` object.
   */


  JsCadUtilsGroup.prototype.snap = function snap(part, to, axis, orientation, delta) {
    try {
      var self = this; // debug(', self);

      var t = calcSnap(self.combine(part), to, axis, orientation, delta);
      self.map(function (part) {
        return part.translate(t);
      });
      return self;
    } catch (err) {
      debug('snap error', this, part, to, axis, delta, err);
      throw error("group::snap error \"".concat(err.message || err.toString(), "\"\nthis: ").concat(this, "\npart: \"").concat(part, "\"\nto: ").concat(to, "\naxis: \"").concat(axis, "\"\norientation: \"").concat(orientation, "\"\ndelta: \"").concat(delta, "\"\nstack: ").concat(err.stack, "\n"), 'JSCAD_UTILS_GROUP_ERROR');
    }
  };
  /**
   * Aligns all parts in a group to another `CSG` object.
   * @function align
   * @param  {String} part       Comma separated list of parts in the group to align.
   * @param  {CSG} to          A `CSG` object to align the parts to.
   * @param  {String} axis        An axis string to align on can be any combination of `x`, `y`, or `z`.
   * @param  {Number} delta       An offset to apply with the align, in millimeters.
   * @return {JsCadUtilsGroup} The group after aligning all parts to the `to` object.
   
   */


  JsCadUtilsGroup.prototype.align = function align(part, to, axis, delta) {
    try {
      var self = this;
      var t = calcCenterWith(self.combine(part, {
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
    } catch (err) {
      debug('align error', this, part, to, axis, delta, err);
      throw error("group::align error \"".concat(err.message || err.toString(), "\"\nthis: ").concat(this, "\npart: \"").concat(part, "\"\nto: ").concat(to, "\naxis: \"").concat(axis, "\"\ndelta: \"").concat(delta, "\"\nstack: ").concat(err.stack, "\n"), 'JSCAD_UTILS_GROUP_ERROR');
    }
  };

  JsCadUtilsGroup.prototype.center = function center(part) {
    var self = this;
    return self.align(part, unitCube(), 'xyz');
  };

  JsCadUtilsGroup.prototype.zero = function zero(part) {
    var self = this;
    var bounds = self.parts[part].getBounds();
    return self.translate([0, 0, -bounds[0].z]);
  };

  JsCadUtilsGroup.prototype.connectTo = function connectTo(partName, connectorName, to, toConnectorName) {
    var mirror = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var normalrotation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    debug('connectTo', {
      partName: partName,
      connectorName: connectorName,
      to: to,
      toConnectorName: toConnectorName,
      mirror: mirror,
      normalrotation: normalrotation
    });
    var self = this;
    var myConnector = connectorName.split('.').reduce(function (a, v) {
      return a[v];
    }, self.parts[partName].properties);
    debug('toConnector', to instanceof CSG.Connector);
    var toConnector = toConnectorName.split('.').reduce(function (a, v) {
      return a[v];
    }, to.properties);
    var matrix = myConnector.getTransformationTo(toConnector, mirror, normalrotation);
    debug('connectTo', matrix);
    self.map(function (part) {
      return part.transform(matrix);
    });
    return self;
  };
  /**
   * @function midlineTo
   * @param  {String} part       Comma separated list of parts in the group to align.
   * @param  {Number} to          Where to align the midline to.
   * @param  {String} axis        An axis string to align on can be any combination of `x`, `y`, or `z`.
   * @return {JsCadUtilsGroup} The group after aligning all parts to the `to` object.
   */


  JsCadUtilsGroup.prototype.midlineTo = function midlineTo(part, axis, to) {
    var self = this;
    var size = self.combine(part).size();
    var t = axisApply(axis, function (i, a) {
      return to - size[a] / 2;
    }); // debug(' part, t);
    // var t = util.calcCenterWith(self.combine(part), axis, to, delta);

    self.map(function (part) {
      return part.translate(t);
    }); // if (self.holes)
    //     self.holes = util.ifArray(self.holes, function(hole) {
    //         return hole.translate(t);
    //     });

    return self;
  };
  /**
   * Translates a group by a given ammount
   * @function translate
   * @param  {Number|Array} x The `x` value or an array of x, y and z.
   * @param  {Number} [y] The `y` value.
   * @param  {Number} [z] The `z` value.
   * @return {JsCadUtilsGroup} The translated group.
   */


  JsCadUtilsGroup.prototype.translate = function translate(x, y, z) {
    var self = this;
    var t = Array.isArray(x) ? x : [x, y, z];
    debug('translate', t);
    self.map(function (part) {
      return part.translate(t);
    }); // if (self.holes)
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
   * @return {JsCadUtilsGroup} The new group with the picked parts.
   */


  JsCadUtilsGroup.prototype.pick = function (parts, map) {
    var self = this;
    var p = parts && parts.length > 0 && parts.split(',') || self.names;
    if (!map) map = identity;
    var g = Group();
    p.forEach(function (name) {
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


  JsCadUtilsGroup.prototype.array = function (parts, map) {
    var _this = this;

    var self = this; // try {

    var p = parts && parts.length > 0 && parts.split(',') || self.names;
    if (!map) map = identity;
    var a = [];
    p.forEach(function (name) {
      if (!self.parts[name]) {
        debug('array error', _this, parts);
        throw error("group::array error \"".concat(name, "\" not found.\nthis: ").concat(_this, "\nparts: \"").concat(parts, "\"\n"), 'JSCAD_UTILS_GROUP_ERROR');
      }

      a.push(map(CSG.fromPolygons(self.parts[name].toPolygons()), name));
    });
    return a; //   } catch (err) {
    //     debug('array error', this, parts, err);
    //     throw error(
    //       `group::array error "${err.message || err.toString()}"
    // this: ${this}
    // parts: "${parts}"
    // stack: ${err.stack}
    // `,
    //       'JSCAD_UTILS_GROUP_ERROR'
    //     );
    //   }
  };
  /**
   * Converts all pieces or the picked pieces of a group into an array of `CSG`
   * objects.
   * @function toArray
   * @param  {String} pieces Comma separated string of parts to convert.  All named parts if empty.
   * @return {Array} An array of `CSG` objects.
   * @deprecated Use `array` instead of `toArray`.
   */


  JsCadUtilsGroup.prototype.toArray = function (pieces) {
    var self = this;
    var piecesArray = pieces ? pieces.split(',') : self.names;
    return piecesArray.map(function (piece) {
      if (!self.parts[piece]) console.error("Cannot find ".concat(piece, " in ").concat(self.names));
      return self.parts[piece];
    });
  };

  JsCadUtilsGroup.prototype.toString = function () {
    return "{\n  name: \"".concat(this.name, "\",\n  names: \"").concat(this.names.join(','), "\", \n  parts: \"").concat(Object.keys(this.parts), "\",\n  holes: \"").concat(this.holes, "\"\n}");
  };

  JsCadUtilsGroup.prototype.setName = function (name) {
    this.name = name;
    return this;
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
   * @param  {string | object} [objectNames]   Comma separated list of part names.
   * @param  {array | object} [addObjects] Array or object of parts.  If Array, the names list is used as names for each part.
   * @return {JsCadUtilsGroup}         An object that has a parts dictionary, a `combine()` and `map()` function.
   */


  function Group(objectNames, addObjects) {
    debug('Group', objectNames, addObjects);
    var self = {
      name: '',
      names: [],
      parts: {}
    };

    if (objectNames) {
      if (addObjects) {
        var names = objectNames;
        var objects = addObjects;
        self.names = names && names.length > 0 && names.split(',') || [];

        if (Array.isArray(objects)) {
          self.parts = zipObject(self.names, objects);
        } else if (objects instanceof CSG) {
          self.parts = zipObject(self.names, [objects]);
        } else {
          self.parts = objects || {};
        }
      } else {
        /**
         * First param is a stirng, assume that is the name of the group.
         */
        if (typeof objectNames == 'string') {
          self.name = objectNames;
        } else {
          var objects = objectNames; // eslint-disable-line no-redeclare

          self.names = Object.keys(objects).filter(function (k) {
            return k !== 'holes';
          });
          self.parts = Object.assign({}, objects);
          self.holes = objects.holes;
        }
      }
    }

    return new JsCadUtilsGroup(self.names, self.parts, self.holes);
  }

  var debug$1 = Debug('jscadUtils:util'); // import utilInit from '../src/add-prototype';
  // utilInit(CSG);
  // console.trace('CSG', CSG.prototype);

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
   * @function identity
   */

  function identity(solid) {
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

  function result(object, f) {
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

  function defaults(target, defaults) {
    depreciated('defaults', true, 'use Object.assign instead');
    return Object.assign(defaults, target);
  }
  function isEmpty(variable) {
    return typeof variable === 'undefined' || variable === null;
  }
  function isNegative(n) {
    return ((n = +n) || 1 / n) < 0;
  }
  /**
   * Print a message and CSG object bounds and size to the conosle.
   * @param  {String} msg Message to print
   * @param  {CSG} o   A CSG object to print the bounds and size of.
   * @function
   * @depricated use Debug instead
   */

  function print(msg, o) {
    debug$1(msg, JSON.stringify(o.getBounds()), JSON.stringify(this.size(o.getBounds())));
  }
  function jscadToString(o) {
    if (_typeof(o) == 'object') {
      if (o.polygons) {
        // is this CSG like?
        return "{\npolygons: ".concat(o.polygons.length, ",\nproperties: \"").concat(Object.keys(o.properties), "\"\n}\n");
      }
    } else {
      return o.toString();
    }
  }
  function error(msg, name, error) {
    if (console && console.error) console.error(msg, error); // eslint-disable-line no-console

    var err = new Error(msg);
    err.name = name || 'JSCAD_UTILS_ERROR';
    err._error = error;
    throw err;
  }
  /**
   * Shows a warning or error message.  Used to indicate a method
   * has been depricated and what to use instead.
   * @function depreciated
   * @param  {string} method  The name of the method being depricated.
   * @param  {boolean} [error]  Throws an error if called when true.
   * @param  {string} [message] Instructions on what to use instead of the depricated method.
   */

  function depreciated(method, error, message) {
    var msg = method + ' is depreciated.' + (' ' + message || ''); // eslint-disable-next-line no-console

    if (!error && console && console.error) console[error ? 'error' : 'warn'](msg); // eslint-disable-line no-console

    if (error) {
      var err = new Error(msg);
      err.name = 'JSCAD_UTILS_DEPRECATED';
      throw err;
    }
  }
  /**
   * Convert an imperial `inch` to metric `mm`.
   * @param  {Number} x Value in inches
   * @return {Number}   Result in mm
   * @function inch
   */

  function inch(x) {
    return x * 25.4;
  }
  /**
   * Convert metric `cm` to imperial `inch`.
   * @param  {Number} x Value in cm
   * @return {Number}   Result in inches
   * @function cm
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
    }); // console.trace('label', Object.getPrototypeOf(union(o)));
    // var foo = union(o);
    // console.trace('typeof', typeof foo);

    return center(union(o));
  }
  function text(text) {
    var l = vector_char(0, 0, text); // l contains a list of polylines to draw

    var _char = l.segments.reduce(function (result, segment) {
      var path = new CSG.Path2D(segment);
      var cag = path.expandToCAG(2); // debug('reduce', result, segment, path, cag);

      return result ? result.union(cag) : cag;
    }, undefined);

    return _char;
  }
  function unitCube(length, radius) {
    radius = radius || 0.5;
    return CSG.cube({
      center: [0, 0, 0],
      radius: [radius, radius, length || 0.5]
    });
  }
  function unitAxis(length, radius, centroid) {
    debug$1('unitAxis', length, radius, centroid);
    centroid = centroid || [0, 0, 0];
    var unitaxis = unitCube(length, radius).setColor(1, 0, 0).union([unitCube(length, radius).rotateY(90).setColor(0, 1, 0), unitCube(length, radius).rotateX(90).setColor(0, 0, 1)]);
    unitaxis.properties.origin = new CSG.Connector([0, 0, 0], [1, 0, 0], [0, 1, 0]);
    return unitaxis.translate(centroid);
  }
  function toArray(a) {
    return Array.isArray(a) ? a : [a];
  }
  function ifArray(a, cb) {
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

  function segment(object, segments, axis) {
    var size = object.size()[axis];
    var width = size / segments;
    var result = [];

    for (var i = width; i < size; i += width) {
      result.push(i);
    }

    return result;
  }
  function zipObject(names, values) {
    return names.reduce(function (result, value, idx) {
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

  function map(o, f) {
    return Object.keys(o).map(function (key) {
      return f(o[key], key, o);
    });
  }
  function mapValues(o, f) {
    return Object.keys(o).map(function (key) {
      return f(o[key], key);
    });
  }
  function pick(o, names) {
    return names.reduce(function (result, name) {
      result[name] = o[name];
      return result;
    }, {});
  }
  function mapPick(o, names, f, options) {
    return names.reduce(function (result, name, index) {
      if (!o[name]) {
        throw new Error("".concat(name, " not found in ").concat(options.name, ": ").concat(Object.keys(o).join(',')));
      }

      result.push(f ? f(o[name], name, index, o) : o[name]);
      return result;
    }, []);
  }
  function divA(a, f) {
    return div(a, f);
  }
  function divxyz(size, x, y, z) {
    return {
      x: size.x / x,
      y: size.y / y,
      z: size.z / z
    };
  }
  function div$1(size, d) {
    return this.divxyz(size, d, d, d);
  }
  function mulxyz(size, x, y, z) {
    return {
      x: size.x * x,
      y: size.y * y,
      z: size.z * z
    };
  }
  function mul(size, d) {
    return this.divxyz(size, d, d, d);
  }
  function xyz2array(size) {
    return [size.x, size.y, size.z];
  }
  var rotationAxes = {
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

  function size(o) {
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

  function scale(size, value) {
    if (value == 0) return 1;
    return 1 + 100 / (size / value) / 100;
  }
  function center(object, objectSize) {
    objectSize = objectSize || size(object.getBounds());
    return centerY(centerX(object, objectSize), objectSize);
  }
  function centerY(object, objectSize) {
    objectSize = objectSize || size(object.getBounds());
    return object.translate([0, -objectSize.y / 2, 0]);
  }
  function centerX(object, objectSize) {
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

  function enlarge(object, x, y, z) {
    var a;

    if (Array.isArray(x)) {
      a = x;
    } else {
      a = [x, y || x, z || x];
    }

    var objectSize = size(object);
    var objectCentroid = centroid(object, objectSize);
    var idx = 0;
    var t = map(objectSize, function (i) {
      return scale(i, a[idx++]);
    });
    var new_object = object.scale(t);
    var new_centroid = centroid(new_object); /// Calculate the difference between the original centroid and the new

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

  function fit(object, x, y, z, keep_aspect_ratio) {
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

    var s = [scale(objectSize.x, x), scale(objectSize.y, y), scale(objectSize.z, z)];
    var min$1 = min(s);
    return centerWith(object.scale(s.map(function (d, i) {
      if (a[i] === 0) return 1; // don't scale when value is zero

      return keep_aspect_ratio ? min$1 : d;
    })), 'xyz', object);
  }
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
    var w = withobj.getBounds(); // Add centroid if needed

    if (side[0] === -1) {
      w[-1] = toxyz(withobj.centroid());
    }

    return this.axisApply(axes, function (i, axis) {
      return w[side[0]][axis] - m[side[1]][axis];
    });
  }
  function calcSnap(moveobj, withobj, axes, orientation) {
    var delta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var side = flushSide[orientation];

    if (!side) {
      var fix = {
        '01': 'outside+',
        10: 'outside-',
        11: 'inside+',
        '00': 'inside-',
        '-11': 'center+',
        '-10': 'center-'
      };
      error('calcSnap: invalid side: ' + orientation + ' should be ' + fix['' + orientation + delta]);
    }

    var m = moveobj.getBounds();
    var w = withobj.getBounds(); // Add centroid if needed

    if (side[0] === -1) {
      w[-1] = withobj.centroid();
    }

    var t = axisApply(axes, function (i, axis) {
      return w[side[0]][axis] - m[side[1]][axis];
    });
    return delta ? axisApply(axes, function (i) {
      return t[i] + delta;
    }) : t;
  }
  function snap(moveobj, withobj, axis, orientation, delta) {
    debug$1('snap', moveobj, withobj, axis, orientation, delta);
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

  function flush(moveobj, withobj, axis, mside, wside) {
    return moveobj.translate(calcFlush(moveobj, withobj, axis, mside, wside));
  }
  function axisApply(axes, valfun, a) {
    debug$1('axisApply', axes, valfun, a);
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
  }
  function axis2array(axes, valfun) {
    depreciated('axis2array');
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
  }
  function centroid(o, objectSize) {
    try {
      var bounds = o.getBounds();
      objectSize = objectSize || size(bounds);
      return bounds[0].plus(objectSize.dividedBy(2));
    } catch (err) {
      error("centroid error o:".concat(jscadToString(o), " objectSize: ").concat(objectSize), undefined, err);
    }
  }
  /**
   * Calculates the transform array to move the midline of an object
   * by value.  This is useful when you have a diagram that provides
   * the distance to an objects midline instead of the edge.
   * @function calcmidlineTo
   * @param  {CSG} o    A CSG object.
   * @param  {String} axis A string with the axis to operate on.
   * @param  {Number} to   Value to move the midline of the object to.
   * @return {Number[]} The tranform array needed to move the object.
   */

  function calcmidlineTo(o, axis, to) {
    var bounds = o.getBounds();
    var objectSize = size(bounds);
    return axisApply(axis, function (i, a) {
      return to - objectSize[a] / 2;
    });
  }
  function midlineTo(o, axis, to) {
    return o.translate(calcmidlineTo(o, axis, to));
  }
  function translator(o, axis, withObj) {
    var objectCentroid = centroid(o);
    var withCentroid = centroid(withObj); // echo('centerWith', centroid, withCentroid);

    var t = axisApply(axis, function (i) {
      return withCentroid[i] - objectCentroid[i];
    });
    return t;
  }
  function calcCenterWith(o, axes, withObj) {
    var delta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var objectCentroid = centroid(o);
    var withCentroid = centroid(withObj);
    var t = axisApply(axes, function (i, axis) {
      return withCentroid[axis] - objectCentroid[axis];
    });
    return delta ? add(t, delta) : t;
  }
  function centerWith(o, axis, withObj) {
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
   * @param  {Boolean} [nonzero] When true, no offset values under 1e-4 are allowed.
   * @return {Point}         The point along the axis.
   */

  function getDelta(size, bounds, axis, offset, nonzero) {
    if (!isEmpty(offset) && nonzero) {
      if (Math.abs(offset) < 1e-4) {
        offset = 1e-4 * (isNegative(offset) ? -1 : 1);
      }
    } // if the offset is negative, then it's an offset from
    // the positive side of the axis


    var dist = isNegative(offset) ? offset = size[axis] + offset : offset;
    return axisApply(axis, function (i, a) {
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
   * You can angle the cut plane and position the rotation point.
   *
   * ![bisect example](../images/bisect.png)
   * @param  {CSG} object object to bisect
   * @param  {string} axis   axis to cut along
   * @param  {number} [offset] offset to cut at
   * @param  {number} [angle] angle to rotate the cut plane to
   * @param  {string} rotateaxis
   * @param  {number} rotateoffset
   * @param  {Object} options
   * @param  {boolean} [options.addRotationCenter=false]
   * @param  {Array} [options.cutDelta]
   * @param  {CSG.Vector3D} [options.rotationCenter]
   * @return {JsCadUtilsGroup}  Returns a group object with a parts object.
   */

  function bisect() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length < 2) {
      error('bisect requries an object and an axis', 'JSCAD_UTILS_INVALID_ARGS');
    }

    var object = args[0];
    var axis = args[1];
    var offset,
        angle = 0,
        rotateaxis,
        rotateoffset,
        options = {};
    /**
     * Allow the options object to include the parameters.
     */

    for (var i = 2; i < args.length; i++) {
      if (args[i] instanceof Object) {
        options = args[i];
        if (options.offset) offset = options.offset;
        if (options.angle) angle = options.angle;
        if (options.rotateaxis) rotateaxis = options.rotateaxis;
        if (options.rotateoffset) rotateoffset = options.rotateoffset;
      } else {
        switch (i) {
          case 2:
            offset = args[i];
            break;

          case 3:
            angle = args[i];
            break;

          case 4:
            rotateaxis = args[i];
            break;

          case 5:
            rotateoffset = args[i];
            break;

          case 6:
            options = args[i];
            break;
        }
      }
    }

    options = Object.assign({
      addRotationCenter: false
    }, options);
    angle = angle || 0;
    var info = normalVector(axis);
    var bounds = object.getBounds();
    var objectSize = size(object);
    rotateaxis = rotateaxis || {
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
    var rotateDelta = getDelta(objectSize, bounds, rotateOffsetAxis, rotateoffset);
    var rotationCenter = options.rotationCenter || new CSG.Vector3D(axisApply('xyz', function (i, a) {
      if (a == axis) return cutDelta[i];
      if (a == rotateOffsetAxis) return rotateDelta[i];
      return centroid[a];
    }));
    var theRotationAxis = rotationAxes[rotateaxis];
    var cutplane = CSG.OrthoNormalBasis.GetCartesian(info.orthoNormalCartesian[0], info.orthoNormalCartesian[1]).translate(cutDelta).rotate(rotationCenter, theRotationAxis, angle);
    debug$1('bisect', debug$1.enabled && {
      axis: axis,
      offset: offset,
      angle: angle,
      rotateaxis: rotateaxis,
      cutDelta: cutDelta,
      rotateOffsetAxis: rotateOffsetAxis,
      rotationCenter: rotationCenter,
      theRotationAxis: theRotationAxis,
      cutplane: cutplane,
      options: options
    });
    var g = Group('negative,positive', [object.cutByPlane(cutplane.plane).color(options.color && 'red'), object.cutByPlane(cutplane.plane.flipped()).color(options.color && 'blue')]);
    if (options.addRotationCenter) g.add(unitAxis(objectSize.length() + 10, 0.1, rotationCenter), 'rotationCenter');
    return g;
  }
  /**
   * Slices an object with the cutting plane oriented through the origin [0,0,0]
   * @param  {CSG} object The object to slice.
   * @param  {number} angle The slice angle.
   * @param  {'x'|'y'|'z'} axis The slice axis.
   * @param  {'x'|'y'|'z'} rotateaxis The rotation axis of the slice.
   * @param  {object} options The slice angle.
   * @param  {boolean} [options.color] Colors the slices.
   * @param  {boolean} [options.addRotationCenter] Adds a unitAxis object at the rotation center to the group.
   * @param  {CSG.Vector3D} [options.rotationCenter] The location of the rotation center, defaults to [0,0,0].
   * @return {JsCadUtilsGroup} A group with a positive and negative CSG object.
   */

  function slice(object) {
    var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
    var axis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'x';
    var rotateaxis = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'z';
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      color: true,
      addRotationCenter: true
    };
    var info = normalVector(axis);
    var rotationCenter = options.rotationCenter || new CSG.Vector3D(0, 0, 0);
    var theRotationAxis = rotationAxes[rotateaxis];
    var cutplane = CSG.OrthoNormalBasis.GetCartesian(info.orthoNormalCartesian[0], info.orthoNormalCartesian[1]) // .translate(cutDelta)
    .rotate(rotationCenter, theRotationAxis, angle);
    var g = Group('negative,positive', [object.cutByPlane(cutplane.plane).color(options.color && 'red'), object.cutByPlane(cutplane.plane.flipped()).color(options.color && 'blue')]);

    if (options.addRotationCenter) {
      var objectSize = size(object);
      g.add(unitAxis(objectSize.length() + 10, 0.1, rotationCenter), 'rotationCenter');
    }

    return g;
  }
  /**
   * Creates a `JsCadUtilsGroup` object that has  `body` and `wedge` objects. The `wedge` object
   * is created by radially cutting the object from the `start` to the `end` angle.
   *
   * ![wedge example](../images/wedge.png)
   *
   *
   * @example
   * util.init(CSG);
   * var wedge = util.wedge(
   *   CSG.cube({
   *     radius: 10
   *   }),
   *   30,
   *   -30,
   *   'x'
   * );
   *
   * return wedge
   *   .map((part, name) => {
   *     if (name == 'wedge') return part.translate([0, 5, 0]);
   *     return part;
   *   })
   *   .combine();
   *
   * @function wedge
   * @param  {CSG} object The object to slice.
   * @param  {number} start  The starting angle to slice.
   * @param  {number} end    The ending angle of the slice.
   * @param  {'x'|'y'|'z'} axis   The axis to cut the wedge in.
   * @return {JsCadUtilsGroup} A group object with a `body` and `wedge` parts.
   */

  function wedge(object, start, end, axis) {
    var a = slice(object, start, axis);
    var b = slice(a.parts.positive, end, axis);
    return Group({
      body: b.parts.positive.union(a.parts.negative).color('blue'),
      wedge: b.parts.negative.color('red')
    });
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
    var objectSize = size(object);
    var cutDelta = getDelta(objectSize, bounds, axis, offset, true); // debug('stretch.cutDelta', cutDelta, normal[axis]);

    return object.stretchAtPlane(normal[axis], cutDelta, distance);
  }
  /**
   * Takes two CSG polygons and creates a solid of `height`.
   * Similar to `CSG.extrude`, except you can resize either
   * polygon.
   * @param  {CAG} top    Top polygon
   * @param  {CAG} bottom Bottom polygon
   * @param  {number} height height of solid
   * @return {CSG}        generated solid
   */

  function poly2solid(top, bottom, height) {
    if (top.sides.length == 0) {
      // empty!
      return new CSG();
    } // var offsetVector = CSG.parseOptionAs3DVector(options, "offset", [0, 0, 10]);


    var offsetVector = CSG.Vector3D.Create(0, 0, height);
    var normalVector = CSG.Vector3D.Create(0, 1, 0);
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

    var c1 = new CSG.Connector(offsetVector.times(0), [0, 0, offsetVector.z], normalVector);
    var c2 = new CSG.Connector(offsetVector, [0, 0, offsetVector.z], normalVector);
    polygons = polygons.concat(bottom._toWallPolygons({
      cag: top,
      toConnector1: c1,
      toConnector2: c2
    })); // }

    return CSG.fromPolygons(polygons);
  }
  function slices2poly(slices, options, axis) {
    debug$1('slices2poly', slices, options, axis);
    options = Object.assign({
      twistangle: 0,
      twiststeps: 0
    }, options);
    var twistangle = options && parseFloat(options.twistangle) || 0;
    var twiststeps = options && parseInt(options.twiststeps) || CSG.defaultResolution3D;

    if (twistangle == 0 || twiststeps < 1) {
      twiststeps = 1;
    }

    var normalVector = options.si.normalVector;
    var polygons = []; // bottom and top

    var first$1 = first(slices);
    var last$1 = last(slices);
    debug$1('slices2poly first', first$1, first$1.offset, 'last', last$1);
    var up = first$1.offset[axis] > last$1.offset[axis]; // _toPlanePolygons only works in the 'z' axis.  It's hard coded
    // to create the poly using 'x' and 'y'.

    polygons = polygons.concat(first$1.poly._toPlanePolygons({
      translation: first$1.offset,
      normalVector: normalVector,
      flipped: !up
    }));
    var rotateAxis = 'rotate' + axis.toUpperCase();
    polygons = polygons.concat(last$1.poly._toPlanePolygons({
      translation: last$1.offset,
      normalVector: normalVector[rotateAxis](twistangle),
      flipped: up
    })); // rotate with quick short circut

    var rotate = twistangle === 0 ? function rotateZero(v) {
      return v;
    } : function rotate(v, angle, percent) {
      return v[rotateAxis](angle * percent);
    }; // walls

    var connectorAxis = last$1.offset.minus(first$1.offset).abs(); // debug('connectorAxis', connectorAxis);

    slices.forEach(function (slice, idx) {
      if (idx < slices.length - 1) {
        var nextidx = idx + 1;
        var top = !up ? slices[nextidx] : slice;
        var bottom = up ? slices[nextidx] : slice;
        var c1 = new CSG.Connector(bottom.offset, connectorAxis, rotate(normalVector, twistangle, idx / slices.length));
        var c2 = new CSG.Connector(top.offset, connectorAxis, rotate(normalVector, twistangle, nextidx / slices.length)); // debug('slices2poly.slices', c1.point, c2.point);

        polygons = polygons.concat(bottom.poly._toWallPolygons({
          cag: top.poly,
          toConnector1: c1,
          toConnector2: c2
        }));
      }
    });
    return CSG.fromPolygons(polygons);
  }
  function normalVector(axis) {
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
      cutDelta: axisApply(axis, function (i, a) {
        return bounds[info.sizeIdx][a] + Math.abs(radius) * info.sizeDir;
      }),
      moveDelta: axisApply(axis, function (i, a) {
        return bounds[info.sizeIdx][a] + Math.abs(radius) * info.moveDir;
      })
    }, info, normalVector(axis));
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
    var b = object.getBounds();
    var absoluteRadius = Math.abs(radius);
    var si = sliceParams(orientation, radius, b);
    debug$1('reShape', absoluteRadius, si);
    if (si.axis !== 'z') throw new Error('reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.');
    var cutplane = CSG.OrthoNormalBasis.GetCartesian(si.orthoNormalCartesian[0], si.orthoNormalCartesian[1]).translate(si.cutDelta);
    var slice = object.sectionCut(cutplane);
    var first = axisApply(si.axis, function () {
      return si.positive ? 0 : absoluteRadius;
    });
    var last = axisApply(si.axis, function () {
      return si.positive ? absoluteRadius : 0;
    });
    var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();
    debug$1('reShape first/last', first, last);
    var slices = slicer(first, last, slice, radius);
    var delta = slices2poly(slices, Object.assign(options, {
      si: si
    }), si.axis).color(options.color);
    var remainder = object.cutByPlane(plane);
    return union([options.unionOriginal ? object : remainder, delta.translate(si.moveDelta)]);
  }
  function chamfer(object, radius, orientation, options) {
    return reShape(object, radius, orientation, options, function (first, last, slice) {
      return [{
        poly: slice,
        offset: new CSG.Vector3D(first)
      }, {
        poly: enlarge(slice, [-radius * 2, -radius * 2]),
        offset: new CSG.Vector3D(last)
      }];
    });
  }
  function fillet(object, radius, orientation, options) {
    options = options || {};
    return reShape(object, radius, orientation, options, function (first, last, slice) {
      var v1 = new CSG.Vector3D(first);
      var v2 = new CSG.Vector3D(last);
      var res = options.resolution || CSG.defaultResolution3D;
      var slices = range(0, res).map(function (i) {
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
    var _calcRotate = calcRotate(part, solid, axis),
        rotationCenter = _calcRotate.rotationCenter,
        rotationAxis = _calcRotate.rotationAxis;

    return part.rotate(rotationCenter, rotationAxis, angle);
  }

  function cloneProperties(from, to) {
    return Object.entries(from).reduce(function (props, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      props[key] = value;
      return props;
    }, to);
  }

  function clone(o) {
    var c = CSG.fromPolygons(o.toPolygons());
    cloneProperties(o, c);
    debug$1('clone', o, c, CSG);
    return c;
  }
  /**
   * @function addConnector
   * @param  {CSG} object    The object to add the connector to.
   * @param  {String} name The name of the connector, this is added to the object `properties`.
   * @param  {Array} point=[0,0,0] a 3 axis array defining the connection point in 3D space.
   * @param  {Array} point=[0,0,0] a 3 axis array defining the direction vector of the connection (in the case of the servo motor example it would point in the direction of the shaft).
   * @param  {Array} point=[0,0,0] a 3 axis array direction vector somewhat perpendicular to axis; this defines the “12 o'clock” orientation of the connection.
   * @return {CSG}        The CSG object with the new connector added.
   */

  function addConnector(object, name) {
    var point = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0];
    var axis = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [1, 0, 0];
    var normal = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [0, 0, 1];
    object.properties[name] = new CSG.Connector(point, axis, normal);
    return object;
  }

  var debug$2 = Debug('jscadUtils:parts');
  var parts = {
    BBox: BBox,
    Cube: Cube,
    RoundedCube: RoundedCube,
    Cylinder: Cylinder,
    Cone: Cone
  };
  /**
   * Returns a CSG cube object with the same extent of all
   * parameters objects passed in.
   * @function BBox
   * @param  {CSG} ...objects Any number of CSG objects to create a bounding box for.
   * @return {CSG} A box with the size of the extents of all of the passed in objects
   */

  function BBox() {
    function box(object) {
      return CSG.cube({
        center: object.centroid(),
        radius: object.size().dividedBy(2)
      });
    }

    for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
      objects[_key] = arguments[_key];
    }

    return objects.reduce(function (bbox, part) {
      var object = bbox ? union([bbox, box(part)]) : part;
      return box(object);
    }, undefined);
  }
  function Cube(width) {
    var r = div(fromxyz(width), 2);
    return CSG.cube({
      center: r,
      radius: r
    });
  } // export function Sphere(diameter) {
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

  function RoundedCube(x, y, thickness, corner_radius) {
    if (x.getBounds) {
      var size$1 = size(x.getBounds());
      var r = [size$1.x / 2, size$1.y / 2];
      thickness = size$1.z;
      corner_radius = y;
    } else {
      var r = [x / 2, y / 2]; // eslint-disable-line no-redeclare
    }

    debug$2('RoundedCube', size$1, r, thickness, corner_radius);
    var roundedcube = CAG.roundedRectangle({
      center: [r[0], r[1], 0],
      radius: r,
      roundradius: corner_radius,
      resolution: CSG.defaultResolution2D
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

  function Cylinder(diameter, height) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    debug$2('parts.Cylinder', diameter, height, options);
    options = Object.assign({
      start: [0, 0, 0],
      end: [0, 0, height],
      radius: diameter / 2,
      resolution: CSG.defaultResolution2D
    }, options);
    return CSG.cylinder(options);
  }
  /**
   * Creats a cone.
   * @function Cone
   * @param  {Number} diameter1 Radius of the bottom of the cone.
   * @param  {Number} diameter2 Radius of the top of the cone.
   * @param  {Number} height    Height of the cone.
   * @param  {Object} options  Additional options passed to `CSG.cylinder`.
   * @return {CSG} A CSG cone object.
   */

  function Cone(diameter1, diameter2, height) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    debug$2('parts.Cone', diameter1, diameter2, height, options);
    return CSG.cylinder(Object.assign({
      start: [0, 0, 0],
      end: [0, 0, height],
      radiusStart: diameter1 / 2,
      radiusEnd: diameter2 / 2,
      resolution: CSG.defaultResolution2D
    }, options));
  }
  /**
   * Creates a hexagon.
   * @param {number} diameter Outside diameter of the hexagon
   * @param {number} height   height of the hexagon
   */

  function Hexagon(diameter, height) {
    debug$2('hexagon', diameter, height);
    var radius = diameter / 2;
    var sqrt3 = Math.sqrt(3) / 2;
    var hex = CAG.fromPoints([[radius, 0], [radius / 2, radius * sqrt3], [-radius / 2, radius * sqrt3], [-radius, 0], [-radius / 2, -radius * sqrt3], [radius / 2, -radius * sqrt3]]);
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

  function Triangle(base, height) {
    var radius = base / 2;
    var tri = CAG.fromPoints([[-radius, 0], [radius, 0], [0, Math.sin(30) * radius]]);
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
      roundradius: corner_radius,
      resolution: CSG.defaultResolution2D
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
      depreciated('Screw', false, 'Use the jscad-hardware screw methods instead');
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
      depreciated('PanHeadScrew', false, 'Use the jscad-hardware screw methods instead');
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
      depreciated('HexHeadScrew', false, 'Use the jscad-hardware screw methods instead');
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
      depreciated('FlatHeadScrew', false, 'Use the jscad-hardware screw methods instead');
      var head = Cone(headDiameter, diameter, headLength); // var head = Cylinder(headDiameter, headLength);

      var thread = Cylinder(diameter, length);

      if (clearLength) {
        var headClearSpace = Cylinder(headDiameter, clearLength);
      }

      return Hardware.Screw(head, thread, headClearSpace, options);
    }
  };

  var parts$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
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

  var debug$3 = Debug('jscadUtils:boxes');
  /** @typedef {import("./group").JsCadUtilsGroup} JsCadUtilsGroup */

  /**
   * jscad box and join utilities.  This should be considered experimental,
   * but there are some useful utilities here.
   */

  /**
     * Create a [rabbet joint](https://en.wikipedia.org/wiki/Rabbet) in a CSG solid.
     * This was designed for cubes, but should work on other types of objects.
     *
     * Splits a CSG object into a top and bottom objects.  The two objects will
     * fit together with a rabbet join.
     * @param {CSG} box          A `CSG` object to create the rabbet join in.
     * @param {Number} thickness    [description]
     * @param {Number} cutHeight    [description]
     * @return {Object} An object with `top` and `bottom` CSG objects.

     * @function RabbetJoin
     * @deprecated Use `Rabbet` instead.
     */

  function RabbetJoin(box, thickness, cutHeight) {
    depreciated('RabbetJoin', true, "Use 'Rabbet' instead");
    return rabbetJoin(box, thickness, cutHeight);
  }
  /**
   * Cuts a CSG object into three parts, a top and bottom of `thickness`
   * height, and the remaining middle.
   * @function topMiddleBottom
   * @param  {CSG} box       A `CSG` object.
   * @param  {Number} thickness The thickness of the top and bottom parts.
   * @return {JsCadUtilsGroup} A `Group` object with the `top`, `middle` and `bottom` parts.
   */

  function topMiddleBottom(box, thickness) {
    debug$3('TopMiddleBottom', box, thickness);
    var bottom = box.bisect('z', thickness, {
      color: true
    });
    var top = bottom.parts.positive.bisect('z', -thickness);
    return Group('top,middle,bottom', [top.parts.positive, top.parts.negative.color('green'), bottom.parts.negative]);
  }
  /**
   * This will bisect an object using a rabett join.  Returns a
   * `group` object with `positive` and `negative` parts.
   *
   * * ![parts example](../images/rabett.png)
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
   *
   * @param {CSG} box       The object to bisect.
   * @param {Number} thickness Thickness of the objects walls.
   * @param {Number} gap       Gap between the join cheeks.
   * @param {Number} height    Offset from the bottom to bisect the object at.  Negative numbers offset from the top.
   * @param {Number} face      Size of the join face.
   * @return {JsCadUtilsGroup} A group object with `positive`, `negative` parts.
   */

  function Rabett(box, thickness, gap, height, face) {
    var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    debug$3('Rabett', 'thickness', thickness, 'gap', gap, 'height', height, 'face', face);
    gap = gap || 0.25;
    var inside = thickness - gap;
    var outside = -thickness + gap;
    options.color = true;
    debug$3('inside', inside, 'outside', outside);
    var group = Group(); // debug('Rabbet top height:', height, 'options:', options);

    var _box$bisect$parts = box.bisect('z', height, options).parts,
        top = _box$bisect$parts.positive,
        lower2_3rd = _box$bisect$parts.negative; // debug('face', face, 'height', height);

    var lowerBisectHeight = Math.sign(height) < 0 ? face * Math.sign(height) : height - face; // debug('Rabbet bottom height:', lowerBisectHeight, 'options:', options);

    var _lower2_3rd$bisect$pa = lower2_3rd.bisect('z', lowerBisectHeight, options).parts,
        middle = _lower2_3rd$bisect$pa.positive,
        bottom = _lower2_3rd$bisect$pa.negative;
    var middleTop = middle.color('yellow').subtract(middle.color('darkred').enlarge([outside, outside, 0]));
    group.add(top // .color('blue')
    .union(middleTop), 'top');
    var bottomOutline = middle.color('yellow').subtract(middle.color('orange').enlarge([outside, outside, 0])).enlarge([outside, outside, 0]);
    group.add(bottomOutline, 'middle-top', true);
    group.add(middle.color('green').subtract(middle.color('pink').enlarge([inside, inside, 0])), 'middle-bottom', true);
    group.add(bottom.color('orange').union(middle.color('green').subtract(middle.color('red').enlarge([inside, inside, 0])).subtract(middleTop)), 'bottom');
    return group;
  }
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
   * @param {Object} [options]   Options to have a `removableTop` or `removableBottom`.  Both default to `true`.
   * @param {Boolean} [options.removableTop=true]   The top will be removable.
   * @param {Boolean} [options.removableBottom=true]   The bottom will be removable.
   * @return {JsCadUtilsGroup} An A hollow version of the original object..
   * @memberof module:Boxes
   */

  var RabettTopBottom = function rabbetTMB(box, thickness) {
    var gap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25;
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    options = Object.assign({
      removableTop: true,
      removableBottom: true,
      topWidth: -thickness,
      bottomWidth: thickness
    }, options);
    debug$3('RabettTopBottom', box, thickness, gap, options);
    var group = Group('', {
      box: box
    });
    var inside = -thickness - gap;
    var outside = -thickness + gap;

    if (options.removableTop) {
      var top = box.bisect('z', options.topWidth, {
        color: true
      });
      group.add(top.parts.positive.enlarge([inside, inside, 0]), 'top');
      if (!options.removableBottom) group.add(box.subtract(top.parts.positive.enlarge([outside, outside, 0])), 'bottom');
    }

    if (options.removableBottom) {
      var bottom = box.bisect('z', options.bottomWidth, {
        color: true
      });
      group.add(bottom.parts.negative.enlarge([outside, outside, 0]), 'bottomCutout', true);
      group.add(bottom.parts.negative.enlarge([inside, inside, 0]), 'bottom');
      if (!options.removableTop) group.add(box.subtract(group.parts.bottomCutout), 'top');
    }

    if (options.removableBottom && options.removableTop) {
      group.add(box.subtract(union([bottom.parts.negative.enlarge([outside, outside, 0]), top.parts.positive.enlarge([outside, outside, 0])])), 'middle');
    }

    return group;
  };
  var CutOut = function cutOut(o, h, box, plug, gap) {
    gap = gap || 0.25; // console.log('cutOut', o.size(), h, b.size());
    // var r = getRadius(o);

    var s = o.size();
    var cutout = o.intersect(box);
    var cs = o.size();
    var clear = Parts.Cube([s.x, s.y, h]).align(o, 'xy').color('yellow');
    var top = clear.snap(o, 'z', 'center+').union(o);
    var back = Parts.Cube([cs.x + 6, 2, cs.z + 2.5]).align(cutout, 'x').snap(cutout, 'z', 'center+').snap(cutout, 'y', 'outside-');
    var clip = Parts.Cube([cs.x + 2 - gap, 1 - gap, cs.z + 2.5]).align(cutout, 'x').snap(cutout, 'z', 'center+').snap(cutout, 'y', 'outside-');
    return Group('insert', {
      top: top,
      bottom: clear.snap(o, 'z', 'center-').union(o),
      cutout: union([o, top]),
      back: back.subtract(plug).subtract(clip.enlarge(gap, gap, gap)).subtract(clear.translate([0, 5, 0])),
      clip: clip.subtract(plug).color('red'),
      insert: union([o, top]).intersect(box).subtract(o).enlarge([-gap, 0, 0]).union(clip.subtract(plug).enlarge(-gap, -gap, 0)).color('blue')
    });
  };
  var Rectangle = function Rectangle(size, thickness, cb) {
    thickness = thickness || 2;
    var s = div(xyz2array(size), 2);
    var r = add(s, thickness);
    var box = CSG.cube({
      center: r,
      radius: r
    }).subtract(CSG.cube({
      center: r,
      radius: s
    }));
    if (cb) box = cb(box); // return rabbetTMB(box.color('gray'), thickness, gap, options);

    return box;
  };
  /**
   * Takes a solid object and returns a hollow version with a selected
   * wall thickness.  This is done by reducing the object by half the
   * thickness and subtracting the reduced version from the original object.
   *
   * ![A hollowed out cylinder](../images/rabett.png)
   *
   * @param {CSG}   object    A CSG object
   * @param {Number}   [thickness=2] The thickness of the walls.
   * @param {Function} [interiorcb]        A callback that allows processing the object before returning.
   * @param {Function} [exteriorcb]        A callback that allows processing the object before returning.
   * @return {CSG} An A hollow version of the original object..
   * @memberof module:Boxes
   */

  var Hollow = function Hollow(object, thickness, interiorcb, exteriorcb) {
    thickness = thickness || 2;
    var size = -thickness * 2;
    interiorcb = interiorcb || identity;
    var box = object.subtract(interiorcb(object.enlarge([size, size, size])));
    if (exteriorcb) box = exteriorcb(box);
    return box;
  };
  /**
   * Create a box that surounds the object.
   * @param {CSG} o The object to create a bounding box for.
   * @return {CSG} The bounding box aligned with the object.
   * @deprecated use parts.BBox
   * @memberof module:Boxes
   */

  var BBox$1 = function BBox(o) {
    depreciated('BBox', true, "Use 'parts.BBox' instead");
    var s = div(xyz2array(o.size()), 2);
    return CSG.cube({
      center: s,
      radius: s
    }).align(o, 'xyz');
  };

  function getRadius(o) {
    return div(xyz2array(o.size()), 2);
  }

  function rabbetJoin(box, thickness) {
    var gap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.25;
    var r = add(getRadius(box), -thickness / 2);
    r[2] = thickness / 2;
    var cutter = CSG.cube({
      center: r,
      radius: r
    }).align(box, 'xy').color('green');
    var topCutter = cutter.snap(box, 'z', 'inside+');
    var group = Group('', {
      topCutter: topCutter,
      bottomCutter: cutter
    });
    group.add(box.subtract(cutter.enlarge([gap, gap, 0])).color('blue'), 'top');
    group.add(box.subtract(topCutter.enlarge([gap, gap, 0])).color('red'), 'bottom');
    return group;
  }

  var Boxes = /*#__PURE__*/Object.freeze({
    __proto__: null,
    RabbetJoin: RabbetJoin,
    topMiddleBottom: topMiddleBottom,
    Rabett: Rabett,
    RabettTopBottom: RabettTopBottom,
    CutOut: CutOut,
    Rectangle: Rectangle,
    Hollow: Hollow,
    BBox: BBox$1
  });

  var compatV1 = _objectSpread2(_objectSpread2({}, util), {}, {
    group: Group,
    init: init$1,
    triangle: triUtils,
    array: array,
    parts: parts$1,
    Boxes: Boxes,
    Debug: Debug
  });

  exports.Boxes = Boxes;
  exports.Debug = Debug;
  exports.Group = Group;
  exports.array = array;
  exports.compatV1 = compatV1;
  exports.init = init$1;
  exports.parts = parts$1;
  exports.triUtils = triUtils;
  exports.util = util;

  return exports;

}({}, jsCadCSG, scadApi));

  // endinject

  const debug = jscadUtils.Debug('jscadUtils:initJscadutils');

  util = jscadUtils.compatV1;

  util.init.default(CSG);

  debug('initJscadutils:jscadUtils', jscadUtils);
  Parts = jscadUtils.parts;
  Boxes = jscadUtils.Boxes;
  Group = jscadUtils.Group;
  Debug = jscadUtils.Debug;
  array = jscadUtils.array;
  triUtils = jscadUtils.triUtils;

  return jscadUtils;
}

var jscadUtilsPluginInit = [];
util = {
  init: (...a) => {
    initJscadutils(...a);

    jscadUtilsPluginInit.forEach(p => {
      p(...a);
    });
  }
};
/* eslint-enable */
