const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const db = require('./models');
const socketHandler = require('./util/socketHandler');

const app = express();
const { PORT } = process.env;

const http = require('http').Server(app);

socketHandler.createSocketIOServer(http);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.redirect('/index.html');
})
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function (err, req, res, next) {
    console.error(err.message);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: (app.get('env') === 'development') ? err : {}
    });
});

db.sequelize
    .authenticate()
    .then(function () {
        console.log('Connected to db');
        http.listen(PORT, function () {
            console.log(`Server is up!!!!\nListening on port ${PORT}`);
        });
    })
    .catch(function (err) {
        console.log('Could not connect to db', err);
    })
