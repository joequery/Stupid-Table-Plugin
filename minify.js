var minify = require('minify');
var fs = require('fs');

minify('stupidtable.js', 'stream', function(error, stream) {
    var streamWrite = fs.createWriteStream('stupidtable.min.js');

    if (error)
        console.error(error.message);
    else
        stream.pipe(streamWrite);
});
