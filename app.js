var express = require('express')
, path = require('path')
, flash = require('connect-flash')
, http = require('http')
, app = express()
, mongoose = require('mongoose')
, config = require('./config/config')
, engines = require('consolidate')
, passportConfig = require('./config/passport-config')
, passport =  require('passport')
, LocalStrategy = require('passport-local').Strategy
, User = require('./models/User')
, logger = require('morgan')
, cookieParser = require('cookie-parser')
, expressSession = require('express-session')
, methodOverride = require('method-override')
, bodyParser = require('body-parser');

// mongoose connection
mongoose.connect("mongodb://localhost/shoppingdb");


// view engine setup

app.set('port',process.env.PORT||3000);
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret:'some secret',
  resave: false  
      }));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
  res.locals.user = req.user;
  next();
});
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes')(app);
app.use(function(req, res) {
    return res.status(404).json('404 Not found!');  
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('Error : ' + err);
  return res.json({error: err});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

