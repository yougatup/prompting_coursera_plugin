var width = 600,
  height = 450,
  centered;

var instructorBubbleShown=false;
var studentBubbleShown=false;

var questionIdx = 0;

var myData = [
 ["Describe what you have learned so far.",
 "Instructor's explanation", 
 ["Student's explanation 1", "Student's expxlanation 2"]],

 ["Describe whatever you want.",
 "Instructor's explanation 2", 
 ["Student's explanation 3", "Student's expxlanation 4"]]

]

function showInstructorBubble() {
    $("#instructorBubble").text(myData[questionIdx][1]);

    $("#instructorBubble").show();
    $("#studentBubble").hide();

    instructorBubbleShown = true;
    studentBubbleShown = false;
}

function showStudentBubble() {
    $("#studentBubble").text(myData[questionIdx][2][0]);

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
    hideInstructorBubble();
    hideStudentBubble();

    disableExplanationButtons();
    enableTextbox();

    refreshQuestion();
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function refreshQuestion() {
    questionIdx = getRandomArbitrary(0, myData.length);

    $("#question").text(myData[questionIdx][0]);
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
        var myInput = $("#studentInput").val();

        enableExplanationButtons();
        disableTextbox();
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
