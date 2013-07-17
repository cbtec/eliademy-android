/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/task/submissionfile", "app/tools/servicecalls"], function (SubmissionFileModel, SC)
{
    return Backbone.Collection.extend(
    {
        mTaskId: 0,

        setTaskId: function (id)
        {
            this.mTaskId = id;
        },

        sync: function (method, model, options)
        {
            switch (method)
            {
                case "read":
                    return SC.call("local_monorailservices_get_submissions", { assignid: this.mTaskId }, function (data)
                    {
                        if ("files" in data)
                        {
                            var items = [ ];

                            _.each(data.files, function (item)
                            {
                                var file = new SubmissionFileModel({ id: item.id, filename: item.name, created: item.timecreated, 
                                    assignid: this.mTaskId, url: item.url, type: item.filetype })
                                file.set('icon', file.icon(file.get("type")));
                                items.push(file);
                            }, this);
                            model.reset(items);
                        }
                        else
                        {
                            model.reset();
                        }
                    }, this);
            }
        },
        
        fileCount: function () {
            return _.filter(this.models, function(file) {
                return ! file.get("remove");
            }).length;
        },

        model: SubmissionFileModel
    });
});
