/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/forum/forum", "app/tools/servicecalls"], function (ForumModel, SC)
{
    return Backbone.Collection.extend(
    {
        model: ForumModel,
        courseId: undefined,

        setCourse: function (course)
        {
            this.courseId = course;
        },

        sync: function (method, collection, options)
        {
            switch (method)
            {
                case "read":
                    console.log("Fetching forums for " + this.courseId);

                    SC.call("local_monorailservices_get_forums", { courseids: [ this.courseId ] }, function (data)
                    {
                        this.reset(data);
                    }, this);
                    break;

                default:
                    console.warn("Unimplemented method in forum collection: " + method);
            }
        }
    });
});
