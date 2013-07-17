/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

define(["app/models/course/category", "app/tools/servicecalls", "i18n!nls/strings"],
    function (CategoryModel, SC, str)
{
    return new (Backbone.Collection.extend(
    {
        sync: function (method, model, options)
        {
            if (method == "read")
            {
            	SC.call("local_monorailservices_getcrs_categories", { }, function (data)
                {
            		var items = [ ];
            		
                    _.each(data.categories, function (cat)
                    {
                    	var m = new CategoryModel({
	                    		id:cat.id,
	                    		name: (str.category[cat.idnumber] ? str.category[cat.idnumber] : cat.name),
	                    		description:cat.description,
	                    		idnumber:cat.idnumber
                    		})
                    	items.push(m);
                        
                    }, this);
                    
                    items.sort(function (a, b) {
                    	if (a.attributes.name > b.attributes.name) return 1;
                    	else if (a.attributes.name == b.attributes.name) return 0;
                    	else if (a.attributes.name < b.attributes.name) return -1;
                    });

                    model.reset(items);
                    model.trigger('categories_loaded');
                }, this);
            }
        },

        model: CategoryModel,
    }));
});
