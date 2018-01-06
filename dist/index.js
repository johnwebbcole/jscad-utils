'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var scadApi = require('@jscad/scad-api');
var csg = require('@jscad/csg');

/**
     * Convert degrees to radians.
     * @param  {Number} deg value in degrees
     * @return {Number}     value in radians
     */
const toRadians = function toRadians(deg) {
    return deg / 180 * Math.PI;
};

/**
     * Convert radians to degrees.
     * @param  {Number} rad value in radians
     * @return {Number}     value in degrees
     */
const toDegrees = function toDegrees(rad) {
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
const solve = function(p1, p2) {
    var r = {
        c: 90,
        A: Math.abs(p2.x - p1.x),
        B: Math.abs(p2.y - p1.y)
    };
    var brad = Math.atan2(r.B, r.A);
    r.b = this.toDegrees(brad);
    // r.C = Math.sqrt(Math.pow(r.B, 2) + Math.pow(r.A, 2));
    r.C = r.B / Math.sin(brad);
    r.a = 90 - r.b;

    return r;
};

/**
     * Solve a partial triangle object. Angles are in degrees.
     * Angle `C` is set to 90 degrees.
     * @param  {Number} r.a Length of side `a`
     * @param  {Number} r.A Angle `A` in degrees
     * @param  {Number} r.b Length of side `b`
     * @param  {Number} r.B Angle `B` in degrees
     * @param  {Number} r.c Length of side `c`
     * @return {Object}   A solved triangle object {A,B,C,a,b,c}
     */
const solve90SA = function(r) {
    r = Object.assign(r, {
        C: 90
    });

    r.A = r.A || 90 - r.B;
    r.B = r.B || 90 - r.A;

    var arad = toRadians(r.A);

    // sinA = a/c
    // a = c * sinA
    // tanA = a/b
    // a = b * tanA
    r.a = r.a || (r.c ? r.c * Math.sin(arad) : r.b * Math.tan(arad));

    // sinA = a/c
    r.c = r.c || r.a / Math.sin(arad);

    // tanA = a/b
    r.b = r.b || r.a / Math.tan(arad);

    return r;
};


var triangle = Object.freeze({
	toRadians: toRadians,
	toDegrees: toDegrees,
	solve: solve,
	solve90SA: solve90SA
});

const div = function(a, f) {
    return a.map(function(e) {
        return e / f;
    });
};

const addValue = function(a, f) {
    return a.map(function(e) {
        return e + f;
    });
};

const addArray = function(a, f) {
    return a.map(function(e, i) {
        return e + f[i];
    });
};

const add = function(a) {
    return Array.prototype.slice
        .call(arguments, 1)
        .reduce(function(result, arg) {
            if (Array.isArray(arg)) {
                result = util.array.addArray(result, arg);
            } else {
                result = util.array.addValue(result, arg);
            }
            return result;
        }, a);
};

const fromxyz = function(object) {
    return Array.isArray(object) ? object : [object.x, object.y, object.z];
};

const toxyz = function(a) {
    return {
        x: a[0],
        y: a[1],
        z: a[2]
    };
};

const first = function(a) {
    return a ? a[0] : undefined;
};

const last = function(a) {
    return a && a.length > 0 ? a[a.length - 1] : undefined;
};

const min = function(a) {
    return a.reduce(function(result, value) {
        return value < result ? value : result;
    }, Number.MAX_VALUE);
};

const range = function(a, b) {
    var result = [];
    for (var i = a; i < b; i++) {
        result.push(i);
    }

    return result;
};


var array = Object.freeze({
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

// import array from 'src/array';
// import triangle from 'src/triangle';
var NOZZEL_SIZE = 0.4;
const nearest = {
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
 */
const identity = function(solid) {
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
const result = function(object, f) {
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
const defaults = function(target, defaults) {
    depreciated('defaults', true, 'use Object.assign instead');
    return Object.assign(defaults, target);
};

const isEmpty = function(variable) {
    return typeof variable === 'undefined' || variable === null;
};

const isNegative = function(n) {
    return ((n = +n) || 1 / n) < 0;
};

/**
 * Print a message and CSG object bounds and size to the conosle.
 * @param  {String} msg Message to print
 * @param  {CSG} o   A CSG object to print the bounds and size of.
 */
const print = function(msg, o) {
    echo(
        msg,
        JSON.stringify(o.getBounds()),
        JSON.stringify(this.size(o.getBounds()))
    );
};

const error = function(msg) {
    if (console && console.error) console.error(msg); // eslint-disable-line no-console
    throw new Error(msg);
};

const depreciated = function(method, error, message) {
    var msg = method + ' is depreciated.' + (' ' + message || '');
    // eslint-disable-next-line no-console
    if (!error && console && console.error)
        console[error ? 'error' : 'warn'](msg); // eslint-disable-line no-console
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
    var l = scadApi.vector_text(x || 0, y || 0, text); // l contains a list of polylines to draw
    var o = [];
    l.forEach(function(pl) {
        // pl = polyline (not closed)
        o.push(
            scadApi.rectangular_extrude(pl, {
                w: width || 2,
                h: height || 2
            })
        ); // extrude it to 3D
    });
    return this.center(union(o));
}

function text(text) {
    var l = scadApi.vector_char(0, 0, text); // l contains a list of polylines to draw
    var char = l.segments.reduce(function(result, segment) {
        var path = new csg.CSG.Path2D(segment);
        var cag = path.expandToCAG(2);
        // console.log('reduce', result, segment, path, cag);
        return result ? result.union(cag) : cag;
    }, undefined);
    return char;
}

const unitCube = function(length, radius) {
    radius = radius || 0.5;
    return csg.CSG.cube({
        center: [0, 0, 0],
        radius: [radius, radius, length || 0.5]
    });
};

const unitAxis = function(length, radius, centroid) {
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
};

const toArray = function(a) {
    return Array.isArray(a) ? a : [a];
};

const ifArray = function(a, cb) {
    return Array.isArray(a) ? a.map(cb) : cb(a);
};

/**
 * Returns an array of positions along an object on a given axis.
 * @param  {CSG} object   The object to calculate the segments on.
 * @param  {number} segments The number of segments to create.
 * @param  {string} axis     Axis to create the sgements on.
 * @return {Array}          An array of segment positions.
 */
const segment = function(object, segments, axis) {
    var size = object.size()[axis];
    var width = size / segments;
    var result = [];
    for (var i = width; i < size; i += width) {
        result.push(i);
    }
    return result;
};

const zipObject = function(names, values) {
    return names.reduce(function(result, value, idx) {
        result[value] = values[idx];
        return result;
    }, {});
};

// map: function (o, callback) {
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
const map = function(o, f) {
    return Object.keys(o).map(function(key) {
        return f(o[key], key, o);
    });
};

const mapValues = function(o, f) {
    return Object.keys(o).map(function(key) {
        return f(o[key], key);
    });
};

const pick = function(o, names) {
    return names.reduce(function(result, name) {
        result[name] = o[name];
        return result;
    }, {});
};

const mapPick = function(o, names, f, options) {
    return names.reduce(function(result, name) {
        if (!o[name]) {
            throw new Error(
                `${name} not found in ${options.name}: ${Object.keys(o).join(
                    ','
                )}`
            );
        }
        result.push(f ? f(o[name]) : o[name]);
        return result;
    }, []);
};

const divA = function divA(a, f) {
    return this.array.div(a, f);
};

const divxyz = function(size, x, y, z) {
    return {
        x: size.x / x,
        y: size.y / y,
        z: size.z / z
    };
};

const div$1 = function(size, d) {
    return this.divxyz(size, d, d, d);
};

const mulxyz = function(size, x, y, z) {
    return {
        x: size.x * x,
        y: size.y * y,
        z: size.z * z
    };
};

const mul = function(size, d) {
    return this.divxyz(size, d, d, d);
};

const xyz2array = function xyz2array(size) {
    return [size.x, size.y, size.z];
};

const rotationAxes = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1]
};

/**
 * Returns a `Vector3D` with the size of the object.
 * @param  {CSG} o A `CSG` like object or an array of `CSG.Vector3D` objects (the result of getBounds()).
 * @return {CSG.Vector3D}   Vector3d with the size of the object
 */
const size = function size(o) {
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
const scale = function scale(size, value) {
    if (value == 0) return 1;

    return 1 + 100 / (size / value) / 100;
};

const center = function center(object, size) {
    size = size || this.size(object.getBounds());
    return this.centerY(this.centerX(object, size), size);
};

const centerY = function centerY(object, size) {
    size = size || this.size(object.getBounds());
    return object.translate([0, -size.y / 2, 0]);
};

const centerX = function centerX(object, size) {
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
const enlarge = function enlarge(object, x, y, z) {
    var a;
    if (Array.isArray(x)) {
        a = x;
    } else {
        a = [x, y, z];
    }

    var size = util.size(object);
    var centroid = util.centroid(object, size);

    var idx = 0;

    var t = util.map(size, function(i) {
        return util.scale(i, a[idx++]);
    });

    var new_object = object.scale(t);
    var new_centroid = util.centroid(new_object);

    /// Calculate the difference between the original centroid and the new
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
const fit = function fit(object, x, y, z, keep_aspect_ratio) {
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

    // var c = util.centroid(object);
    var size = this.size(object.getBounds());

    function scale(size, value) {
        if (value == 0) return 1;
        return value / size;
    }

    var s = [scale(size.x, x), scale(size.y, y), scale(size.z, z)];
    var min = util.array.min(s);
    return util.centerWith(
        object.scale(
            s.map(function(d, i) {
                if (a[i] === 0) return 1; // don't scale when value is zero
                return keep_aspect_ratio ? min : d;
            })
        ),
        'xyz',
        object
    );
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
    return x.union([
        x.mirroredY(90),
        x.mirroredX(90),
        x.mirroredY(90).mirroredX(90)
    ]);
}

const flushSide = {
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
    var w = withobj.getBounds();

    // Add centroid if needed
    if (side[0] === -1) {
        w[-1] = util.array.toxyz(withobj.centroid());
    }

    return this.axisApply(axes, function(i, axis) {
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
        util.error(
            'util.calcSnap: invalid side: ' +
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

    var t = this.axisApply(axes, function(i, axis) {
        return w[side[0]][axis] - m[side[1]][axis];
    });

    return delta
        ? this.axisApply(axes, function(i) {
            return t[i] + delta;
        })
        : t;
}

function snap(moveobj, withobj, axis, orientation, delta) {
    return moveobj.translate(
        util.calcSnap(moveobj, withobj, axis, orientation, delta)
    );
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
    return moveobj.translate(
        util.calcFlush(moveobj, withobj, axis, mside, wside)
    );
}

const axisApply = function(axes, valfun, a) {
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
};

const axis2array = function(axes, valfun) {
    util.depreciated('axis2array');
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
};

const centroid = function(o, size) {
    var bounds = o.getBounds();
    size = size || util.size(bounds);

    return bounds[0].plus(size.dividedBy(2));
};

function calcmidlineTo(o, axis, to) {
    var bounds = o.getBounds();
    var size = util.size(bounds);

    // var centroid = bounds[0].plus(size.dividedBy(2));

    // console.log('bounds', JSON.stringify(bounds), 'size', size, 'centroid', centroid);
    return util.axisApply(axis, function(i, a) {
        return to - size[a] / 2;
    });
}

function midlineTo(o, axis, to) {
    return o.translate(util.calcmidlineTo(o, axis, to));
}

function translator(o, axis, withObj) {
    var centroid = util.centroid(o);
    var withCentroid = util.centroid(withObj);
    // echo('centerWith', centroid, withCentroid);
    var t = util.axisApply(axis, function(i) {
        return withCentroid[i] - centroid[i];
    });

    return t;
}

function calcCenterWith(o, axes, withObj, delta) {
    var centroid = util.centroid(o);
    var withCentroid = util.centroid(withObj);

    var t = util.axisApply(axes, function(i, axis) {
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
    }
    // if the offset is negative, then it's an offset from
    // the positive side of the axis
    var dist = util.isNegative(offset)
        ? (offset = size[axis] + offset)
        : offset;
    return util.axisApply(axis, function(i, a) {
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
 * ![bisect example](jsdoc2md/bisect.png)
 * @param  {CSG} object object to bisect
 * @param  {string} axis   axis to cut along
 * @param  {number} offset offset to cut at
 * @param  {number} angle angle to rotate the cut plane to
 * @return {object}  Returns a group object with a parts object.
 */
function bisect(
    object,
    axis,
    offset,
    angle,
    rotateaxis,
    rotateoffset,
    options
) {
    options = util.defaults(options, {
        addRotationCenter: false
    });
    angle = angle || 0;
    var info = util.normalVector(axis);
    var bounds = object.getBounds();
    var size = util.size(object);

    rotateaxis =
        rotateaxis ||
        {
            x: 'y',
            y: 'x',
            z: 'x'
        }[axis];

    // function getDelta(axis, offset) {
    //     // if the offset is negative, then it's an offset from
    //     // the positive side of the axis
    //     var dist = util.isNegative(offset) ? offset = size[axis] + offset : offset;
    //     return util.axisApply(axis, function (i, a) {
    //         return bounds[0][a] + (util.isEmpty(dist) ? size[axis] / 2 : dist);
    //     });
    // }

    var cutDelta =
        options.cutDelta || util.getDelta(size, bounds, axis, offset);
    var rotateOffsetAxis = {
        xy: 'z',
        yz: 'x',
        xz: 'y'
    }[[axis, rotateaxis].sort().join('')];
    var centroid = object.centroid();
    var rotateDelta = util.getDelta(
        size,
        bounds,
        rotateOffsetAxis,
        rotateoffset
    );

    var rotationCenter =
        options.rotationCenter ||
        new csg.CSG.Vector3D(
            util.axisApply('xyz', function(i, a) {
                if (a == axis) return cutDelta[i];
                if (a == rotateOffsetAxis) return rotateDelta[i];
                return centroid[a];
            })
        );
    var rotationAxis = util.rotationAxes[rotateaxis];

    var cutplane = csg.CSG.OrthoNormalBasis.GetCartesian(
        info.orthoNormalCartesian[0],
        info.orthoNormalCartesian[1]
    )
        .translate(cutDelta)
        .rotate(rotationCenter, rotationAxis, angle);

    var g = util.group('negative,positive', [
        object.cutByPlane(cutplane.plane).color('red'),
        object.cutByPlane(cutplane.plane.flipped()).color('blue')
    ]);

    if (options.addRotationCenter)
        g.add(
            util.unitAxis(size.length() + 10, 0.5, rotationCenter),
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
function stretch(object, axis, distance, offset) {
    var normal = {
        x: [1, 0, 0],
        y: [0, 1, 0],
        z: [0, 0, 1]
    };
    var bounds = object.getBounds();
    var size = util.size(object);
    var cutDelta = util.getDelta(size, bounds, axis, offset, true);
    // console.log('stretch.cutDelta', cutDelta, normal[axis]);
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
        return new csg.CSG();
    }
    // var offsetVector = CSG.parseOptionAs3DVector(options, "offset", [0, 0, 10]);
    var offsetVector = csg.CSG.Vector3D.Create(0, 0, height);
    var normalVector = csg.CSG.Vector3D.Create(0, 1, 0);

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
    var c1 = new csg.CSG.Connector(
        offsetVector.times(0),
        [0, 0, offsetVector.z],
        normalVector
    );
    var c2 = new csg.CSG.Connector(
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

    return csg.CSG.fromPolygons(polygons);
}

function slices2poly(slices, options, axis) {
    // console.log('util.slices2poly', options);
    // var resolution = slices.length;
    // var offsetVector = new CSG.Vector3D(options.offset);
    // var twistangle = CSG.parseOptionAsFloat(options, 'twistangle', 0);
    var twistangle = (options && parseFloat(options.twistangle)) || 0;
    // var twiststeps = CSG.parseOptionAsInt(
    //     options,
    //     'twiststeps',
    //     CSG.defaultResolution3D
    // );
    var twiststeps =
        (options && parseInt(options.twiststeps)) || csg.CSG.defaultResolution3D;
    if (twistangle == 0 || twiststeps < 1) {
        twiststeps = 1;
    }

    var normalVector = options.si.normalVector;

    var polygons = [];

    // bottom and top
    var first = util.array.first(slices);
    var last = util.array.last(slices);
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
    // console.log('connectorAxis', connectorAxis);
    slices.forEach(function(slice, idx) {
        if (idx < slices.length - 1) {
            var nextidx = idx + 1;
            var top = !up ? slices[nextidx] : slice;
            var bottom = up ? slices[nextidx] : slice;

            var c1 = new csg.CSG.Connector(
                bottom.offset,
                connectorAxis,
                rotate(normalVector, twistangle, idx / slices.length)
            );
            var c2 = new csg.CSG.Connector(
                top.offset,
                connectorAxis,
                rotate(normalVector, twistangle, nextidx / slices.length)
            );

            // console.log('slices2poly.slices', c1.point, c2.point);
            polygons = polygons.concat(
                bottom.poly._toWallPolygons({
                    cag: top.poly,
                    toConnector1: c1,
                    toConnector2: c2
                })
            );
        }
    });

    return csg.CSG.fromPolygons(polygons);
}

function normalVector(axis) {
    var axisInfo = {
        z: {
            orthoNormalCartesian: ['X', 'Y'],
            normalVector: csg.CSG.Vector3D.Create(0, 1, 0)
        },
        x: {
            orthoNormalCartesian: ['Y', 'Z'],
            normalVector: csg.CSG.Vector3D.Create(0, 0, 1)
        },
        y: {
            orthoNormalCartesian: ['X', 'Z'],
            normalVector: csg.CSG.Vector3D.Create(0, 0, 1)
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

    return Object.assign(
        {
            axis: axis,
            cutDelta: util.axisApply(axis, function(i, a) {
                return (
                    bounds[info.sizeIdx][a] + Math.abs(radius) * info.sizeDir
                );
            }),
            moveDelta: util.axisApply(axis, function(i, a) {
                return (
                    bounds[info.sizeIdx][a] + Math.abs(radius) * info.moveDir
                );
            })
        },
        info,
        util.normalVector(axis)
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

function reShape(object, radius, orientation, options, slicer) {
    options = options || {};
    var b = object.getBounds();
    // var s = util.size(b);
    var ar = Math.abs(radius);
    var si = util.sliceParams(orientation, radius, b);

    if (si.axis !== 'z')
        throw new Error(
            'util.reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.'
        );

    var cutplane = csg.CSG.OrthoNormalBasis.GetCartesian(
        si.orthoNormalCartesian[0],
        si.orthoNormalCartesian[1]
    ).translate(si.cutDelta);

    var slice = object.sectionCut(cutplane);

    var first = util.axisApply(si.axis, function() {
        return si.positive ? 0 : ar;
    });

    var last = util.axisApply(si.axis, function() {
        return si.positive ? ar : 0;
    });

    var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();

    var slices = slicer(first, last, slice);

    var delta = util
        .slices2poly(
            slices,
            Object.assign(options, {
                si: si
            }),
            si.axis
        )
        .color(options.color);

    var remainder = object.cutByPlane(plane);
    return union([
        options.unionOriginal ? object : remainder,
        delta.translate(si.moveDelta)
    ]);
}

function chamfer(object, radius, orientation, options) {
    return util.reShape(object, radius, orientation, options, function(
        first,
        last,
        slice
    ) {
        return [
            {
                poly: slice,
                offset: new csg.CSG.Vector3D(first)
            },
            {
                poly: util.enlarge(slice, [-radius * 2, -radius * 2]),
                offset: new csg.CSG.Vector3D(last)
            }
        ];
    });
}

function fillet(object, radius, orientation, options) {
    options = options || {};
    return util.reShape(object, radius, orientation, options, function(
        first,
        last,
        slice
    ) {
        var v1 = new csg.CSG.Vector3D(first);
        var v2 = new csg.CSG.Vector3D(last);

        var res = options.resolution || csg.CSG.defaultResolution3D;

        var slices = util.array.range(0, res).map(function(i) {
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

function calcRotate(part, solid, axis, angle) {
    var axes = {
        x: [1, 0, 0],
        y: [0, 1, 0],
        z: [0, 0, 1]
    };
    var rotationCenter = solid.centroid();
    var rotationAxis = axes[axis];
    return { rotationCenter, rotationAxis };
}

function rotateAround(part, solid, axis, angle) {
    var { rotationCenter, rotationAxis } = util.calcRotate(
        part,
        solid,
        axis,
        angle
    );

    return part.rotate(rotationCenter, rotationAxis, angle);
}


var util$1 = Object.freeze({
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
function group(...args) {
    var self = { name: '', names: [], parts: {} };
    if (args && args.length > 0) {
        if (args.length === 2) {
            var [names, objects] = args;

            self.names = (names && names.length > 0 && names.split(',')) || [];

            if (Array.isArray(objects)) {
                self.parts = util.zipObject(self.names, objects);
            } else if (objects instanceof CSG) {
                self.parts = util.zipObject(self.names, [objects]);
            } else {
                self.parts = objects || {};
            }
        } else {
            var [objects] = args;
            self.names = Object.keys(objects).filter(k => k !== 'holes');
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
    self.map = function(cb) {
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
     * Add a CSG object to the current group.
     * @param {CSG} object Object to add the parts dictionary.
     * @param {string} name   Name of the part
     * @param {boolean} hidden If true, then the part not be added during a default `combine()`
     * @param {string} subparts   Prefix for subparts if adding a group
     * @param {string} parts   When adding a group, you can pick the parts you want to include as the named part.
     */
    self.add = function(object, name, hidden, subparts, parts) {
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

    self.clone = function(map) {
        if (!map) map = util.identity;

        // console.warn('clone() has been refactored');
        var group = util.group();
        Object.keys(self.parts).forEach(function(key) {
            var part = self.parts[key];
            var hidden = self.names.indexOf(key) == -1;
            group.add(map(CSG.fromPolygons(part.toPolygons())), key, hidden);
        });

        if (self.holes) {
            group.holes = util.toArray(self.holes).map(function(part) {
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
    self.rotate = function(solid, axis, angle) {
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

    self.combine = function(pieces, options, map) {
        options = Object.assign(
            {
                noholes: false
            },
            options
        );

        pieces = pieces ? pieces.split(',') : self.names;
        if (pieces.length === 0) {
            throw new Error(
                `no pieces found in ${self.name} pieces: ${
                    pieces
                } parts: ${Object.keys(self.parts)} names: ${self.names}`
            );
        }
        var g = union(
            util.mapPick(
                self.parts,
                pieces,
                function(value, key, object) {
                    return map ? map(value, key, object) : util.identity(value);
                },
                self.name
            )
        );

        return g.subtractIf(
            self.holes && Array.isArray(self.holes)
                ? union(self.holes)
                : self.holes,
            self.holes && !options.noholes
        );
    };

    self.combineAll = function(options, map) {
        return self.combine(Object.keys(self.parts).join(','), options, map);
    };

    self.toArray = function(pieces) {
        pieces = pieces ? pieces.split(',') : self.names;

        return pieces.map(function(piece) {
            if (!self.parts[piece])
                console.error(`Cannot find ${piece} in ${self.names}`);
            return self.parts[piece];
        });
    };

    self.snap = function snap(part, to, axis, orientation, delta) {
        // console.log('group.snap', part, self);
        var t = util.calcSnap(self.combine(part), to, axis, orientation, delta);
        self.map(function(part) {
            return part.translate(t);
        });

        return self;
    };

    self.align = function align(part, to, axis, delta) {
        var t = util.calcCenterWith(
            self.combine(part, { noholes: true }),
            axis,
            to,
            delta
        );
        self.map(function(part, name) {
            return part.translate(t);
        });

        // if (self.holes)
        //     self.holes = util.ifArray(self.holes, function(hole) {
        //         return hole.translate(t);
        //     });

        return self;
    };

    self.midlineTo = function midlineTo(part, axis, to) {
        var size = self.combine(part).size();
        var t = util.axisApply(axis, function(i, a) {
            return to - size[a] / 2;
        });
        // console.log('group.midlineTo', part, t);
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

    self.translate = function translate() {
        var t = Array.prototype.slice.call(arguments, 0).reduce(
            function(result, arg) {
                // console.log('arg', arg);
                result = util.array.addArray(result, arg);
                return result;
            },
            [0, 0, 0]
        );

        // console.log('group.translate', t);
        self.map(function(part) {
            return part.translate(t);
        });

        // if (self.holes)
        //     self.holes = util.ifArray(self.holes, function(hole) {
        //         return hole.translate(t);
        //     });

        return self;
    };

    self.pick = function(parts, map) {
        var p = (parts && parts.length > 0 && parts.split(',')) || self.names;
        if (!map) map = util.identity;

        var g = util.group();
        p.forEach(function(name) {
            g.add(
                map(CSG.fromPolygons(self.parts[name].toPolygons()), name),
                name
            );
        });
        return g;
    };

    self.array = function(parts, map) {
        var p = (parts && parts.length > 0 && parts.split(',')) || self.names;
        if (!map) map = util.identity;

        var a = [];
        p.forEach(function(name) {
            a.push(map(CSG.fromPolygons(self.parts[name].toPolygons()), name));
        });
        return a;
    };

    return self;
}

/**
  * Initialize `jscad-utils` and add utilities to the `proto` object.
  * @param  {proto} proto The global `proto` object
  * @augments proto
  */
function init(proto) {
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

    proto.prototype.size = function() {
        return util.size(this.getBounds());
    };

    proto.prototype.centroid = function() {
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

    proto.prototype.bisect = function bisect(
        axis,
        offset,
        angle,
        rotateaxis,
        rotateoffset,
        options
    ) {
        return util.bisect(
            this,
            axis,
            offset,
            angle,
            rotateaxis,
            rotateoffset,
            options
        );
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
            var t = Array.prototype.slice.call(arguments, 0).reduce(function(
                result,
                arg
            ) {
                // console.log('arg', arg);
                result = util.array.addArray(result, arg);
                return result;
            }, [0, 0, 0]);

            // console.log('translate', t);
            return this._translate(t);
        }
    };
}


var addPrototype = Object.freeze({
	default: init
});

const scadApi$1 = require('@jscad/scad-api');
const { cube, sphere, cylinder } = scadApi$1.primitives3d;

var parts = { BBox, Cube, RoundedCube };

function BBox(...objects) {
    var box = object =>
        csg.CSG.cube({
            center: object.centroid(),
            radius: object.size().dividedBy(2)
        });
    return objects.reduce(function(bbox, part) {
        var object = bbox ? union([bbox, box(part)]) : part;
        return box(object);
    });
}

function Cube(width) {
    var r = div(fromxyz(width), 2);
    return csg.CSG.cube({
        center: r,
        radius: r
    });
}

function RoundedCube(...args) {
    if (args[0].getBounds) {
        var size = util.size(args[0].getBounds());
        var r = [size.x / 2, size.y / 2];
        var thickness = size.z;
        var corner_radius = args[1];
    } else {
        var r = [args[0] / 2, args[1] / 2]; // eslint-disable-line no-redeclare
        var thickness = args[2]; // eslint-disable-line no-redeclare
        var corner_radius = args[3]; // eslint-disable-line no-redeclare
    }

    // console.log('RoundedCube.args', size, r, thickness, corner_radius);
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
    options = util.defaults(options, {
        start: [0, 0, 0],
        end: [0, 0, height],
        radius: diameter / 2
    });
    return csg.CSG.cylinder(options);
}

function Cone(diameter1, diameter2, height) {
    return csg.CSG.cylinder({
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

function Triangle(base, height) {
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
 * @param {Number} outsideDiameter Outside diameter of the tube
 * @param {Number} insideDiameter  Inside diameter of the tube
 * @param {Number} height          Height of the tube
 * @param {Object} outsideOptions  Options passed to the outside cylinder
 * @param {Object} insideOptions   Options passed to the inside cylinder
 * @returns {CSG}  A CSG Tube
 */
function Tube(
    outsideDiameter,
    insideDiameter,
    height,
    outsideOptions,
    insideOptions
) {
    return Parts.Cylinder(outsideDiameter, height, outsideOptions).subtract(
        Parts.Cylinder(insideDiameter, height, insideOptions || outsideOptions)
    );
}

function Board(width, height, corner_radius, thickness) {
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

const Hardware = {
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
        options = util.defaults(options, {
            orientation: 'up',
            clearance: [0, 0, 0]
        });

        var orientation = Parts.Hardware.Orientation[options.orientation];
        var group = util.group('head,thread', {
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
        var head = Parts.Cylinder(headDiameter, headLength);
        var thread = Parts.Cylinder(diameter, length);

        if (clearLength) {
            var headClearSpace = Parts.Cylinder(headDiameter, clearLength);
        }

        return Parts.Hardware.Screw(head, thread, headClearSpace, options);
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
        var head = Parts.Hexagon(headDiameter, headLength);
        var thread = Parts.Cylinder(diameter, length);

        if (clearLength) {
            var headClearSpace = Parts.Hexagon(headDiameter, clearLength);
        }

        return Parts.Hardware.Screw(head, thread, headClearSpace, options);
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
        var head = Parts.Cone(headDiameter, diameter, headLength);
        // var head = Parts.Cylinder(headDiameter, headLength);
        var thread = Parts.Cylinder(diameter, length);

        if (clearLength) {
            var headClearSpace = Parts.Cylinder(headDiameter, clearLength);
        }

        return Parts.Hardware.Screw(head, thread, headClearSpace, options);
    }
};


var parts$1 = Object.freeze({
	default: parts,
	BBox: BBox,
	Cube: Cube,
	RoundedCube: RoundedCube,
	Cylinder: Cylinder,
	Cone: Cone,
	Hexagon: Hexagon,
	Triangle: Triangle,
	Tube: Tube,
	Board: Board,
	Hardware: Hardware
});

/**
 * JsCad Utilities es6
 */

exports.util = util$1;
exports.triangle = triangle;
exports.array = array;
exports.group = group;
exports.init = addPrototype;
exports.parts = parts$1;
