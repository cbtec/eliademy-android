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
        defaults: {
        	id: undefined,
        	coursename: "",
        	read: 0,
        	time: 0,
        	content: "",
        	picurl: "",
        	link: "",
        	type: "",
        	userpic: "",
            sectionid: undefined,  	
            author: ""
        },

        toJSON: function ()
        {
            var attr = _.clone(this.attributes);
            attr.image = attr.picurl.replace("pluginfile.php","webservice/pluginfile.php?file=") + "&token=" + SC.getToken();
            attr.date = new Date(attr.time * 1000);
            attr.teacher = false;

            if (attr.authroles)
            {
                var i, c = attr.authroles.length;

                for (i=0; i<c; i++)
                {
                    if (attr.authroles[i].shortname == "editingteacher")
                    {
                        attr.teacher = true;
                        break;
                    }
                }
            }

            return attr;
        }
    });
});
