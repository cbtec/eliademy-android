/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

/* Configure the input fields with following classes:
 *
 * noempty - field cannot be empty
 * livevalidation - field will be validated against model validator after each key press (and tooltip shown for errors)
 * */

define(["app/tools/richedit", "i18n!nls/strings", "app/tools/utils"], function (RichEdit, str, Utils)
{
    var getValue = function (model, field)
    {
        if (field === undefined)
        {
            console.warn("An inline input field doesn't have field name!");
            return null;
        }

        var parts = field.split("|"),
            i = 0, c = parts.length, val = model, v;

        if (c == 1)
        {
            v = model.get(field);

            return v ? v : "";
        }
        else
        {
            for (; i<c; i++)
            {
                try
                {
                    v = val.get(parts[i]);
                }
                catch (err)
                {
                    console.warn("Unable to get value from " + parts[i]);
                }

                val = v;
            }

            return val ? val : "";
        }
    };

    var lastValidationError = "";

    var validateField = function (model, field, value)
    {
        var attrs = { };

        var parts = field.split("|"),
            i = 0, c = parts.length - 1,
            mod = model;

        for (; i<c; i++)
        {
            try
            {
                mod = mod.get(parts[i]);
            }
            catch (err)
            {
                console.warn("Unable to get value from " + parts[i]);
                break;
            }
        }

        try
        {
            if ("validate" in mod && mod.validate instanceof Function)
            {
                attrs[parts[parts.length - 1]] = value;

                return mod.validate(attrs);
            }
        }
        catch (err)
        {
            console.warn("Cannot validate " + field);
        }
    };

    var setValue = function (model, field, value, dry)
    {
        if (!field)
        {
            console.warn("data-field not specified for editable element!");

            return dry ? true : false;
        }

        var parts = field.split("|"),
            i = 0, c = parts.length - 1, val = model, v, vErr;

        if (c == 0)
        {
            if (!dry && (vErr = validateField(model, field, value)))
            {
                lastValidationError = vErr;

                return false;
            }

            model.set(field, value, { silent: true });
        }
        else
        {
            for (; i<c; i++)
            {
                try
                {
                    v = val.get(parts[i]);
                }
                catch (err)
                {
                    console.warn("Unable to set value to " + parts[i]);
                }

                val = v;
            }

            if (!dry && (vErr = validateField(val, parts[i], value)))
            {
                lastValidationError = vErr;

                return false;
            }

            val.set(parts[i], value, { silent: true });
        }

        return true;
    };

    /* Extract value from any element.
     * */
    var getElementValue = function (element)
    {
        var el = $(element);

        if (el.hasClass("editable"))
        {
            if (el.attr("data-placeholder") && el.children().first().hasClass("placeholder"))
            {
                return "";
            }

            if (el.hasClass("richtext"))
            {
                // Converting URLs in rich text fields to links...
                var text = el.html(), text2 = "", link, clean, url;

                while (true)
                {
                    link = text.match(/<a[^>]+>.*?<\/[\s]*a[\s]*>/i);

                    if (link)
                    {
                        clean = text.substr(0, link.index);
                    }
                    else
                    {
                        clean = text;
                    }

                    while (true)
                    {
                        url = clean.match(/(\bwww\.|\bhttp[s]?:\/\/)[^\s<>]+/i);

                        if (url)
                        {
                            switch (url[0].substr(url[0].length - 1))
                            {
                                case '.': case ',': case ':': case ';': case '?': case '!': case ')': case '(':
                                    url[0] = url[0].substr(0, url[0].length - 1);
                            }

                            text2 += clean.substr(0, url.index);
                            text2 += "<a href=\""

                            if (!/^http[s]?:\/\/.*/i.test(url[0]))
                            {
                                text2 += "http://";
                            }

                            text2 += url[0] + "\" title=\"" + url[0] + "\" class=\"link\" target=\"_blank\">";
                            text2 += url[0];
                            text2 += "</a>";

                            clean = clean.substr(url[0].length + url.index);
                        }
                        else
                        {
                            text2 += clean;
                            break;
                        }
                    }

                    if (link)
                    {
                        text2 += link[0];
                        text = text.substr(link[0].length + link.index);
                    }
                    else
                    {
                        break;
                    }
                }

                return $.trim(text2);
            }
            else
            {
                return $.trim(el.text());
            }
        }
        else if (el.prop("tagName") == "TEXTAREA")
        {
            return $.trim(el.val().replace(/\n/gi, "<br>"));
        }
        else if (el.prop("tagName") == "INPUT" && el.prop("type") == "checkbox")
        {
            return el.is(":checked") ? 1 : 0;
        }
        else
        {
            return $.trim(el.val());
        }

        return "";
    };

    var liveValidator = function (model, element, event)
    {
        var err = validateField(model, $(element).attr("data-field"), getElementValue(element));
        if (err)
        {
            if ( $(element).data('tooltip') ) {
                var errmsg =  $(element).data('tooltip').options.title;
                
                // Destroy tooltip if the message is different
                if (typeof(err) == 'object') {
                    if (err.err !== errmsg) {
                        $(element).tooltip("destroy");
                    }
                } else {
                    if (err !== errmsg) {
                        $(element).tooltip("destroy");
                    }
                }
            }
            
            if (typeof(err) == 'object') {
                $(element).tooltip({ title: err.err, trigger: 'manual', animation: false });
                $(element).tooltip('show');
                
                // TODO: use placeholder from element instead of predefined
                // string... and make a normal placeholder mechanism
                if ( event == 'blur' && $(element).prop('tagName') != 'INPUT'
                    && $(element).hasClass('notempty') && $(element).html() == '') {
                    $(element).html(str.label_attachment);
                } 
            }
            else {
                $(element).tooltip({ title: err, trigger: "manual", animation: false });
                $(element).tooltip("show");
            }
        }
        else
        {
            $(element).tooltip("destroy");
        }
    };

    var InlineEdit = function ()
    {
        this.mView = null;
        this.mEnabled = false;
    };

    InlineEdit.prototype.isActive = function ()
    {
        return this.mEnabled;
    };

    /* Initialize in-line editor with the given view.
     * */
    InlineEdit.prototype.init = function (view)
    {
        this.mView = view;
        this.setup(this.mView.$el);
    };

    InlineEdit.prototype.reInit = function (node)
    {
        this.setup($(node));

        if (this.mEnabled)
        {
            this.start(node, true);
        }
    };
    
    InlineEdit.prototype.placeholderActive = function (node)
    {
        if ($(node).attr("data-placeholder") && $(node).children().first().hasClass("placeholder")) {
            return true;
        } 
        else
        {
            return false;
        }
    };

    InlineEdit.prototype.setup = function (node)
    {
        var thisThis = this;

        // Events for inline-editable fields.

        node.find(".editable")
            .on("focus", function (ev)
            {
                if (!thisThis.mEnabled)
                {
                    return;
                }

                var $t = $(this).closest(".editable");

                if ($t.attr("data-placeholder") && $t.children().first().hasClass("placeholder"))
                {
                    setTimeout(function ()
                    {
                        $t.html("");
                        $t.focus();
                    }, 10);
                }

                $t.data("original", $t.html());
            })
            .on("keydown", function (ev)
            {
                if (!thisThis.mEnabled)
                {
                    return;
                }

                var $t = $(this).closest(".editable");

                switch (ev.keyCode)
                {
                    case 27:
                        $t.html($t.data("original"));
                        $t.blur();
                        break;

                    case 13:
                        if (!$t.hasClass("multiline"))
                        {
                            $t.blur();
                        }
                        break;
                }
            })
            .on("click", function (ev)
            {
                if (thisThis.mEnabled)
                {
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            })
            .on("tripleclick", function (ev)
            {
                // Special handling for Firefox to focus in and activate the editable field
                // This fixes problem with selecting whole field for editing by triple click
                // Mozilla bug tracker: https://bugzilla.mozilla.org/show_bug.cgi?id=389348
                var t = $(ev.currentTarget);
                if (! t.hasClass('multiline') && window.getSelection) {
                    var sel = window.getSelection();
                    var range = document.createRange();
                    t.attr('id', 'nodeToBeSelected');
                    range.selectNodeContents(document.getElementById('nodeToBeSelected'));
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    t.attr('id', null);
                    document.execCommand('selectAll',false,null);
                }
            })
            .on("drop", function (ev)
            {
                ev.stopPropagation();
                ev.preventDefault();
            })
            .on("paste", function (ev)
            {
                if (!thisThis.mEnabled)
                {
                    return;
                }

                var sel = window.getSelection(),
                    ran = sel.getRangeAt(0),
                    $t = $(this),
                    tempDiv = $("<div>").css({ height: "1px", overflow: "hidden" }).attr("contenteditable", "true").insertAfter($t).focus();

                setTimeout(function ()
                {
                	var paste = document.createDocumentFragment(), no = null;

                    var makePaste = function (src)
                    {
                        var i, brk;

                        for (i=0; i<src.length; i++)
                        {
                            brk = false;

                            switch (src[i].nodeName)
                            {
                                case "#text":
                                    paste.appendChild(no = document.createTextNode("textContent" in src[i] ?
                                            src[i].textContent.replace(/<[^>]+>/gi, "") :
                                            src[i].innerHTML.replace(/<[^>]+>/gi, "")));
                                    break;

                                case "BR":
                                    paste.appendChild(document.createElement("br"));
                                    break;

                                case "DIV": case "P": case "TABLE":
                                case "H1": case "H2": case "H3": case "H4": case "H5": case "H6":
                                    brk = true;

                                default:
                                    if (brk)
                                    {
                                        paste.appendChild(document.createElement("br"));
                                    }

                                    makePaste(src[i].childNodes);

                                    if (brk)
                                    {
                                        paste.appendChild(document.createElement("br"));
                                    }
                                    break;
                            }
                        }
                    };

                    makePaste(tempDiv.get(0).childNodes);

                    sel.removeAllRanges();
                    sel.addRange(ran);
                    ran.deleteContents();
                    ran.insertNode(paste);

                    // Moving cursor to the end of pasted text.
                    if (no)
                    {
                        $t.focus();
                        ran = document.createRange();
                        ran.selectNodeContents(no);
                        ran.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(ran);
                    }

                    tempDiv.remove();
                    
                    if ($t.hasClass('livevalidation')) {
                        liveValidator(thisThis.mView.model, $t);
                    }
                }, 0);
            });

        // Live validation fields.

        node.find(".livevalidation")
            .on("keypress", function (ev)
            {
                if (thisThis.mEnabled)
                {
                    liveValidator(thisThis.mView.model, this);
                }
            })
            .on("keyup", function (ev)
            {
                if (thisThis.mEnabled)
                {
                    liveValidator(thisThis.mView.model, this);
                }
            })
            .on("blur", function (ev)
            {
                if (thisThis.mEnabled)
                {
                    liveValidator(thisThis.mView.model, this, 'blur');                    
                }
            });
    };

    /* Enter editing mode.
     * */
    InlineEdit.prototype.start = function (node, restart)
    {
        if (this.mEnabled && !restart)
        {
            // XXX: trying to enable editing when it's already enabled...
            console.warn("Trying to re-enable editor...");
            return;
        }

        this.mEnabled = true;

        (node ? node : this.mView.$el).find(".editable").attr("contenteditable", true).filter(".richtext").each(function ()
        {
            new RichEdit(this);
        });

        (node ? node : this.mView.$el).find(".editable").each(function ()
        {
            if ($(this).attr("data-placeholder") && !$(this).text())
            {
                $(this).html("<span class=\"placeholder\" style=\"color: #888;\">" + $(this).attr("data-placeholder") + "</span>");
            }
        });
    };

    /* Leave editing mode reverting all changes.
     * */
    InlineEdit.prototype.rollback = function ()
    {
        this.mEnabled = false;
        var thisThis = this;

        this.mView.$el.find(".editable").each(function ()
        {
            $(this).attr("contenteditable", false).html(getValue(thisThis.mView.model, $(this).attr("data-field")));
        });

        this.mView.$el.find("textarea[data-field],select[data-field],input[data-field]").each(function ()
        {
            $(this).val(getValue(thisThis.mView.model, $(this).attr("data-field")));
        });

        this.mView.$el.find(".rt_editor_bar").remove();
    };

    /* Leave editing mode keeping the changes.
     *
     * Returns true if values successfully are set to model, false if
     * validation fails. There are 2 ways to provide validation rules: add
     * "noempty" class to input field (for mandatory fields), and to use
     * validate method in model.
     * */
    InlineEdit.prototype.commit = function (dry)
    {
        var thisThis = this, allOk = true;

        if (!dry)
        {
            // Validate the noempty fields.
            this.mView.$el.find(".noempty").each(function ()
            {
                if (getElementValue(this) == "")
                {
                    allOk = false;
                    $(this).focus();
                    return;
                }
            });

            if (!allOk)
            {
                this.errorString = str.fill_missing_fields;

                return false;
            }
        }

        // Collect values...

        this.mView.$el.find(".editable,select[data-field],input[data-field],textarea[data-field]").each(function ()
        {
            if (!setValue(thisThis.mView.model, $(this).attr("data-field"), getElementValue(this), dry))
            {
                $(this).focus();
                allOk = false;
                return;
            }
        });

        if (dry)
        {
            return true;
        }

        if (!allOk)
        {
            this.errorString = lastValidationError;

            return false;
        }

        // Final validation.
        if (this.mView.model.validate instanceof Function)
        {
            this.errorString = this.mView.model.validate(this.mView.model.attributes);

            if (this.errorString)
            {
                return false;
            }
        }

        this.mView.$el.find(".editable").each(function ()
        {
            $(this).attr("contenteditable", false);
        });

        this.mView.$el.find(".rt_editor_bar").remove();

        this.mEnabled = false;

        return true;
    };

	return InlineEdit;
});
