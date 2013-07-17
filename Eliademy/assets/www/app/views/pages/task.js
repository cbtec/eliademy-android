/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/task.html", "i18n!nls/strings", "app/models/task/task", 
        "app/collections/course/courses", "app/collections/task/tasks", "app/tools/dataloader",
        "app/tools/servicecalls", "app/tools/filetransfer", "app/collections/task/submissionfiles",
        "app/models/task/submissionfile", "app/tools/linkhandler", "app/router", "app/tools/inlinecontent"],

    function (tpl, str, TaskModel, CourseCollection, TaskCollection, DataLoader, SC, 
    		FileTransfer, SubmissionFilesCollection, SubmissionFileModel, LinkHandler, Router, InlineContent)
{
    return new (Backbone.View.extend(
    {
    	
    	el: "#main-content",    	
        instanceid: null,
        model : null,
        isnew : null,
        subid : null,
        hasToolbar: true,
        stylesheet: "stylesheet-task",
        toolbarMode: "back",
        
        toolbarOptions: "courses",
        submissions: null,
        template: _.template(tpl),  
        
        events: {
        	"fastclick .submission" : "fetchAttachment",
        	"fastclick .download-link" : "fetchAttachment",
        	"fastclick #task-submit-file" : "submitFile",
            "fastclick #task-draft-btn": "submitTask",
            "fastclick #task-submit-btn": "submitTask"
        },
        
        refresh: function ()
        {
            this.submissions.reset();
            this.render();
        },
        
        success: function(response, cbparams) {
        	var res = $.parseJSON(response);
        	Router.showProgress(false);
			if (res.success) {
				var smd = new SubmissionFileModel();
				smd.set('assignid', cbparams.taskid);
				smd.set('filename', cbparams.filename);
				smd.set('name',res.uploadName);
				smd.save({}, { success: function ()
		            {
						cbparams.submissions.reset();
						cbparams.fbcall.render();
		            }});
			}
        },
        
        error: function(response, cbparams) {
        	Router.showProgress(false);
        },
        
        submitFile: function (ev) {
        	ev.preventDefault();
        	ev.stopPropagation(); 
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
            
        },

        submitTask: function (ev)
        {
            var sub = this.submissions.at(0);

            if (sub)
            {
                sub.set({ "assignid": this.model.get("id"), "status": ($(ev.currentTarget).attr("id") == "task-submit-btn" ? 1 : 0),
                    "text": this.$("#submission-textarea").val() });

                sub.save(undefined, { success: function ()
                {
                    CourseCollection.reset();
                    window.history.go(-1);
                }});
            }
        },
        
        progressEvent: function(pev) {
        	if (pev.lengthComputable) {
        	  if(pev.loaded == pev.total) {
        		  Router.showProgress(false);
        	  } else {
        	      Router.showProgress(true);
        	  }
        	} 
        },
        
        downloadComplete: function(filepath)
        {
        	Router.showProgress(false);
        },
        
        fetchAttachment: function(ev)
        {
        	ev.preventDefault();
        	ev.stopPropagation();
        	var filename = $(ev.currentTarget).attr("filename");
        	if(filename.indexOf('.') == -1) {
        		var mime = $(ev.currentTarget).attr("mimetype").substring($(ev.currentTarget).attr("mimetype").lastIndexOf('/')+1);
        		if(!mime || mime.length != 0) {
        			filename = filename + "." + mime;
        		}
        	}
        	FileTransfer.owner(this);      	
        	FileTransfer.downloadFile($(ev.target).attr("value") , filename, this.downloadComplete, this.downloadComplete);
        },
        
        render: function()
        {
           // Load task.
           DataLoader.exec({ collection: TaskCollection, where: { instanceid: this.instanceid }, context: this }, function (model)
           {
               this.model = model;
               // Make sure we have the course.
               DataLoader.exec({ collection: CourseCollection, id: model.get("courseid"), context: this }, function (cmodel)
               {
                    this.courseModel = cmodel;
                    //Get the submissions for this task if any !
                    this.submissionFiles = new SubmissionFilesCollection();

                    this.submissionFiles.setTaskId(this.model.id);

                    // Load file submissions.
                    DataLoader.exec({ collection: this.submissionFiles, context: this }, function (fileSubmissions)
                    {
                        // Load submission text/status.
                        DataLoader.exec({ collection: this.model.get("submissions"), context: this }, function (submissions)
                        {
                            this.submissions = submissions;

                            var task = this.model.toJSON();
                            task.dueDate = new Date(task.duedate * 1000);

                            this.$el.html(this.template({ str: str, task: task, attachments: model.get("attachments").toJSON(),
                                course: this.courseModel.toJSON(), fileSubmissions: fileSubmissions.toJSON(),
                                sub: submissions.at(0).toJSON() }));

                            InlineContent.fixAttachmentUrls(this.$el, model.get("attachments"));

                            LinkHandler.setupView(this);
                        });
                    });
               });
           });

           FileTransfer.initialize();
        }
    }));
});
