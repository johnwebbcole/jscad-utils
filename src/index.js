/**
 * JsCad Utilities es6
 */

import * as triangle from './triangle';
import * as array from './array';
import * as util from './util';
import { Group } from './group';
import * as init from './add-prototype';
import * as parts from './parts';
import * as Boxes from './boxes';
import { Debug } from './debug';

export { util, triangle, array, Group, init, parts, Boxes, Debug };

export const compatV1 = {
  ...util,
  group: Group,
  init,
  triangle,
  array,
  parts,
  Boxes,
  Debug
};
