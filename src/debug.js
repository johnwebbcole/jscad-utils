const debugColors = [
  '#e41a1c',
  '#377eb8',
  '#4daf4a',
  '#984ea3',
  '#ff7f00',
  '#ffff33',
  '#a65628',
  '#f781bf',
  '#999999'
];

var debugCount = 0;

/**
 * Creates a function that uses `console.log` with a styled name.  The name
 * is checked against the `jscadUtilsDebug` settings `enabled` and `disabled` list.
 *
 * If the name is enabled, a function that uses `console.log` is returned, if it is
 * disabled, an empty function is returned.
 *
 * You can enable a debug logger in the `util.init` method by including a string of
 * comma separated names.  Wild cards with `*` are supported, and you can disable a
 * specific name using a `-` sign in front of the name.
 *
 * @example
 * util.init(CSG, { debug: 'jscadUtils:group' });
 *
 * @function Debug
 * @param  {String} name The name of the debug funciton.
 * @return {Function} A debug function if enabled otherwise an empty function.
 */
export const Debug = function(name) {
  var style = `color:${debugColors[debugCount++ % debugColors.length]}`;
  var checks = jscadUtilsDebug || { enabled: [], disabled: [] };
  var enabled =
    checks.enabled.some(function checkEnabled(check) {
      return check.test(name);
    }) &&
    !checks.disabled.some(function checkEnabled(check) {
      return check.test(name);
    });

  return enabled
    ? (...msg) => {
      console.log('%c%s', style, name, ...msg);
    }
    : () => undefined;
};
