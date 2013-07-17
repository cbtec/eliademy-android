/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "app/collections/task/submissionfiles", "app/collections/course/courses"],
function (SC, SubmissionFilesCollection, CoursesCollection)
{
    return Backbone.Model.extend(
    {
        sync: function (method, model, options)
        {
            var rawData = model.toJSON(), data = { };
            _.extend(data, _.pick(rawData, "assignid", "text", "status"));
            if (method === 'delete') {
                data['delete'] = 1;
            }
            
            switch (method)
            {
                case "create":
                case "update":
                case "delete":
                    SC.call("local_monorailservices_task_submission", data,
                        function (data) {
                            if ("timesubmitted" in data) {
                                model.set("timesubmitted", data['timesubmitted']);
                            }
                            options.success(method, model, options);
                        }
                    );
                    break;
            }
            
            // Save files
            _.each(model.get("files").models, function (file) {
                if (file.isNew() && ! file.get("remove")) {
                    file.save();
                } else if (file.get("remove") && ! file.isNew()) {
                    file.destroy({ wait: true });
                }
            });
            
            // If submission is finalized, reload courses to sync data on other pages
            if (options.finalizing) {
                CoursesCollection.fetch();
            }
        },

        defaults: {
            assignid: 0,
            text: null,
            status: 0,   // 0 draft, 1 published
            files: new SubmissionFilesCollection(),
            timesubmitted: 0
        }
    });
});
