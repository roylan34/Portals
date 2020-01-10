function login(route) {
    var $btn = $("#Loginsubmit");
    var username = (!$("#txtloginuser").val()) ? null : $("#txtloginuser").val();
    var password = (!$("#txtloginpass").val()) ? null : $("#txtloginpass").val();

    if (!username || !password) {
        promptMSG("warning", "Please input username/password.");
    }
    else {

        $.ajax({
            type: 'POST',
            url: assets + 'php/login.php',
            data: { username: username, password: password },
            cache: false,
            beforeSend: function () {
                $btn.button('loading');
            },
            success: function (data) {
                var res = data.aaData;

                if (res.status == 'empty') {
                    promptMSG("danger");
                }
                else if (res.status == 'inactive') {
                    promptMSG("custom", "<strong>Warning!</strong>Account has been inactive.", "<i class='fa fa-warning'></i>");
                }
                else {
                    insert_logs_inout(res.user_id, "Log-in", function () {

                        Cookies.set('token', res.token, 0.1);

                        if (res.app_module.app_mif == 1) {
                            route.setRoute("/mif/dashboard"); //Default route to dashboard.
                        }
                        else if (res.app_module.app_invnt == 1) {
                            route.setRoute("/inventory/dashboard");
                        }
                        else if (res.app_module.app_mrf == 1) {
                            route.setRoute("/mrf/current");
                        }
                        else if (res.app_module.app_pm == 1) {
                            route.setRoute("/pm/current");
                        }
                        else {
                            return false;
                        }

                    }); //Login logs
                }

            },
            error: function () {
                promptMSG("danger");
                $btn.button('reset');
            },
            complete: function (data) {
                $btn.button('reset');
            }
        });

    }
}

function logout() {
    var userid = jwt.get('user_id');

    insert_logs_inout(userid, "Log-out", function () {
        Cookies.clear('token');
        jwt.clear();
        $("div.page-home").empty();
        window.location.href = '#/login';
    });
}

function insert_logs_inout(userid, pdescription, callbackLogs) {
    $.ajax({
        type: 'POST',
        url: assets + 'php/misc/insert_login_logs.php',
        data: { user_id: userid, description: pdescription },
        success: function (data) {
            callbackLogs();
        }
    });
}
