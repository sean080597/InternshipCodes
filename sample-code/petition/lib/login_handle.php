<?php
	session_start();
	include "db.php";
	include_once "lqc_function.php";

	//get from form login
	$username = protectInput($_POST['username'], $conn);
	$password = protectInput($_POST['password'], $conn);

	$sql = "SELECT * FROM table_usertemp WHERE username='".encrypt($username, $key)."' AND password='".hashword($password, $salt)."'";
	$run = mysqli_query($conn, $sql);
	if (mysqli_num_rows($run) > 0) {
		$row = mysqli_fetch_array($run);
		$arr = array('fullname' => decrypt($row['ten'], $key), 'userid' => $row['id'], 'roleid' => $row['role']);
		$_SESSION["LegalUser"] = $arr;
		echo '<script type="text/javascript">alert("Đăng Nhập Thành Công");</script>';
		header("location:../petition_index.php");
	}else {
		echo '<script type="text/javascript">
			alert("Sai Tên Tài Khoản Hoặc Mật Khẩu");
			window.location = "../login.php";
		</script>';
	}
?>