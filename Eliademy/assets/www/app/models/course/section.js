/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/collections/attachments", "app/tools/servicecalls"], function (AttachmentCollection, SC)
{
    return Backbone.Model.extend(
    {
        sync: function (method, model, options)
        {
            var data = _.extend({ "course": model.get("courseid") }, _.pick(model.toJSON(), "id", "name", "summary", "visible"));
            
            if (model.isNew()) {
                data['isnew'] = 1;
            }

            switch (method)
            {
                case "create":
                    // FIXME: id field is required by the webservice,
                    // even if it's not needed.
                    data.id = 0;

                case "update":
                    SC.call("local_monorailservices_upd_course_sect", { sections: [ data ] }, function (data)
                    {
                        if (model.isNew())
                        {
                            model.set({ id: data.section[0].sectionid }, { silent: true });
                        }

                        options.success(method, model, options);
                    }, this);
                    break;

                case "delete":
                    SC.call("local_monorailservices_del_course_sect", { sections: [ { id: model.get("id") } ] }, function (data)
                    {
                        options.success(method, model, options);
                    }, this);
                    break;
            }
        },

        defaults: function ()
        {
            return {
                courseid: 0,
                name: "",
                summary: "",
                visible: 1,

                attachments: new AttachmentCollection()
            };
        }
    });
});
