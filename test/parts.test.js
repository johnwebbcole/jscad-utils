import test from 'ava';
import { csgImageSnapshot } from '@jwc/jscad-test-utils';
import * as Parts from '../src/parts';

const snapshotOptions = {
  camera: {
    position: [25, -25, 25]
  }
};

test('BBox with CSG', t => {
  var cube = Parts.Cube([10, 10, 10]);
  var bbox = Parts.BBox(cube);

  t.snapshot(bbox.getBounds());
});

test('Cube', async t => {
  var cube = Parts.Cube([10, 10, 10]);
  // console.log('cube', cube.getBounds());
  const value = await csgImageSnapshot(t, cube, snapshotOptions);
  t.true(value);
});

test('RoundedCube', async t => {
  var part = Parts.RoundedCube(10, 10, 1, 2);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('RoundedCube from object', async t => {
  var cube = Parts.Cube([10, 10, 10]);
  var part = Parts.RoundedCube(cube, 2);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('Cylinder', async t => {
  var part = Parts.Cylinder(10, 10);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('Cone', async t => {
  var part = Parts.Cone(10, 0, 10);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('Cone flat', async t => {
  var part = Parts.Cone(10, 2, 10);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('Hexagon', async t => {
  var part = Parts.Hexagon(10, 10);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('Triangle', async t => {
  var part = Parts.Triangle(5, 10);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('Tube', async t => {
  var part = Parts.Tube(10, 5, 10);
  const value = await csgImageSnapshot(t, part, snapshotOptions);
  t.true(value);
});

test('Anchor', async t => {
  // utilInit(CSG);
  var anchor = Parts.Anchor(5, 2.5);
  var board = Parts.RoundedCube(10, 10, 2.5, 2).Center();
  const value = await csgImageSnapshot(
    t,
    board.subtract(anchor.combine('hole')).union(anchor.combine('post')),
    snapshotOptions
  );
  t.true(value);
});
// }
