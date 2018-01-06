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
export function group(...args) {
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
