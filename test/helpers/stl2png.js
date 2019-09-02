var StlThumbnailer = require('node-stl-to-thumbnail');
var fs = require('fs');

module.exports = function stl2png(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    console.warn('stl2png', filePath, outputPath);

    var thumbnailer = new StlThumbnailer({
      filePath,
      requestThumbnails: [
        {
          width: 500,
          height: 500
        }
      ]
    }).then(function(thumbnails) {
      console.warn('stl2png then');

      /**
       * Delete the file if it exists.
       */
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

      // thumbnails is an array (in matching order to your requests) of Canvas objects
      // you can write them to disk, return them to web users, etc
      // see node-canvas documentation at https://github.com/Automattic/node-canvas
      thumbnails[0].toBuffer(function(err, buf) {
        console.warn('stl2png then2');
        fs.writeFileSync(outputPath, buf);
        resolve();
      });
    });
  });
};
