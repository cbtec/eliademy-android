/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/attachment"], function (AttachmentModel)
{
    return Backbone.Collection.extend(
    {
        courseId: null,
        sectionId: null,

        initialize: function ()
        {
            this.bind("sync", this.fetch, this);
        },

        setSection: function (courseid, sectionid)
        {
            this.courseId = courseid;
            this.sectionId = sectionid;

            return this;
        },

        sync: function (method, model, options)
        {
        },

        model: AttachmentModel
    });
});
