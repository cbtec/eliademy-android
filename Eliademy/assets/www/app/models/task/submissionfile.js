/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["app/tools/servicecalls", "backbone"], function (SC)
{
    return Backbone.Model.extend(
    {
        sync: function (method, model, options)
        {
            switch (method)
            {
                case "create":
                    var rawData = model.toJSON(), data = { };
                    _.extend(data, _.pick(rawData, "assignid", "filename", "name"));
                    return SC.call("local_monorailservices_add_submissions", { submissions: [ data ] },
                        function (data) {
                            if ("files" in data && data.files.length > 0) {
                                // fix model data
                                model.set('url', data.files[0].url);
                                model.set('id', data.files[0].id);
                                model.set('type', data.files[0].filetype);
                                model.set('icon', model.icon(data.files[0].filetype));
                            }
                            options.success(method, model, options);
                        }, this);
                    break;

                case "delete":
                    return SC.call("local_monorailservices_del_submissions",
                        { fileitems: [ { assignmentid: model.get("assignid"), fileids: [ model.get("id") ] } ] },
                        function (data) {
                            options.success(method, model, options);
                        }, this);
            }
        },
        
        toJSON: function () {
            var json = _.clone(this.attributes);
            json.cid = this.cid;
            return json;
        },
        
        icon: function () {
            // Since these are not file resources we do not get icon from Moodle
            switch (this.get("type")) {
                case "pdf":
                    return "icon-pdf.png";
                case "spreadsheet":
                    return "icon-excel.png";
                case "document":
                    return "icon-document.png";
                case "presentation":
                    return "icon-presentation.png";
                case "other":
                    return "icon-download.png";
                default:
                    return null;
            }
        },

        defaults: {
            assignid: 0,
            filename: null,
            name: null,
            url: '#',
            media: null,
            remove: false,
            type: null,
            icon: null
        }
    });
});
