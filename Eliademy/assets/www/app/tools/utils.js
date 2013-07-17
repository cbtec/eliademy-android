/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(function ()
{
    return {
        padLeft: function (txt, chr, len)
        {
            txt += "";

            var l = txt.length;

            while (l < len)
            {
                l++;
                txt = chr + txt;
            }

            return txt;
        },
        externalUrlData : function (url,attrib)
        {
            try
            {
                if (/^((http|https):\/\/)?(www\.)?youtu(\.be|be\.com)/.test(url)) {
                    // a youtube link id contain alphabet, digit, and -\_
                    try {
                        attrib.videoid = /v\=([a-zA-Z0-9\-_]+)/.exec(url)[1];
                    } catch (err) {
                        attrib.videoid = /youtu\.be\/([a-zA-Z0-9\-_]+)/.exec(url)[1];
                    }
                    attrib.type = "youtube";
                } else if (/^((http|https):\/\/)?(www\.)?slideshare\.net/.test(url)) {
                    // a slideshare link
                    attrib.type = "slideshare";
                    attrib.oembedurl = url;
                } else if (/^((http|https):\/\/)?(www\.)?vimeo\.com/.test(url)) {
                    // a vimeo link id should be 
                    attrib.videoid = /.com\/(\d+)/.exec(url)[1];
                    attrib.type = "vimeo";
                }
            }
            catch (err)
            {
                console.warn("Invalid external url.");
            }

            return attrib;
        },
        // http://stackoverflow.com/a/46181
        validateEmail: function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },

        validateUrl: function (url)
        {
            //source: http://www.dzone.com/snippets/validate-url-regexp
            var regexp = /((ftp|http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/; 

            //source : http://ajax.aspnetcdn.com/ajax/jquery.validate/1.10.0/jquery.validate.js
            //var regexp = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/
            return regexp.test(url);
         },

        // Small customization to function by user Scott Dowding @ http://stackoverflow.com/a/488073/1489738
        isScrolledIntoView: function (elem, offset) {
            if ($(elem).length) {
                var docViewTop = $(window).scrollTop();
                var docViewBottom = docViewTop + $(window).height();

                var elemTop = $(elem).offset().top + offset;
                var elemBottom = elemTop + 20;

                return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
            } else {
                return false;
            }
        }
    };
});
