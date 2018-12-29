    //Modules imports
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const ejs = require('ejs');
const mysql = require('mysql');

const databaseWrapper = require('./db_wrapper.js');
const p2pEvents = require('./p2p_events.js');
const accountEvents = require('./account_events.js');

var users = [];

/******************************************************************************/

    // Creation of database connection
var config = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'ultimate_p2p'
};

var database = new databaseWrapper.Database(mysql, config);

/******************************************************************************/

    //Serve public folder
app.use(require('express').static(__dirname + '/public'));

    // Address: /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/pages/index.html');
});

/******************************************************************************/

    //Socket.io events
io.sockets.on('connection', function(socket) {
    p2pEvents.listen(socket, database, users);
    accountEvents.listen(socket, database, users);
});

server.listen(8080);
