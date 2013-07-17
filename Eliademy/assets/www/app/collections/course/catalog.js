/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/course/catalog_page"], function (CatalogPageModel)
{
    return new (Backbone.Collection.extend(
    {
        model: CatalogPageModel
    }));
});
