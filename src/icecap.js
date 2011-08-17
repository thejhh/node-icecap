/*
 * Icecap Protocol Library for Node.js
 */

var _logger = console,
    _lib = module.exports || {},
    EventEmitter = require('events').EventEmitter,
    util = require("util"),
	foreach = require('snippets').foreach;

/* Icecap */
var Icecap = (function() {
	
	/* Start icecapd */
	function _start(obj, command, args) {
		var command = command || "icecapd",
		    args = args || [],
		    buffer = '';
		
		// Start child process
		obj.icecapd = require('child_process').spawn(command, args);
		
		// Handle input data
		obj.icecapd.stdout.on("data", function(data) {
			var income = buffer + data,
			    lines = income.split('\n'),
			    last = lines.pop();
			buffer = last;
			foreach(lines).do(function(line) {
				obj.emit("raw data", line);
			});
		});
		
		return obj;
	}
	
	/* Constructor */
	function Icecap(args) {
		if(!(this instanceof arguments.callee)) return new Icecap(args);
		var obj = this,
		    args = args || {},
		    command = args.command || {};
		EventEmitter.call(obj);
		_start(obj, command.name, command.args);
		
		// Parse raw data
		obj.on('raw data', function(data) {
			console.log('raw data:\n--\n' + data + '\n--\n');
		});
		
	}
	
	util.inherits(Icecap, EventEmitter);
	
	/* Start connection */
	Icecap.prototype.start = function(command, args) {
		return _start(this, command, args);
	}
	
	return Icecap;
})();

_lib.Icecap = Icecap;

_lib.create = (function(args) {
	return new Icecap(args);
});

/* EOF */
