const {
  union
  //   difference,
  //   intersection
} = require('@jscad/scad-api').booleanOps;
global.union = union;

global.jscadUtilsDebug = {
  enabled: [], // [/jscadUtils:group/],
  disabled: [],
  options: { browser: false }
};
