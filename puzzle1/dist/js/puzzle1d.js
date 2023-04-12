console.log("pizza1d.js loaded");
$(document).ready(function () {
  $("#array").hide().delay(9000).fadeIn(2200);
});
$(document).ready(function () {
  $("#mybutton2").hide().delay(9000).fadeIn(2200);
});
$(document).ready(function () {
  $("#keyboard_wrap").hide().delay(6000).fadeIn(2200);
});
$(document).ready(function () {
  $("#table_div").hide().delay(14000).fadeIn(6000);
});
function mission_failed() {
  alert("Mission Failed!");
}
var data;
$(".table_form").on("submit", function () {
  var data = document.getElementById("table_form");
  var txt = "";
  var txt_slice = "";
  var i;
  for (i = 0; i < data.length; i++) {
    txt = txt + data.elements[i].value;
  }
  txt_slice = txt.slice(0, -6);
  if (txt_slice.toUpperCase() == "CLUE") {
    window.location.href = "./puzzle1e.html";
  } else {
    alert(txt_slice.toUpperCase() + " is not the correct plain text string!");
  }
  return false;
});
$("input").keydown(function (e) {
  var textInput = this;
  var val = textInput.value;
  var isAtStart = false,
    isAtEnd = false;
  var cellindex = $(this).parents("td").index();
  if (typeof textInput.selectionStart == "number") {
    // Non-IE browsers

    isAtStart = textInput.selectionStart == 0;
    isAtEnd = textInput.selectionEnd == val.length;
  } else if (document.selection && document.selection.createRange) {
    // IE <= 8 branch
    textInput.focus();
    var selRange = document.selection.createRange();
    var inputRange = textInput.createTextRange();
    var inputSelRange = inputRange.duplicate();
    inputSelRange.moveToBookmark(selRange.getBookmark());
    isAtStart = inputSelRange.compareEndPoints("StartToStart", inputRange) == 0;
    isAtEnd = inputSelRange.compareEndPoints("EndToEnd", inputRange) == 0;
  }

  // workaround for text inputs of 'number' not working in Chrome... selectionStart/End is null.  Can no longer move cursor left or right inside this field.
  if (textInput.selectionStart == null) {
    if (e.which == 37 || e.which == 39) {
      isAtStart = true;
      isAtEnd = true;
    }
  }

  if (e.which == 37) {
    if (isAtStart) {
      $(this).closest("td").prevAll("td").find("input").focus();
    }
  }
  if (e.which == 39) {
    if (isAtEnd) {
      $(this)
        .closest("td")
        .nextAll("td")
        .find("input")
        .not(":hidden")
        .first()
        .focus();
    }
  }
  if (e.which == 40) {
    $(e.target)
      .closest("tr")
      .nextAll("tr")
      .find("td")
      .eq(cellindex)
      .find(":text")
      .focus();
  }
  if (e.which == 38) {
    $(e.target)
      .closest("tr")
      .prevAll("tr")
      .first()
      .find("td")
      .eq(cellindex)
      .find(":text")
      .focus();
  }
});

// MUKGEINEXTLOOKFORNORMORDERPICKLEPIE
