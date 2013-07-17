/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/forum/discussion"], function (DiscussionModel)
{
    return Backbone.Collection.extend(
    {
        model: DiscussionModel
    });
});
