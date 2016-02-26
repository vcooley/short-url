'use strict';

var config = {
  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        9000,

  // MongoDB connection options
  mongo: {
    uri:  process.env.MONGOLAB_URI ||
          'mongodb://localhost/short-url'
  },
  options: {
    db: {
      safe: true
    }
  }
};

if(process.env.NODE_ENV === 'test') {
  config.mongo.uri = 'mongodb://localhost/short-url-test';
}

module.exports = config;