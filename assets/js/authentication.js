// $(document).ready(function(){
// 	setTimeout(function(){
// 		$( "#frmLogin" ).submit(function( e ) {
// 		   e.preventDefault();
// 		    $("body").removeClass('modal-open'); //Remove existing modal open.
// 		   login();
// 		});
// 	},1000);
// });

function login(route){
	var $btn = $("#Loginsubmit");
	var username = (!$("#txtloginuser").val()) ? null :  $("#txtloginuser").val();
	var password = (!$("#txtloginpass").val()) ? null :  $("#txtloginpass").val();

	if(!username || !password){
		promptMSG("warning","Please input username/password.");
	}
	else
	{

   		$.ajax({
			type: 'POST',
			url: assets+'php/login.php',
			data: {username: username, password: password},
			cache: false,
			beforeSend: function(){
				$btn.button('loading');
			},
			success:function(data){
				$.each(data.aaData,function(key, val){
					 if(val == 'empty'){
					 	promptMSG("danger");
					 }
					 else if(val == 'inactive'){
					 	promptMSG("custom","<strong>Warning!</strong>Account has been inactive.","<i class='fa fa-warning'></i>");
					 }
					 else {
					 	var fullname = val.firstname+" "+val.lastname;
					 	var app_module = { app_mif: val.app_mif, app_invnt: val.app_inventory, app_mrf: val.app_mrf, app_pm: val.app_pm };
					 	var app_module_action = { action_mif: val.action_mif, action_invnt: val.action_invnt, action_mrf: val.action_mrf, action_pm: val.action_pm };

					 	insert_logs_inout(val.id, "Log-in",function(){
						 		Cookies.set('user_mif_flag',val.acc_mif_flags,0.5);
						 		Cookies.set('companies',val.company,0.5);
						 		Cookies.set('location',val.location,0.5); //set cookie to remember login then expire one day.
							 	Cookies.set('fullname',fullname,0.5);
							 	Cookies.set('user_role',val.accountrole,0.5);
							 	Cookies.set('user_id',val.id,0.5);
							 	Cookies.set('app_module', JSON.stringify(app_module),0.5);
							 	Cookies.set('app_module_action', JSON.stringify(app_module_action),0.5);
							 	Cookies.set('branch',val.branches,0.5);
							 	Cookies.set('branch_pm',val.branch_pm,0.5);
							 	Cookies.set('branch_mrf',val.branches_mrf,0.5);
							 	Cookies.set('user_type',val.account_type,0.5);
							 	Cookies.set('user_mrf_flag',val.acc_mrf_flags,0.5);
							 	Cookies.set('email',val.email,0.5);
							 	Cookies.set('pm_type',val.pm_type,0.5);
							 	if(app_module.app_mif == 1){
							 		route.setRoute("/dashboard"); //Default route to dashboard.
							 	}
							 	else if(app_module.app_invnt == 1){
							 		route.setRoute("/inventory/dashboard");
							 	}
							 	else if(app_module.app_mrf == 1){
							 		route.setRoute("/mrf/current");
							 	}
							 	else if(app_module.app_pm == 1){
							 		route.setRoute("/pm/current");
							 	}
							 	else{
							 		return false;
							 	}
						 	
					 	}); //Login logs
					 }
				});
			},
			error:function(){
				promptMSG("danger");
				$btn.button('reset');
			},
			complete:function(data){
				$btn.button('reset');
			}
		});

	}
}

function logout(){
	var userid = Cookies.get('user_id');

	insert_logs_inout(userid, "Log-out", function(){
		Cookies.clear('location');
		Cookies.clear('fullname');
		Cookies.clear('user_role');
		Cookies.clear('companies');
		Cookies.clear('position');
		Cookies.clear('user_id');
		Cookies.clear('app_module');
		Cookies.clear('branch');
		Cookies.clear('branch_pm');
		Cookies.clear('branch_mrf');
		Cookies.clear('user_type');
		Cookies.clear('user_mrf_flag');
		Cookies.clear('email');
		Cookies.clear('app_module_action');
		Cookies.clear('user_mif_flag');
		Cookies.clear('pm_type');
		$("div.page-home").empty();
		window.location.href = '#/login';
	});
}

function insert_logs_inout(userid,  pdescription, callbackLogs){
   	$.ajax({
		type: 'POST',
		url: assets+'php/misc/insert_login_logs.php',
		data: {user_id: userid, description: pdescription},
		success:function(data){
			callbackLogs();
		}	});
}
