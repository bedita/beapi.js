var fs = require('fs'),
	version = process.argv[process.argv.length - 1],
	regex = /^\d+\.\d+.\d+$/,
	npmPackage = require('./package.json'),
	bowerPackage = require('./bower.json');

if (regex.test(version)) {
	npmPackage.version = bowerPackage.version = version;
	try {
		fs.writeFileSync('./package.json', JSON.stringify(npmPackage, null, 4));
		fs.writeFileSync('./bower.json', JSON.stringify(bowerPackage, null, 4));
	} catch(ex) {
		//
	} finally {
		var sys = require('sys')
		var exec = require('child_process').exec;
		exec('git tag -a v' + version + ' -m "' + version + '"');
	}
} else {
	throw 'Invalid version.';
}
