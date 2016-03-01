# jscad-utils
This is a collection of utilities for openjscad projects.  These modify the `CSG` object adding utilities for alignment, scaling and colors.  There are also some basic parts that use outside dimensions rather than radii.

For an example, see the [yeoman jscad generator](https://www.npmjs.com/package/generator-jscad) which will create a project that uses this library.

## Installation
Install `jscad-utils` using NPM:

```bash
npm install --save jscad-utils
```

## Basic usage
To use the utilities, you need to include the `jscad-utils.jscad` file and a copy of `lodash`.  

```javascript
include('node_modules/jscad-utils/jscad-utils.jscad');
include('node_modules/lodash/lodash.js');

main() {
  util.init(CSG);

}
```

## Documentation
There are several sections to the utilities.  

### Alignment
`snap`
- `to` The object to snap to.
- `axis` Which axis to snap on ['x', 'y', 'z']
- `orientation` Which side to snap to and in what direction (+ or -). ['outside+', 'outside-', 'inside+', 'inside-']

Snap the object to another object.  You can snap to the inside or outside of an object.  Snapping to the `z` axis `outside+` will place the object on top of the `to` object.

`align`
- `to` The object to align to.
- `axis` A string indicating which axis to align, 'x', 'y', 'z', or any combination including 'xyz'.

Align with another object on the selected axis.

`midlineTo`
- `axis` Which axis 'x', 'y' or 'z' to move along
- `distance` the Distnace to move.

Moves an objects midpoint on an axis a certain distance.

`Zero` Moves an object so it is sitting on the xy plane at z=0

`enlarge`
- `x`
- `y`
- `z`

Enlarge (scale) an object in drawing units rather than percentage. For example, o.enlarge(1, 0, 0) scales the x axis by 1mm, and moves o -0.5mm so the center remains the same.

### Parts
Wrappers around basic parts using outside dimensions, rather than half widths and radii.

`Cube`
- `width` [x,y,z] array

A cube centered around [0,0,0].  If you create a [10,10,10] size, you get a [10,10,10] instead of a [20,20,20] size cube.

`Cylinder`
- `diameter`
- `height`

Creates a cylinder around [0,0,0] that has a given diameter and height.

`Cone`
- `diameter1`
- `diameter2`
- `height`
- `options`

Creates a cone.

`Hexagon`
- `diameter`
- `height`

### Color
`color`
- `name` a css color name, like `blue`
- `alpha`

Set an object to a color given a css color-name.
