/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["i18n!nls/strings", "app/models/task/answer"], function (str, AnswerModel)
{
	return Backbone.Collection.extend(
	{
		model: AnswerModel,

        validate: function ()
        {
            var err = undefined, a_total = 0, a_correct = 0;

            this.each(function (answer)
            {
                err = answer.validate(answer.attributes);
            
                if (err)
                {
                    return err;
                }

                a_total++;

                if (answer.attributes.correct)
                {
                    a_correct++;
                }
            });

            if (!err && (a_total == a_correct || a_correct == 0))
            {
                err = str.quiz_error_select;
            }
        
            return err;
        }
	});
});
