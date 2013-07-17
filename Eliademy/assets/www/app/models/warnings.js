/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["backbone"], function()
{
	return Backbone.Model.extend(
	{
        
		defaults: function() {
            return {

                type:"success",
                message:"Everything is fine"
            };
		},

        sync: function() {
            // nada
        }
	});

});
