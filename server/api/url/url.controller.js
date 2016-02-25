'use strict';

var Counter = require('./counter.model');
var Url = require('./url.model');
var validator = require('validator');

var getNextSequence = function(name) {
  return Counter.find({name: name}, function(err, docs) {
      if(err) { throw err; }
      return docs[0].update({ $inc: {seq: 1} }, null, function(err, doc) {
        if (err) {
          throw err;
        }
        return doc;
      });
    });
};

exports.createUrl = function(req, res) {
  getNextSequence('urlNumber')
    .then(function(counterDocs) {
      var number = counterDocs[0].seq;
      if(validator.isUrl(req.params.longUrl) || req.params.invalid){
        Url.create({
          _id: number,
          url: req.params.longUrl
        }, function(err, doc) {
          if (err) { throw err; }
          res.json(doc);
        })
      }
      else {
        res.statusCode(400).send('Invalid Url')
      }
    });
};

exports.retrieveUrl = function(req, res) {
  console.log('tried to retrieve url');
  Url
    .findById(req.params.shortUrl, function(err, doc) {
      if (err) { throw err; }
      if (!doc.valid) {
        res.end(doc.url);
      }
      else if(validator.isUrl(doc.url)) {
        res.redirect(doc.url);
      }
      else {
        res.redirect('http://' + doc.url);
      }
    })
};