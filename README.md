# Greetings skill
Created by **Richard Mangerie**, taken from **Udemy**<br/>
https://www.udemy.com/comprehensive-alexa-skill-development-course<br/>
Last updated _11/05/2018_

## Request types

1. LaunchRequest
    * "Open greeter"
2. IntentRequest
    * "Say hello to John"
    * "Ask greeter to say hello to John"
3. SessionEndedRequest
    * "Exit"
    * Error or timeout

## Input JSON structure

### session
**session** (_object_): data about the current session
* ### LaunchRequest, HelloIntent (IntentRequest), QuoteIntent (IntentRequest), and AMAZON.StopIntent (IntentRequest) structure:
* **new** (_boolean_): determines whether the current session is new or not
* **sessionId** (_string, mixed_): ID for the current session
* **user** (_object_): data about the current user
	* **userId** (_string, mixed_): ID for the current user
* **application** (_object_): data about the application
	* **applicationId** (_string, mixed_): ID for the application

* ### NextQuoteIntent (IntentRequest) structure:
* **new** (_boolean_): determines whether the current session is new or not
* **sessionId** (_string, mixed_): ID for the current session
* **attributes** (_object_): some information collected form the current session<br/>
_NOTE_: there are structure differences
	* **quoteIntent** (_boolean_): checking to see if this intent was invoked from the intent QuoteIntent
	* **DOES NOT EXIST**: the **attributes** object will not exist if this intent was not invoked from the intent QuoteIntent
* **user** (_object_): data about the current user
	* **userId** (_string, mixed_): ID for the current user
* **application** (_object_): data about the application
	* **applicationId** (_string, mixed_): ID for the application

### version
**version** (_string, numbers_): skill version number

### request
**request** (_object_): data containing specific informaiton on the current request<br/>
_NOTE_: there are structure differences
	
* ### LaunchRequest structure:

* **type** (_string, letters_): type of the current request
* **requestId** (_string, mixed_): ID for the current request

* ### IntentRequest structure:
* **intent** (_object_): data about each intent that was called for the current request<br/>
_NOTE_: there are structure differences

	* ### HelloIntent structure:
	* **slots** (_object_): data about the slots for the current intent
		* **FirstName** (_object_): data about the FirstName slot
			* **name** (_string, letters_): variable name of the current FirstName slot
			* **value** (_string, letters_): value of the current FirstName slot
		* **name** (_string, letters_): name of the the current intent

	* ### QuoteIntent, NextQuoteIntent, and AMAZON.StopIntent structure:
	* **name** (_string, letters_): name of the current intent

* **type** (_string, letters_): type of the current request
* **requestId** (_string, mixed_): ID for the current request

## Input JSON example

* {
	* "session": {
		* "new": false,
		* "sessionId": "session1234",
		* "user": {
			* "userId": "usr123"
		* },
		* "application": {
			* "applicationId": "amzn1.echo-sdk-ams.app.5acba9b5-6d09-4444-aaa8-618c56eb0335"
		* }
	* },
	* "version": "1.0",
	* "request": {
		* "intent": {
			* "slots": {
				* "FirstName": {
					* "name": "FirstName",
					* "value": "John"
				* }
			* },
			* "name": "HelloIntent"
		* },
		* "type": "IntentRequest",
		* "requestId": "request5678"
	* }
* }

## Output JSON structure

### body

**body** (_object_): data containing the response information<br/>
_NOTE_: there are structure differences

* ### LaunchRequest, HelloIntent (IntentRequest), and AMAZON.StopIntent (IntentRequest) structure:
* **version** (_string, numbers_): the current version of the skill
	response (object): data containing the speech information<br/>
	NOTE: there are structure differences

	* ### LaunchRequest structure:

	* **outputSpeech** (_object_): data containing the output speech
		* **type** (_string, letters_): the type of the output speech
		* **ssml** (_string, mixed_): the actual output speech encoded in a markup language
	* **reprompt** (_object_): data containing the reprompt information
		* **outputSpeech** (_object_): data containing the output speech for the reprompt
			* **type** (_string, letters_): the type of the output speech for the reprompt
			* **ssml** (_string, mixed_): the actual output speech for the reprompt encoded in a markup language
	* **shouldEndSession** (_boolean_): seeing if the current session should be ended or not

	* ### HelloIntent (IntentRequest) structure:
	* **outputSpeech** (_object_): data containing the output speech
		* **type** (_string, letters_): the type of the output speech
		* **ssml** (_string, mixed_): the actual output speech encoded in a markup language
	* **card** (_object_): data containing the card information
		* **type** (_string, letters_): the type of the current card
		* **title** (_string, mixed_): the title of the current card
		* **text** (_string, mixed_): the text of the current card
		* **image** (_object_): data containing the image information for the current card
			* **smallImageUrl** (_string, mixed_): the URL of the small image for the current card
			* **largeImageUrl** (_string, mixed_): the URL of the large image for the current card
	* **shouldEndSession** (_boolean_): seeing if the current session should be ended or not

	* ### AMAZON.StopIntent (IntentRequest) structure:

	* **outputSpeech** (_object_): data containing the output speech
		* **type** (_string, letters_): the type of the output speech
		* **ssml** (_string, mixed_): the actual output speech encoded in a markup language
	* **shouldEndSession** (_boolean_): seeing if the current session should be ended or not

* ### QuoteIntent (IntentRequest) and NextQuoteIntent (IntentRequest) structure:

* **version** (_string, numbers_): the current version of the skill
* **response** (_object_): data containing the speech information
	* **outputSpeech** (_object_): data containing the output speech
		* **type** (_string, letters_): the type of the output speech
		* **ssml** (_string, mixed_): the actual output speech encoded in a markup language
	* **reprompt** (_object_): data containing the reprompt information
		* **outputSpeech** (_object_): data containing the output speech for the reprompt
			* **type** (_string, letters_): the type of the output speech for the reprompt
			* **ssml** (_string, mixed_): the actual output speech for the reprompt encoded in a markup language
	* **shouldEndSession** (_boolean_): seeing if the current session should be ended or not
* **sessionAttributes** (_object_): data containing the information from the current session
	* **quoteIntent** (_boolean_): seeing if the current intent is QuoteIntent

## Output JSON example

* {
	* "body": {
		* "version": "1.0",
		* "response": {
			* "outputSpeech": {
				* "type": "SSML",
				* "ssml": "\<speak\>Compassion and happiness are not a sign of weakness but a sign of strength.  Do you want to listen to one more quote? <\/speak>"
			* },
			* "reprompt": {
				* "outputSpeech": {
					* "type": "SSML",
					* "ssml": "\<speak\>You can say yes or one more. <\/speak>"
				* }
			* },
			* "shouldEndSession": false
		* },
		* "sessionAttributes": {
			* "quoteIntent": true
		* }
	* }
* }