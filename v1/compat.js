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

  // include:compat.js
  // endinject

  util = jscadUtils.compatV1;

  util.init.default(CSG);

  if (enableLogging) console.log('initJscadutils:jscadUtils', jscadUtils);
  Parts = jscadUtils.parts;
  Boxes = jscadUtils.Boxes;

  return jscadUtils;
}

initJscadutils();

var util = {
  init: function unusedInit() {
    return;
  }
};
/* eslint-enable */
