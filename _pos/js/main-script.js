	const data = new Worker('../js/data.js');
	let currentNo = 0;
	data.addEventListener('message', (d) => {
		console.log(d.data[0]);
		if (d.data[0].currCount != currentNo) {
			currentNo = d.data[0].currCount;
			getTable();
		}
      	document.getElementById('tab-container').innerHTML = d.data[0].tabContainer;
      	document.getElementById('tab-content').innerHTML = d.data[0].tabContent;
      	document.getElementById('modal-container').innerHTML = d.data[0].modals;
      	for(let i = 0; i < d.data[0].items.length; i++){
      		document.getElementById(d.data[0].id[i]).innerHTML = d.data[0].items[i];
      	}
      	number_input();
      	// document.getElementById(d.data[0].).innerHTML = d.data[0].modal;
	});

  var myUrl = 'http://localhost';
  var items = [];
  var modals = [];
  document.getElementById('total-bill').style.display='none';
  document.getElementById('discount').style.display='none';
  document.getElementById('disc_name').style.display='none';
  document.getElementById('disc_type').style.display='none';
  document.getElementById('disc_num').style.display='none';
  document.getElementById('disc_num').style.display='none';
  document.getElementById('disc-item-id').style.display='none';
  var action = 'Dine-In';
  var msg = "";

function addtoCart(myId, myName, myPrice){
    var qty = document.getElementById(myId+myName).value;
    $.ajax({
        url: myUrl + '/_pos/api/index.php?action=addToCart',
        method: "POST",
        data: {
            id: myId,
            name: myName,
            price: myPrice,
            quantity: qty
        },
        sucess: function(data){
        }
    });
    toast.show('Succesfuly Added','success');
    // window.alert("Succesfuly added");
    viewCart();
}
function emptyCart(){
    var longString = '';
    document.getElementById("contents").innerHTML = '';
    $.ajax({
        url: myUrl + '/_pos/api/index.php?action=emptyCart',
        method: "POST",
        data: {
            u: longString
        },
        success: function(data){
            
        }
    });
    viewCart();
    document.getElementById("sub-total").innerHTML = "0.00";
    document.getElementById("total").innerHTML = "0.00";
}
function removeItem(id){
    var longString = '';
    document.getElementById("contents").innerHTML = '';
    $.ajax({
        url: myUrl + '/_pos/api/index.php?action=removeItem',
        method: "POST",
        data: {
           id : id
        },
        success: function(data){
            
        }
    });
    viewCart();
}
function viewCart(){
    var discount = document.getElementById('discount').value;
    var longString = "";
    var longString2 = "";
    var subtotal = 0;
    var hprice = 0;
    var disc_item_id = '';
    var tableNumber = document.getElementById('table-type').value +"-"+ document.getElementById('table-number').value;
    $.ajax({
        url: myUrl + '/_pos/api/index.php?action=viewCart',
        method: "GET",
        dataType: "JSON",
        success: function(data){
            console.log(data)
            for(var i = 0; i < data.length; i++){
                longString += "<tr><td style = 'transform: rotate(0deg); font-size:11px;' id='disc-msg-"+data[i].item_id+"'></td><td>"+data[i].item_name+"</td><td>"+data[i].item_quantity+"</td><td>&#8369; "+data[i].item_tprice+"</td><td><a href='#' onclick='removeItem("+data[i].item_id+")' style='text-decoration:none;'>REMOVE</td></tr>";
                longString2 += "<tr style='text-align:center;'><td colspan='2'>"+data[i].item_name+"</td><td>"+data[i].item_quantity+"</td><td>&#8369; "+data[i].item_tprice+"</td></tr>";
                subtotal += parseFloat(data[i].item_tprice);
                var cprice = data[i].item_tprice / data[i].item_quantity;
                if(cprice>hprice){
                  hprice = cprice;
                  disc_item_id = 'disc-msg-'+data[i].item_id+'';
                } else {
                  hprice = hprice;
                }
            }
            // console.log(subtotal);
            var discount = document.getElementById('discount').value;
            var total = 0;
            total = subtotal - discount;
            d = new Date;
            m = d.getMonth()+1;
            da = d.getDate();
            y = d.getFullYear();
            d = m+'/'+da+'/'+y; 
            document.getElementById("contents").innerHTML = longString;
            document.getElementById("receipt-table").innerHTML = longString2;
            document.getElementById("sub-total").innerHTML = subtotal.toFixed(2);
            document.getElementById("total").innerHTML = total.toFixed(2);
            document.getElementById("total-bill").value = hprice.toFixed(2);
            document.getElementById("disc-item-id").value = disc_item_id;
            document.getElementById("table-no").innerHTML = tableNumber;
            document.getElementById("dateToday").innerHTML = d;
            document.getElementById("receipt-total").innerHTML = hprice.toFixed(2);
            document.getElementById("receipt-stotal").innerHTML = hprice.toFixed(2);
            let disc_item = document.getElementById('disc-item-id').value;
            // disc_item = "'" + disc_item + "'";
            document.getElementById(disc_item).innerHTML = msg;
        }
    });
}
function Confirm($discount){
    var tableNumber = document.getElementById('table-type').value +"-"+ document.getElementById('table-number').value;
    mscConfirm("Check out", "Are you sure you want to checkout your order?", function(){
      $.ajax({
          url: myUrl + '/_pos/api/index.php?action=cashOut&actionn='+ action +'&employee&tableNumber='+tableNumber,
          method: "GET",
          dataType: "JSON",
          sucess: function(data){

          }
      });
      emptyCart();
      mscAlert("Order Checked Out");
      // getCategory();
      postDiscount();
      document.getElementById('receipt-print').style.display = 'block';
      Popup($('<div/>').append($('#receipt-print').clone()).html());
      document.getElementById('receipt-print').style.display = 'none';
    });

}
function getTable(){
  var tableType = "<option disabled selected>Table Type</option>";
  var tableNumber = "<option disabled selected>Table Number</option>";
  $.getJSON(myUrl + '/_pos/api/index.php?action=getTable', function(data){
    for(var i = 0; i < data.length; i++){
      tableType += '<option value="' + data[i].fldTableCode + '">' + data[i].fldTableDesc + '</option>';
    }
    document.getElementById("table-type").innerHTML = tableType;
    document.getElementById("table-number").innerHTML = tableNumber;
  });
}
function getTableNumber(){
  var code = document.getElementById('table-type').value;
  var tableNumber = "<option disabled selected>Table Number</option>";
  $.getJSON(myUrl + '/_pos/api/index.php?action=getTableNumber&code=' + code, function(data){
    for(var i = 0; i < data[0].fldTableNo; i++){
      tableNumber += '<option value="' + (i+1) + '">' + (i+1) + '</option>';
    }
    document.getElementById("table-number").innerHTML = tableNumber;
  });
  
}
function setDiscount(type){
  var discountPrice = 0;
  
  if (type=='PWD') {
    var amount = document.getElementById('total-bill').value;
    discountPrice = amount * 0.15;
    msg = "15% discount";
  } else {
    var amount = document.getElementById('total-bill').value;
    discountPrice = amount * 0.20;
    msg = "20% discount";
  }
  document.getElementById('discount').value = discountPrice;

  viewCart();
}
function submit_discount(){
  var name = document.getElementById('name').value;
  var number = document.getElementById('number').value;
  var type = document.getElementById('type').value;
  document.getElementById('disc_name').value = name;
  document.getElementById('disc_num').value = number;
  document.getElementById('disc_type').value = type;
  setDiscount(type);
}
function postDiscount(){
  var name = document.getElementById('disc_name').value;
  var num = document.getElementById('disc_num').value;
  var type = document.getElementById('disc_type').value;
  var amount = document.getElementById('discount').value;
  if ((amount != 0)&&(name != "")) {
    $.post(myUrl + '/_pos/api/index.php?action=postDiscount',{name:name, number:num, type:type, amount:amount},function(data){

    });
    removeDiscount();
  }
}
function removeDiscount(){
  var discountPrice = 0;
  document.getElementById('discount').value = discountPrice;
  document.getElementById('msg').innerHTML = "";
  msg = '';
  viewCart();
}
function dito() {
  var val = document.getElementById('di_to').value;
  action = val;
}
// getTable();
viewCart();

