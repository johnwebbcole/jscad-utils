import resolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    exports: 'none',
    external: ['@jscad/scad-api', '@jscad/csg'],
    plugins: [
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            },
            browser: true
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
