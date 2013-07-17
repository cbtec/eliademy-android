/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/task/returned", "app/tools/servicecalls"], function (ReturnedModel, SC)
{
    return new (Backbone.Collection.extend(
    {
        fetchForTasks: function (ids)
        {
            if (!(ids instanceof Array))
            {
                ids = [ ids ];
            }

            SC.call("local_monorailservices_get_tasks_info", { tasksubmissions: { assignids: ids } }, function (ret)
            {
                var items = [ ], oldItems = [ ];

                _.each(ret.tasksubmissions, function (item)
                {
                    _.each(item.submissions, function (sub)
                    {
                        sub.url = sub.url.replace(/WSTOKEN/g, SC.getToken());

                        if (item.grades[0].dategraded === null)
                        {
                            item.grades[0].grade = null;
                        }
                    }, this);
                    
                    item.profileimageurl += "?v=" + (new Date()).getTime();

                    items.push(_.extend(item.grades[0], _.pick(item, "studentid", "assignid", "courseid", "studentname", "visible", "assignname", "profileimageurl", "submissions", "text")));
                }, this);

                _.each(ids, function (taskid)
                {
                    _.each(this.where({ assignid: taskid }), function (item)
                    {
                        oldItems.push(item);
                    }, this);
                }, this);

                if (oldItems.length > 0)
                {
                    this.remove(oldItems, { silent: true });
                }

                if (items.length > 0)
                {
                    this.add(items, { silent: true });
                }

                this.trigger("updated");

            }, this);
        },

        fetchForCourse: function (courseid)
        {
            SC.call("local_monorailservices_get_tasks_info", { tasksubmissions: { usertasks: { courseid: courseid } } }, function (ret)
            {
                var items = [ ],
                    oldItems = this.where({ courseid: courseid });

                _.each(ret.tasksubmissions, function (item)
                {
                    _.each(item.submissions, function (sub)
                    {
                        sub.url = sub.url.replace(/WSTOKEN/g, SC.getToken());
                    }, this);

                    if (item.grades[0].dategraded === null)
                    {
                        item.grades[0].grade = null;
                    }

                    items.push(_.extend(item.grades[0], _.pick(item, "studentid", "assignid", "courseid", "studentname", "visible", "assignname", "profileimageurl", "submissions")));
                }, this);

                if (oldItems.length > 0)
                {
                    this.remove(oldItems, { silent: true });
                }

                if (items.length > 0)
                {
                    this.add(items, { silent: true });
                }

                this.trigger("updated");

            }, this);
        },

        model: ReturnedModel
    }));
});
