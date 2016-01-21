var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//应用配置
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var settings = require('./setting');
var flash = require('connect-flash');
var multer  = require('multer');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));app.use(flash());
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + ']' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

app.use(multer({
  dest: './public/images',
  rename: function (fieldname, filename) {
    return filename
  }
}));
app.use(session({
  secret: settings.cookieSecret,
  key: {maxAge: 1000 * 60 * 24 * 30},
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));


routes(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});