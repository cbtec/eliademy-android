/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["i18n!nls/strings", "app/tools/servicecalls", "app/collections/attachments", "app/collections/task/questions",
        "app/collections/task/submissions"],
    function (str, SC, AttachmentCollection, QuestionCollection, SubmissionsCollection)
{
    return Backbone.Model.extend(
    {
        initialize: function ()
        {
            if (Object.prototype.toString.apply(this.attributes.questions) == "[object Array]")
            {
                this.attributes.questions = new QuestionCollection(this.attributes.questions);
            }

            if (this.attributes.id)
            {
                this.attributes.submissions.setTaskId(this.attributes.id);
            }
        },

        sync: function (method, model, options)
        {
            var rawData = model.toJSON(), data = { };

            switch (method)
            {
                case "create":
                    data['sectionid'] = rawData.sectionid;
                    data['course'] = rawData.courseid;
                    data["nosubmissions"] = rawData.nosubmissions;

                case "update":
                    _.extend(data, _.pick(rawData, "id", "instanceid", "name", "intro", "visible", "modulename", "attempt"));
                    data.duedate = rawData.duedate;
                    data.preventlatesubmissions = (rawData.lateallowed ? 0 : 1);
                    data.latesubmissionsuntil = rawData.latedays;

                    if (rawData.modulename == "quiz")
                    {
                        data.questions = rawData.questions;
                    }

                    SC.call("local_monorailservices_upd_assignments", { assignments: [ data ] }, function (data)
                    {
                        if (model.isNew())
                        {
                            var taskData = data['assignments'][0];

                            // assignments were saved/updated
                            if ("assignments" in data && data['assignments'].length > 0)
                            {
                                model.set({ id: taskData["id"], instanceid: taskData["assignid"] }, { silent: true });
                                model.attributes.submissions.setTaskId(taskData["id"]);
                            }
                        }

                        options.success(method, model, options);
                    }, this);
                    break;

                case "delete":
                    SC.call("local_monorailservices_del_assignments", { assignids: [ rawData.instanceid ] }, function ()
                    {
                        options.success(method, model, options);
                    }, this);
                    break;

                case "read":
                    SC.call("local_monorailservices_get_task_details", { instanceid: rawData.instanceid }, function (data)
                    {
                        model.set(_.omit(data, "questions"), { silent: true });
                        model.get("questions").reset(data.questions, { silent: true });

                        var attachments = [];

                        _.each(data.fileinfo, function (f)
                        {
                            attachments.push(_.extend(f, { taskid: data.id, source: "task_files" }));
                        });

                        model.attributes.submissions.setTaskId(data.id);
                        model.get("attachments").reset(attachments, { silent: true });

                        options.success(method, model, options);
                    }, this);
                    break;
            }
        },

        validate: function (attrs, options)
        {
            if ("name" in attrs)
            {
                if (attrs.name == "")
                {
                    return str.fill_missing_fields;
                }

                if (attrs.name.length > 120)
                {
                    return str.error_limit;
                }
            }

            if (attrs.modulename == "quiz" && attrs.questions)
            {
                var err = attrs.questions.validate();

                if (err)
                {
                    return err;
                }
            }
        },

		defaults: function ()
        {
            return {
                id: undefined,
                instanceid: undefined,
                modulename: "",
			    name: "",
			    duedate: Math.ceil((new Date()).getTime() / 1000) + 604800,
			    intro: "",
                courseid: null,
                coursecode: "",
                lateallowed: false,
                latedays: 30,
                nosubmissions: 0,
                can_edit: false,
                can_upload_files: true,
                questions: new QuestionCollection(),
                attachments: new AttachmentCollection(),
                section_visible: true,
                visible: 1,
                attempt: 0,
                submissions: new SubmissionsCollection()
            };
		},

        toJSON: function (cid)
        {
            var json = _.clone(this.attributes);

            json.questions = this.attributes.questions.toJSON(cid);
            json.attachments = this.attributes.attachments.toJSON(cid);

            return json;
        }
	});
});
