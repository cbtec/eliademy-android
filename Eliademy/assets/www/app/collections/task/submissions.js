/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/task/submission", "app/tools/servicecalls"], function (SubmissionModel, SC)
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
                    if (this.mTaskId)
                    {
                        return SC.call("local_monorailservices_get_submission", { assignid: this.mTaskId }, function (data)
                        {
                            if ("status" in data) {
                                model = new SubmissionModel({ id: this.mTaskId, text: data.text, status: data.status, timesubmitted: data.timesubmitted, grade: data.grade });
                                this.reset(model);
                            }
                            else
                            {
                                this.reset();
                            }
                        }, this);
                    }
                    else
                    {
                        console.warn("Unable to fetch submissions for unidentified task.");
                    }
                    break;
            }
        },

        model: SubmissionModel
    });
});
