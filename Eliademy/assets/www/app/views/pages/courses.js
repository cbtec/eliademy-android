/**
 * Eliademy.com
 * 
 * @copyright CBTec Oy
 * @license All rights reserved
 */ 

define(["text!app/templates/pages/courses.html", "i18n!nls/strings", "app/collections/course/courses", "app/models/user",
        "app/tools/linkhandler", "app/router", "app/tools/dataloader", "app/tools/servicecalls"],
	function (tpl, str, CourseCollection, UserModel, LinkHandler, Router, DataLoader, SC)
{
	return new (Backbone.View.extend(
	{
		template: _.template(tpl),
		el: "#main-content",

        pageTitle: str.site_name,
        hasToolbar: true,
        toolbarMode: "menu",
        stylesheet: "stylesheet-courses",

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
                var courseData = [ ];

                items.each(function (course)
                {
                    var c = course.toJSON();

                    if (!c.completed)
                    {
                        _.each(c.assignments, function (a) {
                            if (a.duedate) {
                                a.dueDate = new Date(a.duedate * 1000);

                                days = Math.ceil((new Date()).getTime() / 86400000) - Math.ceil(a.duedate / 86400);
                                if (days > 0) {
                                    a.daysLate = str.n_days_late(days);
                                }
                            }
                        });

                        courseData.push(c);
                    }
                });
                this.$el.html(this.template({ str: str, courses: courseData , ismoodle: SC.isMoodleService() }));
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
