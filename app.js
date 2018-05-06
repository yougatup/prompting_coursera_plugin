var width = 600,
  height = 450,
  centered;

var moocletQueryURL = "https://test.mooclet.com/engine/api/v1/mooclet/44/run";
var moocletValueURL = "https://test.mooclet.com/engine/api/v1/value";
var instructorBubbleShown=false;
var studentBubbleShown=false;
var nowLoading = false;

var instructorBubbleText = '';
var studentBubbleText = '';
var questionText = '';
var questionIdx = 0;

var numCharacter = 0;
var characterLimit = 50;

function showInstructorBubble() {
    $("#instructorBubble").text(instructorBubbleText);

    $("#instructorBubble").show();
    $("#studentBubble").hide();

    instructorBubbleShown = true;
    studentBubbleShown = false;

    $.ajax({
             type: 'POST',
             url: moocletValueURL,
             data: '{' + 
             '"variable": "instructorButton",' + 
             '"learner": null,' + 
             '"mooclet": 44,' + 
             '"version": ' + questionIdx + ',' + 
             '"policy": null,' + 
             '"value": 0.0,' + 
             '"text": "' + instructorBubbleText + '",' + 
             '"timestamp": ""' + 
             '}', // or JSON.stringify ({name: 'jonas'}),
             success: onSuccessPuttingResponse,
             contentType: "application/json",
             dataType: 'json',
             headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
          });
}

function showStudentBubble() {
    $("#studentBubble").text(studentBubbleText);

    $("#instructorBubble").hide();
    $("#studentBubble").show();

    instructorBubbleShown = false;
    studentBubbleShown = true;

    $.ajax({
             type: 'POST',
             url: moocletValueURL,
             data: '{' + 
             '"variable": "studentButton",' + 
             '"learner": null,' + 
             '"mooclet": 44,' + 
             '"version": ' + questionIdx + ',' + 
             '"policy": null,' + 
             '"value": 0.0,' + 
             '"text": "' + studentBubbleText + '",' + 
             '"timestamp": ""' + 
             '}', // or JSON.stringify ({name: 'jonas'}),
             success: onSuccessPuttingResponse,
             contentType: "application/json",
             dataType: 'json',
             headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
          });
}

function hideInstructorBubble(flag) {
    $("#instructorBubble").hide();
    instructorBubbleShown = false;

    if(flag == false) {
        $.ajax({
                 type: 'POST',
                 url: moocletValueURL,
                 data: '{' + 
                 '"variable": "instructorButton",' + 
                 '"learner": null,' + 
                 '"mooclet": 44,' + 
                 '"version": ' + questionIdx + ',' + 
                 '"policy": null,' + 
                 '"value": 1.0,' + 
                 '"text": "",' + 
                 '"timestamp": ""' + 
                 '}', // or JSON.stringify ({name: 'jonas'}),
                 success: onSuccessPuttingResponse,
                 contentType: "application/json",
                 dataType: 'json',
                 headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
              });
    }
}

function hideStudentBubble(flag) {
    $("#studentBubble").hide();
    studentBubbleShown = false;

    if(flag == false) {
      $.ajax({
               type: 'POST',
               url: moocletValueURL,
               data: '{' + 
               '"variable": "studentButton",' + 
               '"learner": null,' + 
               '"mooclet": 44,' + 
               '"version": ' + questionIdx + ',' + 
               '"policy": null,' + 
               '"value": 1.0,' + 
               '"text": "",' + 
               '"timestamp": ""' + 
               '}', // or JSON.stringify ({name: 'jonas'}),
               success: onSuccessPuttingResponse,
               contentType: "application/json",
               dataType: 'json',
               headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
            });
    }
}

function toggleInstructorBubble() {
    if(instructorBubbleShown == true) {
        hideInstructorBubble(false);
    }
    else {
        showInstructorBubble();
    }
}

function toggleStudentBubble() {
    if(studentBubbleShown == true) {
        hideStudentBubble(false);
    }
    else {
        showStudentBubble();
    }
}

function disableExplanationButtons() {
    $(".smallBtn").removeClass("clickable blue");
    $(".smallBtn").addClass("disabled");

    hideStudentBubble(true);
    hideInstructorBubble(true);
}

function setProcessingSymbol() {
    $("#feedbackSymbol").css("border", "2px solid #999999");
    $("#feedbackSymbol").css("background-color", "#999999");

    $("#feedbackText").css("color", "#999999");
}

function setCompleteSymbol() {
    $("#feedbackSymbol").css("border", "2px solid #5cb85c");
    $("#feedbackSymbol").css("background-color", "#5cb85c");

    $("#feedbackText").css("color", "#5cb85c");
}

function setErrorSymbol() {
    $("#feedbackSymbol").css("border", "2px solid red");
    $("#feedbackSymbol").css("background-color", "red");

    $("#feedbackText").css("color", "red");
}

function enableExplanationButtons() {
    $(".smallBtn").removeClass("disabled");
    $(".smallBtn").addClass("clickable blue");
}

function addKeypressEvent() {
    $("#studentInput").bind('input propertychange', keyPressEvent);
}

function initialize() {
    showLoading();
    addKeypressEvent();
    // setProcessingSymbol();

    numCharacter = 0;
    printNumCharacters();

    hideInstructorBubble(true);
    hideStudentBubble(true);

    disableExplanationButtons();
    enableTextbox();

    loadQuestion();
}

function loadQuestion() {
    $.get({
            url: moocletQueryURL,
            data:'',
            success: onSuccessLoadingQuestion,
            dataType: "json",
            headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
          });
}

function putResponse(learnerResponse) {
    learnerResponse = learnerResponse.replace(/(\r\n\t|\n|\r\t)/gm," ");
    learnerResponse = learnerResponse.replace(/([\"\'])/g,"'");
    learnerResponse = learnerResponse.replace(/\\/g,"\\\\");

    console.log(learnerResponse);

    $.ajax({
             type: 'POST',
             url: moocletValueURL,
             data: '{' + 
             '"variable": "learnerResponse",' + 
             '"learner": null,' + 
             '"mooclet": 44,' + 
             '"version": ' + questionIdx + ',' + 
             '"policy": null,' + 
             '"value": 0.0,' + 
             '"text": "' + learnerResponse + '",' + 
             '"timestamp": ""' + 
             '}', // or JSON.stringify ({name: 'jonas'}),
             success: onSuccessPuttingResponse,
             contentType: "application/json",
             dataType: 'json',
             headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
          });
}

function onSuccessPuttingResponse(data) {
    console.log(data);
}

function onSuccessLoadingQuestion(data) {
    questionText = data.text;
    questionIdx = data.id;

    console.log(questionText);

    $.ajax({
             type: 'POST',
             url: moocletValueURL,
             data: '{' + 
             '"variable": "questionGet",' + 
             '"learner": null,' + 
             '"mooclet": 44,' + 
             '"version": ' + questionIdx + ',' + 
             '"policy": null,' + 
             '"value": 0.0,' + 
             '"text": "' + questionText + '",' + 
             '"timestamp": ""' + 
             '}', // or JSON.stringify ({name: 'jonas'}),
             success: onSuccessPuttingResponse,
             contentType: "application/json",
             dataType: 'json',
             headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
          });
    $("#question").text(questionText);

    hideLoading();
}

function keyPressEvent(event) {
    var response = $("#studentInput").val();

    updateLimit();
    putResponse(response);

    //setCompleteSymbol();
}

function printNumCharacters() {
    $("#numLetters").text('Character count: ' + numCharacter + ' (minimum ' + characterLimit + ' characters)');
}

function updateLimit() {
    numCharacter = $("#studentInput").val().length;

    if(numCharacter >= characterLimit) {
        enableExplanationButtons();
    }
    else {
        disableExplanationButtons();
    }

    printNumCharacters();
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function showLoading() {
    $("#loading").show();
    nowLoading = true;
}

function hideLoading() {
    $("#loading").hide();
    nowLoading = false;
}

function refreshQuestion() {
}

function disableTextbox() {
    $("#studentInput").prop('disabled', true);
    $("#studentInput").css("background-color", "#eeeeee");
    $("#studentInput").css("border-color", "#000000");
}

function enableTextbox() {
    $("#studentInput").prop('disabled', false);
    $("#studentInput").css("background-color", "#ffffff");
    $("#studentInput").css("border-color", "#ffffff");

    $("#studentInput").val('');
}

$(document).ready( function() {
    initialize();

    $("#submitBtn").click( function() {
        if(!$("#studentInput").prop('disabled')) {
            var myInput = $("#studentInput").val();

            enableExplanationButtons();
            disableTextbox();

            putResponse(myInput);
        }
    });

    $("#instructorBtn").click(function() {
        if($("#instructorBtn").hasClass("clickable")) {
            toggleInstructorBubble();
        }
    });
    
    $("#studentBtn").click(function() {
        if($("#studentBtn").hasClass("clickable")) {
            toggleStudentBubble();
        }
    });

    $("#anotherQuestionBtn").click(function() {
        initialize();
    });

    $("#helpBtn").click(function() {
        $("#dialog").dialog(
        {
           width: 400,
           height: 250
        });
    });
});
