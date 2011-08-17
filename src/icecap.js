/*
 * Icecap Protocol Library for Node.js
 */

var _logger = console,
    _lib = module.exports || {},
    EventEmitter = require('events').EventEmitter,
    util = require("util"),
	foreach = require('snippets').foreach,
    split = require('snippets').split,
    pass = require('snippets').pass;

/* Icecap */
var Icecap = (function() {
	
	/* Escape for IceCap protocol */
	function _escape(tmp) {
		return (""+tmp).replace(/\\/, "\\\\").replace(/;/, "\\.");
	}
	
	/* Unescape for IceCap protocol */
	function _unescape(tmp) {
		return (""+tmp).replace(/\\\\/, "\\").replace(/\\\./, ";");
	}
	
	/* Escape for IceCap protocol */
	function _escape_tokens(tokens) {
		var buffer = [];
		foreach(tokens).do(function(value, key) {
			buffer.push( (value === "") ? _escape(key) : _escape(key)+'='+_escape(value) );
		});
		return buffer.join(';');
	}
	
	/* Parse tokens */
	function _unescape_tokens(tokens) {
		var obj = {}, undefined;
		foreach(tokens).do(function(token) {
			if(token === "") return;
			pass(split(/=/, token, 2)).on(function(key,value) {
				var key = _unescape(key),
				    value = (value === undefined) ? true : _unescape(value);
				obj[key] = value;
			});
		});
		return obj;
	}
	
	/* Start icecapd */
	function _start(obj, command, args) {
		var command = command || "icecapd",
		    args = args || [],
		    buffer = '';
		
		// Start child process
		var icecapd = require('child_process').spawn(command, args);
		
		// Handle input data
		icecapd.stdout.on("data", function(data) {
			var income = buffer + data,
			    lines = income.split(/\r?\n/),
			    last = lines.pop();
			buffer = last;
			foreach(lines).do(function(line) {
				obj.emit("data", line);
			});
		});
		
		return icecapd;
	}
	
	/* Constructor */
	function Icecap(args) {
		if(!(this instanceof arguments.callee)) return new Icecap(args);
		var obj = this,
		    args = args || {},
		    command = args.command || {};
		EventEmitter.call(obj);
		
		obj.next_tag = 1;
		
		obj.icecapd = _start(obj, command.name, command.args);
		
		// Handle raw data
		obj.on('data', function(data) {
			var tokens = data.split(";");
			    a = _unescape(tokens.shift()),
			    b = _unescape(tokens.shift());
			if(a === "*") obj.emit('event', b, _unescape_tokens(tokens) );
		});
		
		// Handle general event
		obj.on('event', function(name, tokens) {
			obj.emit(name, tokens);
		});
		
	}
	
	// 
	util.inherits(Icecap, EventEmitter);
	
	/* Start connection */
	Icecap.prototype.start = (function(command, args) {
		var obj = this;
		obj.icecapd = _start(obj, command, args);
		return obj;
	});
	
	/* Execute command */
	Icecap.prototype.command = (function(name, params) {
		var obj  = this,
		    tag    = obj.next_tag++,
		    name   = name,
		    params = params || {},
		    raw = _escape(tag) + ";" + _escape(name) + ";" + _escape_tokens(params);
		util.log('Writing: ' + raw);
		obj.icecapd.stdin.write( raw + "\n" );
	});
	
	return Icecap;
})();

_lib.Icecap = Icecap;

_lib.create = (function(args) {
	return new Icecap(args);
});

/* EOF */
