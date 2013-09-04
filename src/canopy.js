/*jslint node: true, nomen: true */
'use strict';

function canopy() {
    function functionName() {
        return;
    }

    return {
        functionName: functionName
    };
}

module.exports = {
    name: "canopy",
    version: "0.0.0",
    canopy: canopy
};