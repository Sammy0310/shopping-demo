var config = require('./config');

module.exports = {

  facebook: {
    clientID: '100880140254673', 
    clientSecret: 'e44f2d65016c7e3d8f9b21e5cd81389c',
    callbackURL: config.development.siteUrl + '/users/fbAuthenticationComplete',
    passReqToCallback: true
  }
};