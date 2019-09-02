import fs from 'fs';
import test from 'ava';
import path from 'path';
import csgReglRenderer from './csgReglRenderer';
import looksSame from 'looks-same';
import Debug from 'debug';
const debug = Debug('jscadUtils:test:csgImageSnapshot');

module.exports = function csgImageSnapshot(t, data, options = {}) {
  options = Object.assign(options, {
    render: {}
  });
  debug('stl2png', t.title, options);
  return new Promise((resolve, reject) => {
    const imageDir = `${path.dirname(test.meta.file)}/images`;
    const pngTempFileName = `${imageDir}/${t.title}.temp.png`;
    const pngSnapFileName = `${imageDir}/${t.title}.snap.png`;
    const pngDiffFileName = `${imageDir}/${t.title}.diff.png`;

    if (fs.existsSync(pngSnapFileName)) {
      csgReglRenderer(data, pngTempFileName);

      looksSame(pngSnapFileName, pngTempFileName, { strict: true }, function(
        error,
        { equal }
      ) {
        if (error) return reject(error);
        if (!equal) {
          looksSame.createDiff(
            {
              reference: pngSnapFileName,
              current: pngTempFileName,
              diff: pngDiffFileName,
              highlightColor: '#ff0000', // color to highlight the differences
              strict: true
            },
            function(error) {
              if (error) return reject(error);
              t.log(`${t.title} diff located at: ${pngDiffFileName}`);
              resolve(equal);
            }
          );
        } else {
          if (fs.existsSync(pngTempFileName)) fs.unlinkSync(pngTempFileName);
          if (fs.existsSync(pngDiffFileName)) fs.unlinkSync(pngDiffFileName);
          resolve(equal);
        }
      });
    } else {
      if (fs.existsSync(pngTempFileName)) fs.unlinkSync(pngTempFileName);
      if (fs.existsSync(pngDiffFileName)) fs.unlinkSync(pngDiffFileName);
      /**
       * Write the missing snapshot file.
       */
      csgReglRenderer(data, pngSnapFileName);
      resolve(true);
    }
  });
};
