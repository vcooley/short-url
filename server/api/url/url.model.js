'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
  _id: Number,
  url: String,
  valid: {type: Boolean, default: true}
});

module.exports = mongoose.model('Url', UrlSchema);