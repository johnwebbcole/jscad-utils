import test from 'ava';
// import { nearlyEqual } from './helpers/nearlyEqual';
import * as util from '../src/util';

test('import util', t => {
    // console.log(
    //     Object.keys(util)
    //         .map(k => `test.todo('${k}');`)
    //         .join('\n')
    // );

    t.snapshot(Object.keys(util));
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
test.todo('fit');
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
