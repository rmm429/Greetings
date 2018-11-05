
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
* **new** (_boolean_): determines whether the current session is new or not
* **sessionId** (_string, mixed_): ID for the current session
* **attributes** (_object_): some information collected from the current session
	* empty
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

	* **type** (_string, letters_): type of the current request
	* **requestId** (_string, mixed_): ID for the current request

# Input JSON example
**_INSERT WHEN SKILL IS COMPLETED_**

# Output JSON structure
**_INSERT WHEN SKILL IS COMPLETED_**

# Output JSON example
**_INSERT WHEN SKILL IS COMPLETED_**