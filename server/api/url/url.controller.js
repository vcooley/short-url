'use strict';

var Counter = require('./../counter/counter.model.js');
var Url = require('./url.model');
var validator = require('validator');

var getNextSequence = function(name) {
  return Counter.findOneAndUpdate({name: name}, { $inc: {seq: 1} })
    .then(function(doc) {
      return doc;
    });
};

exports.attachUrl = function(req, res, next) {
  // Trim /new/ from the beginning of path and attach encoded URL to request
  req.params.longUrl = req.path.substring(5);
  next();
};

exports.createUrl = function(req, res) {
  // If the url is not valid and the invalid parameter has not been
  // passed, return a 400 error.
  var isValidUrl = validator.isURL(req.params.longUrl, {require_protocol: true});
  if(!isValidUrl && !req.query.invalid) {
    return  res.status(400).end('Invalid Url');
  }
  return getNextSequence('urlNumber')
    .then(function(counterDoc) {
      var number = counterDoc.seq;
      var url = new Url({
        _id: number,
        url: req.params.longUrl,
        valid: (req.query.invalid
               ? false
               : true
        )
      });
      return url.save();
    })
    .then(function(doc) {
      var shortened = req.protocol + '://' + req.hostname + '/api/url/' + doc._id;
      return res.render('created', {shortURL: shortened});
    })
    .catch(function(err) {
      return handleError(res, err);
    });
};

exports.retrieveUrl = function(req, res) {

  var urlNumber = Number(req.params.shortUrl);

  if (!urlNumber && urlNumber !== 0) {
    return res.status(400).end('Invalid short URL. Should be a number.');
  }
  return Url.findById(urlNumber)
    .then(function(doc) {
      if (!doc) {
        return res.status(404).end('Not found.');
      }
      if(validator.isURL(doc.url, {require_protocol: true})) {
        return res.redirect(doc.url);
      }
      else if (validator.isURL(doc.url)) {
        return res.redirect('//' + doc.url);
      }
      else {
        return res.end(doc.url);
      }
    })
    .catch(function(err) {
      return handleError(res, err);
    })
};

function handleError(res, err) {
  return res.status(500).send(err);
}