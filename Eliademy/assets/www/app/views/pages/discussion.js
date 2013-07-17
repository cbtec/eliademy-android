/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/discussion.html", "i18n!nls/strings", "app/tools/dataloader",
        "app/collections/course/courses", "app/tools/linkhandler", "app/models/forum/post",
        "app/tools/filetransfer", "app/router", "app/tools/servicecalls"],
    function (tpl, str, DataLoader, CourseCollection, LinkHandler, PostModel, FileTransfer,
                Router, SC)
{
    return new (Backbone.View.extend(
    {
    	el: "#main-content",
        template: _.template(tpl),

        pageTitle: str.site_name,
        hasToolbar: true,
        toolbarMode: "back",
        toolbarOptions: function () { return "courses/" + this.code + "/discussions" },
        stylesheet: "stylesheet-discussion",

        events: {
            "fastclick #forum-new-post-btn": "newPost",
            "fastclick #forum-post-reply-btn": "postNewPost",
//            "fastclick #forum-post-file-btn": "postFile",
            "fastclick .download-link": "fetchAttachment"
        },

        discussion: undefined,
        posts: undefined,

        progressEvent: function(pev) {
        	if (pev.lengthComputable) {
        	  if(pev.loaded == pev.total) {
        		  //$('#progress-bar .bar').css('width', '100%');
        		  Router.showProgress(false);
        	  } else {
        		  //var percent = ((pev.loaded/pev.total)*100) + '%';
        		  //$('#progress-bar .bar').css('width', percent);
        	      Router.showProgress(true);
        	  }
        	} 
        },

        fetchAttachment: function(ev)
        {
        	FileTransfer.owner(this);
        	FileTransfer.downloadFile($(ev.target).attr("data-url") + "&forcedownload=1",
                $(ev.target).attr("data-filename"),
                function () { Router.showProgress(false); },
                function () { Router.showProgress(false); } );
        },

        refresh: function ()
        {
            this.posts.reset();
            this.render();
        },

        render: function ()
        {
            DataLoader.exec({ collection: CourseCollection, where: { code: this.code }, context: this }, function (course)
            {
                DataLoader.exec({ collection: course.get("forums"), context: this }, function (forums)
                {
                    DataLoader.exec({ collection: forums.get(this.forum).get("discussions"), id: this.id, context: this }, function (discussion)
                    {
                        this.discussion = discussion;

                        DataLoader.exec({ collection: discussion.get("posts"), context: this }, function (posts)
                        {
                            this.posts = posts;

                            this.$el.html(this.template({ str: str, posts: posts.toJSON(), discussion: discussion.toJSON(), course: course.toJSON() }));

                            LinkHandler.setupView(this);
                        });
                    });
                });
            });

            FileTransfer.initialize();
        },

        newPost: function ()
        {
            this.$("#forum-reply-compose").show();
            this.$("#forum-new-post").hide();
            this.$("#forum-reply-message").focus();

            setTimeout(function ()
            {
                window.scrollTo(0, document.body.scrollHeight);
            }, 500);
        },

        postNewPost: function (ev)
        {
            var msg = $.trim(this.$("#forum-reply-message").val());

            if (!msg)
            {
                alert("Posts cannot be empty.");

                return;
            }

            var thisThis = this,
                post = new PostModel({
                    message: msg,
                    discussion: this.discussion.get("id"),
                    "parent": this.posts.at(this.posts.length - 1).get("id") });

            $(ev.currentTarget).attr("disabled", "disabled");

            post.save(undefined, { success: function ()
            {
                thisThis.posts.reset();
                thisThis.render();
            }});
        }

        /*
        postFile: function (ev)
        {
            var thisThis = this;

            cordova.exec(function(uri) {
            	var params = {
    					qqfilename : uri.substring(uri.lastIndexOf('/')+1),
    					token: SC.getToken(),
    				};
            	
            	var cbparams = {
    					taskid : thisThis.model.id,
    					submissions : thisThis.submissions,
            			filename : uri.substring(uri.lastIndexOf('/')+1),
            			fbcall : thisThis
    				};
            	FileTransfer.owner(thisThis);
            	Router.showProgress(true);
				var response = FileTransfer.uploadFile(uri, 
						SC.getServerUrl()+"/theme/monorail/ext/ajax_ws_upload_file.php", 
						params, thisThis.success, thisThis.error, cbparams);
				
            }, function(ecode) {
				console.log("Error launching activity - errorcode " + ecode);
			}, "EliademyLms", "getfilesrv", []);
        }
        */
    }));
});
