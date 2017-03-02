var fs = require('fs');
var execSync = require('child_process').execSync;

function usage() {
	console.log('===========================Usage=============================');
	console.log('=                                                           =');
	console.log('=         node rmpage pagename                              =');
	console.log('=                                                           =');
	console.log('=============================================================');
};

usage();

var paths = {
	'pagename': process.argv[2],
	'page': './src/javascript/page/',
	'tpl': './src/newPages/',
	'style': './src/scss/',
	'entry': './config/defaults.js'
};

function execCmd() {
	var {
		pagename,
	} = paths;

	if (!pagename) {
		console.log('Please enter pagename!');
		return;
	}

	delFiles();
	delEntry();
}

execCmd();

function delFiles() {
	var {
		pagename,
		page,
		tpl,
		style
	} = paths;

	var delFileShellCMDs = [page, tpl, style].map((item, index) => {
		var cmd = 'rm -rf ' + item + pagename;
		execSync(cmd);
		console.log(item + pagename + ' has been successfully deleted!')
	});
}

function delEntry() {
	var {
		pagename: page,
	} = paths;

	fs.readFile(paths.entry, (err, fd) => {
		if (err) {
			console.log('error in Webpack entry setting!');
			return;
		}
		let strDate = fd.toString();

		if (strDate.search(page + '/') == -1) {
			console.log('No such pagename in Webpack entry(./defaults.js), check your parameters')
			return;
		}

		let newDate = strDate.replace(/\{\s*.*\s*.*\s*.*Home\/.*\s*}\,\s*/, '');
		fs.writeFileSync(paths.entry, newDate);
	})
}