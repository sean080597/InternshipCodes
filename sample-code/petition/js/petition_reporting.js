jQuery(document).ready(function($) {
	//constant variable
    var _root_dirname = "legal300";

	getReportContent();
	function getReportContent(){
		var pet_id = getUrlParams('petId', window.location.href);
		$.ajax({
			url: _root_dirname+'/petition/lib/action.php',
			type: 'POST',
			data: {getReportContentRequire:1, petId:pet_id},
			success: function (data) {
				if(data == 0){
					window.location = _root_dirname+"/petition/petition_index.php";
				}else{
					$('div#report_content').html(data);
					setReportImgToCenter();
					setWidthDivHide();
					getRandomPet();
				}
			}
		});
	}

	function setReportImgToCenter(){
		if($('p img').length > 0){
			$('p img').parent().css('text-align', 'center');
		}
	}

	function getRandomPet(){
		$.ajax({
			url: _root_dirname+'/petition/lib/action.php',
			type: 'POST',
			data: {getRandomPetRequire:1},
			success: function (data) {
				$('ul#lst_involve_pet').html(data);
			}
		});
	}

	function setWidthDivHide(){
		var hide_w = $('article.pet_content').outerWidth();
		$('#hide_content').css('width', hide_w);
	}

	function setHideShowDivHide(){
		var sr_height = $(window).height();
		var windowTop = $(window).scrollTop();

		var articleTop = $('article.pet_content').offset().top;
		var articleHeight = $('article.pet_content').height();
		if((sr_height + windowTop) > (articleTop + articleHeight)){
			$('#hide_content').fadeOut(100);
		}else{
			$('#hide_content').fadeIn(100);
		}
	}

	$(window).scroll(function(event) {
		setHideShowDivHide();
	});

	$(window).onload = setHideShowDivHide();
	//============================= Function Lib ==================================================
	//get url parameters value
	function getUrlParams(name,url) {
		if (!url) url = location.href;
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( url );
		return results == null ? null : results[1];
	}

});
