/*
 * The MIT License
 * 
 * Copyright (c) 2013 Mark Nutter
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
 * of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function () {

	var GCM = function() {};

	/**
	 * Register device with GCM service
	 * @param senderId - GCM service identifier
	 * @param eventCallback - {String} - Name of global window function that will handle incoming events from GCM
	 * @param successCallback - {Function} - called on success on registering device
	 * @param failureCallback - {Function} - called on failure on registering device
	 */
	GCM.prototype.register = function(senderID, eventCallback, successCallback, failureCallback) {

	  if ( typeof eventCallback != "string") {   // The eventCallback has to be a STRING name not the actual routine like success/fail routines
	    var e = new Array();
	    e.msg = 'eventCallback must be a STRING name of the routine';
	    e.rc = -1;
	    failureCallback( e );
	    return;
	  }

	  return Cordova.exec(successCallback,      //Callback which will be called when directory listing is successful
	              failureCallback,    //Callback which will be called when directory listing encounters an error
	              'GCMPlugin',        //Telling Cordova that we want to run "DirectoryListing" Plugin
	              'register',         //Telling the plugin, which action we want to perform
	              [{ senderID: senderID, ecb : eventCallback }]);          //Passing a list of arguments to the plugin,
	                          // The ecb variable is the STRING name of your javascript routine to be used for callbacks
	                          // You can add more to validate that eventCallback is a string and not an object
	};


	/**
	 * Un-Register device with GCM service
	 * @param successCallback - {Function} - called on success on un-registering device
	 * @param failureCallback - {Function} - called on failure on un-registering device
	 */
	GCM.prototype.unregister = function( successCallback, failureCallback ) {

	    return cordova.exec(successCallback,      //Callback which will be called when directory listing is successful
	              failureCallback,       //Callback which will be called when directory listing encounters an error
	              'GCMPlugin',        //Telling Cordova that we want to run "DirectoryListing" Plugin
	              'unregister',             //Telling the plugin, which action we want to perform
	              [{ }]);          //Passing a list of arguments to the plugin,
	};


	/*
	 * register plugin with Phonegap \ Cordova
	 */
	if (cordova.addPlugin) {
	  cordova.addConstructor(function() {
	    //Register the javascript plugin with Cordova
	    cordova.addPlugin('GCM', new GCM());
	  });
	} else {
		if (!window.plugins) {
			window.plugins = {};
		}
	  window.plugins.GCM = new GCM();
	}	
})();

