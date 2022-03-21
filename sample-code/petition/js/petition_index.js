jQuery(document).ready(function($) {
	//constant variable
    var _root_dirname = "legal300";
	
	$("body").delegate('#share_button', 'click', function() {
		var parent = $(this).parent().parent();
		var hreflink = parent.find('a#petition_title').attr('href');
		var link = "https://www.facebook.com/sharer/sharer.php?u=" + hreflink;
		MyPopUpShareWindow(link, 600, 650);
		return false;
	});
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

	getListAllPetition();
	//get list petition and show in index
	function getListAllPetition(){
		$.ajax({
			url: _root_dirname+'/petition/lib/action.php',
			type: 'POST',
			data: {lstAllPetition:1},
			success:function(data){
				$("#my_petition_list").html(data);
			}
		});
	}

	//filter petition letters
	$('body').delegate('input.txtSearch', 'keyup', function(event) {
		var title = $(this).val();
		$.ajax({
			url: _root_dirname+'/petition/lib/action.php',
			type: 'POST',
			data: {filterPetitionTitle:1, petTitle:title},
			success:function(data){
				$("#my_petition_list").html(data);
			}
		});
	});

	runCollectSigned();
	//show all collected signed
	function runCollectSigned(){
		var span = $("div#count_all_signed").find('span.all_signed');
		setInterval(function(){
			$.ajax({
				url: _root_dirname+'/petition/lib/action.php',
				type: 'POST',
				data: {countAllSigned:1},
				success:function(data){
					$(span).html(accounting.formatMoney(data, "", 0, ",", "."));
				}
			});
		}, 1000);
	}

});