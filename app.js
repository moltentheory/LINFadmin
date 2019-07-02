var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var formTestRouter = require('./routes/formtest')
var usersRouter = require('./routes/users');

//var pessoaRouter = require('./routes/pessoa');
//var reservaRouter = require('./routes/reserva');
//var historicoRouter = require('./routes/historico');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var db = require('mysql').createConnection({host: 'localhost', user: 'root', password: '05685040', database: 'linf'});
//db.connect();
app.set('db',db);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));


app.use(function (req, res, next) {
  res.locals.route = req.originalUrl.split('/').filter(Boolean).map(function(crumb){
    return (crumb.charAt(0).toUpperCase() + crumb.slice(1));
  });
  //res.locals.authenticated = !req.user.anonymous
  next()
})

app.use('/', indexRouter);
app.use('/formtest', formTestRouter);
app.use('/users', usersRouter);

// Routes for CRUDs
app.use('/pessoa', require('./routes/pessoa'));
app.use('/reserva', require('./routes/reserva'));
app.use('/historico', require('./routes/historico'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
