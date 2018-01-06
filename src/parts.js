import { CSG } from '@jscad/csg';
import { fromxyz, div } from './array';
const scadApi = require('@jscad/scad-api');
const { cube, sphere, cylinder } = scadApi.primitives3d;

export default { BBox, Cube, RoundedCube };

export function BBox(...objects) {
    var box = object =>
        CSG.cube({
            center: object.centroid(),
            radius: object.size().dividedBy(2)
        });
    return objects.reduce(function(bbox, part) {
        var object = bbox ? union([bbox, box(part)]) : part;
        return box(object);
    });
}

export function Cube(width) {
    var r = div(fromxyz(width), 2);
    return CSG.cube({
        center: r,
        radius: r
    });
}

export function RoundedCube(...args) {
    if (args[0].getBounds) {
        var size = util.size(args[0].getBounds());
        var r = [size.x / 2, size.y / 2];
        var thickness = size.z;
        var corner_radius = args[1];
    } else {
        var r = [args[0] / 2, args[1] / 2]; // eslint-disable-line no-redeclare
        var thickness = args[2]; // eslint-disable-line no-redeclare
        var corner_radius = args[3]; // eslint-disable-line no-redeclare
    }

    // console.log('RoundedCube.args', size, r, thickness, corner_radius);
    var roundedcube = CAG.roundedRectangle({
        center: [r[0], r[1], 0],
        radius: r,
        roundradius: corner_radius
    }).extrude({
        offset: [0, 0, thickness || 1.62]
    });

    return roundedcube;
}

/**
 * [Cylinder description]
 * @param {Number} diameter Diameter of the cylinder
 * @param {Number} height   Height of the cylinder
 * @param {Number} options  Options passed to the `CSG.cylinder` function.
 * @return {CSG} A CSG Cylinder
 */
export function Cylinder(diameter, height, options) {
    options = util.defaults(options, {
        start: [0, 0, 0],
        end: [0, 0, height],
        radius: diameter / 2
    });
    return CSG.cylinder(options);
}

export function Cone(diameter1, diameter2, height) {
    return CSG.cylinder({
        start: [0, 0, 0],
        end: [0, 0, height],
        radiusStart: diameter1 / 2,
        radiusEnd: diameter2 / 2
    });
}

/**
 * Crate a hexagon.
 * @param {number} diameter Outside diameter of the hexagon
 * @param {number} height   height of the hexagon
 */
export function Hexagon(diameter, height) {
    var radius = diameter / 2;
    var sqrt3 = Math.sqrt(3) / 2;
    var hex = CAG.fromPoints([
        [radius, 0],
        [radius / 2, radius * sqrt3],
        [-radius / 2, radius * sqrt3],
        [-radius, 0],
        [-radius / 2, -radius * sqrt3],
        [radius / 2, -radius * sqrt3]
    ]);

    return hex.extrude({
        offset: [0, 0, height]
    });
}

export function Triangle(base, height) {
    var radius = base / 2;
    var tri = CAG.fromPoints([
        [-radius, 0],
        [radius, 0],
        [0, Math.sin(30) * radius]
    ]);

    return tri.extrude({
        offset: [0, 0, height]
    });
}

/**
 * Create a tube
 * @param {Number} outsideDiameter Outside diameter of the tube
 * @param {Number} insideDiameter  Inside diameter of the tube
 * @param {Number} height          Height of the tube
 * @param {Object} outsideOptions  Options passed to the outside cylinder
 * @param {Object} insideOptions   Options passed to the inside cylinder
 * @returns {CSG}  A CSG Tube
 */
export function Tube(
    outsideDiameter,
    insideDiameter,
    height,
    outsideOptions,
    insideOptions
) {
    return Parts.Cylinder(outsideDiameter, height, outsideOptions).subtract(
        Parts.Cylinder(insideDiameter, height, insideOptions || outsideOptions)
    );
}

export function Board(width, height, corner_radius, thickness) {
    var r = util.divA([width, height], 2);
    var board = CAG.roundedRectangle({
        center: [r[0], r[1], 0],
        radius: r,
        roundradius: corner_radius
    }).extrude({
        offset: [0, 0, thickness || 1.62]
    });

    return board;
}

export const Hardware = {
    Orientation: {
        up: {
            head: 'outside-',
            clear: 'inside+'
        },
        down: {
            head: 'outside+',
            clear: 'inside-'
        }
    },

    Screw: function(head, thread, headClearSpace, options) {
        options = util.defaults(options, {
            orientation: 'up',
            clearance: [0, 0, 0]
        });

        var orientation = Parts.Hardware.Orientation[options.orientation];
        var group = util.group('head,thread', {
            head: head.color('gray'),
            thread: thread.snap(head, 'z', orientation.head).color('silver')
        });

        if (headClearSpace) {
            group.add(
                headClearSpace
                    .enlarge(options.clearance)
                    .snap(head, 'z', orientation.clear)
                    .color('red'),
                'headClearSpace',
                true
            );
        }

        return group;
    },

    /**
     * Creates a `Group` object with a Pan Head Screw.
     * @param {number} headDiameter Diameter of the head of the screw
     * @param {number} headLength   Length of the head
     * @param {number} diameter     Diameter of the threaded shaft
     * @param {number} length       Length of the threaded shaft
     * @param {number} clearLength  Length of the clearance section of the head.
     * @param {object} options      Screw options include orientation and clerance scale.
     */
    PanHeadScrew: function(
        headDiameter,
        headLength,
        diameter,
        length,
        clearLength,
        options
    ) {
        var head = Parts.Cylinder(headDiameter, headLength);
        var thread = Parts.Cylinder(diameter, length);

        if (clearLength) {
            var headClearSpace = Parts.Cylinder(headDiameter, clearLength);
        }

        return Parts.Hardware.Screw(head, thread, headClearSpace, options);
    },

    /**
     * Creates a `Group` object with a Hex Head Screw.
     * @param {number} headDiameter Diameter of the head of the screw
     * @param {number} headLength   Length of the head
     * @param {number} diameter     Diameter of the threaded shaft
     * @param {number} length       Length of the threaded shaft
     * @param {number} clearLength  Length of the clearance section of the head.
     * @param {object} options      Screw options include orientation and clerance scale.
     */
    HexHeadScrew: function(
        headDiameter,
        headLength,
        diameter,
        length,
        clearLength,
        options
    ) {
        var head = Parts.Hexagon(headDiameter, headLength);
        var thread = Parts.Cylinder(diameter, length);

        if (clearLength) {
            var headClearSpace = Parts.Hexagon(headDiameter, clearLength);
        }

        return Parts.Hardware.Screw(head, thread, headClearSpace, options);
    },

    /**
     * Create a Flat Head Screw
     * @param {number} headDiameter head diameter
     * @param {number} headLength   head length
     * @param {number} diameter     thread diameter
     * @param {number} length       thread length
     * @param {number} clearLength  clearance length
     * @param {object} options      options
     */
    FlatHeadScrew: function(
        headDiameter,
        headLength,
        diameter,
        length,
        clearLength,
        options
    ) {
        var head = Parts.Cone(headDiameter, diameter, headLength);
        // var head = Parts.Cylinder(headDiameter, headLength);
        var thread = Parts.Cylinder(diameter, length);

        if (clearLength) {
            var headClearSpace = Parts.Cylinder(headDiameter, clearLength);
        }

        return Parts.Hardware.Screw(head, thread, headClearSpace, options);
    }
};
