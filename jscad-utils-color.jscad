/**
 * Color utilities for jscad.  Makes setting colors easier using css color names.  Using `.init()` adds a `.color()` function to the CSG object.
 * > You must use `Colors.init(CSG)` in the `main()` function.  The `CSG` class is not available before this.
 * @example
 *include('jscad-utils-color.jscad');
 *
 *function mainx(params) {
 *   Colors.init(CSG);
 *
 *   // draws a purple cube
 *   return CSG.cube({radius: [10, 10, 10]}).color('purple');
 *}
 * @type {Object}
 * @module jscad-utils-color
 */
Colors = {

    nameArray: {
        'aliceblue': '#f0f8ff',
        'antiquewhite': '#faebd7',
        'aqua': '#00ffff',
        'aquamarine': '#7fffd4',
        'azure': '#f0ffff',
        'beige': '#f5f5dc',
        'bisque': '#ffe4c4',
        'black': '#000000',
        'blanchedalmond': '#ffebcd',
        'blue': '#0000ff',
        'blueviolet': '#8a2be2',
        'brown': '#a52a2a',
        'burlywood': '#deb887',
        'cadetblue': '#5f9ea0',
        'chartreuse': '#7fff00',
        'chocolate': '#d2691e',
        'coral': '#ff7f50',
        'cornflowerblue': '#6495ed',
        'cornsilk': '#fff8dc',
        'crimson': '#dc143c',
        'cyan': '#00ffff',
        'darkblue': '#00008b',
        'darkcyan': '#008b8b',
        'darkgoldenrod': '#b8860b',
        'darkgray': '#a9a9a9',
        'darkgrey': '#a9a9a9',
        'darkgreen': '#006400',
        'darkkhaki': '#bdb76b',
        'darkmagenta': '#8b008b',
        'darkolivegreen': '#556b2f',
        'darkorange': '#ff8c00',
        'darkorchid': '#9932cc',
        'darkred': '#8b0000',
        'darksalmon': '#e9967a',
        'darkseagreen': '#8fbc8f',
        'darkslateblue': '#483d8b',
        'darkslategray': '#2f4f4f',
        'darkslategrey': '#2f4f4f',
        'darkturquoise': '#00ced1',
        'darkviolet': '#9400d3',
        'deeppink': '#ff1493',
        'deepskyblue': '#00bfff',
        'dimgray': '#696969',
        'dimgrey': '#696969',
        'dodgerblue': '#1e90ff',
        'firebrick': '#b22222',
        'floralwhite': '#fffaf0',
        'forestgreen': '#228b22',
        'fuchsia': '#ff00ff',
        'gainsboro': '#dcdcdc',
        'ghostwhite': '#f8f8ff',
        'gold': '#ffd700',
        'goldenrod': '#daa520',
        'gray': '#808080',
        'grey': '#808080',
        'green': '#008000',
        'greenyellow': '#adff2f',
        'honeydew': '#f0fff0',
        'hotpink': '#ff69b4',
        'indianred': '#cd5c5c',
        'indigo': '#4b0082',
        'ivory': '#fffff0',
        'khaki': '#f0e68c',
        'lavender': '#e6e6fa',
        'lavenderblush': '#fff0f5',
        'lawngreen': '#7cfc00',
        'lemonchiffon': '#fffacd',
        'lightblue': '#add8e6',
        'lightcoral': '#f08080',
        'lightcyan': '#e0ffff',
        'lightgoldenrodyellow': '#fafad2',
        'lightgray': '#d3d3d3',
        'lightgrey': '#d3d3d3',
        'lightgreen': '#90ee90',
        'lightpink': '#ffb6c1',
        'lightsalmon': '#ffa07a',
        'lightseagreen': '#20b2aa',
        'lightskyblue': '#87cefa',
        'lightslategray': '#778899',
        'lightslategrey': '#778899',
        'lightsteelblue': '#b0c4de',
        'lightyellow': '#ffffe0',
        'lime': '#00ff00',
        'limegreen': '#32cd32',
        'linen': '#faf0e6',
        'magenta': '#ff00ff',
        'maroon': '#800000',
        'mediumaquamarine': '#66cdaa',
        'mediumblue': '#0000cd',
        'mediumorchid': '#ba55d3',
        'mediumpurple': '#9370d8',
        'mediumseagreen': '#3cb371',
        'mediumslateblue': '#7b68ee',
        'mediumspringgreen': '#00fa9a',
        'mediumturquoise': '#48d1cc',
        'mediumvioletred': '#c71585',
        'midnightblue': '#191970',
        'mintcream': '#f5fffa',
        'mistyrose': '#ffe4e1',
        'moccasin': '#ffe4b5',
        'navajowhite': '#ffdead',
        'navy': '#000080',
        'oldlace': '#fdf5e6',
        'olive': '#808000',
        'olivedrab': '#6b8e23',
        'orange': '#ffa500',
        'orangered': '#ff4500',
        'orchid': '#da70d6',
        'palegoldenrod': '#eee8aa',
        'palegreen': '#98fb98',
        'paleturquoise': '#afeeee',
        'palevioletred': '#d87093',
        'papayawhip': '#ffefd5',
        'peachpuff': '#ffdab9',
        'peru': '#cd853f',
        'pink': '#ffc0cb',
        'plum': '#dda0dd',
        'powderblue': '#b0e0e6',
        'purple': '#800080',
        'red': '#ff0000',
        'rosybrown': '#bc8f8f',
        'royalblue': '#4169e1',
        'saddlebrown': '#8b4513',
        'salmon': '#fa8072',
        'sandybrown': '#f4a460',
        'seagreen': '#2e8b57',
        'seashell': '#fff5ee',
        'sienna': '#a0522d',
        'silver': '#c0c0c0',
        'skyblue': '#87ceeb',
        'slateblue': '#6a5acd',
        'slategray': '#708090',
        'slategrey': '#708090',
        'snow': '#fffafa',
        'springgreen': '#00ff7f',
        'steelblue': '#4682b4',
        'tan': '#d2b48c',
        'teal': '#008080',
        'thistle': '#d8bfd8',
        'tomato': '#ff6347',
        'turquoise': '#40e0d0',
        'violet': '#ee82ee',
        'wheat': '#f5deb3',
        'white': '#ffffff',
        'whitesmoke': '#f5f5f5',
        'yellow': '#ffff00',
        'yellowgreen': '#9acd32'
    },

    name2hex: function (n) {
        n = n.toLowerCase();
        if (!Colors.nameArray[n]) return 'Invalid Color Name';
        return Colors.nameArray[n];
    },

    hex2rgb: function (h) {
        h = h.replace(/^\#/, '');

        if (h.length === 6) {
            return [
                parseInt(h.substr(0, 2), 16),
                parseInt(h.substr(2, 2), 16),
                parseInt(h.substr(4, 2), 16)
            ];
        }
    },

    _name2rgb: {},

    name2rgb: function (n) {
        if (!Colors._name2rgb[n]) Colors._name2rgb[n] = this.hex2rgb(this.name2hex(n));
        return Colors._name2rgb[n];
    },

    color: function (o, r, g, b, a) {
        if (typeof (r) !== 'string') return this.setColor(r, g, b, a);
        if (r === '') return o; // shortcut for no color
        var c = Colors.name2rgb(r).map(function (x) {
            return x / 255;
        });
        c[3] = g || 1.0;
        return o.setColor(c);
    },

    /**
     * Initialize the Color utility.  This adds a `.color()` prototype to the `CSG` object.
     * @param  {CSG} CSG The global `CSG` object
     * @memberof module:jscad-utils-color
     * @augments CSG
     */
    init: function init(CSG) {
        var _setColor = CSG.setColor; // eslint-disable-line no-unused-vars

        /**
         * Set the color of a CSG object using a css color name.  Also accepts the normal `setColor()` values.
         * @example
         * // creates a red cube
         * var redcube = CSG.cube({radius: [1, 1, 1]}).color('red');
         *
         * // creates a blue cube with the alpha channel at 50%
         * var bluecube =  CSG.cube({radius: [1, 1, 1]}).color('blue', 0.5);
         *
         * // creates a green cube with the alpha channel at 25%
         * // this is the same as the standard setColor
         * var greencube =  CSG.cube({radius: [1, 1, 1]}).color(0, 1, 0, 0.25);
         * @param  {(String | Number)} [red or css name] - Css color name or the red color channel value (0.0 - 1.0)
         * @param  {Number} [green or alpha] - green color channel value (0.0 - 1.0) or the alpha channel when used with a css color string
         * @param  {Number} [blue] - blue color channel value (0.0 - 1.0)
         * @param  {Number} [alpha] - alpha channel value (0.0 - 1.0)
         * @return {CSG}   Returns a `CSG` object set to the desired color.
         * @memberof module:CSG
         * @alias color
         * @chainable
         * @augments CSG
         */
        CSG.prototype.color = function (r, g, b, a) {
            if (!r) return this; // shortcut empty color values to do nothing.
            return Colors.color(this, r, g, b, a);
        };

    }
};
