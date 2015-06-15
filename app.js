var express = require('express')
, path = require('path')
, flash = require('connect-flash')
, http = require('http')
, app = express()
, mongoose = require('mongoose')
, engines = require('consolidate')
, passportConfig = require('./config/passport-config')
, passport =  require('passport')
, LocalStrategy = require('passport-local').Strategy
, User = require('./models/User')
, favicon = require('serve-favicon')
, logger = require('morgan')
, cookieParser = require('cookie-parser')
, app = express()
, bodyParser = require('body-parser');

// mongoose connection
if('development' == app.get('env')) {
  app.use(express.errorHandler());
  mongoose.connect(config.development.dbUrl);
}else{
  mongoose.connect(cofig.production.dbUrl);
}

var routes = require('./routes/index');
var users = require('./routes/users');


// view engine setup
app.configure(function(){
app.set('port',process.env.PORT||3000);
app.engine('html',reuire('ejs').renderFile);
app.set('view engine','html');  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.methodOverride());
app.use(cookieParser());
app.use(express.session({secret: 'some secret'}));
app.use(passport.initialize());
app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res) {
    return res.status(404).json('404 Not found!');  
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('Error : ' + err);
  return res.json({error: err});
});
});// closing app.configure

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

