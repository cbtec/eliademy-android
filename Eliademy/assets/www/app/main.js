/**
 * Eliademy 
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

require.config({
    baseUrl: 'lib',

    paths: {
        backbone: "backbone-min",
        cordova: "cordova-2.7.0",
        pushnotifs : "GCMPlugin",
        facebook: "FacebookConnect",
        underscore: "lodash.min",
        jquery: "jquery-2.0.0.min",
        spin: "spin.min",
        bootstrap: "bootstrap.min",
        nls: "../app/nls",
        app: "../app"
    },

    shim: {
        underscore: { exports: "_" },
        backbone: { deps: ['jquery', 'underscore'], exports: 'Backbone' },
        cordova: { exports: 'cordova' },
        pushnotifs: { exports: 'pushnotifs' },
        bootstrap: { deps: ["jquery"] }
    },
});

var pushregisterid = '';

define(['app/router', "app/views/base", "bootstrap", 'domReady!'], function(Router, BaseView)
{
	var remote = true;
    if (remote)
    {
        // Running on cordova
        require(["app/models/user", "app/tools/servicecalls", "cordova", "pushnotifs"], function (UserModel, SC)
        {
        	
            
            document.addEventListener('deviceready', function ()
            {
                document.addEventListener("backbutton", function(e)
                {
                    if(Router.currentPage().pageName == "LoginView"){
                        e.preventDefault();
                        navigator.app.exitApp();
                    } else {
                        BaseView.backClicked = true;
                        navigator.app.backHistory()
                    }
                }, false);
                
                window.addEventListener("orientationchange", function(e) {
                	if(($(window).width() > 1200) || ($(window).height() > 1200)) {
                		var orientation = ($(window).width() > $(window).height()) ? 0 : 1;
                		switch(orientation) {
                		case 0://portrait
            				this.$("#base-content").css("width", "100%");
                			if(Router.currentPage().pageName == "LoginView"){
                				this.$("#main-content").css("width", "100%");
                				this.$("#app-toolbar").css("width", "100%");
                				this.$("#main-menu").css("width", "30%");
                			} else {          
                				this.$("#main-content").css("width", "70%");
                				this.$("#app-toolbar").css("width", "70%");
                				this.$("#main-menu").css("width", "30%");
                			}
                			break;
                		case 1://landscape
            				this.$("#main-menu").css("width", "20%");
                			if(Router.currentPage().pageName == "LoginView"){
                				this.$("#base-content").css("width", "50%");
                				this.$("#base-content").css("margin-left", "auto");
                				this.$("#base-content").css("margin-right", "auto");
                				this.$("#main-content").css("width", "100%");
                				this.$("#app-toolbar").css("width", "100%");
                			} else {
                				this.$("#base-content").css("width", "100%");
                				this.$("#main-content").css("width", "80%");
                				this.$("#app-toolbar").css("width", "80%");
                			}
                			break;
                		}
                	}
                }, false);		
                // Hiding splash screen when app is loaded
                cordova.exec(null, null, 'SplashScreen', 'hide', []);
				UserModel.once("updated", function() {
					if (!SC.isMoodleService()) {
					    window.plugins.GCM.register("Get Application GCMId",
							"notificationevent", function() {
								console.log("Push notification registered")
							}, function() {
								console.log("Push notification error!")
							});
					}
				});
                
                BaseView.render();
                Backbone.history.start();

                if(window.localStorage.getItem("userData")) {
                    Router.navigate('login/true',{ trigger: true });	
                } else {
                	Router.navigate('login',{ trigger: true });
                }
                

            }, false);
        });
    }
    else
    {
        // Running on desktop
        require(["app/models/user", "app/tools/servicecalls"], function (UserModel, SC)
        {
            // XXX: set to your Moodle URL.
            MoodleDir = "";

            $.ajax({ url: MoodleDir + "theme/monorail/ext/ajax_get_token.php", context: this, dataType: "json",
                success: function (data)
                {
                    if (data instanceof Object && data.token)
                    {
                        SC.setToken(data.token);
                        SC.setSesskey(data.sesskey);
                        requirejs.config({config: { i18n: { locale: data.lang }}});
                        UserModel.set({id : data.userid, lang: data.lang}, { silent: true });
                        UserModel.fetch();

                        UserModel.once("updated", function ()
                        {
                            BaseView.render();
                            Backbone.history.start({ pushState: false, root: "/~aurelijus/hh/" });
                        });
                    }
                }, error: function ()
                {
                    BaseView.render();
                    Backbone.history.start();
                }});
        });
    }

    $(document).ajaxComplete(function()
    {
        $("#toolbar-refresh-button").removeClass("spinning");
    });

    var firstTouch = {}, lastTouch = {};

    window.addEventListener("touchstart", function (ev)
    {
        if (ev.touches.length)
        {
            firstTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
            lastTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
        }
    }, false);

    window.addEventListener("touchmove", function (ev)
    {
        if (ev.touches.length)
        {
            lastTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
        }

        if ($("#base-container").hasClass("open"))
        {
            // Preventing scroll when menu is open.
            ev.preventDefault();
        }
    }, false);

    window.addEventListener("touchend", function (ev)
    {
        var dx = Math.abs(firstTouch.x - lastTouch.x),
            dy = Math.abs(firstTouch.y - lastTouch.y);

        if (dx > dy && dx > 10)
        {
            $("#base-container").trigger("swipe");
        }
    }, false);
});

function notificationevent(e) {
    switch( e.event )
    {
    case 'registered':
      require(["app/models/user", "app/tools/servicecalls", "cordova"], function (UserModel, SC) {
    	  UserModel.setPushRegisterId(e.registrationId);
    	  console.log("Userid: "+ UserModel.get('id'))
    	  cordova.exec(function() {console.log("Registered for push notifications");}, 
      			function(error){console.log("Error registering for push notifications");}, "EliademyLms",
      			"lmsservice", ["pushregister",
      			{userid : UserModel.get('id'), deviceid : window.device.uuid, registerid : e.registrationId, token:SC.getToken() } ]);
      });	 	  
      break;
    case 'unregistered':
        require(["app/models/user", "app/tools/servicecalls", "cordova"], function (UserModel) {
        	cordova.exec(function() {
        		console.log("Un-Registered for push notifications");
        		UserModel.setPushRegisterId(0);
        		}, 
        		function(error){
        			console.log("Error unregistering for push notifications");
        			UserModel.setPushRegisterId(0);
        			},
        			"EliademyLms",
        			"lmsservice", ["pushunregister",
        			{userid : UserModel.get('id'), deviceid : window.device.uuid, 
        			registerid : UserModel.getPushRegisterId(), token:SC.getToken() }]);
      	  UserModel.setPushRegisterId();
          });	  	  
    	  pushregisterid = e.registrationId;
    break;   
    case 'notifications':
    	//TODO: Better to just add another notification to collection and render
    	require([ "app/collections/notifications/notifications", 'app/router' ], function(NotificationsCollection, Router) {
    		NotificationsCollection.reset();
    		Router.navigate('notifications',{ trigger: true });
    	});	
  	console.log(e.notifications);
      break;
    case 'error':
    console.log(e.error)	
      break;
    default:
      break;
    }
  }
