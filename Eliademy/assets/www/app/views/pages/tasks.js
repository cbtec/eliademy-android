/**
 * Eliademy.com
 * 
 * @copyright CBTec Oy
 * @license All rights reserved
 */ 

define(["text!app/templates/pages/tasks.html", "i18n!nls/strings", "app/collections/course/courses",
        "app/tools/linkhandler", "app/router", "app/tools/dataloader"],
	function (tpl, str, CourseCollection, LinkHandler, Router, DataLoader)
{
	return new (Backbone.View.extend(
	{
		template: _.template(tpl),
		el: "#main-content",

        pageTitle: str.site_name,
        hasToolbar: true,
        toolbarMode: "menu",
        stylesheet: "stylesheet-tasks",

        events: {
            "fastclick .task-link": "openTask"
        },

        refresh: function ()
        {
            CourseCollection.reset();

            this.render();
        },

		render: function ()
		{
            DataLoader.exec({ collection: CourseCollection, context: this }, function (items)
            {
                var taskData = [ ];
                var gradedTaskData = [];
                

                items.each(function (course)
                {
                    var c = course.toJSON();

                    if (!c.completed)
                    {
                        _.each(c.assignments, function (a)
                        {
                            if (!a.canedit && !a.haveSubmissions && a.visible)
                            {
                                if (a.duedate) {
                                    a.dueDate = new Date(a.duedate * 1000);
                                }
                                
                                a.course = c;
                                a.graded = false;
                                if(a.grades && a.grades.length > 0) {
                                	//Grade info may be present
                                	if(a.grades[0].dategraded) {
                                	    a.graded = true;
                                	    a.gradestring = a.grades[0].gradestring;
                                	    a.feedback = a.grades[0].feedback;
                                	    gradedTaskData.push(a);
                                	    
                                	}
                                } 
                                if(!a.graded)
                                    taskData.push(a);
                            // If we have submissions and we are graded 
                            } else if (!a.canedit && a.visible && a.grades && a.grades.length > 0){
                            	if(a.grades[0].dategraded || a.score) {
                            	    a.graded = true;
                            	    if(a.modulename == "quiz") {
                            	      a.gradestring = a.score;
                                	  a.feedback = '';	
                            	    } else {
                            	      a.gradestring = a.grades[0].gradestring;
                            	      a.feedback = a.grades[0].feedback;
                            	    }
                            	    gradedTaskData.push(a);                     	    
                            	}                	
                            } 
                        });
                    }
                });
                
                var sortTaskData = _.sortBy(taskData, "duedate");
                var sortGradedTaskData = _.sortBy(gradedTaskData, "duedate");
                var tasks = sortTaskData.concat(sortGradedTaskData);
                this.$el.html(this.template({ str: str, tasks: tasks }));
                LinkHandler.setupView(this);
            });
		},

        openTask: function (ev)
        {
            switch ($(ev.currentTarget).attr("data-task-type"))
            {
                case "quiz":
                    Router.navigate("/quizzes/" + $(ev.currentTarget).attr("data-task-id"), { trigger: true });
                    break;

                default:
                    Router.navigate("/tasks/" + $(ev.currentTarget).attr("data-task-id"), { trigger: true });
                    break;
            }
        }
	}));
});
