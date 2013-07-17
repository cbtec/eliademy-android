/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/notifications.html", "i18n!nls/strings", "app/collections/notifications/notifications", 
        "app/tools/dataloader","app/tools/linkhandler", "app/tools/servicecalls",  "app/router"],

    function (tpl, str, NotificationsCollection, DataLoader, LinkHandler,  SC, Router)
{
    return new (Backbone.View.extend(
    {
    	el: "#main-content",

        model : null,
        hasToolbar: true,
        toolbarMode: "menu",
        stylesheet: "stylesheet-notifications",

        template: _.template(tpl),
    
        initialize: function()
        {
        	
        },

        
        refresh: function ()
        {
            NotificationsCollection.reset();
            this.render();
        },
        
        events: {
        	"fastclick .follow-link" : "openLink"
        },

        openLink: function(ev) {      	
        	Router.navigate($(ev.currentTarget).attr("data-url"), { trigger: true });
        },

        
        render: function ()
        {	
        	DataLoader.exec({ collection: NotificationsCollection, context: this }, function (data)
                    {
                        this.$el.html(this.template({ str: str, notifications: data.toJSON() }));
                        this.undelegateEvents();
                        this.delegateEvents();
                        LinkHandler.setupView(this);
            });
        },
    }));
});
