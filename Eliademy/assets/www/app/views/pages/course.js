/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["text!app/templates/pages/course.html", "i18n!nls/strings", "app/models/course/section", 
        "app/collections/course/courses", "app/tools/filetransfer", "app/tools/dataloader","app/tools/linkhandler",
        "app/router", "app/tools/inlinecontent"],

    function (tpl, str, SectionModel, CourseCollection, FileTransfer, DataLoader, LinkHandler, Router, InlineContent)
{
    return new (Backbone.View.extend(
    {
    	el: "#main-content",

        code : null,
        model : null,
        datadir: null,
        hasToolbar: true,
        toolbarMode: "back",
        toolbarOptions: "courses",
        stylesheet: "stylesheet-course",


        template: _.template(tpl),

        events: {
        	"fastclick .download-link" : "fetchAttachment",
        	"fastclick .follow-link" : "openUrl"
        },
        
        refresh: function ()
        {
            CourseCollection.reset();
            this.render();
        },
        
        initialize: function()
        {
        	FileTransfer.initialize();
        },
        
        openUrl: function(ev)
        {
        	ev.preventDefault();
        	navigator.app.loadUrl($(ev.currentTarget).attr("data-url"), { openExternal:true });
        },
       
        
        progressEvent: function(pev) {
        	if (pev.lengthComputable) {
        	  if(pev.loaded == pev.total) {
        		  //$('#progress-bar .bar').css('width', '100%');
        		  Router.showProgress(false);
        	  } else {
        		  //var percent = ((pev.loaded/pev.total)*100) + '%';
        		  //$('#progress-bar .bar').css('width', percent);
        	      Router.showProgress(true);
        	  }
        	} 
        },
        
        downloadComplete: function(filepath)
        {
        	Router.showProgress(false);
        },
        
        
        
        fetchAttachment: function(ev)
        {
        	ev.preventDefault();
        	var filename = $(ev.currentTarget).attr("filename");
        	if(filename.indexOf('.') == -1) {
        		var mime = $(ev.currentTarget).attr("mimetype").substring($(ev.currentTarget).attr("mimetype").lastIndexOf('/')+1);
        		if(!mime || mime.length != 0) {
        			filename = filename + "." + mime;
        		}
        	}
        	FileTransfer.owner(this);
        	FileTransfer.downloadFile($(ev.currentTarget).attr("data-url"), filename, this.downloadComplete, this.downloadComplete);
        },

        render: function ()
        {
            DataLoader.exec({ collection: CourseCollection, where: { code: this.code }, context: this }, function (model)
            {
                this.model = model;

                DataLoader.exec({ collection: model.get("sections"), context: this }, function (sections)
                {
                    this.$el.html(this.template({ str: str, course: model.toJSON(), csections: sections.toJSON() }));

                    sections.each(function (section)
                    {
                        InlineContent.fixAttachmentUrls(this.$el, section.get("attachments"));

                        section.get("attachments").each(function (att)
                        {
                        	if (att.get("type") == "vimeo")
                            {
                                // Fetching thumbnails for vimeo videos.

                                $.ajax({
                                    type: 'GET',
                                    url: 'https://vimeo.com/api/v2/video/' + att.get("videoid") + '.json',
                                    dataType: 'jsonp',
                                    success: function(vdata) {
                                        $("#vimeo-preview-" + att.get("id")).attr('src', vdata[0].thumbnail_large).show();
                                    }
                                });
                            }
                        });
                    }, this);

                    LinkHandler.setupView(this);
                });
            });
        },
    }));
});
