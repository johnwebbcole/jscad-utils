function getRadius(o) {
    return util.array.div(util.xyz2array(o.size()), 2)
}

function cutBox(box, thickness, cutHeight, rabbetHeight, cheekGap) {
    var s = box.size();
    var r = util.array.add(getRadius(box), 1);

    rabbetHeight = rabbetHeight || 5;
    var cutter = CSG.cube({
        center: [r[0], r[1], rabbetHeight],
        radius: [r[0], r[1], rabbetHeight]
    }).translate([0, 0, (cutHeight - rabbetHeight)]);

    var negative = CSG.cube({
        center: r,
        radius: r
    }).color('green', .25);

    var c = box.intersect(cutter);

    cheekGap = cheekGap || 0.25;

    var fRabbet = -thickness - cheekGap;
    var female = c.subtract(c.enlarge(fRabbet, fRabbet, 0)).color('yellow', 0.5);
    var mRabbet = -thickness + cheekGap;
    var male = c.subtract(c.enlarge(mRabbet, mRabbet, 0)).color('green', 0.5);

    var toplip = c.subtract(female).color('red', 0.5);
    var bottomlip = male.color('blue', 0.5)

    var top = box.subtract(cutter.union(negative.flush(cutter, 'z', 1, 0))).color('white', 0.25).union(toplip);
    var bottom = box.subtract(cutter.union(negative.flush(cutter, 'z', 0, 1))).color('white', 0.25).union(bottomlip)
    return {
        top: top.subtract(negative.flush(top, 'z', 1, 1).translate([0, 0, -thickness])),
        topsides: top.subtract(negative.flush(top, 'z', 0, 1).translate([0, 0, -thickness])),
        bottomsides: bottom.subtract(negative.flush(bottom, 'z', 1, 0).translate([0, 0, thickness])),
        bottom: bottom.subtract(negative.flush(bottom, 'z', 0, 0).translate([0, 0, thickness]))
    };
}

function topMiddleBottom(box, thickness) {

    var r = util.array.add(getRadius(box), 1);

    var negative = CSG.cube({
        center: r,
        radius: r
    }).color('green', .25);

    var top = box.subtract(negative.translate([0, 0, -(thickness + 2)])).color('red', 0.25);
    var bottom = box.subtract(negative.translate([0, 0, thickness])).color('blue', 0.25);
    var middle = box.subtract([top, bottom]);

    return {
        top: top,
        bottom: bottom,
        middle: middle
    };
}

function rabbetTMB(box, thickness) {

    var r = util.array.add(getRadius(box), -thickness / 2);
    r[2] = thickness / 2;
    var cutter = CSG.cube({
        center: r,
        radius: r
    }).center(box, 'xy').color('green', .25);

    var topCutter = cutter.snap(box, 'z', 'inside+');

    var placeholder = topMiddleBottom(box, thickness);

    return {
        top: box.intersect(topCutter),
        middle: box.subtract(cutter).subtract(topCutter),
        bottom: placeholder.bottom.intersect(cutter)
    };
}

function rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap) {
    var s = box.size();
    var r = util.array.add(getRadius(box), 1);

    rabbetHeight = rabbetHeight || 5;
    var cutter = CSG.cube({
        center: [r[0], r[1], rabbetHeight],
        radius: [r[0], r[1], rabbetHeight]
    }).translate([0, 0, (cutHeight - rabbetHeight) - 1]);

    var negative = CSG.cube({
        center: r,
        radius: r
    }).color('green', .25);

    var c = box.intersect(cutter);

    cheekGap = cheekGap || 0.25;

    var fRabbet = -thickness - cheekGap;
    var female = c.subtract(c.enlarge(fRabbet, fRabbet, 0)).color('yellow', 0.5);
    var mRabbet = -thickness + cheekGap;
    var male = c.subtract(c.enlarge(mRabbet, mRabbet, 0)).color('green', 0.5);

    var toplip = c.subtract(female).color('red', 0.5);
    var bottomlip = male.color('blue', 0.5)

    var top = box.subtract(cutter.union(negative.flush(cutter, 'z', 1, 0))).color('white', 0.25).union(toplip);
    var bottom = box.subtract(cutter.union(negative.flush(cutter, 'z', 0, 1))).color('white', 0.25).union(bottomlip)
    return {
        top: top,
        bottom: bottom
    };
}

function cutOut(o, height) {
    var r = getRadius(o);

    var cutout = CSG.cube({
        center: r,
        radius: r
    }).align(o, 'xy').color('yellow');

    return {
        top: cutout.snap(o, 'z', 'center+').union(o),
        bottom: cutout.snap(o, 'z', 'center-').union(o)
    };
}

/**
 * Box and join utilities for jscad.
 * @type {Object}
 */
Boxes = {

    /**
     * Create a [rabbet joint](https://en.wikipedia.org/wiki/Rabbet) in a CSG solid.
     * This was designed for cubes, but should work on other types of objects.
     *
     * Splits a CGS object into a top and bottom objects.  The two objects will
     * fit together with a rabbet join.
     * @param {CGS} box          [description]
     * @param {Number} thickness    [description]
     * @param {Number} cutHeight    [description]
     * @param {Number} rabbetHeight [description]
     * @param {Number} cheekGap     [description]
     * @return {Object} An object with `top` and `bottom` CGS objects.
     */
    RabbetJoin: function RabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap) {
        return rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap);
    },

    CutOut: function CutOut(o, height) {
        return cutOut(o, height);
    },

    Rectangle: function (size, thickness) {
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

        return rabbetTMB(box.color('gray', 0.25), thickness);
    },

    BBox: function (o) {
        var s = util.array.div(util.xyz2array(o.size()), 2);
        return CSG.cube({
            center: s,
            radius: s
        });
    }
}
