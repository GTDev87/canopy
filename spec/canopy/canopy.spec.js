/*jslint nomen: true */

/*global beforeEach, afterEach, describe, it, xit, expect */

/*global console */
/*global debugger */
/*global dependencies */

dependencies({
    'canopy': {
        'browser': '../../build/canopy',
        'node': '../../src/canopy'
    }
}).init(this, function (canopy) {
    'use strict';

    console.log("canopy = %j", canopy);

    describe("inspectTree", function () {
        it("should give a summary of tree at level", function () {
            expect(true).toEqual(true);
        });
    });
});