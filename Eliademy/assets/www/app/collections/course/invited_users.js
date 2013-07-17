/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/course/invited_user", "app/tools/servicecalls"], 
function (InvitedUserModel, SC)
{
    return Backbone.Collection.extend(
    {
        mCourseId: null,

        setCourseId: function (id)
        {
            this.mCourseId = id;

            return this;
        },
        
        mCode: null,

        setCode: function (code)
        {
            this.mCode = code;

            return this;
        },

        sync: function (method, model, options)
        {
            switch (method)
            {
                case "read":
                    return SC.call("local_monorailservices_get_invited", { courseid: this.mCourseId, code: this.mCode }, function (data)
                    {
                        if (data.length > 0)
                        {
                            var users = [ ];

                            _.each(data, function (user)
                            {
                                var iModel = new InvitedUserModel(
                                {
                                    email: user.email,
                                    invitedby: user.invitedby,
                                    invitedwhen: user.invitedwhen
                                });
                                users.push(iModel);
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

        model: InvitedUserModel
    });
});
