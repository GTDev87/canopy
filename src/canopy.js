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

    function describe(uri) {
        console.log(uri);
    }

    function describePrimitive(uri) {
        var descriptionObject = {},
            jsonLevel = uriIndex(uri);

        if (hasArrayStructure(jsonLevel)) {
            throw new Error("the data is array like");
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

        if (!arrayStructureKeyDescription(jsonLevel)) {
            throw new Error("the data is not array like");
        }

        if (hasObjectValues(uri)) {
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

        if (!arrayStructureKeyDescription(jsonLevel)) {
            throw new Error("the data is not array like");
        }

        if (!hasObjectValues(uri)) {
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