console.log("pizza1f.js loaded");
(function (d, s, id, u) {
  if (d.getElementById(id)) return;
  var js,
    sjs = d.getElementsByTagName(s)[0],
    t = Math.floor(new Date().getTime() / 1000000);
  js = d.createElement(s);
  js.id = id;
  js.async = 1;
  js.src = u + "?" + t;
  sjs.parentNode.insertBefore(js, sjs);
})(
  document,
  "script",
  "os-widget-jssdk",
  "https://www.opinionstage.com/assets/loader.js"
);

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
  $("#quiz_div").hide().delay(11000).fadeIn(6000);
});
