let session_username = '';
let session_userid = '';
let session_fname = '';
let session_lname = '';

function check_session(){
  let url = myurl+"/_mismodule_v2.0/api/check_session.php";
  $.getJSON(url,function(data){
     if (data['response'] == 'true') {
     	session_username = data['username'];
     	session_userid = data['userid'];
     	session_fname = data['fname'];
     	session_lname= data['lname'];
     	document.getElementById('session_user').innerHTML=session_fname + " " + session_lname;
     }else{
     	window.location.assign('login.html');
     }
  });
}

function session_logout(){
	let url = myurl+"/_mismodule_v2.0/api/out_session.php";
	$.getJSON(url,function(data){
		if (data == 'true') {
			window.location.assign('login.html');
		}else{
			swal({
									title: "Logout Failed",
									text: "Invalid Credentials",
									type: "error",
									timer: 1000,
									showConfirmButton: false
								});
		}
	});
}

