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

    describe("functionName", function () {
        it("should do what function says", function () {
            expect(canopy).toEqual(false);
        });
    });
});