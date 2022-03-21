$(document).ready(function() {
	//constant variable
    var _root_dirname = "legal300";
	
	var cropper;
	var filename;

	$("#dragandrophandler").click(function() {
		$("#fileBrowser").click();
	});

	$("#fileBrowser").change(function(e) {
		e.preventDefault();
		var image = document.getElementById("cropbox");
		var files = $(this)[0].files;//difference between click choose file and drag & drop
		var file = files[0];//get first file - here is an image
		filename = file.name;//to use for submit form, so set it to global
		
		var filetype = file.type;
		if (filetype == "image/jpeg" || filetype == "image/jpg" || filetype == "image/png"){
			var filesize = file.size;
			//max file size is 2MB = 2097152 byte
			if(filesize < 2097153){
				$("#cropbox").attr("src", window.URL.createObjectURL(file));//set image for cropbox

				$("#show_drop_image").show();
				$("#upload_drop_image").hide();

				//use for submit form, so it has to be global
				cropper = new Cropper(image, {
					aspectRatio: 16/9
				});
				cropper.crop();
			}else{
				$("#fileBrowser").val(null);
				alert("Chọn Ảnh Tối Đa là 2Mb");
			}
		}else{
			$("#fileBrowser").val(null);
			alert("Vui Lòng Chọn Kiểu Ảnh là PNG, JPG, JPEG");
		}

	});

	var dropzone = document.getElementById('dragandrophandler');
	dropzone.ondragover = function(){
		$(this).addClass('dropzone');
		return false;
	}

	dropzone.ondragleave = function(){
		$(this).removeClass('dropzone');
		return false;
	}

	dropzone.ondrop = function(e){
		e.preventDefault();
		$(this).removeClass('dropzone');

	 	var image = document.getElementById("cropbox");
		var files = e.dataTransfer.files;//difference between click choose file and drag & drop
		var file = files[0];//get first file - here is an image
		filename = file.name;//to use for submit form, so set it to global
		$("#cropbox").attr("src", window.URL.createObjectURL(file));//set image for cropbox

		$("#show_drop_image").show();
		$("#upload_drop_image").hide();

		//use for submit form, so it has to be global
		cropper = new Cropper(image, {
			aspectRatio: 16/9
		});
		cropper.crop();
	}

	//close button handler
	var cancel_btn = document.getElementById("btn_cancel");
	cancel_btn.onmouseover = function(){
		$(this).css('cursor', 'pointer');
	}

	cancel_btn.onclick = function(){
		$("#show_drop_image").hide();
		$("#upload_drop_image").show();
		//reset cropper to upload second picture
		document.getElementById("cropbox").cropper.destroy();
		$("#fileBrowser").val(null);
	}

	function checkvalidform(petition_title, petition_target, petition_content, issetimage){
		if(petition_title == "" || petition_title == null){
			var par = $('input#QuestionnaireForm_title').parent();
			$(par).find('div.errorMessage').html("Vui lòng nhập tiêu đề!");
			$(par).find('div.errorMessage').css('display', 'block');
			return false;
		}else{
			var par = $('input#QuestionnaireForm_title').parent();
			$(par).find('div.errorMessage').css('display', 'none');
		}

		if(petition_target == "" || petition_target == null){
			var par = $('input#QuestionnaireForm_target').parent().next();
			$(par).find('div.errorMessage').html("Vui lòng nhập mục tiêu!");
			$(par).find('div.errorMessage').css('display', 'block');
			return false;
		}else{
			var par = $('input#QuestionnaireForm_target').parent();
			$(par).find('div.errorMessage').css('display', 'none');
		}

		if(petition_content == "" || petition_content == null){
			var par = $('#petition_content').parent();
			$(par).find('div.errorMessage').html("Vui lòng nhập nội dung!");
			$(par).find('div.errorMessage').css('display', 'block');
			return false;
		}else{
			var par = $('#petition_content').parent();
			$(par).find('div.errorMessage').css('display', 'none');
		}

		if(issetimage == "" || issetimage == null){
			var par = $('div#upload_drop_image').parent();
			$(par).find('div.errorMessage').html("Vui lòng chọn một ảnh!");
			$(par).find('div.errorMessage').css('display', 'block');
			return false;
		}else{
			var par = $('div#upload_drop_image').parent();
			$(par).find('div.errorMessage').css('display', 'none');
		}

		return true;
	}

	$("body").delegate('#Questionnaire_form', 'submit', function() {
		var pet_title = $("#QuestionnaireForm_title").val();
		var pet_target = $("#QuestionnaireForm_target").val();
		var pet_content = tinymce.get("petition_content").getContent();
		pet_content = pet_content.replace(/<\/?[^>]+(>|$)/g, "");
		var issetimage = $("#cropbox").attr('src');
		if(!checkvalidform(pet_title, pet_target, pet_content, issetimage)){
			return false;
		}else{
			cropper.getCroppedCanvas().toBlob(function(blob){
				var formData = new FormData();
				formData.append('croppedImage', blob);
				formData.append('fileName', filename);
				formData.append('petTitle', JSON.stringify(pet_title));
				formData.append('petContent', pet_content);
				formData.append('petTarget', pet_target);
				$.ajax({
					url: _root_dirname+'/petition/lib/petition_registration_handle.php',
					type:"POST",
					data: formData,
					processData:false,
					contentType:false,
					success:function(data){
						alert(data);
						window.location = _root_dirname+'/petition/petition_confirmation.php';
					},
					error:function(err){

					}
				});
			});
		}
		return false;
	});

});