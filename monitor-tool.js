#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var interval = process.argv[2];

function Server(name, url) {
	this.name = name;
	this.url = url;
}

var servers = [];

function addServer(name, url) {
	var server = new Server(name, url);
	servers.push(server);
	continuousScan(server);
}

// read config
if (process.argv[3]) {

	if (process.argv[3].substr(0, 7) === 'http://' || process.argv[3].substr(0, 8) === 'https://') {
		addServer(process.argv[4] || 'target', process.argv[3]);
	} else {
		parseConfig(fs.readFileSync(process.argv[3], 'utf8'));
	}
}

function parseConfig(content) {
	var parsedServersConfig = content.split('\n');

	for (var i = 0; i < parsedServersConfig.length; i++) {
		var line = parsedServersConfig[i];

		if (!line) continue;

		line = line.trim();

		if (line.length && line.length > 0) {
			if (line[0] === '#')
				continue;

			var serverDetails = line.split(',');

			console.log('adding %s', line);		
			addServer(serverDetails[0].trim() /* name */, serverDetails[1].trim() /* url */);
		}
	}
}

function continuousScan(server) {

	function err(msg) {
		console.log(msg);
		console.log("\007\007\007");
	}

	setTimeout(function() {
		console.log('checking %s at %s', server.name, server.url);

		http.get(server.url, function(response) {
			if (response.statusCode !== 200) {
				
				err('server ' + server.url + ' replied ' + response.statusCode);	
				continuousScan(server);
			} else {
				console.log('%s ok', server.url);
				continuousScan(server);
			}
		}).on('error', function (er) {
			err(er ? er.toString() : 'unknown error');
			continuousScan(server);
		});

	}, interval);	
}

var repl = require('repl');

var context = repl.start({
	prompt: "monitor> "
}).context;

context.addServer = addServer;
