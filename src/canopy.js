/*jslint node: true, nomen: true */
'use strict';

var sproutid = require("sproutid"),
    _ = require("lodash");

function jsonDataFuntion(jsonData) {
    function splitUri(uri) {
        return _.filter(uri.split("/"), function (uriPart) {return uriPart.length > 0; });
    }

    function uriIndex(uri) {
        var uriParts = splitUri(uri);
        return _.reduce(
            uriParts,
            function (indexedJsonData, uriIndex) {return indexedJsonData[uriIndex]; },
            jsonData
        );
    }

    function hasObjectValues(uri) {
        var examinedJson = uriIndex(uri);

        return _.chain(examinedJson)
            .values()
            .every(function (jsonValue) {return typeof jsonValue === "object"; });
    }

    function describe(uri) {
        var jsonLevel = uriIndex(uri);
        hasObjectValues(uri);
        console.log("the jsonLevel is %j", jsonLevel);


        return;
    }

    return {
        splitUri: splitUri,
        hasObjectValues: hasObjectValues,
        uriIndex: uriIndex,
        describe: describe
    };
}

module.exports = {
    name: "canopy",
    version: "0.0.0",
    json: jsonDataFuntion
};