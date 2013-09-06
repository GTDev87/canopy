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

    var jsonData = [
            {
                user: {
                    name: "Greg",
                    id: 42,
                    lang: "English"
                },
                text: "This is a Tweet",
                id: "123123123",
                url: "greg@greg.com",
                followers_count: 42
            },
            {
                user: {
                    name: "Tyler",
                    id: 43,
                    lang: "Spanish"
                },
                text: "Lisa!!!!",
                id: "234234234",
                url: "tyler@tylwer.com",
                followers_count: 123
            },
            {
                user: {
                    name: "David",
                    id: 349,
                    lang: "Philosophy"
                },
                text: "Evidence or Implimentation",
                id: "424242424242",
                url: "greg@greg.com",
                followers_count: 9001
            }
        ],
        canopyJson = canopy.json(jsonData);

    describe("uriIndex", function () {
        it("should select part of json dependent on uri", function () {
            expect(canopyJson.uriIndex("1/user/name")).toEqual("Tyler");
        });
    });
});