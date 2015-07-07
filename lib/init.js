
var jack = require('jack-stack')
  , app = jack.app;

module.exports = function() {
  var config = this.config;

  require('./stormpath');

  var passport = require('passport')
    , providerName = 'stormpath'
    , remember = require('./remember');

  var sessionConfig;

  jack.useAfter('couchdb', 'stormpath:couch', function() {
    config.db = jack.db.couch;
  });


  jack.useAfter('session', 'stormpath:passport', function() {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.authenticate('remember-me'));
  });


  jack.useBefore('router', 'stormpath:router', function() {
    var url = '/login'
      , authenticate;

    if (config.passport) {
      authenticate = passport.authenticate(providerName, config.passport);
    } else {
      authenticate = passport.authenticate(providerName);
    }

    app.post(
      url,
      authenticate,
      setCookieMiddleware,
      redirect('./')
    );

    app.get(
      '/logout',
      logoutMiddleware,
      redirect('./login.html')
    );
  });

  jack.configure('restrictr', function(config) {
    config.groupCheck = groupCheck;

    function groupCheck(user, aclGroups) {
      var groups = getGroups(user);

      return aclGroups.reduce(function(prev, aclGroup) {
        return prev || inGroup(groups, aclGroup);
      }, false);
    }


    function getGroups(user) {
      var directory, groups;

      directory = user.directory.name;

      groups = user.groups.items.map(function(group) {
        return directory + ':' + group.name;
      });

      groups = groups.concat([directory]);
      return groups;
    }


    function inGroup(userGroups, group) {
      return !!~userGroups.indexOf(group);
    }
  });

  jack.configure('sockets', function(config) {
    var passportIO = require('passport.socketio')
      , cookieParser = require('cookie-parser');

    sessionConfig = jack.plugins.get('session').config;

    config.authorization = passportIO.authorize({
      passport: passport,
      cookieParser: cookieParser,
      key: sessionConfig.name,
      secret: sessionConfig.secret,
      store: sessionConfig.store,
      fail: failure,
      success: success,
    });

    function failure(data, message, error, accept) {
      accept(null, false);
    }

    function success(data, accept) {
      accept(null, true);
    }
  }, true);


  function redirect(url) {
    if (config.restful) return function(req, res) { res.sendStatus(200); };

    if (config.callNext) return function(req, res, next) { return next(); };

    return function(req, res) { res.redirect(url); };
  }

  function setCookieMiddleware(req, res, next) {
    console.log(req.body.remember_me);
    if (req.body.remember_me) {
      console.log('rememeber');
      return remember.issueToken(req.user)
        .then(function(token) {
          console.log('token', token);
          res.cookie('remember_me', token, {
            path: '/',
            httpOnly: true,
            maxAge: 604800000
          });
          next();
        })
        .catch(function(err) {
          return next(err);
        });
    }

    next();
  }

  function logoutMiddleware(req, res, next) {
    res.clearCookie('remember_me');
    res.clearCookie(sessionConfig.name);
    next();
  }

};
