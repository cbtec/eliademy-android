/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!templates/warnings.html", "i18n!nls/strings", "app/collections/warnings"],

    function (tpl, str, WarningsCollection)
{
    return Backbone.View.extend(
    {
        el: "#page-warnings-container",
        
        template: _.template(tpl),
        
        initialize: function() {
            if (!this.model) {
                this.model = WarningsCollection.get(0);
                if (!this.model) {
                    WarningsCollection.create({id: 0});
                    this.model = WarningsCollection.get(0);
                }
            }
            this.model.on("change", this.render, this);
        },
        
		render: function () {            
			var count = this.model.get('list').length;
			if (count == 0) {
                $(this.el).hide();
                $(this.el).html();
			} else {
                $(this.el).show();
                $(this.el).html(this.template({str: str, data: JSON.stringify(this.model.get('list'))}));
                this.delegateEvents();
			}
			return this;
		},
        
        events: {
            "click div#page-warnings .close": "emptyList"
        },
        
        emptyList: function() {
            // empty list, it has been closed
            this.model.set('list', []);
        }
        
    });

});
