'use strict';

var http = require('http');

//event = input JSON
exports.handler = function(event,context) {

	try {

		//Outputting the input JSON to the console
		if(process.env.NODE_DEBUG_EN) {
			console.log("Request:\n" + JSON.stringify(event,null,2));
		}

		//specific objects of the event JSON
		var request = event.request;
		var session = event.session;

		//Session attributes: pass some information from one intent to another intent
		//If there are no session attributes, create an empty object for them and place it in the event JSON
		if(!event.session.attributes) {
			event.session.attributes = {};
		}

		if (request.type === "LaunchRequest") {

			handleLaunchRequest(context);

		} else if (request.type === "IntentRequest") {

			if (request.intent.name === "HelloIntent") {

				handleHelloIntent(request,context);

			} else if (request.intent.name === "QuoteIntent") {

				handleQuoteIntent(request,context,session);

			} else if (request.intent.name === "NextQuoteIntent") {

				handleNextQuoteIntent(request,context,session);

			} else if (request.intent.name === "AMAZON.StopIntent" || request.intent.name === "AMAZON.CancelIntent") {
				context.succeed(buildResponse({
					speechText: "Good bye.",
					endSession: true
				}));

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
		return "Good Morning.";
	} else if (hours < 18) {
		return "Good afternoon.";
	} else {
		return "Good evening.";
	}
}

function buildResponse(options) {

	//Outputting the response options to the console
	if(process.env.NODE_DEBUG_EN) {
		console.log("\nbuildResponse options:\n" + JSON.stringify(options,null,2));
	}

	options.speechText = addSpacing(options.speechText);

	//response = output JSON
	var response = {
		version: "1.0",
		response: {
			outputSpeech: {
				type: "SSML",
				ssml: "<speak>" + options.speechText + "</speak>"
			},
			shouldEndSession: options.endSession
		}
	};

	if(options.repromptText) {

		options.repromptText = addSpacing(options.repromptText);

		response.response.reprompt = {
			outputSpeech: {
				type: "SSML",
				text: "<speak>" + options.repromptText + "</speak>"
			}
		};
	}

	if(options.cardTitle) {
		response.response.card = {
			type: "Simple",
			title: options.cardTitle
		};

		if(options.imageUrl) {
			response.response.card.type = "Standard";
			response.response.card.text = options.cardContent;
			response.response.card.image = {
				smallImageUrl: options.imageUrl,
				largeImageUrl: options.imageUrl
			};

		} else {
			response.response.card.content = options.cardContent;
		}

	}

	if(options.session && options.session.attributes) {
		response.sessionAttributes = options.session.attributes;
	}

	//Outputting the output JSON to the console
	if(process.env.NODE_DEBUG_EN) {
		console.log("\nResponse:\n" + JSON.stringify(response,null,2));
	}

	return response;

}

function handleLaunchRequest(context) {
	let options = {};
	options.speechText = "Welcome to Greetings skill.Using our skill you can greet your guests.Who would you like to greet?";
	options.repromptText = "You can say for example, say hello to John.";
	options.endSession = false;
	context.succeed(buildResponse(options));
}

function handleHelloIntent(request,context) {
	let options = {};
	let name = request.intent.slots.FirstName.value;
	options.speechText = `Hello <say-as interpret-as="spell-out">${name}</say-as> ${name}.`;
	options.speechText += getWish();

	options.cardTitle = `Hello ${name}!`;

	getQuote(function(quote,err) {
		if(err) {
			context.fail(err);
		} else {
			options.speechText += quote;
			options.cardContent = quote;
			options.imageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5b/Hello_smile.png";
			options.endSession = true;
			context.succeed(buildResponse(options));
		}
	});
}

function handleQuoteIntent(request,context,session) {
	let options = {};
	//Remembering the current session
	options.session = session;

	getQuote(function(quote,err) {
		if(err) {
			context.fail(err);
		} else {
			options.speechText = quote;
			options.speechText += "Do you want to listen to one more quote?";
			options.repromptText = "You can say yes or one more.";
			//Noting that we are coming from the QuoteIntent
			options.session.attributes.quoteIntent = true;
			//Keep repeating until the user wants to stop
			options.endSession = false;
			context.succeed(buildResponse(options));
		}
	});

}

function handleNextQuoteIntent(request,context,session) {
	let options = {};
	//Remembering the current session
	options.session = session;

	//Making sure we came from the QuoteIntent
	if(session.attributes.quoteIntent) {
		getQuote(function(quote,err) {
			if(err) {
				context.fail(err);
			} else {
				options.speechText = quote;
				options.speechText += "Do you want to listen to one more quote?";
				options.repromptText = "You can say yes or one more.";
				//since QuoteIntent had to be true to enter this statement, no need to set it again
				//options.session.attributes.quoteIntent = true;
				//Keep repeating until the user wants to stop
				options.endSession = false;
				context.succeed(buildResponse(options));
			}
		});
	//If this intent was invoked by another intent, notify of wrong invocation
	} else {
		options.speechText = "Wrong invocation of this intent.";
		options.endSession = true;
		context.succeed(buildResponse(options));
	}
}

function addSpacing(text) {

	/*
		Two spaces after period, question mark, and/or exclamation point, one space after final period, question mark, and/or exclamation point.
		Incoming string has no spaces after any period, question mark, and/or exclamation point (with the exception of a justifiable use of a period, e.g. "Mr. Jones").
	*/

	//Find period with no space after it, replace with period with two spaces after it
	var textSpace = text.replace(/\.(?=[^ ])/g, ".  ");
	//Find question mark with no space after it, replace with question mark with two spaces after it
	textSpace = textSpace.replace(/\?(?=[^ ])/g, "?  ");
	//Find exclamation point with no space after it, replace with exclamation point with two spaces after it
	textSpace = textSpace.replace(/\!(?=[^ ])/g, "!  ");

	//Add a final space onto the end of the string and return the string
	return textSpace + " ";

}