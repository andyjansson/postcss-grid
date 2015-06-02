var postcss = require('postcss'),
	grid = require('../'),
	assert = require('assert');
	
var settings = {
	columns: 12,
	maxWidth: 960,
	gutter: 20
};

var test = function (input, output) {
    assert.equal(postcss(grid(settings)).process(input).css, output);
};

test('.element{grid-column: 1/12;}', '.element{float: left;width: 6.42361%;display: inline;margin-right: 2.08333%;}');
test('.element{grid-column: 1/12 !last;}', '.element{float: left;width: 6.42361%;}');
test('.element{grid-column: 6/12;}', '.element{float: left;width: 48.95833%;display: inline;margin-right: 2.08333%;}');
test('.element{grid-column: 3/6;}', '.element{float: left;width: 47.87234%;display: inline;margin-right: 4.25532%;}');
test('.element{grid-column: 12/12 !last;}', '.element{float: left;width: 100%;}');
test('.element{grid-push: 1/12;}', '.element{margin-left: 8.50694%;}');
test('.element{grid-pull: 1/12;}', '.element{margin-right: 8.50694%;}');
test('.element{width: grid-width(1/12);}', '.element{width: 6.42361%;}');
test('.element{margin-left: grid-gutter(12);}', '.element{margin-left: 2.08333%;}');
