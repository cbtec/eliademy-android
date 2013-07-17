/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["i18n!nls/strings", "app/collections/task/answers", "app/models/task/answer"],
    function (str, AnswerCollection, AnswerModel)
{
    return Backbone.Model.extend(
    {
        initialize: function ()
        {
            this.attributes.answers = new AnswerCollection(this.attributes.answers);
        },

        toJSON: function (cid)
        {
            var json = _.clone(this.attributes);

            json.answers = this.attributes.answers.toJSON(cid);

            if (cid)
            {
                json.cid = this.cid;
            }

            return json;
        },

        validate: function (attrs, options)
        {
            if ("text" in attrs && !attrs.text)
            {
                return str.quiz_error_question;
            }

            if (attrs.answers)
            {
                return attrs.answers.validate();
            }
        },

        defaults: {
            text: ""
        }
    });
});
