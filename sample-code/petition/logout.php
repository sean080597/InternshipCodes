<?php
	session_start();
	unset($_SESSION['LegalUser']);
	unset($_SESSION["LegalRegistration"]);
	header("location:login.php");
?>