import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    name: 'jscadUtils',
    file: 'dist/index.js',
    format: 'iife',
    exports: 'named',
    globals: { '@jscad/csg': 'jsCadCSG', '@jscad/scad-api': 'scadApi' }
  },
  external: ['@jscad/scad-api', '@jscad/csg'],
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      },
      browser: true
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
    // commonjs({
    //     namedExports: {
    //         include: 'node_modules/**'
    //         // 'node_modules/@kaosat-dev/jscad-module-example/index.js': [
    //         //     'jscadLogo',
    //         //     'coneWithCutouts'
    //         // ],
    //         // 'node_modules/@kaosat-dev/jscad-regl-helpers/index.js': [
    //         //     'drawMesh',
    //         //     'csgToMeshes'
    //         // ]
    //     }
    // })
  ]
  // sourcemap: true
};
