'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();
var server = require('http').createServer(app);

mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

server.listen(config.port, function() {
  console.log('Server listening on port %d', config.port);
});