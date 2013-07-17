/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define([], function ()
{
    var loadModelById = function (data, success)
    {
        var model = data.collection.get(data.id);

        if (model)
        {
            success.call(data.context ? data.context : this, model);
        }
        else
        {
            model = new data.collection.model({ id: data.id });

            model.fetch({ success: function (mod, method, options)
            {
                if (!model.DataLoader_no_collection)
                {
                    data.collection.add(model, { silent: true });
                }
                else
                {
                    model = data.collection.get(data.id);
                }

                success.call(data.context ? data.context : this, model);
            }});
        }
    };

    var loadModelByWhere = function (data, success)
    {
        var model = data.collection.where(data.where)[0];

        if (model)
        {
            success.call(data.context ? data.context : this, model);
        }
        else
        {
            model = new data.collection.model(data.where);

            model.fetch({ success: function (mod, method, options)
            {
                if (!model.DataLoader_no_collection)
                {
                    data.collection.add(model, { silent: true });
                }
                else
                {
                    model = data.collection.where(data.where)[0];
                }

                success.call(data.context ? data.context : this, model);
            }});
        }
    };

    var loadCollection = function (data, success)
    {
        if (data.collection.length)
        {
            success.call(data.context ? data.context : this, data.collection);
        }
        else
        {
            data.collection.once("reset", function ()
            {
                success.call(data.context ? data.context : this, data.collection);
            }, this);

            data.collection.fetch();
        }
    };

    return {
        exec: function (data, success)
        {
            if ("id" in data)
            {
                loadModelById(data, success);
            }
            else if ("where" in data)
            {
                loadModelByWhere(data, success);
            }
            else
            {
                loadCollection(data, success);
            }
        }
    };
});
