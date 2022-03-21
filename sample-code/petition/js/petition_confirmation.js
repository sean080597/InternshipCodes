$(document).ready(function($) {
    //constant variable
    var _root_dirname = "legal300";

    GetInfoPetition();
    //load image after successful registration
    function GetInfoPetition(){
        //var img = document.getElementById("#img_pet_letter");
        $.ajax({
            url: _root_dirname+'/petition/lib/action.php',
            type: 'POST',
            data: {getImgRequire: 1},
            success: function(data){
                $(".petition_preview").html(data);
            }
        });
        
    }

});