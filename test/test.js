var path = require('path');

var combine = require('../index');


var srcFolder = path.join(path.resolve(), 'test/jsonFiles/');

combine.combine(srcFolder, function (err, _result) {
    console.log(_result);
});



