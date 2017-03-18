var combine = require('./src/combine');

module.exports.combine = function(_srcFolder, callback) {
    combine.run(_srcFolder, callback);
};