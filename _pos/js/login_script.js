$(document).ready(function(){
	$("#btn-login").click(function(){
		var username = $("#username").val();
		var password = $("#password").val();
		// Returns successful data submission message when the entered information is stored in database.
		var dataString = 'username1='+ username + '&password1='+ password;
		if(username==''||password=='')
		{
			swal({
				title: "Fill all fields",
				text: "All fields are required",
				type: "error",
				showConfirmButton: true
			});
		}
		else
		{
			// AJAX Code To Submit Form.
			$.ajax({
				type: "POST",
				url: "../api/login_func.php",
				data: dataString,
				cache: false,
				success: function(result){
						if (result == 'true') {
							swal({
								title: "Welcome",
								text: "Login Successful "+ username,
								type: "success",
								timer: 1000,
								showConfirmButton: false
							},
							function(){
								location="../www/index.html";
							});
						}else{
								document.getElementById('username').value = "";
								document.getElementById('password').value = "";
								swal({
									title: "Login Failed",
									text: "Invalid Credentials",
									type: "error",
									timer: 1000,
									showConfirmButton: false
								});
							}
						}	
			});
		}
		return false;
	});
;
});