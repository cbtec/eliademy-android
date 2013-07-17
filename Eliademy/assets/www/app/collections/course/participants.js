/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/course/participant", "app/tools/servicecalls"],
function (ParticipantModel, SC)
{
    return Backbone.Collection.extend(
    {
        mCourseId: null,

        setCourseId: function (id)
        {
            this.mCourseId = id;

            return this;
        },

        sync: function (method, model, options)
        {
            switch (method)
            {
                case "read":
                    return SC.call("core_enrol_get_enrolled_users", { courseid: this.mCourseId }, function (data)
                    {
                        if (data.length > 0)
                        {
                            var users = [ ];

                            _.each(data, function (user)
                            {
                                var uModel = new ParticipantModel(
                                {
                                    id: user.id,
                                    fullname: user.fullname,
                                    email: user.email,
                                    picUrlLarge: user.profileimageurlsmall.replace("pluginfile.php","webservice/pluginfile.php?file=") + "&token=" + SC.getToken(),
                                    url: '/profile/' + user.id
                                });
                                _.each(user.roles, function (role) {
                                    if (role.shortname == 'editingteacher') {
                                        uModel.set('teacher', true);
                                    }
                                });
                                users.push(uModel);
                            }, this);
                            model.reset(users);
                        }
                        else
                        {
                            model.reset();
                        }
                    }, this);
                break;
            }
        },
        comparator : function(model) {
            //order by teacher first then name
            return [!model.get("teacher"), model.get("fullname").toLowerCase() ]
        },
        model: ParticipantModel
    });
});
