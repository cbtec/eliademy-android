/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["i18n!nls/strings", "app/tools/servicecalls", "app/tools/utils", "backbone"],
    function (str, SC, Utils)
{
    var sForumHandler =
    {
        create: function (method, model, options)
        {
            var data = this.toJSON();

            SC.call("local_monorailservices_create_forums",
                { forums: [ { sectionid: data.sectionid, course: data.courseid, name: data.name } ] },
                function (data)
                {
                    options.success(method, model, options);
                }, this);
        },

        remove: function (method, model, options)
        {
            var d = model.has("moduleid") ?
                { moduleid: model.get("moduleid") } :
                { forumid: model.get("id") };

            SC.call("local_monorailservices_del_forums", { forums: [ d ] }, function (data)
            {
                options.success(method, model, options);
            }, this);
        },

        update: function (method, model, options)
        {
            var fdata = { name: model.get("name") };

            if (model.has("moduleid"))
            {
                fdata.moduleid = model.get("moduleid");
            }
            else
            {
                fdata.id = model.get("id");
            }

            SC.call("local_monorailservices_update_forums", { forums: [ fdata ] }, function (data)
            {
                options.success(method, model, options);
            }, this);
        }
    };

    var sFileHandler =
    {
        create: function (method, model, options)
        {
            var data = this.toJSON(), contextData = null;

            if ("links" in data)
            {
                contextData = JSON.stringify(data.links);
            }

            if ("taskid" in data)
            {
                var taskData = { assignmentid: data.taskid, name: data.name, filename: data.filename };

                if (data.options)
                {
                    taskData.options = data.options;
                }

                SC.call("local_monorailservices_add_assignfiles",
                    { assignfiles: [ taskData ] },
                    function (rdata)
                    {
                        try
                        {
                            model.set({
                                id: rdata.filerscs[0].fileid,
                                taskinstance: taskData.assignmentid,
                                url: rdata.filerscs[0].fileurl.replace("WSTOKEN", SC.getToken()) + "&forcedownload=0",
                                source: "task_files" });
                        }
                        catch (err) { }

                        if (contextData || "visible" in data)
                        {
                            SC.call("local_monorailservices_upd_ctxdata", { fileitems: [ {
                                fileid: rdata.filerscs[0].fileid,
                                contextualdata: JSON.stringify({ links: contextData, visible: data.visible }) } ] }, function (rrdata)
                            {
                                options.success(method, model, options);
                            }, this);
                        }
                        else
                        {
                            options.success(method, model, options);
                        }
                    }, this);
            }
            else
            {
                // XXX: silently ignoring attachments with invalid sectionids
                if (!isNaN(parseInt(data.sectionid)))
                {
                    SC.call("local_monorailservices_create_filerscs",
                        { resources: [ { sectionid: data.sectionid, course: data.courseid,
                            contextualdata: JSON.stringify({ links: contextData, visible: data.visible }),
                            name: data.name, filename: data.filename } ] },
                        function (data)
                        {
                            try
                            {
                                model.set({
                                    id: data.filerscs[0].resourceid,
                                    url: data.filerscs[0].fileurl.replace("WSTOKEN", SC.getToken()) + "&forcedownload=0",
                                    source: "course_modules" });
                            }
                            catch (err) { }

                            options.success(method, model, options);
                        }, this);
                }
            }
        },

        remove: function (method, model, options)
        {
            var d = model.has("moduleid") ? { moduleid: model.get("moduleid") } : { resourceid: model.get("id") };

            switch (model.get("source"))
            {
                case "course_modules":
                    SC.call("local_monorailservices_del_filerscs", { filerscs: [ d ] }, function (data)
                    {
                        options.success(method, model, options);
                    }, this);
                    break;

                case "task_files":
                    SC.call("local_monorailservices_del_assignfiles", { fileitems: [ { assignmentid: model.get("taskinstance"), fileids: [ model.get("id") ] } ] }, function (data)
                    {
                        options.success(method, model, options);
                    }, this);
                    break;

                default:
                    console.warn("Dont know how to remove file.");
            }
        },

        update: function (method, model, options)
        {
            if (model.get("visible") === false)
            {
                // No need to update invisible attachments
                options.success(method, model, options);
                return;
            }

            var d = model.has("moduleid") ? { moduleid: model.get("moduleid") } : { fileid: model.get("id") };

            d.filename = model.get("name");

            SC.call("local_monorailservices_update_filename", { fileitems: [ d ] }, function (data)
            {
                options.success(method, model, options);
            }, this);

            if (model.has("links"))
            {
                d.contextualdata = JSON.stringify({ links: JSON.stringify(model.get("links"))});
                delete d.filename;

                SC.call("local_monorailservices_upd_ctxdata", { fileitems: [ d ] }, function (data)
                {
                    options.success(method, model, options);
                }, this);
            }
        }
    };

    var sAssignHandler =
    {
        create: function (method, model, options)
        {
            if (!isNaN(parseInt(model.get("sectionid"))))
            {
                require(["app/collections/task/tasks"], function (TaskCollection)
                {
                    var m = TaskCollection.get(model.get("task_cid"));

                    m.set({ courseid: model.get("courseid"), sectionid: model.get("sectionid") });
                    m.save(undefined, { success: options.success, noredirect: true });
                });
            }
        },

        remove: function (method, model, options)
        {
            require(["app/collections/task/tasks"], function (TaskCollection)
            {
                TaskCollection.get(model.get("id")).destroy({ success: options.success });
            });
        },

        update: function (method, model, options)
        {
        }
    };

    var sLinkHandler =
    {
        create: function (method, model, options)
        {
            var data = this.toJSON();

            if ("taskid" in data)
            {
                // FIXME: no service to add urls to tasks.
                SC.call("local_monorailservices_add_assignfiles",
                    { assignfiles: [ { assignmentid: data.taskid, name: data.name, filename: data.filename } ] },
                    function (data)
                    {
                        options.success(method, model, options);
                    }, this);
            }
            else
            {
                if (!isNaN(parseInt(data.sectionid)))
                {
                    SC.call("local_monorailservices_add_course_rurls",
                        { urls: [ { sectionid: data.sectionid, course: data.courseid,
                            name: data.name, externalurl: data.externalurl } ] },
                        function (data)
                        {
                            options.success(method, model, options);
                        }, this);
                }
            }
        },        

        remove: function (method, model, options)
        {
            var d = model.has("moduleid") ? { moduleid: model.get("moduleid") } : { urlid: model.get("id") };

            SC.call("local_monorailservices_del_course_rurls", { urls: [ d ] }, function (data)
            {
                options.success(method, model, options);
            }, this);
        },

        update: function (method, model, options)
        {
            var d = model.has("moduleid") ? { moduleid: model.get("moduleid") } : { id: model.get("id") };

            d.name = model.get("name");

            // XXX: to rename the URL itself:
            //d.externalurl = d.name;

            SC.call("local_monorailservices_upd_course_rurls", { urls: [ d ] }, function (data)
            {
                options.success(method, model, options);
            }, this);
        }
    };

    var isImage = function (name)
    {
        var ext = name.substring(name.lastIndexOf(".") + 1).toLowerCase();

        // XXX: trying to guess file type...
        return (ext == "jpg" || ext == "png" || ext == "gif" || ext == "jpeg");
    };
    

    return Backbone.Model.extend(
    {
        mHandler: null,

        sync: function (method, model, options)
        {
            if (this.mHandler)
            {
                switch (method)
                {
                    case "create":
                        this.mHandler.create.apply(this, [ method, model, options ]);
                        break;

                    case "delete":
                        this.mHandler.remove.apply(this, [ method, model, options ]);
                        break;

                    case "update":
                        this.mHandler.update.apply(this, [ method, model, options ]);
                        break;
                }
            }
        },

        initialize: function ()
        {
            var data = this.toJSON(), attrib = { };

            if (!data.source)
            {
                throw "No source for attachment item!";
            }

            switch (data.source)
            {
                case "course_modules":
                {
                    attrib.type = "link";
                    attrib.moduleid = data.id;

                    switch (data.modname)
                    {
                        case "forum":
                            attrib.type = "forum";
                            this.mHandler = sForumHandler;
                            break;

                        case "assign":
                            attrib.url = "/tasks/" + data.id;
                            this.mHandler = sAssignHandler;
                            break;

                        case "resource":
                        {
                            if (data.contents instanceof Array)
                            {
                                if (data.contents[0].contextualdata)
                                {
                                    var cdata = JSON.parse(data.contents[0].contextualdata);

                                    if (cdata.links)
                                    {
                                        attrib.links = JSON.parse(data.contents[0].contextualdata);
                                        attrib.type = "contextualImage";
                                    }
                                    else if (cdata.visible !== undefined)
                                    {
                                        attrib.visible = cdata.visible;
                                    }
                                }

                                if (data.contents[0].type == 'image' && attrib.type == "link")
                                {
                                    attrib.type = "image";
                                }

                                attrib.url = data.contents[0].fileurl + "&token=" + SC.getToken();

                                this.mHandler = sFileHandler;
                            }
                            else
                            {
                                console.warn("Invalid resource attachment contents.");
                            }

                            break;
                        }

                        case "url":
                        {
                            if (data.contents instanceof Array) {
                                attrib = Utils.externalUrlData(data.contents[0].fileurl, attrib);
                                this.mHandler = sLinkHandler;
                            }
                            else
                            {
                                console.warn("Invalid url attachment contents.");
                            }
                            break;
                        }

                        default:
                            // XXX: Handling unknown types as links, but
                            // not allowing to modify them.
                            attrib.not_supported = true;
                    }

                    break;
                }

                case "task_files":
                {
                    if (data.url.indexOf("WSTOKEN") != -1)
                    {
                        attrib.url = data.url.replace("WSTOKEN", SC.getToken()) + "&forcedownload=0";
                    }

                    attrib.url += "&token=" + SC.getToken();

                    if (data.contextualdata)
                    {
                        var cdata = JSON.parse(data.contextualdata);

                        if (cdata.links)
                        {
                            attrib.links = JSON.parse(data.contextualdata);
                            attrib.type = "contextualImage";
                        }
                        else if (cdata.visible !== undefined)
                        {
                            attrib.visible = cdata.visible;
                        }
                    }

                    if (isImage(data.name) && !attrib.type)
                    {
                        attrib.type = "image";
                    }
                    else
                    {
                        attrib.type = "file";
                    }

                    this.mHandler = sFileHandler;

                    break;
                }

                case "new_item":
                {
                    switch (data.type)
                    {
                        case "forum":
                            this.mHandler = sForumHandler;
                            break;

                        case "file":
                            if (isImage(data.filename))
                            {
                                attrib.type = "image";
                                attrib.url = MoodleDir + "theme/monorail/ext/ajax_get_file.php?filename=" + data.tempfilename;
                            }

                            attrib.name = data.name;
                            this.mHandler = sFileHandler;
                            break;

                        case "contextualImage":
                            attrib.name = data.name;
                            attrib.url = MoodleDir + "theme/monorail/ext/ajax_get_file.php?filename=" + data.tempfilename;
                            attrib.links = [ ];
                            this.mHandler = sFileHandler;
                            break;

                        case "link":
                            attrib = Utils.externalUrlData(data.externalurl, attrib);
                            this.mHandler = sLinkHandler;
                            break;

                        case "assign":
                            attrib.url = "/tasks/" + data.id;
                            attrib.type = "link";
                            attrib.modicon = RootDir + "app/img/icon-presentation.png";
                            this.mHandler = sAssignHandler;
                            break;

                        default:
                            console.warn("Unhandled attachment type " + data.type);
                    }

                    break;
                }
            }

            this.set(attrib);
        }
    });
});
