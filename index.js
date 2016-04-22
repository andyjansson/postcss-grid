var postcss = require('postcss'),
	functionCall = require('reduce-function-call'),
	extend = require('util')._extend;

module.exports = postcss.plugin('postcss-grid', function (opts) {
	opts = extend({
		columns: 12,
		maxWidth: 960,
		gutter: 20,
		legacy: false
	}, opts);

	var columnWidth = (opts.maxWidth - ((opts.columns -1 ) * opts.gutter)) / opts.columns;

	var gridWidth = function (span, cols) {
		var width = span * columnWidth + (span -1 ) * opts.gutter;
		var container = cols * columnWidth + (cols -1) * opts.gutter;
		return ((width  / container) * 100).toFixed(5) * 1;
	};
	var gridWidthExtended = function (span, cols, maxWidth, gutter) {
		var colWidth = (maxWidth - ((cols -1 ) * gutter)) / cols;
		var width = span * colWidth + (span -1 ) * gutter;
		var container = cols * colWidth + (cols -1) * gutter;
		return ((width  / container) * 100).toFixed(5) * 1;
	};

	var gutterWidth = function (cols) {
		var width = cols * columnWidth + (cols - 1) * opts.gutter;
		return ((opts.gutter / width) * 100).toFixed(5) * 1;
	};
	var gutterWidthExtended = function (cols, maxWidth, gutter) {
		var colWidth = (maxWidth - ((cols -1 ) * gutter)) / cols;
		var width = cols * colWidth + (cols - 1) * gutter;
		return ((gutter / width) * 100).toFixed(5) * 1;
	};

	var value = /\s*(\d+)\s*\/\s*(\d+)\s*/;
	var extended = /\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*/;
	var isLast = /\s*!last\s*$/;

	return function (css) {
		css.walkDecls(function (decl) {
			if (decl.value.indexOf('grid-width(') !== -1) {
				decl.value = functionCall(decl.value, "grid-width", function (body) {
					var match;

					if (match = value.exec(body)) {
						var span = match[1];
						var columns = match[2];
						return gridWidth(span, columns) + '%'
					}
					else {
						throw decl.error('Invalid declaration', { plugin: 'postcss-grid' });
					}
				});
			}
			if (decl.value.indexOf('grid-gutter(') !== -1) {
				decl.value = functionCall(decl.value, "grid-gutter", function (body) {
					return gutterWidth(body) + '%'
				});
			}

			if (decl.prop === 'grid-column') {
				var match;

				if (match = extended.exec(decl.value)) {
					var span = match[1];
					var columns = match[2];
					var maxWidth = match[3];
					var gutter = match[4];
					decl.parent.append({prop: 'float', value: 'left'}).source = decl.source;
					decl.parent.append({prop: 'width', value: gridWidthExtended(span, columns, maxWidth, gutter) + '%'}).source = decl.source;
					if (!(decl.value.match(isLast))) {
						if (opts.legacy) decl.parent.append({prop: 'display', value: 'inline'}).source = decl.source;
						decl.parent.append({prop: 'margin-right', value: gutterWidthExtended(columns, maxWidth, gutter) + '%'}).source = decl.source;
					}
					return decl.remove();
				}
				if (match = value.exec(decl.value)) {
					var span = match[1];
					var columns = match[2];

					decl.parent.append({prop: 'float', value: 'left'}).source = decl.source;
					decl.parent.append({prop: 'width', value: gridWidth(span, columns) + '%'}).source = decl.source;

					if (!(decl.value.match(isLast))) {
						if (opts.legacy) decl.parent.append({prop: 'display', value: 'inline'}).source = decl.source;
						decl.parent.append({prop: 'margin-right', value: gutterWidth(columns) + '%'}).source = decl.source;
					}
					decl.remove();
				}
				else {
					throw decl.error('Invalid declaration', { plugin: 'postcss-grid' });
				}
			}
			if (decl.prop === 'grid-push' || decl.prop === 'grid-pull') {
				var match;
				if (match = extended.exec(decl.value)) {
					var span = match[1];
					var columns = match[2];
					var maxWidth = match[3];
					var gutter = match[4];
					var width = span * gridWidthExtended(1, columns, maxWidth, gutter) + span * gutterWidthExtended(columns, maxWidth, gutter);
					decl.parent.append({
						prop: decl.prop === 'grid-push' ? 'margin-left' : 'margin-right',
						value: width + '%'
					}).source = decl.source;
					return decl.remove();
				}
				if (match = value.exec(decl.value)) {
					var span = match[1];
					var columns = match[2];
					var width = span * gridWidth(1, columns) + span * gutterWidth(columns);
					decl.parent.append({
						prop: decl.prop === 'grid-push' ? 'margin-left' : 'margin-right',
						value: width + '%'
					}).source = decl.source;
					decl.remove();
				}
				else {
					throw decl.error('Invalid declaration', { plugin: 'postcss-grid' });
				}
			}
		});
	};
});
