'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.log('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

// Create app and mount routes
var app = express();
var server = require('http').createServer(app);
app.use('/api/url', require('./api/url'));
app.use('/*', function(req, res) {
  return res.redirect('/');
});

server.listen(config.port, function() {
  console.log('Server listening on port %d', config.port);
});

