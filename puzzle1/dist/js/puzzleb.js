console.log("puzzle1b.js loaded");
$(document).ready(function () {
  $("#cipher_text_note").hide().delay(10000).fadeIn(2200);
});
$(document).ready(function () {
  $("#cipher_text_input_div").hide().delay(10000).fadeIn(2200);
});
var data;
$(".cipher_text_input_form").on("submit", function () {
  var data = document.getElementById("cipher_text_input").value;
  console.log(data, "data");
  if (data.toUpperCase() === "TRANSPOSITION CIPHER") {
    window.location.href = "./puzzle1c.html";
  } else {
    alert(data.toUpperCase() + " is not the correct cipher text!");
  }
  return false;
});

//MEXORMECPGEOORDIE.UITKNORKIKNLFORPLE
