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
        var h = height / 2;

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

    Triangle: function (base, height, thickness) {
        var radius = base / 2;
        var tri = CAG.fromPoints([
            [-radius, 0],
            [radius, 0],
            [0, Math.sin(30) * radius],
        ]);

        return tri.extrude({
            offset: [0, 0, height]
        });
    },

    Tube: function Tube(outsideDiameter, insideDiameter, height, outsideOptions, insideOptions) {
        return Parts.Cylinder(outsideDiameter, height, outsideOptions).subtract(Parts.Cylinder(insideDiameter, height, insideOptions || outsideOptions));
    }
};
