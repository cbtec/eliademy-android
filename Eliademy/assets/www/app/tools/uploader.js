/**
 * Eliademy.com
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */ 

define(["i18n!nls/strings","app/tools/warnings", "jqueryupload"], function (str, WarningTool)
{
    var sLastOwner = null;
    
    return {
        //restrict type of file which is gonna to open 
        filetype: null,
        customFileUploadLimit: FileUploadLimit,

        owner: function (ow)
        {
            sLastOwner = ow;

            return this;
        },
        restrictFileType: function(type)
        {
            filetype = type;
            return this;
        },
        setFileUploadLimit: function(size)
        {
            customFileUploadLimit = size;
            return this;
        },
        exec: function (handler, error, done, url)
        {
            var form = $("<form style=\"display: none\">"),
                input = $('<input name="qqfile" type="file" > ');
            var that = this;    
            if(filetype) input.attr("accept",filetype);

            form.append(input);
            
            if (typeof customFileUploadLimit === 'undefined') {
                customFileUploadLimit = FileUploadLimit;
            }

            form.fileupload(
            {
                url: (url ? url : MoodleDir + "theme/monorail/ext/ajax_upload_file_chunk.php"),
                multipart: false,
                maxChunkSize: 300000,
                
                add: function (e, data) {  

                    if (data.files[0].size > customFileUploadLimit) {
                        var msg = str.err_uploaded_file_exceeds_limit.replace('%s', customFileUploadLimit / 1024 / 1024);
                        WarningTool.processWarnings({msgtype:'error', message:msg});
                        $('#page-warnings').addClass('alert-error');
                        
                        if (error instanceof Function) {
                            error.apply(sLastOwner, [{ error: msg }]);
                        }
                        customFileUploadLimit = FileUploadLimit;
                        
                        return;
                    }   

                    data.formData = { qqfile: data.files[0].name };    
                    if (handler instanceof Function) {
                        handler.apply();
                    }
                    customFileUploadLimit = FileUploadLimit;
                    data.submit();
                 },
                done: function (e, data)
                {                    
                    if (done instanceof Function) {
                        done.apply(sLastOwner, [
                            { filename: data.files[0].name,
                              origname: data.files[0].name } ]);
                    }
                    customFileUploadLimit = FileUploadLimit;
                },

                fail: function (e, data)
                {
                    if (error instanceof Function) {
                        error.apply(sLastOwner, [{ error: data.textStatus }]);
                    } else {                    
                        console.warn("Upload failed: " + data.textStatus);
                    }
                    customFileUploadLimit = FileUploadLimit;
                },
                
                progress: function (e, data) {
                	if (typeof sLastOwner.upload_process == 'function') {
                		sLastOwner.upload_process(e, data);
                	}
                    else
                    {
                        //assume have a progress-bar
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#progress-bar .bar').css(
                            'width',
                            progress + '%'
                        );

                    }
                },
                
            });

            input.click();

            return this;
        }
    };
});
