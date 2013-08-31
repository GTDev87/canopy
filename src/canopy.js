/*jslint node: true, nomen: true */
'use strict';

var _ = require('lodash');


function jsonFunc(jsonData) {
    function getTableWithArray(location) {
        console.log("jsonData = %j", jsonData);
        console.log("location = %j", location);
    }

    return {
        getTableWithArray: getTableWithArray
    };
}

module.exports = {
    name: "canopy",
    version: "0.0.1",
    json: jsonFunc
};