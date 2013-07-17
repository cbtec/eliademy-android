/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/discussions.html", "i18n!nls/strings", "app/tools/dataloader",
        "app/collections/course/courses", "app/tools/linkhandler", "app/models/forum/discussion", "app/router"],
    function (tpl, str, DataLoader, CourseCollection, LinkHandler, DiscussionModel, Router)
{
    return new (Backbone.View.extend(
    {
    	el: "#main-content",
        template: _.template(tpl),

        pageTitle: str.site_name,
        hasToolbar: true,
        toolbarMode: "back",
        toolbarOptions: function () { return "courses/" + this.code },
        stylesheet: "stylesheet-discussions",

        code: undefined,
        course: undefined,

        events: {
            "fastclick .open-discussion": "openDiscussion",
            "fastclick .new-discussion": "newDiscussion"
        },

        render: function ()
        {
            DataLoader.exec({ collection: CourseCollection, where: { code: this.code }, context: this }, function (course)
            {
                this.course = course;

                DataLoader.exec({ collection: course.get("forums"), context: this }, function (forums)
                {
                    this.$el.html(this.template({ str: str, forums: forums.toJSON(), course: course.toJSON() }));

                    LinkHandler.setupView(this);
                });
            });
        },

        refresh: function ()
        {
            this.course.get("forums").reset();
            this.render();
        },

        openDiscussion: function (ev)
        {
            Router.navigate("/courses/" + this.code + "/discussions/"
                + $(ev.currentTarget).attr("data-forum-id") + "/"
                + $(ev.currentTarget).attr("data-discussion-id"), { trigger: true });
        },

        newDiscussion: function (ev)
        {
            Router.navigate("/courses/" + this.code + "/discussions/"
                + $(ev.currentTarget).attr("data-forum-id") + "/new", { trigger: true, replace: true });
        }
    }));
});
