/**
 * Eliademy.com
 * 
 * @copyright CBTec Oy
 * @license All rights reserved
 */ 

define(["text!app/templates/pages/login.html", "app/tools/servicecalls", "app/models/user", "app/router",
        "app/tools/linkhandler", "i18n!nls/strings", "app/collections/course/courses", "app/views/base",
        "app/definitions/schools"],
    function (tpl, SC, UserModel, Router, LinkHandler, str, CourseCollection, BaseView, SchoolList)
{
    var sInstance = undefined;

    return new (Backbone.View.extend(
    {
        template: _.template(tpl),
        el: "#main-content",

        lastError: undefined,
        fieldData: { username: "", password: "" , serviceurl: "", service: "", mwsshortname: "", urlType: "", loginType: "normal", socialProvider: "", accesstoken: "", email: ""},
        pageName: "LoginView",
        autoLogin: false,
        stylesheet: "stylesheet-login",

        events: {
            "click #loginbtn": "login",
            "submit #magic-login-form": "login",
            "click #fblogin" : "loginFacebook",
            "click input[type=radio]" : "serviceSelect",
            "blur #password": "fieldEdited",
            "blur #username": "fieldEdited",
            "focus #other_service_name": "otherServiceFocused",
            "focus #custom_service_url": "customUrlFocused"
        },
        
        

        initialize: function ()
        {
            sInstance = this;
        },
        
        serviceSelect: function() {
        	if (this.$("input:radio[name=service][value=eliademy]").prop("checked")) {
        		$("#fblogin").show();
        	} else {
        		$("#fblogin").hide();
        	}
        },
        
        render: function ()
        {
        	this.$el.html(this.template({str: str,  lastError: this.lastError, fieldData: this.fieldData, wantsUrl: 'wantsUrl' , autoLogin: this.autoLogin}));
        	LinkHandler.setupView(this);

            var schools = [];

            for (var i in SchoolList)
            {
                schools.push(i);
            }
            
            if(this.autoLogin) {
            	this.doLogin();
            	return;
            }
            
            this.$("#other_service_name").typeahead({ source: schools, items: 3 }).change(function ()
            {
                //$("#username").focus();

                window.alert("Could not find your school in the database. Please use Site URL.");
            });

            this.$("#username").focus(function ()
            {
                setTimeout(function ()
                {
                    window.scrollTo(0, $("#username").offset().top - 5);
                }, 500);
            });
        },

        login: function (ev)
        {
        	this.fieldData = {
                    username: $("#username").val(),
                    password: $("#password").val() };

            if (this.$("input:radio[name=service][value=eliademy]").prop("checked"))
            {
                // Login to Eliademy.
                this.fieldData.serviceurl = "https://eliademy.com/app/";
                this.fieldData.service = "eliademy";
                this.fieldData.mwsshortname = "services";
                this.fieldData.urlType = "eliademy";
                this.fieldData.loginType = "email";

                this.doLogin();
            }
            else if (this.$("input:radio[name=service][value=other]").prop("checked"))
            {
                // TODO...

                this.fieldData.urlType = "other";

                window.alert("Could not find your school in the database. Please use Site URL.");
            }
            else
            {
                // Login using custom URL.
                this.fieldData.serviceurl = $.trim(this.$("#custom_service_url").val());

                if (this.fieldData.serviceurl.substr(this.fieldData.serviceurl.length - 1) != "/")
                {
                    this.fieldData.serviceurl += "/";
                }

                this.fieldData.service = "moodle22";    // TODO: use vanilla Moodle settings.
                this.fieldData.mwsshortname = "eliademy";
                this.fieldData.urlType = "custom";
                this.fieldData.loginType = "email";

                this.doLogin();
            }

            ev.preventDefault();
            ev.stopPropagation();

            return false;
        },

        doLogin: function ()
        {
        	SC.setServerUrl(this.fieldData.serviceurl);
        	SC.setService(this.fieldData.service);

            cordova.exec(function() {
            	cordova.exec(sInstance.loginHandler, sInstance.errorHandler, "EliademyLms",
            			"lmsservice", ["initialize", sInstance.fieldData]);
            }, this.errorHandler, "EliademyLms",
                	"initservice", [{servicename: this.fieldData.service}]);
        },

        loginHandler: function (token)
        {
            if (sInstance.$("input:radio[name=service][value=custom]").prop("checked"))
            {
                var reportData = window.localStorage.getItem("reportData");

                if (reportData)
                {
                    reportData = JSON.parse(reportData);
                }
                else
                {
                    reportData = { reported: [], lastAsked: 0 };
                }

                if ((reportData.reported.indexOf(sInstance.fieldData.serviceurl) == -1) &&
                    (reportData.lastAsked + 604800000 < (new Date()).getTime() ))
                {
                    var name = window.prompt("Help us improve Eliademy by submitting site URL of your school to our database. Please enter your school name.");

                    reportData.lastAsked = (new Date()).getTime();

                    if (name)
                    {
                        reportData.reported.push(sInstance.fieldData.serviceurl);

                        $.ajax({ type: "POST",
                            url: "https://eliademy.com/add_school.php",
                            data: { url: sInstance.fieldData.serviceurl, name: name } });
                    }

                    window.localStorage.setItem("reportData", JSON.stringify(reportData));
                }
            }

        	sInstance.lastError = null;
        	if(token) {
        		SC.setToken(token);
        		if(sInstance.fieldData.urlType.indexOf("eliademy") != -1) {
        			window.localStorage.setItem("userData", JSON.stringify(sInstance.fieldData));
        		}
        	}

        	cordova.exec(function (data){
        		res = $.parseJSON($.trim(data));
        		if (res instanceof Object && res.userid) { 
        			sInstance.lastError = null;

                    UserModel.once("updated", function ()
                    {
                        BaseView.render();
                        if(!SC.isMoodleService()){
                        	Router.navigate("now", { trigger: true });
                        } else {
                        	Router.navigate("courses", { trigger: true });
                        }
                    }, sInstance);

        			//TODO : default lang to english
        			UserModel.set({id : res.userid, lang: "en"}, { silent: true });
        			UserModel.fetch(); 
        		}
        	},sInstance.errorHandler, "EliademyLms","lmsservice", ["siteinfo", {}]);
        },

        errorHandler: function (error)
        {
            sInstance.lastError = str.invalid_login;
            if(sInstance.autoLogin) {
            	sInstance.autoLogin = false;
            	window.localStorage.removeItem("userData");
            	Router.navigate('login',{ trigger: true });
            } else {
                sInstance.render();
            }
        },

        loginFacebook: function(ev) {
        	if (this.$("input:radio[name=service][value=eliademy]").prop("checked"))
        	{
        		var thisThis = this;
        		Router.showProgress(true);
        		require(["facebook"], function (){
        			var appId = "";//TODO: replace with facebook App id
        			window.plugins.facebookConnect.login({permissions: ["email", "user_about_me"], appId: appId}, function(result) {
        				console.log("facebookConnect.login:" + JSON.stringify(result));
        				if(typeof result != 'object')
        				{
        					result = $.parseJSON(result);
        				}
        				if(result.cancelled || result.error) {
        					Router.showProgress(false);
        					console.log("FB login cancelled");
        					thisThis.errorHandler();
        					return;
        				}
        				// Login to Eliademy.
        				sInstance.fieldData.serviceurl = "https://eliademy.com/app/";
        				sInstance.fieldData.service = "eliademy";
        				sInstance.fieldData.mwsshortname = "services";
        				sInstance.fieldData.urlType = "eliademy";
        				sInstance.fieldData.loginType = "social";
        				sInstance.fieldData.socialProvider = "facebook";
        				sInstance.fieldData.accesstoken = result.accessToken;
        				sInstance.fieldData.email = result.email;

        				sInstance.doLogin();
        			});
        		});
        	}

        },
        
        fieldEdited: function (ev)
        {
            var t = $(ev.target);
            this.fieldData[t.attr("id")] = t.val();
        },

        otherServiceFocused: function (ev)
        {
            this.$("input:radio[name=service][value=other]").prop("checked", true);
        },

        customUrlFocused: function (ev)
        {
            this.$("input:radio[name=service][value=custom]").prop("checked", true);
        }
    }));
});
