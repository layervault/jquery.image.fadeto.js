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
    randomClass,
    positionNewImage,
    positionClassesFrom;

  options = {
    fadeLength      : 1000,
    callback        : null,
    fadeOutEasing   : 'ease-in-out',
    fadeInEasing    :  'ease-in-out',
    hijackClasses   : true
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
      fadeOutClass = randomClass(),
      zeroOpacityClass = randomClass();

    options = $.extend(options, opts);

    fadeInTransition = $.map(prefixes, function (p) {
      return p + "transition: opacity " + options.fadeLength + "ms " + options.fadeLength
    }).join(' ');

    fadeOutTransition = $.map(prefixes, function (p) {
      return p + "transition: visibility 0s " + options.fadeLength + "ms, opacity " + options.fadeLength + "ms " + options.fadeInEasing + ";"
    }).join(' ');

    $style.html(
      "." + fadeInClass       + " { visibility: visible; opacity: 1; " + fadeInTransition  + " } " +
      "." + fadeOutClass      + " { visibility: hidden;  opacity: 0; " + fadeOutTransition + " }" +
      "." + zeroOpacityClass  + " { visibility: visible; opacity: 0; }"
    );

    $head.append($style);

    return {
      $style      : $style,
      fadeIn      : fadeInClass,
      fadeOut     : fadeOutClass,
      zeroOpacity : zeroOpacityClass
    };
  };

  /*
    Create a throwaway class to aboslutely posiiton an image.
  */
  positionClassesFrom = function ($oldImage) {
    var
      transitionImagePositionClass = randomClass(),
      oldImagePositionClass = randomClass(),
      $head  = $('head'),
      $style = $('<style></style>'),
      top,
      left,
      zIndex = parseInt($oldImage.attr('z-index'), 10);

    if (typeof $oldImage === "undefined" || $oldImage.length === 0) {
      return null;
    }

    if (isNaN(zIndex)) {
      zIndex = 1;
    }

    top = $oldImage.position().top;
    left = $oldImage.position().left;

    $style.html(
      "." + transitionImagePositionClass + " { position: absolute; top: " + top + "px; left: " + left + "px; z-index: " + zIndex +"; }" +
      "." + oldImagePositionClass + "{ position: absolute; top: " + top + "px; left: " + left + "px; z-index: " + (zIndex + 1) + "; }"
    );

    $head.append($style);

    return {
      oldImage        : oldImagePositionClass,
      transitionImage : transitionImagePositionClass,
      $style          : $style
    }
  };

  positionNewImage = function ($newImage, $oldImage) {
    var classes = positionClassesFrom($oldImage)

    $newImage.data('positionClass', classes.transitionImage);
    $newImage.addClass($newImage.data('positionClass'));

    $oldImage.addClass(classes.oldImage);

    return classes;
  };

  //-- Methods to attach to jQuery sets

  $.fn.fadeToSrc = function(newSource, opts, callback) {
    var
      $e = $(this),
      classes,
      transitionClasses,
      $transitionImage = $('<img />'),
      $newImage = $('<img />'),
      $imageParent;

    if (typeof opts === "function") {
      opts = {
        callback: opts
      }
    }
    else if (typeof callback !== "undefined") {
      opts.callback = callback
    }

    if ($e.length === 0) {
      return;
    }

    // We're not dealing with an image tag. Bail out.
    if ($e.get(0).tagName.toLowerCase() !== "img") {
      return;
    }

    classes = setup(opts);
    transitionClasses = positionNewImage($transitionImage, $e);

    $('body').append($transitionImage);

    newImage = new Image();

    // Start things up once the image is loaded so we don't experience flashes of background.
    newImage.onload = function () {
      $transitionImage.attr('src', newSource);
      $newImage.attr('src', newSource);

      $e.addClass(classes.fadeOut);

      // Once the fades are done, remove the original image and shuffle new image into the correct
      // place on the DOM.
      window.setTimeout(function () {
        $imageParent = $e.parent();

        // Hijack all of the classes from the original image to ensure proper positioning.
        if (options.hijackClasses) {
          $.each($e.get(0).classList, function (index, item) {
            $newImage.addClass(item);
          });
        }

        // Clean up after ourselves
        $e.remove();
        $imageParent.append($newImage);
        classes.$style.remove();
        transitionClasses.$style.remove();
        $transitionImage.remove();

        if (typeof options.callback === "function") {
          options.callback();
        }
      }, options.fadeLength);

      // Detach
      newImage.onload = null;
    };

    // Get things started.
    newImage.src = newSource;
  };
})(jQuery);
