/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "backbone"], function (SC)
{
    var ENTRIES_PER_PAGE = 10;

    return Backbone.Model.extend(
    {
        sync: function (method, model, options)
        {
            if (method == "read")
            {
                var opt = { ofset: parseInt(model.get("page")) * ENTRIES_PER_PAGE, limit: ENTRIES_PER_PAGE };

                SC.call("local_monorailservices_get_courses", { options: opt }, function (data)
                {
                    model.set({
                        total_items: data.total_courses,
                        total_pages: Math.floor(data.total_courses / ENTRIES_PER_PAGE),
                        page: Math.ceil(data.ofset / ENTRIES_PER_PAGE),
                        items: data.courses }, { silent: true });

                    options.success(method, model, options);
                });
            }
            else
            {
                console.warn("Catalog page is a read-only model.");
            }
        },

        defaults: {
            page: null,
            total_pages: null,
            total_items: null,
            items: [ ]
        }
    });
});
