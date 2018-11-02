# Greetings skill
Created by **Richard Mangerie**, taken from **Udemy**
https://www.udemy.com/comprehensive-alexa-skill-development-course
Last updated _11/02/2018_

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
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**new** (_boolean_): determines whether the current session is new or not
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**sessionId** (_string, mixed_): ID for the current session
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**attributes** (_object_): some information collected from the current session
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;empty
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**user** (_object_): data about the current user
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**userId** (_string, mixed_): ID for the current user
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**application** (_object_): data about the applicaiton
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**applicationId** (_string, mixed_): ID for the application

### version
**version** (_string, numbers_): skill version number

### request
**request** (_object_): data containing specific informaiton on the current request
_NOTE_: there are structure differences
	
#### &nbsp;&nbsp;&nbsp;LaunchRequest structure:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**type** (_string, letters_): type of the current request
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**requestId** (_string, mixed_): ID for the current request

#### &nbsp;&nbsp;&nbsp;IntentRequest strucutre:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**intent** (_object_): data about each intent that was called for the current request
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_NOTE_: there are structure differences

##### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HelloIntent structure:
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**slots** (_object_): data about the slots for the current intent
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**FirstName** (_object_): data about the FirstName slot
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**name** (_string, letters_): variable name of the current FirstName slot
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**value** (_string, letters_): value of the current FirstName slot
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**name** (_string, letters_): name of the the current intent

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**type** (_string, letters_): type of the current request
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**requestId** (_string, mixed_): ID for the current request

# Input JSON example
**_INSERT WHEN SKILL IS COMPLETED_**

# Output JSON structure
**_INSERT WHEN SKILL IS COMPLETED_**

# Output JSON example
**_INSERT WHEN SKILL IS COMPLETED_**