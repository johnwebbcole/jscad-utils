[![view on npm](http://img.shields.io/npm/v/jscad-utils.svg)](https://www.npmjs.org/package/jscad-utils)
[![npm module downloads](http://img.shields.io/npm/dt/jscad-utils.svg)](https://www.npmjs.org/package/jscad-utils)

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

## API Reference

### Added `CSG` methods

* [CSG](#module_CSG)
    * [.color([red or css name], [green or alpha], [blue], [alpha])](#module_CSG.color) ⇒ <code>CSG</code>
    * [.snap(to, axis, orientation)](#module_CSG.snap) ⇒ <code>CSG</code>
    * [.midlineTo(axis, to)](#module_CSG.midlineTo) ⇒ <code>CGE</code>
    * [.align(to, axis)](#module_CSG.align) ↩︎
    * [.fit(x, y, z, a)](#module_CSG.fit) ⇒ <code>CSG</code>
    * [.size()](#module_CSG.size) ⇒ <code>CSG.Vector3D</code>
    * [.centroid()](#module_CSG.centroid) ⇒ <code>CSG.Vector3D</code>
    * [.fillet(radius, orientation, options)](#module_CSG.fillet) ⇒ <code>CSG</code>
    * [.chamfer(radius, orientation)](#module_CSG.chamfer) ⇒ <code>CSG</code>
    * [.bisect(axis, offset)](#module_CSG.bisect) ⇒ <code>object</code>

<a name="module_CSG.color"></a>
### CSG.color([red or css name], [green or alpha], [blue], [alpha]) ⇒ <code>CSG</code>
Set the color of a CSG object using a css color name.  Also accepts the normal `setColor()` values.

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Chainable**  
**Returns**: <code>CSG</code> - Returns a `CSG` object set to the desired color.  

| Param | Type | Description |
| --- | --- | --- |
| [red or css name] | <code>String</code> &#124; <code>Number</code> | Css color name or the red color channel value (0.0 - 1.0) |
| [green or alpha] | <code>Number</code> | green color channel value (0.0 - 1.0) or the alpha channel when used with a css color string |
| [blue] | <code>Number</code> | blue color channel value (0.0 - 1.0) |
| [alpha] | <code>Number</code> | alpha channel value (0.0 - 1.0) |

**Example**  
```js
// creates a red cube
var redcube = CSG.cube({radius: [1, 1, 1]}).color('red');

// creates a blue cube with the alpha channel at 50%
var bluecube =  CSG.cube({radius: [1, 1, 1]}).color('blue', 0.5);

// creates a green cube with the alpha channel at 25%
// this is the same as the standard setColor
var greencube =  CSG.cube({radius: [1, 1, 1]}).color(0, 1, 0, 0.25);
```
<a name="module_CSG.snap"></a>
### CSG.snap(to, axis, orientation) ⇒ <code>CSG</code>
Snap the object to another object.  You can snap to the inside or outside
of an object.  Snapping to the `z`
axis `outside-` will place the object on top of the `to` object.  `sphere.snap(cube, 'z', 'outside-')` is saying that you want the bottom of the `sphere` (`-`) to be placed on the outside of the `z` axis of the `cube`.

![snap example](jsdoc2md/snap.gif)

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Chainable**  
**Returns**: <code>CSG</code> - [description]  

| Param | Type | Description |
| --- | --- | --- |
| to | <code>CSG</code> | object - The object to snap to. |
| axis | <code>string</code> | Which axis to snap on ['x', 'y', 'z'].  You can combine axes, ex: 'xy' |
| orientation | <code>string</code> | Which side to snap to and in what direction (+ or -). ['outside+', 'outside-', 'inside+', 'inside-', 'center+', 'center-'] |

**Example**  
```js
include('lodash.js');
include('jscad-utils.jscad');

// rename mainx to main
function mainx() {
   util.init(CSG);

   var cube = CSG.cube({
       radius: 10
   }).setColor(1, 0, 0);

   var sphere = CSG.sphere({
       radius: 5
   }).setColor(0, 0, 1);

   return cube.union(sphere.snap(cube, 'z', 'outside-'));
}
```
<a name="module_CSG.midlineTo"></a>
### CSG.midlineTo(axis, to) ⇒ <code>CGE</code>
Moves an objects midpoint on an axis a certain distance.  This is very useful when creating parts
from mechanical drawings.
For example, the [RaspberryPi Hat Board Specification](https://github.com/raspberrypi/hats/blob/master/hat-board-mechanical.pdf) has several pieces with the midpoint measured.
![pi hat drawing](jsdoc2md/rpi-hat.png)
To avoid converting the midpoint to the relative position, you can use `midpointTo`.
![midlineTo example](jsdoc2md/midlineto.gif)

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Chainable**  
**Returns**: <code>CGE</code> - A translated CGE object.  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>String</code> | Axis to move the object along. |
| to | <code>Number</code> | The distance to move the midpoint of the object. |

**Example**  
```js
include('lodash.js');
include('utils.jscad');

// rename mainx to main
function mainx() {
   util.init(CSG);

   // create a RPi hat board
   var board = Parts.Board(65, 56.5, 3).color('green');

   // a 40 pin gpio
   var gpio = Parts.Cube([52.2, 5, 8.5])
       .snap(board, 'z', 'outside+')
       .midlineTo('x', 29 + 3.5)
       .midlineTo('y', 49 + 3.5)
       .color('black')

   var camera_flex_slot = Parts.Board(2, 17, 1)
       .midlineTo('x', 45)
       .midlineTo('y', 11.5)
       .color('red');

   // This is more group, due to the outside 1mm          * roundover.
   // Create a board to work from first.  The spec
   // has the edge offset, not the midline listed as          * 19.5mm.
   // Bisect the cutout into two parts.
   var display_flex_cutout = Parts.Board(5, 17, 1)
       .translate([0, 19.5, 0])
       .bisect('x');

   // Bisect the outside (negative) part.
   var edges = display_flex_cutout.parts.negative.bisect('y');

   // Create a cube, and align it with the rounded edges
   // of the edge, subtract the edge from it and move it
   // to the other side of the coutout.
   var round1 = Parts.Cube([2, 2, 2])
       .snap(edges.parts.positive, 'xyz', 'inside-')
       .subtract(edges.parts.positive)
       .translate([0, 17, 0]);

   // Repeat for the opposite corner
   var round2 = Parts.Cube([2, 2, 2])
       .snap(edges.parts.negative, 'yz', 'inside+')
       .snap(edges.parts.negative, 'x', 'inside-')
       .subtract(edges.parts.negative)
       .translate([0, -17, 0]);

   // Create a cube cutout so the outside is square instead of rounded.
   // The `round1` and `round2` parts will be used to subtract off the rounded outside corner.
   var cutout = Parts.Cube(display_flex_cutout.parts.negative.size()).align(display_flex_cutout.parts.negative, 'xyz');

   return board
       .union(gpio)
       .subtract(camera_flex_slot)
       .subtract(union([display_flex_cutout.parts.positive,
           cutout
       ]))
       .subtract(round1)
       .subtract(round2);
}
```
<a name="module_CSG.align"></a>
### CSG.align(to, axis) ↩︎
Align with another object on the selected axis.

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Chainable**  

| Param | Type | Description |
| --- | --- | --- |
| to | <code>CSG</code> | The object to align to. |
| axis | <code>string</code> | A string indicating which axis to align, 'x', 'y', 'z', or any combination including 'xyz'. |

<a name="module_CSG.fit"></a>
### CSG.fit(x, y, z, a) ⇒ <code>CSG</code>
Fit an object inside a bounding box. Often
used to fit text on the face of an object.
 A zero for a size value will leave that axis untouched.
![fit example](jsdoc2md/fit.png)

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Returns**: <code>CSG</code> - The new object fitted inside a bounding box  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> &#124; <code>array</code> | size of x or array of axes |
| y | <code>number</code> &#124; <code>boolean</code> | size of y axis or a boolean too keep the aspect ratio if `x` is an array |
| z | <code>number</code> | size of z axis |
| a | <code>boolean</code> | Keep objects aspect ratio |

**Example**  
```js
include('lodash.js');
include('utils.jscad');

// rename mainx to main
function mainx() {
   util.init(CSG);

   var cube = CSG.cube({
       radius: 10
   }).color('orange');

   // create a label, place it on top of the cube
   // and center it on the top face
   var label = util.label('hello')
       .snap(cube, 'z', 'outside-')
       .align(cube, 'xy');

   var s = cube.size();
   // fit the label to the cube (minus 2mm) while
   // keeping the aspect ratio of the text
   // and return the union
   return cube.union(label.fit([s.x - 2, s.y - 2, 0], true).color('blue'));
}
```
<a name="module_CSG.size"></a>
### CSG.size() ⇒ <code>CSG.Vector3D</code>
Returns the size of the object in a `Vector3D` object.

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Returns**: <code>CSG.Vector3D</code> - A `CSG.Vector3D` with the size of the object.  
**Example**  
```js
var cube = CSG.cube({
    radius: 10
}).setColor(1, 0, 0);

var size = cube.size()

// size = {"x":20,"y":20,"z":20}
```
<a name="module_CSG.centroid"></a>
### CSG.centroid() ⇒ <code>CSG.Vector3D</code>
Returns the centroid of the current objects bounding box.

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Returns**: <code>CSG.Vector3D</code> - A `CSG.Vector3D` with the center of the object bounds.  
<a name="module_CSG.fillet"></a>
### CSG.fillet(radius, orientation, options) ⇒ <code>CSG</code>
Add a fillet or roundover to an object.
![fillet example](jsdoc2md/fillet.png)

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Chainable**  
**Returns**: <code>CSG</code> - [description]  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>number</code> | Radius of fillet.  Positive and negative radius will create a fillet or a roundover. |
| orientation | <code>string</code> | Axis and end (positive or negative) to place the chamfer.  Currently on the `z` axis is supported. |
| options | <code>object</code> | additional options. |

**Example**  
```js
include('lodash.js');
include('utils.jscad');

// rename mainx to main
function mainx() {
util.init(CSG);

var cube = Parts.Cube([10, 10, 10]);

return cube
  .fillet(2, 'z+') // roundover on top (positive fillet)
  .fillet(-2, 'z-') // fillet on  the bottom (negative fillet)
  .color('orange');
}
```
<a name="module_CSG.chamfer"></a>
### CSG.chamfer(radius, orientation) ⇒ <code>CSG</code>
Add a chamfer to an object.  This modifies the object by removing part of the object and reducing its size over the radius of the chamfer.
![chamfer example](jsdoc2md/chamfer.png)

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Chainable**  
**Returns**: <code>CSG</code> - [description]  

| Param | Type | Description |
| --- | --- | --- |
| radius | <code>number</code> | Radius of the chamfer |
| orientation | <code>string</code> | Axis and end (positive or negative) to place the chamfer.  Currently on the `z` axis is supported. |

**Example**  
```js
include('lodash.js');
include('jscad-utils.jscad');

// rename mainx to main
function mainx() {
util.init(CSG);

var cube = CSG.cube({
    radius: 10
});

return cube.chamfer(2, 'z+').color('orange');
}
```
<a name="module_CSG.bisect"></a>
### CSG.bisect(axis, offset) ⇒ <code>object</code>
Cuts an object into two parts.  You can modify the offset, otherwise two equal parts are created.  The `group` part returned has a `positive` and `negative` half, cut along the desired axis.
![bisect example](jsdoc2md/bisect.png)

**Kind**: static method of <code>[CSG](#module_CSG)</code>  
**Extends:** <code>CSG</code>  
**Returns**: <code>object</code> - A group group object with a parts dictionary and a `combine()` method.  

| Param | Type | Description |
| --- | --- | --- |
| axis | <code>string</code> | Axis to cut the object |
| offset | <code>number</code> | Offset to cut the object.  Defaults to the middle of the object |


### util
jscad-utils


* [util](#module_util) : <code>Object</code>
    * [.print(msg, o)](#module_util.print)
    * [.size(o)](#module_util.size) ⇒ <code>CSG.Vector3D</code>
    * [.scale(size, value)](#module_util.scale) ⇒ <code>number</code>
    * [.enlarge(object, x, y, z)](#module_util.enlarge) ⇒ <code>CSG</code>
    * [.fit(object, x, y, z, keep_aspect_ratio)](#module_util.fit) ⇒ <code>CSG</code>
    * [.flush(moveobj, withobj, axis, mside, wside)](#module_util.flush) ⇒ <code>CSG</code>
    * [.group(names, objects)](#module_util.group) ⇒ <code>object</code>
    * [.bisect(object, axis, offset)](#module_util.bisect) ⇒ <code>object</code>
    * [.init(CSG)](#module_util.init) ⇐ <code>CSG</code>

<a name="module_util.print"></a>
### util.print(msg, o)
Print a message and CSG object bounds and size to the conosle.

**Kind**: static method of <code>[util](#module_util)</code>  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to print |
| o | <code>CSG</code> | A CSG object to print the bounds and size of. |

<a name="module_util.size"></a>
### util.size(o) ⇒ <code>CSG.Vector3D</code>
Returns a `Vector3D` with the size of the object.

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>CSG.Vector3D</code> - Vector3d with the size of the object  

| Param | Type | Description |
| --- | --- | --- |
| o | <code>CSG</code> | A `CSG` like object or an array of `CSG.Vector3D` objects (the result of getBounds()). |

<a name="module_util.scale"></a>
### util.scale(size, value) ⇒ <code>number</code>
Returns a scale factor (0.0-1.0) for an object
that will resize it by a value in size units instead
of percentages.

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>number</code> - Scale factor  

| Param | Type | Description |
| --- | --- | --- |
| size | <code>number</code> | Object size |
| value | <code>number</code> | Amount to add (negative values subtract) from the size of the object. |

<a name="module_util.enlarge"></a>
### util.enlarge(object, x, y, z) ⇒ <code>CSG</code>
Enlarge an object by scale units, while keeping the same
centroid.  For example util.enlarge(o, 1, 1, 1) enlarges
object o by 1mm in each access, while the centroid stays the same.

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>CSG</code> - [description]  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>CSG</code> | [description] |
| x | <code>number</code> | [description] |
| y | <code>number</code> | [description] |
| z | <code>number</code> | [description] |

<a name="module_util.fit"></a>
### util.fit(object, x, y, z, keep_aspect_ratio) ⇒ <code>CSG</code>
Fit an object inside a bounding box.  Often used
with text labels.

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>CSG</code> - [description]  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>CSG</code> | [description] |
| x | <code>number</code> &#124; <code>array</code> | [description] |
| y | <code>number</code> | [description] |
| z | <code>number</code> | [description] |
| keep_aspect_ratio | <code>boolean</code> | [description] |

<a name="module_util.flush"></a>
### util.flush(moveobj, withobj, axis, mside, wside) ⇒ <code>CSG</code>
Moves an object flush with another object

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>CSG</code> - [description]  

| Param | Type | Description |
| --- | --- | --- |
| moveobj | <code>CSG</code> | Object to move |
| withobj | <code>CSG</code> | Object to make flush with |
| axis | <code>String</code> | Which axis: 'x', 'y', 'z' |
| mside | <code>Number</code> | 0 or 1 |
| wside | <code>Number</code> | 0 or 1 |

<a name="module_util.group"></a>
### util.group(names, objects) ⇒ <code>object</code>
Creates a `group` object given a comma separated
list of names, and an array or object.  If an object
is given, then the names list is used as the default
parts used when the `combine()` function is called.

You can call the `combine()` function with a list of parts you want combined into one.

The `map()` funciton allows you to modify each part
contained in the group object.

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>object</code> - An object that has a parts dictionary, a `combine()` and `map()` function.  

| Param | Type | Description |
| --- | --- | --- |
| names | <code>string</code> | Comma separated list of part names. |
| objects | <code>array</code> &#124; <code>object</code> | Array or object of parts.  If Array, the names list is used as names for each part. |

<a name="module_util.bisect"></a>
### util.bisect(object, axis, offset) ⇒ <code>object</code>
Cut an object into two pieces, along a given axis.
![bisect example](jsdoc2md/bisect.png)

**Kind**: static method of <code>[util](#module_util)</code>  
**Returns**: <code>object</code> - Returns a group object with a parts object.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>CSG</code> | object to bisect |
| axis | <code>string</code> | axis to cut along |
| offset | <code>number</code> | offset to cut at |

<a name="module_util.init"></a>
### util.init(CSG) ⇐ <code>CSG</code>
Initialize `jscad-utils` and add utilities to the `CSG` object.

**Kind**: static method of <code>[util](#module_util)</code>  
**Extends:** <code>CSG</code>  

| Param | Type | Description |
| --- | --- | --- |
| CSG | <code>CSG</code> | The global `CSG` object |


### Colors
Color utilities for jscad.  Makes setting colors easier using css color names.  Using `.init()` adds a `.color()` function to the CSG object.
> You must use `Colors.init(CSG)` in the `main()` function.  The `CSG` class is not available before this.

**Example**  
```js
include('jscad-utils-color.jscad');

function mainx(params) {
  Colors.init(CSG);

  // draws a purple cube
  return CSG.cube({radius: [10, 10, 10]}).color('purple');
}
```
<a name="module_jscad-utils-color.init"></a>
### jscad-utils-color.init(CSG) ⇐ <code>CSG</code>
Initialize the Color utility.  This adds a `.color()` prototype to the `CSG` object.

**Kind**: static method of <code>[jscad-utils-color](#module_jscad-utils-color)</code>  
**Extends:** <code>CSG</code>  

| Param | Type | Description |
| --- | --- | --- |
| CSG | <code>CSG</code> | The global `CSG` object |


&copy; 2016 John Cole <johnwebbcole@gmail.com>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
