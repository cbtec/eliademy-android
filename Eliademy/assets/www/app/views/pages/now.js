/**
 * Eliademy.com
 * 
 * @copyright CBTec Oy
 * @license All rights reserved
 */ 

define(["text!app/templates/pages/now.html", "i18n!nls/strings", "app/collections/event/events", "app/tools/dataloader",
        "app/tools/linkhandler", "app/router"],
	function (tpl, str, EventCollection, DataLoader, LinkHandler, Router)
{
	return new (Backbone.View.extend(
	{
		template: _.template(tpl),
		el: "#main-content",

        pageTitle: str.site_name,
        hasToolbar: true,
        toolbarMode: "menu",
        stylesheet: "stylesheet-now",

        refresh: function ()
        {
            EventCollection.reset();

            this.render();
        },
        events: {
            "fastclick .event-link": "openTask"
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
        },
        
		render: function ()
		{
            DataLoader.exec({ collection: EventCollection, context: this }, function (ev)
            {
                this.$el.html(this.template({ str: str, data: ev.toJSON() }));

                this.undelegateEvents();
                this.delegateEvents();
                LinkHandler.setupView(this);
            });
		}
	}));
});
