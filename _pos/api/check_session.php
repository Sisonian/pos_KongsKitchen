<?php 
session_start();
if (isset($_SESSION['username'])) {
	$username = $_SESSION['username'];
	$userid = $_SESSION['userid'];
	$fname = $_SESSION['userfname'];
	$lname = $_SESSION['userlname'];
	$data = array('response' => 'true','username' => $username,'userid' => $userid,'fname' => $fname,'lname' => $lname );
	echo json_encode($data);
}else{
	echo json_encode('false');
 }
 ?>
