'use strict';

var should = require('should');
var controller = require('./url.controller');
var app = require('../../app.js');
var request = require('supertest');
var Counter = require('./../counter/counter.model.js');
var Url = require('./url.model.js');

describe('URL controller', function() {

  describe('createUrl', function() {

    it('should create a new URL', function(done) {

    });

    it('should not allow the creation of an invalid URL by default');

    it('should allow creation of invalid URL when flag is passed');

    it('should increment URL number after each successful request');

    it('should not increment URL after unsucessful request');

  });

  describe('retrieveUrl', function() {

    it('a shortened URL should redirect for a found, valid URL');

    it('a shortened URL should return text for a found, invalid URL');

    it('should return a 404 when a URL has not been created');

    it('should return a 400 if the URL submitted was not Number');

  });

});