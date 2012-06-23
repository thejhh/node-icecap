
/* Example icecap client */

var icecap = require('../src/icecap.js').create(),
	util = require('util'),
	util = require('util');

// Write raw data for debug use
icecap.on('data', function(data) {
	util.log('data: "' + data + '"');
});

// Write parsed data for debug use
icecap.on('event', function(name, tokens) {
	util.log('event: ' + util.inspect(name) + ': ' + util.inspect(tokens) );
});

icecap.on('msg', function(tokens) {
	util.log( "<" + tokens.presence + "> " + tokens.msg );
});

// Execute command
setTimeout(function() {
	console.log("Sending msg!");
	icecap.command('msg', {
		'channel':'#webicecap',
		'network':'ircnet',
		'mypresence':'icebot',
		'msg':'Hello world'
	});
}, 5000);

/* EOF */
