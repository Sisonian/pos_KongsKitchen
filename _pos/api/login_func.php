<?php
session_start();
require_once 'config.php';
date_default_timezone_set('Asia/Kuala_Lumpur');
$timezone = date_default_timezone_get();
$date = date('F d, Y h:i A', time());

	$username = mysqli_real_escape_string($conn, $_POST['username1']);
	$password = mysqli_real_escape_string($conn, $_POST['password1']);

	//CHANGE THIS PART OF $sql :: WHERE tblemployees.fldModuleID = '<YOUR MODULE ID BASED ON tblmodule>'
	
	$sql = "SELECT tblemployees.fldUsername, tblemployees.fldEmployeeID, tblemployees.fldPassword, tblemployees.fldPicPath, tblemployees.fldFname, tblemployees.fldLname, tblemployees.fldMname FROM tblemployees WHERE tblemployees.fldModuleID = '3' AND tblemployees.fldUsername = '".$username."'";
	$query = $conn -> query($sql);
	$count = mysqli_num_rows($query);
	if($count == 1){
		$rows = mysqli_fetch_assoc($query);
		$password2 = $rows['fldPassword'];
		//SET SESSION
		$_SESSION['userid'] = $rows['fldEmployeeID'];
		$_SESSION['username'] = $rows['fldUsername'];
		$_SESSION['userpic'] = $rows['fldPicPath'];
		$_SESSION['userfname'] = $rows['fldFname'];
		$_SESSION['userlname'] = $rows['fldLname'];
		$_SESSION['usermname'] = $rows['fldMname'];

		$who = $_SESSION['username'];
		$id = $_SESSION['userid'];
		$hash = crypt($password, $password2);
		if($hash == $password2){
			$sql2 = "INSERT INTO tblemployeelog(fldEmployeeNo, fldEmployeeFName,fldEmployeeLogInDate, fldEmployeeLogInTime) VALUES (".$id.",'".$who."',NOW(),NOW())";	
			if($conn -> query($sql2)){
				echo "true";
			}
		}
		else{
				echo "false";
		}
	}
	else{
		echo "false";
	}
?>