# Eliademy

The Eliademy mobile application is an extension of [Eliademy](https://eliademy.com/ "Eliademy"), the free online classroom for instructors to create, share and 
manage online course content with students.

## Examples of what you can do with the Eliademy mobile application include:

* Studying anywhere, anytime. Students can study course content while commuting, idling or even on holidays.
* Checking university schedule on the go. Catch up with lecture schedules, assignment deadlines and reading or video-lecture consumption.
* Collaborative discussion on your mobile phone with coursemates and instructors
* Staying up to date with any changes such as course cancellation, room change, new instructions from instructor


The smartphone application has been developed using the Apache Cordova API's and web components. Please find below a short summary of the 
components used in the project.


* **[RequireJS](http://requirejs.org/)** - A JavaScript file and module loader.
* **[Lo-Dash](http://lodash.com/)** - A low-level utility library delivering consistency, customization, performance, and extra features.
* **[jQuery](http://jquery.com/)** - The Write Less, Do More, JavaScript Library.
* **[i18n](https://github.com/requirejs/i18n)** - An AMD loader plugin for loading internationalization/localization string resources.
* **[GCM](https://github.com/marknutter/GCM-Cordova)** - A cordova plugin for Google cloud messaging services.
* **[FacebookConnect](https://github.com/mgcrea/cordova-facebook-connect)** - Cordova ARC plugin for the Facebook SDK
* **[domReady](https://github.com/ded/domready)** - Let's you know when the dom is ready.
* **[cordova](http://cordova.apache.org/)** - platform for building native mobile applications using HTML, CSS and JavaScript
* **[bootstrap](http://twitter.github.io/bootstrap/)** - Sleek, intuitive, and powerful front-end framework for faster and easier web development.
* **[backbone](http://backbonejs.org/)** - Gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface
* **[text](https://github.com/requirejs/text)** - A RequireJS/AMD loader plugin for loading text resources.
* **[spin](http://fgnass.github.io/spin.js/)** - Is a simple CSS loader, an animated CSS activity indicator with VML fallback

## Basic outline for Eliademy

The UI for Eliademy has been developed using HTML, CSS and Javascript. For interacting with the native API's it makes use of Cordova API's.
Once the user tries to connect to the a service based on the selection of the user the backend tries to initialize the corresponding service and once 
it's connected to the service it makes the required service calls to fetch relevant data as required by the UI. This service layer can be customized by
a developer who wants to extend the functionality of the application for any other LMS, provided the interface adheres to the response schema.


Please note that for certain features to work it may be required by the developer/user to generate his own application tokens from the services
like Facebook/Google etc. In these cases please follow the relevant developer documentation.


## LICENCE ##

# Code developed by CBTec 
Copyright 2013 [CBTec Oy](http://cloudberrytec.com/,"CBTec Oy"). All rights reserved.

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Code in other opensource components/libraries

For libraries e.g cordova,backbone,jQuery etc 
Please check the relevant source files and headers for the relevant licencing information.

## Support

For any queries/suggestions please contact [support](http://eliademy.uservoice.com/)



