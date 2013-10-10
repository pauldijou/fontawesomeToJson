var https = require('https');
var fs = require('fs');

function contains(array, search) {
  return array.indexOf(search) > -1;
}

function hasArg(arg) {
  return contains(process.argv, arg);
}

https.get('https://raw.github.com/FortAwesome/Font-Awesome/master/css/font-awesome.css', function (res) {
  var data;
  var iconsToUnicode = {};

  res.on('data', function (chunk) {
    data += chunk;
  });

  res.on('end', function () {
    if (hasArg('-v') || hasArg('--version')) {
      var regexVersion = /\*\s*Font Awesome ([0-9]\.[0-9]\.[0-9])/;
      var version = regexVersion.exec(data);

      if (version[1]) {
        iconsToUnicode.version = version[1];
      }
    }

    var regexIcons = /\.(icon\-[a-zA-Z0-9\-]+):before(?:,\n\.(icon\-[a-zA-Z0-9\-]+):before)*\s*{\n\s*content:\s*"\\([a-zA-Z0-9]{4})";\n}/g;
    var result;
    
    while ((result = regexIcons.exec(data)) !== null) {
      for(var i = 1; i < result.length - 1; ++i) {
        if (result[i]) {
          iconsToUnicode[result[i]] = result[result.length - 1];
        }
      }
    }

    fs.writeFile('icons.json', JSON.stringify(iconsToUnicode, null, '  '));
  });
}).on('error', function(e) {
  console.error(e);
});
