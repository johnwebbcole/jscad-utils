/**
 * jscad utilties
 * @class util
 */
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
   * @param  {string} axis    Which axis: 'x', 'y', 'z'
   * @param  {number} mside   0 or 1
   * @param  {number} wside   0 or 1
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

  axisApply: function (axis, valfun) {
    var retval = [0, 0, 0];
    var lookup = {
      x: 0,
      y: 1,
      z: 2
    };

    axis.split('').forEach(function (ax) {
      retval[lookup[ax]] = valfun(lookup[ax]);
    })

    return retval;
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

  centerWith: function centerWith(o, axis, withObj) {
    var centroid = util.centroid(o);
    var withCentroid = util.centroid(withObj);
    // echo('centerWith', centroid, withCentroid);

    return o.translate(util.axisApply(axis, function (i) {
      return withCentroid[i] - centroid[i];
    }));
  },

  init: function init(CSG) {
    /**
     * Moves an object flush with another object
     * @param  {CSG} obj   withobj Object to make flush with
     * @param  {string} axis    Which axis: 'x', 'y', 'z'
     * @param  {number} mside   0 or 1
     * @param  {number} wside   0 or 1
     * @return {CSG}       [description]
     */
    CSG.prototype.flush = function flush(to, axis, mside, wside) {
      return util.flush(this, to, axis, mside, wside);
    };

    /**
     * Snap the object to another object.  You can snap to the inside or outside
     * of an object.  This is an easier method to use than `flush`.  Snapping to the `z`
     * axis `outside+` will place the object on top of the `to` object.
     * @param  {CSG} to          The object to snap to.
     * @param  {string} axis        Which axis to snap on ['x', 'y', 'z']
     * @param  {string} orientation Which side to snap to and in what direction (+ or -). ['outside+', 'outside-', 'inside+', 'inside-']
     * @return {CSG}             [description]
     */
    CSG.prototype.snap = function snap(to, axis, orientation) {
      var a = [0, 0]
      switch (orientation) {
      case 'outside+':
        a = [0, 1];
        break;
      case 'outside-':
        a = [1, 0];
        break;
      case 'inside+':
        a = [1, 1];
        break;
      case 'inside-':
        a = [0, 0];
        break;
      }
      return util.flush(this, to, axis, a[0], a[1]);
    };

    CSG.prototype.midlineTo = function midlineTo(axis, to) {
      return util.midlineTo(this, axis, to);
    };

    CSG.prototype.centerWith = function centerWith(axis, to) {
      return util.centerWith(this, axis, to);
    };

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

    CSG.prototype.Zero = function zero() {
      return util.zero(this);
    };

    CSG.prototype.color = function color(name, alpha) {
      var color = jscad_color_name[name];
      r = color[0] / 255;
      g = color[1] / 255;
      b = color[2] / 255;
      a = alpha || 1;
      return this.setColor(r, g, b, a)
    };
  }

};