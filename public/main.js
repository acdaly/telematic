
function nextGrayBubble(chatID, questions, grayIndex, sentenceIndex, white_text, gray_text){
    if (grayIndex < questions.length){    
        grayIndex += 1;
        sentenceIndex = 0;
        white_text.html("");
        gray_text.html(getGrayBubble(questions, grayIndex));
        setTimeout(function(){$(chatID).fadeIn(500, function(){});}, 3000); 
    }
}

function getGraySentence(questions, grayIndex, sentenceIndex){
    var gray_copy = questions[grayIndex][sentenceIndex].toLowerCase();
    gray_copy = gray_copy.substring(0, gray_copy.length - 1); //remove space
    var lastChar = gray_copy.slice(gray_copy.length - 1);
    if (lastChar == "?" || lastChar == "."){ 
        gray_copy = gray_copy.substring(0, gray_copy.length - 1);
    }
    console.log(gray_copy);
    return gray_copy;
}

// function showResult(emitMsg, chatID)
// {   
//     if (grayIndex < questions.length && sentenceIndex < questions[grayIndex].length){
//         var gray_sentence = getGraySentence(questions, grayIndex, sentenceIndex);
//         if (rec.resultString == gray_sentence){
//             var curr_white_text = white_text.html();
//             curr_white_text += questions[grayIndex][sentenceIndex];
//             white_text.html(curr_white_text);
//             sentenceIndex += 1;
//             if (sentenceIndex == questions[grayIndex].length){
//                 socket.emit(emitMsg, getGrayBubble());
//             }
//             setTimeout(function(){$(chatID).fadeOut(3000, function(){});}, 3000);   
//         }
//     }
//     console.log(rec.resultString); // log the result
// }

function getGrayBubble(questions, grayIndex){
    var text = "";
    for (var i = 0; i < questions[grayIndex].length; i++){
        text += questions[grayIndex][i];
    }
    console.log(text);
    return text; 
}

// function setup() {
//     gray_text = select("#gray_text");
//     gray_text.html(getGrayBubble(questions, grayIndex));
//     white_text = select("#white_text");
//     white_text.html("");
// }
