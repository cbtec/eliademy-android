/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/event/event", "app/tools/servicecalls"], function (EventModel, SC)
{
    return new (Backbone.Collection.extend(
    {
        sync: function (method, collection, options)
        {
            switch (method)
            {
                case "read":
                    SC.call("local_monorailservices_get_user_events", {}, function (data)
                    {
                        this.reset(data.events);
                    }, this);
                    break;

                default:
                    console.warn("Unimplemented method " + method + " in event collection.");
                    options.error(method, collection, options);
            }
        },

        model: EventModel
    }));
});
