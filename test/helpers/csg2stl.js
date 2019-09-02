import stlSerializer from '@jscad/stl-serializer';
import fs from 'fs';

module.exports = function csg2stl(data, filename) {
  /**
   * Delete the file if it exists.
   */
  if (fs.existsSync(filename)) fs.unlinkSync(filename);

  /**
   * Write an ascii STL file
   */
  const rawData = stlSerializer.serialize(data, {
    binary: false
  });

  fs.writeFileSync(filename, rawData);
};
