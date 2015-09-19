# postcss-grid [![Build Status][ci-img]][ci]

A semantic grid system for [PostCSS]

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/andyjansson/postcss-grid.svg
[ci]:      https://travis-ci.org/andyjansson/postcss-grid

## Installation

```js
npm install postcss-grid
```

## Usage

```js
var fs = require('fs');
var postcss = require('postcss');
var grid = require('postcss-grid');

var css = fs.readFileSync('input.css', 'utf8');

var options = {
  columns: 12, // the number of columns in the grid
  maxWidth: 960, // the maximum width of the grid (in px)
  gutter: 20, // the width of the gutter (in px)
  legacy: false // fixes the double-margin bug in older browsers. Defaults to false
};

var output = postcss()
  .use(grid(options))
  .process(css)
  .css;
```

### Columns

Columns are created by using the `grid-column` declaration and passing a `/`-delimited value. This value contains the number of columns the element should span, separated by the total number of columns in the element's container.


**Example**:

```css
.element {
  grid-column: 1/12;
}
```

Turns into:

```css
.element{
  float: left;
  width: 6.42361%;
  margin-right: 2.08333%;
}
```

You can also use it in conjunction with the `!last` declaration to make sure that the last element of the row doesn't allocate a gutter, pushing itself to the next row.

**Example**:

```css
.element {
  grid-column: 1/2 !last;
}
```

Turns into:

```css
.element{
  float: left;
  width: 6.42361%;
}
```

### Offsetting elements

Elements can be offset to the left and the right by using `grid-pull` and `grid-push`.

**Example**:

```css
.push {
  grid-push: 1/12;
}
.pull {
  grid-pull: 1/12;
}
```

Turns into:

```css
.push {
  margin-left: 8.50694%;
}
.pull {
  margin-right: 8.50694%;
}
```

### Width and gutter values

The width and gutter values can be retrieved by calling `grid-width(...)` and `grid-gutter(...)` from a declaration.

**Example**:

```css
.element {
  width: grid-width(1/12);
  margin-left: grid-gutter(12);
}
```

Turns into:

```css
.element {
  width: 6.42361%;
  margin-left: 2.08333%;
}
```
