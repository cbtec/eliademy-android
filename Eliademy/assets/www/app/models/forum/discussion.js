/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/collections/forum/posts", "app/tools/servicecalls"], function (PostCollection, SC)
{
    return Backbone.Model.extend(
    {
        sync: function (method, model, options)
        {
            switch (method)
            {
                case "create": case "update":
                    SC.call("local_monorailservices_upd_forum_discussion", { discussions:
                        [ _.pick(this.attributes, "id", "forum", "course", "name", "message") ] }, function (data)
                    {
                        options.success(method, model, options);
                    }, this);
                    break;

                default:
                    console.warn("Unhandled sync method in discussion: " + method);
            }
        },

        initialize: function ()
        {
            this.attributes.posts = new PostCollection();
            this.attributes.posts.setDiscussion(this.attributes.id);
        },

        defaults: {
            id: undefined,
            course: undefined,
            forum: undefined,
            name: undefined,
            userid: undefined,
            groupid: undefined,
            assessed: undefined,
            timemodified: undefined,
            usermodified: undefined,
            timestart: undefined,
            timeend: undefined,
            firstpost: undefined,
            firstuserfullname: undefined,
            firstuserimagealt: undefined,
            firstuserpicture: undefined,
            firstuseremail: undefined,
            subject: undefined,
            numreplies: undefined,
            numunread: undefined,
            lastpost: undefined,
            lastuserid: undefined,
            lastuserfullname: undefined,
            lastuserimagealt: undefined,
            lastuserpicture: undefined,
            lastuseremail: undefined
        }
    });
});
