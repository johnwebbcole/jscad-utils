/**
 * @module CSG
 */


/**
 * jscad-utils
 * @type {Object}
 * @exports util
 */
util = {

    identity: function (solid) {
        return solid;
    },

    /**
     * Print a message and CSG object bounds and size to the conosle.
     * @param  {String} msg Message to print
     * @param  {CSG} o   A CSG object to print the bounds and size of.
     */
    print: function (msg, o) {
        echo(msg, JSON.stringify(o.getBounds()), JSON.stringify(this.size(o.getBounds())));
    },

    error: function (msg) {
        if (console && console.error) console.error(msg); // eslint-disable-line no-console
        throw new Error(msg);
    },

    depreciated: function (method, error, message) {
        var msg = method + ' is depreciated.' + ((' ' + message) || '');
        if (console && console.error) console[error ? 'error' : 'warn'](msg); // eslint-disable-line no-console
        if (error) throw new Error(msg);
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
        radius = radius || 0.5;
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
            };
            var brad = Math.atan2(r.B, r.A);
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

        addValue: function (a, f) {
            return _.map(a, function (e) {
                return e + f;
            });
        },

        addArray: function (a, f) {
            return _.map(a, function (e, i) {
                return e + f[i];
            });
        },

        add: function (a, f) {
            if (_.isArray(f)) {
                return util.array.addArray(a, f);
            } else {
                return util.array.addValue(a, f);
            }
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
            // echo('util.map', key);
            if (value instanceof CSG) {
                // echo('key', value instanceof CSG);
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

    /**
     * Returns a `Vector3D` with the size of the object.
     * @param  {CSG} o A `CSG` like object or an array of `CSG.Vector3D` objects (the result of getBounds()).
     * @return {CSG.Vector3D}   Vector3d with the size of the object
     */
    size: function size(o) {
        var bbox = o.getBounds ? o.getBounds() : o;

        var foo = bbox[1].minus(bbox[0]);
        return foo;
    },

    /**
     * Returns a scale factor (0.0-1.0) for an object
     * that will resize it by a value in size units instead
     * of percentages.
     * @param  {number} size  Object size
     * @param  {number} value Amount to add (negative values subtract) from the size of the object.
     * @return {number}       Scale factor
     */
    scale: function scale(size, value) {
        if (value == 0) return 1;

        return 1 + ((100 / (size / value)) / 100);
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
        var a;
        if (_.isArray(x)) {
            a = x;
        } else {
            a = [x, y, z];
        }

        var size = util.size(object);
        var centroid = util.centroid(object, size);

        var idx = 0;
        var t = _.map(size, function (i) {
            return util.scale(i, a[idx++]);
        });

        var new_object = object.scale(t);
        var new_centroid = util.centroid(new_object);

        /// Calculate the difference between the original centroid and the new
        var delta = new_centroid.minus(centroid).times(-1);

        return new_object.translate(delta);
    },

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
    fit: function fit(object, x, y, z, keep_aspect_ratio) {
        var a;
        if (_.isArray(x)) {
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
        var min = _.min(s);

        return util.centerWith(object.scale(s.map(function (d, i) {
            if (a[i] === 0) return 1; // don't scale when value is zero
            return keep_aspect_ratio ? min : d;
        })), 'xyz', object);
    },

    shift: function shift(object, x, y, z) {
        var hsize = this.div(this.size(object.getBounds()), 2);
        return object.translate(this.xyz2array(this.mulxyz(hsize, x, y, z)));
    },

    zero: function shift(object) {
        var bounds = object.getBounds();
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

        return this.axisApply(axes, function (i, axis) {
            return w[side[0]][axis] - m[side[1]][axis];
        });
    },

    calcSnap: function calcSnap(moveobj, withobj, axes, orientation, delta) {
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
        var w = withobj.getBounds();

        // Add centroid if needed
        if (side[0] === -1) {
            w[-1] = withobj.centroid();
        }

        var t = this.axisApply(axes, function (i, axis) {
            return w[side[0]][axis] - m[side[1]][axis];
        });

        return delta ? util.array.add(t, delta) : t;
    },

    snap: function snap(moveobj, withobj, axis, orientation, delta) {
        return moveobj.translate(util.calcSnap(moveobj, withobj, axis, orientation, delta));
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
        return moveobj.translate(util.calcFlush(moveobj, withobj, axis, mside, wside));
    },

    axisApply: function (axes, valfun) {
        var retval = [0, 0, 0];
        var lookup = {
            x: 0,
            y: 1,
            z: 2
        };
        axes.split('').forEach(function (axis) {
            retval[lookup[axis]] = valfun(lookup[axis], axis);
        });

        return retval;
    },

    axis2array: function (axes, valfun) {
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
    },

    centroid: function (o, size) {
        var bounds = o.getBounds();
        size = size || util.size(bounds);

        return bounds[0].plus(size.dividedBy(2));
    },

    midlineTo: function midlineTo(o, axis, to) {
        var centroid = util.centroid(o);

        return o.translate(util.axisApply(axis, function (i, a) {
            return to - centroid[a];
        }));
    },

    translator: function translator(o, axis, withObj) {
        var centroid = util.centroid(o);
        var withCentroid = util.centroid(withObj);
        // echo('centerWith', centroid, withCentroid);
        var t = util.axisApply(axis, function (i) {
            return withCentroid[i] - centroid[i];
        });

        return t;
    },

    calcCenterWith: function calcCenterWith(o, axes, withObj, delta) {

        var centroid = util.centroid(o);
        var withCentroid = util.centroid(withObj);

        var t = util.axisApply(axes, function (i, axis) {
            return withCentroid[axis] - centroid[axis];
        });

        return delta ? util.array.add(t, delta) : t;
    },

    centerWith: function centerWith(o, axis, withObj) {
        return o.translate(util.calcCenterWith(o, axis, withObj));
    },

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
    group: function group(names, objects) {

        var self = {};

        self.names = names.split(',');

        self.parts = (objects instanceof Array) ? _.zipObject(self.names, objects) : objects;

        /**
         * Apply a function to each element in the group.
         * @param  {Function} cb Callback founction applied to each part.
         * It is called with the parameters `(value, key)`
         * @return {Object}      Returns this object so it can be chained
         */
        self.map = function (cb) {

            self.parts = _.transform(self.parts, function (result, value, key) {
                result[key] = cb(value, key);
            });

            if (self.holes) {

                if (_.isArray(self.holes)) {
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
         */
        self.add = function (object, name, hidden) {
            if (!hidden) self.names.push(name);
            self.parts[name] = object;
            return self;
        };

        self.clone = function (map) {
            if (!map) map = util.identity;
            var group = util.group(self.names.join(','), _.mapValues(self.parts, function (part, name) {
                return map(CSG.fromPolygons(part.toPolygons()), name);
            }));
            if (self.holes) {
                group.holes = self.holes.map(function (part) {
                    return map(CSG.fromPolygons(part.toPolygons()), 'holes');
                });
            }
            return group;
        };

        self.rotate = function (solid, axis, angle) {
            var axes = {
                'x': [1, 0, 0],
                'y': [0, 1, 0],
                'z': [0, 0, 1]
            };
            var rotationCenter = solid.centroid();
            var rotationAxis = axes[axis];

            self.map(function (part) {
                return part.rotate(rotationCenter, rotationAxis, angle);
            });
            return self;
        };

        self.combine = function (pieces, options, map) {

            options = _.defaults(options, {
                noholes: false
            });
            pieces = pieces ? pieces.split(',') : self.names;
            // console.log('pieces', pieces);
            var g;
            if (map) {
                g = union(
                    _.chain(this.parts)
                    .pick(pieces)
                    .mapValues(function (value, key, object) {
                        return map(value, key, object);
                    })
                    .values()
                    .value());

            } else {
                g = union(
                    _.chain(this.parts)
                    .pick(pieces)
                    .values()
                    .value());

            }

            if (self.holes && !options.noholes) {
                return g.subtract(_.isArray(self.holes) ? union(self.holes) : self.holes);
            } else {
                return g;
            }
        };

        return self;
    },

    /**
     * Cut an object into two pieces, along a given axis.
     * ![bisect example](jsdoc2md/bisect.png)
     * @param  {CSG} object object to bisect
     * @param  {string} axis   axis to cut along
     * @param  {number} offset offset to cut at
     * @return {object}  Returns a group object with a parts object.
     */
    bisect: function bisect(object, axis, offset) {
        var info = util.normalVector(axis);
        var bounds = object.getBounds();
        var size = util.size(object);


        // console.log('bisect', axis, offset, info);
        var cutDelta = util.axisApply(axis, function (i, a) {
            return bounds[0][a] + (offset || size[axis] / 2);
        });

        var cutplane = CSG.OrthoNormalBasis.GetCartesian(info.orthoNormalCartesian[0], info.orthoNormalCartesian[1]).translate(cutDelta);
        return util.group('negative,positive', [object.cutByPlane(cutplane.plane).color('red'), object.cutByPlane(cutplane.plane.flipped()).color('blue')]);
        // return object
    },

    slices2poly: function slices2poly(slices, options, axis) {
        // console.log('util.slices2poly', options);
        // var resolution = slices.length;
        // var offsetVector = new CSG.Vector3D(options.offset);
        var twistangle = CSG.parseOptionAsFloat(options, 'twistangle', 0);
        var twiststeps = CSG.parseOptionAsInt(options, 'twiststeps', CSG.defaultResolution3D);

        if (twistangle == 0 || twiststeps < 1) {
            twiststeps = 1;
        }

        var normalVector = options.si.normalVector;

        var polygons = [];

        // bottom and top
        var first = _.first(slices);
        var last = _.last(slices);
        var up = first.offset[axis] > last.offset[axis];

        // _toPlanePolygons only works in the 'z' axis.  It's hard coded
        // to create the poly using 'x' and 'y'.
        polygons = polygons.concat(first.poly._toPlanePolygons({
            translation: first.offset,
            normalVector: normalVector,
            flipped: !(up)
        }));

        var rotateAxis = 'rotate' + axis.toUpperCase();
        polygons = polygons.concat(last.poly._toPlanePolygons({
            translation: last.offset,
            normalVector: normalVector[rotateAxis](twistangle),
            flipped: up
        }));

        // rotate with quick short circut
        var rotate = twistangle === 0 ? function rotateZero(v) {
            return v;
        } : function rotate(v, angle, percent) {
            return v[rotateAxis](angle * percent);
        };

        // walls
        var connectorAxis = last.offset.minus(first.offset).abs();
        // console.log('connectorAxis', connectorAxis);
        slices.forEach(function (slice, idx) {
            if (idx < slices.length - 1) {
                var nextidx = idx + 1;
                var top = !up ? slices[nextidx] : slice;
                var bottom = up ? slices[nextidx] : slice;

                var c1 = new CSG.Connector(bottom.offset, connectorAxis,
                    rotate(normalVector, twistangle, idx / slices.length));
                var c2 = new CSG.Connector(top.offset, connectorAxis,
                    rotate(normalVector, twistangle, nextidx / slices.length));

                // console.log('slices2poly.slices', c1.point, c2.point);
                polygons = polygons.concat(bottom.poly._toWallPolygons({
                    cag: top.poly,
                    toConnector1: c1,
                    toConnector2: c2
                }));
            }
        });

        return CSG.fromPolygons(polygons);
    },

    normalVector: function normalVector(axis) {
        var axisInfo = {
            'z': {
                orthoNormalCartesian: ['X', 'Y'],
                normalVector: CSG.Vector3D.Create(0, 1, 0)
            },
            'x': {
                orthoNormalCartesian: ['Y', 'Z'],
                normalVector: CSG.Vector3D.Create(0, 0, 1)
            },
            'y': {
                orthoNormalCartesian: ['X', 'Z'],
                normalVector: CSG.Vector3D.Create(0, 0, 1)
            }
        };
        if (!axisInfo[axis]) util.error('util.normalVector: invalid axis ' + axis);
        return axisInfo[axis];
    },

    sliceParams: function sliceParams(orientation, radius, bounds) {
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

        return _.assign({
            axis: axis,
            cutDelta: util.axisApply(axis, function (i, a) {
                return bounds[info.sizeIdx][a] + (Math.abs(radius) * info.sizeDir);
            }),
            moveDelta: util.axisApply(axis, function (i, a) {
                return bounds[info.sizeIdx][a] + (Math.abs(radius) * info.moveDir);
            })
        }, info, util.normalVector(axis));
    },

    solidFromSlices: function (slices, heights) {
        var si = {
            axis: 'z',
            cutDelta: {},
            moveDelta: {},
            orthoNormalCartesian: ['X', 'Y'],
            normalVector: CSG.Vector3D.Create(0, 1, 0)
        }
    },

    reShape: function reShape(object, radius, orientation, options, slicer) {
        options = options || {};
        var b = object.getBounds();
        // var s = util.size(b);
        var ar = Math.abs(radius);
        var si = util.sliceParams(orientation, radius, b);

        if (si.axis !== 'z') throw new Error('util.reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.');

        var cutplane = CSG.OrthoNormalBasis.GetCartesian(si.orthoNormalCartesian[0], si.orthoNormalCartesian[1]).translate(si.cutDelta);

        var slice = object.sectionCut(cutplane);

        var first = util.axisApply(si.axis, function () {
            return si.positive ? 0 : ar;
        });

        var last = util.axisApply(si.axis, function () {
            return si.positive ? ar : 0;
        });

        var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();

        var slices = slicer(first, last, slice);

        var delta = util.slices2poly(slices, _.assign(options, {
            si: si
        }), si.axis).color(options.color);

        var remainder = object.cutByPlane(plane);
        return union([options.unionOriginal ? object : remainder,
            delta.translate(si.moveDelta)
        ]);
    },

    chamfer: function chamfer(object, radius, orientation, options) {
        return util.reShape(object, radius, orientation, options, function (first, last, slice) {
            return [{
                poly: slice,
                offset: new CSG.Vector3D(first)
            }, {
                poly: util.enlarge(slice, [-radius * 2, -radius * 2]),
                offset: new CSG.Vector3D(last)
            }];
        });
    },

    fillet: function fillet(object, radius, orientation, options) {
        options = options || {};
        return util.reShape(object, radius, orientation, options, function (first, last, slice) {
            var v1 = new CSG.Vector3D(first);
            var v2 = new CSG.Vector3D(last);

            var res = options.resolution || CSG.defaultResolution3D;

            var slices = _.range(0, res).map(function (i) {
                var p = i > 0 ? i / (res - 1) : 0;
                var v = v1.lerp(v2, p);

                var size = (-radius * 2) - (Math.cos(Math.asin(p)) * (-radius * 2));

                return {
                    poly: util.enlarge(slice, [size, size]),
                    offset: v
                };
            });

            return slices;
        });
    },

    /**
     * Initialize `jscad-utils` and add utilities to the `CSG` object.
     * @param  {CSG} CSG The global `CSG` object
     * @augments CSG
     */
    init: function init(CSG) {
        // initialize colors if the object is available
        if (Colors && Colors.init) Colors.init(CSG);

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
        CSG.prototype.snap = function snap(to, axis, orientation, delta) {
            return util.snap(this, to, axis, orientation, delta);
        };

        CSG.prototype.calcSnap = function calcSnap(to, axis, orientation, delta) {
            return util.calcSnap(this, to, axis, orientation, delta);
        };

        /**
         * Moves an objects midpoint on an axis a certain distance.  This is very useful when creating parts
         * from mechanical drawings.
         * For example, the [RaspberryPi Hat Board Specification](https://github.com/raspberrypi/hats/blob/master/hat-board-mechanical.pdf) has several pieces with the midpoint measured.
         * ![pi hat drawing](jsdoc2md/rpi-hat.png)
         * To avoid converting the midpoint to the relative position, you can use `midpointTo`.
         * ![midlineTo example](jsdoc2md/midlineto.gif)
         * @example
         * include('lodash.js');
         * include('utils.jscad');
         *
         * // rename mainx to main
         * function mainx() {
         *    util.init(CSG);
         *
         *    // create a RPi hat board
         *    var board = Parts.Board(65, 56.5, 3).color('green');
         *
         *    // a 40 pin gpio
         *    var gpio = Parts.Cube([52.2, 5, 8.5])
         *        .snap(board, 'z', 'outside+')
         *        .midlineTo('x', 29 + 3.5)
         *        .midlineTo('y', 49 + 3.5)
         *        .color('black')
         *
         *    var camera_flex_slot = Parts.Board(2, 17, 1)
         *        .midlineTo('x', 45)
         *        .midlineTo('y', 11.5)
         *        .color('red');
         *
         *    // This is more group, due to the outside 1mm          * roundover.
         *    // Create a board to work from first.  The spec
         *    // has the edge offset, not the midline listed as          * 19.5mm.
         *    // Bisect the cutout into two parts.
         *    var display_flex_cutout = Parts.Board(5, 17, 1)
         *        .translate([0, 19.5, 0])
         *        .bisect('x');
         *
         *    // Bisect the outside (negative) part.
         *    var edges = display_flex_cutout.parts.negative.bisect('y');
         *
         *    // Create a cube, and align it with the rounded edges
         *    // of the edge, subtract the edge from it and move it
         *    // to the other side of the coutout.
         *    var round1 = Parts.Cube([2, 2, 2])
         *        .snap(edges.parts.positive, 'xyz', 'inside-')
         *        .subtract(edges.parts.positive)
         *        .translate([0, 17, 0]);
         *
         *    // Repeat for the opposite corner
         *    var round2 = Parts.Cube([2, 2, 2])
         *        .snap(edges.parts.negative, 'yz', 'inside+')
         *        .snap(edges.parts.negative, 'x', 'inside-')
         *        .subtract(edges.parts.negative)
         *        .translate([0, -17, 0]);
         *
         *    // Create a cube cutout so the outside is square instead of rounded.
         *    // The `round1` and `round2` parts will be used to subtract off the rounded outside corner.
         *    var cutout = Parts.Cube(display_flex_cutout.parts.negative.size()).align(display_flex_cutout.parts.negative, 'xyz');
         *
         *    return board
         *        .union(gpio)
         *        .subtract(camera_flex_slot)
         *        .subtract(union([display_flex_cutout.parts.positive,
         *            cutout
         *        ]))
         *        .subtract(round1)
         *        .subtract(round2);
         * }

         * @param  {String} axis Axis to move the object along.
         * @param  {Number} to   The distance to move the midpoint of the object.
         * @return {CGE}      A translated CGE object.
         * @alias midlineTo
         * @memberof module:CSG
         * @augments CSG
         * @chainable
         */
        CSG.prototype.midlineTo = function midlineTo(axis, to) {
            return util.midlineTo(this, axis, to);
        };

        CSG.prototype.centerWith = function centerWith(axis, to) {
            util.depreciated('centerWith', false, 'Use align instead.');
            return util.centerWith(this, axis, to);
        };

        if (CSG.center) echo('CSG already has .center');
        CSG.prototype.center = function centerWith(to, axis) {
            util.depreciated('center', false, 'Use align instead.');
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
            // console.log('align', to.getBounds(), axis);
            return util.centerWith(this, axis, to);
        };

        CSG.prototype.calcAlign = function calcAlign(to, axis, delta) {
            return util.calcCenterWith(this, axis, to, delta);
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
        };

        /**
         * Fit an object inside a bounding box. Often
         * used to fit text on the face of an object.
         *  A zero for a size value will leave that axis untouched.
         * ![fit example](jsdoc2md/fit.png)
         * @param  {number | array} x size of x or array of axes
         * @param  {number | boolean} y size of y axis or a boolean too keep the aspect ratio if `x` is an array
         * @param  {number} z size of z axis
         * @param  {boolean} a Keep objects aspect ratio
         * @alias fit
         * @memberof module:CSG
         * @augments CSG
         * @return {CSG}   The new object fitted inside a bounding box
         * @example
         * include('lodash.js');
         * include('utils.jscad');
         *
         * // rename mainx to main
         * function mainx() {
         *    util.init(CSG);
         *
         *    var cube = CSG.cube({
         *        radius: 10
         *    }).color('orange');
         *
         *    // create a label, place it on top of the cube
         *    // and center it on the top face
         *    var label = util.label('hello')
         *        .snap(cube, 'z', 'outside-')
         *        .align(cube, 'xy');
         *
         *    var s = cube.size();
         *    // fit the label to the cube (minus 2mm) while
         *    // keeping the aspect ratio of the text
         *    // and return the union
         *    return cube.union(label.fit([s.x - 2, s.y - 2, 0], true).color('blue'));
         * }
         */
        CSG.prototype.fit = function fit(x, y, z, a) {
            return util.fit(this, x, y, z, a);
        };

        if (CSG.size) echo('CSG already has .size');
        /**
         * Returns the size of the object in a `Vector3D` object.
         * @alias size
         * @memberof module:CSG
         * @augments CSG
         * @return {CSG.Vector3D} A `CSG.Vector3D` with the size of the object.
         * @example
         * var cube = CSG.cube({
         *     radius: 10
         * }).setColor(1, 0, 0);
         *
         * var size = cube.size()
         *
         * // size = {"x":20,"y":20,"z":20}
         */
        CSG.prototype.size = function () {
            return util.size(this.getBounds());
        };

        /**
         * Returns the centroid of the current objects bounding box.
         * @alias centroid
         * @memberof module:CSG
         * @augments CSG
         * @return  {CSG.Vector3D} A `CSG.Vector3D` with the center of the object bounds.
         */
        CSG.prototype.centroid = function () {
            return util.centroid(this);
        };

        /**
         * Places an object at zero on the `z` axis.
         */
        CSG.prototype.Zero = function zero() {
            return util.zero(this);
        };

        CSG.Vector2D.prototype.map = function Vector2D_map(cb) {
            return new CSG.Vector2D(cb(this.x), cb(this.y));
        };

        /**
         * Add a fillet or roundover to an object.
         * ![fillet example](jsdoc2md/fillet.png)
         *
         * @example
         * include('lodash.js');
         * include('utils.jscad');
         *
         * // rename mainx to main
         * function mainx() {
         * util.init(CSG);
         *
         * var cube = Parts.Cube([10, 10, 10]);
         *
         * return cube
         *   .fillet(2, 'z+') // roundover on top (positive fillet)
         *   .fillet(-2, 'z-') // fillet on  the bottom (negative fillet)
         *   .color('orange');
         * }
         * @param  {number} radius      Radius of fillet.  Positive and negative radius will create a fillet or a roundover.
         * @param  {string} orientation Axis and end (positive or negative) to place the chamfer.  Currently on the `z` axis is supported.
         * @param  {object} options     additional options.
         * @return {CSG}             [description]
         * @alias fillet
         * @memberof module:CSG
         * @augments CSG
         * @chainable
         */
        CSG.prototype.fillet = function fillet(radius, orientation, options) {
            return util.fillet(this, radius, orientation, options);
        };

        /**
         * Add a chamfer to an object.  This modifies the object by removing part of the object and reducing its size over the radius of the chamfer.
         * ![chamfer example](jsdoc2md/chamfer.png)
         * @example
         * include('lodash.js');
         * include('jscad-utils.jscad');
         *
         * // rename mainx to main
         * function mainx() {
         * util.init(CSG);
         *
         * var cube = CSG.cube({
         *     radius: 10
         * });
         *
         * return cube.chamfer(2, 'z+').color('orange');
         * }
         *
         * @param  {number} radius      Radius of the chamfer
         * @param  {string} orientation Axis and end (positive or negative) to place the chamfer.  Currently on the `z` axis is supported.
         * @return {CSG}             [description]
         * @alias chamfer
         * @memberof module:CSG
         * @augments CSG
         * @chainable
         */
        CSG.prototype.chamfer = function chamfer(radius, orientation, options) {
            return util.chamfer(this, radius, orientation, options);
        };

        /**
         * Cuts an object into two parts.  You can modify the offset, otherwise two equal parts are created.  The `group` part returned has a `positive` and `negative` half, cut along the desired axis.
         * ![bisect example](jsdoc2md/bisect.png)
         * @param  {string} axis   Axis to cut the object
         * @param  {number} offset Offset to cut the object.  Defaults to the middle of the object
         * @return {object}        A group group object with a parts dictionary and a `combine()` method.
         * @alias bisect
         * @memberof module:CSG
         * @augments CSG
         */
        CSG.prototype.bisect = function bisect(axis, offset) {
            return util.bisect(this, axis, offset);
        };

        CSG.prototype.unionIf = function unionIf(object, condition) {
            return condition ? this.union(object) : this;
        };

        CSG.prototype.subtractIf = function subtractIf(object, condition) {
            return condition ? this.subtract(object) : this;
        };

    }
};
