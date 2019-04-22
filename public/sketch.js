var drawing;
var prev, clients = {};
var cursors = [];
var id;
var socket = io();
var lastEmit, now;
var Lines= [];
var cursor;
var today;
var erasing = false;
var penciling = true;
var penning = false;
var dragging = false;
var myColor = "black";

var penStart = {x: 0, y: 0};
var penEnd = {x: 0, y: 0};

// function preload() {
//   cursor = loadImage('https://cdn.hyperdev.com/feca3b9d-2ddb-43ff-98fa-57abfe77506b%2Fpointer.png');
// }

function convertMS( milliseconds ) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    var d = new Date();
    var month = d.getUTCMonth();
    return {
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

$( document ).ready(function() {
  socket.on('updatelines', function (data) {
    console.log("updating existing lines");
    Lines = data;
    var currTime = convertMS(Date.now());
    console.log(currTime.month);
    //if last drawing is not from today, add a new day to Lines
    // if (Lines[Lines.length - 1].day != today){
    //   Lines.push({day: today, line: []})
    // }
    console.log(data);
  });

  $("#pencil").click(function(){
    //only add extra shadow if it doesn't already have one
    if (!$('#pencil-shadow').length){
      $("#pencil-container").append("<div id='pencil-shadow' class='shadow'></div>");
      $("#pen-shadow").remove();
      $("#eraser-shadow").remove();
      penciling = true;
      penning = false;
      erasing = false;
    }
    
  })
  $("#pen").click(function(){
    //only add extra shadow if it doesn't already have one
    if (!$('#pen-shadow').length){
      $("#pen-container").append("<div id='pen-shadow' class='shadow'></div>");
      $("#pencil-shadow").remove();
      $("#eraser-shadow").remove();
      penciling = false;
      penning = true;
      erasing = false;
    }
  })
  $("#eraser").click(function(){
    //only add extra shadow if it doesn't already have one
    if (!$('#eraser-shadow').length){
      $("#eraser-container").append("<div id='eraser-shadow' class='shadow'></div>");
      $("#pencil-shadow").remove();
      $("#pen-shadow").remove();
      penciling = false;
      penning = false;
      erasing = true;
    }
  })
  $("#color-picker").click(function(){
    
    if ($("#color-picker-extended").css("display") == "none"){
      $("#color-picker-extended").css("display", "inline-block");
    }
    else{
      $("#color-picker-extended").css("display", "none");
    }
  });
  $(".dot").click(function(){
    var oldColor = $("#color-picker").attr('class').split(' ')[1];
    myColor = $(this).attr('class').split(' ')[1];

    $('#color-picker').removeClass(oldColor);
    $('#color-picker').addClass(myColor);
    
    if ($(this).attr('id') !== "color-picker"){
      $("#color-picker-extended").css("display", "none");
    }
    
  });
      $('#fullpage').fullpage({
      autoScrolling: false,
      touchSensitivity: 10,
      scrollingSpeed: 800,
      navigation: true,
      navigationPosition: 'left',
      navigationTooltips: ['Today', 'April 9th','April 8th', 'April 7th', 'April 6th'],
      anchors: ['today', '4-9','4-8', '4-7', '4-6'],
      scrollOverflow: false
    });


});

function setup(){
  createCanvas(windowWidth, windowHeight *5);
  console.log("setup");
  today = day();

  prev = {};
  drawing = false;
  lastEmit = 0;

  id = round((hour()*60*60) +(minute()*60) + (second()) *random());
  console.log(socket.id);

  

  // socket.on('moving', function (data) {
        
  //       // Is the user drawing?
  //       if(data.drawing && clients[data.id]){
            
  //           // add line on the canvas. 

  //           Lines[Lines.length] = [clients[data.id].x, clients[data.id].y, data.x, data.y, clients[data.id].color];
  //       }
        
  //       // Saving the current client state
  //       clients[data.id] = data;
  //   if(!clients[data.id].color){
  //     clients[data.id].color = [random(100,255), random(100,255), random(100,255)];
  //   }
  //       clients[data.id].updated = now;
  //   });
}

function draw(){
  background(255);
  now = millis();
  stroke(0)


  for (var i = 0 ; i < Lines.length; i++){

    var l = Lines[i];
    strokeWeight(4);
    if (l[4].r == 255 && l[4].b == 255 && l[4].g == 255){
      strokeWeight(20);
    }
    stroke(color(l[4].r, l[4].g, l[4].b));

    line(l[0],l[1],l[2],l[3]);
  }
  
  for(var c in clients){
    image(cursor, clients[c].x, clients[c].y)
  }
  if (penning && dragging){
    console.log("penning");
    var lineColor = getLineColor();
    stroke(color(lineColor.r, lineColor.g, lineColor.b));
    //stroke(color(0, 0, 0));
    strokeWeight(2);
    
    line(penStart.x, penStart.y, mouseX, mouseY);
  }
  
}

function getLineColor(){
  var lineColor = {r: 0, g: 0, b: 0};
  if (myColor == "blue"){
    lineColor = {r: 22, g: 26, b: 255}
  }
  else if (myColor == "purple"){

    lineColor = {r: 154, g: 20, b: 226}
  }
  else if (myColor == "pink"){
    lineColor = {r: 232, g: 32, b: 215}
  }
  else if (myColor == "red"){
    lineColor = {r: 209, g: 20, b: 39}
  }
  else if (myColor == "orange"){
    lineColor = {r: 229, g: 114, b: 13}
  }
  else if (myColor == "yellow"){
    lineColor = {r: 251, g: 255, b: 17}
  }
  else if (myColor == "green"){
    lineColor = {r: 42, g: 224, b: 103}
  }
  else if (myColor == "teal"){
    lineColor = {r: 19, g: 216, b: 213}
  }
  return lineColor;
}


function mouseDragged(){
    console.log("drag");
  dragging = true;
  if(drawing){ // adding your own line
    lineColor = {r: 0, g: 0, b: 0};
      if (erasing){
        
        console.log("erasing")
        Lines[Lines.length] = [prev.x, prev.y, mouseX, mouseY, {r: 255, g: 255, b: 255}];
        socket.emit('newLines', Lines[Lines.length - 1]);
      }

      else if (penciling){
        console.log("penciling");
        
        Lines[Lines.length] = [prev.x, prev.y, mouseX, mouseY, getLineColor()];
        socket.emit('newLines', Lines[Lines.length - 1]);
      }
      
  }
  drawing = true;
  prev.x = mouseX;
    prev.y = mouseY;
    if(now - lastEmit > 30){
            socket.emit('mousemove',{
                'x': mouseX,
                'y': mouseY,
                'drawing': drawing,
                'id': id
            });
            lastEmit = now;
        }
    }

function mouseMoved(){
  if(now - lastEmit > 30){
      
            socket.emit('mousemove',{
                'x': mouseX,
                'y': mouseY,
                'drawing': drawing,
                'id': id
            });
            lastEmit = now;
        }

}
    // Remove inactive clients after 10 seconds of inactivity
    setInterval(function(){
        
        for(ident in clients){
            if(now - clients[ident].updated > 10000){
                
                // Last update was more than 10 seconds ago. 
                // This user has probably closed the page
                if (cursors[ident] != undefined){
                        cursors[ident].remove();
                  delete clients[ident];
        }

            }
        }
        
    },10000);

function mousePressed(){
  console.log("mousePressed");
  if (penning){
    penStart.x = mouseX;
    penStart.y = mouseY;
  }
  
}

function mouseReleased(){
  console.log("released");
  dragging = false;
  drawing = false;
  if (penning){

    Lines[Lines.length] = [penStart.x, penStart.y, mouseX, mouseY, getLineColor()];
    socket.emit('newLines', Lines[Lines.length - 1]);
  }

}