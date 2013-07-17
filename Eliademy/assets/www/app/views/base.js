/**
 * Eliademy 
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

define(["text!app/templates/base.html", "i18n!nls/strings", "app/tools/linkhandler", "app/models/user",
        "app/tools/servicecalls"],
    function (tpl, str, LinkHandler, UserModel, SC)
{
    return new (Backbone.View.extend(
    {
        template: _.template(tpl),
        el: "#base-content",
        menuOpen: false,
        wmenu : false,
        mainButtonMode: undefined,
        backPath: undefined,

        // Flag that indicates that back button is used (set here and in
        // back button handler, unset in router).
        backClicked: false,

        // Flag that indicates that menu item was used (set here, unset in
        // router).
        sidemenuClicked: false,

        events: {
            "touchend #toolbar-main-button": "mainButtonClicked",
            "swipe #base-container": "menuSwiped",
            "touchend #toolbar-refresh-button": "refreshButtonClicked",
            "touchend #main-menu a": "menuClicked"
        },

        initialize: function() {
        	if($(window).width() > 480){// TODO: Set proper width 
        		this.wmenu = true;
        	}
        },
        
        render: function ()
        {
            var userData = UserModel.toJSON();

            if (userData.profileimageurlsmall)
            {
                userData.profileimageurlsmall = userData.profileimageurl.replace("pluginfile.php",
                    "webservice/pluginfile.php") + "&token=" + SC.getToken();
            }
            var thisThis = this;
            this.$el.html(this.template({ str: str, user: userData, ismoodle: SC.isMoodleService(), showMenu: this.wmenu }));
            if(this.wmenu){
            	require(["app/router"], function (Router) {
            		var isloginpage = Router.mFirstLoginView;
            		if(!isloginpage && (typeof Router.currentPage() !== "undefined")){
            			if(Router.currentPage().pageName == "LoginView"){
            				isloginpage = true;
            			}
            		}
            		if(isloginpage){
            			thisThis.menuOpen = true;
        				this.$("#base-content").css("width", "100%"); 
            			if($(window).width() > 1200){
                            this.$("#main-content").css("width", "80%");
                            this.$("#app-toolbar").css("width", "80%");
                            this.$("#main-menu").css("width", "20%");
                        } else {
                        	this.$("#main-menu").css("width", "30%");
                        	this.$("#app-toolbar").css("width", "70%");
                        	this.$("#main-content").css("width", "70%");
                        }
            			
            			thisThis.showToolbar(true);    			
            		} else {
            			thisThis.menuOpen = false;
                    	this.$("#main-content").css("width", "100%");
                    	this.$("#app-toolbar").css("width", "100%");
            			if($(window).width() > 1200){  
                            this.$("#base-content").css("width", "50%");
                            this.$("#base-content").css("margin-left", "auto");
                            this.$("#base-content").css("margin-right", "auto");
                            this.$("#main-menu").css("width", "20%");
                        } else {
                        	this.$("#base-content").css("width", "100%");
                        	this.$("#main-menu").css("width", "30%"); 	
                        }
            			
            			thisThis.showToolbar(false);
            		}
            	});
            }
            this.$("#main-content").css("min-height", $(window).height());
            LinkHandler.setupView(this);
        },

        showToolbar: function (show)
        {
            if (show)
            {
                this.$("#main-menu").show();
                this.$("#app-toolbar").show();
                this.$("#main-content").css("padding-top", "40px");
            }
            else
            {
                this.$("#main-menu").hide();
                this.$("#app-toolbar").hide();
                this.$("#main-content").css("padding-top", "0px");

                if (this.menuOpen && !this.wmenu)
                {
                    this.$("#base-container").removeClass("open").removeClass("closed");
                    this.menuOpen = false;
                }
            }
        },

        setToolbarMode: function (mode, options)
        {
            switch (mode)
            {
                case "menu":
                    this.$("#toolbar-main-button i").attr("class", "icon-white icon-reorder");
                    if(this.wmenu){
                    	//If with menu 
                    	this.$("#toolbar-main-button-box").hide();
                    }
                    break;

                case "back":
                    this.$("#toolbar-main-button i").attr("class", "icon-white icon-chevron-left");
                    this.$("#toolbar-main-button-box").show();
                    this.backPath = options;
                    break;
            }

            this.mainButtonMode = mode;
        },

        setRefreshVisible: function (visible)
        {
            if (visible)
            {
                this.$("#toolbar-refresh-button").parent().show();
            }
            else
            {
                this.$("#toolbar-refresh-button").parent().hide();
            }
        },

        mainButtonClicked: function (ev)
        {
            ev.preventDefault();

            var thisThis = this;

            switch (this.mainButtonMode)
            {
                case "menu":
                    this.menuOpen = !this.menuOpen || this.wmenu;

                    if (this.menuOpen)
                    {
                        this.$("#base-container").removeClass("closed").addClass("open");
                    }
                    else
                    {
                        this.$("#base-container").removeClass("open").addClass("closed");
                    }

                    break;

                case "back":
                    thisThis.backClicked = true;

                    if (thisThis.backPath)
                    {
                        window.history.go(-1);
                    }
                    else
                    {
                        require(["app/router"], function (Router)
                        {
                            Router.navigate(thisThis.backPath, { trigger: true });
                        });
                    }
                    break;
            }
        },

        menuSwiped: function ()
        {
            if (this.mainButtonMode == "menu" && !this.wmenu)
            {
                this.menuOpen = !this.menuOpen;

                if (this.menuOpen)
                {
                    this.$("#base-container").removeClass("closed").addClass("open");
                }
                else
                {
                    this.$("#base-container").removeClass("open").addClass("closed");
                }
            }
        },

        refreshButtonClicked: function (ev)
        {
            ev.preventDefault();

            require(["app/router"], function (Router)
            {
                Router.refreshCurrentPage();
            });
        },

        menuClicked: function (ev)
        {
            this.sidemenuClicked = true;

            ev.preventDefault();
            this.$("#base-container").removeClass("open").addClass("closed");
            this.menuOpen = false;
        }
    }));
});
