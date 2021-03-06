/** @module triangle */

/**
 * Convert degrees to radians.
 * @param  {Number} deg value in degrees
 * @return {Number}     value in radians
 */
export const toRadians = function toRadians(deg) {
  return (deg / 180) * Math.PI;
};

/**
 * Convert radians to degrees.
 * @param  {Number} rad value in radians
 * @return {Number}     value in degrees
 */
export const toDegrees = function toDegrees(rad) {
  return rad * (180 / Math.PI);
};

/**
 * Solve a 90 degree triangle from two points.
 * @param  {Number} p1.x Point 1 x coordinate
 * @param  {Number} p1.y Point 1 y coordinate
 * @param  {Number} p2.x Point 2 x coordinate
 * @param  {Number} p2.y Point 2 y coordinate
 * @return {Object}    A triangle object {A,B,C,a,b,c}
 */
export const solve = function (p1, p2) {
  var r = {
    c: 90,
    A: Math.abs(p2.x - p1.x),
    B: Math.abs(p2.y - p1.y)
  };
  var brad = Math.atan2(r.B, r.A);
  r.b = this.toDegrees(brad);
  // r.C = Math.sqrt(Math.pow(r.B, 2) + Math.pow(r.A, 2));
  r.C = r.B / Math.sin(brad);
  r.a = 90 - r.b;

  return r;
};

/**
 * Solve a partial triangle object. Angles are in degrees.
 * Angle `C` is set to 90 degrees. Requires a Side and an
 * Angle.
 *
 *       /\
 *      / B\
 *   c /    \  a
 *    /      \
 *   /A      C\
 *  /----------\
 *        b
 *
 *           /|
 *          /B|
 *         /  |
 *       c/   |a
 *       /A  C|
 *      /_____|
 *         b
 *
 * @param  {Number} r.a Length of side `a`
 * @param  {Number} r.A Angle `A` in degrees
 * @param  {Number} r.b Length of side `b`
 * @param  {Number} r.B Angle `B` in degrees
 * @param  {Number} r.c Length of side `c`
 * @return {Object}   A solved triangle object {A,B,C,a,b,c}
 */
export const solve90SA = function (r) {
  r = Object.assign(r, {
    C: 90
  });

  r.A = r.A || 90 - r.B;
  r.B = r.B || 90 - r.A;

  var arad = toRadians(r.A);

  // sinA = a/c
  // a = c * sinA
  // tanA = a/b
  // a = b * tanA
  r.a = r.a || (r.c ? r.c * Math.sin(arad) : r.b * Math.tan(arad));

  // sinA = a/c
  r.c = r.c || r.a / Math.sin(arad);

  // tanA = a/b
  r.b = r.b || r.a / Math.tan(arad);

  return r;
};

export const solve90ac = function (r) {
  r = Object.assign(r, { C: 90 });

  // sinA = a/c
  // a = arcsin(a/c)
  var arad = Math.asin(r.a / r.c);

  r.A = toDegrees(arad);
  r.B = 90 - r.A;

  // tanA = a/b
  //   r.b = r.a / Math.tan(arad);
  // or
  // a*a + b*b = c*c
  // b*b = c*c - a*a
  // b = sqr(c*c - a*a)
  r.b = Math.sqrt(Math.pow(r.c, 2) - Math.pow(r.a, 2));
  return r;
};

/**
 * @function solveab
 * Solve a partial right triangle object from two sides (a and b). Angles are in degrees.
 * Angle `C` is set to 90 degrees. Requires a Side and an
 * Angle.
 *
 *           /|
 *          /B|
 *         /  |
 *       c/   |a
 *       /A  C|
 *      /_____|
 *         b
 *
 * @param  {Number} r.a Length of side `a`
 * @param  {Number} r.b Length of side `b`
 * @return {Object}   A solved triangle object {A,B,C,a,b,c}
 */
export function solveab(r) {
  r = Object.assign(r, { C: 90 });

  // c = sqr(a*a + b*b)
  r.c = Math.sqrt(Math.pow(r.a, 2) + Math.pow(r.b, 2));

  // A = arcsin(a/c)
  r.A = toDegrees(Math.asin(r.a / r.c));

  // B = arcsin(b/c);
  r.B = toDegrees(Math.asin(r.b / r.c));

  return r;
}
