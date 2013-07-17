/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/collections/course/sections", "app/tools/servicecalls", "app/collections/course/participants", 
        "app/collections/course/invited_users", "i18n!nls/strings", "app/collections/forum/forums"],
    function (SectionCollection, SC, ParticipantsCollection, InvitedUsersCollection, str, ForumCollection)
{
	return Backbone.Model.extend(
	{
        DataLoader_no_collection: true,

        initialize: function ()
        {
            if (this.attributes.id)
            {
                this.attributes.forums.setCourse(this.attributes.id);
            }
        },

        sync: function (method, model, options)
        {
            var courseData = _.pick(model.toJSON(), "fullname", "shortname", "categoryid", "coursebackground");

            switch (method)
            {
                case "create":
                {
                    if (courseData['categoryid'] == '0') {
                        courseData['categoryid'] = 15;
                    }
                    
                    courseData.numsections = 0;

                    SC.call("local_monorailservices_create_courses", { courses: [ courseData ] }, function (data)
                    {
                        model.set({ id: data[0].id, code: data[0].code }, { silent: true });
                        if (data[0].shortname) {
                            model.set({shortname: data[0].shortname} , { silent: true });
                        }
                        var sections = model.get("sections");

                        sections.setCourseId(model.get("id"));
                        model.get("participants").setCourseId(model.get("id"));
                        model.get("invitedUsers").setCourseId(model.get("id"));

                        if (sections.length > 0)
                        {
                            // Saving new sections...
                            var sectionData = [ ];

                            sections.each(function (sec, idx)
                            {
                                sectionData.push(_.extend({ id: 0, tempid: sec.cid, course: model.get("id"), section: idx },
                                    _.pick(sec.toJSON(), "name", "summary", "visible")));
                            }, this);

                            SC.call("local_monorailservices_upd_course_sect", { sections: sectionData }, function (sData)
                            {
                                _.each(sData.section, function (sec)
                                {
                                    sections.get(sec.tempid).set({ id: sec.sectionid, courseid: model.get("id") }, { silent: true });
                                });

                                // Saved and updated all sections.
                                options.success(method, model, options);
                            }, this, function (err)
                            {
                                options.error(method, model, _.extend(options, { err: err }));
                            });
                        }
                        else
                        {
                            // No sections to save, we're done here.
                            options.success(method, model, options);
                        }
                    }, this, function (err)
                    {
                        options.error(method, model, _.extend(options, { err: err }));
                    });

                    break;
                }

                case "update":
                {
                    courseData.id = model.get("id");

                    courseData["published_in_catalog"] = model.get("published_in_catalog") ? 1 : 0;
                    
                    courseData["course_logo"] = model.get("course_logo");
                    
                    if (courseData['categoryid'] == '0') {
                        courseData['categoryid'] = 15;
                    }

                    SC.call("local_monorailservices_update_courses", { courses: [ courseData ] }, function (data)
                    {
                        var sections = model.get("sections");

                        if (sections.length > 0)
                        {
                            // Saving sections...
                            var sectionData = [ ];

                            sections.each(function (sec, idx)
                            {
                                sectionData.push(_.pick(sec.toJSON(), "id", "name", "summary", "visible"));
                            }, this);

                            SC.call("local_monorailservices_upd_course_sect", { sections: sectionData }, function (sData)
                            {
                                options.success(method, model, options);
                            },
                            this, function (err)
                            {
                                options.error(method, model, _.extend(options, { err: err }));
                            });
                        }
                        else
                        {
                            options.success(method, model, options);
                        }
                    }, this, function (err)
                    {
                        options.error(method, model, _.extend(options, { err: err }));
                    });

                    break;
                }

                case "read":
                    require(["app/collections/course/courses"], function (CourseCollection)
                    {
                        // When course is "fetched", we check course
                        // collection. If course collection isn't ready,
                        // wait for it to load...

                        var cData = model.toJSON(), m;

                        if (cData.id)
                        {
                            m = CourseCollection.get(cData.id);
                        }
                        else if (cData.code)
                        {
                            m = CourseCollection.where({ code: cData.code })[0];
                        }

                        if (m)
                        {
                            options.success(m, method, options);
                        }
                        else
                        {
                            CourseCollection.notify(function ()
                            {
                                if (cData.id)
                                {
                                    m = CourseCollection.get(cData.id);
                                }
                                else if (cData.code)
                                {
                                    m = CourseCollection.where({ code: cData.code })[0];
                                }

                                if (m)
                                {
                                    options.success(m, method, options);
                                }
                                else
                                {
                                    console.warn("User doesn't seem to be enrolled to the requested course...");

                                    options.error(model, method, options);
                                }
                            });

                            CourseCollection.fetch();
                        }
                    });
                    break;

                default:
                    console.warn("Unhandled method in course model sync: " + method);
            }
        },

        validate: function(attrs, options)
        {
            // Check attachment name
            for(var name in attrs) {
                var value = attrs[name];
                
                if ( name.indexOf('|attachments|') !== -1 && name.indexOf('|name') !== -1 ) {
                    if (value == '')
                    {
                        return {err: str.fill_missing_fields, value: str.label_attachment};
                    }
                }
            }

            if ("fullname" in attrs)
            {
                if (attrs.fullname == "")
                {
                    return str.fill_missing_fields;
                }

                if (attrs.fullname.length > 120)
                {
                    return str.course_fname_limit;
                }
            }

            if ("shortname" in attrs)
            {
                if (attrs.shortname.length > 40)
                {
                    return str.course_sname_limit; 
                }
            }
        },
 
        assignRole: function(userids) {
        	var assign = [];
        	var courseid = this.get('id');
        	_.each(userids, function(uid) {
        		assign.push({id: courseid, userid: uid, rolename:'editingteacher'});                
            });
        	SC.call("local_monorailservices_assign_roles", { assignments: assign }, function (data)
            {   
                
                // process any errors/warnings
                if(data && data.warnings.length)
                {
                    require(["app/tools/warnings"], function (Warnings) {
                    Warnings.processWarnings({msgtype:'info', message: data.warnings});
                    });
                }
            });
        },
   
        unassignRole: function(userids) {
        	var unassign = [];
        	var courseid = this.get('id');
        	_.each(userids, function(uid) {
        		unassign.push({id: courseid, userid: uid, rolename:'editingteacher'});                
            });
        	SC.call("local_monorailservices_unassign_roles", { assignments: unassign }, function (data)
            {   
                // process any errors/warnings
                
                if(data && data.warnings.length)
                {
                    require(["app/tools/warnings"], function (Warnings) {
                       Warnings.processWarnings({msgtype:'info', message: data.warnings});
                    });
                }
            });
        },
        
        unenrolUser: function(userids) {
        	var unenrol = [];
        	var courseid = this.get('id');
        	_.each(userids, function(uid) {
        		unenrol.push({courseid: courseid, userid: uid});                
            });
        	SC.call("local_monorailservices_unenrol_users", { enrolments: unenrol }, function (data)
            {   
                // process any errors/warnings                
                if(data && data.warnings.length)
                {
                    require(["app/tools/warnings"], function (Warnings) {
                       Warnings.processWarnings({msgtype:'info', message: data.warnings});
                 });
                }
            });
        },         

        closeEnrollment: function() {
            this.setEnrollment(false);
        },
        
        openEnrollment: function() {
            this.setEnrollment(true);
        },
        
        setEnrollment: function(status) {
            this.set('invitesOpen', status);
            SC.call("local_monorailservices_set_enrollment", { courseid: this.get('id'), status: (status) ? 1 : 0 }, function (data)
            {   
                // process any errors/warnings                
                if(data && data.warnings.length)
                {
                    require(["app/tools/warnings"], function (Warnings) {
                        Warnings.processWarnings({msgtype:'info', message: data.warnings});
                    });
                }
            });
        },

		defaults: function ()
        {
            return {
                id: null,
                fullname: "",
                shortname: "",
                code: "",
                completed: null,
                assignments: [ ],
                sections: new SectionCollection(),
                participants: new ParticipantsCollection(),
                forums: new ForumCollection(),
                background: "",
                can_edit: false,
                inviteUrl: "",
                invitesOpen: false,
                invitedUsers: new InvitedUsersCollection(),
                inviteCode: null,
                categoryid: null,
                wizard_mode: false,
                published_in_catalog: 0,
                course_logo: ""
            };
		}
	});
});
