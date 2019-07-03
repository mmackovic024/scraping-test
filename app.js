const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const tempsRouter = require('./routes/temps');
const precipRouter = require('./routes/precip');
const allRouter = require('./routes/all');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/api', (req, res) =>
  res.send(
    'Welcome to data scraper demo. Available endpoints: api/temps; api/precip; api/all '
  )
);
app.use('/api/temps', tempsRouter);
app.use('/api/precip', precipRouter);
app.use('/api/all', allRouter);

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
