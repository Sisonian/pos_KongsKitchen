<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
// session_start();
// $_SESSION['login_user'] = 'sisonians';
// $_SESSION['table_number'] = 10;
class Api {
	private $dbConn;
	public function __construct(){
		$db = new DbConnect;
		$this->dbConn = $db->connect();
	}
	public function getAllItems() {
		$sql = "SELECT * FROM tblproducts";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function getOrderCount() {
		$sql = "SELECT COUNT(*) AS orderCount FROM tblrecords WHERE fldStatus = 'Pending'";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function getProductCount() {
		$sql = "SELECT COUNT(*) AS productCount FROM tblproducts WHERE fldFoodQty > 0";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function getAllCategory() {
		$sql = "SELECT DISTINCT(fldcategory) FROM tblproducts";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function getItemByCategory($category) {
		$sql = "SELECT * FROM tblproducts WHERE fldcategory = '" . $category . "' and fldFoodQty > 0";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function addToCart($id, $name, $price, $qty) {
		$tprice = $qty * $price; 
		$count = $id;
		$item_array = array(  
		    'item_id' => $id,  
		    'item_name' => $name,  
		    'item_price' => $price,   
		    'item_quantity' => $qty,
		    'item_tprice' => number_format($tprice,2)
		);  
		$_SESSION["shopping_cart"][$count] = $item_array; 
	}
	public function emptyCart() {
		unset($_SESSION["shopping_cart"]);
	}
	public function removeItem($id) {
		$item = $id;
		unset($_SESSION["shopping_cart"][$item]);
	}
	public function updateCart($id, $name, $price, $qty) {
		$count = $id;
	    $item_array = array(  
		        'item_id' => $id,  
		        'item_name' => $name,  
		        'item_price' => $price,   
		        'item_quantity' => $qty  
		     );  
		$_SESSION["shopping_cart"][$count] = $item_array;  
	}
	public function viewCart() {
		$data = array();
		foreach($_SESSION["shopping_cart"] as $keys => $values){
		    array_push($data, $values);
		}  
		echo json_encode($data);
	}
	public function cashOut($employee, $actionn, $tablenumberr) {
		$transactNo = mt_rand(100000, 999999);
		$tprice = 0;
		foreach($_SESSION["shopping_cart"] as $keys => $values){
		    $id = $_SESSION["shopping_cart"][$keys]["item_id"];
		    $in =  $_SESSION["shopping_cart"][$keys]["item_name"];
		    $ip = $_SESSION["shopping_cart"][$keys]["item_price"];
		    $iq = $_SESSION["shopping_cart"][$keys]["item_quantity"];
		    $ipq = $ip * $iq;
		    $it = $_SESSION["shopping_cart"][$keys]["item_tprice"];
			$sql = "INSERT INTO tblsingletransact (fldTransactID, fldProductName, fldPrice, fldQty, fldDiscount) VALUES ('$transactNo', '$in', '$ip', '$iq', '0')";
			$this->dbConn->query($sql);
			$tprice = $tprice + $ipq;
			// update quantity
			$extract_qty = "SELECT fldFoodQty FROM tblproducts WHERE fldFoodID = '$id'";
		    $extracted_qty = $this->dbConn->query($extract_qty);
		    $fetch_qty = $extracted_qty->fetch_assoc();
		    $qty = $fetch_qty['fldFoodQty'];
		    $actual_qty = $qty - $iq;
		    $update_qty = "UPDATE tblproducts SET fldFoodQty = '$actual_qty' WHERE fldFoodID = '$id'";
		    $this->dbConn->query($update_qty);
		}
		$action = $actionn;
		$employeeuname = $employee;
		$employeedetails = "SELECT fldLogNo, fldEmployeeNo, fldEmployeeFname FROM tblemployeelog WHERE fldEmployeeFname = '".$employeeuname."' ORDER BY fldLogNo DESC LIMIT 1";
		$resulta = $this->dbConn->query($employeedetails);
		$rows=$resulta->fetch_assoc();
		$employeeID = $rows['fldEmployeeNo'];
		$employeesalessql = "SELECT fldLogNo, fldEmployeeSales FROM tblemployeelog WHERE fldEmployeeFname = '".$employeeuname."' ORDER BY fldLogNo DESC LIMIT 1"; 
		$salesresult = $this->dbConn->query($employeesalessql);
		$salesrows=$salesresult->fetch_assoc();
		$sales = $salesrows['fldEmployeeSales'] + $tprice;
		$logno = $salesrows['fldLogNo'];
		$employeesales = "UPDATE tblemployeelog SET fldEmployeeSales = $sales WHERE fldLogNo = $logno";
		$salesresult2 = $this->dbConn->query($employeesales);
		$tablenumber = $tablenumberr;
		$sql = "INSERT INTO tblrecords (fldTransactID, fldEmployeeID, fldTotal, fldDate, fldTax, fldRemarks, fldStatus, fldTable) VALUES ('$transactNo', '$employeeID', '$tprice', NOW(), '11.22', '$action', 'Pending', '$tablenumber')";
		$this->dbConn->query($sql);
	}
	public function pendingOrders() {
		$sql = "SELECT * FROM tblrecords WHERE fldStatus='Pending'";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function pendingOrderVal($transactNo) {
		$sql = "SELECT transact.fldTransactID, transact.fldDate, orders.fldProductName, orders.fldQty FROM tblrecords as transact INNER JOIN tblsingletransact as orders ON orders.fldTransactID = transact.fldTransactID WHERE orders.fldTransactID = '$transactNo'";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function serveOrder($transactNo) {
		$sql = "UPDATE tblrecords set fldStatus ='Done' WHERE fldTransactID = '$transactNo'";
		$result = $this->dbConn->query($sql);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);
	}
	public function logOut($employee){
		$employeeuname = $employee;
		$employeedetails = "SELECT fldLogNo FROM tblemployeelog WHERE fldEmployeeFname = '".$employeeuname."' ORDER BY fldLogNo DESC LIMIT 1";
		$resulta = $this->dbConn->query($employeedetails);
		$rows=$resulta->fetch_assoc();
		$logno = $rows['fldLogNo'];
		$employee = "UPDATE tblemployeelog SET fldEmployeeLogOutTime = NOW() WHERE fldLogNo = $logno";
		$salesresult2 = $this->dbConn->query($employee);
		echo $logno;
	}
	public function getTable(){
		$table = "SELECT * FROM tblstoretables";
		$result = $this->dbConn->query($table);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);	
    }
	public function getTableNumber($code){
		$table = "SELECT * FROM tblstoretables WHERE fldTableCode = '".$code."'";
		$result = $this->dbConn->query($table);
		$data = [];
    	while($rows = $result->fetch_assoc()){
            array_push($data, $rows);
    	}
    	echo json_encode($data);	
    }
    public function postDiscount($name, $number, $type, $amount) {
		$sql = "INSERT INTO tbldiscounts (fldCustomerName, fldCustomerId, fldDiscountType, fldDiscountedPrice, fldDate) VALUES ('$name', '$number', '$type', '$amount', NOW())";
		$this->dbConn->query($sql);
    }
}
?>