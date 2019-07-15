var dtFilterMachine = {
    dtFInstance: null,
    dtRenderDom: null,
  	showModal: function(dept){ 
          $(".filter-machine").click(function(e){

              e.preventDefault();
          		$("#displayFilterMachine").load(pages+'company/filter-machine.html',function(data,status,xhr){
                $("#modalFilterMachine").modal('show');
                    if(status == 'success'){
                         var location = convertArrStrToInt(Cookies.get('location')) || [1]; //Added in 02/12/2017
                         var reverseDrpdown = (Cookies.get('location') == '1' ? false : true);

                         autoDrpDown.getBrandName("#fltr-slctbrand"); //Auto Dropdown and Autocomplete. 
                         autoDrpDown.getAllCompany("#fltr-slctcompany","150px");
                         autoDrpDown.getBranchNameOne("#fltr-slctlocation","120px",location,reverseDrpdown); 
                         self.dtFilterMachine.autoComplete().showFormMachine().actions();                          
                         $("#fltr-slctcompany, #fltr-slctlocation").val(0).trigger('chosen:updated'); //reset


                          //Render the DataTable
                           $(this).find( "#btnFilterSearch" ).click(function(e){
                              e.preventDefault();

                              if ($.fn.DataTable.isDataTable('#dtFilterMachine')) {
                                $(this).find('#dtFilterMachine').DataTable().destroy();
                              }

                              $(this).find('#dtFilterMachine tbody').empty();
                                self.dtFilterMachine.render(dept);
                            });

                    }
                    else { alert(xhr.status + 'File not found.'); }
          		});
          
          });
      return this; 
  	},
    autoComplete: function(){
            $("#fltr-serialnum").autocomplete({
                dropdownWidth:'auto',   
                appendMethod:'replace',
                source:[
                      function( qs,add ){
                         if(qs != ''){
                           $.getJSON("assets/php/misc/serialnumberlist.php?serialnumber="+encodeURIComponent(qs),function(resp){
                                add(resp);
                           });
                        }
                        return null;
                    }
                 ]
            });
            $("#fltr-model").autocomplete({
                dropdownWidth:'auto',   
                appendMethod:'replace',
                style:{display:'inline'} , 
                source:[
                    function( qM,addM ){
                        if(qM != ''){
                            $.getJSON("assets/php/misc/models.php?model="+encodeURIComponent(qM),function(respM){
                                addM(respM);
                            });
                        }
                        return null;
                    }
                 ]
            });
        return this; 
    },
    render: function(deptData){ //Must check if all field are empty not display the table.
                var $btn = $("button#btnFilterSearch");
                this.dtFInstance = $("#dtFilterMachine").DataTable({
                "dom"     : 'lBtip',
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 10,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                 "oLanguage": {
                            "bProcessing": true,
                            "sProcessing": "Loading...",
                            "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>'
                            },
                "destroy"  : true,
                "sPaginationType": "full_numbers",
                  "buttons": [
                                {
                                    extend: "excel",
                                    className: 'dt-searchSN-excel hidden-xs',
                                    exportOptions: {columns: [1,2,3,4,5,6,7,8,9,10,11,12,14,15 ]},
                                    filename: 'MIF ' + getTodayDate()
                                },
                                //  {
                                //     extend: 'print', //Check cause a bug if rerender table.
                                //     exportOptions: { columns: ':visible' }, //exclude column 2 S/N
                                //     className: 'dt-searchSN-print hidden-xs',
                                //    customize: function ( win ) {
                                //             var elem = $(win.document.body);
                                //             elem.find('h1').remove();
                                //             var header = $("#modalMachineList .modal-title").text();
                                //                 elem.prepend("<h3>"+ header +"</h3>");
                                       
                                //     } 
                                // }
                ],
                "ordering"  : false,
                    "ajax" : {
                    "url"  : assets+"php/machine/getMachineListByCompany.php",
                    "data" : function(d){
                              d.serialnumber = $("#fltr-serialnum").val();
                              d.brand  = $("#fltr-slctbrand option:selected").val() || null;
                              d.model  = $("#fltr-model").val();
                              d.category = $("#fltr-slctcategory option:selected").val() || '';
                              d.type     = $("#fltr-slcttype option:selected").val() || '';
                              d.company  = $("#fltr-slctcompany").chosen().val() || null;
                              d.branch   = $("#fltr-slctlocation").chosen().val() || null;
                              d.user_id  = Cookies.get('user_id');
                              d.department = deptData;
                              d.billing  = $("#fltr-slctBillingType option:selected").val() || null;
                    },
                    "type" : "GET",
                    beforeSend: function(){ $btn.button('loading'); }, //Empty the search fields. 
                    complete: function(){ $btn.button('reset'); }
                  },
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
                            { data:  null, title: "Billing Type", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.billing_type) + "</span>";
                                }
                            },
                            { data:  null, title: "Location", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.branches) + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var action_elem = '';
                                        action_elem += '<div class="dropdown text-center">';
                                        action_elem += '<button class="btn btn-success dropdown-toggle btn-sm" type="button" data-toggle="dropdown">Actions'
                                                         +' <span class="caret"></span></button>'
                                                          +'<ul class="dropdown-menu dropdown-menu-right dropdown-menu-machine">'
                                                            + '<li><a href="#" class="btnViewUpdateMachine" data-target="#modalFormMachine" data-toggle="modal" data-machine='+data.id+'><i class="fa fa-pencil-square" aria-hidden="true"></i>EDIT</a></li>'
                                                            + '<li><a href="#" class="btnRemoveMachine" data-machine='+data.id+' title="Remove"><i class="fa fa-trash" aria-hidden="true"></i>REMOVE</a></li>'
                                                            + '<li><a href="#" class="btnPmHistory" data-machine='+data.id+' title="PM History">PM History</a></li>'
                                                    +'</ul></div>';
                                                       
                                    return action_elem;
                                }
                            },

                 ],
                "deferRender" : true,
                "fnDrawCallback": function(oSettings){
                     var action = JSON.parse(Cookies.get('app_module_action'));
                        if(action == null){
                            $(".btnViewUpdateMachine, .btnRemoveMachine").remove();
                        }
                        else{
                             if(action.action_mif == 'r' )
                                 $(".btnViewUpdateMachine, .btnRemoveMachine").remove();
                        }
                        return false;
                },
                "preDrawCallback": function(settings){
                       $(".dt-searchSN-print, .dt-searchSN-excel").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                       $(".dt-searchSN-print").text('').html("<i class='glyphicon glyphicon-print'></i>");
                       $(".dt-searchSN-excel").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
                }

            }); //end of dtPrinter
        return this;
    },
    showFormMachine: function(){
                 $("#displayFormMachine").load(pages+'machine/modal/form.html',function(){
                        $("#modalFormMachine .modal-title").attr('data-update-opt','2');  
                         var location = convertArrStrToInt(Cookies.get('location')) || [1]; //Added in 10/10/2017
                         var reverseDrpdown = (Cookies.get('location') == '1' ? false : true);
                        autoDrpDown.getBranchNameOne("#txtBranch","100%",location,reverseDrpdown);                        
                        autoDrpDown.getAllCompany("#slctCompany","60%");
                        autoDrpDown.getBrandName("#slctBrands"); 
                 });

        return this;
    },
    getData: function(idmachine){
                if(idmachine != null){
                    $('#displayFormMachine').find('.modal-title').text('Update Machine');
                     $.ajax({
                        type: 'GET',
                        url : assets+'php/machine/machine.php',
                        data: {action: 'view_id', idmachine: idmachine},
                        dataType: 'json',
                        success: function(data){
                            $.each(data.aaData,function(key,val){
                                $("#hdnId").val(val.id);
                                $("#hdnOldSerial").val(val.serialnumber);
                                $("#txtSerialNum").val(val.serialnumber);
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
                                $("#slctCompany").val(val.company_id).trigger('chosen:updated');
                            }); 
                            
                        },
                        error: function(data,xhr,status){ }
                     });
                } else {
                     $('#displayFormMachine').find('.modal-title').text('Add New Machine');
                }

    },
    update: function(){
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
            var unit_own    = $("#txtUnitOwn").val();    
            var billing     = $("#slctBilling option:selected").val();    
            var branch      = $("#txtBranch").chosen().val();
            var user_id     = Cookies.get('user_id');
            var data = {action:'update', idmachine:id, company_id:company_id, serialnum:serialnum, brand:brand, model:model, 
                        category:cat, type:type, pagecount: page_count, location:loc, department:depart, nouser:nouser, remarks:remarks, 
                        dateinstall: dateinstall, unit_own:unit_own, billing:billing, branch: branch, user_id: user_id};   
             $.ajax({
                type: 'POST',
                url: assets+'php/machine/machine.php',
                data: data,
                dataType: 'json',
                success: function(data){
                     if(data.aaData[0].status == 0){ // 0 = Blocked
                        promptMSG('custom','Can\'t update due to company selected is <strong>Blocked!</strong>',"<i class='fa fa-warning'></i>",null,false,true);
                    }else{
                       self.dtFilterMachine.dtFInstance.ajax.reload(function(){
                            promptMSG('success-update','Machine',null,null,true,true);
                            dtCompany.dtInstance.ajax.reload(null, false); // Refresh the Company list.
                            $('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
                                $('#modalRemoveMachine').modal('hide');
                           });
                       }, false); // Reload the data in DataTable.
                    }
                },
                error: function(xhr,status){ alert(xhr + status); }
            });                  
    },
    showRemove: function(idmachine){
        var id = idmachine;
        $("#displayRemoveMachine").load(pages+'archive/remove-machine.html',function(status){
                $("#modalRemoveMachine").modal('show');
                $("#modalRemoveMachine .modal-title").attr('data-remove-opt','2');  
                $("#removehdnId").val(id);
                 autoDrpDown.getMachineStatus("#slctMachineStatus");
        });
    },
    remove: function(idmachine){//For development
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
                success: function(data, xhr, status){
                    self.dtFilterMachine.dtFInstance.ajax.reload(function(){
                        promptMSG('remove','Machine',null,null, false);
                        dtCompany.dtInstance.ajax.reload(null, false); // Refresh the Company list.
                        $('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
                            $('#modalRemoveMachine').modal('hide');
                       });
                        // $('#modalRemoveMachine').modal('hide');
                    }, true); // Reload the data in DataTable and go to last page.

                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ resetForm("#frmRemoveMachine"); }
            }); 

    },
    actions:function(){
           $("#modalFilterMachine").on('shown.bs.modal',function(){
              $(this).on('click','button,a',function(e){
                    e.preventDefault();
                    var idmachine = $(this).data('machine');

                    if($(this).hasClass('btnViewUpdateMachine')){
                        self.dtFilterMachine.getData(idmachine);
                        $("#btnSubmit").text('Update')
                    }
                     //Pop-up message for Remove
                    else if ($(this).hasClass('btnRemoveMachine')) {
                        var idcompany = $(this).data('machine');
                        self.dtFilterMachine.showRemove(idcompany);
                    }
                    else if($(this).is('#btnFilterReset')){
                        $("#fltr-serialnum, #fltr-slctbrand, #fltr-model, #fltr-slctcategory, #fltr-slcttype, #fltr-slctBillingType").val('');
                        $("#fltr-slctcompany, #fltr-slctlocation").val(0).trigger('chosen:updated');
                        $('#dtFilterMachine').DataTable().destroy(); //Destory datatable
                        $('#dtFilterMachine thead, #dtFilterMachine tbody').empty(); //Clear table head and body.

                    }
                    else if ($(this).hasClass('btnPmHistory')) {
                        var mif_id = $(this).data('machine');
                            dtPmHistory.render(mif_id);
                    }
                    else{ }

              }); 


           });

      return this;
    }  
};