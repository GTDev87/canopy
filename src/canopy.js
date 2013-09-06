/*jslint node: true, nomen: true */
'use strict';

var sproutid = require("sproutid"),
    _ = require("lodash");

function jsonDataFuntion(jsonData) {
    function uriIndex(uri) {
        var uriParts = uri.split("/");
        return _.reduce(
            uriParts,
            function (indexedJsonData, uriIndex) {return indexedJsonData[uriIndex]; },
            jsonData
        );
    }

    function describe(uri) {
        console.log("the uri is %j", uri);
        return;
    }

    return {
        uriIndex: uriIndex,
        describe: describe
    };
}

module.exports = {
    name: "canopy",
    version: "0.0.0",
    json: jsonDataFuntion
};