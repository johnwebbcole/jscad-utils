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
    * [.align(to, axis)](#module_CSG.align) ↩︎
    * [.size()](#module_CSG.size) ⇒ <code>CSG.Vector3D</code>

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

### util
jscad-utils


* [util](#module_util) : <code>Object</code>
    * [.print(msg, o)](#module_util.print)
    * [.size(o)](#module_util.size) ⇒ <code>CSG.Vector3D</code>
    * [.scale(size, value)](#module_util.scale) ⇒ <code>number</code>
    * [.enlarge(object, x, y, z)](#module_util.enlarge) ⇒ <code>CSG</code>
    * [.flush(moveobj, withobj, axis, mside, wside)](#module_util.flush) ⇒ <code>CSG</code>
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
