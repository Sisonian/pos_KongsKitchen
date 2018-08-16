<?php  
session_start();
	spl_autoload_register(function($className){
		$path = strtolower($className) . ".php";
		// print_r($path);
		if (file_exists($path)) {
			require_once($path);
		} else {
			echo "File ".$path." is not found";
		}
	});
?>