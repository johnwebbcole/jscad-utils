import test from 'ava';
import { nearlyEqual } from './helpers/nearlyEqual';
import * as triangle from '../src/triangle';

test('toRadians', t => {
    nearlyEqual(t, triangle.toRadians(180), Math.PI, 1e-10);
    nearlyEqual(t, triangle.toRadians(10), 0.17453292519943295, 1e-10);
    nearlyEqual(t, triangle.toRadians(100), 1.7453292519943295, 1e-10);
    nearlyEqual(t, triangle.toRadians(190), 3.3161255787892263, 1e-10);
    nearlyEqual(t, triangle.toRadians(280), 4.886921905584122, 1e-10);
});

test('toDegrees', t => {
    nearlyEqual(t, triangle.toDegrees(Math.PI), 180, 1e-10);
    nearlyEqual(t, triangle.toDegrees(Math.PI * 0.25), 45, 1e-10);
    nearlyEqual(t, triangle.toDegrees(Math.PI * 1.5), 270, 1e-10);
    nearlyEqual(t, triangle.toDegrees(Math.PI * 1.75), 315, 1e-10);
});

test('solve', t => {
    t.deepEqual(triangle.solve({ x: 5, y: 5 }, { x: 10, y: 10 }), {
        A: 5,
        B: 5,
        C: 7.0710678118654755,
        a: 45,
        b: 45,
        c: 90
    });
});

test('solve90SA', t => {
    t.deepEqual(triangle.solve90SA({ a: 1, A: 30 }), {
        A: 30,
        B: 60,
        C: 90,
        a: 1,
        b: 1.7320508075688774,
        c: 2.0000000000000004
    });
});
