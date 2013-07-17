/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/course/section", "app/tools/servicecalls"],
    function (SectionModel, SC)
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
            if (method == "read")
            {
                SC.call("local_monorailservices_course_get_cont", { courseid: this.mCourseId }, function (data)
                {
                    var items = [ ];

                    _.each(data, function (sec)
                    {
                        var m = new SectionModel({ id: sec.id, courseid: this.mCourseId, name: sec.name, summary: sec.summary, visible: sec.visible }),
                            attach = m.get("attachments");

                        _.each(sec.modules, function (mod)
                        {
                            // XXX: ignoring certain types of modules.
                            if (mod.modname != "forum" && mod.modname != "assign" && mod.modname != "quiz")
                            {
                                mod.source = "course_modules";

                                attach.add(mod);
                            }
                        });

                        items.push(m);
                    }, this);

                    model.reset(items);
                }, this);
            }

            return this;
        },

        model: SectionModel
    });
});
