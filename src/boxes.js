import { Debug } from './debug';
const debug = Debug('jscadUtils:boxes');
/**
 * jscad box and join utilities.  This should be considered experimental,
 * but there are some usefull utilities here.
 */
/**
   * Create a [rabbet joint](https://en.wikipedia.org/wiki/Rabbet) in a CSG solid.
   * This was designed for cubes, but should work on other types of objects.
   *
   * Splits a CGS object into a top and bottom objects.  The two objects will
   * fit together with a rabbet join.
   * @param {CGS} box          A `CSG` object to create the rabbet join in.
   * @param {Number} thickness    [description]
   * @param {Number} cutHeight    [description]
   * @param {Number} rabbetHeight [description]
   * @param {Number} cheekGap     [description]
   * @return {Object} An object with `top` and `bottom` CGS objects.

   * @function RabbetJoin
   * @deprecated Use `Rabbet` instead.
   */
export const RabbetJoin = function RabbetJoin(
  box,
  thickness,
  cutHeight,
  rabbetHeight,
  cheekGap
) {
  return rabbetJoin(box, thickness, cutHeight, rabbetHeight, cheekGap);
};

/**
 * Cuts a CSG object into three parts, a top and bottom of `thickness`
 * height, and the remaining middle.
 * @function topMiddleBottom
 * @param  {CSG} box       A `CSG` object.
 * @param  {Number} thickness The thickness of the top and bottom parts.
 * @return {group} A `Group` object with the `top`, `middle` and `bottom` parts.
 */
export function topMiddleBottom(box, thickness) {
  debug('TopMiddleBottom', box, thickness);
  var bottom = box.bisect('z', thickness);
  var top = bottom.parts.positive.bisect('z', -thickness);

  return util.group('top,middle,bottom', [
    top.parts.positive,
    top.parts.negative.color('green'),
    bottom.parts.negative
  ]);
}

/**
 * This will bisect an object using a rabett join.  Returns a
 * `group` object with `positive` and `negative` parts.
 *
 * * ![parts example](../images/rabett.png)
 * @example
 *include('dist/jscad-utils.jscad');
 *
 *function mainx(params) {
 *     util.init(CSG);
 *
 *     var cyl = Parts.Cylinder(20, 20)
 *     var cbox = Boxes.Hollow(cyl, 3, function (box) {
 *       return box
 *           .fillet(2, 'z+')
 *           .fillet(2, 'z-');
 *     });
 *     var box = Boxes.Rabett(cbox, 3, 0.5, 11, 2)
 *     return box.parts.top.translate([0, 0, 10]).union(box.parts.bottom);
 *}
 *
 * @param {CSG} box       The object to bisect.
 * @param {Number} thickness Thickness of the objects walls.
 * @param {Number} gap       Gap between the join cheeks.
 * @param {Number} height    Offset from the bottom to bisect the object at.  Negative numbers offset from the top.
 * @param {Number} face      Size of the join face.
 * @return {group} A group object with `positive`, `negative` parts.
 */
export function Rabett(box, thickness, gap, height, face) {
  debug('Rabett', box, thickness, gap, height, face);
  gap = gap || 0.25;
  var inside = -thickness - gap;
  var outside = -thickness + gap;

  var group = util.group();
  var top = box.bisect('z', height);
  var bottom = top.parts.negative.bisect('z', height - face);

  group.add(
    union([
      top.parts.positive,
      bottom.parts.positive
        .subtract(bottom.parts.positive.enlarge(outside, outside, 0))
        .color('green')
    ]),
    'top'
  );

  group.add(
    union([
      bottom.parts.negative,
      bottom.parts.positive
        .intersect(bottom.parts.positive.enlarge(inside, inside, 0))
        .color('yellow')
    ]),
    'bottom'
  );

  return group;
}

/**
 * Used on a hollow object, this will rabett out the top and/or
 * bottom of the object.
 *
 * ![A hollow hexagon with removable top and bottom](../images/rabett-tb.png)
 *
 * @example
 *include('dist/jscad-utils.jscad');
 *
 *function mainx(params) {
 *     util.init(CSG);
 *     var part = Parts.Hexagon(20, 10).color('orange');
 *     var cbox = Boxes.Hollow(part, 3);
 *
 *     var box = Boxes.RabettTopBottom(cbox, 3, 0.25);
 *
 *
 *     return union([
 *         box.parts.top.translate([0, 0, 20]),
 *         box.parts.middle.translate([0, 0, 10]),
 *         box.parts.bottom
 *     ]);
 *}
 *
 * @param {CSG} box       A hollow object.
 * @param {Number} thickness The thickness of the object walls
 * @param {Number} gap       The gap between the top/bottom and the walls.
 * @param {Object} options   Options to have a `removableTop` or `removableBottom`.  Both default to `true`.
 * @param {Boolean} options.removableTop   The top will be removable.
 * @param {Boolean} options.removableBottom   The bottom will be removable.
 * @return {group} An A hollow version of the original object..
 * @memberof module:Boxes
 */
export const RabettTopBottom = function rabbetTMB(
  box,
  thickness,
  gap,
  options = {}
) {
  options = Object.assign(options, {
    removableTop: true,
    removableBottom: true,
    topWidth: -thickness,
    bottomWidth: thickness
  });
  debug('RabettTopBottom', box, thickness, gap, options);
  gap = gap || 0.25;

  var group = util.group('', {
    box: box
  });

  var inside = -thickness - gap;
  var outside = -thickness + gap;

  if (options.removableTop) {
    var top = box.bisect('z', options.topWidth);
    group.add(top.parts.positive.enlarge([inside, inside, 0]), 'top');

    if (!options.removableBottom)
      group.add(
        box.subtract(top.parts.positive.enlarge([outside, outside, 0])),
        'bottom'
      );
  }

  if (options.removableBottom) {
    var bottom = box.bisect('z', options.bottomWidth);

    group.add(
      bottom.parts.negative.enlarge([outside, outside, 0]),
      'bottomCutout',
      true
    );

    group.add(bottom.parts.negative.enlarge([inside, inside, 0]), 'bottom');

    if (!options.removableTop)
      group.add(box.subtract(group.parts.bottomCutout), 'top');
  }

  if (options.removableBottom && options.removableTop) {
    group.add(
      box.subtract(
        union([
          bottom.parts.negative.enlarge([outside, outside, 0]),
          top.parts.positive.enlarge([outside, outside, 0])
        ])
      ),
      'middle'
    );
  }

  return group;
};

export const CutOut = function cutOut(o, h, box, plug, gap) {
  gap = gap || 0.25;
  // console.log('cutOut', o.size(), h, b.size());
  // var r = getRadius(o);
  var s = o.size();

  var cutout = o.intersect(box);
  var cs = o.size();

  var clear = Parts.Cube([s.x, s.y, h])
    .align(o, 'xy')
    .color('yellow');
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
    back: back
      .subtract(plug)
      .subtract(clip.enlarge(gap, gap, gap))
      .subtract(clear.translate([0, 5, 0])),
    clip: clip.subtract(plug).color('red'),
    insert: union([o, top])
      .intersect(box)
      .subtract(o)
      .enlarge([-gap, 0, 0])
      .union(clip.subtract(plug).enlarge(-gap, -gap, 0))
      .color('blue')
  });
};

export const Rectangle = function(size, thickness, cb) {
  thickness = thickness || 2;
  var s = util.array.div(util.xyz2array(size), 2);

  var r = util.array.add(s, thickness);
  var box = CSG.cube({
    center: r,
    radius: r
  }).subtract(
    CSG.cube({
      center: r,
      radius: s
    })
  );

  if (cb) box = cb(box);

  // return rabbetTMB(box.color('gray'), thickness, gap, options);
  return box;
};

/**
 * Takes a solid object and returns a hollow version with a selected
 * wall thickness.  This is done by reducing the object by half the
 * thickness and subtracting the reduced version from the original object.
 *
 * ![A hollowed out cylinder](../images/rabett.png)
 *
 * @param {CSG}   object    A CSG object
 * @param {Number}   thickness The thickness of the walls.
 * @param {Function} interiorcb        A callback that allows processing the object before returning.
 * * @param {Function} exteriorcb        A callback that allows processing the object before returning.
 * @return {CSG} An A hollow version of the original object..
 * @memberof module:Boxes
 */
export const Hollow = function(object, thickness, interiorcb, exteriorcb) {
  thickness = thickness || 2;
  var size = -thickness * 2;
  interiorcb = interiorcb || util.identity;
  var box = object.subtract(interiorcb(object.enlarge([size, size, size])));

  if (exteriorcb) box = exteriorcb(box);
  return box;
};

/**
 * Create a box that surounds the object.
 * @param {CSG} o The object to create a bounding box for.
 * @return {CSG} The bounding box aligned with the object.
 * @memberof module:Boxes
 */
export const BBox = function(o) {
  var s = util.array.div(util.xyz2array(o.size()), 2);
  return CSG.cube({
    center: s,
    radius: s
  }).align(o, 'xyz');
};

function getRadius(o) {
  return util.array.div(util.xyz2array(o.size()), 2);
}

function rabbetJoin(box, thickness, gap, options = {}) {
  options = Object.assign(options, {
    removableTop: true,
    removableBottom: true
  });

  gap = gap || 0.25;
  var r = util.array.add(getRadius(box), -thickness / 2);
  r[2] = thickness / 2;
  var cutter = CSG.cube({
    center: r,
    radius: r
  })
    .align(box, 'xy')
    .color('green');

  var topCutter = cutter.snap(box, 'z', 'inside+');

  var group = util.group('', {
    topCutter: topCutter,
    bottomCutter: cutter
  });

  group.add(box.subtract(cutter.enlarge([gap, gap, 0])).color('blue'), 'top');
  group.add(
    box.subtract(topCutter.enlarge([gap, gap, 0])).color('red'),
    'bottom'
  );

  return group;
}
