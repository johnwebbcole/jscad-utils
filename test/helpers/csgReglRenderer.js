const { writeContextToFile } = require('@jwc/jscad2-img-utils');
const {
  prepareRender,
  drawCommands,
  cameras,
  entitiesFromSolids
} = require('@jwc/jscad2-regl-renderer'); // replace this with the correct import
var fs = require('fs');
import Debug from 'debug';
const debug = new Debug('jscadUtils:test:csgReglRenderer');

export default function csgReglRenderer(data, filename, options = {}) {
  debug('csgReglRenderer', filename);
  options = Object.assign(options, {
    camera: {
      position: [25, -25, 25]
    },
    gl: {
      width: 1024,
      height: 768
    }
  });
  /**
   * Delete the file if it exists.
   */
  if (fs.existsSync(filename)) fs.unlinkSync(filename);

  const { width, height } = options.gl;
  // create webgl context
  const gl = require('gl')(width, height);

  // process entities and inject extras
  const solids = entitiesFromSolids({}, data);

  // prepare the camera
  const perspectiveCamera = cameras.perspective;
  const camera = Object.assign({}, perspectiveCamera.defaults, options.camera);
  perspectiveCamera.setProjection(camera, camera, { width, height });
  perspectiveCamera.update(camera, camera);

  const renderOptions = {
    glOptions: { gl },
    camera,
    drawCommands: {
      // draw commands bootstrap themselves the first time they are run
      drawGrid: drawCommands.drawGrid, // require('./src/rendering/drawGrid/index.js'),
      drawAxis: drawCommands.drawAxis, // require('./src/rendering/drawAxis'),
      drawMesh: drawCommands.drawMesh // require('./src/rendering/drawMesh/index.js')
    },
    rendering: {
      background: [1, 1, 1, 1],
      meshColor: [1, 0.5, 0.5, 1], // use as default face color for csgs, color for cags
      lightColor: [1, 1, 1, 1], // note: for now there is a single preset light, not an entity
      lightDirection: [0.2, 0.2, 1],
      lightPosition: [100, 200, 100],
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.89,
      specularLightAmount: 0.16,
      materialShininess: 8.0
    },
    // next few are for solids / csg/ cags specifically
    overrideOriginalColors: false, // for csg/cag conversion: do not use the original (csg) color, use meshColor instead
    smoothNormals: true,

    // data
    entities: [
      {
        // grid data
        // the choice of what draw command to use is also data based
        visuals: {
          drawCmd: 'drawGrid',
          show: true,
          color: [0, 0, 0, 0.1],
          subColor: [0, 0, 1, 0.1],
          fadeOut: true,
          transparent: true
        },
        size: [100, 100],
        ticks: [100, 10]
      },
      {
        visuals: {
          drawCmd: 'drawAxis',
          show: true
        }
      },
      ...solids
    ]
  };

  // prepare
  const render = prepareRender(renderOptions);
  // do the actual render
  render(renderOptions);
  // output to file
  writeContextToFile(gl, width, height, 4, filename);
}
