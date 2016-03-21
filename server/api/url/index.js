'use strict';

var router = require('express').Router();
var controller = require('./url.controller');

router.get('/:shortUrl', controller.retrieveUrl);
router.get('/new/*', controller.attachUrl, controller.createUrl);

module.exports = router;