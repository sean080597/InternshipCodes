<?php
	$servername = "localhost";
	$username = "root";
	$password = "";
	$database = "legal300";

	$conn = mysqli_connect($servername, $username, $password) or die("Could not connect DB");
	mysqli_select_db($conn, $database) or die("Could not find db!");
	mysqli_set_charset($conn, "utf8");
	if (mysqli_connect_errno()) {
		echo "Failed to connect MySQL".mysqli_connect_error();
	}
?>