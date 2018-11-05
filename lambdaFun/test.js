'use strict'

var expect = require('chai').expect,  

//lambda function
lambdaToTest = require('./index')


function Context() {
	this.speechResponse = null;
	this.speechError = null;

	this.succeed = function(rsp) {
		this.speechResponse = rsp;
		this.done();
	};

	this.fail = function(rsp) {
		this.speechError = rsp;
		this.done();
	};
}

function validRsp(ctx,options) {
	expect(ctx.speechError).to.be.null;
	expect(ctx.speechResponse.version).to.be.equal('1.0');
	expect(ctx.speechResponse.response).not.to.be.undefined;
	expect(ctx.speechResponse.response.outputSpeech).not.to.be.undefined;
	expect(ctx.speechResponse.response.outputSpeech.type).to.be.equal('SSML');
	expect(ctx.speechResponse.response.outputSpeech.ssml).not.to.be.undefined;
	expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
	if(options.endSession) {
		expect(ctx.speechResponse.response.shouldEndSession).to.be.true;
		expect(ctx.speechResponse.response.reprompt).to.be.undefined;
	} else {
		expect(ctx.speechResponse.response.shouldEndSession).to.be.false;
		expect(ctx.speechResponse.response.reprompt.outputSpeech).to.be.not.undefined;
		expect(ctx.speechResponse.response.reprompt.outputSpeech.type).to.be.equal('SSML');
		expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>.*<\/speak>/);
	}
}

/*
function validCard(ctx) {
	expect(ctx.speechResponse.response.card).not.to.be.undefined;
	expect(ctx.speechResponse.response.card.type).to.be.equal('Simple');
	expect(ctx.speechResponse.response.card.title).not.to.be.undefined;
	expect(ctx.speechResponse.response.card.content).not.to.be.undefined;
}
*/

function validCard(ctx,standardCard) {
	expect(ctx.speechResponse.response.card).not.to.be.undefined;
	expect(ctx.speechResponse.response.card.title).not.to.be.undefined;
	if(standardCard) {
		expect(ctx.speechResponse.response.card.type).to.be.equal('Standard');
		expect(ctx.speechResponse.response.card.text).not.to.be.undefined;
		expect(ctx.speechResponse.response.card.image).not.to.be.undefined;
		expect(ctx.speechResponse.response.card.image.smallImageUrl).to.match(/^https:\/\//);
		expect(ctx.speechResponse.response.card.image.largeImageUrl).to.match(/^https:\/\//);
	} else {
		expect(ctx.speechResponse.response.card.type).to.be.equal('Simple');
		expect(ctx.speechResponse.response.card.content).not.to.be.undefined;
	}
}



//Mock input JSON
var event = {
	session: {
		new: false,
		sessionId: 'session1234',
		attributes: {},
		user: {
			userId: 'usrid123'
		},
		application: {
			applicationId: 'amzn1.echo-sdk-ams.app.1234'
		}
	},
	version: '1.0',
	request: {
		intent: {
			slots: {
				SlotName: {
					name: 'SlotName',
					value: 'slot value'
				}
			},
			name: 'intent name'
		},
		type: 'IntentRequest',
		requestId: 'request5678'
	}
};




describe('All intents', function() {
	var ctx = new Context();

	//Testing the validity of LaunchIntent
	describe('Test LaunchIntent', function() {

		before(function(done) {
			event.request.type = 'LaunchRequest';
			event.request.intent = {};
			event.session.attributes = {};
			ctx.done = done;
			lambdaToTest.handler(event , ctx);
		});


		it('valid response', function() {
			validRsp(ctx,{
				endSession: false,
			});
		});


		it('valid outputSpeech', function() {
			expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>Welcome to Greetings skill\.  Using our skill you can greet your guests\.  Who would you like to greet\? <\/speak>/);
		});

		it('valid repromptSpeech', function() {
			expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>You can say for example, say hello to .*<\/speak>/);
		});

	});

	//Testing the validity of HelloIntent
	describe(`Test HelloIntent`, function() {

		before(function(done) {
			event.request.intent = {};
			event.session.attributes = {};
			event.request.type = 'IntentRequest';
			event.request.intent.name = 'HelloIntent';
			event.request.intent.slots = {
				FirstName: {
					name: 'FirstName',
					value: 'John'
				}
			};
			ctx.done = done;
			lambdaToTest.handler(event , ctx);
		});

		it('valid response', function() {
			validRsp(ctx, {
				endSession: true
			});
		});

		it('valid outputSpeech', function() {
			expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>Hello .*John\.  Good .*<\/speak>/);
		});

	});

	//Testing the validity of QuoteIntent
	describe(`Test QuoteIntent`, function() {

		before(function(done) {
			event.request.intent = {};
			event.session.attributes = {};
			event.request.type = 'IntentRequest';
			event.request.intent.name = 'QuoteIntent';
			event.request.intent.slots = {};
			ctx.done = done;
			lambdaToTest.handler(event , ctx);
		});

		it('valid response', function() {
			validRsp(ctx, {
				endSession: false
			});
		});

		it('valid outputSpeech', function() {
			expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>.*Do you want to listen to one more quote\? <\/speak>/);
		});

		it('valid repromptSpeech', function() {
			expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>You can say yes or one more\. <\/speak>/);
		});

	});

	//Testing the validity of NextQuoteIntent when it is correctly invoked
	describe(`Test NextQuoteIntent correct invocation`, function() {

		before(function(done) {
			event.request.intent = {};
			//The input JSON will have attributes, which is why the invocation succeeds
			event.session.attributes = ctx.speechResponse.sessionAttributes;
			event.request.type = 'IntentRequest';
			event.request.intent.name = 'NextQuoteIntent';
			event.request.intent.slots = {};
			ctx.done = done;
			lambdaToTest.handler(event , ctx);
		});

		it('valid response', function() {
			validRsp(ctx, {
				endSession: false
			});
		});

		it('valid outputSpeech', function() {
			expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>.*Do you want to listen to one more quote\? <\/speak>/);
		});

		it('valid repromptSpeech', function() {
			expect(ctx.speechResponse.response.reprompt.outputSpeech.ssml).to.match(/<speak>You can say yes or one more\. <\/speak>/);
		});

	});

	//Testing the validity of NextQuoteIntent when it is incorrectly invoked
	describe(`Test NextQuoteIntent incorrect invocation`, function() {

		before(function(done) {
			event.request.intent = {};
			//The input JSON will not have attributes, which is why the invocation fails
			event.session.attributes = {};
			event.request.type = 'IntentRequest';
			event.request.intent.name = 'NextQuoteIntent';
			event.request.intent.slots = {};
			ctx.done = done;
			lambdaToTest.handler(event , ctx);
		});

		it('valid response', function() {
			validRsp(ctx, {
				endSession: true
			});
		});

		it('valid outputSpeech', function() {
			expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>Wrong invocation of this intent\. <\/speak>/);
		});

	});

	//Testing the validity of the AMAZON.StopIntent
	describe(`Test AMAZON.StopIntent`, function() {

		before(function(done) {
			event.request.intent = {};
			event.session.attributes = {};
			event.request.type = 'IntentRequest';
			event.request.intent.name = 'AMAZON.StopIntent';
			event.request.intent.slots = {};
			ctx.done = done;
			lambdaToTest.handler(event , ctx);
		});

		it('valid response', function() {
			validRsp(ctx, {
				endSession: true
			});
		});

		it('valid outputSpeech', function() {
			expect(ctx.speechResponse.response.outputSpeech.ssml).to.match(/<speak>Good bye\. <\/speak>/);
		});

	});


});