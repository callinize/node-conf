
var path   = require('path');
var merge  = require('merge-recursive');
var configLoaded = '';

var cache = { };

// Root path of the project
var ROOT_DIR = path.join(__dirname, '../../..');
exports.setRootDir = function(root) {
	ROOT_DIR = root;
};

// Configuration directory
var CONF_DIR = 'config';
exports.setConfDir = function(conf) {
	CONF_DIR = conf;
};

// Master config file
var MASTER_CONF = 'master';
exports.setMasterConf = function(master) {
	MASTER_CONF = master;
};

// Load configuration
// only allow the first config loaded to load
exports.load = function (env) {
	if(!cache[env] && !configLoaded) {
		cache[env] = loadConfFiles([MASTER_CONF, (env || 'undefined')]);
		if(!configLoaded) configLoaded = env;
	}
	return cache[env] || cache[configLoaded];
};

// Loads configuration files and merges them
function loadConfFiles(files) {
	var confDir = path.resolve(ROOT_DIR, CONF_DIR);
	return merge.recursive.apply(merge,
		files.map(function(file) {
			var contents;
			try {
				contents = require(path.join(confDir, file + '.json'));
			} catch (e) {
				contents = require(path.join(confDir, file + '.js'));
			}
			return contents;
		})
	);
}

