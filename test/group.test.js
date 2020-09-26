import { csgImageSnapshot } from '@jwc/jscad-test-utils';
import test from 'ava';
import Group from '../src/group';
import * as Parts from '../src/parts';

const snapshotOptions = {
  camera: {
    position: [25, -25, 25]
  }
};

const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item) => typeof obj[item] === 'function'
  );
};

function getTestGroup() {
  var cube = Parts.Cube([2.5, 2.5, 2.5]).center();
  var testGroup = Group('unit-test');
  testGroup.add(cube.translate([5, 5, 5]), 'cube-1');
  testGroup.add(cube.translate([-5, 5, 5]), 'cube-2');
  testGroup.add(cube.translate([5, -5, 5]), 'cube-3');
  testGroup.add(cube.translate([-5, -5, 5]), 'cube-4');
  testGroup.add(cube.translate([5, 5, -5]), 'cube-5');
  testGroup.add(cube.translate([-5, 5, -5]), 'cube-6');
  testGroup.add(cube.translate([5, -5, -5]), 'cube-7');
  testGroup.add(cube.translate([-5, -5, -5]), 'cube-8');
  return testGroup;
}

test('group - import Group', (t) => {
  // console.log(
  //     Object.keys(array)
  //         .map(k => `test.todo('${k}');`)
  //         .join('\n')
  // );
  var g = Group('test-group');

  t.snapshot(getMethods(g));
});
// test.todo('div');
test.todo('group - add');
test('group - combine', async (t) => {
  var g = getTestGroup();

  const value = await csgImageSnapshot(t, g.combine(), snapshotOptions);
  t.true(value);
});
test.todo('group - map');
test.todo('group - clone');

test('group - rotate', async (t) => {
  var g = getTestGroup();

  const value = await csgImageSnapshot(
    t,
    g.rotate('cube-1', 'z', 15).combine(),
    snapshotOptions
  );
  t.true(value);
});
test.todo('group - combineAll');
test.todo('group - snap');
test.todo('group - align');
test.todo('group - center');
test.todo('group - zero');
test.todo('group - connectTo');
test.todo('group - midlineTo');
test.todo('group - translate');
test.todo('group - pick');
test.todo('group - array');
test.todo('group - toArray');

test('group - toString', (t) => {
  var g = getTestGroup();

  t.snapshot(g.toString());
});
test.todo('group - setName');
