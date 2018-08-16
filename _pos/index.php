<?php
session_start();
include "./api/config.php";

// Check user login or not
if(!isset($_SESSION['username'])){
    header('Location: ./www/login.html');
}else{
	header('Location: ./www/index.html');
}

// logout
if(isset($_POST['but_logout'])){
    session_destroy();
    header('Location: ./api/out_session.php');
}
?>