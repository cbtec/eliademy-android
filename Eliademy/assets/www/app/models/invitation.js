/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "backbone"],
    function (SC)
{
	return Backbone.Model.extend(
	{

        sync: function (method, model, options)
        {
            if (method == "read") {
                
                $.ajax({ url: MoodleDir + "theme/monorail/ext/ajax_check_invite.php", data: {code: model.id}, dataType: "json", success: function (data)
                {
                    
                    model.set("userid", parseInt(data.userid));
                    model.set("active", parseInt(data.active));
                    model.set("found", true);
                    model.set({courseId: parseInt(data.courseid), courseCode: data.coursecode});
                    model.view.updateText();
                },
                  error: function (data)
                {
                    
                    model.set("userid", 0);
                    model.set("active", 0);
                    model.set("found", false);
                    model.set("courseId", 0);
                    model.view.updateText();
                }});
            }
            return this;
        },

        doEnrollment: function(model) {
            
            params = [{
                rolename: 'student',
                inviteid: model.get("id"),
                courseid: model.get("courseId"),
                userid: model.get("userid")
            }];
            
            thisThis = this;
            
            SC.call("local_monorailservices_enrol_users", { enrolments: params },
                function (data)
                {
                    require(["app/models/user"], function (UserModel) {
                        // add course to user enrolled courses list
                        var enrolledcourseslist = UserModel.get("enrolledcourseslist");
                        enrolledcourseslist.push(model.get("courseId"));
                        UserModel.set('enrolledcourseslist', enrolledcourseslist);
                        window.location = RootDir + "courses/" + model.get("courseCode");
                    });
                    
                }, this,
                function (data)
                {
                    // error
                    model.set('found', false);
                    model.view.updateText();
                }
            );
        },

		defaults: function ()
        {
            return {
                id: null,
                userid: null,
                active: null,
                found: false,
                courseId: null,
                courseCode: ""
            };
		}
	});
});
