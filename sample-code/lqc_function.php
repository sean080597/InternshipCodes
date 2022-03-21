<?php
	//function Protect Input string
	function protectInput($string, $connect){
		$string = mysqli_real_escape_string($connect, trim(strip_tags(addslashes($string))));
		return $string;
	}

	//insert a character or str to a position in a string
	function insert_str($str,$insertstr,$pos)
	{
	    $str = substr($str, 0, $pos) . $insertstr . substr($str, $pos);
	    return $str;
	}

	function clean_content($content){
		return str_replace([':', '#', '\\', '/', '*', '+', '='], '', strip_tags(htmlspecialchars_decode($content)));
	}
	
	//Must create salt, key word to use some below functions
	$key = md5('vietnam');
	$salt = md5('vietnam');
	
	//Encrypt string
	function encrypt($string, $key){
		$string = rtrim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $string, MCRYPT_MODE_ECB)));
		return $string;
	}
	
	//Decrypt string
	function decrypt($string, $key){
		$string = rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, base64_decode($string), MCRYPT_MODE_ECB));
		return $string;
	}
	
	//Hash Word
	function hashword($string, $salt){
		$string = crypt($string, '$1$'.$salt.'$');
		return $string;
	}
	
	//convert vietnamese to non signed
	function convert_non_signed_vi($str) {
	    $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", "a", $str);
	    $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", "e", $str);
	    $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", "i", $str);
	    $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", "o", $str);
	    $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", "u", $str);
	    $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", "y", $str);
	    $str = preg_replace("/(đ)/", "d", $str);
	    $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", "A", $str);
	    $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", "E", $str);
	    $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", "I", $str);
	    $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", "O", $str);
	    $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", "U", $str);
	    $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", "Y", $str);
	    $str = preg_replace("/(Đ)/", "D", $str);
	    return $str;
	}

	//generate id from title string
	function generate_id_from_str($str_title){
		$str_title = str_replace(' ', '_', convert_non_signed_vi($str_title));

		if(strlen($str_title) > 50)
			$str_title = substr($pet_title, 0, 50);
		//get the first element and start concat str from the second element
		$str_id = explode('_', $str_title)[0];
		foreach (array_slice(explode('_', $str_title), 1) as $value) {
			if(strlen($value) > 3)
				$str_id .= '_'.substr($value, 0, 3);
			else
				$str_id .= '_'.$value;
		}
		return $str_id;
	}

	//format image size to KB, MB, GB
	function format_bytes_unit($bytes) {
		$precision = 2;
	    $unit = ["B", "KB", "MB", "GB"];
	    $exp = floor(log($bytes, 1024)) | 0;
	    return round($bytes / (pow(1024, $exp)), $precision).$unit[$exp];
	}

	//cut string after a number of words
	function shorten_string($input, $length, $ellipses = true, $strip_html = true)
	{
		//strip tags, if desired
	    if ($strip_html) {
	        $input = strip_tags($input);
	    }
	    //no need to trim, already shorter than trim length
	    if (strlen($input) <= $length) {
	        return $input;
	    }
	    //find last space within length
	    $last_space = strrpos(substr($input, 0, $length), ' ');
	    $trimmed_text = substr($input, 0, $last_space);
	    //add ellipses (...)
	    if ($ellipses) {
	        $trimmed_text .= '...';
	    }
	    return $trimmed_text;
	}

	//upload image in a function
	//1 $source_dir, 2 $target_dir, 3 $new_image_name, 4 $old_image_name, 5 $connection means 1 tmp_name, 2 new path to upload image, 3 name of new image, 4 path of old image to delete, 5 connection DB
	function re_uploaded_image($source_dir, $target_dir, $new_image_name, $old_image_name, $connection){

		//If 0, will OVERWRITE the existing file
		define('RENAME_F', 1);

		$re = '';//init response msg
		if(strlen($new_image_name) > 1){
			define('F_NAME', preg_replace('/\.(.+?)$/i', '', str_replace(' ', '_', $new_image_name)));//get file name without extension and replace space character to underscore character

			//get protocol and host name to send the absolute image path to CKEditor
			$site = '';
			$sepext = explode('.', strtolower($new_image_name)); //seperate name by '.' into 2 parts name '.' extension
			$type = end($sepext); //gets extension
			$target_dir = '/'.trim($target_dir, '/').'/';

			//set filename; if file exists, and RENAME_F is 1, set "img_name_I"
			//$p = dir-path, $fn = filename to check, $ex = extension, $i = index to rename
			function setFName($p, $fn, $ex, $i){
				if(RENAME_F == 1 && file_exists($p.$fn.$ex)) return setFName($p, F_NAME.'_'.($i + 1), $ex, ($i + 1));
				else return $fn.$ex;
			}

			//generate name and upload path
			$f_name = setFName($_SERVER['DOCUMENT_ROOT'].$target_dir, F_NAME, ".$type", 0);
			$upload_path = $_SERVER['DOCUMENT_ROOT'].$target_dir.$f_name; //full file path

			//if no errors, upload the image, else, output the errors
			if($re == ''){
				if(!move_uploaded_file($source_dir, $upload_path)){
					$re = 'Error: '.mysqli_error($connection);
				}else unlink($_SERVER['DOCUMENT_ROOT'].$target_dir.$old_image_name);//delete old images
			}
			return $re;
		}
	}

?>