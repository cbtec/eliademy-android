/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/models/notifications/notifications", "app/tools/servicecalls"], function (NotificationModel, SC)
{
    return new (Backbone.Collection.extend(
    {
    	mlastCount: 0,

        setLastCount: function (count)
        {
            this.mlastCount = count;

            return this;
        },
        
        mMaxCount: 20,

        setMaxCount: function (count)
        {
            this.mMaxCount = count;

            return this;
        },
        
        mLastTimestamp: 0,
        
        setLastTimestamp: function (timestamp)
        {
            this.mLastTimestamp = timestamp;

            return this;
        },
        
        sync: function (method, collection, options)
        {
            switch (method)
            {
                case "read":
                    SC.call("local_monorailservices_get_notifications", {lastfetchcount: this.mlastCount, maxcount: this.mMaxCount, lasttimetamp: this.mLastTimestamp}, function (data)
                    {
                    	if(this.mlastCount > 0) {
                    		//add new items
                    		this.add(data.notifications);
                    	} else {
                    		//reset collection
                            this.reset(data.notifications);
                    	}
                    }, this);
                    break;

                default:
                    console.warn("Unimplemented method " + method + " in notifications collection.");
                    options.error(method, collection, options);
            }
        },

        model: NotificationModel
    }));
});
