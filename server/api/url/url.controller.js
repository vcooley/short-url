'use strict';

var Counter = require('./counter.model');
var Url = require('./url.model');

var getNextSequence = function(name) {
  return Counter.findOneAndUpdate({ _id: name }, { $inc: {seq: 1 }}, {new: true})
    .then(function(err, doc) {
      if (err) {
        throw err;
      }
      return doc.seq;
    });
};

exports.createUrl = function(req, res) {
  console.log('tried to create url')
  getNextSequence('urlNumber')
    .then(function(number) {
      console.log(number);
      Url.create({
        _id: number,
        url: req.params.longUrl
      }, function(err, doc) {
        if (err) { throw err; }
        res.json(doc);
      })
    });
};

exports.retrieveUrl = function(req, res) {
  console.log('tried to retrieve url')
  Url
    .findById(req.params.shortUrl)
    .then(function(err, doc) {
      if (err) { throw err; }
      res.redirect(doc.url);
    })
};