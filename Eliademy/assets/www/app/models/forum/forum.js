/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/collections/forum/discussions"], function (DiscussionCollection)
{
    return Backbone.Model.extend(
    {
        initialize: function ()
        {
            this.attributes.discussions = new DiscussionCollection(this.attributes.discussions);
        },

        defaults: {
            id: undefined,
            course: undefined,
            type: undefined,
            name: undefined,
            intro: undefined,
            introformat: undefined,
            assessed: undefined,
            assesstimestart: undefined,
            assesstimefinish: undefined,
            scale: undefined,
            maxbytes: undefined,
            maxattachments: undefined,
            forcesubscribe: undefined,
            trackingtype: undefined,
            rsstype: undefined,
            rssarticles: undefined,
            timemodified: undefined,
            warnafter: undefined,
            blockafter: undefined,
            blockperiod: undefined,
            completiondiscussions: undefined,
            completionreplies: undefined,
            completionposts: undefined,
            cmid: undefined
        },

        toJSON: function ()
        {
            var attr = _.clone(this.attributes);

            attr.discussions = attr.discussions.toJSON();

            return attr;
        }
    });
});
