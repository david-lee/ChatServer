var app = require('express')()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

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