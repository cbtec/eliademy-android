/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/forum/post", "app/tools/servicecalls"], function (PostModel, SC)
{
    return Backbone.Collection.extend(
    {
        model: PostModel,
        discussionId: undefined,

        setDiscussion: function (discussion)
        {
            this.discussionId = discussion;
        },

        sync: function (method, collection, options)
        {
            switch (method)
            {
                case "read":
                    console.log("Fetching posts for " + this.discussionId);

                    SC.call("local_monorailservices_get_forum_posts", { discussionid: this.discussionId }, function (data)
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
