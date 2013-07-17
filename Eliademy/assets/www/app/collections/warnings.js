/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/warnings", "backbone"], function (WarningsModel)
{
	return new (Backbone.Collection.extend(
	{
		model: WarningsModel,
        
        sync: function() {
            // nada 
        }
	}));
});
