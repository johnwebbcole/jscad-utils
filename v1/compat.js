/* eslint-disable */
var Parts, Boxes;
function initJscadutils(_CSG, enableLogging) {
  var jsCadCSG = { CSG };
  var scadApi = {
    vector_text,
    rectangular_extrude,
    vector_char,
    primitives3d: {
      cube,
      sphere,
      cylinder
    }
  };

  // include:compat
  // endinject

  util = jscadUtils.compatV1;

  util.init.default(CSG);

  console.log('initJscadutils:jscadUtils', jscadUtils);
  Parts = jscadUtils.parts;
  Boxes = jscadUtils.Boxes;

  return jscadUtils;
}

var util = {
  init: initJscadutils
};
/* eslint-enable */
