/**
 * JWC jscad utilities
 * @module CSG
 */

/**
 * jscad-utils
 * @type {Object}
 * @exports util
 */
util = {
    NOZZEL_SIZE: 0.4,
    nearest: {
        /**
         * Return the largest number that is a multiple of the
         * nozzel size.
         * @param  {Number} desired                   Desired value
         * @param  {Number} [nozzel=util.NOZZEL_SIZE] Nozel size, defaults to `util.NOZZEL_SIZE`
         * @param  {Number} [nozzie=0]                Number of nozzel sizes to add to the value
         * @return {Number}                           Multiple of nozzel size
         */
        under: function(desired, nozzel = util.NOZZEL_SIZE, nozzie = 0) {
            return (Math.floor(desired / nozzel) + nozzie) * nozzel;
        },
        /**
         * Returns the largest number that is a multipel of the
         * nozzel size, just over the desired value.
         * @param  {Number} desired                   Desired value
         * @param  {Number} [nozzel=util.NOZZEL_SIZE] Nozel size, defaults to `util.NOZZEL_SIZE`
         * @param  {Number} [nozzie=0]                Number of nozzel sizes to add to the value
         * @return {Number}                           Multiple of nozzel size
         */
        over: function(desired, nozzel = util.NOZZEL_SIZE, nozzie = 0) {
            return (Math.ceil(desired / nozzel) + nozzie) * nozzel;
        }
    },
    /**
     * A function that reutrns the first argument.  Useful when
     * passing in a callback to modify something, and you want a
     * default functiont hat does nothing.
     * @param  {object} solid an object that will be returned
     * @return {object}       the first parameter passed into the function.
     */
    identity: function(solid) {
        return solid;
    },

    /**
     * If `f` is a funciton, it is executed with `object` as the parameter.  This is used in
     * `CSG.unionIf` and `CSG.subtractIf`, allowing you to pass a function instead of an object.  Since the
     * function isn't exeuted until called, the object to `union` or `subtract` can be assembled only if
     * the conditional is true.
     * @param  {object} object the context to run the function with.
     * @param  {function|object} f      if a funciton it is executed, othewise the object is returned.
     * @return {object}        the result of the function or the object.
     */
    result: function(object, f) {
        if (typeof f === 'function') {
            return f.call(object);
        } else {
            return f;
        }
    },

    /**
     * Returns target object with default values assigned. If values already exist, they are not set.
     * @param  {object} target   The target object to return.
     * @param  {object} defaults Defalut values to add to the object if they don't already exist.
     * @return {object}          Target object with default values assigned.
     */
    defaults: function(target, defaults) {
        return Object.assign(defaults, target);
    },

    isEmpty: function(variable) {
        return typeof variable === 'undefined' || variable === null;
    },

    isNegative: function(n) {
        return ((n = +n) || 1 / n) < 0;
    },

    /**
     * Print a message and CSG object bounds and size to the conosle.
     * @param  {String} msg Message to print
     * @param  {CSG} o   A CSG object to print the bounds and size of.
     */
    print: function(msg, o) {
        echo(
            msg,
            JSON.stringify(o.getBounds()),
            JSON.stringify(this.size(o.getBounds()))
        );
    },

    error: function(msg) {
        if (console && console.error) console.error(msg); // eslint-disable-line no-console
        throw new Error(msg);
    },

    depreciated: function(method, error, message) {
        var msg = method + ' is depreciated.' + (' ' + message || '');
        if (console && console.error) console[error ? 'error' : 'warn'](msg); // eslint-disable-line no-console
        if (error) throw new Error(msg);
    },

    /**
     * Convert an imperial `inch` to metric `mm`.
     * @param  {Number} x Value in inches
     * @return {Number}   Result in mm
     */
    inch: function inch(x) {
        return x * 25.4;
    },

    /**
     * Convert metric `cm` to imperial `inch`.
     * @param  {Number} x Value in cm
     * @return {Number}   Result in inches
     */
    cm: function cm(x) {
        return x / 25.4;
    },

    label: function label(text, x, y, width, height) {
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
        return this.center(union(o));
    },

    text: function text(text) {
        var l = vector_char(0, 0, text); // l contains a list of polylines to draw
        var char = l.segments.reduce(function(result, segment) {
            var path = new CSG.Path2D(segment);
            var cag = path.expandToCAG(2);
            // console.log('reduce', result, segment, path, cag);
            return result ? result.union(cag) : cag;
        }, undefined);
        return char;
    },

    unitCube: function(length, radius) {
        radius = radius || 0.5;
        return CSG.cube({
            center: [0, 0, 0],
            radius: [radius, radius, length || 0.5]
        });
    },

    unitAxis: function(length, radius, centroid) {
        // echo(length, JSON.stringify(centroid));
        centroid = centroid || [0, 0, 0];
        return util
            .unitCube(length, radius)
            .setColor(1, 0, 0)
            .union([
                util
                    .unitCube(length, radius)
                    .rotateY(90)
                    .setColor(0, 1, 0),
                util
                    .unitCube(length, radius)
                    .rotateX(90)
                    .setColor(0, 0, 1)
            ])
            .translate(centroid);
    },

    triangle: {
        toRadians: function toRadians(deg) {
            return deg / 180 * Math.PI;
        },

        toDegrees: function toDegrees(rad) {
            return rad * (180 / Math.PI);
        },

        solve: function(p1, p2) {
            var r = {
                c: 90,
                A: Math.abs(p2.x - p1.x),
                B: Math.abs(p2.y - p1.y)
            };
            var brad = Math.atan2(r.B, r.A);
            r.b = util.triangle.toDegrees(brad);
            // r.C = Math.sqrt(Math.pow(r.B, 2) + Math.pow(r.A, 2));
            r.C = r.B / Math.sin(brad);
            r.a = 90 - r.b;

            return r;
        },

        solve90SA: function(r) {
            r = Object.assign(r, {
                C: 90
            });

            r.A = r.A || 90 - r.B;
            r.B = r.B || 90 - r.A;

            var arad = util.triangle.toRadians(r.A);

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
        },

        centroid(points) {
            var x = points.reduce((sum, point) => sum + point[0], 0) / 3;
            var y = points.reduce((sum, point) => sum + point[1], 0) / 3;
            return [x, y];
        }
    },

    toArray: function(a) {
        return Array.isArray(a) ? a : [a];
    },

    ifArray: function(a, cb) {
        return Array.isArray(a) ? a.map(cb) : cb(a);
    },

    array: {
        div: function(a, f) {
            return a.map(function(e) {
                return e / f;
            });
        },

        addValue: function(a, f) {
            return a.map(function(e) {
                return e + f;
            });
        },

        addArray: function(a, f) {
            return a.map(function(e, i) {
                return e + f[i];
            });
        },

        add: function(a) {
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
        },

        fromxyz: function(object) {
            return Array.isArray(object)
                ? object
                : [object.x, object.y, object.z];
        },

        toxyz: function(a) {
            return {
                x: a[0],
                y: a[1],
                z: a[2]
            };
        },

        first: function(a) {
            return a ? a[0] : undefined;
        },

        last: function(a) {
            return a && a.length > 0 ? a[a.length - 1] : undefined;
        },

        min: function(a) {
            return a.reduce(function(result, value) {
                return value < result ? value : result;
            }, Number.MAX_VALUE);
        },

        range: function(a, b) {
            var result = [];
            for (var i = a; i < b; i++) {
                result.push(i);
            }

            return result;
        }
    },

    /**
     * Returns an array of positions along an object on a given axis.
     * @param  {CSG} object   The object to calculate the segments on.
     * @param  {number} segments The number of segments to create.
     * @param  {string} axis     Axis to create the sgements on.
     * @return {Array}          An array of segment positions.
     */
    segment: function(object, segments, axis) {
        var size = object.size()[axis];
        var width = size / segments;
        var result = [];
        for (var i = width; i < size; i += width) {
            result.push(i);
        }
        return result;
    },

    zipObject: function(names, values) {
        return names.reduce(function(result, value, idx) {
            result[value] = values[idx];
            return result;
        }, {});
    },

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
    map: function(o, f) {
        return Object.keys(o).map(function(key) {
            return f(o[key], key, o);
        });
    },

    mapValues: function(o, f) {
        return Object.keys(o).map(function(key) {
            return f(o[key], key);
        });
    },

    pick: function(o, names) {
        return names.reduce(function(result, name) {
            result[name] = o[name];
            return result;
        }, {});
    },

    mapPick: function(o, names, f, options) {
        return names.reduce(function(result, name) {
            if (!o[name]) {
                throw new Error(
                    `${name} not found in ${options.name}: ${Object.keys(
                        o
                    ).join(',')}`
                );
            }
            result.push(f ? f(o[name]) : o[name]);
            return result;
        }, []);
    },

    divA: function divA(a, f) {
        return this.array.div(a, f);
    },

    divxyz: function(size, x, y, z) {
        return {
            x: size.x / x,
            y: size.y / y,
            z: size.z / z
        };
    },

    div: function(size, d) {
        return this.divxyz(size, d, d, d);
    },

    mulxyz: function(size, x, y, z) {
        return {
            x: size.x * x,
            y: size.y * y,
            z: size.z * z
        };
    },

    mul: function(size, d) {
        return this.divxyz(size, d, d, d);
    },

    xyz2array: function xyz2array(size) {
        return [size.x, size.y, size.z];
    },

    rotationAxes: {
        x: [1, 0, 0],
        y: [0, 1, 0],
        z: [0, 0, 1]
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

        return 1 + 100 / (size / value) / 100;
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
     * @param  {CSG} object     [description]
     * @param  {number} x          [description]
     * @param  {number} y          [description]
     * @param  {number} z          [description]
     * @param  {Object} [options={ centroid:     true }] [description]
     * @return {CSG}            [description]
     */
    enlarge: function enlarge(object, x, y, z, options = { centroid: true }) {
        var a;
        if (Array.isArray(x)) {
            a = x;
        } else {
            a = [x, y, z];
        }

        var size = util.size(object);
        var centroid =
            (object.properties && object.properties.centroid) ||
            util.centroid(object, size);

        var idx = 0;

        var t = util.map(size, function(i) {
            return util.scale(i, a[idx++]);
        });

        var new_object = object
            .translate(centroid.times(-1))
            .scale(t)
            .translate(centroid);

        if (options.centroid) return new_object;
        var new_centroid =
            (new_object.properties && new_object.properties.centroid) ||
            object.properties.centroid ||
            util.centroid(new_object);
        /// Calculate the difference between the original centroid and the new
        var delta = new_centroid.minus(centroid).times(-1);
        // console.log('enlarge', centroid, new_centroid, delta);
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
        
        var axesValues = ['x', 'y', 'z'];
        var sizeAxes = [size.x, size.y, size.z];
        var axes = sizeAxes.reduce(function(result, a, idx) {
          if (a) result.push(axesValues[idx]);
          return result;
        }, []).join('');
        
        function scale(size, value) {
            if (value == 0) return 1;
            return value / size;
        }

        var s = this.axisApply(axes, function(axis){
          return scale(sizeAxes[axis], a[axis]);
        }, sizeAxes).filter(x => x);
        
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
        return x.union([
            x.mirroredY(90),
            x.mirroredX(90),
            x.mirroredY(90).mirroredX(90)
        ]);
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

        return this.axisApply(axes, function(i, axis) {
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
    },

    snap: function snap(moveobj, withobj, axis, orientation, delta) {
        return moveobj.translate(
            util.calcSnap(moveobj, withobj, axis, orientation, delta)
        );
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
        return moveobj.translate(
            util.calcFlush(moveobj, withobj, axis, mside, wside)
        );
    },

    axisApply: function(axes, valfun, a) {
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
    },

    axis2array: function(axes, valfun) {
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
    },

    centroid: function(o, size) {
        var bounds = o.getBounds();
        size = size || util.size(bounds);

        return bounds[0].plus(size.dividedBy(2));
    },

    calcmidlineTo: function midlineTo(o, axis, to) {
        var bounds = o.getBounds();
        var size = util.size(bounds);

        // var centroid = bounds[0].plus(size.dividedBy(2));

        // console.log('bounds', JSON.stringify(bounds), 'size', size, 'centroid', centroid);
        return util.axisApply(axis, function(i, a) {
            return to - size[a] / 2;
        });
    },

    midlineTo: function midlineTo(o, axis, to) {
        return o.translate(util.calcmidlineTo(o, axis, to));
    },

    translator: function translator(o, axis, withObj) {
        var centroid = util.centroid(o);
        var withCentroid = util.centroid(withObj);
        // echo('centerWith', centroid, withCentroid);
        var t = util.axisApply(axis, function(i) {
            return withCentroid[i] - centroid[i];
        });

        return t;
    },

    calcCenterWith: function calcCenterWith(o, axes, withObj, delta) {
        var centroid = util.centroid(o);
        var withCentroid = util.centroid(withObj);

        var t = util.axisApply(axes, function(i, axis) {
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
    group: function group(...args) {
        var self = { name: '', names: [], parts: {} };
        if (args && args.length > 0) {
            if (args.length === 2) {
                var [names, objects] = args;

                self.names =
                    (names && names.length > 0 && names.split(',')) || [];

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
                group.add(
                    map(CSG.fromPolygons(part.toPolygons())),
                    key,
                    hidden
                );
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
                    `no pieces found in ${
                        self.name
                    } pieces: ${pieces} parts: ${Object.keys(
                        self.parts
                    )} names: ${self.names}`
                );
            }
            var g = union(
                util.mapPick(
                    self.parts,
                    pieces,
                    function(value, key, object) {
                        return map
                            ? map(value, key, object)
                            : util.identity(value);
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
            return self.combine(
                Object.keys(self.parts).join(','),
                options,
                map
            );
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
            var t = util.calcSnap(
                self.combine(part),
                to,
                axis,
                orientation,
                delta
            );
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
            var p =
                (parts && parts.length > 0 && parts.split(',')) || self.names;
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
            var p =
                (parts && parts.length > 0 && parts.split(',')) || self.names;
            if (!map) map = util.identity;

            var a = [];
            p.forEach(function(name) {
                a.push(
                    map(CSG.fromPolygons(self.parts[name].toPolygons()), name)
                );
            });
            return a;
        };

        return self;
    },

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
    getDelta: function getDelta(size, bounds, axis, offset, nonzero) {
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
    },

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
    bisect: function bisect(
        object,
        axis,
        offset,
        angle,
        rotateaxis,
        rotateoffset,
        options
    ) {
        options = util.defaults(options, {
            addRotationCenter: false,
            negativeColor: 'red',
            positiveColor: 'blue',
            colors: false
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
            new CSG.Vector3D(
                util.axisApply('xyz', function(i, a) {
                    if (a == axis) return cutDelta[i];
                    if (a == rotateOffsetAxis) return rotateDelta[i];
                    return centroid[a];
                })
            );
        var rotationAxis = util.rotationAxes[rotateaxis];

        var cutplane = CSG.OrthoNormalBasis.GetCartesian(
            info.orthoNormalCartesian[0],
            info.orthoNormalCartesian[1]
        )
            .translate(cutDelta)
            .rotate(rotationCenter, rotationAxis, angle);

        var g = util.group('negative,positive', [
            object.cutByPlane(cutplane.plane),
            object.cutByPlane(cutplane.plane.flipped())
        ]);

        if (options.addRotationCenter)
            g.add(
                util.unitAxis(size.length() + 10, 0.5, rotationCenter),
                'rotationCenter'
            );

        return g;
    },

    /**
     * Wraps the `stretchAtPlane` call using the same
     * logic as `bisect`.
     * @param  {CSG} object   Object to stretch
     * @param  {String} axis     Axis to stretch along
     * @param  {Number} distance Distance to stretch
     * @param  {Number} offset   Offset along the axis to cut the object
     * @return {CSG}          The stretched object.
     */
    stretch: function stretch(object, axis, distance, offset) {
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
    },

    /**
     * Takes two CSG polygons and createds a solid of `height`.
     * Similar to `CSG.extrude`, excdept you can resize either
     * polygon.
     * @param  {CAG} top    Top polygon
     * @param  {CAG} bottom Bottom polygon
     * @param  {number} height heigth of solid
     * @return {CSG}        generated solid
     */
    poly2solid: function poly2solid(top, bottom, height) {
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
    },

    slices2poly: function slices2poly(slices, options, axis) {
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
            (options && parseInt(options.twiststeps)) ||
            CSG.defaultResolution3D;

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

        return CSG.fromPolygons(polygons);
    },

    normalVector: function normalVector(axis) {
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
        if (!axisInfo[axis])
            util.error('util.normalVector: invalid axis ' + axis);
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

        return Object.assign(
            {
                axis: axis,
                cutDelta: util.axisApply(axis, function(i, a) {
                    return (
                        bounds[info.sizeIdx][a] +
                        Math.abs(radius) * info.sizeDir
                    );
                }),
                moveDelta: util.axisApply(axis, function(i, a) {
                    return (
                        bounds[info.sizeIdx][a] +
                        Math.abs(radius) * info.moveDir
                    );
                })
            },
            info,
            util.normalVector(axis)
        );
    },

    // solidFromSlices: function (slices, heights) {
    //     var si = {
    //         axis: 'z',
    //         cutDelta: {},
    //         moveDelta: {},
    //         orthoNormalCartesian: ['X', 'Y'],
    //         normalVector: CSG.Vector3D.Create(0, 1, 0)
    //     };
    // },

    reShape: function reShape(object, radius, orientation, options, slicer) {
        options = options || {};
        var b = object.getBounds();
        // var s = util.size(b);
        var ar = Math.abs(radius);
        var si = util.sliceParams(orientation, radius, b);

        if (si.axis !== 'z')
            throw new Error(
                'util.reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.'
            );

        var cutplane = CSG.OrthoNormalBasis.GetCartesian(
            si.orthoNormalCartesian[0],
            si.orthoNormalCartesian[1]
        ).translate(si.cutDelta);

        var slice = object.sectionCut(cutplane);
        if (object.properties.centroid)
            slice.properties = {
                centroid: new CSG.Vector2D([
                    object.properties.centroid.x,
                    object.properties.centroid.y
                ])
            };

        var first = util.axisApply(si.axis, function() {
            return si.positive ? 0 : ar;
        });

        var last = util.axisApply(si.axis, function() {
            return si.positive ? ar : 0;
        });

        var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();

        var slices = slicer(first, last, slice);

        var delta = util.slices2poly(
            slices,
            Object.assign(options, {
                si: si
            }),
            si.axis
        );

        var remainder = object.cutByPlane(plane);
        return union([
            options.unionOriginal ? object : remainder,
            delta.translate(si.moveDelta)
        ]);
    },

    chamfer: function chamfer(object, radius, orientation, options) {
        return util.reShape(object, radius, orientation, options, function(
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
                    poly: util.enlarge(
                        slice,
                        [-radius * 2, -radius * 2],
                        undefined,
                        undefined,
                        options
                    ),
                    offset: new CSG.Vector3D(last)
                }
            ];
        });
    },

    fillet: function fillet(object, radius, orientation, options) {
        options = options || {};
        return util.reShape(object, radius, orientation, options, function(
            first,
            last,
            slice
        ) {
            var v1 = new CSG.Vector3D(first);
            var v2 = new CSG.Vector3D(last);

            var res = options.resolution || CSG.defaultResolution3D;

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
    },

    calcRotate: function(part, solid, axis, angle) {
        var axes = {
            x: [1, 0, 0],
            y: [0, 1, 0],
            z: [0, 0, 1]
        };
        var rotationCenter = solid.centroid();
        var rotationAxis = axes[axis];
        return { rotationCenter, rotationAxis };
    },

    rotateAround: function(part, solid, axis, angle) {
        var { rotationCenter, rotationAxis } = util.calcRotate(
            part,
            solid,
            axis,
            angle
        );

        return part.rotate(rotationCenter, rotationAxis, angle);
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
         * Click [here](http://openjscad.org/#https://raw.githubusercontent.com/johnwebbcole/jscad-utils/master/dist/snap.jscad) for an example in openjscad.
         *
         * ![snap example](jsdoc2md/snap.gif)
         * @example
         * include('dist/utils.jscad');
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

        CSG.prototype.calcSnap = function calcSnap(
            to,
            axis,
            orientation,
            delta
        ) {
            return util.calcSnap(this, to, axis, orientation, delta);
        };

        /**
         * Moves an objects midpoint on an axis a certain distance.  This is very useful when creating parts
         * from mechanical drawings.
         * For example, the [RaspberryPi Hat Board Specification](https://github.com/raspberrypi/hats/blob/master/hat-board-mechanical.pdf) has several pieces with the midpoint measured.
         * ![pi hat drawing](jsdoc2md/rpi-hat.png)
         * To avoid converting the midpoint to the relative position, you can use `midpointTo`.
         *
         * Click [here](http://openjscad.org/#https://raw.githubusercontent.com/johnwebbcole/jscad-utils/master/dist/midlineTo.jscad) for an example in openjscad.
         *
         * ![midlineTo example](jsdoc2md/midlineto.gif)
         * @example
         * include('dist/utils.jscad');
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

        CSG.prototype.calcmidlineTo = function midlineTo(axis, to) {
            return util.calcmidlineTo(this, axis, to);
        };

        CSG.prototype.centerWith = function centerWith(axis, to) {
            util.depreciated('centerWith', true, 'Use align instead.');
            return util.centerWith(this, axis, to);
        };

        if (CSG.center) echo('CSG already has .center');
        CSG.prototype.center = function center(axis) {
            // console.log('center', axis, this.getBounds());
            return util.centerWith(this, axis || 'xyz', util.unitCube(), 0);
        };

        CSG.prototype.calcCenter = function centerWith(axis) {
            return util.calcCenterWith(this, axis || 'xyz', util.unitCube(), 0);
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

        CAG.prototype.enlarge = function cag_enlarge(x, y) {
            return util.enlarge(this, x, y);
        };

        /**
         * Fit an object inside a bounding box. Often
         * used to fit text on the face of an object.
         *  A zero for a size value will leave that axis untouched.
         *
         * Click [here](http://openjscad.org/#https://raw.githubusercontent.com/johnwebbcole/jscad-utils/master/dist/fit.jscad) for an example in openjscad.
         *
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
         * include('dist/utils.jscad');
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
        CSG.prototype.size = function() {
            return util.size(this.getBounds());
        };

        /**
         * Returns the centroid of the current objects bounding box.
         * @alias centroid
         * @memberof module:CSG
         * @augments CSG
         * @return  {CSG.Vector3D} A `CSG.Vector3D` with the center of the object bounds.
         */
        CSG.prototype.centroid = function() {
            return util.centroid(this);
        };

        /**
         * Places an object at zero on the `z` axis.
         */
        CSG.prototype.Zero = function zero() {
            return util.zero(this);
        };

        CSG.prototype.Center = function Center(axes) {
            return this.align(util.unitCube(), axes || 'xy');
        };

        CSG.Vector2D.prototype.map = function Vector2D_map(cb) {
            return new CSG.Vector2D(cb(this.x), cb(this.y));
        };

        /**
         * Add a fillet or roundover to an object.
         *
         * Click [here](http://openjscad.org/#https://raw.githubusercontent.com/johnwebbcole/jscad-utils/master/dist/fillet.jscad) for an example in openjscad.
         *
         * ![fillet example](jsdoc2md/fillet.png)
         *
         * @example
         * include('dist/utils.jscad');
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
         *
         * Click [here](http://openjscad.org/#https://raw.githubusercontent.com/johnwebbcole/jscad-utils/master/dist/chamfer.jscad) for an example in openjscad.
         *
         * ![chamfer example](jsdoc2md/chamfer.png)
         * @example
         * include('dist/utils.jscad');
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
         *
         * Click [here](http://openjscad.org/#https://raw.githubusercontent.com/johnwebbcole/jscad-utils/master/dist/bisect.jscad) for an example in openjscad.
         *
         * ![bisect example](jsdoc2md/bisect.png)
         * @param  {string} axis   Axis to cut the object
         * @param  {number} offset Offset to cut the object.  Defaults to the middle of the object
         * @param  {number} angle angle to rotate the cut plane to
         * @param  {number} rotateaxis axis to rotate the cut plane around.
         * @param  {number} rotateoffset offset in the rotateaxis for the rotation point of the cut plane.
         * @return {object}        A group group object with a parts dictionary and a `combine()` method.
         * @alias bisect
         * @memberof module:CSG
         * @augments CSG
         */
        CSG.prototype.bisect = function bisect(
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

        /**
         * Wraps the `stretchAtPlane` call using the same
         * logic as `bisect`. This cuts the object at the plane,
         * and stretches the cross-section there by distance
         * amount.  The plane is located at the center of the
         * axis unless an `offset` is given, then it is the
         * offset from either end of the axis.
         * @param  {CSG} object   Object to stretch
         * @param  {String} axis     Axis to streatch along
         * @param  {Number} distance Distance to stretch
         * @param  {Number} offset   Offset along the axis to cut the object
         * @return {CSG}          The stretched object.
         * @alias stretch
         * @memberof module:CSG
         * @augments CSG
         */
        CSG.prototype.stretch = function stretch(axis, distance, offset) {
            return util.stretch(this, axis, distance, offset);
        };

        /**
         * Union only if the condition is true, otherwise the original object is returned.  You can pass in a function that returns a `CSG` object that only gets evaluated if the condition is true.
         * @param  {CSG|function} object    A CSG object to union with, or a function that reutrns a CSG object.
         * @param  {boolean} condition boolean value to determin if the object should perform the union.
         * @return {CSG}           The resulting object.
         * @alias unionIf
         * @memberof module:CSG
         * @augments CSG
         */
        CSG.prototype.unionIf = function unionIf(object, condition) {
            return condition ? this.union(util.result(this, object)) : this;
        };

        /**
         * Subtract only if the condition is true, otherwise the original object is returned.  You can pass in a function that returns a `CSG` object that only gets evaluated if the condition is true.
         * @param  {CSG|function} object     A CSG object to union with, or a function that reutrns a CSG object.
         * @param  {boolean} condition boolean value to determin if the object should perform the subtraction.
         * @return {CSG}           The resulting object.
         * @alias subtractIf
         * @memberof module:CSG
         * @augments CSG
         */
        CSG.prototype.subtractIf = function subtractIf(object, condition) {
            return condition ? this.subtract(util.result(this, object)) : this;
        };

        CSG.prototype._translate = CSG.prototype.translate;
        
        CSG.prototype.resultIf = function resultIf(condition, fn, ...args) {
          return condition ? fn(this, ...args) : this;
        };
        
        CSG.prototype.clone = function clone() {
          return CSG.fromPolygons(this).toPolygons();
        };

        /**
         * This modifies the normal `CSG.translate` method to accept
         * multiple translations, addign the translations together.
         * The original translate is available on `CSG._translate` and
         * a short circut is applied when only one parameter is given.
         * @return {CSG} The resulting object.
         */
        CSG.prototype.translate = function translate() {
            if (arguments.length === 1) {
                return this._translate(arguments[0]);
            } else {
                var t = Array.prototype.slice.call(arguments, 0).reduce(
                    function(result, arg) {
                        // console.log('arg', arg);
                        result = util.array.addArray(result, arg);
                        return result;
                    },
                    [0, 0, 0]
                );

                // console.log('translate', t);
                return this._translate(t);
            }
        };
    }
};
