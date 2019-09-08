import test from 'ava';
// import { nearlyEqual } from './helpers/nearlyEqual';
import * as util from '../src/util';
import utilInit from '../src/add-prototype';

import csgImageSnapshot from './helpers/csgImageSnapshot';
import jsCadCSG from '@jscad/csg';
const { CSG } = jsCadCSG;

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
test.skip('defaults', t => {
  var error = t.throws(() => Object.assign({ a: 0 }, { b: 1 }));
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
test.skip('fit', async t => {
  utilInit(CSG);
  const { snap, centerWith, color, label } = util;
  const align = centerWith;

  var cube = CSG.cube({
    radius: 10
  });
  console.trace('fit', cube.color('red'));
  // create a label, place it on top of the cube
  // // and center it on the top face
  // var label = util
  //   .label('hello')
  //   .snap(cube, 'z', 'outside-')
  //   .align(cube, 'xy');
  var l = align(snap(label('hello'), cube, 'z', 'outside-'), cube, 'xy');
  var s = cube.size();
  // fit the label to the cube (minus 2mm) while
  // keeping the aspect ratio of the text
  // and return the union
  const value = await csgImageSnapshot(
    t,
    cube.union(l.fit([s.x - 2, s.y - 2, 0], true).color('blue'))
  );
  t.true(value);
});
test.todo('flushSide');
test.todo('axisApply');
test.todo('axis2array');
test.todo('centroid');
test.todo('inch');
test.todo('cm');
test.todo('label');
test.todo('text');
test.todo('shift');
test.todo('zero');
test.todo('mirrored4');
test.todo('calcFlush');
test.todo('calcSnap');
test.todo('snap');
test.todo('flush');
test.todo('calcmidlineTo');
test.todo('midlineTo');
test.todo('translator');
test.todo('calcCenterWith');
test.todo('centerWith');
test.todo('getDelta');
test.todo('bisect');
test.todo('stretch');
test.todo('poly2solid');
test.todo('slices2poly');
test.todo('normalVector');
test.todo('sliceParams');
test.todo('reShape');
test.todo('chamfer');
test.todo('fillet');
