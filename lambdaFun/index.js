'use strict';

var http = require('http');

exports.handler = function(event,context) {

	try {

		var request = event.request;

		/*
	    	i)   LaunchRequest       Ex: "Open greeter"
	    	ii)  IntentRequest       Ex: "Say hello to John" or "ask greeter to say hello to John"
	    	iii) SessionEndedRequest Ex: "exit" or error or timeout
		*/

		if (request.type === "LaunchRequest") {
			var options = {};
			options.speechText = "Welcome to Greetings skill.  Using our skill you can greet your guests.  Who would you like to greet? ";
			options.repromptText = "You can say for example, say hello to John. ";
			options.endSession = false;
			context.succeed(buildResponse(options));

		} else if (request.type === "IntentRequest") {
			let options = {};

			if (request.intent.name === "HelloIntent") {

				let name = request.intent.slots.FirstName.value;
				options.speechText = "Hello " + name + ". ";
				options.speechText += getWish();
				getQuote(function(quote,err) {
					if(err) {
						context.fail(err);
					} else {
						options.speechText += quote;
						options.endSession = true;
						context.succeed(buildResponse(options));
					}
				});

			} else {
				throw("Unknown intent");
			}

		} else if (request.type === "SessionEndedRequest") {

		} else {
			throw("Unknown intent type");
		}

	} catch(e) {
		context.fail("Excpetion: " + e);
	}

}

function getQuote(callback) {
	var url = "http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json";
	var req = http.get(url, function(res) {
		var body = "";

		res.on('data', function(chunk) {
			body += chunk;
		});

		res.on('end', function() {
			body = body.replace(/\\/g,'');
			var quote = JSON.parse(body);
			callback(quote.quoteText);
		});

	});

	req.on('error', function(err) {
		callback('',err);
	});

}

function getWish() {
	var myDate = new Date();
	var hours = myDate.getUTCHours() - 4;
	if (hours < 0) {
		hours = hours + 24;
	}

	if (hours < 12) {
		return "Good Morning. ";
	} else if (hours < 18) {
		return "Good afternoon. ";
	} else {
		return "Good evening. ";
	}
}

function buildResponse(options) {

	var response = {
		version: "1.0",
		response: {
			outputSpeech: {
				type: "PlainText",
				text: options.speechText
			},
			shouldEndSession: options.endSession
		}
	};

	if(options.repromptText) {
		response.response.reprompt = {
			outputSpeech: {
				type: "PlainText",
				text: "options.repromptText"
			}
		};
	}

	return response;

}