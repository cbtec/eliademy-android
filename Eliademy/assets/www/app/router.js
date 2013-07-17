/**
 * Eliademy 
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

define(["app/models/user", "app/views/base", "spin", "app/tools/servicecalls"], function(UserModel, BaseView, Spinner, SC)
{
    return new (Backbone.Router.extend(
    {
        mCurrentPage: undefined,
        spinner: undefined,
        inProgress: false,
        mFirstLoginView: true,

        initialize: function ()
        {
            this.spinner = new Spinner({ lines: 12, length: 8, width: 3, radius: 11, corners: 1, rotate: 0,
                direction: 1, color: '#000', speed: 1, trail: 60, shadow: false, hwaccel: false, className: 'spinner',
                zIndex: 2e9, top: 'auto', left: 'auto' });
        },

        showPage: function (view)
        {
            this.mCurrentPage = view;

            BaseView.showToolbar(view.hasToolbar);

            if (view.stylesheet)
            {
                this.setStyle(view.stylesheet);
            }

            if (view.toolbarMode)
            {
                BaseView.setToolbarMode(view.toolbarMode,
                    view.toolbarOptions instanceof Function ? view.toolbarOptions.call(view) : view.toolbarOptions);
            }
            else
            {
                BaseView.setToolbarMode(null);
            }

            BaseView.setRefreshVisible(view.refresh instanceof Function);

            view.$el.html("<div id=\"spinner\" style=\"width: 50px; height: 50px; margin-top: -25px; margin-left: -25px; position: absolute; left: 50%; top: " + ($(window).height() / 2) + "px;\"></div>");
            this.spinner.spin($("#spinner").get(0));
            view.render();
        },

		changePage : function(view)
		{
			
            var thisThis = this;

            if (!$("#main-content > div").length || BaseView.sidemenuClicked)
            {
                this.showPage(view);

                BaseView.backClicked = false;
                BaseView.sidemenuClicked = false;
            }
            else
            {
                var dir = BaseView.backClicked ? "A" : "B";

                BaseView.backClicked = false;

                $("#main-content > div").addClass("switch" + dir + "A").bind("animationend webkitAnimationEnd", function ()
                {
                    $("#main-content > div").removeClass("switch" + dir + "A").unbind("animationend webkitAnimationEnd");

                    thisThis.showPage(view);

                    $("#main-content > div").addClass("switch" + dir + "B").bind("animationend webkitAnimationEnd", function ()
                    {
                        $("#main-content > div").removeClass("switch" + dir + "B").unbind("animationend webkitAnimationEnd");
                    });
                });
            }
		},

        setStyle: function (style)
        {
            $(".stylesheet").attr("disabled", "true");
            $("#" + style).removeAttr("disabled");

            $("#main-menu a").removeClass("selected");
            $("#main-menu a." + style).addClass("selected");
        },

        refreshCurrentPage: function ()
        {
            if (this.mCurrentPage && this.mCurrentPage.refresh instanceof Function)
            {
                $("#toolbar-refresh-button").addClass("spinning");

                this.mCurrentPage.$el.html("<div id=\"spinner\" style=\"width: 50px; height: 50px; margin-top: -25px; margin-left: -25px; position: absolute; left: 50%; top: " + ($(window).height() / 2) + "px;\"></div>");
                this.spinner.spin($("#spinner").get(0));

                this.mCurrentPage.refresh();
            }
        },
        
        
        showProgress: function (show) {
        	if(show && !this.inProgress) {
        		this.inProgress = true;
        		var xpos = ($(window).height() / 2) + $(window).scrollTop();      		
        		//this.mCurrentPage.$el.append("<div class=\"progress progress-striped active\" id=\"progress-bar\" style=\"width:" +($(window).width() / 2)+"px; height: 20px; display:block; margin-top: -25px; margin-left: -25px; position:absolute; top:" + xpos + "px;\"><div class=\"bar\" id=\"progress-now\" style=\"width: 5%;\"></div></div>");       		
        		//$("#progress-bar").show(); 
        		//$("#progress-bar").remove();
        		this.mCurrentPage.$el.append("<div id=\"spinner\" style=\"width: 50px; height: 50px; margin-top: -25px; margin-left: -25px; position: absolute; left: 50%; top: " + xpos + "px;\"></div>"); 
        		this.spinner.spin($("#spinner").get(0)); 		
        	} else if(!show){
        		this.inProgress = false;
        		$("#spinner").remove();
        	}
        },

        showMessage: function(message, title, buttonText)
        {
		    navigator.notification.alert(message,function(){}, 
		    		(typeof title !== 'undefined' ? title : 'Not Supported'), 
		    		(typeof buttonText !== 'undefined' ? buttonText : 'Ok'));
        },
        
        currentPage: function ()
        {
            return this.mCurrentPage;
        },

		routes : {
			"" : "login",
			"login" : "login",
			"login/:auto" : "login",
			"now" : "now",
			"courses" : "courses",
			"courses/:id": "course",
			"courses/:id/discussions": "discussions",
			"courses/:id/discussions/:forum/new": "newDiscussion",
			"courses/:id/discussions/:forum/:discussion": "discussion",
			"tasks": "tasks",
			"tasks/:taskid": "task",
			"quizzes/:taskid": "quiz",
			"courses/:id/participants": "participants",
			"notifications" : "notifications",
			"logout" : "logout",
            "*any": "anyPage"
		},

        anyPage: function (any)
        {
            console.log("rendering the any page! " + any);
        },

		login : function(e) {
			var thisThis = this;
			if(e || this.mFirstLoginView) {
        		var data = window.localStorage.getItem("userData");
        		if(data) {
        			this.mFirstLoginView = false;
        			require([ "app/views/pages/login" ], function(LoginView) {		
        				if(LoginView.autoLogin){
        					return; //page already loaded
        				}
                    	LoginView.fieldData = JSON.parse(data);
                    	LoginView.autoLogin = true;
                    	thisThis.changePage(LoginView);
                    });
        			return;
        		}
        	}
            if (this.mFirstLoginView)
            {

                this.mFirstLoginView = false;

                require([ "app/views/pages/login" ], function(LoginView) {              	
                	LoginView.autoLogin = false;
                    thisThis.changePage(LoginView);
                });
            }
            else
            {
                location.reload();
            }
		},
		
		courses : function() {
			var thisThis = this;
			require([ "app/views/pages/courses" ], function(CoursesView) {
				thisThis.changePage(CoursesView);
			});
		},

		now : function() {
			var thisThis = this;
			require([ "app/views/pages/now" ], function(NowView) { 
				thisThis.changePage(NowView);
			});
		},
		
		
		notifications : function() {
			var thisThis = this;
			require([ "app/views/pages/notifications" ], function(NotificationsView) { 
				thisThis.changePage(NotificationsView);
			});
		},
		
		course : function(code) {
			var thisThis = this;
			require([ "app/views/pages/course" ], function(CourseView) { 				
                CourseView.code = code;
				thisThis.changePage(CourseView);
			});
		},

		tasks : function() {
			if(!SC.isSupported("tasks")) {
				this.showMessage("Tasks view not supported");
				return;
			}
			var thisThis = this;
			require([ "app/views/pages/tasks" ], function(TasksView) {
				thisThis.changePage(TasksView);
			});
		},

		task : function(taskid) {
			if(!SC.isSupported("task")) {
				this.showMessage("Task details view and task submission not supported");
				window.history.go(-1);
				return;
			}
			
			var thisThis = this;
			require([ "app/views/pages/task" ], function(TaskView) {
				TaskView.instanceid = parseInt(taskid);
                TaskView.model = null;
                TaskView.isnew = false;
                TaskView.subid = undefined;
				thisThis.changePage(TaskView);
			});
		},

		quiz : function(taskid) {
			var thisThis = this;
			require([ "app/views/pages/quiz" ], function(QuizView) {
				QuizView.instanceid = parseInt(taskid);
                QuizView.pageMode = 0;
				thisThis.changePage(QuizView);
			});
		},
		
		participants : function(code) {
			var thisThis = this;
			require([ "app/views/pages/participants" ], function(ParticipantsView) {
				ParticipantsView.code = code;
				thisThis.changePage(ParticipantsView);
			});
		},

        discussions: function (code)
        {
        	if(!SC.isSupported("discussions")) {
        		this.showMessage("Discussions view not supported");
        		window.history.go(-1);
				return;
			}
			var thisThis = this;
			require([ "app/views/pages/discussions" ], function(DiscussionView) { 				
                DiscussionView.code = code;
				thisThis.changePage(DiscussionView);
			});
        },

        newDiscussion: function (code, forum)
        {
        	if(!SC.isSupported("newdiscussion")) {
        		this.showMessage("Starting new discussion not supported");
        		//window.history.go(-1);
				return;
			}
			var thisThis = this;
			require([ "app/views/pages/discussion-new" ], function(DiscussionView) { 				
                DiscussionView.code = code;
                DiscussionView.forum = forum;
				thisThis.changePage(DiscussionView);
			});
        },

        discussion: function (code, forum, id)
        {
        	if(!SC.isSupported("discussion")) {
				this.showMessage("Discussion details view not supported");
				window.history.go(-1);
				return;
			}
			var thisThis = this;
			require([ "app/views/pages/discussion" ], function(DiscussionView) { 				
                DiscussionView.code = code;
                DiscussionView.forum = forum;
                DiscussionView.id = id;
				thisThis.changePage(DiscussionView);
			});
        },

        logout : function() {
        	var thisThis = this;
        	navigator.notification.confirm(
        			'Are you sure you want to log out?', 
        			function (data){
        				if(data == 1) {//Ok
        					//remove locally stored user data
        					window.localStorage.removeItem("userData");
        					if (!SC.isMoodleService()) {
        						//logout from facebook
        						require(["facebook"], function (){
        							window.plugins.facebookConnect.logout(function(result) {
        								console.log("facebookConnect.logout:" + JSON.stringify(result));
        							});
        						});
        						cordova.exec(
        								function() {
        									console.log("Un-Registered for push notifications");
        									UserModel.setPushRegisterId(0);
        								}, 
        								function(error){
        									console.log("Error unregistering for push notifications");
        									UserModel.setPushRegisterId(0);
        								},
        								"EliademyLms","lmsservice", ["pushunregister",
        								                             {userid : UserModel.get('id'), deviceid : window.device.uuid, 
        									registerid : UserModel.getPushRegisterId(), token:SC.getToken() }]);
        						require(["pushnotifs"], function (){
        							//disable push notificationd for this user
        							window.plugins.GCM.unregister(function() {
        								console.log("Push notification unregistered")
        							}, function() {
        								console.log("Push notification unregister error!")
        							});
        						});
        					}
        					cordova.exec(function (data){
        						thisThis.navigate("/", { trigger: true });
        					}, function (data){navigator.app.exitApp();}, "EliademyLms","lmsservice", ["deinitialize", {sessionkey: UserModel.get("sessionkey")}]);
        				} else {
        					window.history.back();
        				}
        			}            
        	);
        },
	}));
});
