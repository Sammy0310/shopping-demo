var config = require('./config');

module.exports = {

  facebook: {
    clientID: '117694571900242', 
    clientSecret: '0ace20b0dc287ec1d6d83165de39303e',
    callbackURL: config.development.siteUrl + '/users/fbAuthenticationComplete',
    passReqToCallback: true
  }
};