import jsCadCSG from '@jscad/csg';
const { CSG, CAG } = jsCadCSG;
import scadApi from '@jscad/scad-api';
const { rectangular_extrude } = scadApi.extrusions;
const { vector_text, vector_char } = scadApi.text;
const { union } = scadApi.booleanOps;

import addPrototype from './add-prototype';
addPrototype(CSG);

export { CSG, CAG, union, rectangular_extrude, vector_text, vector_char };
