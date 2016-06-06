/**
 * @module CSG
 */


/**
 * jscad-utils
 * @type {Object}
 * @exports util
 */
util = {
    /**
     * Print a message and CSG object bounds and size to the conosle.
     * @param  {String} msg Message to print
     * @param  {CSG} o   A CSG object to print the bounds and size of.
     */
    print: function (msg, o) {
        echo(msg, JSON.stringify(o.getBounds()), JSON.stringify(this.size(o.getBounds())));
    },

    label: function label(text, x, y, width, height) {
        var l = vector_text(x || 0, y || 0, text); // l contains a list of polylines to draw
        var o = [];
        l.forEach(function (pl) { // pl = polyline (not closed)
            o.push(rectangular_extrude(pl, {
                w: width || 2,
                h: height || 2
            })); // extrude it to 3D
        });
        return this.center(union(o));
    },

    unitCube: function (length, radius) {
        radius = radius || 0.5
        return CSG.cube({
            center: [0, 0, 0],
            radius: [radius, radius, length || 0.5]
        }).setColor(1, 0, 0);
    },

    unitAxis: function (length, radius, centroid) {
        // echo(length, JSON.stringify(centroid));
        centroid = centroid || [0, 0, 0];
        return util.unitCube(length, radius)
            .union([
                util.unitCube(length, radius).rotateY(90).setColor(0, 1, 0),
                util.unitCube(length, radius).rotateX(90).setColor(0, 0, 1)
            ]).translate(centroid);
    },

    triangle: {
        toRadians: function toRadians(deg) {
            return deg / 180 * Math.PI;
        },

        toDegrees: function toDegrees(rad) {
            return rad * (180 / Math.PI);
        },

        solve: function (p1, p2) {
            var r = {
                c: 90,
                A: Math.abs(p2.x) - Math.abs(p1.x),
                B: Math.abs(p2.y) - Math.abs(p1.y)
            }
            var brad = Math.atan2(r.B, r.A)
            r.b = util.triangle.toDegrees(brad);
            // r.C = Math.sqrt(Math.pow(r.B, 2) + Math.pow(r.A, 2));
            r.C = r.B / Math.sin(brad);
            r.a = 90 - r.b;

            return r;
        }
    },

    array: {
        div: function (a, f) {
            return _.map(a, function (e) {
                return e / f;
            });
        },

        add: function (a, f) {
            return _.map(a, function (e) {
                return e + f;
            });
        },

        toxyz: function (a) {
            return {
                x: a[0],
                y: a[1],
                z: a[2]
            };
        }
    },


    map: function (o, callback) {
        _.forIn(o, function (value, key) {
            echo('util.map', key);
            if (value instanceof CSG) {
                echo('key', value instanceof CSG);
                return value = callback(value, key);
            }
            return value;
        });
        return o;
    },

    divA: function divA(a, f) {
        return this.array.div(a, f);
    },

    divxyz: function (size, x, y, z) {
        return {
            x: size.x / x,
            y: size.y / y,
            z: size.z / z
        };
    },

    div: function (size, d) {
        return this.divxyz(size, d, d, d);
    },

    mulxyz: function (size, x, y, z) {
        return {
            x: size.x * x,
            y: size.y * y,
            z: size.z * z
        };
    },

    mul: function (size, d) {
        return this.divxyz(size, d, d, d);
    },

    xyz2array: function xyz2array(size) {
        return [size.x, size.y, size.z];
    },

    size: function size(bbox) {
        return {
            x: bbox[1].x - bbox[0].x,
            y: bbox[1].y - bbox[0].y,
            z: bbox[1].z - bbox[0].z
        };
    },

    center: function center(object, size) {
        size = size || this.size(object.getBounds());
        return this.centerY(this.centerX(object, size), size);
    },

    centerY: function centerY(object, size) {
        size = size || this.size(object.getBounds());
        return object.translate([0, -size.y / 2, 0]);
    },

    centerX: function centerX(object, size) {
        size = size || this.size(object.getBounds());
        return object.translate([-size.x / 2, 0, 0]);
    },

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
    enlarge: function enlarge(object, x, y, z) {
        if (_.isArray(x)) {
            var a = x;
            x = a[0];
            y = a[1];
            z = a[2];
        }
        // echo('en', _.isArray(x), JSON.stringify(a), x, y, z);
        var c = util.centroid(object);
        var size = this.size(object.getBounds());

        function scale(size, value) {
            if (value == 0) return 1;

            // echo('scale', size, value, (100 / (size / value)) / 100);
            return 1 + ((100 / (size / value)) / 100);
        }
        var s = [scale(size.x, x), scale(size.y, y), scale(size.z, z)];
        var new_object = object.scale(s);
        var nc = util.centroid(new_object);

        /// Calculate the difference between the original centroid and the new
        /// centroid, so that the object can be translated to it's original position.
        var delta = [-(nc[0] - c[0]), -(nc[1] - c[1]), -(nc[2] - c[2])]
            // echo('enlarge centroid', JSON.stringify(c), JSON.stringify(nc), JSON.stringify(delta));
            // echo('enlarge size', JSON.stringify(size), JSON.stringify(s), JSON.stringify(util.size(new_object.getBounds())));
        return new_object.translate(delta);
    },

    fit: function fit(object, x, y, z, keep_aspect_ratio) {
        var a;
        if (_.isArray(x)) {
            var a = x;
            keep_aspect_ratio = y;
            x = a[0];
            y = a[1];
            z = a[2];
        } else {
            a = [x, y, z];
        }

        var c = util.centroid(object);
        var size = this.size(object.getBounds());

        function scale(size, value) {
            if (value == 0) return 1;
            return value / size;
        }

        var s = [scale(size.x, x), scale(size.y, y), scale(size.z, z)];
        var min = _.min(s);

        return util.centerWith(object.scale(s.map(function (d, i) {
            if (a[i] === 0) return 1; // don't scale when value is zero
            return keep_aspect_ratio ? min : d;
        })), 'xyz', object);
    },

    shift: function shift(object, x, y, z) {
        var hsize = this.div(this.size(object.getBounds()), 2);
        echo('hsize', JSON.stringify(hsize));
        return object.translate(this.xyz2array(this.mulxyz(hsize, x, y, z)));
    },

    zero: function shift(object) {
        var bounds = object.getBounds();
        echo('zero', JSON.stringify(bounds));
        return object.translate([0, 0, -bounds[0].z]);
    },

    mirrored4: function mirrored4(x) {
        return x.union([x.mirroredY(90), x.mirroredX(90), x.mirroredY(90).mirroredX(90)]);
    },

    flushSide: {
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
    },

    calcFlush: function calcFlush(moveobj, withobj, axes, mside, wside) {
        var side

        if (mside === 0 || mside === 1) {
            // wside = wside !== undefined ? wside : mside;
            side = [wside !== undefined ? wside : mside, mside]
        } else {
            side = util.flushSide[mside];
            if (!side) console.error('invalid side: ' + mside)
        }

        var m = moveobj.getBounds();
        var w = withobj.getBounds();

        // Add centroid if needed
        if (side[0] === -1) {
            w[-1] = util.array.toxyz(withobj.centroid());
        }

        return this.axisApply(axes, function (i, axis) {
            return w[side[0]][axis] - m[side[1]][axis];
        });
    },

    /**
     * Moves an object flush with another object
     * @param  {CSG} moveobj Object to move
     * @param  {CSG} withobj Object to make flush with
     * @param  {String} axis    Which axis: 'x', 'y', 'z'
     * @param  {Number} mside   0 or 1
     * @param  {Number} wside   0 or 1
     * @return {CSG}         [description]
     */
    flush: function flush(moveobj, withobj, axis, mside, wside) {
        // mside: 0 or 1
        // axis: 'x', 'y', 'z'
        // wside = wside !== undefined ? wside : mside;
        // var m = moveobj.getBounds();
        // var w = withobj.getBounds()
        // var d = w[wside][axis] - m[mside][axis];
        // var ta = [d, 0, 0];
        // if (axis != 'x') {
        //     ta = axis == 'y' ? [0, d, 0] : [0, 0, d];
        // }
        // echo('flush', JSON.stringify(ta));
        return moveobj.translate(util.calcFlush(moveobj, withobj, axis, mside, wside))
    },

    axisApply: function (axis, valfun) {
        var retval = [0, 0, 0];
        var lookup = {
            x: 0,
            y: 1,
            z: 2
        };

        axis.split('').forEach(function (ax) {
            retval[lookup[ax]] = valfun(lookup[ax], ax);
        })

        return retval;
    },

    axis2array: function (axes, valfun) {
        var a = [0, 0, 0];
        var lookup = {
            x: 0,
            y: 1,
            z: 2
        };

        axes.split('').forEach(function (axis) {
            var i = lookup[axis];
            a[i] = valfun(i);
        });
        return a;
    },

    centroid: function (o) {
        var b = o.getBounds();
        var s = util.size(b);
        var centroid = _.map(b[0], function (p, i) {
            /// the bounds have the axis with a `_` in front (_x, _y, _z).  Strip
            /// it off and lookup the size and add half to each axis to find the centroid.
            return p + (s[i.slice(1)] / 2);
        });
        return centroid;
    },

    midlineTo: function midlineTo(o, axis, to) {
        var b = o.getBounds();
        var s = util.size(b);
        var centroid = util.centroid(o);

        return o.translate(util.axisApply(axis, function (i) {
            return to - centroid[i];
        }));
    },

    translator: function translator(o, axis, withObj) {
        var centroid = util.centroid(o);
        var withCentroid = util.centroid(withObj);
        // echo('centerWith', centroid, withCentroid);
        var t = util.axisApply(axis, function (i) {
            return withCentroid[i] - centroid[i];
        });

        echo('translator', t);
        return t;
    },

    //  centerWith: function centerWith(o, axis, withObj) {
    //    var centroid = util.centroid(o);
    //    var withCentroid = util.centroid(withObj);
    //    // echo('centerWith', centroid, withCentroid);
    //
    //    return o.translate(util.axisApply(axis, function (i) {
    //      return withCentroid[i] - centroid[i];
    //    }));
    //  },

    calcCenterWith: function calcCenterWith(o, axis, withObj) {
        var centroid = util.centroid(o);
        var withCentroid = util.centroid(withObj);
        // echo('centerWith', centroid, withCentroid);

        return util.axis2array(axis, function (i) {
            return withCentroid[i] - centroid[i];
        });
    },

    centerWith: function centerWith(o, axis, withObj) {
        return o.translate(util.calcCenterWith(o, axis, withObj));
    },

    /**
     * Initialize `jscad-utils` and add utilities to the `CSG` object.
     * @param  {CSG} CSG The global `CSG` object
     * @augments CSG
     */
    init: function init(CSG) {
        /**
         * Moves an object flush with another object
         * @param  {CSG} obj   withobj Object to make flush with
         * @param  {String} axis    Which axis: 'x', 'y', 'z'
         * @param  {Number} mside   0 or 1
         * @param  {Number} wside   0 or 1
         * @return {CSG}       [description]
         */
        CSG.prototype.flush = function flush(to, axis, mside, wside) {
            return util.flush(this, to, axis, mside, wside);
        };

        /**
         * Snap the object to another object.  You can snap to the inside or outside
         * of an object.  Snapping to the `z`
         * axis `outside-` will place the object on top of the `to` object.  `sphere.snap(cube, 'z', 'outside-')` is saying that you want the bottom of the `sphere` (`-`) to be placed on the outside of the `z` axis of the `cube`.
         *
         * ![snap example](jsdoc2md/snap.gif)
         * @example
         * include('lodash.js');
         * include('jscad-utils.jscad');
         *
         * // rename mainx to main
         * function mainx() {
         *    util.init(CSG);
         *
         *    var cube = CSG.cube({
         *        radius: 10
         *    }).setColor(1, 0, 0);
         *
         *    var sphere = CSG.sphere({
         *        radius: 5
         *    }).setColor(0, 0, 1);
         *
         *    return cube.union(sphere.snap(cube, 'z', 'outside-'));
         * }
         *
         * @param  {CSG} to object - The object to snap to.
         * @param  {string} axis - Which axis to snap on ['x', 'y', 'z'].  You can combine axes, ex: 'xy'
         * @param  {string} orientation Which side to snap to and in what direction (+ or -). ['outside+', 'outside-', 'inside+', 'inside-', 'center+', 'center-']
         * @return {CSG}             [description]
         * @alias snap
         * @memberof module:CSG
         * @augments CSG
         * @chainable
         */
        CSG.prototype.snap = function snap(to, axis, orientation, b) {
            return util.flush(this, to, axis, orientation, b);
        };

        /**
         * Moves an objects midpoint on an axis a certain distance.
         * @param  {String} axis Axis to move the object along.
         * @param  {Number} to   The distance to move the midpoint of the object.
         * @return {CGE}      A translated CGE object.
         */
        CSG.prototype.midlineTo = function midlineTo(axis, to) {
            return util.midlineTo(this, axis, to);
        };

        CSG.prototype.centerWith = function centerWith(axis, to) {
            return util.centerWith(this, axis, to);
        };

        CSG.prototype.center = function centerWith(to, axis) {
            return util.centerWith(this, axis, to);
        };

        /**
         * Align with another object on the selected axis.
         * @param  {CSG} to   The object to align to.
         * @param  {string} axis A string indicating which axis to align, 'x', 'y', 'z', or any combination including 'xyz'.
         * @alias align
         * @memberof module:CSG
         * @augments CSG
         * @chainable
         */
        CSG.prototype.align = function align(to, axis) {

            return util.centerWith(this, axis, to);
        };

        /**
         * Enlarge (scale) an object in drawing units rather than percentage.
         * For example, o.enlarge(1, 0, 0) scales the x axis by 1mm, and moves
         * o -0.5mm so the center remains the same.
         * @param  {number} x [description]
         * @param  {number} y [description]
         * @param  {number} z [description]
         * @return {CSG}   [description]
         */
        CSG.prototype.enlarge = function enlarge(x, y, z) {
            return util.enlarge(this, x, y, z);
        }

        CSG.prototype.fit = function fit(x, y, z, a) {
            return util.fit(this, x, y, z, a);
        }

        if (CSG.size) echo('CSG already has .size');
        CSG.prototype.size = function () {
            return util.size(this.getBounds());
        }

        CSG.prototype.centroid = function () {
            return util.centroid(this);
        }

        /**
         * Places an object at zero on the `z` axis.
         */
        CSG.prototype.Zero = function zero() {
            return util.zero(this);
        };


    }
};;
