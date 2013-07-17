/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "backbone"], function (SC)
{
    return Backbone.Model.extend(
    {
        sync: function (method, model, options)
        {
            switch (method)
            {
                case "create": case "update":
                    SC.call("local_monorailservices_upd_forum_post", { posts:
                        [ _.pick(this.attributes, "id", "discussion", "subject", "message", "parent") ] }, function (data)
                    {
                        options.success(method, model, options);
                    }, this);
                    break;

                default:
                    console.warn("Unhandled sync method in discussion: " + method);
            }
        },

        initialize: function ()
        {
            var i, c;

            if (this.attributes.profileimageurlsmall)
            {
                this.attributes.profileImage = this.attributes.profileimageurlsmall.replace("pluginfile.php",
                    "webservice/pluginfile.php?file=") + "&token=" + SC.getToken();
            }

            if (this.attributes.attachments)
            {
                for (i=0, c=this.attributes.attachments.length; i<c; i++)
                {
                    this.attributes.attachments[i].url = this.attributes.attachments[i].url + "&token=" + SC.getToken();
                }
            }

            this.attributes.isTeacher = false;

            if (this.attributes.roles)
            {
                for (i=0, c=this.attributes.roles.length; i<c; i++)
                {
                    if (this.attributes.roles[i].shortname == "editingteacher")
                    {
                        this.attributes.isTeacher = true;
                        break;
                    }
                }
            }
        },

        defaults: {
            'id': undefined,
            'discussion': undefined,
            'parent': undefined,
            'userid': undefined,
            'created': undefined,
            'modified': undefined,
            'mailed': undefined,
            'subject': undefined,
            'message': undefined,
            'messageformat': undefined,
            'messagetrust': undefined,
            'attachment': undefined,
            'totalscore': undefined,
            'mailnow': undefined,
            'firstname': undefined,
            'lastname': undefined,
            'email': undefined,
            'picture': undefined,
            'imagealt': undefined
        }
    });
});
