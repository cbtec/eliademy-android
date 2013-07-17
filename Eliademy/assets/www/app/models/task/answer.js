/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["i18n!nls/strings", "backbone"], function (str)
{
    return Backbone.Model.extend(
    {
        defaults: {
            text: "",
            correct: false
        },

        toJSON: function (cid)
        {
            var json = _.clone(this.attributes);

            if (cid)
            {
                json.cid = this.cid;
            }

            json.correct = this.attributes.correct ? 1 : 0;

            return json;
        },

        validate: function (attrs, options)
        {
            if ("text" in attrs)
            {
                if (!attrs.text)
                {
                    return str.quiz_error_answer;
                }
                else if (attrs.text.length > 200)
                {
                    return str.error_limit;
                }
            }
        }
    });
});
