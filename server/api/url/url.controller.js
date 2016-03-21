'use strict';

var Counter = require('./../counter/counter.model.js');
var Url = require('./url.model');
var validator = require('validator');

var getNextSequence = function(name, res) {
  return Counter.find({name: name}, function(err, docs) {
      if (err) {
        return handleError(res, err);
      }
      return docs[0].update({ $inc: {seq: 1} }, null, function(err, doc) {
        if (err) {
          throw err;
        }
        return doc;
      });
    });
};

exports.attachUrl = function(req, res, next) {
  // Trim /new/ from the beginning of path and attach encoded URL to request
  req.params.longUrl = req.path.substring(5);
  next();
};

exports.createUrl = function(req, res) {
  console.log(req.params.longUrl);
  // If the url is not valid and the allowInvalid parameter has not been
  // passed, return a 400 error.
  var isValidUrl = validator.isURL(req.params.longUrl, {require_protocol: true});
  if(!isValidUrl && !req.query.allowInvalid) {
    return  res.status(400).end('Invalid Url');
  }
  getNextSequence('urlNumber', res)
    .then(function(counterDocs) {
      var number = counterDocs[0].seq;
      var url = new Url({
        _id: number,
        url: req.params.longUrl,
        valid: (req.query.allowInvalid
               ? false
               : true
        )
      });
      return url.save(function(err, doc) {
        if (err) { handleError(res, err); }
        return res.json(doc);
      })
    })
  ;
};

exports.retrieveUrl = function(req, res) {

  var urlNumber = Number(req.params.shortUrl);

  if (!urlNumber && urlNumber !== 0) {
    return res.status(400).end('Invalid short URL. Should be a number.');
  }
  Url
    .findById(urlNumber, function(err, doc) {
      if (err) { handleError(res, err); }
      if (!doc) {
        return res.status(404).end('Not found.');
      }
      if(validator.isURL(doc.url)) {
        return res.redirect(doc.url);
      }
      else {
        return res.end(doc.url);
      }
    })
};

function handleError(res, err) {
  return res.status(500).send(err);
}