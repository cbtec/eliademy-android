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
            var rawData;

            switch (method)
            {
                case "create":
                    rawData = model.toJSON();

                    SC.call("local_monorailservices_update_grades",
                        { grades: [ _.extend({ userid: rawData.studentid }, _.pick(rawData, "assignid", "grade", "feedback")) ] },
                        function (ret)
                        {
                            options.success(method, model, options);
                        }, this);

                    break;
            }
        }
    });
});
