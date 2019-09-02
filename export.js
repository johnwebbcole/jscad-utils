var StlThumbnailer = require('node-stl-to-thumbnail');
var fs = require('fs');

var thumbnailer = new StlThumbnailer({
  filePath: __dirname + '/cube.stl',
  requestThumbnails: [
    {
      width: 500,
      height: 500
    }
  ]
}).then(function(thumbnails) {
  // thumbnails is an array (in matching order to your requests) of Canvas objects
  // you can write them to disk, return them to web users, etc
  // see node-canvas documentation at https://github.com/Automattic/node-canvas
  thumbnails[0].toBuffer(function(err, buf) {
    fs.writeFileSync(__dirname + '/output.png', buf);
  });
});
