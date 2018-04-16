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

function showInstructorBubble() {
    $("#instructorBubble").text(instructorBubbleText);

    $("#instructorBubble").show();
    $("#studentBubble").hide();

    instructorBubbleShown = true;
    studentBubbleShown = false;
}

function showStudentBubble() {
    $("#studentBubble").text(studentBubbleText);

    $("#instructorBubble").hide();
    $("#studentBubble").show();

    instructorBubbleShown = false;
    studentBubbleShown = true;
}

function hideInstructorBubble() {
    $("#instructorBubble").hide();
    instructorBubbleShown = false;
}

function hideStudentBubble() {
    $("#studentBubble").hide();
    studentBubbleShown = false;
}

function toggleInstructorBubble() {
    if(instructorBubbleShown == true) {
        hideInstructorBubble();
    }
    else {
        showInstructorBubble();
    }
}

function toggleStudentBubble() {
    if(studentBubbleShown == true) {
        hideStudentBubble();
    }
    else {
        showStudentBubble();
    }
}

function disableExplanationButtons() {
    $(".smallBtn").removeClass("clickable blue");
    $(".smallBtn").addClass("disabled");
}

function enableExplanationButtons() {
    $(".smallBtn").removeClass("disabled");
    $(".smallBtn").addClass("clickable blue");
}

function initialize() {
    showLoading();

    hideInstructorBubble();
    hideStudentBubble();

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

    $("#question").text(questionText);

    hideLoading();
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
