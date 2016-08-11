Parts = {
    Cube: function (width) {
        var r = util.divA(width, 2);
        return CSG.cube({
                center: r,
                radius: r
            })
            .setColor(0.25, 0.25, 0.25, 0.5);
    },

    Cylinder: function (diameter, height, options) {
        options = _.defaults(options, {
            start: [0, 0, 0],
            end: [0, 0, height],
            radius: diameter / 2
        });
        return CSG.cylinder(options);
    },

    Cone: function (diameter1, diameter2, height, options) {
        options = options || {};
        var h = height / 2;
        return CSG.cylinder({
            start: [0, 0, -h],
            end: [0, 0, h],
            radiusStart: diameter1 / 2,
            radiusEnd: diameter2 / 2,
            resolution: options.resolution
        });
    },

    /**
     * Crate a hexagon.
     * @param {number} diameter Outside diameter of the hexagon
     * @param {number} height   height of the hexagon
     */
    Hexagon: function (diameter, height) {
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
    },

    Triangle: function (base, height) {
        var radius = base / 2;
        var tri = CAG.fromPoints([
            [-radius, 0],
            [radius, 0],
            [0, Math.sin(30) * radius]
        ]);

        return tri.extrude({
            offset: [0, 0, height]
        });
    },

    Tube: function Tube(outsideDiameter, insideDiameter, height, outsideOptions, insideOptions) {
        return Parts.Cylinder(outsideDiameter, height, outsideOptions).subtract(Parts.Cylinder(insideDiameter, height, insideOptions || outsideOptions));
    },

    Board: function (width, height, corner_radius, thickness) {
        var r = util.divA([width, height], 2);
        var board = CAG.roundedRectangle({
            center: [r[0], r[1], 0],
            radius: r,
            roundradius: corner_radius
        }).extrude({
            offset: [0, 0, thickness || 1.62]
        }).setColor(0.5, 0.5, 0.5, 0.25);

        return board;
    },

    Hardware: {
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

        /**
         * Creates a `Group` object with a Pan Head Screw.
         * @param {number} headDiameter Diameter of the head of the screw
         * @param {number} headLength   Length of the head
         * @param {number} diameter     Diameter of the threaded shaft
         * @param {number} length       Length of the threaded shaft
         * @param {number} clearLength  Length of the clearance section of the head.
         * @param {object} options      Screw options include orientation and clerance scale.
         */
        PanHeadScrew: function (headDiameter, headLength, diameter, length, clearLength, options) {
            options = _.defaults(options, {
                orientation: 'up',
                clearance: [0, 0, 0]
            });
            var orientation = Parts.Hardware.Orientation[options.orientation];

            var head = Parts.Cylinder(headDiameter, headLength).color('gray');
            var thread = Parts.Cylinder(diameter, length).snap(head, 'z', orientation.head).color('silver');
            var group = util.group('head,thread', [head, thread]);
            if (clearLength) {
                var headClearSpace = Parts.Cylinder(headDiameter, clearLength).enlarge(options.clearance).snap(head, 'z', orientation.clear).color('red');
                group.add(headClearSpace, 'headClearSpace', true);
            }
            return group;
        }
    }
};
