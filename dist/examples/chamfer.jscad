function main() {
    util.init(CSG);

    var cube = CSG.cube({
        radius: 10
    });

    return cube.chamfer(2, 'z+').color('orange');
}

// include:js
// ../dist/compat.js
var Parts, Boxes, Group, Debug;

function initJscadutils(_CSG, options = {}) {
    options = Object.assign({
        debug: ""
    }, options);
    var jsCadCSG = {
        CSG,
        CAG
    };
    var scadApi = {
        vector_text,
        rectangular_extrude,
        vector_char,
        primitives3d: {
            cube,
            sphere,
            cylinder
        }
    };
    var jscadUtilsDebug = (options.debug.split(",") || []).reduce((checks, check) => {
        if (check.startsWith("-")) {
            checks.disabled.push(new RegExp(`^${check.slice(1).replace(/\*/g, ".*?")}$`));
        } else {
            checks.enabled.push(new RegExp(`^${check.replace(/\*/g, ".*?")}$`));
        }
        return checks;
    }, {
        enabled: [],
        disabled: []
    });
    var jscadUtils = function(exports, jsCadCSG, scadApi) {
        "use strict";
        jsCadCSG = jsCadCSG && jsCadCSG.hasOwnProperty("default") ? jsCadCSG["default"] : jsCadCSG;
        scadApi = scadApi && scadApi.hasOwnProperty("default") ? scadApi["default"] : scadApi;
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                    value,
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
                if (enumerableOnly) symbols = symbols.filter(function(sym) {
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
                    ownKeys(source, true).forEach(function(key) {
                        _defineProperty(target, key, source[key]);
                    });
                } else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                } else {
                    ownKeys(source).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                    });
                }
            }
            return target;
        }
        var toRadians = function toRadians(deg) {
            return deg / 180 * Math.PI;
        };
        var toDegrees = function toDegrees(rad) {
            return rad * (180 / Math.PI);
        };
        var solve = function solve(p1, p2) {
            var r = {
                c: 90,
                A: Math.abs(p2.x - p1.x),
                B: Math.abs(p2.y - p1.y)
            };
            var brad = Math.atan2(r.B, r.A);
            r.b = this.toDegrees(brad);
            r.C = r.B / Math.sin(brad);
            r.a = 90 - r.b;
            return r;
        };
        var solve90SA = function solve90SA(r) {
            r = Object.assign(r, {
                C: 90
            });
            r.A = r.A || 90 - r.B;
            r.B = r.B || 90 - r.A;
            var arad = toRadians(r.A);
            r.a = r.a || (r.c ? r.c * Math.sin(arad) : r.b * Math.tan(arad));
            r.c = r.c || r.a / Math.sin(arad);
            r.b = r.b || r.a / Math.tan(arad);
            return r;
        };
        var solve90ac = function solve90ac(r) {
            r = Object.assign(r, {
                C: 90
            });
            var arad = Math.asin(r.a / r.c);
            r.A = toDegrees(arad);
            r.B = 90 - r.A;
            r.b = Math.sqrt(Math.pow(r.c, 2) - Math.pow(r.a, 2));
            return r;
        };
        var triangle = Object.freeze({
            toRadians,
            toDegrees,
            solve,
            solve90SA,
            solve90ac
        });
        var div = function div(a, f) {
            return a.map(function(e) {
                return e / f;
            });
        };
        var addValue = function addValue(a, f) {
            return a.map(function(e) {
                return e + f;
            });
        };
        var addArray = function addArray(a, f) {
            return a.map(function(e, i) {
                return e + f[i];
            });
        };
        var add = function add(a) {
            return Array.prototype.slice.call(arguments, 1).reduce(function(result, arg) {
                if (Array.isArray(arg)) {
                    result = addArray(result, arg);
                } else {
                    result = addValue(result, arg);
                }
                return result;
            }, a);
        };
        var fromxyz = function fromxyz(object) {
            return Array.isArray(object) ? object : [ object.x, object.y, object.z ];
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
            return a.reduce(function(result, value) {
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
        var array = Object.freeze({
            div,
            addValue,
            addArray,
            add,
            fromxyz,
            toxyz,
            first,
            last,
            min,
            range
        });
        var debugColors = [ "#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999" ];
        var debugCount = 0;
        var Debug = function Debug(name) {
            var style = "color:".concat(debugColors[debugCount++ % debugColors.length]);
            var checks = jscadUtilsDebug || {
                enabled: [],
                disabled: []
            };
            var enabled = checks.enabled.some(function checkEnabled(check) {
                return check.test(name);
            }) && !checks.disabled.some(function checkEnabled(check) {
                return check.test(name);
            });
            return enabled ? function() {
                var _console;
                for (var _len = arguments.length, msg = new Array(_len), _key = 0; _key < _len; _key++) {
                    msg[_key] = arguments[_key];
                }
                (_console = console).log.apply(_console, [ "%c%s", style, name ].concat(msg));
            } : function() {
                return undefined;
            };
        };
        var debug = Debug("jscadUtils:group");
        function group() {
            var names = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var parts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.name = "";
            this.names = names;
            this.parts = parts;
        }
        group.prototype.add = function(object, name, hidden, subparts, parts) {
            var self = this;
            if (object.parts) {
                if (name) {
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
        group.prototype.combine = function(pieces, options, map) {
            var self = this;
            options = Object.assign({
                noholes: false
            }, options);
            pieces = pieces ? pieces.split(",") : self.names;
            if (pieces.length === 0) {
                throw new Error("no pieces found in ".concat(self.name, " pieces: ").concat(pieces, " parts: ").concat(Object.keys(self.parts), " names: ").concat(self.names));
            }
            var g = union(mapPick(self.parts, pieces, function(value, key, object) {
                return map ? map(value, key, object) : identity(value);
            }, self.name));
            return g.subtractIf(self.holes && Array.isArray(self.holes) ? union(self.holes) : self.holes, self.holes && !options.noholes);
        };
        group.prototype.map = function(cb) {
            var self = this;
            self.parts = Object.keys(self.parts).filter(function(k) {
                return k !== "holes";
            }).reduce(function(result, key) {
                result[key] = cb(self.parts[key], key);
                return result;
            }, {});
            if (self.holes) {
                if (Array.isArray(self.holes)) {
                    self.holes = self.holes.map(function(hole, idx) {
                        return cb(hole, idx);
                    });
                } else {
                    self.holes = cb(self.holes, "holes");
                }
            }
            return self;
        };
        group.prototype.clone = function(map) {
            var self = this;
            if (!map) map = identity;
            var group = Group();
            Object.keys(self.parts).forEach(function(key) {
                var part = self.parts[key];
                var hidden = self.names.indexOf(key) == -1;
                group.add(map(CSG.fromPolygons(part.toPolygons())), key, hidden);
            });
            if (self.holes) {
                group.holes = toArray(self.holes).map(function(part) {
                    return map(CSG.fromPolygons(part.toPolygons()), "holes");
                });
            }
            return group;
        };
        group.prototype.rotate = function(solid, axis, angle) {
            var self = this;
            var axes = {
                x: [ 1, 0, 0 ],
                y: [ 0, 1, 0 ],
                z: [ 0, 0, 1 ]
            };
            if (typeof solid === "string") {
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
        group.prototype.combineAll = function(options, map) {
            var self = this;
            return self.combine(Object.keys(self.parts).join(","), options, map);
        };
        group.prototype.snap = function snap(part, to, axis, orientation, delta) {
            var self = this;
            var t = calcSnap(self.combine(part), to, axis, orientation, delta);
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.align = function align(part, to, axis, delta) {
            var self = this;
            var t = calcCenterWith(self.combine(part, {
                noholes: true
            }), axis, to, delta);
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.midlineTo = function midlineTo(part, axis, to) {
            var self = this;
            var size = self.combine(part).size();
            var t = axisApply(axis, function(i, a) {
                return to - size[a] / 2;
            });
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.translate = function translate(x, y, z) {
            var self = this;
            var t = Array.isArray(x) ? x : [ x, y, z ];
            debug("translate", t);
            self.map(function(part) {
                return part.translate(t);
            });
            return self;
        };
        group.prototype.pick = function(parts, map) {
            var self = this;
            var p = parts && parts.length > 0 && parts.split(",") || self.names;
            if (!map) map = identity;
            var g = Group();
            p.forEach(function(name) {
                g.add(map(CSG.fromPolygons(self.parts[name].toPolygons()), name), name);
            });
            return g;
        };
        group.prototype.array = function(parts, map) {
            var self = this;
            var p = parts && parts.length > 0 && parts.split(",") || self.names;
            if (!map) map = identity;
            var a = [];
            p.forEach(function(name) {
                a.push(map(CSG.fromPolygons(self.parts[name].toPolygons()), name));
            });
            return a;
        };
        group.prototype.toArray = function(pieces) {
            var self = this;
            pieces = pieces ? pieces.split(",") : self.names;
            return pieces.map(function(piece) {
                if (!self.parts[piece]) console.error("Cannot find ".concat(piece, " in ").concat(self.names));
                return self.parts[piece];
            });
        };
        var Group = function Group() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }
            debug.apply(void 0, [ "Group" ].concat(args));
            var self = {
                name: "",
                names: [],
                parts: {}
            };
            if (args && args.length > 0) {
                if (args.length === 2) {
                    var names = args[0], objects = args[1];
                    self.names = names && names.length > 0 && names.split(",") || [];
                    if (Array.isArray(objects)) {
                        self.parts = zipObject(self.names, objects);
                    } else if (objects instanceof CSG) {
                        self.parts = zipObject(self.names, [ objects ]);
                    } else {
                        self.parts = objects || {};
                    }
                } else {
                    var objects = args[0];
                    self.names = Object.keys(objects).filter(function(k) {
                        return k !== "holes";
                    });
                    self.parts = Object.assign({}, objects);
                    self.holes = objects.holes;
                }
            }
            return new group(self.names, self.parts);
        };
        var debug$1 = Debug("jscadUtils:util");
        var CSG$1 = jsCadCSG.CSG;
        var vector_text = scadApi.vector_text, rectangular_extrude = scadApi.rectangular_extrude, vector_char = scadApi.vector_char;
        var NOZZEL_SIZE = .4;
        var nearest = {
            under: function under(desired) {
                var nozzel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOZZEL_SIZE;
                var nozzie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                return (Math.floor(desired / nozzel) + nozzie) * nozzel;
            },
            over: function over(desired) {
                var nozzel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOZZEL_SIZE;
                var nozzie = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                return (Math.ceil(desired / nozzel) + nozzie) * nozzel;
            }
        };
        var identity = function identity(solid) {
            return solid;
        };
        var result = function result(object, f) {
            if (typeof f === "function") {
                return f.call(object);
            } else {
                return f;
            }
        };
        var defaults = function defaults(target, _defaults) {
            depreciated("defaults", true, "use Object.assign instead");
            return Object.assign(_defaults, target);
        };
        var isEmpty = function isEmpty(variable) {
            return typeof variable === "undefined" || variable === null;
        };
        var isNegative = function isNegative(n) {
            return ((n = +n) || 1 / n) < 0;
        };
        var print = function print(msg, o) {
            echo(msg, JSON.stringify(o.getBounds()), JSON.stringify(this.size(o.getBounds())));
        };
        var error = function error(msg) {
            if (console && console.error) console.error(msg);
            throw new Error(msg);
        };
        var depreciated = function depreciated(method, error, message) {
            var msg = method + " is depreciated." + (" " + message || "");
            if (!error && console && console.error) console[error ? "error" : "warn"](msg);
            if (error) throw new Error(msg);
        };
        function inch(x) {
            return x * 25.4;
        }
        function cm(x) {
            return x / 25.4;
        }
        function label(text, x, y, width, height) {
            var l = vector_text(x || 0, y || 0, text);
            var o = [];
            l.forEach(function(pl) {
                o.push(rectangular_extrude(pl, {
                    w: width || 2,
                    h: height || 2
                }));
            });
            return this.center(union(o));
        }
        function text(text) {
            var l = vector_char(0, 0, text);
            var _char = l.segments.reduce(function(result, segment) {
                var path = new CSG$1.Path2D(segment);
                var cag = path.expandToCAG(2);
                return result ? result.union(cag) : cag;
            }, undefined);
            return _char;
        }
        var unitCube = function unitCube(length, radius) {
            radius = radius || .5;
            return CSG$1.cube({
                center: [ 0, 0, 0 ],
                radius: [ radius, radius, length || .5 ]
            });
        };
        var unitAxis = function unitAxis(length, radius, centroid) {
            centroid = centroid || [ 0, 0, 0 ];
            return unitCube(length, radius).union([ unitCube(length, radius).rotateY(90).setColor(0, 1, 0), unitCube(length, radius).rotateX(90).setColor(0, 0, 1) ]).translate(centroid);
        };
        var toArray = function toArray(a) {
            return Array.isArray(a) ? a : [ a ];
        };
        var ifArray = function ifArray(a, cb) {
            return Array.isArray(a) ? a.map(cb) : cb(a);
        };
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
            return names.reduce(function(result, value, idx) {
                result[value] = values[idx];
                return result;
            }, {});
        };
        var map = function map(o, f) {
            return Object.keys(o).map(function(key) {
                return f(o[key], key, o);
            });
        };
        var mapValues = function mapValues(o, f) {
            return Object.keys(o).map(function(key) {
                return f(o[key], key);
            });
        };
        var pick = function pick(o, names) {
            return names.reduce(function(result, name) {
                result[name] = o[name];
                return result;
            }, {});
        };
        var mapPick = function mapPick(o, names, f, options) {
            return names.reduce(function(result, name) {
                if (!o[name]) {
                    throw new Error("".concat(name, " not found in ").concat(options.name, ": ").concat(Object.keys(o).join(",")));
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
            return [ size.x, size.y, size.z ];
        };
        var rotationAxes = {
            x: [ 1, 0, 0 ],
            y: [ 0, 1, 0 ],
            z: [ 0, 0, 1 ]
        };
        var size = function size(o) {
            var bbox = o.getBounds ? o.getBounds() : o;
            var foo = bbox[1].minus(bbox[0]);
            return foo;
        };
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
            return object.translate([ 0, -size.y / 2, 0 ]);
        };
        var centerX = function centerX(object, size) {
            size = size || this.size(object.getBounds());
            return object.translate([ -size.x / 2, 0, 0 ]);
        };
        var enlarge = function enlarge(object, x, y, z) {
            var a;
            if (Array.isArray(x)) {
                a = x;
            } else {
                a = [ x, y, z ];
            }
            var size = util.size(object);
            var centroid = util.centroid(object, size);
            var idx = 0;
            var t = util.map(size, function(i) {
                return util.scale(i, a[idx++]);
            });
            var new_object = object.scale(t);
            var new_centroid = util.centroid(new_object);
            var delta = new_centroid.minus(centroid).times(-1);
            return new_object.translate(delta);
        };
        var fit = function fit(object, x, y, z, keep_aspect_ratio) {
            var a;
            if (Array.isArray(x)) {
                a = x;
                keep_aspect_ratio = y;
                x = a[0];
                y = a[1];
                z = a[2];
            } else {
                a = [ x, y, z ];
            }
            var size = this.size(object.getBounds());
            function scale(size, value) {
                if (value == 0) return 1;
                return value / size;
            }
            var s = [ scale(size.x, x), scale(size.y, y), scale(size.z, z) ];
            var min = util.array.min(s);
            return util.centerWith(object.scale(s.map(function(d, i) {
                if (a[i] === 0) return 1;
                return keep_aspect_ratio ? min : d;
            })), "xyz", object);
        };
        function shift(object, x, y, z) {
            var hsize = this.div(this.size(object.getBounds()), 2);
            return object.translate(this.xyz2array(this.mulxyz(hsize, x, y, z)));
        }
        function zero(object) {
            var bounds = object.getBounds();
            return object.translate([ 0, 0, -bounds[0].z ]);
        }
        function mirrored4(x) {
            return x.union([ x.mirroredY(90), x.mirroredX(90), x.mirroredY(90).mirroredX(90) ]);
        }
        var flushSide = {
            "above-outside": [ 1, 0 ],
            "above-inside": [ 1, 1 ],
            "below-outside": [ 0, 1 ],
            "below-inside": [ 0, 0 ],
            "outside+": [ 0, 1 ],
            "outside-": [ 1, 0 ],
            "inside+": [ 1, 1 ],
            "inside-": [ 0, 0 ],
            "center+": [ -1, 1 ],
            "center-": [ -1, 0 ]
        };
        function calcFlush(moveobj, withobj, axes, mside, wside) {
            util.depreciated("calcFlush", false, "Use util.calcSnap instead.");
            var side;
            if (mside === 0 || mside === 1) {
                side = [ wside !== undefined ? wside : mside, mside ];
            } else {
                side = util.flushSide[mside];
                if (!side) util.error("invalid side: " + mside);
            }
            var m = moveobj.getBounds();
            var w = withobj.getBounds();
            if (side[0] === -1) {
                w[-1] = util.array.toxyz(withobj.centroid());
            }
            return this.axisApply(axes, function(i, axis) {
                return w[side[0]][axis] - m[side[1]][axis];
            });
        }
        function calcSnap(moveobj, withobj, axes, orientation) {
            var delta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
            var side = flushSide[orientation];
            if (!side) {
                var fix = {
                    "01": "outside+",
                    10: "outside-",
                    11: "inside+",
                    "00": "inside-",
                    "-11": "center+",
                    "-10": "center-"
                };
                util.error("util.calcSnap: invalid side: " + orientation + " should be " + fix["" + orientation + delta]);
            }
            var m = moveobj.getBounds();
            var w = withobj.getBounds();
            if (side[0] === -1) {
                w[-1] = withobj.centroid();
            }
            var t = axisApply(axes, function(i, axis) {
                return w[side[0]][axis] - m[side[1]][axis];
            });
            return delta ? axisApply(axes, function(i) {
                return t[i] + delta;
            }) : t;
        }
        function snap(moveobj, withobj, axis, orientation, delta) {
            debug$1("snap", moveobj, withobj, axis, orientation, delta);
            var t = calcSnap(moveobj, withobj, axis, orientation, delta);
            return moveobj.translate(t);
        }
        function flush(moveobj, withobj, axis, mside, wside) {
            return moveobj.translate(util.calcFlush(moveobj, withobj, axis, mside, wside));
        }
        var axisApply = function axisApply(axes, valfun, a) {
            debug$1("axisApply", axes, valfun, a);
            var retval = a || [ 0, 0, 0 ];
            var lookup = {
                x: 0,
                y: 1,
                z: 2
            };
            axes.split("").forEach(function(axis) {
                retval[lookup[axis]] = valfun(lookup[axis], axis);
            });
            return retval;
        };
        var axis2array = function axis2array(axes, valfun) {
            util.depreciated("axis2array");
            var a = [ 0, 0, 0 ];
            var lookup = {
                x: 0,
                y: 1,
                z: 2
            };
            axes.split("").forEach(function(axis) {
                var i = lookup[axis];
                a[i] = valfun(i, axis);
            });
            return a;
        };
        function centroid(o, objectSize) {
            var bounds = o.getBounds();
            objectSize = objectSize || size(bounds);
            return bounds[0].plus(objectSize.dividedBy(2));
        }
        function calcmidlineTo(o, axis, to) {
            var bounds = o.getBounds();
            var size = util.size(bounds);
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
            var t = util.axisApply(axis, function(i) {
                return withCentroid[i] - centroid[i];
            });
            return t;
        }
        function calcCenterWith(o, axes, withObj, delta) {
            var objectCentroid = centroid(o);
            var withCentroid = centroid(withObj);
            var t = axisApply(axes, function(i, axis) {
                return withCentroid[axis] - objectCentroid[axis];
            });
            return delta ? add(t, delta) : t;
        }
        function centerWith(o, axis, withObj) {
            return o.translate(calcCenterWith(o, axis, withObj));
        }
        function getDelta(size, bounds, axis, offset, nonzero) {
            if (!util.isEmpty(offset) && nonzero) {
                if (Math.abs(offset) < 1e-4) {
                    offset = 1e-4 * (util.isNegative(offset) ? -1 : 1);
                }
            }
            var dist = util.isNegative(offset) ? offset = size[axis] + offset : offset;
            return util.axisApply(axis, function(i, a) {
                return bounds[0][a] + (util.isEmpty(dist) ? size[axis] / 2 : dist);
            });
        }
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
                x: "y",
                y: "x",
                z: "x"
            }[axis];
            var cutDelta = options.cutDelta || util.getDelta(size, bounds, axis, offset);
            var rotateOffsetAxis = {
                xy: "z",
                yz: "x",
                xz: "y"
            }[[ axis, rotateaxis ].sort().join("")];
            var centroid = object.centroid();
            var rotateDelta = util.getDelta(size, bounds, rotateOffsetAxis, rotateoffset);
            var rotationCenter = options.rotationCenter || new CSG$1.Vector3D(util.axisApply("xyz", function(i, a) {
                if (a == axis) return cutDelta[i];
                if (a == rotateOffsetAxis) return rotateDelta[i];
                return centroid[a];
            }));
            var rotationAxis = util.rotationAxes[rotateaxis];
            var cutplane = CSG$1.OrthoNormalBasis.GetCartesian(info.orthoNormalCartesian[0], info.orthoNormalCartesian[1]).translate(cutDelta).rotate(rotationCenter, rotationAxis, angle);
            var g = Group("negative,positive", [ object.cutByPlane(cutplane.plane).color("red"), object.cutByPlane(cutplane.plane.flipped()).color("blue") ]);
            if (options.addRotationCenter) g.add(util.unitAxis(size.length() + 10, .5, rotationCenter), "rotationCenter");
            return g;
        }
        function stretch(object, axis, distance, offset) {
            var normal = {
                x: [ 1, 0, 0 ],
                y: [ 0, 1, 0 ],
                z: [ 0, 0, 1 ]
            };
            var bounds = object.getBounds();
            var size = util.size(object);
            var cutDelta = util.getDelta(size, bounds, axis, offset, true);
            return object.stretchAtPlane(normal[axis], cutDelta, distance);
        }
        function poly2solid(top, bottom, height) {
            if (top.sides.length == 0) {
                return new CSG$1();
            }
            var offsetVector = CSG$1.Vector3D.Create(0, 0, height);
            var normalVector = CSG$1.Vector3D.Create(0, 1, 0);
            var polygons = [];
            polygons = polygons.concat(bottom._toPlanePolygons({
                translation: [ 0, 0, 0 ],
                normalVector,
                flipped: !(offsetVector.z < 0)
            }));
            polygons = polygons.concat(top._toPlanePolygons({
                translation: offsetVector,
                normalVector,
                flipped: offsetVector.z < 0
            }));
            var c1 = new CSG$1.Connector(offsetVector.times(0), [ 0, 0, offsetVector.z ], normalVector);
            var c2 = new CSG$1.Connector(offsetVector, [ 0, 0, offsetVector.z ], normalVector);
            polygons = polygons.concat(bottom._toWallPolygons({
                cag: top,
                toConnector1: c1,
                toConnector2: c2
            }));
            return CSG$1.fromPolygons(polygons);
        }
        function slices2poly(slices, options, axis) {
            var twistangle = options && parseFloat(options.twistangle) || 0;
            var twiststeps = options && parseInt(options.twiststeps) || CSG$1.defaultResolution3D;
            if (twistangle == 0 || twiststeps < 1) {
                twiststeps = 1;
            }
            var normalVector = options.si.normalVector;
            var polygons = [];
            var first = util.array.first(slices);
            var last = util.array.last(slices);
            var up = first.offset[axis] > last.offset[axis];
            polygons = polygons.concat(first.poly._toPlanePolygons({
                translation: first.offset,
                normalVector,
                flipped: !up
            }));
            var rotateAxis = "rotate" + axis.toUpperCase();
            polygons = polygons.concat(last.poly._toPlanePolygons({
                translation: last.offset,
                normalVector: normalVector[rotateAxis](twistangle),
                flipped: up
            }));
            var rotate = twistangle === 0 ? function rotateZero(v) {
                return v;
            } : function rotate(v, angle, percent) {
                return v[rotateAxis](angle * percent);
            };
            var connectorAxis = last.offset.minus(first.offset).abs();
            slices.forEach(function(slice, idx) {
                if (idx < slices.length - 1) {
                    var nextidx = idx + 1;
                    var top = !up ? slices[nextidx] : slice;
                    var bottom = up ? slices[nextidx] : slice;
                    var c1 = new CSG$1.Connector(bottom.offset, connectorAxis, rotate(normalVector, twistangle, idx / slices.length));
                    var c2 = new CSG$1.Connector(top.offset, connectorAxis, rotate(normalVector, twistangle, nextidx / slices.length));
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
                    orthoNormalCartesian: [ "X", "Y" ],
                    normalVector: CSG$1.Vector3D.Create(0, 1, 0)
                },
                x: {
                    orthoNormalCartesian: [ "Y", "Z" ],
                    normalVector: CSG$1.Vector3D.Create(0, 0, 1)
                },
                y: {
                    orthoNormalCartesian: [ "X", "Z" ],
                    normalVector: CSG$1.Vector3D.Create(0, 0, 1)
                }
            };
            if (!axisInfo[axis]) util.error("util.normalVector: invalid axis " + axis);
            return axisInfo[axis];
        }
        function sliceParams(orientation, radius, bounds) {
            var axis = orientation[0];
            var direction = orientation[1];
            var dirInfo = {
                "dir+": {
                    sizeIdx: 1,
                    sizeDir: -1,
                    moveDir: -1,
                    positive: true
                },
                "dir-": {
                    sizeIdx: 0,
                    sizeDir: 1,
                    moveDir: 0,
                    positive: false
                }
            };
            var info = dirInfo["dir" + direction];
            return Object.assign({
                axis,
                cutDelta: util.axisApply(axis, function(i, a) {
                    return bounds[info.sizeIdx][a] + Math.abs(radius) * info.sizeDir;
                }),
                moveDelta: util.axisApply(axis, function(i, a) {
                    return bounds[info.sizeIdx][a] + Math.abs(radius) * info.moveDir;
                })
            }, info, util.normalVector(axis));
        }
        function reShape(object, radius, orientation, options, slicer) {
            options = options || {};
            var b = object.getBounds();
            var ar = Math.abs(radius);
            var si = util.sliceParams(orientation, radius, b);
            if (si.axis !== "z") throw new Error('util.reShape error: CAG._toPlanePolytons only uses the "z" axis.  You must use the "z" axis for now.');
            var cutplane = CSG$1.OrthoNormalBasis.GetCartesian(si.orthoNormalCartesian[0], si.orthoNormalCartesian[1]).translate(si.cutDelta);
            var slice = object.sectionCut(cutplane);
            var first = util.axisApply(si.axis, function() {
                return si.positive ? 0 : ar;
            });
            var last = util.axisApply(si.axis, function() {
                return si.positive ? ar : 0;
            });
            var plane = si.positive ? cutplane.plane : cutplane.plane.flipped();
            var slices = slicer(first, last, slice);
            var delta = util.slices2poly(slices, Object.assign(options, {
                si
            }), si.axis).color(options.color);
            var remainder = object.cutByPlane(plane);
            return union([ options.unionOriginal ? object : remainder, delta.translate(si.moveDelta) ]);
        }
        function chamfer(object, radius, orientation, options) {
            return util.reShape(object, radius, orientation, options, function(first, last, slice) {
                return [ {
                    poly: slice,
                    offset: new CSG$1.Vector3D(first)
                }, {
                    poly: util.enlarge(slice, [ -radius * 2, -radius * 2 ]),
                    offset: new CSG$1.Vector3D(last)
                } ];
            });
        }
        function fillet(object, radius, orientation, options) {
            options = options || {};
            return util.reShape(object, radius, orientation, options, function(first, last, slice) {
                var v1 = new CSG$1.Vector3D(first);
                var v2 = new CSG$1.Vector3D(last);
                var res = options.resolution || CSG$1.defaultResolution3D;
                var slices = util.array.range(0, res).map(function(i) {
                    var p = i > 0 ? i / (res - 1) : 0;
                    var v = v1.lerp(v2, p);
                    var size = -radius * 2 - Math.cos(Math.asin(p)) * (-radius * 2);
                    return {
                        poly: util.enlarge(slice, [ size, size ]),
                        offset: v
                    };
                });
                return slices;
            });
        }
        function calcRotate(part, solid, axis) {
            var axes = {
                x: [ 1, 0, 0 ],
                y: [ 0, 1, 0 ],
                z: [ 0, 0, 1 ]
            };
            var rotationCenter = solid.centroid();
            var rotationAxis = axes[axis];
            return {
                rotationCenter,
                rotationAxis
            };
        }
        function rotateAround(part, solid, axis, angle) {
            var _util$calcRotate = util.calcRotate(part, solid, axis, angle), rotationCenter = _util$calcRotate.rotationCenter, rotationAxis = _util$calcRotate.rotationAxis;
            return part.rotate(rotationCenter, rotationAxis, angle);
        }
        var util$1 = Object.freeze({
            NOZZEL_SIZE,
            nearest,
            identity,
            result,
            defaults,
            isEmpty,
            isNegative,
            print,
            error,
            depreciated,
            inch,
            cm,
            label,
            text,
            unitCube,
            unitAxis,
            toArray,
            ifArray,
            segment,
            zipObject,
            map,
            mapValues,
            pick,
            mapPick,
            divA,
            divxyz,
            div: div$1,
            mulxyz,
            mul,
            xyz2array,
            rotationAxes,
            size,
            scale,
            center,
            centerY,
            centerX,
            enlarge,
            fit,
            shift,
            zero,
            mirrored4,
            flushSide,
            calcFlush,
            calcSnap,
            snap,
            flush,
            axisApply,
            axis2array,
            centroid,
            calcmidlineTo,
            midlineTo,
            translator,
            calcCenterWith,
            centerWith,
            getDelta,
            bisect,
            stretch,
            poly2solid,
            slices2poly,
            normalVector,
            sliceParams,
            reShape,
            chamfer,
            fillet,
            calcRotate,
            rotateAround
        });
        var nameArray = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgrey: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkslategrey: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dimgrey: "#696969",
            dodgerblue: "#1e90ff",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            grey: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgray: "#d3d3d3",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            slategrey: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };
        function name2hex(n) {
            n = n.toLowerCase();
            if (!nameArray[n]) return "Invalid Color Name";
            return nameArray[n];
        }
        function hex2rgb(h) {
            h = h.replace(/^\#/, "");
            if (h.length === 6) {
                return [ parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16) ];
            }
        }
        var _name2rgb = {};
        function name2rgb(n) {
            if (!_name2rgb[n]) _name2rgb[n] = hex2rgb(name2hex(n));
            return _name2rgb[n];
        }
        function color(o, r, g, b, a) {
            if (typeof r !== "string") return o.setColor(r, g, b, a);
            if (r === "") return o;
            var c = name2rgb(r).map(function(x) {
                return x / 255;
            });
            c[3] = g || 1;
            return o.setColor(c);
        }
        function init(proto) {
            proto.prototype.color = function(r, g, b, a) {
                if (!r) return this;
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
                depreciated("centerWith", true, "Use align instead.");
                return centerWith(this, axis, to);
            };
            if (proto.center) echo("proto already has .center");
            proto.prototype.center = function center(axis) {
                return centerWith(this, axis || "xyz", unitCube());
            };
            proto.prototype.calcCenter = function centerWith(axis) {
                return calcCenterWith(this, axis || "xyz", unitCube(), 0);
            };
            proto.prototype.align = function align(to, axis) {
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
            if (proto.size) echo("proto already has .size");
            proto.prototype.size = function() {
                return size(this.getBounds());
            };
            proto.prototype.centroid = function() {
                return centroid(this);
            };
            proto.prototype.Zero = function zero$1() {
                return zero(this);
            };
            proto.prototype.Center = function Center(axes) {
                return this.align(unitCube(), axes || "xy");
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
            proto.prototype.bisect = function bisect$1(axis, offset, angle, rotateaxis, rotateoffset, options) {
                return bisect(this, axis, offset, angle, rotateaxis, rotateoffset, options);
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
            proto.prototype.translate = function translate() {
                if (arguments.length === 1) {
                    return this._translate(arguments[0]);
                } else {
                    var t = Array.prototype.slice.call(arguments, 0).reduce(function(result, arg) {
                        result = undefined(result, arg);
                        return result;
                    }, [ 0, 0, 0 ]);
                    return this._translate(t);
                }
            };
        }
        var init$1 = Object.freeze({
            default: init
        });
        var CSG$2 = jsCadCSG.CSG, CAG = jsCadCSG.CAG;
        var debug$2 = Debug("jscadUtils:parts");
        var parts = {
            BBox,
            Cube,
            RoundedCube,
            Cylinder,
            Cone
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
            return objects.reduce(function(bbox, part) {
                var object = bbox ? union([ bbox, box(part) ]) : part;
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
        function RoundedCube(x, y, thickness, corner_radius) {
            if (x.getBounds) {
                var size$1 = size(x.getBounds());
                var r = [ size$1.x / 2, size$1.y / 2 ];
                thickness = size$1.z;
                corner_radius = y;
            } else {
                var r = [ x / 2, y / 2 ];
            }
            debug$2("RoundedCube", size$1, r, thickness, corner_radius);
            var roundedcube = CAG.roundedRectangle({
                center: [ r[0], r[1], 0 ],
                radius: r,
                roundradius: corner_radius
            }).extrude({
                offset: [ 0, 0, thickness || 1.62 ]
            });
            return roundedcube;
        }
        function Cylinder(diameter, height, options) {
            debug$2("parts.Cylinder", diameter, height, options);
            options = _objectSpread2({}, options, {
                start: [ 0, 0, 0 ],
                end: [ 0, 0, height ],
                radius: diameter / 2
            });
            return CSG$2.cylinder(options);
        }
        function Cone(diameter1, diameter2, height) {
            return CSG$2.cylinder({
                start: [ 0, 0, 0 ],
                end: [ 0, 0, height ],
                radiusStart: diameter1 / 2,
                radiusEnd: diameter2 / 2
            });
        }
        function Hexagon(diameter, height) {
            debug$2("hexagon", diameter, height);
            var radius = diameter / 2;
            var sqrt3 = Math.sqrt(3) / 2;
            var hex = CAG.fromPoints([ [ radius, 0 ], [ radius / 2, radius * sqrt3 ], [ -radius / 2, radius * sqrt3 ], [ -radius, 0 ], [ -radius / 2, -radius * sqrt3 ], [ radius / 2, -radius * sqrt3 ] ]);
            return hex.extrude({
                offset: [ 0, 0, height ]
            });
        }
        function Triangle(base, height) {
            var radius = base / 2;
            var tri = CAG.fromPoints([ [ -radius, 0 ], [ radius, 0 ], [ 0, Math.sin(30) * radius ] ]);
            return tri.extrude({
                offset: [ 0, 0, height ]
            });
        }
        function Tube(outsideDiameter, insideDiameter, height, outsideOptions, insideOptions) {
            return Cylinder(outsideDiameter, height, outsideOptions).subtract(Cylinder(insideDiameter, height, insideOptions || outsideOptions));
        }
        function Anchor() {
            var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
            var hole = Cylinder(width, height).Center().color("red");
            var post = Cylinder(height / 2, width * .66).rotateX(90).align(hole, "xz").snap(hole, "y", "inside-").translate([ 0, 0, -height / 6 ]).color("purple");
            return Group({
                post,
                hole
            });
        }
        function Board(width, height, corner_radius, thickness) {
            var r = divA([ width, height ], 2);
            var board = CAG.roundedRectangle({
                center: [ r[0], r[1], 0 ],
                radius: r,
                roundradius: corner_radius
            }).extrude({
                offset: [ 0, 0, thickness || 1.62 ]
            });
            return board;
        }
        var Hardware = {
            Orientation: {
                up: {
                    head: "outside-",
                    clear: "inside+"
                },
                down: {
                    head: "outside+",
                    clear: "inside-"
                }
            },
            Screw: function Screw(head, thread, headClearSpace, options) {
                options = Object.assign(options, {
                    orientation: "up",
                    clearance: [ 0, 0, 0 ]
                });
                var orientation = Hardware.Orientation[options.orientation];
                var group = Group("head,thread", {
                    head: head.color("gray"),
                    thread: thread.snap(head, "z", orientation.head).color("silver")
                });
                if (headClearSpace) {
                    group.add(headClearSpace.enlarge(options.clearance).snap(head, "z", orientation.clear).color("red"), "headClearSpace", true);
                }
                return group;
            },
            PanHeadScrew: function PanHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
                var head = Cylinder(headDiameter, headLength);
                var thread = Cylinder(diameter, length);
                if (clearLength) {
                    var headClearSpace = Cylinder(headDiameter, clearLength);
                }
                return Hardware.Screw(head, thread, headClearSpace, options);
            },
            HexHeadScrew: function HexHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
                var head = Hexagon(headDiameter, headLength);
                var thread = Cylinder(diameter, length);
                if (clearLength) {
                    var headClearSpace = Hexagon(headDiameter, clearLength);
                }
                return Hardware.Screw(head, thread, headClearSpace, options);
            },
            FlatHeadScrew: function FlatHeadScrew(headDiameter, headLength, diameter, length, clearLength, options) {
                var head = Cone(headDiameter, diameter, headLength);
                var thread = Cylinder(diameter, length);
                if (clearLength) {
                    var headClearSpace = Cylinder(headDiameter, clearLength);
                }
                return Hardware.Screw(head, thread, headClearSpace, options);
            }
        };
        var parts$1 = Object.freeze({
            default: parts,
            BBox,
            Cube,
            RoundedCube,
            Cylinder,
            Cone,
            Hexagon,
            Triangle,
            Tube,
            Anchor,
            Board,
            Hardware
        });
        var debug$3 = Debug("jscadUtils:boxes");
        var RabbetJoin = function RabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap) {
            return rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap);
        };
        function topMiddleBottom(box, thickness) {
            debug$3("TopMiddleBottom", box, thickness);
            var bottom = box.bisect("z", thickness);
            var top = bottom.parts.positive.bisect("z", -thickness);
            return util.group("top,middle,bottom", [ top.parts.positive, top.parts.negative.color("green"), bottom.parts.negative ]);
        }
        function Rabett(box, thickness, gap, height, face) {
            debug$3("Rabett", box, thickness, gap, height, face);
            gap = gap || .25;
            var inside = -thickness - gap;
            var outside = -thickness + gap;
            var group = util.group();
            var top = box.bisect("z", height);
            var bottom = top.parts.negative.bisect("z", height - face);
            group.add(union([ top.parts.positive, bottom.parts.positive.subtract(bottom.parts.positive.enlarge(outside, outside, 0)).color("green") ]), "top");
            group.add(union([ bottom.parts.negative, bottom.parts.positive.intersect(bottom.parts.positive.enlarge(inside, inside, 0)).color("yellow") ]), "bottom");
            return group;
        }
        var RabettTopBottom = function rabbetTMB(box, thickness, gap) {
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            options = Object.assign(options, {
                removableTop: true,
                removableBottom: true,
                topWidth: -thickness,
                bottomWidth: thickness
            });
            debug$3("RabettTopBottom", box, thickness, gap, options);
            gap = gap || .25;
            var group = util.group("", {
                box
            });
            var inside = -thickness - gap;
            var outside = -thickness + gap;
            if (options.removableTop) {
                var top = box.bisect("z", options.topWidth);
                group.add(top.parts.positive.enlarge([ inside, inside, 0 ]), "top");
                if (!options.removableBottom) group.add(box.subtract(top.parts.positive.enlarge([ outside, outside, 0 ])), "bottom");
            }
            if (options.removableBottom) {
                var bottom = box.bisect("z", options.bottomWidth);
                group.add(bottom.parts.negative.enlarge([ outside, outside, 0 ]), "bottomCutout", true);
                group.add(bottom.parts.negative.enlarge([ inside, inside, 0 ]), "bottom");
                if (!options.removableTop) group.add(box.subtract(group.parts.bottomCutout), "top");
            }
            if (options.removableBottom && options.removableTop) {
                group.add(box.subtract(union([ bottom.parts.negative.enlarge([ outside, outside, 0 ]), top.parts.positive.enlarge([ outside, outside, 0 ]) ])), "middle");
            }
            return group;
        };
        var CutOut = function cutOut(o, h, box, plug, gap) {
            gap = gap || .25;
            var s = o.size();
            var cutout = o.intersect(box);
            var cs = o.size();
            var clear = Parts.Cube([ s.x, s.y, h ]).align(o, "xy").color("yellow");
            var top = clear.snap(o, "z", "center+").union(o);
            var back = Parts.Cube([ cs.x + 6, 2, cs.z + 2.5 ]).align(cutout, "x").snap(cutout, "z", "center+").snap(cutout, "y", "outside-");
            var clip = Parts.Cube([ cs.x + 2 - gap, 1 - gap, cs.z + 2.5 ]).align(cutout, "x").snap(cutout, "z", "center+").snap(cutout, "y", "outside-");
            return util.group("insert", {
                top,
                bottom: clear.snap(o, "z", "center-").union(o),
                cutout: union([ o, top ]),
                back: back.subtract(plug).subtract(clip.enlarge(gap, gap, gap)).subtract(clear.translate([ 0, 5, 0 ])),
                clip: clip.subtract(plug).color("red"),
                insert: union([ o, top ]).intersect(box).subtract(o).enlarge([ -gap, 0, 0 ]).union(clip.subtract(plug).enlarge(-gap, -gap, 0)).color("blue")
            });
        };
        var Rectangle = function Rectangle(size, thickness, cb) {
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
            if (cb) box = cb(box);
            return box;
        };
        var Hollow = function Hollow(object, thickness, interiorcb, exteriorcb) {
            thickness = thickness || 2;
            var size = -thickness * 2;
            interiorcb = interiorcb || util.identity;
            var box = object.subtract(interiorcb(object.enlarge([ size, size, size ])));
            if (exteriorcb) box = exteriorcb(box);
            return box;
        };
        var BBox$1 = function BBox(o) {
            var s = util.array.div(util.xyz2array(o.size()), 2);
            return CSG.cube({
                center: s,
                radius: s
            }).align(o, "xyz");
        };
        function getRadius(o) {
            return util.array.div(util.xyz2array(o.size()), 2);
        }
        function rabbetJoin(box, thickness, gap) {
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            options = Object.assign(options, {
                removableTop: true,
                removableBottom: true
            });
            gap = gap || .25;
            var r = util.array.add(getRadius(box), -thickness / 2);
            r[2] = thickness / 2;
            var cutter = CSG.cube({
                center: r,
                radius: r
            }).align(box, "xy").color("green");
            var topCutter = cutter.snap(box, "z", "inside+");
            var group = util.group("", {
                topCutter,
                bottomCutter: cutter
            });
            group.add(box.subtract(cutter.enlarge([ gap, gap, 0 ])).color("blue"), "top");
            group.add(box.subtract(topCutter.enlarge([ gap, gap, 0 ])).color("red"), "bottom");
            return group;
        }
        var Boxes = Object.freeze({
            RabbetJoin,
            topMiddleBottom,
            Rabett,
            RabettTopBottom,
            CutOut,
            Rectangle,
            Hollow,
            BBox: BBox$1
        });
        var compatV1 = _objectSpread2({}, util$1, {
            group: Group,
            init: init$1,
            triangle,
            array,
            parts: parts$1,
            Boxes,
            Debug
        });
        exports.Boxes = Boxes;
        exports.Debug = Debug;
        exports.Group = Group;
        exports.array = array;
        exports.compatV1 = compatV1;
        exports.init = init$1;
        exports.parts = parts$1;
        exports.triangle = triangle;
        exports.util = util$1;
        return exports;
    }({}, jsCadCSG, scadApi);
    const debug = jscadUtils.Debug("jscadUtils:initJscadutils");
    util = jscadUtils.compatV1;
    util.init.default(CSG);
    debug("initJscadutils:jscadUtils", jscadUtils);
    Parts = jscadUtils.parts;
    Boxes = jscadUtils.Boxes;
    Group = jscadUtils.Group;
    Debug = jscadUtils.Debug;
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
// endinject
