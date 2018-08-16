var myUrl = 'http://localhost';
let PurNo = '';
function getAllData() {
	$.getJSON(myUrl + '/purchase/_api/index.php?action=getAllPR',function(data){
		let longString = '';
		for(let i=0; i<data.length; i++){
			let pr_no = '' + data[i].fldPrNo + '';
			longString += 	'<tr>' +
								'<td>' + data[i].fldPrNo + '</td>' +
								'<td>' + data[i].fldDept + '</td>' +
								'<td>' + data[i].fldDate + '</td>' +
								'<td>' + data[i].fldPurpose + '</td>' +
								'<td><a class="waves-effect waves-light btn modal-trigger" href="#modal1" onclick="getPRitems(\'' + pr_no + '\')">generate purchase order</a></td>' +
							'</tr>';
		}
		document.getElementById('pr_details').innerHTML = longString;
	});
		setTimeout(function(){getAllData();},1000);
}

function getPRitems(pr_no) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd;
    } 

    if(mm<10) {
        mm = '0'+mm;
    } 

    today = mm + '/' + dd + '/' + yyyy;
    let date = today;

	$.getJSON(myUrl + '/purchase/_api/index.php?action=getAllPRitems&pr_no=' + pr_no + '',function(data){		
	    let longString = "";
        let totalcost = 0;
        let POno = '';
	    for(var i = 0; i < data.length; i++) {
	        let total = parseInt(data[i].fldTotalCost);
	        total = total.toFixed(2);
	        let cost = parseInt(data[i].fldUnitCost);
	        cost = cost.toFixed(2);
	        totalcost = parseInt(totalcost) + parseInt(total);
	        totalcost = totalcost.toFixed(2);
	        POno = data[i].fldPrNo;
	        PurNo = POno;
	        longString += "<tr>";
	        longString += "<td>" + data[i].fldPrNo + "</td>";
	        longString += "<td>" + data[i].fldUnit + "</td>";
	        longString += "<td>Sample Description</td>";
	        longString += "<td>" + data[i].fldQty + "</td>";
	        longString += "<td>&#8369; " + cost.replace(/\B(?=(\d{3})+\b)/g, ",") + "</td>";
	        longString += "<td>&#8369; " + total.replace(/\B(?=(\d{3})+\b)/g, ",") + "</td>";
	        longString += "</tr>";
	    }	
	    longString += '<tr><td colspan="5"><center>Total Amount</center></td><td>&#8369; ' + totalcost.replace(/\B(?=(\d{3})+\b)/g, ",") + '</td></tr>';
	    $('#itemsList').html(longString);
	    $('#POno').html(POno);
	    $('#dateToday').html(date);
	});
}
function setDetails(elem){
	let supplier = document.getElementById('supplier').value;
	let address = document.getElementById('address').value;
	let modeOfProcurement = document.getElementById('modeOfProcurement').value;
	let placeOfDelivery = document.getElementById('placeOfDelivery').value;
	let dateOfDelivery = document.getElementById('dateOfDelivery').value;
	let deliveryTerm = document.getElementById('deliveryTerm').value;
	let paymentTerm = document.getElementById('paymentTerm').value;
	let prNo = PurNo;
	$('#suppDet').html(supplier);
	$('#suppAdd').html(address);
	$('#modeOfProc').html(modeOfProcurement);
	$('#placeOfDel').html(placeOfDelivery);
	$('#dateOfDel').html(dateOfDelivery);
	$('#delTerm').html(deliveryTerm);
	$('#payTerm').html(paymentTerm);
	$.ajax({
		url: myUrl + '/purchase/_api/index.php?action=savePO',
		method:'POST',
		data:{
			prNo:prNo,
			supplier:supplier,
			address:address,
			modeOfProcurement:modeOfProcurement,
			placeOfDelivery:placeOfDelivery,
			placeOfDelivery:placeOfDelivery,
			dateOfDelivery:dateOfDelivery,
			deliveryTerm:deliveryTerm,
			paymentTerm:paymentTerm
		},
		success:function(data){
			alert('hihi');
		}
	});
	document.getElementById("printDiv").style.display = "block";
	Popup($('<div/>').append($(elem).clone()).html());
	document.getElementById("printDiv").style.display = 'none';
}
function Popup(data) {
    var mywindow = window.open('', '_blank');
    
    mywindow.document.write('<head><link href="css/printstyle.css" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet"></head>');
    mywindow.document.write('<body><div id="mybody">');
    mywindow.document.write('<div style="text-align: right;"></div>');
    mywindow.document.write('<center><h1>PURCHASE ORDER SUMMARY</h1></center>');
   
    mywindow.document.write(data);

    mywindow.document.write('</center>')

    mywindow.document.write('<script type="text/javascript" src="js/jquery.min.js"></script>'); 
    mywindow.document.write('<script type="text/javascript" src="js/jspdf.min.js"></script>');
    mywindow.document.write('<script type="text/javascript" src="js/printPdf.js"></script>');
    mywindow.document.write('');
    mywindow.document.write('</body></html>');
    mywindow.focus();
    setTimeout(function(){mywindow.close();},1000);
    return true; 
}
getAllData();