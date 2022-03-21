jQuery(document).ready(function($) {
	//constant variable
    var _root_dirname = "legal300";
	
	(function(document) {
	   var shareButtons = document.querySelectorAll(".st-custom-button[data-network]");
	   for(var i = 0; i < shareButtons.length; i++) {
	      var shareButton = shareButtons[i];
	      
	      shareButton.addEventListener("click", function(e) {
	         var elm = e.target;
	         var network = elm.dataset.network;
	         
	         console.log("share click: " + network);
	      });
	   }
	})(document);

	//get url parameters value
	function getUrlParams( name, url ) {
		if (!url) url = location.href;
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results == null ? null : results[1];
	}

	$('body').delegate('form#form_comment', 'submit', function(event) {
		var contents = $("#txtareaCmt").val();
		if(contents == null || contents == ""){
			alert("Vui lòng nhập nội dung bình luận!");
			return false;
		}
		var last_reply_tag = $('li.cmt_reply').last().attr('href');
		var last_reply_count = last_reply_tag.substring(last_reply_tag.length - 1);

		var par = $(this).parent().parent();
		var txtareacmt = $(this).find('textarea');

		var pet_id = getUrlParams('petId', window.location.href);
		$.ajax({
			url: _root_dirname+'/petition/lib/action.php',
			type: 'POST',
			data: {formCommentSubmit:1, cmt_contents:contents, petId:pet_id, lastReplyCount:last_reply_count},
			success:function(data){
				$(txtareacmt).val(null);
				$(par).after(data);
				//setCountCmt();
			}
		});
		return false;
	});

	//signature handle
	$('body').delegate('button#sign_now', 'click', function(event) {
		var contents = $("#txterea_comments").val();
		var pet_id = getUrlParams('petId', window.location.href);
		if(contents == null || contents == ""){
			$.ajax({
				url: _root_dirname+'/petition/lib/action.php',
				type: 'POST',
				data: {signPetition:1, petId:pet_id},
				success:function(data){
					if (data != null && data != "") {alert(data);}
					location.reload();
					redirectPetition();
				}
			});
		}else{
			$.ajax({
				url: _root_dirname+'/petition/lib/action.php',
				type: 'POST',
				data: {signPetition:1, cmt_contents:contents, petId:pet_id},
				success:function(data){
					if (data != null && data != "") {alert(data);}
					location.reload();
					redirectPetition();
				}
			});
		}
	});

	//reply comments handle
	$('body').delegate('li.reply', 'click', function(event) {
		//get user_image to assign to comment reply
		var userImg = $("div.avatar_add_cmt_main").css("background-image");
		userImg = userImg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
		//get parent of this to find collapsed reply
		var par_li = $(this).parent();

		var par = $(this).parent().parent().parent().parent();
		var cmtId = $(par).attr('cmtId');
		if($(par).next('div.comment_wrap_reply').length < 1){
			if($("div.comment_wrap_reply").length > 0){
				$("div.comment_wrap_reply").remove();
			}
			if(!$(par_li).find('li.cmt_reply').hasClass('collapsed')){
				$(par_li).find('li.cmt_reply').addClass('collapsed');
				var hr = "div" + $(par_li).find('li.cmt_reply').attr('href');
				$(hr).removeClass('in');
				$(hr).addClass('collapse');
			}
			$.ajax({
	            url: _root_dirname+'/petition/lib/action.php',
	            method: 'POST',
	            data: {addCommentReplyTextarea:1, user_image:userImg, cmt_id:cmtId},
	            success: function (data) {
	                $(par).after(data);
	            }
	        });
		}else if($(par).next('div.comment_wrap_reply').length > 0){
			$(par).next('div.comment_wrap_reply').remove();
		}
	});

	$('body').delegate('li.cmt_reply', 'click', function() {
		if($("div.comment_wrap_reply").length > 0){
			$("div.comment_wrap_reply").remove();
		}
	});

	//add comment reply
	$('body').delegate('form#form_comment_reply', 'submit', function() {
		var rep_contents = $("#txtareaCmtReply").val();
		var cmtId = $(this).attr('cmtId');
		var par = $(this).parent().parent();
		var pre = $(par).prev();
		var nex = $(par).next("div.comment_wrap_reply");

		var hre = $(pre).find('li.cmt_reply').attr('href');
		var collapse_id = hre.substring(hre.length - 1);

		$.ajax({
			url: _root_dirname+'/petition/lib/action.php',
            method: 'POST',
            data: {addCommentReplyRequire:1, repContents:rep_contents, cmt_id:cmtId, collapseId:collapse_id},
            success: function (data) {
            	$(nex).remove();
				$(pre).after(data);
				$(par).remove();

				$.ajax({
		            url: _root_dirname+'/petition/lib/action.php',
		            method: 'POST',
		            data: {updateCountCmtReply:1, cmt_id:cmtId},
		            success: function (data) {
		                $(pre).find('li.cmt_reply').html(data);
		            }
		        });
            }
		});
		return false;
	});

	//load more contents of comments
	$('.comment-block p').collapser({
	    mode: 'words',
	    truncate: 20,
	    showText: 'Đọc thêm',
        hideText: 'Thu gọn'
	});

	//load more comments
	// $('body').delegate('a.load_more', 'click', function() {
	// 	var las = $('li.cmt_reply:last');
	// 	$(las).collapser({
	// 		mode: 'block',
	// 		target: 'next'
	// 	});
	// });

	//set count show comments to load more
	// setCountCmt();
	// function setCountCmt(){
	// 	var fir = $('li.cmt_reply:first').attr('href');
	// 	fir = fir.substring(fir.length - 1);
	// 	var las = $('li.cmt_reply:last').attr('href');
	// 	las = las.substring(las.length - 1);
	// 	var m = Math.max(fir, las);
	// 	$('a.load_more').attr('count_show_cmts', m);
	// 	$.ajax({
 //            url: _root_dirname+'/petition/lib/action.php',
 //            method: 'POST',
 //            data: {showHideSeeMoreBtn:1, countCmt:m},
 //            success: function (data) {
 //                //$('a.load_more').css('display', data);
 //                //alert(data);
 //            }
 //        });
	// }

	redirectPetition();
	//redirect petition to reporting petition when full of signature
	function redirectPetition(){
		var pet_id = getUrlParams('petId', window.location.href);
		$.ajax({
           url: _root_dirname+'/petition/lib/action.php',
           method: 'POST',
           data: {redirectRequire:1, petId:pet_id},
           success: function (data) {
               if(data==1){
               		window.location = "/petition/petition_reporting.php?petId="+pet_id;
               }
           }
       });
	}

	//making sidebar_wrapper fix when scroll
	fixWhenScroll();
	function fixWhenScroll() {
		if (matchMedia('all and (orientation:landscape)').matches) {
			if($('.sidebar_wrapper').length){
				var el = $('.sidebar_wrapper');
				var stickyTop = el.offset().top;
				var stickyHeight = el.height();

				var origin_width = $('aside.col-md-4').width();
				el.css('width', origin_width);

				$(window).scroll(function() {
					var tagLimit = $('.middle_content');
					var limit = tagLimit.offset().top + tagLimit.height() - $('.sidebar_wrapper').height();
					var windowTop = $(window).scrollTop();
					
					if(stickyTop < windowTop){
						el.css({
							position:'fixed',
							width:origin_width,
							top:0
						});
					}else{
						el.css({
							position:'static',
							width:origin_width
						});
					}

					if(limit < windowTop){
						var diff = limit - windowTop;
						el.css('top', diff);
					}
				});
			}
		}
		if (matchMedia('only screen and (max-width: 480px)').matches) {
		  	return;
		}
	}

	$(window).on('resize', function(){
		fixWhenScroll();
	});
	//=========================================================================
	checkIfLawyer();
	//checking if user is a lawyer
	function checkIfLawyer(){
		var pet_id = getUrlParams('petId', window.location.href);
		$.ajax({
           url: _root_dirname+'/petition/lib/action.php',
           method: 'POST',
           data: {checkLawyerRequire:1, petId:pet_id},
           success: function (data) {
               if(data!=null && data!=""){
               		$('div.sign_form').after(data);
               }
           }
       });
	}

	//button confirm agree the lawsuit
	$('#btn_confirm_agree').on('click', function(event) {
		event.preventDefault();
		var pet_id = getUrlParams('petId', window.location.href);
		$.ajax({
           url: _root_dirname+'/petition/lib/action.php',
           method: 'POST',
           data: {agreeTheLawsuitRequire:1, petId:pet_id},
           success: function (data) {
               if(data!=null && data!=""){
               		$('div.agree_lawsuit').remove();
               		$('div.sign_form').after(data);
               }
           }
       });
	});

});