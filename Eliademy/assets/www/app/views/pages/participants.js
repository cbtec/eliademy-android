/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/participants.html", "i18n!nls/strings", "app/collections/course/courses", "app/tools/dataloader","app/tools/linkhandler" ],

    function (tpl, str, CourseCollection, DataLoader, LinkHandler)
{
    return new (Backbone.View.extend(
    {
    	el: "#main-content",

        code : null,
        model : null,
        hasToolbar: true,
        toolbarMode: "back",
        toolbarOptions: { back: "courses" },
        stylesheet: "stylesheet-participants",

        template: _.template(tpl),

        events: {
            "fastclick .participant-email": "emailClicked"
        },

        refresh: function ()
        {
            this.model.get("participants").reset();
            this.render();
        },

        render: function ()
        {
            DataLoader.exec({ collection: CourseCollection, where: { code: this.code }, context: this }, function (model)
            {
                this.model = model;

                DataLoader.exec({ collection: model.get("participants"), context: this }, function (participants)
                {
                    this.$el.html(this.template({ str: str, participants: participants.toJSON(), course: this.model.toJSON()}));
                    LinkHandler.setupView(this);
                });
            });
        },

        emailClicked: function (ev)
        {
        	navigator.app.loadUrl("mailto:" + $(ev.currentTarget).text(), { openExternal:true });
        }
    }));
});
