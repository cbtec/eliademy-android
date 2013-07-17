/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["backbone"],
    function ()
{
	return Backbone.Model.extend(
	{

		defaults: function ()
        {
            return {
                id: null,
                fullname: null,
                picUrlLarge: null,
                url: null,
                teacher: false,
                email: ""
            };
		}
	});
});
