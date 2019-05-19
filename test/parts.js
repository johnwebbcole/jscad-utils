import test from "ava";
// import { nearlyEqual } from './helpers/nearlyEqual';
import * as Parts from "../src/parts";
import { default as DefaultParts } from "../src/parts";
import jsCadCSG from "@jscad/csg";
const { CSG } = jsCadCSG;

run_tests(Parts);

function run_tests(Parts) {
  test("BBox with CSG", t => {
    var bbox = Parts.BBox(CSG.cube({ radius: [10, 10, 10] }));

    t.snapshot(bbox.getBounds());
  });
  test("Cube", t => {
    var cube = Parts.Cube(10, 10, 10);
    console.log("cube", cube.getBounds());
    t.snapshot(cube);
  });
  test.todo("RoundedCube");
  test.todo("Cylinder");
  test.todo("Cone");
  test.todo("Hexagon");
  test.todo("Triangle");
  test.todo("Tube");
  test.todo("Board");
  test.todo("Hardware");
}
