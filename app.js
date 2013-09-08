
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
//app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', routes.index);
app.get('/users', user.list);

io.sockets.on('connection', function (socket) {
    socket.on('login', function(user) {
        socket.emit('confirmLogin', {message: 'You have successfully connected.'});
        socket.broadcast.emit('newUser', { name: user.name });
    });

    socket.on('checkout', function (data) {
        console.log('checkout: ', data);
        socket.broadcast.emit('checkout', data);
    });

    socket.on('checkin', function (data) {
        console.log('checkin: ', data);
        socket.broadcast.emit('checkin', data);
    });
});

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
