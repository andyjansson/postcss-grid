var postcss = require('postcss'),
	grid = require('../'),
	assert = require('assert'),
	extend = require('util')._extend;

var settings = {
	columns: 12,
	maxWidth: 960,
	gutter: 20
};

var test = function (opts, input, output) {
    assert.equal(postcss(grid(opts)).process(input).css, output);
};

test(settings, '.element{grid-column: 1/12;}', '.element{float: left;width: 6.42361%;margin-right: 2.08333%;}');
test(extend({ legacy: true }, settings), '.element{grid-column: 1/12;}', '.element{float: left;width: 6.42361%;display: inline;margin-right: 2.08333%;}');
test(settings, '.element{grid-column: 1/12 !last;}', '.element{float: left;width: 6.42361%;}');
test(settings, '.element{grid-column: 6/12;}', '.element{float: left;width: 48.95833%;margin-right: 2.08333%;}');
test(settings, '.element{grid-column: 3/6;}', '.element{float: left;width: 47.87234%;margin-right: 4.25532%;}');
test(settings, '.element{grid-column: 12/12 !last;}', '.element{float: left;width: 100%;}');
test(settings, '.element{grid-push: 1/12;}', '.element{margin-left: 8.50694%;}');
test(settings, '.element{grid-pull: 1/12;}', '.element{margin-right: 8.50694%;}');
test(settings, '.element{width: grid-width(1/12);}', '.element{width: 6.42361%;}');
test(settings, '.element{margin-left: grid-gutter(12);}', '.element{margin-left: 2.08333%;}');
