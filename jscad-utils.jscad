util = {
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

    unitCube: function (length) {
        return CSG.cube({
            center: [0, 0, 0],
            radius: [0.5, 0.5, length]
        }).setColor(1, 0, 0);
    },

    unitAxis: function (length, centroid) {
        // echo(length, JSON.stringify(centroid));
        return util.unitCube(length)
            .union([
                util.unitCube(length).rotateY(90).setColor(0, 1, 0),
                util.unitCube(length).rotateX(90).setColor(0, 0, 1)
            ]).translate(centroid);
    },

    divA: function divA(a, f) {
        return _.map(a, function (e) {
            return e / f;
        });
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
     * @param  {[type]} object [description]
     * @param  {[type]} x      [description]
     * @param  {[type]} y      [description]
     * @param  {[type]} z      [description]
     * @return {[type]}        [description]
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
        wside = wside !== undefined ? wside : mside;
        var m = moveobj.getBounds();
        var w = withobj.getBounds()
        var d = w[wside][axis] - m[mside][axis];
        var ta = [d, 0, 0];
        if (axis != 'x') {
            ta = axis == 'y' ? [0, d, 0] : [0, 0, d];
        }
        // echo('flush', JSON.stringify(ta));
        return moveobj.translate(ta)
    },

    axis2array: function (axis, valfun) {
        var a = [0, 0, 0];
        var lookup = {
            x: 0,
            y: 1,
            z: 2
        };

        a[lookup[axis]] = valfun(lookup[axis]);

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

        return o.translate(util.axis2array(axis, function (i) {
            return to - centroid[i];
        }));
    },

    centerWith: function centerWith(o, axis, withObj) {
        var centroid = util.centroid(o);
        var withCentroid = util.centroid(withObj);
        // echo('centerWith', centroid, withCentroid);

        return o.translate(util.axis2array(axis, function (i) {
            return withCentroid[i] - centroid[i];
        }));
    },

    init: function init(CSG) {
        /**
         * Moves an object flush with another object
         * @param  {CSG} obj   withobj Object to make flush with
         * @param  {String} axis    Which axis: 'x', 'y', 'z'
         * @param  {Number} mside   0 or 1
         * @param  {Number} wside   0 or 1
         * @return {CSG}       [description]
         */
        CSG.prototype.flush = function flush(obj, axis, mside, wside) {
            return util.flush(this, obj, axis, mside, wside);
        };

        CSG.prototype.midlineTo = function midlineTo(axis, to) {
            return util.midlineTo(this, axis, to);
        };

        CSG.prototype.centerWith = function centerWith(axis, to) {
            return util.centerWith(this, axis, to);
        };

        /**
         * Enlarge (scale) an object in drawing units rather than percentage.
         * For example, o.enlarge(1, 0, 0) scales the x axis by 1mm, and moves
         * o -0.5mm so the center remains the same.
         * @param  {[type]} x [description]
         * @param  {[type]} y [description]
         * @param  {[type]} z [description]
         * @return {[type]}   [description]
         */
        CSG.prototype.enlarge = function enlarge(x, y, z) {
            return util.enlarge(this, x, y, z);
        }

        CSG.prototype.Zero = function zero() {
            return util.zero(this);
        };
    }

};