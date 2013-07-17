/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "backbone"], function (SC)
{
    return new (Backbone.Model.extend(
    {
        sync: function (method, model, options)
        {
            switch (method)
            {
                case "read":
                    SC.call("local_monorailservices_get_users_by_id", { userids: [ model.get("id") ] }, function (data)
                    {
                        if (data instanceof Array && data.length > 0)
                        {
                            model.set(data[0]);
                            
                        }
                        options.success(method, model, options);
                    }, this);
                    break;
            }
        }
    }));
});
