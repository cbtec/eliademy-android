/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(function ()
{
	var sToken = null,
	sSessionKey = null,
    sServerUrl = null,
    sService = "",
    sMoodle = {"moodle22": ["tasks"], 
	       "moodle23": ["tasks"], 
	       "moodle24": ["tasks"], 
	       "moodle25": ["tasks"]};	

	return {
        // Direct calls (for desktop).
		call_: function (name, args, handler, owner, errorHandler)
		{
			var data = {
				wsfunction: name,
				moodlewsrestformat: "json"
			};

			_.extend(data, args);

			return $.ajax({ url: MoodleDir + "webservice/rest/server.php?wstoken=" + sToken, type: "POST", data: data,
                success: function (res)
                {
                    if (typeof res == "string")
                    {
                        res = $.parseJSON($.trim(res));
                    }
                    
                    if (res instanceof Object && res.exception)
                    {
                        console.warn("exception in " + JSON.stringify(data) + " - " + JSON.stringify(res));

                        if (typeof errorHandler !== 'undefined') {
                            errorHandler.apply((owner ? owner : this), [ res ]);
                        }
                    }
                    else
                    {
                        if (handler instanceof Function)
                        {
                            handler.apply((owner ? owner : this), [ res ]);
                        }
                    }
                },
                error: function (res)
                {
                    if (typeof res == "string")
                    {
                        res = $.parseJSON($.trim(res));
                    }

                    if (res instanceof Object && "exception" in res)
                    {
                        console.warn("exception in " + JSON.stringify(data) + " - " + JSON.stringify(res));
                    }
                    else
                    {
                        if (typeof errorHandler !== 'undefined') {
                            errorHandler.apply((owner ? owner : this), [ res ]);
                        }
                    }
                }
            });
		},

        // Calls through cordova
		call: function (name, args, handler, owner, errorHandler)
		{
			cordova.exec(function(res){
                $("#toolbar-refresh-button").removeClass("spinning");

				if (typeof res == "string")
                {
					//console.log("Service call response string" + res);
                    res = $.parseJSON($.trim(res));
                }

                if (res instanceof Object && res.exception)
                {
                    // Some real problem.
                    console.warn("exception in " + JSON.stringify(data) + " - " + JSON.stringify(res));

                    if (typeof errorHandler !== 'undefined') {
                        errorHandler.apply((owner ? owner : this), [ res ]);
                    }
                }
                else
                {
                    if (handler instanceof Function)
                    {
                        handler.apply((owner ? owner : this), [ res ]);
                    }
                }	
			}, function(res){
                $("#toolbar-refresh-button").removeClass("spinning");

				if (typeof res == "string")
                {
                    res = $.parseJSON($.trim(res));
                }

                if (res instanceof Object && "exception" in res)
                {
                    console.warn("exception in " + JSON.stringify(data) + " - " + JSON.stringify(res));
                }
                else
                {
                    if (typeof errorHandler !== 'undefined') {
                        errorHandler.apply((owner ? owner : this), [ res ]);
                    }
                }
			}, "EliademyLms","lmsservice", [name, args]);
			
		},

        setToken: function (token)
        {
            sToken = token;
        },

        getToken: function ()
        {
            return sToken;
        },

        setServerUrl: function (serverUrl)
        {
        	sServerUrl = serverUrl;
        },
        
        getServerUrl: function ()
        {
        	return sServerUrl;
        },
        
        setService: function (service)
        {
        	sService = service;
        },
        
        getService: function ()
        {
        	return sService;
        },
        
        isMoodleService: function ()
        {
        	return (sService.indexOf('moodle') != -1);
        },
        
        isSupported: function(key)
        {
            if(sService.indexOf('moodle') == -1) { 
            	return true;
            } else {
            	return ($.inArray(key, sMoodle[sService]) > -1)
            }
        },
        
        setSesskey: function (key)
        {
            sSessionKey = key;
        },

        getSesskey: function ()
        {
            return sSessionKey;
        }
	};
});
