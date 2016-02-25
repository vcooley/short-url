'use strict';

var Counter = require('./counter.model');
var Url = require('./url.model');
var validator = require('validator');

var getNextSequence = function(name) {
  return Counter.find({name: name}, function(err, docs) {
      if (err) { handleError(res, err); }
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
      // If the url is not valid and the allowInvalid parameter has not been
      // passed, return a 400 error.
      console.log(req.query.allowInvalid);
      if(!validator.isURL(req.params.longUrl) && !req.query.allowInvalid) {
        return  res.status(400).end('Invalid Url');
      }
      var url = new Url({
        _id: number,
        url: req.params.longUrl,
        valid: (req.query.allowInvalid
               ? false
               : true)
      });
      url.save(function(err, doc) {
        if (err) { handleError(res, err); }
      return res.json(doc);
      })
    })
  ;
};

exports.retrieveUrl = function(req, res) {
  Url
    .findById(req.params.shortUrl, function(err, doc) {
      if (err) { handleError(res, err); }
      if (!doc) {
        return res.status(404).end('Not found.')
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