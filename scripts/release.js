var fs = require('fs'),
    version = process.argv[process.argv.length - 1],
    regex = /^\d+\.\d+.\d+$/,
    npmPackage = require('../package.json'),
    bowerPackage = require('../bower.json');

function exec(cmd, args, cb_end) {
	var spawn = require('child_process').spawn,
		child = spawn(cmd, args),
		me = this;
	me.exit = 0; // Send a cb to set 1 when cmd exits
	child.stdout.on('end', function() {
		if (cb_end) {
			cb_end(me)
		}
	});
}

if (regex.test(version)) {
    npmPackage.version = bowerPackage.version = version;
    try {
        fs.writeFileSync('../package.json', JSON.stringify(npmPackage, null, 4));
        fs.writeFileSync('../bower.json', JSON.stringify(bowerPackage, null, 4));
    } catch (ex) {
        //
    } finally {
        console.log('Add changes to index');
        exec('git', ['add', '.'], function () {
        	console.log('Commit changes');
        	exec('git', ['commit', '-m', 'release v' + version], function () {
        		console.log('Tag release');
        		exec('git', ['tag', '-a', 'v' + version, '-m', version]);
        	});
        });
    }
} else {
    throw 'Invalid version.';
}
