var fileUpload = {
	validateAttach: function (attachmentElem, showPreListFile, preListElem) {
		//check whether client browser fully supports all File API
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			var file_invalid = [];
			var $thisElem = $(attachmentElem)[0].files;
			var fsize = null; //get file size
			var ftype = null; //get file type
			var fname = null; //get file filename


			for (var i = 0; i < $thisElem.length; i++) {
				fsize = $thisElem[i].size;
				ftype = $thisElem[i].type;
				fname = $thisElem[i].name;

				//allow file types 
				switch (ftype) {
					case 'image/png':
					case 'image/jpeg':
					case 'application/pdf':
						break;
					default:
						file_invalid.push(fname + ' unsupported file type.');
				}

				//Allow file size is less than 2 MB (1048576 = 1 MB)
				if (fsize > 2097152) {
					file_invalid.push(fname + ' File is too big!,</br> it should be less than 2 MB.');
				}

			}

			console.log('Type ', ftype);
			console.log('Size ', fsize);
			console.log($thisElem);
			console.log(file_invalid);
			if (file_invalid.length > 0) {
				alert(file_invalid.join("\n"));
				$(attachmentElem)[0].value = ''; //Reset input file
				return false;
			} else {

				if (showPreListFile === true) {
					var the_return = $(preListElem),
						listFiles = [];

					$("#no-file-upload").hide(); //Remove message nothing file upload.
					for (var i = 0; i < attachmentElem.files.length; i++) {
						// listFiles[i]  = '<div><a href="'+attachmentElem.value+'"><img src="'+attachmentElem.value+'"/>'+attachmentElem.files[i].name+'</a><button>delete</button></div>'; 
						listFiles[i] = '<div>' + attachmentElem.files[i].name.toLowerCase() + '</div>';

					}
					the_return.html(listFiles.join(""));
				}
			}

		}
		else {
			alert("Please upgrade your browser, because your current browser lacks some new features we need!");
			return false;
		}
		return this;
	},
	upload: function (attachmentElem, data, callBack) {

		//Getting Files Collection
		var files = attachmentElem;

		if (files.length > 0) {
			//Declaring new Form Data Instance  
			var formData = new FormData();

			//Looping through uploaded files collection in case there is a Multi File Upload. This also works for single i.e simply remove MULTIPLE attribute from file control in HTML.  
			for (var i = 0; i < files.length; i++) {
				formData.append("attachment-" + i, files[i]);
			}

			//Looping paramater data
			for (var key in data) {
				formData.append(key, data[key]);
			}

			$.ajax({
				type: 'POST',
				url: assets + 'php/uploadAttachment.php',
				data: formData,
				async: false,
				cache: false,
				contentType: false,
				processData: false,
				dataType: "json",
				success: function (data, xhr, status) {
					callBack && callBack(data); //if callback exist execute it.
				}

			});
			return true;
		}
		callBack && callBack({ attachment_status: "true", attachment_message: "", attachment_uploaded: "" }); //if callback exist execute it.
		return this;
	},
	downloadZip: function () {
		var dirname = $(".hdnAttachmentName").val() || '';
		if (dirname != '') {
			$.ajax({
				url: assets + 'php/downloadAttachment.php',
				type: 'GET',
				data: { download: 1, dir_name: dirname, action: 'zip' },
				success: function (response) {
					window.location = response;
				}
			});
		}
		else {
			alert("No file uploaded.");
		}

		return this;
	},
	listFiles: function (dir_name, elem) {
		var dirname = dir_name || '';
		var list = [];
		if (dirname != '') {
			$.ajax({
				url: assets + 'php/downloadAttachment.php',
				type: 'GET',
				data: { dir_name: dirname, action: 'list-files' },
				success: function (data) {
					list.push("<ul class='block'>");
					for (var key in data) {
						list.push("<li><a href=assets/php/downloadAttachment.php?action=file&dir_name=" + dir_name + "&file_name=" + data[key] + ">" + data[key] + "</a></li>");
					}
					list.push("</ul>");
					$(elem).html(list.join(""));
				},
				error: function () { alert('Something went wrong!'); }
			});
		}
		else {
			$(elem).html("<h4 class='text-center'>Nothing file upload.</h4>");
		}

		return this;
	},
	postListFiles: function (dir_name, allowDelete) { // Return elements.
		var dirname = dir_name || '';
		var listFiles = [];
		var empty_message = "<div id='no-file-upload'><p>Nothing file upload.</p></div>";
		if (dirname != '') {

			$.ajax({
				url: assets + 'php/downloadAttachment.php',
				type: 'GET',
				data: { dir_name: dirname, action: 'post-list-files' },
				async: false,
				success: function (data) {
					if (data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							listFiles[i] = '<div><a class="view-file" href="' + data[i].imagepath + '" target="_blank" title="View">' + data[i].imagename + '</a> ' + (allowDelete === true ? '<a onClick=fileUpload.removeFile("' + dir_name + '","' + encodeURIComponent(data[i].imagename) + '",this) class="remove-attachment" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></a>' : "") + ' </div>';
						}
					}
					else { listFiles[0] = empty_message; }
				},
				error: function () { alert('Something went wrong!'); }

			});
		}
		else {
			listFiles[0] = empty_message;
		}
		return listFiles.join("");
	},
	removeFile: function (dir_name, file_name, thisElem) {
		var filename = file_name || '';
		var dirname = dir_name || '';
		if (filename != '' && dirname != '') {
			$.ajax({
				url: assets + 'php/downloadAttachment.php',
				type: 'GET',
				data: { filename: filename, dirname: dirname, action: 'remove-file' },
				async: false,
				success: function (data) {
					if (data[0] == 'success') {
						$(thisElem).closest('div').fadeOut('slow', function () {
							$(this).remove();
						});
					}
				},
				error: function () { alert('Something went wrong!'); }

			});

		} else {
			alert('Unable to remove file.');
		}
		// return false;
	}


};