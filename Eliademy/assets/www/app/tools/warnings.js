/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/collections/warnings","app/models/warnings","app/views/warnings"], function (WarningsCollection, WarningModel, WarningView)
{
	return {
        
		processWarnings: function (data) {
            try
            {
                if (!data.timeout) {
                    data.timeout = 0;
                }
                
                if(data.message && data.msgtype){
                    var warningModel = new WarningModel({type:data.msgtype, message:data.message});

                    var warnings = new WarningView({model:warningModel, timeout:data.timeout});
                    
                }
            
                
            }
            catch (err)
            {
                console.warn("Error while processing errors: " + err);
            }
		}
	};
});
