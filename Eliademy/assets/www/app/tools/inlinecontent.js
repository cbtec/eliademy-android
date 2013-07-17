/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(function ()
{
    var copyAttributes = function (source, target)
    {
        ["width", "height", "cssFloat", "marginRight", "marginLeft", "marginTop", "marginBottom", "margin", "verticalAlign"].forEach(function (f)
        {
            if (source.style[f])
            {
                target.style[f] = source.style[f];
            }
        });

        ["width", "height"].forEach(function (f)
        {
            if (source.hasAttribute(f))
            {
                target.setAttribute(f, source.getAttribute(f));
            }
        });
    };

    return {
        /* Prepare HTML with attachments for saving.
         * */
        embedAttachments: function (html, attachments)
        {
            var el = document.createElement("div");

            el.innerHTML = html;

            $(el).find("*[data-attachment-id]").each(function ()
            {
                var att = attachments.get(this.getAttribute("data-attachment-id"));

                if (att && !att.isNew())
                {
                    // Replace cid with real attachment id
                    this.removeAttribute("data-attachment-id");
                    this.setAttribute("data-attachment", att.get("id"));

                    if (!this.hasAttribute("data-attachment-type"))
                    {
                        // Remove URL that points to temporary file
                        switch (this.nodeName)
                        {
                            case "IMG": case "AUDIO": case "VIDEO":
                                this.removeAttribute("src");
                                break;
                        }
                    }
                }
            });

            return el.innerHTML;
        },

        /* Display attachments inside HTML.
         * */
        fixAttachmentUrls: function (par, attachments, noreplace)
        {
            par.find("*[data-attachment]").each(function ()
            {
                var att = attachments.get(this.getAttribute("data-attachment"));

                if (!att)
                {
                    console.warn("Attachment " + this.getAttribute("data-attachment") + " not found.");
                }
                else
                {
                    if (this.hasAttribute("data-attachment-type"))
                    {
                        if (noreplace !== true)
                        {
                            var type = this.getAttribute("data-attachment-type");

                            switch (type)
                            {
                                case "video": case "audio":
                                    // Replace with video/audio element.
                                    var el = document.createElement(type);

                                    el.setAttribute("src", att.get("url"));
                                    el.setAttribute("controls", true);
                                    el.style.verticalAlign = "middle";

                                    copyAttributes(this, el);

                                    $(this).replaceWith(el);
                                    break;

                                default:
                                    console.warn("Unsupported attachment type: " + type);
                            }
                        }
                    }
                    else
                    {
                        // Set URL to attachment file.
                        switch (this.nodeName)
                        {
                            case "IMG": case "AUDIO": case "VIDEO":
                                this.setAttribute("src", att.get("url"));
                                break;
                        }
                    }

                    if (att.has("filename"))
                    {
                        $(this).addClass("tappable download-link");

                        $(this).attr({
                            filename: att.get("filename"),
                            mimetype: att.get("mimetype"),
                            "data-url": att.get("url"),
                            "value": att.get("url") });
                    }
                    else if (att.has("contents"))
                    {
                        $(this).addClass("tappable download-link");

                        $(this).attr({
                            filename: att.get("contents")[0].filename,
                            mimetype: att.get("contents")[0].mimetype,
                            "data-url": att.get("url"),
                            "value": att.get("url") });
                    }
                }
            });

            if (noreplace !== true)
            {
                par.find("*[data-attachment-youtube]").each(function ()
                {
                    var videoid = this.getAttribute("data-attachment-youtube");

                    $(this).click(function ()
                    {
        	            navigator.app.loadUrl("https://www.youtube.com/watch?v=" + videoid, { openExternal:true });
                    });
                });

                par.find("*[data-attachment-vimeo]").each(function ()
                {
                    var videoid = this.getAttribute("data-attachment-vimeo");

                    $(this).click(function ()
                    {
        	            navigator.app.loadUrl("http://vimeo.com/" + videoid, { openExternal:true });
                    });
                });

                par.find("*[data-attachment-slideshare]").each(function ()
                {
                    // Slideshare image urls don't have protocol...
                    if ($(this).attr("src").substr(0, 2) == "//")
                    {
                        $(this).attr("src", "http:" + $(this).attr("src"));
                    }

                    var url = this.getAttribute("data-attachment-slideshare");

                    $(this).click(function ()
                    {
        	            navigator.app.loadUrl(url, { openExternal:true });
                    });
                });
            }
        },
    };
});
