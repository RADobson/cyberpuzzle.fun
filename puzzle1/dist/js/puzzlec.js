console.log("puzzle1c.js loaded");

jQuery(function ($) {
  var arr = new Array(
    "https://w7.pngwing.com/pngs/725/87/png-transparent-computer-keyboard-computer-icons-button-keyboard-electronics-text-computer-keyboard-thumbnail.png",
    "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/keyboard_key_c.png",
    "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/keyboard_key_u.png",
    "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/keyboard_key_l.png"
  );

  $.each($.shuffle(arr), function (_, src) {
    $(`<img  />`, {
      src: src,
      height: 100,
      width: 100,
    }).appendTo("#array");
  });
  $("button.array").click(function () {
    $("#array").shuffle();
  });
});

(function ($) {
  $.fn.shuffle = function () {
    var _self = this,
      children = $.shuffle(this.children().get());
    $.each(children, function () {
      _self.append(this);
    });
    return this;
  };

  $.shuffle = function (arr) {
    for (
      var j, x, i = arr.length;
      i;
      j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x
    );
    return arr;
  };
})(jQuery);

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
  $("#cipher_keyword_input_div").hide().delay(10000).fadeIn(2200);
});
function mission_failed() {
  alert("Mission Failed!");
}
var data;
$(".cipher_keyword_form").on("submit", function () {
  var data = document.getElementById("cipher_keyword_input").value;
  if (data.toUpperCase() == "CLUE") {
    window.location.href = "./puzzle1d.html";
  } else {
    alert(data.toUpperCase() + " is not the correct cipher key word!");
  }
  return false;
});
