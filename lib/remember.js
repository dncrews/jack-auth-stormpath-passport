/**
 * Remember Me authentication components for Stormpath
 */
var Strategy = require('passport-remember-me').Strategy
  , passport = require('passport')
  , debug = require('debug')('jack:stormpath:remember')
  , request = require('superagent')
  , Promise = Promise || require('bluebird');


var config = require('./config');


passport.use(new Strategy({}, verify, issue));
exports.issueToken = issue;

function verify(token, next) {
  deleteToken(token)
    .then(function(id) {
      return new Promise(function(resolve, reject) {
        request
          .get(id)
          .auth(config.apiKeyId, config.apiKeySecret)
          .end(function(err, res) {
            if (err) return reject(err);
            return resolve(res.body);
          });
      });
    })
    .then(function(user) {
      return next(null, user);
    })
    .catch(function() {
      return next(null, false);
    });
}

function issue(user, next) {
  return createToken(user.href)
    .then(function(token) {
      if (next) return next(null, token);
      return token;
    })
    .catch(function(err) {
      if (next) return next(err);
      throw err;
    });
}

function deleteToken(token, cb) {
  return new Promise(function(resolve, reject) {
    var sessions = config.db.session;

    sessions
      .get(token.id)
      .then(function(doc) {
        return sessions.delete(doc)
          .then(function(deleted) {
            debug('token deleted ' + deleted.id);
            if (cb) cb(null, doc.uid);
            return resolve(doc.uid);
          });
      })
      .catch(function(err) {
        debug('delete token error:', err);
        if (cb) cb(err);
        return reject(err);
      });

  });
}

function createToken(id, cb) {
  return new Promise(function(resolve, reject) {
    var sessions = config.db.session;
    var expires = new Date((new Date()) + (14 * 24 * 60 * 60 * 1000)).toJSON();

    sessions.create(id, expires)
      .then(function(session) {
        debug('token created', session);
        if (cb) cb(null, session);
        return resolve(session);
      })
      .catch(function(err) {
        debug('create token err:', err);
        if (cb) cb(err);
        return reject(err);
      });
  });
}
