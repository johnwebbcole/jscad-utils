import test from 'ava';
// import { nearlyEqual } from './helpers/nearlyEqual';
import * as util from '../src/util';

import { csgImageSnapshot } from '@jwc/jscad-test-utils';
import { CSG } from '../src/jscad';

test.after.always.cb('wait for logging', t => {
  setTimeout(t.end, 100);
});

const snapshotOptions = {
  camera: {
    position: [25, -25, 25]
  }
};

test('import util', t => {
  // console.log(
  //     Object.keys(util)
  //         .map(k => `test.todo('${k}');`)
  //         .join('\n')
  // );

  t.snapshot(Object.keys(util).sort());
});

test('identity', t => {
  var o = { a: 'foo' };
  t.deepEqual(util.identity(o), o);
});
test.todo('result');

test('defaults', t => {
  var error = t.throws(() => util.defaults({ a: 0 }, { b: 1 }));
  t.is(error.message, 'defaults is depreciated. use Object.assign instead');
});

test('isEmpty', t => {
  t.true(util.isEmpty(undefined));
  t.true(util.isEmpty(null));
  t.false(util.isEmpty({}));
  t.false(util.isEmpty(''));
  t.false(util.isEmpty(0));
  t.false(util.isEmpty(false));
});

test('isNegative', t => {
  t.true(util.isNegative(-1));
  t.false(util.isNegative(1));
  t.false(util.isNegative(0));
  t.true(util.isNegative(-0));
});

test.todo('print');
test.todo('error');
test.todo('depreciated');
test('unitCube', t => {
  t.snapshot(util.unitCube().getBounds());
});
test('unitAxis', t => {
  t.snapshot(util.unitAxis().getBounds());
});
test.todo('toArray');
test.todo('ifArray');
test.todo('segment');
test.todo('zipObject');
test.todo('map');
test.todo('mapValues');
test.todo('pick');
test.todo('mapPick');
test.todo('divA');
test.todo('divxyz');
test.todo('div');
test.todo('mulxyz');
test.todo('mul');
test.todo('xyz2array');
test.todo('rotationAxes');
test.todo('size');
test.todo('scale');
test.todo('center');
test.todo('centerY');
test.todo('centerX');
test.todo('enlarge');
test('fit', async t => {
  var cube = CSG.cube({
    radius: 10
  });

  /**
   * note: Some native functions like `union`,
   * will return a CSG object that does not have
   * the same prototype as the jscad-utils CSG object.
   *
   * Running in the 1.x version, this usually isn't an
   * issue, however in unit tests, this does happen.
   *
   * The fix is to `util.clone` the object and you will
   * get a CSG with the jscad-utils prototypes on it.
   */

  // create a label, place it on top of the cube
  // and center it on the top face
  var l = util
    .clone(util.label('hello'))
    .snap(cube, 'z', 'outside-')
    .align(cube, 'xy');
  var s = cube.size();

  // fit the label to the cube (minus 2mm) while
  // keeping the aspect ratio of the text
  // and return the union
  const value = await csgImageSnapshot(
    t,
    cube.union(l.fit([s.x - 2, s.y - 2, 0], true).color('blue')),
    snapshotOptions
  );
  t.true(value);
});
test.todo('flushSide');
test.todo('axisApply');
test.todo('axis2array');
test('centroid', t => {
  var cube = CSG.cube({
    radius: 10,
    center: [5, 5, 5]
  });
  t.snapshot(util.centroid(cube));
});
test('inch', t => {
  t.is(util.inch(1.0), 25.4);
  t.is(util.inch(200.0), 5080);
  t.is(util.inch(3.75), 95.25);
});

test('cm', t => {
  t.is(util.cm(25.4), 1);
  t.is(util.cm(5080), 200);
  t.is(util.cm(95.25), 3.75);
});

test('label', async t => {
  var label = util.clone(util.label('label'));

  const value = await csgImageSnapshot(t, label, snapshotOptions);
  t.true(value);
});

test.skip('text', async t => {
  var text = util.text('text');

  const value = await csgImageSnapshot(t, text, snapshotOptions);
  t.true(value);
});

test.todo('shift');

test('zero', async t => {
  var object = CSG.sphere({ radius: 5 }).Zero();

  const value = await csgImageSnapshot(t, object, snapshotOptions);
  t.true(value);
});

test.todo('mirrored4');
test.todo('calcFlush');
test.todo('calcSnap');
test.todo('snap');
test.todo('flush');
test('calcmidlineTo', t => {
  var board = CSG.cube({
    radius: 1
  });

  t.deepEqual(util.calcmidlineTo(board, 'x', 20), [19, 0, 0]);
  t.deepEqual(util.calcmidlineTo(board, 'y', 10), [0, 9, 0]);
  t.deepEqual(util.calcmidlineTo(board, 'z', 30), [0, 0, 29]);
  t.deepEqual(util.calcmidlineTo(board, 'xyz', 5), [4, 4, 4]);
});
test.todo('midlineTo');
test.todo('translator');
test.todo('calcCenterWith');
test.todo('centerWith');
test.todo('getDelta');

test('bisect object positive', async t => {
  var bisectCube = CSG.cube({
    radius: 10
  }).bisect('x', 2);

  const value = await csgImageSnapshot(
    t,
    bisectCube.toArray(),
    snapshotOptions
  );
  t.true(value);
});

test('bisect object negative', async t => {
  var bisectCube = CSG.cube({
    radius: 10
  }).bisect('x', -2);

  const value = await csgImageSnapshot(
    t,
    bisectCube.toArray(),
    snapshotOptions
  );
  t.true(value);
});

test.todo('stretch');
test.todo('poly2solid');
test.todo('slices2poly');
test.todo('normalVector');
test.todo('sliceParams');
test.todo('reShape');

test('chamfer', async t => {
  var cube = CSG.cube({
    radius: 10
  }).chamfer(3, 'z+');

  const value = await csgImageSnapshot(t, cube, snapshotOptions);
  t.true(value);
});

test('fillet', async t => {
  var cube = CSG.cube({
    radius: 10
  }).fillet(2, 'z+');

  const value = await csgImageSnapshot(t, cube, snapshotOptions);
  t.true(value);
});
