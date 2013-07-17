/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(function ()
{
    var firstTouch = {}, lastTouch = {};

	return {
		setupNode: function (node)
		{
            var thisThis = this;

			$(node).find("a").not(".ignored_link, .setupdone").each(function ()
            {
                this.addEventListener("touchend", function (ev)
                {
                    if (Math.abs(firstTouch.x - lastTouch.x) > 3 || Math.abs(firstTouch.y - lastTouch.y) > 3)
                    {
                        return;
                    }

					var el = $(ev.target);                                        
                    
					while (el.get(0).nodeName.toLowerCase() != "a")
					{
						el = el.parent();
					}

					var path = el.attr("href");

                    if (path == undefined)
                    {
                        console.warn("Trying to handle invalid link...");
                        return;
                    }
                    if(!$(this).hasClass("ignored_link"))
                    {
                    	ev.preventDefault();
                        thisThis.go(path);
                    }
                }, false);

                this.addEventListener("touchstart", function (ev)
                {
                    if (ev.touches.length)
                    {
                        firstTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
                        lastTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
                    }

                }, false);

                this.addEventListener("touchmove", function (ev)
                {
                    if (ev.touches.length)
                    {
                        lastTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
                    }

                }, false);

                this.onclick = function (ev)
                {
                    ev.preventDefault();
                };

                $(this).addClass("setupdone");
            });

            $(node).find(".tappable").each(function ()
            {
                var target = this;

                this.addEventListener("touchstart", function (ev)
                {
                    firstTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
                    lastTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
                }, false);

                this.addEventListener("touchmove", function (ev)
                {
                    lastTouch = { x: ev.touches.item(0).screenX, y: ev.touches.item(0).screenY };
                }, false);

                this.addEventListener("touchend", function (ev)
                {
                    if (Math.abs(firstTouch.x - lastTouch.x) < 4 && Math.abs(firstTouch.y - lastTouch.y) < 4)
                    {
                        $(target).trigger("fastclick");
                    }
                }, false);
            });
		},

		setupView: function (view)
		{
			this.setupNode(view.$el);
		},

        go: function (path)
        {
            if (path.substring(0, 3) == "../")
            {
                // Link to old-school moodle.
                window.location.href = MoodleDir + path.substring(3);
            }
            else if (path.substring(0, 7) == "http://" || path.substring(0, 8) == "https://" || path.substring(0, 7) == "/pdfjs/")
            {
                // Link to outside.
            	navigator.app.loadUrl(path, { openExternal:true });
            }
            else if (path.substring(0, 1) == "/")
            {
                // Internal link.
                require(["app/router"], function (Router)
                {
                    Router.navigate(path, { trigger: true });
                });
            }
            else
            {
                // Link to outside, probably.
            	navigator.app.loadUrl(path, { openExternal:true });
            }
        }
	};
});
