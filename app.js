// Including libraries
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fs = require('fs');

var rawData = fs.readFileSync('test.json');  
var lines = JSON.parse(rawData);

// Routing
app.use(express.static('public'));

// Listen for incoming connections from clients
io.on('connection', function (socket) {
  console.log('a user connected');
  
  socket.emit('updatelines', lines);

  socket.on('newLines', function (data){ 
   // Have lines persit on refresh
    // if (data.drawing){
      lines.push(data);
      var lineData = JSON.stringify(lines);
      fs.writeFileSync('test.json', lineData);
    // }
  });

  // Start listening for mouse move events
  socket.on('mousemove', function (data) {

    // This line sends the event (broadcasts it)
    // to everyone except the originating client.

 
      


    socket.broadcast.emit('moving', data);
  });

  

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
