import { csgImageSnapshot } from '@jwc/jscad-test-utils';
import test from 'ava';
import { Boxes, parts as Parts } from '../src';
import { union } from '../src/jscad';

test('boxes-RabettTopBottom', async (t) => {
  var part = Parts.Hexagon(20, 10).color('orange');
  var cbox = Boxes.Hollow(part, 3);

  var box = Boxes.RabettTopBottom(cbox, 3, 0.25);

  var object = union([
    box.parts.top.translate([0, 0, 20]),
    box.parts.middle.translate([0, 0, 10]),
    box.parts.bottom
  ]);
  const value = await csgImageSnapshot(t, object);
  t.true(value);
});

test('boxes-RabettTopBottom without removable bottom', async (t) => {
  var part = Parts.Hexagon(20, 10).color('orange');
  var cbox = Boxes.Hollow(part, 3);

  var box = Boxes.RabettTopBottom(cbox, 3, 0.25, { removableBottom: false });

  var object = union([box.parts.top.translate([0, 0, 20]), box.parts.bottom]);
  const value = await csgImageSnapshot(t, object);
  t.true(value);
});

test('boxes-RabettTopBottom without removable top', async (t) => {
  var part = Parts.Hexagon(20, 10).color('orange');
  var cbox = Boxes.Hollow(part, 3);

  var box = Boxes.RabettTopBottom(cbox, 3, 0.25, { removableTop: false });

  var object = union([box.parts.top.translate([0, 0, 20]), box.parts.bottom]);
  const value = await csgImageSnapshot(t, object, {
    camera: {
      position: [25, -25, -25]
    }
  });
  t.true(value);
});

test('boxes-Rabett', async (t) => {
  var cyl = Parts.Cylinder(20, 20);
  var cbox = Boxes.Hollow(cyl, 3, function (box) {
    return box.fillet(2, 'z+').fillet(2, 'z-');
  });
  var box = Boxes.Rabett(cbox, 3, 0.5, 7, 2);
  var object = box.parts.top.translate([0, 0, 10]).union(box.parts.bottom);

  const value = await csgImageSnapshot(t, object);
  t.true(value);
});

test('boxes-Rabett with negative start', async (t) => {
  var cyl = Parts.Cylinder(20, 20);
  var cbox = Boxes.Hollow(cyl, 3, function (box) {
    return box.fillet(2, 'z+').fillet(2, 'z-');
  });
  var box = Boxes.Rabett(cbox, 3, 0.5, -7, 2);
  var object = box.parts.top.translate([0, 0, 10]).union(box.parts.bottom);

  const value = await csgImageSnapshot(t, object);
  t.true(value);
});

test('boxes-RabettJoin', async (t) => {
  var cube = Parts.Cube([20, 20, 20]).Center();

  const error = t.throws(
    () => {
      var box = Boxes.RabbetJoin(cube, 3, 0.5);
    },
    { name: 'JSCAD_UTILS_DEPRECATED' }
  );

  t.is(error.message, "RabbetJoin is depreciated. Use 'Rabbet' instead");
});

test('boxes-topMiddleBottom', async (t) => {
  var cube = Parts.Cube([20, 20, 20]).Center();

  var box = Boxes.topMiddleBottom(cube, 2);

  var object = box.parts.top
    .translate([0, 0, 10])
    .union(box.parts.bottom)
    .union(box.parts.middle.translate([0, 0, 5]));

  const value = await csgImageSnapshot(t, object);
  t.true(value);
});

// test('boxes-BBox', t => {
//   var sphere = Parts.Sphere(20);
// });
