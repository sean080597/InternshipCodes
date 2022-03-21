$(document).ready(function(){
	//remove html tags
	function removeHtmlTags(string){
		string = string.replace(/<\/?[^>]+(>|$)/g, "");
		return string;
	}
	
	function MyPopUpShareWindow(url, width, height) {
		var leftPosition, topPosition;
		//Allow for borders.
		leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
		//Allow for title and status bars.
		topPosition = (window.screen.height / 2) - ((height / 2) + 50);
		//Open the window.
		window.open(url, "Window2",
		"status=no,height=" + height + ",width=" + width + ",resizable=yes,left="
		+ leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY="
		+ topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no");
	}
	
	//convert unit of file size
	function bytesToSize(bytes) {
	   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	   if (bytes == 0) return '0 Byte';
	   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	};
	
	//get url parameters value
	function getUrlParams( name, url ) {
		if (!url) url = location.href;
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results == null ? null : results[1];
	}
	
    //initial editor and tracking keyup
    function setEditor() {
    	var editor = CKEDITOR.replace('editor_id', {
			height: 400,
			filebrowserUploadUrl:"lib/fileupload.php",
		});
		editor.on( 'contentDom', function() {
			var pet_id = $('#edit_reportContent').attr('petId');
	        var editable = editor.editable();
	        editable.attachListener( editor.document, 'keyup', function() {
	        	var content = CKEDITOR.instances['editor_id'].getData();
	            $.ajax({
					url: './lib/action.php',
					type: 'POST',
					data: {delImgWhenKeyup:1, petId:pet_id, reportContent:content},
					success:function (data) {
						console.log(data);
					}
				});
	        } );
	    } );
	    return false;
    }
	
	//call below code after ajax
	//function for nav-tabs
	function callNavUlLiActive(){
		$('.nav li').click(function(){
			$('.nav li').removeClass('active');
			$(this).addClass("active");
		});
	}
	
	//get last part of current url & get only characters
	function getLastPartUrl(){
		let curUrl = window.location.pathname;
		//get last part
        let lastPart = curUrl.match(/([^\/]*)\/*$/)[1];
		//get only characters
		let str = lastPart.replace(/[0-9]/g, '');
	}
	
});