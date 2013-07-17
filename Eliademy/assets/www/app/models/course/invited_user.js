/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "backbone"],
    function (SC)
{
	return Backbone.Model.extend(
	{

        mCourseId: null,

        setCourseId: function (id)
        {
            this.mCourseId = id;

            return this;
        },
        
        mCode: null,

        setCode: function (code)
        {
            this.mCode = code;

            return this;
        },
        
        mCollection: null,

        setCollection: function (collection) {
            this.mCollection = collection;
            return this;
        },
        
        mView: null,

        setView: function (view) {
            this.mView = view;
            return this;
        },

        sync: function (method, model, options)
        {
            var that = this;

            if (method == "create") {
                SC.call("local_monorailservices_invite_send", { courseid: this.mCourseId, code: this.mCode, email: this.get('email') }, 
                    function (data) {
                        options.success(data);
                    }, 
                    this,
                    function (data) {
                        options.error(data);
                });
            }
            return this;
        },

		defaults: function ()
        {
            return {
                email: null,
                invitedby: null,
                invitedwhen: null
            };
		}
	});
});
