/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/quiz.html", "text!app/templates/pages/quiz_take.html",
        "text!app/templates/pages/quiz_result.html", "i18n!nls/strings", "app/models/task/task", 
        "app/collections/course/courses", "app/collections/task/tasks", "app/tools/dataloader",
        "app/tools/servicecalls", "app/tools/filetransfer", "app/router", "app/tools/inlineedit",
        "app/tools/linkhandler", "app/tools/inlinecontent"],

    function (tpl, tpl_take, tpl_result, str, TaskModel, CourseCollection, TaskCollection,
              DataLoader, SC, FileTransfer, Router, InlineEdit, LinkHandler, InlineContent)
{
    return new (Backbone.View.extend(
    {
    	el: "#main-content",    	
        instanceid: null,
        model : null,
        pageMode: 0,
        hasToolbar: true,
        stylesheet: "stylesheet-quiz1",
        toolbarMode: "back",
        toolbarOptions: "courses",

        template: _.template(tpl),  
        template_take: _.template(tpl_take),  
        template_result: _.template(tpl_result),  
        
        events: {
            "fastclick #quiz-take-btn": "takeQuiz",
            "fastclick #quiz-finish-btn": "finishQuiz",
            "fastclick .download-link": "fetchAttachment",
        },

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
        	FileTransfer.downloadFile($(ev.target).attr("data-url").replace("WSTOKEN", SC.getToken()) + "&forcedownload=1",
                $(ev.target).attr("data-filename"),
                function () { Router.showProgress(false); },
                function () { Router.showProgress(false); } );
        },

        refresh: function ()
        {
            TaskCollection.reset();
            this.render();
        },

        render: function()
        {
            DataLoader.exec({ collection: TaskCollection, where: { instanceid: this.instanceid }, context: this }, function (model)
            {
                this.model = model;

                var task = model.toJSON(true);
                var answ = { }, correct = 0;

                task.dueDate = new Date(task.duedate * 1000);

                if (task.answers.length)
                {
                    // Quiz has answers. Showing results.
                    this.pageMode = 2;

                    _.each(task.answers[0].questions, function (q)
                    {
                        var choice = { }, allCorrect = true;

                        _.each(q.answers, function (a)
                        {
                            choice[a.answer] = a.checked;

                            if (a.checked != a.correct)
                            {
                                allCorrect = false;
                            }
                        });

                        if (allCorrect)
                        {
                            correct++;
                        }

                        answ[q.question] = choice;
                    });
                }

                DataLoader.exec({ collection: CourseCollection, id: model.get("courseid"), context: this }, function (cmodel)
                {
                    switch (this.pageMode)
                    {
                        // Start quiz
                        case 0:
                            this.$el.html(this.template({ str: str, task: task, course: cmodel.toJSON() }));
                            Router.setStyle("stylesheet-quiz1");
                            break;

                        // Quiz in progress
                        case 1:
                            console.log(JSON.stringify(model.get("attachments").toJSON()));
                            this.$el.html(this.template_take({ str: str, task: task, course: cmodel.toJSON(), attachments: model.get("attachments").toJSON() }));
                            Router.setStyle("stylesheet-quiz2");

                            setTimeout(function()
                            {
                                $('input').prop("checked", false);
                            }, 500);

                            break;

                        // View results
                        case 2:
                            this.$el.html(this.template_result({ str: str, task: task, course: cmodel.toJSON(), attachments: model.get("attachments").toJSON(), answers: answ, correct: correct }));
                            Router.setStyle("stylesheet-quiz3");
                            break;
                    }

                    InlineContent.fixAttachmentUrls(this.$el, model.get("attachments"));

                    this.undelegateEvents();
                    this.delegateEvents();

                    LinkHandler.setupView(this);
                });
            });

            FileTransfer.initialize();
        },

        takeQuiz: function (ev)
        {
            this.pageMode = 1;
            this.render();
        },

        finishQuiz: function (ev)
        {
            ev.preventDefault();

            this.model.set({ attempt: 1 }, { silent: true });

            var inlineEdit = new InlineEdit();

            inlineEdit.init(this);
            inlineEdit.commit(false);

            var thisThis = this;

            this.model.save(undefined, { validate: false, success: function ()
            {
                // Make sure this model is re-fetched from server.
                TaskCollection.remove(thisThis.model);
                CourseCollection.reset();
                thisThis.render();
            }});
        }
    }));
});
