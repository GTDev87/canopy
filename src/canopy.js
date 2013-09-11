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

    function hasObjectValues(jsonObject) {
        return _.chain(jsonObject)
            .values()
            .every(function (jsonValue) {return typeof jsonValue === "object"; });
    }

    function hasArrayStructure(jsonObject) {
        var keys = _.keys(jsonObject),
            stringRange = _.map(_.range(_.keys(jsonObject).length), function (intVal) {return intVal.toString(); });

        if (typeof jsonObject === "string") {
            return false;
        }

        return _.isEqual(keys, stringRange);
    }

    function arrayStructureKeyDescription(jsonLevel) {
        var keyDescription = {};
        if (hasArrayStructure(jsonLevel)) {
            keyDescription.type = "array";
            keyDescription.numElements = _.keys(jsonLevel).length;
        } else {
            keyDescription.type = "object";
            keyDescription.names = _.keys(jsonLevel);
        }

        return keyDescription;
    }

    function isPrimitive(data) {
        var typeofData = typeof data;
        return typeofData !== "object" && typeofData !== "array";
    }

    function describePrimitive(uri) {
        var descriptionObject = {},
            jsonLevel = uriIndex(uri);

        if (!isPrimitive(jsonLevel)) {
            throw new Error("data is not primitive");
        }

        descriptionObject.keys = {};
        descriptionObject.keys.type = "primitive";

        descriptionObject.values = {};
        descriptionObject.values.type = typeof jsonLevel;
        descriptionObject.values.value = jsonLevel;
        return descriptionObject;
    }

    function describeNonObjectArrayLike(uri) {
        var descriptionObject = {},
            jsonLevel = uriIndex(uri);

        if (isPrimitive(jsonLevel)) {
            throw new Error("data is primitive");
        }

        if (hasObjectValues(jsonLevel)) {
            throw new Error("you are trying to describe something is object array like");
        }
        descriptionObject.keys = arrayStructureKeyDescription(jsonLevel);

        descriptionObject.values = _.chain(jsonLevel)
            .values()
            .reduce(
                function (aggValueObject, curVal) {
                    var curValType = typeof curVal;
                    if (aggValueObject[curValType] === undefined) {
                        aggValueObject[curValType] = 0;
                    }
                    aggValueObject[curValType] = aggValueObject[curValType] + 1;
                    return aggValueObject;
                },
                {}
            );

        return descriptionObject;
    }

    function describeObjectArrayLike(uri) {
        var jsonLevel = uriIndex(uri),
            descriptionObject = {};

        if (isPrimitive(jsonLevel)) {
            throw new Error("data is primitive");
        }

        if (!hasObjectValues(jsonLevel)) {
            throw new Error("you are trying to describe something not object array like");
        }


        descriptionObject.keys = arrayStructureKeyDescription(jsonLevel);

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

    function describe(uri) {
        var jsonLevel = uriIndex(uri);

        if (isPrimitive(jsonLevel)) {
            return describePrimitive(uri);
        }

        if (hasObjectValues(jsonLevel)) {
            return describeObjectArrayLike(uri);
        }

        return describeNonObjectArrayLike(uri);
    }

    return {
        splitUri: splitUri,
        hasObjectValues: hasObjectValues,
        uriIndex: uriIndex,
        describeObjectArrayLike: describeObjectArrayLike,
        hasArrayStructure: hasArrayStructure,
        describeNonObjectArrayLike: describeNonObjectArrayLike,
        describePrimitive: describePrimitive,
        describe: describe
    };
}

module.exports = {
    name: "canopy",
    version: "0.0.0",
    json: jsonDataFuntion
};