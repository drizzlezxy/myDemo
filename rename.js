var fs = require('fs');
var path = require('path');
var cp = require('child_process');

var picPath = 'res/images/CalendarNav/detail/';
var absPicPath = path.join(__dirname, picPath);
var tackleMap = {
    '.jpg': 1,
    '.png': 1
};


fs.readdir(absPicPath, function(err, files) {
    if (err) throw err;

    files.forEach(function(file, index) 
    {
        var subfix = file.substring(file.lastIndexOf('.'));
        subfix = subfix.toLowerCase();

        if (!(subfix in tackleMap)) {
            console.log('format ' + subfix + ' is not supported now');
        } else {
        	var key = index + 1;
            var oldname = absPicPath + file;
            var newname = absPicPath + (key) + subfix;

            fs.renameSync(oldname, newname);
        }

    });

    console.log('rename pictures successfully!');
});
