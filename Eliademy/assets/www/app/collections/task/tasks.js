/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/task/task"], function (TaskModel)
{
	return new (Backbone.Collection.extend(
	{
		model: TaskModel
	}));
});
