var dtMachine = {
    dtMInstance: null,
    dtRenderDom: null,
	render: function(paramId,branch){
  		this.dtRenderDom = $("#displayViewMachine").load(pages+'machine/modal/index.html',function(data,status,xhr){
            if(status == 'success'){
                $("#modalMachineList").modal('show');
                    var compInfo = companyInfo.name(paramId);
                    var exclBranch = (branch == null || branch == '' ? null : convertArrStrToInt(branch));
                      $(this).find("#machine-company").text('Machine list in '+ compInfo);
                      // $("#machine-branch").text('Branch: '+branch);
                       self.dtMachine.dataTable(paramId,exclBranch).addButton(paramId).actions();
                       self.dtMachine.modalShowMachine(exclBranch);

            }
            else { alert(xhr.status + 'File not found.'); }
  		});
        return this; 
	},
    dataTable: function(param_Id,branch){
        // var set_branch = (Cookies.get('location') == '1' ? null : (branch == null || branch == '' ? null : branch.toString() )); // 1 = mean ALL Branch
         var set_branch = (Cookies.get('location') == '1' ? null :  Cookies.get('location')); // Fixed display machine by user logged location.
        this.dtMInstance = $("#dtMachine").DataTable({
                "dom"     : 'Blrtip',
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 10,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                 "oLanguage": {
                                "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                                "sInfoEmpty": 'No entries to show'
                            },
                "bDestroy"  : true,
                "sPaginationType": "full_numbers",
                "ordering"  : false,
                    "ajax" : {
                    "url"  : assets+"php/machine/getMachineListByCompany.php",
                    "data" : {company_id: param_Id, branch:set_branch},
                    "type" : "GET",
                    beforeSend: function(){ $(".btnViewPrinter").prop('disabled', true); },
                    complete : function(data){ 
                        $.each($(".btnViewPrinter"),function(i,val){
                           if($(this).data('status') == 1){
                               $(this).prop('disabled',false);
                           }else{
                               $(this).prop('disabled',true);
                           }
                        });
                    }
                  },
                  "buttons": [
                                {
                                    extend: "excel",
                                    className: 'dt-company-excel hidden-xs',
                                    exportOptions: {columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18 ]},
                                    filename: 'MIF ' + getTodayDate()
                                },
                                {
                                    extend: 'print',
                                    exportOptions: { columns: [0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18 ]},
                                    className: 'dt-machine-print hidden-xs',
                                    // autoPrint: false, // For debugging
                                    customize: function ( win ) {
                                            var elem = $(win.document.body);
                                            elem.find('h1').remove();
                                            var header = $("#modalMachineList").find(".modal-title").text();
                                                elem.prepend("<h4>"+ header +"</h4>"); 
                                       
                                    }
                                },
                                {
                                    text: 'Open Search Filter',
                                    className: 'dt-button-machinesearch',
                                    action: function ( e, dt, node, config ) {
                                            $(".dt-head-machinesearch").slideToggle('fast',function(){
                                                if($(this).is(':visible')){
                                                    node[0].innerText = 'Close Search Filter';
                                                }else{
                                                   node[0].innerText = 'Open Search Filter';
                                                     $(".dt-head-machinesearch input[type='text'], select").val(''); 
                                                     self.dtMachine.dtMInstance.ajax.reload(null, true);
                                                }
                                            });
                                                   
                                    }
                                }
                ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1;
                                    }       
                            },
                            { data:  null, title: "Company name", render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + isEmpty(data.company_name) + "</span>";
                                }
                            },
                            { data:  null, title: "S/N", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.serialnumber) + "</span>";
                                }
                            },
                            { data:  null, title: "Brand", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.brand_name) + "</span>";
                                }
                            },
                            { data:  null, title: "Model", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.model) + "</span>"; 
                                }
                            },
                            { data:  null, title: "Toner", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.toner) + "</span>"; 
                                }
                            },
                            { data:  null, title: "Category", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.category) + "</span>";
                                }
                            },
                            { data:  null, title: "Type", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.type) + "</span>";
                                }
                            },
                            { data:  null, title: "Page Count", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.page_count) + "</span>";
                                }
                            },
                            { data:  null, title: "Location Area", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.location_area) + "</span>";
                                }
                            },
                            { data:  null, title: "Department", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.department) + "</span>";
                                }
                            },
                            { data:  null, title: "No. of User", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.no_of_user + "</span>";
                                }
                            },
                            { data:  null, title: "Remarks", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.remarks) + "</span>";
                                }
                            },
                            { data:  null, title: "Date Installed", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.date_installed) + "</span>";
                                }
                            },
                            { data:  null, title: "Unit Owned", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.unit_owned_by) + "</span>";
                                }
                            },
                            { data:  null, title: "Account Manager", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.account_manager) + "</span>";
                                }
                            },
                             { data:  null, title: "Date last visit", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.date_last_visit) + "</span>";
                                }
                            },
                            { data:  null, title: "Billing Type", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.billing_type) + "</span>";
                                }
                            },
                            { data:  null, title: "Location", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.branches) + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<button class='btn btn-xs btn-success btn-flat btnViewUpdateMachine' data-target='#modalFormMachine' data-toggle='modal' data-machine='"+data.id+"'>Update</button>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    return "<a href='#' class='btn btn-xs btn-warning btn-flat btnRemoveMachine' data-machine='"+data.id+"' title='Remove'><i class='fa fa-trash'></i></a>";
                                }
                            }

                 ],
                // "fnCreatedRow": function( row, data ) { //Add attribute id-company in first td element.
                //         $('td:eq(1)',row).addClass("never") //Hide column company name.                                 
                // },
                // "headerCallback": function(thead,data){
                //         $(thead).find('th').eq(1).addClass("never"); //Class never is used to fully hide column in all screen size.
                // },
                "columnDefs": [
                        { targets: 1, className: "never" },
                        { targets: 15, className: "none" },
                        { targets: 16, className: "none" }
                        // { targets: 17, className: "none" }
                ],
                "deferRender": true,
                "fnDrawCallback": function(oSettings){
                    var action = JSON.parse(Cookies.get('app_module_action'));
                    var is_client = Cookies.get('is_client_user');
                        if(action == null || is_client == 1 ){
                            $(".btnViewUpdateMachine, .dt-button-machineadd, .btnRemoveMachine").remove();
                        }
                        else{
                             if(action.action_mif == 'r' )
                                $(".btnViewUpdateMachine, .dt-button-machineadd, .btnRemoveMachine").remove();
                        }
                        return false;
                },
                "preDrawCallback": function(settings){
                       $(".dt-company-excel, .dt-button-machinesearch, .dt-machine-print").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                       $(".dt-machine-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                       $(".dt-company-excel").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
                }

            }); //end of dtPrinter
        
                //Column Filtering
               var columnFiltering = new $.fn.dataTable.ColumnFilter(this.dtMInstance, {
                                          1: { html: 'input', type: 'text', width: '70px'},    // 
                                          2: { html: 'input', type: 'text', width: '70px' },  // S/N
                                          3: {                                                // Brand
                                            html: 'select', type: 'select', width: '80px',
                                            values: [{
                                                value: 'HP',  label: 'HP'
                                            }, {
                                                value: 'OKI',  label: 'OKI'
                                            }, {
                                                value: 'CANON',  label: 'CANON'
                                            }, {
                                                value: 'EPSON',  label: 'EPSON'
                                            }, {
                                                value: 'RICOH',  label: 'RICOH'
                                            }, {
                                                value: 'KODAK',  label: 'KODAK'
                                            }, {
                                                value: 'FUJITSU',  label: 'FUJITSU'
                                            }, {
                                                value: 'SAMSUNG',  label: 'SAMSUNG'
                                            }, {
                                                value: 'BROTHER',  label: 'BROTHER'
                                            }, {
                                                value: 'FUJI_XEROX',  label: 'FUJI_XEROX'
                                            }]
                                          },
                                          4: { html: 'input', type: 'text', width: '60px' }, //Model
                                          5: { html: 'input', type: 'text', width: '60px' }, //Toner
                                          6: { html: 'select', type: 'select',  width: '50px', //Category
                                                values: [
                                                            { value: 'MFP',  label: 'MFP' }, 
                                                            { value: 'SFP',  label: 'SFP'}
                                                        ]
                                             },
                                          7: { html: 'select', type: 'select', width: '90px',  //Type
                                                values: [
                                                            { value: 'MONOCHROME',  label: 'MONOCHROME' }, 
                                                            { value: 'COLOR',  label: 'COLOR'}
                                                        ]
                                             },
                                          8: { html: 'input', type: 'text', width: '50px' }, //Page Count
                                          9: { html: 'input', type: 'text', width: '100px' }, //Location
                                          10: { html: 'input', type: 'text', width: '100px' }, //Department
                                          11: { html: 'input', type: 'text', width: '50px' }, //No of user
                                          12: { html: 'input', type: 'text', width: '50px' }, //Remarks
                                          13: { html: 'input', type: 'text', width: '70px' }, //Date installed
                                          14: { html: 'input', type: 'text', width: '70px' }, //Unit Owned
                                          15:{ html: 'select', type: 'select', width: '90px', //Billing type
                                                values: [
                                                            { value: 'METER READING', label: 'METER READING' }, 
                                                            { value: 'PER CARTRIDGE',  label: 'PER CARTRIDGE'},
                                                            { value: 'FSMA', label: 'FSMA' },
                                                            { value: 'FIXED MONTHLY', label: 'FIXED MONTHLY' },
                                                            { value: 'OUTRIGHT', label: 'OUTRIGHT' }
                                                        ]
                                             },
                                           16: { html: 'input', type: 'text', width: '70px' }, //Branch
                                        }); 
                                        
            var $headerColumnFiltering = columnFiltering.dataTable.table().header(); //Column filter plugin drawback inorder to addClass.
                                       $($headerColumnFiltering).find('tr').eq(1).addClass('dt-head-machinesearch').css('display','none');
                                       $(columnFiltering.dataTable.table().node()).off('column-visibility.dt'); //Override the Column Filter plugin by removing hide/show column.

            return this;                              
    },
    modalShowMachine: function(branch){
            $("#displayFormMachine").load(pages+'machine/modal/form.html',function(){
                     $("#modalFormMachine .modal-title").attr('data-update-opt','1');
                      autoDrpDown.getAllCompany("#slctCompany","60%");   //Auto populated dropdown
                      autoDrpDown.getBranchNameOne("#txtBranch","100%",branch,true);
                      autoDrpDown.getBrandName("#slctBrands");  
                      
             });
    },      
    getData: function(idmachine){
                if(idmachine != null){
                    $('#displayFormMachine').find('.modal-title').text('Update Machine');
                     var $btn = $("button[type='submit']");
                     $.ajax({
                        type: 'GET',
                        url : assets+'php/machine/machine.php',
                        data: {action:'view_id', idmachine: idmachine},
                        dataType: 'json',
                        beforeSend: function(){ $btn.button('loading'); },
                        success: function(data){
                            $.each(data.aaData,function(key,val){
                                $("#hdnId").val(val.id);
                                $("#hdnOldSerial, #txtSerialNum").val(val.serialnumber);
                                $("#slctBrands").val(val.brand);
                                $("#txtModel").val(val.model);
                                $("#slctCategory").val(isUpperCase(val.category));
                                $("#slctType").val(isUpperCase(val.type));
                                $("#txtPageCount").val(val.page_count);
                                $("#txtLocation").val(val.location_area);
                                $("#txtDepartment").val(val.department);
                                $("#txtNoUser").val(val.no_of_user);
                                $("#txtRemarks").val(val.remarks);
                                $("#txtDateInstall").val(val.date_installed);
                                $("#txtUnitOwn").val(val.unit_owned_by);
                                $("#slctBilling").val(isUpperCase(val.billing_type));
                                $("#txtBranch").val(val.branches).trigger('chosen:updated');
                                $(autoDrpDown.cacheOptCompInst).val(val.company_id).trigger('chosen:updated'); // slctCompany
                                $(autoDrpDown.cacheOptCompInst).prop('disabled', false).trigger("chosen:updated");
                            }); 
                            
                        },
                        error: function(data,xhr,status){ promptMSG('warning','ID Machine not exist.'); },
                        complete: function(){ $btn.button('reset'); }
                     });
                } else {
                     $('#displayFormMachine').find('.modal-title').text('Add New Machine');
                }

    },
    update: function(){
            var $btn     = $("button[type='submit']");
            var id          = $("#hdnId").val();
            var company_id  = $("#slctCompany").chosen().val();
            var serialnum   = $("#txtSerialNum").val();
            var brand       = $("#slctBrands option:selected").val();
            var model       = $("#txtModel").val();
            var cat         = $("#slctCategory option:selected").val();
            var type        = $("#slctType option:selected").val();
            var page_count  = $("#txtPageCount").val();
            var loc         = $("#txtLocation").val();
            var depart      = $("#txtDepartment").val();
            var nouser      = $("#txtNoUser").val();
            var remarks     = $("#txtRemarks").val();
            var dateinstall = $("#txtDateInstall").val();    
            var billing     = $("#slctBilling option:selected").val();    
            var branch      = $("#txtBranch").chosen().val();
            var unit_own    = $("#txtUnitOwn").val();
            var user_id     = Cookies.get('user_id');
            var data = {action:'update', idmachine:id, company_id:company_id, serialnum:serialnum, brand:brand, model:model, 
                        category:cat, type:type, pagecount: page_count, location:loc, department:depart, nouser:nouser, remarks:remarks, 
                        dateinstall: dateinstall, billing:billing, branch: branch, unit_own:unit_own, user_id: user_id};   

             $.ajax({
                type: 'POST',
                url: assets+'php/machine/machine.php',
                data: data,
                dataType: 'json',
                timeout: 1000,
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data){
                    if(data.aaData[0].status == 0){ // 0 = Blocked
                        promptMSG('custom','Can\'t update due to company selected is <strong>Blocked!</strong>',"<i class='fa fa-warning'></i>",null,false,true);
                   }else{
                       self.dtMachine.dtMInstance.ajax.reload(function(){
                            promptMSG('success-update','Machine',null,'',false,true);
                            dtCompany.dtInstance.ajax.reload(null, false); // Refresh the Company list.
                        }, false); // Reload the data in DataTable.
                   }
                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ $btn.button('reset'); }
            });  
           
    },
    addButton: function(compId){ //Button Add New Machine
       var $addButton = $('<a class="btn btn-primary btn-flat btn-sm dt-button-machineadd" href="#" data-target="#modalFormMachine" style="margin-right:0.5em; margin-bottom:0.5em" data-toggle="modal"><span>Add New Machine</span></a>').
                          insertBefore('.dt-button-machinesearch');
            $($addButton).on('click',function(){
                   $(autoDrpDown.cacheOptCompInst).val(compId).trigger('chosen:updated'); // Reset slctCompany
                   $(autoDrpDown.cacheOptCompInst).prop('disabled', true).trigger("chosen:updated");
                   $('#displayFormMachine').find('.modal-title').text('Add New Machine');
                   $("#txtBranch").val(0).trigger('chosen:updated'); //Reset drpdown Branch
                   $("#btnSubmit").text('Save')
            });
            return this;
    },
    add: function(){
            var $btn     = $("button[type='submit']");
            var company_id  = $("#slctCompany").chosen().val();
            var serialnum   = $("#txtSerialNum").val();
            var brand       = $("#slctBrands option:selected").val();
            var model       = $("#txtModel").val();
            var cat         = $("#slctCategory option:selected").val();
            var type        = $("#slctType option:selected").val();
            var page_count  = $("#txtPageCount").val();
            var loc         = $("#txtLocation").val();
            var depart      = $("#txtDepartment").val();
            var nouser      = $("#txtNoUser").val();
            var remarks     = $("#txtRemarks").val();
            var dateinstall = $("#txtDateInstall").val();    
            var billing     = $("#slctBilling option:selected").val();    
            var branch      = $("#txtBranch").chosen().val();
            var unit_own    = $("#txtUnitOwn").val();
            var user_id     = Cookies.get('user_id');
            var data = {action:'add', company_id:company_id, serialnum:serialnum, brand:brand, model:model, 
                        category:cat, type:type, pagecount: page_count, location:loc, department:depart, nouser:nouser, remarks:remarks, 
                        dateinstall: dateinstall, billing:billing, branch: branch, unit_own:unit_own, user_id: user_id};  
          $.ajax({
                type: 'POST',
                url: assets+'php/machine/machine.php',
                data: data,
                dataType: 'json',
                timeout: 1000,
                beforeSend: function(){ $(".dt-head-machinesearch input[type='text'], .dt-head-machinesearch select").val('');  $btn.button('loading'); }, //Empty the search fields. 
                success: function(data, xhr, status){
                    self.dtMachine.dtMInstance.ajax.reload(function(){
                        promptMSG('success-add','Machine',null,'',false,true);
                        dtCompany.dtInstance.ajax.reload(null, false); // Refresh the Company list.
                    }, false).page('last'); // Reload the data in DataTable and go to last page.
                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ $btn.button('reset'); $("#frmMachine input ,#frmMachine select:not('#slctCompany')").val(''); $("#txtBranch").val(0).trigger('chosen:updated'); }

            });
    },
    showRemove: function(idmachine){
        var id = idmachine;
        $("#displayRemoveMachine").load(pages+'archive/remove-machine.html',function(status){
                $("#modalRemoveMachine").modal('show');
                $("#modalRemoveMachine .modal-title").attr('data-remove-opt','1');  
                $("#removehdnId").val(id);
                 autoDrpDown.getMachineStatus("#slctMachineStatus");
        });
    },
    remove: function(idmachine){//For development
            var $btn     = $("button[type='submit']");
            var id       = $("#removehdnId").val();
            var reason   = $("#txtReason").val();
            var status   = $("#slctMachineStatus option:selected").val();
            var status_action = $("#slctMachineStatus option:selected").data('action');
            var user_id  = Cookies.get('user_id');
            var data = { action:'remove', id:id, reason:reason, status:status, status_action:status_action, user_id: user_id} 
            
            $.ajax({
                type: 'POST',
                url: assets+'php/archive/machine.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data, xhr, status){
                    self.dtMachine.dtMInstance.ajax.reload(function(){
                        promptMSG('remove','Machine',null,null,false);
                        dtCompany.dtInstance.ajax.reload(null, false); // Refresh the Company list.
                        $('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
                            $('#modalRemoveMachine').modal('hide');
                       });
                    }, true); // Reload the data in DataTable and go to last page.

                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ resetForm("#frmRemoveMachine"); $btn.button('reset'); }
            }); 

    },
    actions: function(){
            $("#dtMachine tbody").on('click','button,a',function(e){
                    e.preventDefault();
                    var inst = $(this);

                    if (inst.closest('tr').hasClass('selected')) {  //Highlight row selected.
                         // inst.closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtMachine.dtMInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    if($(this).hasClass('btnViewUpdateMachine')){
                        var idmachine = inst.data('machine');
                        self.dtMachine.getData(idmachine);
                        $("#btnSubmit").text('Update')
                    }
                   
                     //Pop-up message for Remove
                    if ($(inst[0]).hasClass('btnRemoveMachine')) {
                        var idcompany = $(this).data('machine');
                        self.dtMachine.showRemove(idcompany);
                    }
              });
        return this;
    }

};

