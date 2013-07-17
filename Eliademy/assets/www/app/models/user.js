/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "backbone"], function (SC)
{
	return new (Backbone.Model.extend(
	{
		mPushRegisterId: null,

        setPushRegisterId: function (id)
        {
            this.mPushRegisterId = id;
            return this;
        },
        
        getPushRegisterId : function (id)
        {
        	return this.mPushRegisterId;
        },
        
        sync: function (method, model, options)
        {
            var origData, data, haveInfo, haveLangs;
            switch (method)
            {
                case "read":
                    haveInfo = false;
                    haveLangs = true;//false;
/*
                    SC.call("local_monorailservices_supported_langs", { },
                        function (ret)
                        {
                            try
                            {
                                model.set({ langs: ret.languages }, { silent: true });
                            }
                            catch (err)
                            {
                                console.warn("Invalid data from local_monorailservices_supported_langs");
                            }

                            haveLangs = true;

                            if (haveInfo)
                            {
                                model.trigger("updated");
                            }
                        }, this);
                   */
                    SC.call("local_monorailservices_get_users_by_id", { },
                        function (ret)
                        {
                            try
                            {
                                data = ret[0];
                                data.profileimageurl += "?v=" + (new Date()).getTime();
                                data.profileimageurlsmall += "?v=" + (new Date()).getTime();

                                if ("customfields" in data)
                                {
                                    _.each(data.customfields, function (fld)
                                    {
                                        data[fld.type] = fld.value;
                                    });
                                }
                                
                                // create easily readable list of course ID's where enrolled
                                data.enrolledcourseslist = new Array();
                                if (typeof data.enrolledcourses !== 'undefined') {
                                    for (var i = 0; i < data.enrolledcourses.length; i++) {
                                        data.enrolledcourseslist.push(data.enrolledcourses[i].id);
                                    }
                                }

                                model.set(data);

                                // XXX: this field sometimes comes empty after
                                // signup.
                                if (!data.fullname)
                                {
                                    model.fetch();
                                }
                            }
                            catch (err)
                            {
                                console.warn("Invalid data from local_monorailservices_get_users_by_id");
                            }

                            haveInfo = true;

                            if (haveLangs)
                            {
                                model.trigger("updated");
                            }
                        }, this);
                    break;

                case "update":                	
                    origData = model.toJSON();
                    data = _.pick(origData, "id", "firstname", "lastname", "city", "country", "skype", "interests", "lang", "tutorial");
                    data.customfields = [ ];

                    _.each(["birthday"], function (fld)
                    {
                        if(origData[fld])
                            data.customfields.push({ type: fld, value: origData[fld] });
                    });
                    
                    var thisThis = this;
                    
                    SC.call("local_monorailservices_update_users", { users: [ data ] },
                        function (ret)
                        {
                    		if (model.get('updateTutorial')) {
                    			// Just update tutorial, not fetch new database
                    			model.set('updateTutorial', false);
                    		}
                    		else {
                    		    console.log('Fetch user');
                    			model.fetch();
                    			model.trigger("updated");
                    		}
                        }, this);

                    break;

                default:
                    console.warn("Unhandled method in user sync: " + method);
            }
        }
	}));
});
