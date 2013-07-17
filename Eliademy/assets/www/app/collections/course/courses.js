/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/course/course", "app/tools/servicecalls"],
	function (CourseModel, SC)
{
	return new (Backbone.Collection.extend(
	{
        mNotify: [ ],   // Array of functions that will be called once content is fetched.

        notify: function (handler, context)
        {
            this.mNotify.push([ handler, context ]);
        },

		sync: function (method, model, options)
		{
            switch (method)
            {
                case "read":
                {
                    var courseids = [];

                    SC.call("local_monorailservices_get_assignments", { courseids: courseids }, function (ret)
                    {
                        var cList = [ ],
                            serverUrl = SC.getServerUrl();

                        if (serverUrl)
                        {
                            serverUrl = serverUrl.substr(0, serverUrl.length - 5);
                        }

                        _.each(ret.courses, function (cData)
                        {
                            var tDataList = [ ];

                            _.each(cData.quizes, function (qData)
                            {
                                tDataList.push(_.extend(qData, { modulename: "quiz" }));
                            }, this);

                            _.each(cData.assignments, function (tData)
                            {
                                tDataList.push(_.extend(tData, { modulename: "assign" }));
                            }, this);

                            if (serverUrl && cData.coursebackground && cData.coursebackground.substr(0, 1) == "/")
                            {
                                cData.coursebackground = serverUrl + cData.coursebackground;
                            }

                            var cModel = new CourseModel(
                            {
                                id: cData.id,
                                shortname: cData.shortname,
                                fullname: cData.fullname,
                                code: cData.code,
                                completed: cData.completed,
                                coursebackground: cData.coursebackground,
                                assignments: tDataList,
                                inviteUrl: cData.inviteurl,
                                invitesOpen: (cData.invitesopen == 1) ? true : false,
                                inviteCode: cData.invitecode,
                                can_edit: (cData.canedit == 1) ? true : false,
                                students: (cData.canedit == 1) ? cData.students : 0,
                                categoryid: (cData.categoryid == 15) ? 0 : cData.categoryid,
                                published_in_catalog: cData.published_in_catalog,
                                course_logo: cData.course_logo
                            });

                            cList.push(cModel);

                            cModel.get("sections")
                                .setCourseId(cData.id);
                            cModel.get("participants")
                                .setCourseId(cData.id);
                                
                            // if user can edit, lets get invited users email list ready just in case
                            if (cData.canedit == 1) {
                                cModel.get("invitedUsers")
                                    .setCourseId(cData.id)
                                    .setCode(cData.invitecode);
                            }
                                
                        }, this);

                        if(!this.initialLoadFinished){
                        	model.trigger("updated");
                        }

                        this.initialLoadFinished = true;
                        this.reset(cList);

                        _.each(this.mNotify, function (n)
                        {
                            n[0].apply(n[1] ? n[1] : this);
                        }, this);

                        this.mNotify = [ ];
                    }, this);

                    break;
                }

                default:
                    console.warning("Unhandled action " + method + " in course collection sync.");
            }
		},

		model: CourseModel,
        
        initialLoadFinished: false
	}));
});
