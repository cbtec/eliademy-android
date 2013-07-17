/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

define(["backbone"], function ()
{
    return Backbone.Model.extend(
    {
        defaults: function ()
        {
            return {
                id: 0,
                name: null,
                description:null,
                idnumber:null,
            };
        }
    });
});
