var width = 600,
  height = 450,
  centered;

$(document).ready( function() {
    $("#submitBtn").click( function() {
        var myInput = $("#studentInput").val();

        $("#myFeedback").text(myInput);
    });
});
