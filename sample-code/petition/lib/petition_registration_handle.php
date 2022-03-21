<?php
	session_start();
	include_once "db.php";
	include_once "lqc_function.php";

	//$filename = $_FILES['croppedImage']['name']; //get the string "blob"
	$filename1 = trim($_POST['fileName'], '"');
	$pet_title = clean_content(str_replace(['"', '\''], '', $_POST['petTitle']));
	$pet_content = clean_content($_POST['petContent']);
	$pet_target = $_POST['petTarget'];

	//get datetime of HCM city
	date_default_timezone_set("Asia/Ho_Chi_Minh");
	$pet_updatedate = date('Y-m-d', time());
	
	//solve upload duplicate pet_id
	$i = 0;
	$pet_id = generate_id_from_str($pet_title);
	$sql = "SELECT pet_id FROM `table_petitionletter` ORDER BY pet_id ASC";
	$result = mysqli_query($conn, $sql);
	while ($row = mysqli_fetch_array($result)) {
	    while(strcmp($row['pet_id'], $pet_id) == 0){
	    	$i++;
	    	$pet_id .= '_'.$i;
	    	if($i>1) $pet_id = substr($pet_id, 0, -4).'_'.$i;
	    } 
	}

	//solve upload duplicate image
	$j = 0;
	$sql = "SELECT pet_image FROM `table_petitionletter` ORDER BY pet_image ASC";
	$result = mysqli_query($conn, $sql);
	while ($row = mysqli_fetch_array($result)) {
	    while (strcmp($row['pet_image'], $filename1) == 0) {
	        $j++;
	        $filename1 = insert_str($filename1, '_'.$j, -4);
	        if($j>1) $filename1 = substr($filename1, 0, -8).'_'.$j.substr($filename1, -4);
	    }
	}
	
	//upload image
	move_uploaded_file($_FILES['croppedImage']['tmp_name'], '../../upload/images/'.$filename1);

	$userid = $_SESSION['LegalUser']['userid'];
	// insert petition letter into DB
	$sql = "INSERT INTO `table_petitionletter` (`pet_id`, `pet_title`, `pet_image`, `pet_content`, `pet_reportContent`, `pet_updatedate`, `pet_ischecked`, `pet_target`, `pet_countlike`, `pet_countshare`, `pet_countview`, `pet_linkweb`, `pet_linkpage`, `pet_issuccesscheck`, `pet_keywords`, `pet_idlawyersinvolved`, `pet_userid`) VALUES ('$pet_id', '$pet_title', '$filename1', '$pet_content', NULL, '$pet_updatedate', '0', '$pet_target', '0', '0', '0', NULL, NULL, '0', NULL, NULL, '$userid')";

	if (mysqli_query($conn, $sql)) {
		$sql = "SELECT * FROM `table_petitionletter` WHERE pet_id='$pet_id'";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_array($result);
		$_SESSION["LegalRegistration"] = $row;
		echo 'Đăng Ký Thỉnh Nguyện Thư Thành Công';
	}else{
		echo 'Đã có lỗi xảy ra: '.mysqli_error($conn);
	}
?>