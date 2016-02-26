'use strict';

process.env.NODE_ENV = 'test';

var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');

// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = 'server/api/url';

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file){
  // Only keep the .spec.js files
  return file.substr(-8) === '.spec.js';
})
  .forEach(function(file){
    mocha.addFile(
    path.join(testDir, file)
  );
});

// Run the tests.
mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);  // exit with non-zero status if there were failures
  });
});