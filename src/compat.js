/* eslint-disable */
var Parts, Boxes, Group, Debug, array, triUtils;
function initJscadutils(_CSG, options = {}) {
  options = Object.assign({ debug: '' }, options);
  var jsCadCSG = { CSG, CAG };
  var scadApi = {
    vector_text,
    rectangular_extrude,
    vector_char,
    primitives3d: {
      cube,
      sphere,
      cylinder
    },
    extrusions: {
      rectangular_extrude
    },
    text: {
      vector_text,
      vector_char
    },
    booleanOps: {
      union
    }
  };

  var jscadUtilsDebug = (options.debug.split(',') || []).reduce(
    (checks, check) => {
      if (check.startsWith('-')) {
        checks.disabled.push(
          new RegExp(`^${check.slice(1).replace(/\*/g, '.*?')}$`)
        );
      } else {
        checks.enabled.push(new RegExp(`^${check.replace(/\*/g, '.*?')}$`));
      }
      return checks;
    },
    { enabled: [], disabled: [] }
  );

  // include:compat
  // endinject

  const debug = jscadUtils.Debug('jscadUtils:initJscadutils');

  util = jscadUtils.compatV1;

  util.init.default(CSG);

  debug('initJscadutils:jscadUtils', jscadUtils);
  Parts = jscadUtils.parts;
  Boxes = jscadUtils.Boxes;
  Group = jscadUtils.Group;
  Debug = jscadUtils.Debug;
  array = jscadUtils.array;
  triUtils = jscadUtils.triUtils;

  return jscadUtils;
}

var jscadUtilsPluginInit = [];
util = {
  init: (...a) => {
    initJscadutils(...a);

    jscadUtilsPluginInit.forEach(p => {
      p(...a);
    });
  }
};
/* eslint-enable */
