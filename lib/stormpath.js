/**
 * Stormpath authentication components
 */

var Strategy = require('passport-stormpath')
  , passport = require('passport');

var config = require('./config');

var stormpathConfig = {
  apiKeyId: config.apiKeyId,
  apiKeySecret: config.apiKeySecret,
  appHref: config.appHref,
  expansions: config.expansions
};

var strategy = new Strategy(stormpathConfig);

passport.use(strategy);
passport.serializeUser(strategy.serializeUser);
passport.deserializeUser(strategy.deserializeUser);
