<?php
class DbConnect {
	private $servername	= "localhost";
	private $username	= "root";
	private $password	= "";
	private $dbName		= "db_kongs";

	public function connect() {
		$connect = mysqli_connect($this->servername, $this->username, $this->password, $this->dbName);
		return $connect;
	}
}
?>