var dtAccounts = {
    dtInstance: {},
    dtInstanceLogs: null,
    pageDetails: function(){
                $(".content-header h1").text("Accounts");
                $(".content-header h1").append("<small>Company</small>");
            return this;
    },
	render: function(){
		 this.dtInstance = $("#dtAccount").DataTable({
                "dom"       : 'fBlrtip', 
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 10,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                 "oLanguage": {
	                            "bProcessing": true,
	                            "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
	                            "sInfoEmpty": 'No entries to show'
	                        },
                "bDestroy"  : true,                                             //destroy existing datatable
                // "bStateSave": true,                                          //save the pagination #, ordering, show records # and etc
                "ordering" : false,
                    "ajax" : {
			                    "url"  : assets+"php/accounts/company.php",
			                    "type" : "GET",
                                "data" : { action: 'view-all' }

                    		 
                  },
                 "buttons": [
                                {
                                    text: 'Add New Account',
                                    className: 'dt-button-addaccount',
                                    action: function ( e, dt, node, config ) {
                                        self.dtAccounts.modalShow();
                                    }
                                }
                            ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.username + "</span>";
                                }
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.firstname +" "+data.middlename +" "+ data.lastname + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<div class='text-left dt-column-branches'>" + data.location + "</div>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<div class='text-left'>" + data.branch + "</div>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.accountrole+ "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.created_at+ "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<button class='btn btn-xs btn-success btn-flat btnUpdateAcc' data-acc='"+data.id+"'>Update</button>";
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, width:"20%", target: 1}
                 ],
                "deferRender": true,
                "fnCreatedRow": function( row, data ) { //Add attribute id-company in first td element.
                                    $('td:eq(0)',row).attr( 'data-id-account',data.id);                                 
                            },
                "preDrawCallback": function(settings){
                            $(".dt-button-addaccount").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                }
        });
        return this;
	},
    modalShow: function(idaccount){ //Show form modal if @idaccount is null return empty form else get data by id.
          $("#displayFormAccount").load(pages+'accounts/form.html',function(data,status,xhr){
                     $('#modalFormAccount').modal('show');
                        autoDrpDown.getBranchNameMulti("#slctAccountLocation","100%",0,false);
                        autoDrpDownInvnt.getBranch("#slctAccountBranch"); //                    
                        autoDrpDownInvnt.getBranch("#slctAccountBranchMrf"); 
                        autoDrpDownInvnt.getBranch("#slctAccountBranchPm", null , [1]); //Execlude 1 = ALL
                        autoDrpDownMrf.getAccountDept("#slctAccountDept"); 

                        $("#slctAccountDept").change(function(e){ //Show/Hide option ALL and --Branch--
                              var flag = $(':selected', this).attr('data-group');
                                  if(flag == 'approver'){
                                    // $select.chosen('destroy');  // with plugin
                                    // $select.attr('multiple', 'multiple');
                                    // $select.chosen();
                                    // $("#slctAccountBranchMrf").val(1).prop('disabled',true).trigger('chosen:updated');  // with plugin
                                    $("#slctAccountBranchMrf option[value=1]").show();
                                    $("#slctAccountBranchMrf").val(1).prop('disabled',true); // Non-plugin
                                  }else{
                                    $('#slctAccountBranchMrf option').filter(function(e) {
                                        return e <= 1 ;
                                    }).hide();  // Non-plugin
                                    $("#slctAccountBranchMrf").val('').prop('disabled',false);
                                        // $select.chosen('destroy');  // with plugin
                                        // $select.removeAttr('multiple').prop('disabled',false);
                                        // $select.chosen();
                                        // $("#slctAccountBranchMrf").val(0).prop('disabled',false).trigger('chosen:updated');  // with plugin
                                  }
                        });

                        if(idaccount != null){
                         $(this).find(".modal-title").text('Update Account');
                         $.ajax({
                            type: 'GET',
                            url : assets+'php/accounts/company.php',
                            data: {action: 'view-id', idaccount: idaccount},
                            dataType: 'json',
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    var app_mif = parseInt(val.app_mif) || null;
                                    var app_pm = parseInt(val.app_pm) || null;
                                    var app_invent = parseInt(val.app_inventory) || null;
                                    var app_mrf = parseInt(val.app_mrf) || null;
                                    $("#hdnIdAccount").val(val.id);
                                    $("#hdnOldUsername").val(val.username);
                                    $("#txtUsername").val(val.username);
                                    $("#txtFname").val(val.firstname);
                                    $("#txtMname").val(val.middlename);
                                    $("#txtLname").val(val.lastname);
                                    $("#txtEmail").val(val.email);
                                    $("#slctStatus").val(val.status);  
                                    $("#slctAccountRole").val(val.accountrole);
                                    $("#slctPmType").val(val.pm_type);
                                    $("#txtDateCreated").text(val.created_at);
                                    $("#chkAppMif").prop('checked', (app_mif == null ? false : true));
                                    $("#chkAppPm").prop('checked', (app_pm == null ? false : true));
                                    $("#chkAppInventory").prop('checked', (app_invent == null  ? false : true));
                                    $("#chkAppMrf").prop('checked', (app_mrf == null  ? false : true));
                                    $("#slctAccountLocation").prop('disabled', (app_mif != null ? false : true));
                                    $("#slctAccountDept").val(val.account_type).trigger('change');                                      
                                    $("#slctAccountLocation").val((val.location == null ? null : val.location.split(","))).trigger('chosen:updated');  
                                    $("#slctAccountBranch").val(val.branch).prop('disabled', (app_invent != null ? false : true));                                
                                    $("#slctAccountBranchPm").val(val.branch_pm).prop('disabled', (app_pm != null ? false : true));                                
                                    $("#slctAccountBranchMrf").val(val.branch_mrf).prop('disabled', (app_mrf != null && app_mrf > 0 && val.account_type > 1 ? false : true)); ;
                                    if(val.action_mif != "")//Check only if has value.
                                        $("input[name='radioMifActions'][value="+val.action_mif+"]").prop('checked',true); 
                                    if(val.action_invnt != "")               
                                        $("input[name='radioInvntActions'][value="+val.action_invnt+"]").prop('checked',true);
                                    if(val.action_mrf != "")                 
                                        $("input[name='radioMrfActions'][value="+val.action_mrf+"]").prop('checked',true);
                                    if(val.action_pm != "")                 
                                        $("input[name='radioPmActions'][value="+val.action_pm+"]").prop('checked',true);                 
                                }); 
                            },
                            error: function(data,xhr,status){ alert("Something went wrong."); }
                         });
                     } else { 
                        $(this).find(".modal-title").text('Add Account'); 
                        // autoDrpDown.getBranchName(null,"#slctAccountLocation");
                        $("#slctAccountLocation").val(0).trigger('chosen:updated');   
                        $("#txtDateCreated").text(getTodayDate()); 
                    }
              });
    },
    update: function(){
            var $btn      = $("button[type='submit']");
            var id        = $("#hdnIdAccount").val();
            var username  = $("#txtUsername").val();
            var pass      = $("#txtPassword").val();
            var fname     = $("#txtFname").val();
            var mname     = $("#txtMname").val();
            var lname     = $("#txtLname").val();
            var email     = $("#txtEmail").val();
            var accrole   = $("#slctAccountRole option:selected").val();
            var pm_type   = $("#slctPmType option:selected").val();
            var status    = $("#slctStatus option:selected").val();
            var app_mif   = $("input[name='chkAppMif']:checked").val() || '';
            var app_pm    = $("input[name='chkAppPm']:checked").val() || ''; 
            var loc       = ($("#slctAccountLocation").chosen().val() ? $("#slctAccountLocation").chosen().val().toString() : '');
            var app_invt  = $("input[name='chkAppInventory']:checked").val() || ''; 
            var branch    = $("#slctAccountBranch option:selected").val();
            var branch_pm = $("#slctAccountBranchPm option:selected").val();
            var app_mrf   = $("input[name='chkAppMrf']:checked").val() || ''; 
            var branch_mrf= $("#slctAccountBranchMrf option:selected").val();
            var acc_type_mrf= $("#slctAccountDept option:selected").val();
            var action_mif  = $("input[name='radioMifActions']:checked").val();
            var action_pm   = $("input[name='radioPmActions']:checked").val();
            var action_invnt = $("input[name='radioInvntActions']:checked").val();

            var action_mrf = $("input[name='radioMrfActions']:checked").val();
            var data = {action: 'update', idaccount:id, username:username, pass:pass, fname:fname, mname:mname, lname:lname, email:email, 
                        app_mif: app_mif, app_pm:app_pm, action_pm:action_pm, location:loc, app_invt:app_invt, branch:branch, branch_pm:branch_pm, app_mrf:app_mrf, branch_mrf:branch_mrf, accrole:accrole, status:status, acc_type_mrf:acc_type_mrf,
                        action_mif:action_mif, action_invnt: action_invnt, action_mrf:action_mrf, pm_type:pm_type};

             $.ajax({
                type: 'POST',
                url: assets+'php/accounts/company.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data){
                    if(data.aaData.check_location == 1){
                        promptMSG('custom','Can\'t update due the <strong>ALL</strong> location can\'t combined.',"<i class='fa fa-warning'></i>",null,false,true);
                    }else{
                       self.dtAccounts.dtInstance.ajax.reload(function(){
                            promptMSG('success-update','Company Account',null,'',false,true);
                            var logged_id = Cookies.get('user_id');
                                if(id == logged_id){ //Clear the stored cookies location.
                                    Cookies.clear('location');
                                    Cookies.set('location',loc,0.5);
                                }
                       }, false); // Reload the data in DataTable.
                   }
                },
                error: function(xhr,status){ alert("Something went wrong."); },
                complete: function(){ $btn.button('reset'); }
            });                  
    },
    add: function(){
            var $btn      = $("button[type='submit']");
            var username  = $("#txtUsername").val();
            var pass      = $("#txtPassword").val();
            var fname     = $("#txtFname").val();
            var mname     = $("#txtMname").val();
            var lname     = $("#txtLname").val();
            var email     = $("#txtEmail").val();
            var app_mif   = $("input[name='chkAppMif']:checked").val() || ''; 
            var loc       = ($("#slctAccountLocation").chosen().val() ? $("#slctAccountLocation").chosen().val().toString() : '');
            var app_invt  = $("input[name='chkAppInventory']:checked").val() || ''; 
            var branch    = $("#slctAccountBranch option:selected").val();
            var app_mrf   = $("input[name='chkAppMrf']:checked").val() || ''; 
            var branch_mrf= $("#slctAccountBranchMrf option:selected").val();
            var accrole   = $("#slctAccountRole option:selected").val();
            var status    = $("#slctStatus option:selected").val();
            var acc_type_mrf= $("#slctAccountDept option:selected").val();
            var action_mif = $("input[name='radioMifActions']:checked").val();
            var action_invnt = $("input[name='radioInvntActions']:checked").val();
            var action_mrf = $("input[name='radioMrfActions']:checked").val();
            var pm_type    = $("#slctPmType option:selected").val();
            var action_pm   = $("input[name='radioPmActions']:checked").val();
            var branch_pm = $("#slctAccountBranchPm option:selected").val();
            var app_pm    = $("input[name='chkAppPm']:checked").val() || ''; 
            var data = {action:'add', username:username, pass:pass, fname:fname, mname:mname, lname:lname, email:email, 
                        app_mif: app_mif, location:loc, app_invt:app_invt, branch:branch, app_mrf:app_mrf, branch_mrf:branch_mrf, accrole:accrole, status:status, acc_type_mrf:acc_type_mrf,
                        action_mif:action_mif, action_invnt: action_invnt, action_mrf:action_mrf, pm_type:pm_type, action_pm:action_pm, branch_pm:branch_pm, app_pm:app_pm }; 
            var isResetForm = false;
          $.ajax({
                type: 'POST',
                url: assets+'php/accounts/company.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data, xhr, status){
                    if(data.aaData.check_location == 1){
                        promptMSG('custom','Can\'t add due the <strong>ALL</strong> location can\'t combined.',"<i class='fa fa-warning'></i>",null,false,true);
                    }else{
                        self.dtAccounts.dtInstance.ajax.reload(function(){
                            promptMSG('success-add','Company Account',null,'',false,true);
                        }, false).page('last');
                        isResetForm = true;
                    }
                },
                error: function(xhr,status){ alert("Something went wrong."); },
                complete: function(){ 
                    if (isResetForm) { resetForm("#frmAccount"); } 
                    $btn.button('reset'); 
                }

            });
    },
    actions: function(){
          $("table#dtAccount").on('click', 'button', function () {
                    var inst = $(this);
                    if ( inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                         // $(this).closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtAccounts.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Show modal update
                    if (inst.text() == 'Update') {
                        var idaccount = $(this).data('acc');
                        self.dtAccounts.modalShow(idaccount);
                    }
                } );
           return this;
    },
    login_logs: function(){ //Table logs is using Server-side processing to avoid loading all datas.
          this.dtInstanceLogs = $('#dtAccLoginLogs').DataTable( {
                    "dom" : "<'search-toolbar'>lrtip",
                    "processing": true,
                    "serverSide": true,
                    "ordering": false,
                    "destroy": true,
                    "responsive": false,
                    "ajax": {
                        "url": assets+'php/accounts/accountLoginLogs.php',
                        "type": "POST",
                        "dataSrc": "records",
                         data: function(d){
                                 d.search = { 'value' : $("#txtSearchLogs").val() || null } ;
                               }
                    },
                    "columns": [
                        { "data": null },
                        { "data": "fullname" },
                        { "data": "date_log" },
                        { "data": "description" },
                        { "data": "ip_address" },
                    ],
                    "columnDefs": [
                        {
                            "targets": 0,
                            "render": function ( data, type, row, meta ) {
                               return meta.row + 1;
                            }
                        }

                    ]
            });
            $("div.search-toolbar").html("<div class='pull-right'><input type='search' id='txtSearchLogs' placeholder='Search' style='margin-right:10px'/>" + 
                "<a href='#' class='btn btn-flat btn-xs btn-primary' id='btnSearchLogs'><i class='fa fa-search' title='Search'></i></a></div>"); //Custom search toolbar

                $("#btnSearchLogs").click(function(e){
                    e.preventDefault();
                    self.dtAccounts.dtInstanceLogs.ajax.reload();
                });

        return this;
    },
    changePassword: function(id){
         var $btn  = $("button[type='submit']");
         var pass  = $("#txtConfirmPassword").val();
         var idaccount = id; 
            $.ajax({
                type: 'POST',
                url: assets+'php/accounts/company.php',
                data: {action: 'change_password',  idaccount: idaccount, pass: pass},
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data){

                     if(data.status == "success"){
                        promptMSG('success-update','Password',null,'',false,true);                        
                     }else{
                        alert("Error, missing data paramaters.");
                   }
                },
                error: function(xhr,status){ alert("Something went wrong."); },
                complete: function(){ $btn.button('reset'); }
            });  

        return this;
    }

};