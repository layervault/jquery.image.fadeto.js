/*
 * jquery.image.fadeto.js
 *
 * Fade an <img> to a new source, all using CSS3 animations.
 */
(function($) {
  var
    setup,
    hasSetup,
    options,
    prefixes,
    randomClass;

  options = {
    fadeInLength: 250,
    fadeOutLength: 250,
    callback: null,
    fadeOutEasing: 'ease-in',
    fadeInEasing:  'ease-out'
  };

  prefixes = [
    '',
    '-webkit-',
    '-moz-'
  ];

  // Generate a random throwaway class
  randomClass = function () {
    return "LV-" + Math.floor(Math.random() * 100000000);
  };

  setup = function (opts) {
    var
      $head  = $('head'),
      $style = $('<style></style>'),
      fadeInTransition,
      fadeOutTransition,
      fadeInClass = randomClass(),
      fadeOutClass = randomClass();

    options = $.extend(options, opts);

    fadeInTransition = $.map(prefixes, function (p) {
      return p + "transition: opacity " + options.fadeInLength + "ms " + options.fadeInEasing + ";"
    }).join(' ');

    fadeOutTransition = $.map(prefixes, function (p) {
      return p + "transition: visibility 0s " + options.fadeOutLength + "ms, opacity " + options.fadeInLength + "ms " + options.fadeInEasing + ";"
    }).join(' ');

    $style.html(
      "." + fadeInClass  + " { visibility: visible; opacity: 1; " + fadeInTransition  + " } " +
      "." + fadeOutClass + " { visibility: hidden;  opacity: 0; " + fadeOutTransition + " }"
    );

    $head.append($style);

    return {
      $style  : $style,
      fadeIn  : fadeInClass,
      fadeOut : fadeOutClass
    };
  };

  //-- Methods to attach to jQuery sets

  $.fn.fadeTo = function(newSource, opts, callback) {
    var
      $e = $(this),
      classes,
      newImage;

    if (typeof opts === "function") {
      opts = {
        callback: opts
      }
    }
    else if (typeof callback !== "undefined") {
      opts.callback = callback
    }

    // We're not dealing with an image tag. Bail out.
    if ($e.attr('tagName').toLowerCase() !== "img") {
      return;
    }

    classes = setup(opts);

    newImage = new Image();

    newImage.onload = function () {
      $e.addClass(classes.fadeOut);
      window.setTimeout(function () {
        $e.attr('src', newSource);
        $e.addClass(classes.fadeIn);
        $e.removeClass(classes.fadeOut);
        window.setTimeout(function () {
          $e.removeClass(classes.fadeIn);
          classes.$style.remove();

          if (typeof options.callback === "function") {
            options.callback();
          }
        }, options.fadeInLength);
      }, options.fadeOutLength);
      newImage.onload = null;
    };

    newImage.src = newSource;
  };
})(jQuery);
