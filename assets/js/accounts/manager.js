var dtAccClient = {
    dtInstance: {},
    dtInstanceLogs: null,
    pageDetails: function(){
                $(".content-header h1").text("Accounts");
                $(".content-header h1").append("<small>Manager</small>");
            return this;
    },
    render: function(){
         this.dtInstance = $("#dtClient").DataTable({
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
                "bDestroy"  : true,                                             
                // "bStateSave": true,                                          
                "ordering" : false,
                    "ajax" : {
                                "url"  : assets+"php/accounts/manager/manager.php",
                                "type" : "POST",
                                "data" : {action: 'view-all'}
                             
                  },
                 "buttons": [
                                {
                                    text: 'Add New Manager',
                                    className: 'dt-button-addaccount',
                                    action: function ( e, dt, node, config ) {
                                        self.dtAccClient.modalShow();
                                    }
                                }
                            ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.fullname + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.company+ "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                        if(data.status == 1)
                                            return "<span class='text-left'> Active </span>";
                                        else 
                                            return "<span class='text-left' style='color:#dd4b39'> Inactive </span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.created_at+ "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<button class='btn btn-xs btn-success btn-flat btnUpdateAcc' data-acc-client='"+data.id+"'>Update</button>";
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, width:"20%", target: 1},
                            { targets: 2, className: "none" }
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
    modalShow: function(idclient){ //Show form modal if @idclient is null return empty form else get data by id.
          $("#displayFormAccClient").load(pages+'accounts/form-client.html',function(data,status,xhr){
                    autoDrpDown.getAllCompany("#slctClientCompany","100%"); 
                    autoDrpDown.getAssignAccountManager("#slctAcctMngrName"); 
                     $('#modalFormAccClient').modal('show');
                        if(idclient != null){
                         $(this).find(".modal-title").text('Update Manager');
                         $.ajax({
                            type: 'GET',
                            url : assets+'php/accounts/manager/manager.php',
                            data: {action:'view-id', idclient: idclient},
                            dataType: 'json',
                            //async: false,
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    $("#hdnClientId").val(val.id);
                                    $("#hdnOldSlctAcctMngrName").val(val.account_id);
                                    $("#slctAcctMngrName").val(val.account_id).trigger('chosen:updated');
                                    $("#txtClientDateCreated").text(val.created_at);
                                    $("#hdnClientOldCompany").val(val.company);
                                    $("#slctClientCompany").val(val.company.split(",")).trigger('chosen:updated');
                                    $("#txtIDemp").val(val.idemp);
                                    // $("#slctClientCompany").val(convertToObj(val.company)).trigger('chosen:updated');
                                }); 
                            },
                            error: function(data,xhr,status){ }
                         });
                     } else { 
                        $(this).find(".modal-title").text('Add Manager'); 
                        $("#txtClientDateCreated").text(getTodayDate());
                        // $(autoDrpDown.cacheOptCompInst).val('').trigger('chosen:updated'); //Reset the dropdown.
                    }
              });
    },
    update: function(){
            var $btn       = $("button[type='submit']");
            var id         = $("#hdnClientId").val();
            var account_id = ($("#slctAcctMngrName").chosen().val() ? $("#slctAcctMngrName").chosen().val() : null);
            var companies  = ($("#slctClientCompany").chosen().val() ? $("#slctClientCompany").chosen().val().toString() : '');
            var old_companies = $("#hdnClientOldCompany").val();
            var old_account_id = $("#hdnOldSlctAcctMngrName").val();
            var id_emp = $("#txtIDemp").val();

            var data = {action:'update', idclient:id, account_id:account_id, companies: companies, old_companies:old_companies, old_account_id:old_account_id, id_emp:id_emp};

             $.ajax({
                type: 'POST',
                url: assets+'php/accounts/manager/manager.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data){
                   if(data.aaData.has_value_accmngr == 1){
                        promptMSG('custom',"<strong>Company already taken: </strong><span style='color:#d24d3c'>"+data.aaData.exist_company+"</span>","<i class='fa fa-warning'></i>");
                         return false;
                   }
                   else if(data.aaData.isNameExist == "true"){
                        promptMSG('warning',"Name is already exist.",null,'',false, true);
                        return false;
                   }
                   else{
                        $("#hdnClientOldCompany").val(companies);//Update hidden input if account manager field is empty.                        
                        $("#hdnOldSlctAcctMngrName").val(account_id);//Replicate the value with the updated.
                        self.dtAccClient.dtInstance.ajax.reload(function(){
                             promptMSG('success-update','Account Manager',null,'',false,true);
                              autoDrpDown.cacheOptClient.splice(0,1); //Remove cache
                       }, false); // Reload the data in DataTable.
                   }

                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ $btn.button('reset'); }
            });                  
    },
    add: function(){
            var $btn      = $("button[type='submit']");
            var account_id = ($("#slctAcctMngrName").chosen().val() ? $("#slctAcctMngrName").chosen().val() : null);
            var companies = ($("#slctClientCompany").chosen().val() ? $("#slctClientCompany").chosen().val().toString() : '');
            var id_emp = $("#txtIDemp").val();
            var data = {action:'add', account_id: account_id, companies: companies, id_emp:id_emp};
              $.ajax({
                    type: 'POST',
                    url: assets+'php/accounts/manager/manager.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data, xhr, status){
                        if(data.aaData.has_value_accmngr  == 1){
                            promptMSG('custom',"<strong>Company already taken: </strong><span style='color:#d24d3c'>"+data.aaData.exist_company+"</span>","<i class='fa fa-warning'></i>");
                            return false;
                        }
                        else if(data.aaData.isNameExist == "true"){
                            promptMSG('warning',"Name is already exist.",null,'',false, true);
                            return false;
                        }
                        else{
                            self.dtAccClient.dtInstance.ajax.reload(function(){
                                 promptMSG('success-add','Account Manager',null,'',false,true);
                                 autoDrpDown.cacheOptClient.splice(0,1); //Remove cache
                            }, false).page('last');
                            resetForm("#frmAccountClient");
                        }
                    },
                    error: function(data, xhr,status){ alert(data + xhr + status.text); },
                    complete: function(){ $btn.button('reset'); }

                });
        return this;
    },
    actions: function(){
          $("table#dtClient").on('click', 'button', function () {
                    var inst = $(this);
                    if ( inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                         // $(this).closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtAccClient.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Show modal update
                    if (inst.text() == 'Update') {
                        var idaccount = $(this).data('acc-client');
                        self.dtAccClient.modalShow(idaccount);
                    }
                } );
           return this;
    },
    login_logs: function(){ //Table logs is using Server-side processing to avoid loading all datas.
          this.dtInstanceLogs = $('#dtAccMngrLoginLogs').DataTable( {
                    "dom" : "<'search-toolbar'>lrtip",
                    "processing": true,
                    "serverSide": true,
                    "ordering": false,
                    "destroy": true,
                    "responsive": false,
                    "ajax": {
                        "url": assets+'php/accounts/manager/accountMngrLoginLogs.php',
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
                    self.dtAccClient.dtInstanceLogs.ajax.reload();
                });

        return this;
    }

};