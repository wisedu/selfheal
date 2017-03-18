
var async = require('async');
var utils = require('./utils');

module.exports.run = function (_srcFolder, topCallback) {
    init(_srcFolder, topCallback);
};

function init(_srcFolder, topCallback) {
    let componentsFilesPathData = getComponentsFilePathData(_srcFolder);
    async.waterfall([
        function(callback) {
            getComponentsData(componentsFilesPathData, callback);
        },
        function (_result, callback) {
            topCallback(null, _result);
        }
    ]);

}

function getComponentsFilePathData(_srcFolder) {
    let filesData = {};
    let srcFilesPath = utils.scanFolder(_srcFolder).files;
    let componentNameRe = new RegExp(_srcFolder + "(\\w*(-\\w*)*)\/(\\w*(-\\w*)*)\.\\w+$");
    for(let _path of srcFilesPath){
        let componentMatch = _path.match(componentNameRe);
        if(componentMatch){
            let componentName = componentMatch[1];
            let key = componentMatch[3];
            if(!filesData[componentName]){
                filesData[componentName] = {};
            }

            let componentFileData = filesData[componentName];
            componentFileData[key] = _path;
        }
    }

    return filesData;
}

function getComponentsData(_componentsFilesPathData, callback) {
    let componentsData = {};
    async.forEachOf(_componentsFilesPathData, function (value, key, eachCallback) {
        readComponentsFile(value, key, componentsData, eachCallback);
    }, function (err) {
        callback(null, componentsData);
    });
}

function readComponentsFile(_componentsFiles, _componentName, _toSaveComponentsData, callback) {
    async.forEachOf(_componentsFiles, function (value, key, eachCallback) {
        getAndSaveComponentsData(_componentName, key, value, _toSaveComponentsData, eachCallback);
    }, function (err) {
        callback(null, null);
    });
}

function getAndSaveComponentsData(_componentName, _dataType, _filePath, _toSaveComponentsData, callback) {
    utils.readFile(_filePath, function (err, _result) {
        if(!_toSaveComponentsData[_componentName]){
            _toSaveComponentsData[_componentName] = {};
        }

        let componentItem = _toSaveComponentsData[_componentName];
        componentItem[_dataType] = _result.data;

        callback(null, null);
    });
}

