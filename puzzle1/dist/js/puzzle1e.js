console.log("puzzle1e.js loaded");
$(document).ready(function () {
  $("#table_div").hide().delay(2000).fadeIn(2200);
});

function myFunction() {
  var data = document.getElementById("cleartext_input").value;
  var data_no_space;
  var data_no_space = data.replace(/\s+/g, "");
  if (
    data_no_space.toUpperCase() == "MUKGEINEXTLOOKFORNORMORDERPICKLEPIE." ||
    data_no_space.toUpperCase() == "MUKGEINEXTLOOKFORNORMORDERPICKLEPIE"
  ) {
    window.location.href = "./puzzle1f.html";
  } else {
    alert(data_no_space.toUpperCase() + " is not the correct cleartext!");
  }
  return false;
}

$(document).ready(function () {
  $(window).keydown(function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  });
});
