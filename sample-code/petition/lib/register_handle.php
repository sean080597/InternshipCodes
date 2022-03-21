<?php
	session_start();
	include_once "db.php";
	include_once "lqc_function.php";

	$name = protectInput($_POST['name'], $conn);
	$username = protectInput($_POST['username'], $conn);
	$address = protectInput($_POST['address'], $conn);
	$email = protectInput($_POST['email'], $conn);
	$password = protectInput($_POST['password'], $conn);
	$telephone = protectInput($_POST['telephone'], $conn);
	$sex = protectInput($_POST['user_sex'], $conn);

	$image = $_POST['profile_image'];
	if($image == null){
		$image = "default_avatar.jpg";
	}

	date_default_timezone_set("Asia/Ho_Chi_Minh");
	$birthdate = date('Y-m-d', strtotime($_POST['birthDate']));

	//insert into table UserTemp
	$password = hashword($password, $salt);
							
	$sql = "INSERT INTO table_usertemp(`id`, `username`, `password`, `ten`, `dienthoai`, `email`, `diachi`, `sex`, `ngaysinh`, `user_image`, `congty`, `country`, `city`, `role`, `activation`) VALUES (NULL, '".encrypt($username, $key)."', '".$password."', '".encrypt($name, $key)."', '".encrypt($telephone, $key)."', '".encrypt($email, $key)."', '".encrypt($address, $key)."', '$sex', '$birthdate', '$image', '', '', '', '2', '')";
	if (mysqli_query($conn, $sql)) {
		header("location:../login.php");
	}else{
		echo 'Đã có lỗi xảy ra '.mysqli_error($conn);
	}
?>