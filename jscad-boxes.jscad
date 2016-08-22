function getRadius(o) {
    return util.array.div(util.xyz2array(o.size()), 2);
}

// function cutBox(box, thickness, cutHeight, rabbetHeight, cheekGap) {
//     var s = box.size();
//     var r = util.array.add(getRadius(box), 1);
//
//     rabbetHeight = rabbetHeight || 5;
//     var cutter = CSG.cube({
//         center: [r[0], r[1], rabbetHeight],
//         radius: [r[0], r[1], rabbetHeight]
//     }).translate([0, 0, (cutHeight - rabbetHeight)]);
//
//     var negative = CSG.cube({
//         center: r,
//         radius: r
//     }).color('green', .25);
//
//     var c = box.intersect(cutter);
//
//     cheekGap = cheekGap || 0.25;
//
//     var fRabbet = -thickness - cheekGap;
//     var female = c.subtract(c.enlarge(fRabbet, fRabbet, 0)).color('yellow', 0.5);
//     var mRabbet = -thickness + cheekGap;
//     var male = c.subtract(c.enlarge(mRabbet, mRabbet, 0)).color('green', 0.5);
//
//     var toplip = c.subtract(female).color('red', 0.5);
//     var bottomlip = male.color('blue', 0.5);
//
//     var top = box.subtract(cutter.union(negative.snap(cutter, 'z', 'outside-'))).color('white', 0.25).union(toplip);
//     var bottom = box.subtract(cutter.union(negative.snap(cutter, 'z', 'outside+'))).color('white', 0.25).union(bottomlip);
//     return {
//         top: top.subtract(negative.snap(top, 'z', 'inside+').translate([0, 0, -thickness])),
//         topsides: top.subtract(negative.snap(top, 'z', 'outside+').translate([0, 0, -thickness])),
//         bottomsides: bottom.subtract(negative.snap(bottom, 'z', 'outside-').translate([0, 0, thickness])),
//         bottom: bottom.subtract(negative.snap(bottom, 'z', 'inside-').translate([0, 0, thickness]))
//     };
// }

function topMiddleBottom(box, thickness) {

    var r = util.array.add(getRadius(box), 1);

    var negative = CSG.cube({
        center: r,
        radius: r
    }).color('green');

    var top = box.subtract(negative.translate([0, 0, -(thickness + 2)])).color('red');
    var bottom = box.subtract(negative.translate([0, 0, thickness])).color('blue');
    var middle = box.subtract([top, bottom]);

    return {
        top: top,
        bottom: bottom,
        middle: middle
    };
}

function rabbetTMB(box, thickness, gap, options) {
    // console.log('rabbetTMB', gap, options)
    options = _.defaults(options, {
        removableTop: true,
        removableBottom: true
    });

    gap = gap || 0.25;
    var r = util.array.add(getRadius(box), -thickness / 2);
    r[2] = thickness / 2;
    var cutter = CSG.cube({
        center: r,
        radius: r
    }).align(box, 'xy').color('green');

    var topCutter = cutter.snap(box, 'z', 'inside+');

    var placeholder = topMiddleBottom(box, thickness);

    var group = util.group('', {
        topCutter: topCutter,
        bottomCutter: cutter,
        // top: box.intersect(topCutter.enlarge([-gap, -gap, 0])),
        // middle: box.subtract(cutter.enlarge([gap, gap, 0])).subtract(topCutter.enlarge([gap, gap, 0])),
        // bottom: placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0]))
    });

    if (options.removableTop && options.removableBottom) {
        group.add(box.intersect(topCutter.enlarge([-gap, -gap, 0])), 'top');
        group.add(box.subtract(cutter.enlarge([gap, gap, 0])).subtract(topCutter.enlarge([gap, gap, 0])), 'middle');
        group.add(placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0])), 'bottom');
    }

    if (options.removableTop && !options.removableBottom) {
        group.add(box.intersect(topCutter.enlarge([-gap, -gap, 0])), 'top');
        group.add(box.subtract(topCutter.enlarge([gap, gap, 0])), 'bottom');
        // group.add(placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0])), 'bottom');
    }

    if (!options.removableTop && options.removableBottom) {
        // group.add(box.intersect(topCutter.enlarge([-gap, -gap, 0])), 'top');
        group.add(box.subtract(cutter.enlarge([gap, gap, 0])), 'top');
        group.add(placeholder.bottom.intersect(cutter.enlarge([-gap, -gap, 0])), 'bottom');
    }

    return group;
}

function rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap) {
    var r = util.array.add(getRadius(box), 1);

    rabbetHeight = rabbetHeight || 5;
    var rh = rabbetHeight / 2;
    // console.log('rabbetJoin', cutHeight, rabbetHeight, getRadius(box), r)
    var cutter = CSG.cube({
            center: [r[0], r[1], rh],
            radius: [r[0], r[1], rh]
        })
        .midlineTo('z', cutHeight);

    var c = box.intersect(cutter).color('green');

    cheekGap = cheekGap || 0.25;
    var fRabbet = -thickness - cheekGap;
    var female = c.subtract(c.enlarge(fRabbet, fRabbet, 0)).color('purple');
    var mRabbet = -thickness + cheekGap;
    var male = c.subtract(c.enlarge(mRabbet, mRabbet, 0)).color('orange');

    var airGap = airGap || 0.35;

    var b = util.bisect(box, 'z', cutHeight);
    b.parts.positive = b.parts.positive.subtract(female);
    b.parts.positiveCutout = util.bisect(female, 'z', rh + (cheekGap / 2)).parts.positive.color('orange');
    b.parts.positiveSupport = union([
            b.parts.positiveCutout.enlarge([airGap * 2, airGap * 2, 0]),
            b.parts.positiveCutout.enlarge([thickness / 2, thickness / 2, 0]),
            b.parts.positiveCutout.enlarge([thickness, thickness, 0])
        ])
        .enlarge([0, 0, -airGap]).translate([0, 0, -airGap / 2]).color('gray');
    b.parts.negative = b.parts.negative.subtract(c.subtract(male));
    b.parts.negativeCutout = util.bisect(c.subtract(male), 'z', rh + (cheekGap / 2)).parts.negative.color('orange');
    b.parts.negativeSupport = union([
            b.parts.negativeCutout.enlarge([-airGap * 2, -airGap * 2, 0]),
            b.parts.negativeCutout.enlarge([-thickness / 2, -thickness / 2, 0]),
            b.parts.negativeCutout.enlarge([-thickness, -thickness, 0])
        ])
        .enlarge([0, 0, -airGap]).translate([0, 0, airGap / 2]).color('gray');
    // b.parts.negativeCutout = c.subtract(male).color('orange');
    // console.log('b', b);
    return b;
}

function cutOut(o, h, box, plug, gap) {
    gap = gap || 0.25;
    // console.log('cutOut', o.size(), h, b.size());
    // var r = getRadius(o);
    var s = o.size();

    var cutout = o.intersect(box);
    var cs = o.size();

    var clear = Parts.Cube([s.x, s.y, h]).align(o, 'xy').color('yellow');
    var top = clear.snap(o, 'z', 'center+').union(o);
    var back = Parts.Cube([cs.x + 6, 2, cs.z + 2.5])
        .align(cutout, 'x')
        .snap(cutout, 'z', 'center+')
        .snap(cutout, 'y', 'outside-');

    var clip = Parts.Cube([cs.x + 2 - gap, 1 - gap, cs.z + 2.5])
        .align(cutout, 'x')
        .snap(cutout, 'z', 'center+')
        .snap(cutout, 'y', 'outside-');

    return util.group('insert', {
        top: top,
        bottom: clear.snap(o, 'z', 'center-').union(o),
        cutout: union([o, top]),
        back: back.subtract(plug).subtract(clip.enlarge(gap, gap, gap)).subtract(clear.translate([0, 5, 0])),
        clip: clip.subtract(plug).color('red'),
        insert: union([o, top])
            .intersect(box)
            .subtract(o)
            .enlarge([-gap, 0, 0])
            .union(clip.subtract(plug).enlarge(-gap, -gap, 0))
            .color('blue')
    });
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

    CutOut: function CutOut(o, height, box, plug) {
        return cutOut(o, height, box, plug);
    },

    Rectangle: function (size, thickness, gap, options, cb) {
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

        return rabbetTMB(box.color('gray'), thickness, gap, options);
    },

    BBox: function (o) {
        var s = util.array.div(util.xyz2array(o.size()), 2);
        return CSG.cube({
            center: s,
            radius: s
        });
    }
};
