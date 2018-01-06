/**
  * Initialize `jscad-utils` and add utilities to the `proto` object.
  * @param  {proto} proto The global `proto` object
  * @augments proto
  */
export default function init(proto) {
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
