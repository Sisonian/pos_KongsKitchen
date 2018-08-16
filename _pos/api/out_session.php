<?php 
session_start();
if (session_destroy()) {
	header('Location: ../www/login.html');
}else{
	header('Location: ../www/index.html');
}
 ?>