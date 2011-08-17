
/* Example icecap client */

var icecap = require('../src/icecap.js').create(),
	util = require('util'),
	sys = require('sys');

// Write raw data for debug use
icecap.on('data', function(data) {
	util.log('data: "' + data + '"');
});

// Write parsed data for debug use
icecap.on('event', function(name, tokens) {
	util.log('event: ' + sys.inspect(name) + ': ' + sys.inspect(tokens) );
});

/* EOF */
