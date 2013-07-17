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
            courseid: undefined,
            coursecode: "",
            coursebackground: "",
            moduleid: undefined,
            modulename: "",
            instanceid: 0,
            coursename: "",
            description: "",
            name: "",
            timestart: 0,
            timeend: 0,
            timedue: 0,
            visible: 1,
            eventtype: "",
            nosubmissions: ""
        },

        initialize: function ()
        {
            var serverUrl = SC.getServerUrl();

            if (serverUrl)
            {
                serverUrl = serverUrl.substr(0, serverUrl.length - 5);
            }

            if (serverUrl && this.attributes.coursebackground && this.attributes.coursebackground.substr(0, 1) == "/")
            {
                this.attributes.coursebackground = serverUrl + this.attributes.coursebackground;
            }
        },

        toJSON: function ()
        {
        	var currdate = new Date();

        	
            var attr = _.clone(this.attributes),
                now = Math.floor(currdate.getTime() / 1000);

            var startDate = new Date(attr.timestart * 1000);
        	var endDate = new Date(attr.timeend * 1000);
        	
            attr.isPast = attr.timeend < now;
            attr.isCurrent = (attr.timestart < now && attr.timeend > now);
            if((currdate.toDateString() != startDate.toDateString())
            		|| (currdate.toDateString() != endDate.toDateString())) {
                if(startDate.toDateString() == endDate.toDateString()) {
                	//Same day start end!
                	if(startDate.toString() == endDate.toString()){
                		attr.eventtimestr = startDate.toDateString().substr(0, 11) + "  (" + startDate.toTimeString().substr(0, 5) + ")";
                	} else {
                		//Event diff start date and end date
                		attr.eventtimestr = startDate.toDateString().substr(0, 11) 
                		+ " (" + startDate.toTimeString().substr(0, 5) + 
                		" - " + endDate.toTimeString().substr(0, 5) + ")";
                	}
                } else {
                	//Todays events
                	attr.eventtimestr = startDate.toDateString().substr(0, 11) + " " + startDate.toTimeString().substr(0, 5);
                	+ " - "+ endDate.toDateString().substr(0, 11) + " " + endDate.toTimeString().substr(0, 5);
                }
            } else {
            	attr.eventtimestr = startDate.toTimeString().substr(0, 5) + " - " + endDate.toTimeString().substr(0, 5);
            }
            attr.loc = attr.description.substr(0, 30);
            return attr;
        }
    });
});
