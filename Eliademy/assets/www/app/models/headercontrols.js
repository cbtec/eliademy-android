/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define([ "i18n!nls/strings", "backbone" ], function(str) {
    var HeaderControls = new (Backbone.Model.extend({
        defaults : {
            state : 0
        },

        editButtons : function() {
            switch (this.get("state")) {
            case 0:
                return [];

            case 1:
                return [ {
                    label : str.edit,
                    handler : startHandler
                } ];

            case 2:
                return [ {
                    label : str.button_cancel,
                    handler : cancelHandler,
                    "class" : "btn btn-danger",
                    "id"    : "btn_edit_cancel"
                }, {
                    label : str.button_save2,
                    handler : saveHandler,
                    "class" : "btn btn-primary",
                    "id"    : "btn_edit_save"
                } ];

            case 3:
                return [ {
                    label : str.button_cancel,
                    handler : cancelHandler,
                    "class" : "btn btn-danger",
                    "id"    : "btn_edit_cancel"
                } ];
            
            case 4:
                return [ {
                    label: str.button_cancel,
                    handler : cancelHandler,
                    "class" : "btn btn-danger"
                }, {
                    label: str.task_save_draft,
                    handler : draftHandler,
                    "class" : "btn btn-primary"
                }, {
                    label: str.button_submit,
                    handler : finalHandler,
                    "class" : "btn btn-primary",
                    "id"    : "btn-submit-submission"
                } ];
                
            case 5:
                return [ {
                    label: str.button_cancel,
                    handler : cancelHandler,
                    "class" : "btn btn-danger"
                }, {
                    label: str.task_submit_changes,
                    handler : finalHandler,
                    "class" : "btn btn-primary",
                    "id"    : "btn-submit-submission"
                } ];
            }
        },

        get : function(name) {
            if (name in this && this[name] instanceof Function) {
                return this[name]();
            } else {
                return Backbone.Model.prototype.get.call(this, name);
            }
        }
    }));

    var startHandler = function() {
        HeaderControls.set("state", 2);
        HeaderControls.get("handler").startEdit();
    };

    var saveHandler = function() {
        HeaderControls.set("state", 1);
        HeaderControls.get("handler").saveEdit();
    };

    var cancelHandler = function() {
        HeaderControls.set("state", 1);
        HeaderControls.get("handler").cancelEdit();
    };
    
    var draftHandler = function() {
        HeaderControls.set("state", 1);
        HeaderControls.get("handler").saveDraft();
    };
    
    var finalHandler = function() {
        HeaderControls.set("state", 1);
        HeaderControls.get("handler").saveFinal();
    };


    return HeaderControls;
});
