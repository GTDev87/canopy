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

    function hasArrayStructure(jsonObject) {
        var keys = _.keys(jsonObject),
            stringRange = _.map(_.range(_.keys(jsonObject).length), function (intVal) {return intVal.toString(); });
        return _.isEqual(keys, stringRange);
    }

    function describeArrayLike(uri) {

        if (!hasObjectValues(uri)) {
            throw new Error("you are trying to describe something not arraylike");
        }

        var jsonLevel = uriIndex(uri),
            descriptionObject = {};

        descriptionObject.keys = {};

        if (hasArrayStructure(jsonLevel)) {
            descriptionObject.keys.type = "array";
            descriptionObject.keys.numElements = _.keys(jsonLevel).length;
        } else {
            descriptionObject.keys.type = "object";
            descriptionObject.keys.names = _.keys(jsonLevel);
        }


        descriptionObject.values = _.chain(jsonLevel)
            .values()
            .reduce(
                function (aggValueObject, curValueObject) {
                    var curKeys = _.keys(curValueObject),
                        initializedAggObject;

                    initializedAggObject = _.chain(curKeys)
                        .filter(
                            function (curKey) {
                                return aggValueObject[curKey] === undefined;
                            }
                        )
                        .reduce(
                            function (aggObj, curKey) {
                                aggObj[curKey] = 0;
                                return aggObj;
                            },
                            aggValueObject
                        );

                    return _.reduce(
                        curKeys,
                        function (aggObject, curKey) {
                            aggObject[curKey] = aggObject[curKey] + 1;
                            return aggObject;
                        },
                        initializedAggObject
                    );
                },
                {}
            );
        return descriptionObject;
    }

    return {
        splitUri: splitUri,
        hasObjectValues: hasObjectValues,
        uriIndex: uriIndex,
        describeArrayLike: describeArrayLike,
        hasArrayStructure: hasArrayStructure
    };
}

module.exports = {
    name: "canopy",
    version: "0.0.0",
    json: jsonDataFuntion
};