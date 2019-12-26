var dtArchiveMachine = {
    dtMArchiveInstance: null,
    dtRenderDom: null,
    pageDetails: function(){
                $(".content-header h1").text("Machine in Field");
                $(".content-header h1").append("<small>Archive</small>");
            return this;
    },
    render: function(){
        this.dtMArchiveInstance = $("#dtArchiveMachine").DataTable({
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
                    "url"  : assets+"php/archive/machine.php",
                    "data" : { action: 'view-all'  },
                    "type" : "GET",
                  },
                  "buttons": [
                                {
                                    extend: "excel",
                                    className: 'dt-archMachine-excel hidden-xs',
                                    exportOptions: {columns: [1,2,3,4,5,6,7,8,9,10,11,12,13]},
                                    filename: 'MIF Archive ' + getTodayDate()
                                },
                                {
                                    extend: 'print',
                                    exportOptions: { columns: [0,1,2,3,4,5,6,7,8,9,11,12,13]},
                                    className: 'dt-archMachine-print hidden-xs',
                                    customize: function ( win ) {
                                            var elem = $(win.document.body);
                                            elem.find('h1').remove();
                                       
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
                                                     self.dtArchiveMachine.dtMArchiveInstance.ajax.reload(null, true);
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
                                return "<span class='text-left'>" + isEmpty(data.model_name) + "</span>"; 
                                }
                            },
                            { data:  null, title: "Category", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.category_name) + "</span>";
                                }
                            },
                            { data:  null, title: "Type", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.type_name) + "</span>";
                                }
                            },
                            { data:  null, title: "Page Count", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.page_count) + "</span>";
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
                            { data:  null, title: "Billing Type", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.billing_type) + "</span>";
                                }
                            },
                            { data:  null, title: "Location", render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.branch_name) + "</span>";
                                }
                            },
                            { data:  null, title: "", render: function( data, type, full, meta ){
                                    if(parseInt(data.is_hard_delete) == 1){ //1 = soft delete, can be retrieve, 2 = cant be retrieve.
                                        return "<button class='btn btn-xs btn-success btn-flat btn-archive-marchine' data-target='#modalFormArchiveMachine' data-toggle='modal' data-idmachine='"+data.id+"'>Retrieve</button>";
                                    }
                                    return '';
                                }
                            },
                            { data:  null, title: "", render: function( data, type, full, meta ){
                                    return '<a href="#" style="color: #c34838" data-toggle="popover" title="" data-placement="left" data-content="'+data.reason+'" data-trigger="hover" data-original-title="Reason"><i class="fa fa-comment"></i></a>';
                                }
                            }

                 ],
                "columnDefs": [
                        { targets: 10, className: "never" },
                ],
                "deferRender": true,
                "fnDrawCallback": function(oSettings){
                    $('[data-toggle="popover"]').popover().on('click',function(e){
                        e.preventDefault();
                    });//pop-over 

                    var action = jwt.get('app_module_action');
                        if(action == null){
                           $(".btn-archive-marchine").remove();
                        }
                        else{
                            if(action.action_mif == 'r' )
                               $(".btn-archive-marchine").remove();
                        }
                        return false;
                },
                "preDrawCallback": function(settings){
                       $(".dt-archMachine-excel, .dt-button-machinesearch, .dt-archMachine-print").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                       $(".dt-archMachine-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                       $(".dt-archMachine-excel").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
                }
            }); //end of dtPrinter
        
                //Column Filtering
               var columnFiltering = new $.fn.dataTable.ColumnFilter(this.dtMArchiveInstance, {
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
                                          4: { html: 'input', type: 'text', width: '60px' }, //Mpdel
                                          5: { html: 'select', type: 'select',  width: '50px', //Category
                                                values: [
                                                            { value: 'MFP',  label: 'MFP' }, 
                                                            { value: 'SFP',  label: 'SFP'}
                                                        ]
                                             },
                                          6: { html: 'select', type: 'select', width: '90px',  //Type
                                                values: [
                                                            { value: 'M',  label: 'MONOCHROME' }, 
                                                            { value: 'C',  label: 'COLOR'}
                                                        ]
                                             },
                                          7: { html: 'input', type: 'text', width: '50px' }, //Page Count
                                          // 8: { html: 'input', type: 'text', width: '100px' }, //Location
                                          8: { html: 'input', type: 'text', width: '100px' }, //Department
                                          9: { html: 'input', type: 'text', width: '50px' }, //No of user
                                          10: { html: 'input', type: 'text', width: '50px' }, //Remarks
                                          11: { html: 'input', type: 'text', width: '70px' }, //Date installed
                                          12:{ html: 'select', type: 'select', width: '90px', //Billing type
                                                values: [
                                                            { value: 'METER READING', label: 'METER READING' }, 
                                                            { value: 'PER CARTRIDGE',  label: 'PER CARTRIDGE'},
                                                            { value: 'FSMA', label: 'FSMA' },
                                                            { value: 'FIXED MONTHLY', label: 'FIXED MONTHLY' },
                                                            { value: 'OUTRIGHT', label: 'OUTRIGHT' },
                                                            { value: 'TLC', label: 'TLC' }
                                                        ]
                                             },
                                           13: { html: 'input', type: 'text', width: '70px' }, //Branch
                                        }); 
                                        
            var $headerColumnFiltering = columnFiltering.dataTable.table().header(); //Column filter plugin drawback inorder to addClass.
                                       $($headerColumnFiltering).find('tr').eq(1).addClass('dt-head-machinesearch').css('display','none');
                                       $(columnFiltering.dataTable.table().node()).off('column-visibility.dt'); //Override the Column Filter plugin by removing hide/show column.

            return this;                              
    }, 
    getData: function(idmachine){
                if(idmachine != ''){
                     var $btn     = $("button[type='submit']");
                     $.ajax({
                        type: 'GET',
                        url : assets+'php/machine/machine.php',
                        data: {action:'view_archive_id', idmachine: idmachine},
                        dataType: 'json',
                        beforeSend: function(){ $btn.button('loading'); },
                        success: function(data){
                            $.each(data.aaData,function(key,val){
                                $("#hdnId").val(val.id);
                                $("#txtArchiveSerialNum").val(val.serialnumber);
                                $("#slctArchiveBrand").val(val.brand);
                                $("#txtArchiveModel").val(val.model);
                                $("#slctArchiveCategory").val(val.category);
                                $("#slctArchiveType").val(val.type);
                                $("#txtArchivePageCount").val(val.page_count);
                                $("#txArchiveLocation").val(val.location_area);
                                $("#txtArchiveDepartment").val(val.department);
                                $("#txtArchiveNoUser").val(val.no_of_user);
                                $("#txtArchiveRemarks").val(val.remarks);
                                $("#txtArchiveDateInstall").val(val.date_installed);
                                $("#txtArchiveUnitOwn").val(val.unit_owned_by);
                                $("#slctArchiveBilling").val(isUpperCase(val.billing_type));
                                $("#txtArchiveBranch").val(val.branches).trigger('chosen:updated');
                                $("#slctArchiveCompany").val(val.company_id).trigger('chosen:updated'); // slctArchiveCompany
                            }); 
                            
                        },
                        error: function(data,xhr,status){ promptMSG('warning','ID Machine not exist.'); },
                        complete: function(){ $btn.button('reset'); }
                     });
               }

    },  
    retrieve: function(){
            var $btn     = $("button[type='submit']");
            var id          = $("#hdnId").val();
            var company_id  = $("#slctArchiveCompany").chosen().val();
            var serialnum   = $("#txtArchiveSerialNum").val();
            // var brand       = $("#slctArchiveBrand option:selected").val();
            // var model       = $("#txtArchiveModel").val();
            // var cat         = $("#slctArchiveCategory option:selected").val();
            // var type        = $("#slctArchiveType option:selected").val();
            var page_count  = $("#txtArchivePageCount").val();
            var loc         = $("#txArchiveLocation").val();
            var depart      = $("#txtArchiveDepartment").val();
            var nouser      = $("#txtArchiveNoUser").val();
            var remarks     = $("#txtArchiveRemarks").val();
            var dateinstall = $("#txtArchiveDateInstall").val();    
            var billing     = $("#slctArchiveBilling option:selected").val();    
            var branch      = $("#txtArchiveBranch").chosen().val();
            var unit_own    = $("#txtArchiveUnitOwn").val();

            //For retrieve action.
            var user_id  = jwt.get('user_id');
            var data = {action:'retrieve', user_id:user_id, id:id, company_id:company_id, serialnum:serialnum, pagecount: page_count, location:loc, department:depart, nouser:nouser, remarks:remarks, 
                        dateinstall: dateinstall, billing:billing, branch: branch, unit_own:unit_own};   

             $.ajax({
                type: 'POST',
                url: assets+"php/archive/machine.php",
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data){
                   if(data.aaData[0].status == 0){ // 0 = Blocked
                        promptMSG('custom','Can\'t retrieve due to company selected is <strong>Blocked!</strong>',"<i class='fa fa-warning'></i>",null,false,true);
                   }else{
                        self.dtArchiveMachine.dtMArchiveInstance.ajax.reload(function(){
                            promptMSG('success-retrieve','Machine',null,null,false,false);
                            $("#modalFormArchiveMachine").modal('hide');//Hide Retrieve Machine
                        }, false); // Reload the data in DataTable.
                   }

                },
                error: function(xhr,status){ console.log(xhr + status); },
                complete: function(){ $btn.button('reset'); }
            });                  
    },
    modalShowArchiveMachine: function(){
            $("#displayFormArchiveMachine").load(pages+'archive/retrieve-form.html',function(){   
                    autoDrpDown.getAllCompany("#slctArchiveCompany","100%");   //Auto populated dropdown
                    autoDrpDown.getBranchNameOne("#txtArchiveBranch","100%",[1], false);  
                    autoDrpDown.getBrandName("#slctArchiveBrand");  
                    $("#txtArchiveSerialNum, #slctArchiveBrand, #txtArchiveModel").prop('disabled',true);
            });
    },   
    actions:function(){
             $("#dtArchiveMachine tbody").on('click','button',function(e){
                    e.preventDefault();
                    var inst = $(this);

                    if (!inst.closest('tr').hasClass('selected')) {  //Highlight row selected.
                        self.dtArchiveMachine.dtMArchiveInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    var idmachine = inst.data('idmachine');
                    self.dtArchiveMachine.getData(idmachine);

            
               
        });
        return this;
    }

};

