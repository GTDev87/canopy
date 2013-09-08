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

    describe("splitUri", function () {
        it("should split the uri into parts", function () {
            expect(canopyJson.splitUri("1/user/name")).toEqual(["1", "user", "name"]);
        });

        it("should split the uri into parts ignoring empty elements", function () {
            expect(canopyJson.splitUri("/1/user/name")).toEqual(["1", "user", "name"]);
        });
    });

    describe("hasObjectValues", function () {
        it("should return true if all values are objects", function () {
            expect(canopyJson.hasObjectValues("/")).toEqual(true);
            expect(canopyJson.hasObjectValues("")).toEqual(true);
        });

        it("should return false if all values are not objects", function () {
            expect(canopyJson.hasObjectValues("0")).toEqual(false);
        });
    });

    describe("describe", function () {
        it("should return common properties of object", function () {
            expect(canopyJson.describeArrayLike("/")).toEqual(
                {
                    keys: ["0", "1", "2"],
                    values: {
                        user: 3,
                        text: 3,
                        id: 3,
                        url: 3,
                        followers_count: 3
                    }
                }
            );
        });
    });
});