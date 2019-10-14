/**
 * A set of array utilities.
 * @module array
 */

/**
 * Divides all elements in th array by `f`
 * @function div
 * @param {Array} a
 * @param {Number} f
 * @memberof! array
 */
export const div = function(a, f) {
  return a.map(function(e) {
    return e / f;
  });
};

/**
 * Adds a value to each element of an array of numbers.
 * @function addValue
 * @param  {Array} a Array of numbers.
 * @param  {Number} f A value to add to each element of the original array.
 * @return {Array} A new array with the values added together.
 */
export const addValue = function(a, f) {
  return a.map(function(e) {
    return e + f;
  });
};

/**
 * Adds two arrays together.  The shorter array must be the first argument.
 *
 * @function addArray
 * @param  {Array} a An array of numbers.
 * @param  {Array} f Another array of numbers, if
 * @return {Array} A new array with the two values added together.
 */
export const addArray = function(a, f) {
  return a.map(function(e, i) {
    return e + f[i];
  });
};

/**
 * Adds a value or array to another array.
 * @function add
 * @param  {Array} a An array of numbers .
 * @return {Array} A new array with the two values added together.
 */
export const add = function(a) {
  return Array.prototype.slice.call(arguments, 1).reduce(function(result, arg) {
    if (Array.isArray(arg)) {
      result = addArray(result, arg);
    } else {
      result = addValue(result, arg);
    }
    return result;
  }, a);
};

/**
 * Converts an object with x, y, and z properties into
 * an array, or an array if passed an array.
 * @function fromxyz
 * @param {Object|Array} object
 */
export const fromxyz = function(object) {
  return Array.isArray(object) ? object : [object.x, object.y, object.z];
};

export const toxyz = function(a) {
  return {
    x: a[0],
    y: a[1],
    z: a[2]
  };
};

/**
 * Returns the first value of an array.
 * @function first
 * @param  {Array} a An array of numbers.
 * @return {Number} The value of the first element of the array or undefined.
 */
export const first = function(a) {
  return a ? a[0] : undefined;
};

/**
 * @function last
 * @param  {Array} a An array of numbers.
 * @return {Number} The value of the last element of the array or undefined.
 */
export const last = function(a) {
  return a && a.length > 0 ? a[a.length - 1] : undefined;
};

/**
 * Finds the minimum value of an array.
 * @function min
 * @param  {Array} a An array of numbers.
 * @return {Number} The minimum value in an array of numbers.
 */
export const min = function(a) {
  return a.reduce(function(result, value) {
    return value < result ? value : result;
  }, Number.MAX_VALUE);
};

/**
 * Creates a array of numbers given the start and end points.
 * @function range
 * @param  {Number} a The starting value.
 * @param  {Number} b The ending value.
 * @return {Array} An array of values from `a` to `b`.
 */
export const range = function(a, b) {
  var result = [];
  for (var i = a; i < b; i++) {
    result.push(i);
  }

  return result;
};
