var rec;
var gray_text;
var white_text;
var matchFound = false;
//all sentences must end in a space
var questions = [["I think I'm doing okay. " ],
                 ["Not much. "],
                 ["I know. "],
                 ["The testing is almost done "],
                 ["Last. "]];

var charIndex = 0;
var grayIndex = -1;
var sentenceIndex = 0;
var qIndex = 0;

var socket = io();

function nextGrayBubble(){
    console.log("next chat bubble");
    if (grayIndex < questions.length){
        grayIndex += 1;
        sentenceIndex = 0;
        white_text.html("");
        gray_text.html(getGrayBubble());
        setTimeout(function(){$("#me").fadeIn(500, function(){});}, 3000); 
    }
}

function getGraySentence(){
    var gray_copy = questions[grayIndex][sentenceIndex].toLowerCase();
    gray_copy = gray_copy.substring(0, gray_copy.length - 1); //remove space
    var lastChar = gray_copy.slice(gray_copy.length - 1);
    if (lastChar == "?" || lastChar == "."){ 
        gray_copy = gray_copy.substring(0, gray_copy.length - 1);
    }
    console.log(gray_copy);
    return gray_copy;
}

function showResult()
{   
    if (grayIndex < questions.length && sentenceIndex < questions[grayIndex].length){
        if (!matchFound){
            var gray_sentence = getGraySentence();
            if (rec.resultString.toLowerCase() == gray_sentence.toLowerCase()){
                console.log("equal");
                matchFound = true;
                var curr_white_text = white_text.html();
                console.log("whitetext: " + curr_white_text);
                curr_white_text += questions[grayIndex][sentenceIndex];
                white_text.html(curr_white_text);
                sentenceIndex += 1;
                matchFound = false;
                
                if (sentenceIndex == questions[grayIndex].length){
                    socket.emit('new_A_msg', getGrayBubble());
                    setTimeout(function(){$("#me").fadeOut(3000, function(){});}, 3000);   
                }   
            }
        }
    }
    // gray_text.html(rec.resultString);
    console.log(rec.resultString); // log the result

}

function getGrayBubble(){
    var text = "";
    for (var i = 0; i < questions[grayIndex].length; i++){
        text += questions[grayIndex][i];
    }
    console.log(text);
    return text;    
}

function setup() {
    gray_text = select("#gray_text");
    gray_text.html("");
    white_text = select("#white_text"); 
    white_text.html("");
}

$(document).ready(function(){
    $("body").keypress(function(e) {
        if (e.key == " ") {
            console.log("new recording");
            rec = new p5.SpeechRec('en-US', showResult); // speech recognition object (will prompt for mic access)
            rec.continuous = true;
            rec.onResult = showResult; // bind callback function to trigger when speech is recognized
            rec.interimResults = true;
            rec.start(); // start listening
        }
    });
    socket.on('B_msg_recieve', function(msg){
        console.log('message: ' + msg);
        $("#B_msg").html(msg);
        $("#them").fadeIn(500, function(){});
        setTimeout(function(){
            nextGrayBubble();
            setTimeout(function(){
                $("#them").fadeOut(1500, function(){});
            }, 1500);
        }, 1500);
    });
});
