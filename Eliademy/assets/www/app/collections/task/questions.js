/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/task/question"], function (QuestionModel)
{
	return Backbone.Collection.extend(
	{
		model: QuestionModel,

        validate: function ()
        {
            var err = undefined;

            this.each(function (question)
            {
                err = question.validate(question.attributes);

                if (err)
                {
                    return;
                }
            });

            return err;
        }
	});
});
