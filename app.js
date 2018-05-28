// Config files

var characterLimitDisplay = true;
var explanationButtons = true;
var anotherQuestionButton = true;

var width = 600,
  height = 450,
  centered;

var firstInstructionFlag = false;

var moocletValueURL = "https://test.mooclet.com/engine/api/v1/value";
var instructorBubbleShown=false;
var studentBubbleShown=false;
var nowLoading = false;

var instructorBubbleText = '';
var studentBubbleText = '';
var questionText = '';
var questionIdx = 0;
var moocletId = 0;
var userId;
var lastLoggedResponse = 'LAST_LOGGED_RESPONSE';

var numCharacter = 0;
var characterLimit = 50;

function getMoocletQueryURL(myMoocletId) {
    return "https://test.mooclet.com/engine/api/v1/mooclet/" + myMoocletId + "/run?user_id=" + userId;
}

var getParameters = function (paramName) {
    // 리턴값을 위한 변수 선언
    var returnValue;

    // 현재 URL 가져오기
    var url = location.href;

    // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];
        if (varName.toUpperCase() == paramName.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
};

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
             '"learner": "' + userId + '",' + 
             '"mooclet": ' + moocletId + ',' + 
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
             '"learner": "' + userId + '",' + 
             '"mooclet": ' + moocletId + ',' + 
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
                 '"learner": "' + userId + '",' + 
                 '"mooclet": ' + moocletId + ',' + 
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
               '"learner": "' + userId + '",' + 
               '"mooclet": ' + moocletId + ',' + 
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

function initialize() {
    moocletId = getParameters("moocletId");
    userId = getParameters("userId");
    var condition = getParameters("condition");

    console.log(condition);

    if(condition == '1') {
        characterLimitDisplay = false;
        explanationButtons = false;
        anotherQuestionButton = false;
    }
    else {
        characterLimitDisplay = true;
        explanationButtons = true;
        anotherQuestionButton = true;
    }

    showLoading();
    // setProcessingSymbol();

    numCharacter = 0;
    printNumCharacters();

    hideInstructorBubble(true);
    hideStudentBubble(true);

    if(explanationButtons && characterLimitDisplay)
        disableExplanationButtons();
    else
        enableExplanationButtons();

    enableTextbox();

    loadQuestion(moocletId);

    // instructor explanation embedding


}

function loadQuestion(moocletId) {
    $.get({
            url: getMoocletQueryURL(moocletId),
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
             '"learner": "' + userId + '",' + 
             '"mooclet": ' + moocletId + ',' + 
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
             '"learner": "' + userId + '",' + 
             '"mooclet": ' + moocletId + ',' + 
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

    if(moocletId == 48) {
        if(questionText[0] == 'D') {
            instructorBubbleText = "The arithmetic mean is used as a measure of central tendency. It is calculated by sum of values divided by the number of objects.";
        }
        else if(questionText[0] == 'H') {
            instructorBubbleText = "The arithmetic mean is used as a measure of central tendency. It is calculated by sum of values divided by the number of objects.";
        }
        else if(questionText[0] == 'W' && questionText[5] == 'i') {
            instructorBubbleText = "The arithmetic mean";
        }
        else instructorBubbleText = '';

        if(firstInstructionFlag == false) {
			jQuery( "#dialog" ).dialog({
			   resizable: false,
			   height: "auto",
			   width: 450,
			   modal: true,
			   closeOnEscape: false,
			   open: function(event, ui) {
			       jQuery(".ui-dialog-titlebar-close").hide();
			       jQuery(".ui-dialog-titlebar").hide();
			   },
			   buttons: {
			       "I understood": function() {
			           jQuery( this ).dialog( "close" );
			
			        //   myVideo.play();
			       }
			   }
               });

            firstInstructionFlag = true;
        }

    }
    else if(moocletId == 49) {
        if(questionText[0] == 'D') {
            instructorBubbleText = "The population variance represents how dispersed the data is. It is calculated by sum of value minus mean squared by the number of objects.";
        }
        else if(questionText[0] == 'H') {
            instructorBubbleText = "The population variance represents how dispersed the data is. It is calculated by sum of value minus mean squared by the number of objects.";
        }
        else if(questionText[0] == 'W' && questionText[5] == 'i') {
            instructorBubbleText = "The population variance";
        }
        else instructorBubbleText = '';
    }
    else if(moocletId == 50) {
        if(questionText[0] == 'D') {
            instructorBubbleText = "The population standard deviation is used because we need to use a consistent measure. It is calculated by the square root of the variance.";
        }
        else if(questionText[0] == 'H') {
            instructorBubbleText = "The population standard deviation is used because we need to use a consistent measure. It is calculated by the square root of the variance.";
        }
        else if(questionText[0] == 'W' && questionText[5] == 'i') {
            instructorBubbleText = "The population standard deviation";
        }
        else instructorBubbleText = '';
    }
    else instructorBubbleText = '';

    hideLoading();
}

function keyPressEvent(event) {
    var response = $("#studentInput").val();

    updateLimit();
    //putResponse(response);

    //setCompleteSymbol();
}

function printNumCharacters() {
    $("#numLetters").text('Character count: ' + numCharacter + ' (minimum ' + characterLimit + ' characters)');
}

function updateLimit() {
    numCharacter = $("#studentInput").val().length;

    if(characterLimitDisplay) {
        if(numCharacter >= characterLimit) {
            enableExplanationButtons();
        }
        else {
            disableExplanationButtons();
        }
    }

    printNumCharacters();
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function showLoading() {
    $("#loading").show();
    $("#app").hide();

    nowLoading = true;
}

function hideLoading() {
    $("#loading").hide();
    $("#app").show();

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

function UISetup() {
    if(characterLimitDisplay) $("#numLetters").show();
    else $("#numLetters").hide();

    if(explanationButtons) {
        $("#studentBtn").show();
        $("#instructorBtn").show();

        if(characterLimitDisplay) disableExplanationButtons();
        else enableExplanationButtons();
    }
    else {
        $("#studentBtn").hide();
        $("#instructorBtn").hide();
    }

    if(anotherQuestionButton) $("#anotherQuestionBtn").show();
    else $("#anotherQuestionBtn").hide();
}

$(document).ready( function() {
    initialize();
    UISetup();

 /*   $("#submitBtn").click( function() {
        if(!$("#studentInput").prop('disabled')) {
            var myInput = $("#studentInput").val();

            enableExplanationButtons();
            disableTextbox();

            putResponse(myInput);
        }
    });*/

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

    $("#studentInput").bind('input propertychange', keyPressEvent);

    $("#anotherQuestionBtn").click(function() {
        initialize();

    $.ajax({
             type: 'POST',
             url: moocletValueURL,
             data: '{' + 
             '"variable": "anotherQuestionButton",' + 
             '"learner": "' + userId + '",' + 
             '"mooclet": ' + moocletId + ',' + 
             '"version": ' + questionIdx + ',' + 
             '"policy": null,' + 
             '"value": 0.0,' + 
             '"text": "",' + 
             '"timestamp": ""' + 
             '}', // or JSON.stringify ({name: 'jonas'}),
             success: onSuccessPuttingResponse,
             contentType: "application/json",
             dataType: 'json',
             headers: {"Authorization": "Token 80a7c6e452aeef4c3a1562aff199e409c44b90a9"}
          });
    });

    $("#helpBtn").click(function() {
        $("#dialog").dialog(
        {
           width: 400,
           height: 250
        });
    });

    var intervalID = setInterval(function(){
        var response = $("#studentInput").val();

        if(response != lastLoggedResponse) 
            putResponse(response);

        lastLoggedResponse = response;
    }, 500);
});
