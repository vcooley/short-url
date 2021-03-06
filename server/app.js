'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  }
);

// Create app and mount routes
var app = express();
var server = require('http').createServer(app);
app.set('view engine', 'jade');
app.use(express.static('public'));

app.use('/favicon.ico', function(req, res) {
  return res.status(404).send();
});
app.use('/api/url', require('./api/url'));
app.use('/', function(req, res) {
  return res.render('index');
});
app.use('/*', function(req, res) {
  return res.redirect('/');
});

server.listen(config.port, function() {
  console.log('Server listening on port %d', config.port);
});

