/**
 * Eliademy 
 *
 * @copyright CBTec Oy
 * @license   All rights reserved
 */

define([], function() {
	var datadir = null;
	var sLastOwner = null;
	return {
		
		initialize : function() {
			if (!this.datadir) {
				var thisThis = this;
				console.log("Request file system!");
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
						function(fileSystem) {
							thisThis.createFilePath(fileSystem, thisThis);
						}, function() {
							console.log("Failed to create dir ");
						});
			}
		},
		
		owner: function (ow)
        {
            sLastOwner = ow;
            return this;
        },

		createFilePath : function(fileSystem, thisThis) {
			fileSystem.root.getDirectory("eliademy", {
				create : true,
				exclusive : false
			}, function(dirPath) {
				console.log("Directory path fetched! " + dirPath.name + "   "
						+ dirPath.fullPath);
				thisThis.datadir = dirPath;
			}, function(error) {
				console.log("Failed to create dir " + error.code);
			});
		},
		
		downloadFile : function(fileUrl, fileName, successCb, errorCb) {
			console.log(fileUrl+","+fileName);
			if (!this.datadir) {
				console.log("Data dir not set !!");
				errorCb("Internal Error");
			} else {
				console.log("Fetch attachment! " + unescape(fileName));
				var ft = new FileTransfer();
				ft.onprogress = function(progressEvent) {
					if (typeof sLastOwner.progressEvent == 'function') {
                		sLastOwner.progressEvent(progressEvent);
                	}
				};
				var filepath = this.datadir.fullPath + "/" + unescape($.trim(fileName));
				ft.download(fileUrl, filepath, function(entry) {
					console.log("download complete: " + entry.fullPath);
					successCb(entry.fullPath);
					cordova.exec(function() {
						console.log("Activity launched");
					}, function() {
						console.log("Error launching activity");
						errorCb("Error launching activity");
					}, "EliademyLms", "openfilesrv", [ entry.fullPath ]);
				}, function(error) {
					errorCb("Error downloading file");
					console.log("source " + error.source + " target "
							+ error.target + " code " + error.code);
				});
			}
			
		},	
		
		uploadFile: function(fileUrl, serverUrl, params, cb, ecb, cbparams) {
			var ft = new FileTransfer();
			ft.onprogress = function(progressEvent) {
				if (typeof sLastOwner.progressEvent == 'function') {
            		sLastOwner.progressEvent(progressEvent);
            	}
			};
			var options = new FileUploadOptions();			
            options.fileKey="qqfile";
            options.params = params;
			ft.upload(fileUrl, encodeURI(serverUrl),
					function(response){
	            		cb(response.response, cbparams);
					},function(response){
						console.log("Upload failed : "+response);
						ecb(response.response, cbparams);
					},
					options);
		}
	};
});
