## Usage

Fade an image from one `src` to another, all with one line of JavaScript.

```javascript
$('img').fadeToSrc("http://images.com/new_image.png");
```

You can also give it a few options:

```javascript
$('img').fadeToSrc("http://images.com/new_image.png", {
  fadeInLength: 1000,
  fadeOutLength: 2000,
  fadeInEasing: 'ease-in',
  fadeOutEasing: 'ease-out'
});
```

Or even a callback:

```javascript
$('img').fadeToSrc("http://images.com/new_image.png", function () {
  alert("We're done!");
});

```

## Installation

Just include `jquery.image.fadeto.js` as a script tag on the page. Bonus points for incorporating it into your asset pipeline.

## About

jquery.image.fadeto.js was originally developed for [LayerVault](http://layervault.com) by [Kelly Sutton](http://kellysutton.com).

You can see more projects from LayerVault in the [LayerVault Cosmos](http://cosmos.layervault.com).
