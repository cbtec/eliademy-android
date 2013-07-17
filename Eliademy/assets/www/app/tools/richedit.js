/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["jquery"], function ()
{
    var RichEdit = function (element)
    {
        var thisThis = this;

        this.mElement = $(element);

        this.mElement
            .on("keyup", function () { thisThis.statusUpdate(); })
            .on("click", function () { thisThis.statusUpdate(); })
            .on("focus", function () { thisThis.statusUpdate(); })
            .on("blur", function () { thisThis.mButtonBox.find(".rt-button").removeClass("active") });

        this.mBoldBtn = $("<button>").addClass("rt-button btn").html('<i class="icon-bold"></i>')
            .click(function () { document.execCommand("bold"); element.focus(); });

        this.mItalicBtn = $("<button>").addClass("rt-button btn").html('<i class="icon-italic"></i>')
            .click(function () { document.execCommand("italic"); element.focus(); });

        this.mUnderlineBtn = $("<button>").addClass("rt-button btn").html("U").css("text-decoration", "underline")
            .click(function () { document.execCommand("underline"); element.focus(); });

        this.mBulletsBtn = $("<button>").addClass("rt-button btn").append($("<span>").addClass("icon bullets"))
            .click(function () { document.execCommand("insertUnorderedList"); element.focus(); });

        this.mNumbersBtn = $("<button>").addClass("rt-button btn").append($("<span>").addClass("icon numbers"))
            .click(function () { document.execCommand("insertOrderedList"); element.focus(); });

        this.mButtonBox = $("<div>").addClass("rt_editor_bar btn-group").attr('data-toggle', 'buttons-checkbox').insertAfter(element)
            .append(this.mBoldBtn)
            .append(this.mItalicBtn)
            .append(this.mUnderlineBtn)
            .append(this.mBulletsBtn)
            .append(this.mNumbersBtn);
    };

    RichEdit.prototype.statusUpdate = function ()
    {
        try
        {
            if (this.mBoldBtn.hasClass("selected") != document.queryCommandState("bold"))
            {
                this.mBoldBtn.toggleClass("selected");
            }

            if (this.mItalicBtn.hasClass("selected") != document.queryCommandState("italic"))
            {
                this.mItalicBtn.toggleClass("selected");
            }

            if (this.mUnderlineBtn.hasClass("selected") != document.queryCommandState("underline"))
            {
                this.mUnderlineBtn.toggleClass("selected");
            }

            if (this.mBulletsBtn.hasClass("selected") != document.queryCommandState("insertUnorderedList"))
            {
                this.mBulletsBtn.toggleClass("selected");
            }

            if (this.mNumbersBtn.hasClass("selected") != document.queryCommandState("insertOrderedList"))
            {
                this.mNumbersBtn.toggleClass("selected");
            }
        }
        catch (err)
        { }
    };

    return RichEdit;
});
