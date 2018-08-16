<?php 
	require_once('function.php');
	if ($_GET['action']=='getProductCount') {
		$api = new Api;
		$api->getProductCount();
	}
	if ($_GET['action']=='getAllCategory') {
		$api = new Api;
		$api->getAllCategory();
	}
	if ($_GET['action']=='getItemByCategory') {
		$category = $_GET['category'];
		$api = new Api;
		$api->getItemByCategory($category);
	}
	if ($_GET['action']=='addToCart') {
		$id = $_POST['id'];
		$name = $_POST['name'];
		$price = $_POST['price'];
		$quantity = $_POST['quantity'];
		$api = new Api;
		$api->addToCart($id, $name, $price, $quantity);
	}
	if ($_GET['action']=='getTable') {
		$api = new Api;
		$api->getTable();
	}
	if ($_GET['action']=='getTableNumber') {
		$code = $_GET['code'];
		$api = new Api;
		$api->getTableNumber($code);
	}
	if ($_GET['action']=='postDiscount') {
		$name=$_POST['name'];
		$number=$_POST['number'];
		$type=$_POST['type'];
		$amount=$_POST['amount'];
		$api = new Api;
		$api->postDiscount($name, $number, $type, $amount);
	}
	if ($_GET['action']=='updateCart') {
		$id = $_POST['id'];
		$name = $_POST['name'];
		$price = $_POST['price'];
		$quantity = $_POST['quantity'];
		$api = new Api;
		$api->updateCart($id, $name, $price, $quantity);
	}
	if ($_GET['action']=='emptyCart') {
		$api = new Api;
		$api->emptyCart();
	}
	if ($_GET['action']=='viewCart') {
		$api = new Api;
		$api->viewCart();
	}
	if ($_GET['action']=='removeItem') {
		$id = $_POST['id'];
		$api = new Api;
		$api->removeItem($id);
	}
	if ($_GET['action']=='cashOut') {
		$actionn = $_GET['actionn'];
		$employee = $_SESSION['uname'];
		$tablenumber = $_GET['tableNumber'];
		$api = new Api;
		$api->cashOut($employee, $actionn, $tablenumber);
	}
	if ($_GET['action']=='pendingOrders') {
		$api = new Api;
		$api->pendingOrders();
	}
	if ($_GET['action']=='pendingOrderVal') {
		$transactionNo = $_GET['transactNo'];
		$api = new Api;
		$api->pendingOrderVal($transactionNo);
	}
	if ($_GET['action']=='serveOrder') {
		$transactionNo = $_POST['id'];
		$api = new Api;
		$api->serveOrder($transactionNo);
	}
	if ($_GET['action']=='getOrderCount') {
		$api = new Api;
		$api->getOrderCount();
	}
	if ($_GET['action']=='logOut') {
		$api = new Api;
		$employee = 'sisonians';
		$api->logOut($employee);
	}
?>