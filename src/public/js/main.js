/*
	Radius by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function ($) {
  skel.breakpoints({
    xlarge: "(max-width: 1680px)",
    large: "(max-width: 1280px)",
    medium: "(max-width: 980px)",
    small: "(max-width: 736px)",
    xsmall: "(max-width: 480px)",
  });

  $(function () {
    var $window = $(window),
      $body = $("body"),
      $header = $("#header"),
      $navbar = $("#nav-bar"),
      $footer = $("#footer");

    $window.on("load", function () {
      window.setTimeout(function () {
        $header.addClass("hide");
      }, 1000);
    });

    // Disable animations/transitions until the page has loaded.
    $body.addClass("is-loading");

    $window.on("load", function () {
      window.setTimeout(function () {
        $body.removeClass("is-loading");
      }, 100);
    });

    // Fix: Placeholder polyfill.
    $("form").placeholder();

    // Prioritize "important" elements on medium.
    skel.on("+medium -medium", function () {
      $.prioritize(
        ".important\\28 medium\\29",
        skel.breakpoint("medium").active
      );
    });

    // Header.
    $header.each(function () {
      var t = jQuery(this),
        button = t.find(".button");

      button.click(function (e) {
        t.toggleClass("hide");

        if (t.hasClass("preview")) {
          return true;
        } else {
          e.preventDefault();
        }
      });
    });
    // Nav-bar
    $navbar.each(() => {
      var t = jQuery(this),
        inner = t.find(".inner"),
        links = t.find(".nav-link");

      links.click((e) => {
        for (var i = 0; i < links.length; i++) {
          links[i].addEventListener("click", function () {
            var current = document.getElementsByClassName("disabled");
            current[0].className = current[0].className.replace(
              " disabled",
              ""
            );
            this.className += " disabled";
          });
        }
        // e.preventDefault();
      });
    });

    // Footer.
    $footer.each(function () {
      var t = jQuery(this),
        inner = t.find(".inner"),
        button = t.find(".info");

      button.click(function (e) {
        t.toggleClass("show");
        e.preventDefault();
      });
    });
  });
})(jQuery);
