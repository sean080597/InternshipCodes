$(document).ready(function() {
	//constant variable
    var _root_dirname = "legal300";

	$('#confirm_password').on('keyup', function () {
		if ($('#password').val() == $('#confirm_password').val()) {
			$('#message').html('Mật Khẩu Hợp Lệ').css('color', 'green');
		} else 
			$('#message').html('Không Khớp Mật Khẩu').css('color', 'red');
	});

	$("#profile_image").change(function(event) {
		event.preventDefault();
		if($("#profile_image").val().length > 0){
			var image = document.getElementById("show_profile_image");
			var files = $(this)[0].files;
			var file = files[0];//get first file - here is an image
			var filename = file.name;//to use for submit form, so set it to global

			var filetype = file.type;
			if (filetype == "image/jpeg" || filetype == "image/jpg" || filetype == "image/png"){
				var filesize = file.size;
				//max file size is 2MB = 2097152
				if(filesize < 2097153){
					$("#show_profile_image").attr("src", window.URL.createObjectURL(file));//set image for show_profile_image
				}else{
					$("#show_profile_image").attr("src", _root_dirname+"/upload/imagesuser/default_avatar.jpg");
					$("#profile_image").val("default_avatar.jpg");
					alert("Chọn Ảnh Tối Đa là 2Mb");
				}
			}else{
				$("#show_profile_image").attr("src", _root_dirname+"/upload/imagesuser/default_avatar.jpg");
				$("#profile_image").val("default_avatar.jpg");
				alert("Vui Lòng Chọn Kiểu Ảnh là PNG, JPG, JPEG");
			}
		}else{
			$("#show_profile_image").attr("src", _root_dirname+"/upload/imagesuser/default_avatar.jpg");
		}
	});

});
