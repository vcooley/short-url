'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = new Schema({
  _id: String,
  seq: {type: Number, default: 0}
});

module.exports = mongoose.model('Counter', CounterSchema);