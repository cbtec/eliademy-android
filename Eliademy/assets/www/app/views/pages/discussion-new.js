/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/discussion-new.html", "i18n!nls/strings", "app/collections/course/courses",
        "app/tools/linkhandler", "app/models/forum/discussion", "app/router", "app/tools/dataloader"],
    function (tpl, str, CourseCollection, LinkHandler, DiscussionModel, Router, DataLoader)
{
    return new (Backbone.View.extend(
    {
    	el: "#main-content",
        template: _.template(tpl),

        pageTitle: str.site_name,
        hasToolbar: true,
        toolbarMode: "back",
        toolbarOptions: function () { return "courses/" + this.code + "/discussions" },
        stylesheet: "stylesheet-discussion-new",

        events: {
            "fastclick #new-discussion-btn": "newDiscussion"
        },

        refresh: function ()
        {
            this.render();
        },

        render: function ()
        {
            DataLoader.exec({ collection: CourseCollection, where: { code: this.code }, context: this }, function (course)
            {
                this.course = course;

                this.$el.html(this.template({ str: str }));
                this.$("#new-discussion-subject").focus();

                LinkHandler.setupView(this);
            });
        },

        newDiscussion: function (ev)
        {
            var thisThis = this,
                disc = new DiscussionModel({
                    course: this.course.get("id"),
                    forum: this.forum,
                    name: this.$("#new-discussion-subject").val(),
                    message: this.$("#new-discussion-message").val() });

            disc.save(undefined, { success: function ()
            {
                thisThis.course.get("forums").reset();

                Router.navigate("/courses/" + thisThis.code + "/discussions", { trigger: true });
            }});
        }
    }));
});
