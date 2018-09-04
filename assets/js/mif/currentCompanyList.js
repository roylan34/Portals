var dtCompany = {
    dtInstance: {},
    dtInstanceLogs: null,
    dtInstanceInOut: null,
    btn : $("button[type='submit']"),
    pageDetails: function(){
                $(".content-header h1").text("Machine in Field");
                $(".content-header h1").append("<small>Current</small>");
            return this;
    },
    render: function(paramBranch){ 
        // document.title = "MIF"; // Change the title tag.
        this.dtInstance = $("#dtCompany").DataTable({
                "dom"       : 'Bl<"FilterMachine col-md-2 col-xs-12"><"DisplayMap">rtip', 
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 25,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "language": {
                            "processing": '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                            // "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                            "infoEmpty": 'No entries to show'
                        },
                "processing": true,
                "serverSide": true,
                "bDestroy"  : true,                                             //destroy existing datatable
                // // "bFilter"   : false,                                         //disable the global filtering
                // "bStateSave": true,                                          //save the pagination #, ordering, show records # and etc
                "ordering" : false,
                    "ajax" : {
                    "url"  : assets+"php/company/getCompanyList.php",
                    "type" : "POST",
                    "dataSrc": "records",
                    beforeSend: function(){ $(".dt-buttons a").addClass('disabled'); }, 
                    "data" : function(d){
                           var search_branch = $("#search-company-branch").chosen().val();
                            d.company   = $("#search-company-companyname").val();
                            d.category  = $("#search-company-category").val();
                            d.address   = $("#search-company-address").val();
                            d.s_branch =  ( paramBranch == 1 ? search_branch :  ( search_branch  ?  search_branch : paramBranch)  );
                            d.contactno = $("#search-company-contactno").val();
                            d.accmngr   = $("#search-company-accmngr").chosen().val();
                            d.s_location   = $("#search-company-location").chosen().val();
                            d.delsan_comp  = $("#search-company-delsan option:checked").val();

                            d.action_view = "company";
                            d.branch    = ( paramBranch == '1' ? null : paramBranch);
                    },
                    complete: function(){ $(".dt-buttons a").removeClass('disabled'); }
                  },
                 "buttons": [
                                {
                                    extend: "excel",
                                    className: 'dt-company-excel hidden-xs',
                                    exportOptions: { columns: [1,2,3,4,5,6,7,8,9,10,11,12],
                                        stripNewlines: false
                                       // format: {
                                        //     body: function ( data, column, row ) {
                                        //         return column === 5 ?
                                        //             data.replace(/<br\s*\/?>/ig, "\r\n"):
                                        //             data;
                                        //     } 
                                        // }
                                     },
                                    filename: 'MIF Customer ' + getTodayDate()
                                },
                                {
                                    extend: "print",
                                    exportOptions: { columns: [0,1,2,3,4,5,6,7,8,9,10,11,12],
                                       format: {
                                            body: function ( data, column, row ) {
                                                return column === 6 ?
                                                    data.replace( /<br\s*\/?>/gi, '"'+"\r\n"+'"' ) :
                                                    data; 
                                            } 
                                        }
                                     },
                                    // autoPrint: false,
                                    className: 'dt-company-print hidden-xs',
                                    customize: function(win){
                                        $(win.document.body).find(".dt-column-branches").css('max-height','0px !important');
                                    }
                                },
                                {
                                    text: 'Add New Company',
                                    className: 'btn btn-primary btn-flat btn-sm dt-button-add',
                                    action: function ( e, dt, node, config ) {
                                          self.dtCompany.modalShow();
                                    }
                                },
                                {
                                    text: 'Open Search Filter',
                                    className: 'dt-button-search',
                                    action: function ( e, dt, node, config ) {
                                            $("#dt-head-search").slideToggle('fast',function(){
                                                if($(this).is(':visible')){
                                                    node[0].innerText = 'Close Search Filter';
                                                }else{
                                                   node[0].innerText = 'Open Search Filter';
                                                    $("#dt-head-search input[type='text']").val('');  //
                                                    $("#search-company-branch, #search-company-accmngr, #search-company-location").val(0).trigger('chosen:updated'); //reset
                                                    self.dtCompany.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                                                }
                                            });
                                    }
                                }
                            ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data: null, render: function (data, type, row, meta) {
                                var sap_code = data.sap_code || null;
                                    if(sap_code != null){
                                        return "<span class='text-center'><a href='#' title='View SAP Details' id='modalSapDetails' data-toggle='modal' data-target='#modalSapDetails'>" + sap_code + "</a></span>"; 
                                    }else{
                                        return '---';
                                    }
                                }       
                            },
                            { data: null, render: function( data, type, full, meta ){ 
                                var badge_color = '';
                                var comp = data.delsan_company;
                                    if(comp == 'dosc'){
                                        badge_color ='green';
                                    }
                                    else if(comp == 'dbic'){
                                        badge_color ='blue';
                                    }
                                    else{ badge_color; }
                                    return "<span class='badge badge-"+badge_color+"'>" + comp.toUpperCase() + "</span>";                              
                                }
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class=''>" + data.company_name + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.client_category + "</span>"; 
                                }
                            },
                            { data: null,  render: function( data, type, full, meta ){
                                    if(data.number_of_machines != null){
                                        return "<span class='text-center'>" + data.number_of_machines + "</span>"; 
                                    }
                                    return 0;
                                }
                            },
                            { data:  null, "width": "20%", render: function( data, type, full, meta ){
                                    return "<span class='text-center'><a href='#' title='View Map' id='modalMap' data-toggle='modal' data-target='#modalMap'>" + data.address + "</a></span>"; 
                                }
                            },
                            { data:  null ,render: function( data, type, full, meta ){
                                return "<div class='text-left dt-column-branches'>" + isEmpty(data.main_location) + "</div>";
                                }
                            },
                            { data:  null ,render: function( data, type, full, meta ){
                                return "<div class='text-left dt-column-branches'>" + isEmpty(data.branches) + "</div>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + isEmpty(data.contact_no) + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + isEmpty(data.account_mngr_name) + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                        if(data.status == 1)
                                            return "<span class='text-left'> ACTIVE </span>";
                                        else 
                                            return "<span class='text-left' style='color:#dd4b39'> BLOCKED </span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + isEmpty(data.date_last_visit) + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    return "<button class='btn btn-xs btn-success btn-flat btnEditComp' data-comp='"+data.id+"'>Edit</button>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    var cstatus = data.status;
                                    if(cstatus == 1 ){
                                      return '<a title="View MIF" class="btn btn-xs btn-success btn-flat btnViewPrinter" data-comp="'+data.id+'" data-branch="'+data.id_branch+'" data-status="'+cstatus+'" data-compname="'+encodeURIComponent(data.company_name)+'"><i class="fa fa-list"></i></a>';
                                    }
                                    return '';
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                      return '<a title="Activity Logs" class="btn btn-xs btn-default-logs btn-flat viewMifLogs" data-comp="'+data.id+'" data-branch="'+data.id_branch+'"><i class="fa fa-clock-o"></i></a>';
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, target: 1}

                 ],
                "deferRender": true,
                "fnCreatedRow": function( row, data ) { //Add attribute id-company in first td element.
                                    $('td:eq(0)',row).attr( 'data-id-company',data.id);                                 
                            },
                "fnDrawCallback": function(oSettings){
                       var action = JSON.parse(Cookies.get('app_module_action'));
                            if(action == null){
                                 $(".btnEditComp, .dt-button-add, .viewMifLogs").remove();
                            }
                            else{
                                if(action.action_mif == "r")
                                    $(".btnEditComp, .dt-button-add, .viewMifLogs").remove();
                            }
                            return false;
                },
                "preDrawCallback": function(settings){
                           $(".dt-button-search, .dt-company-excel, .dt-company-print, .dt-button-add").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                           $(".dt-company-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                           $(".dt-company-excel").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
                },
                "footerCallback": function( tfoot, data, start, end, display ) {
                            var api = this.api();
                 
                            //Get current page
                           var total = api
                                .column( 3, { page: 'current'} )
                                .data();

                            //Total of current page
                            var res_total = 0;
                            $.each(total,function(key,val){
                                if(val['number_of_machines'] != null){
                                    res_total += parseInt(val['number_of_machines']);
                                }
                            });
                            
                            // Get over all pages
                            // var pageTotal = api
                            //     .column( 3 )
                            //     .data();
                            // $.each(pageTotal,function(key,val){
                            //     if(val['number_of_machines'] != null){
                            //         res_pagetotal += parseInt(val['number_of_machines']);
                            //     }
                            // });
                            
                            //Total over all pages
                            var res_pagetotal =0;
                            var filterBranch = ($("#search-company-branch").chosen().val() ? $("#search-company-branch").chosen().val() : paramBranch);
                             $.ajax({ //Get total count machine from database.
                                type: 'GET',
                                url : assets+'php/misc/countmachines.php',
                                data: { branch: filterBranch},
                                dataType: 'json',
                                async: false,
                                success: function(data){
                                    res_pagetotal = data[0]; 
                                },
                                error: function(data,xhr,status){ }
                             });

                            // Update footer
                            $( api.column( 3 ).footer() ).html(
                                'Page Total:'+ formatNumber(res_total)+' (Overall Total: '+ formatNumber(res_pagetotal)+')'
                            ).css('font-size','12px');

                        }
       
        });
                        $("div.FilterMachine").html('<a href="#" id="filter-machine"><i class="fa fa-filter"></i>Filter Machine</a>'); // DOM toolbarSMachine. 
                            return this;
    },
    modalShow: function(idcompany){ //Show form modal.
          $("#displayFormCompany").load(pages+'company/form.html',function(data,status,xhr){
                     $('#modalEditCompanyList').modal('show');
                      var user_branch = Cookies.get('location');
                      autoDrpDown.getBranchNameMulti("#slctCompanyBranch","100%",user_branch,true);
                      autoDrpDown.getBranchNameMulti("#slctCompanyLocation","100%",user_branch,true);
                      autoDrpDown.getClientName("#slctClientMngr","100%");
                      autoDrpDown.getSapCompany("#txtSapCompany",true);                     

                     if(idcompany != null){
                         $(this).find(".modal-title").text('Edit');
                         var $btn = $("button[type='submit']");
                         $.ajax({
                            type: 'GET',
                            url : assets+'php/company/getCompanyById.php',
                            data: {idcompany: idcompany},
                            dataType: 'json',
                            beforeSend: function(){ $btn.button('loading'); },
                            success: function(data){
                                var res_data = data.aaData[0];                             
                                    $("#hdnIdCompany").val(res_data.id);
                                    $("#txtEditCompany").val(res_data.company_name);
                                    $("#txtSapCode").val(res_data.sap_code);
                                    $("#txtSapCompany").val(res_data.sap_code).trigger('chosen:updated');
                                    $("#OldhdnEditCompany").val(res_data.company_name);
                                    $("#txtEditCategory").val(res_data.client_category);
                                    $("#txtEditAddress").val(res_data.address);
                                    $("#txtContactNo").val(res_data.contact_no);
                                    $("input[name='delsanCompany'][value='"+res_data.delsan_company+"']").prop('checked',true);
                                    $("#OldhdnClientMngr").val(res_data.id_client_mngr);
                                    $("#slctClientMngr").val(res_data.id_client_mngr).trigger('chosen:updated');
                                    $("#slctCompanyBranch").val(( res_data.id_branches == null ? null : res_data.id_branches.split(","))).trigger('chosen:updated');
                                    $("#slctCompanyLocation").val(( res_data.main_location == null ? null : res_data.main_location)).trigger('chosen:updated');
                                    $("#OldIdBranches").val(res_data.id_branches);    
                                    $("#slctStatus").val(res_data.status);
                                    $("#txtLastVisit").val(res_data.date_last_visit);     
                            },
                            error: function(data,xhr,status){ promptMSG('warning','ID Machine not exist.'); },
                            complete: function(){ $btn.button('reset'); }
                         });
                     } else { 
                        $(this).find(".modal-title").text('Add'); 
                        $("#slctCompanyBranch, #slctClientMngr, #slctCompanyLocation").val(0).trigger('chosen:updated');//Reset
                    }
              });
    },
    edit: function(){ //Edit record by company id.
          var $btn     = $("button[type='submit']");
          var id       = $("#hdnIdCompany").val();
          var company  = $("#txtEditCompany").val();
          var category = $("#txtEditCategory").val();
          var address  = $("#txtEditAddress").val();
          var branch   = ($("#slctCompanyBranch").chosen().val() ? $("#slctCompanyBranch").chosen().val().toString() : '');
          var location  = ($("#slctCompanyLocation").chosen().val() ? $("#slctCompanyLocation").chosen().val().toString() : '');
          var contactno = $("#txtContactNo").val();
          var sap_code  = $("#txtSapCode").val();
          var delsan_comp= $("input[name='delsanCompany']:checked").val();        
          // var client_service =  $("#slctClientTypeService option:selected").val();
          var accmngr   = $("#slctClientMngr").chosen().val();
          var oldaccmngr = $("#OldhdnClientMngr").val();
          var oldbranch  = $("#OldIdBranches").val();
          var status     = $("#slctStatus option:selected").val();
          var user_id    = Cookies.get('user_id');
          var last_visit = $("#txtLastVisit").val();
          var data       = {idcompany:id, company:company, category:category, address:address, location:location, branch: branch, contactno: contactno, accmngr: accmngr, 
                            oldaccmngr: oldaccmngr, oldbranch:oldbranch ,status: status, user_id: user_id, last_visit: last_visit, sap_code:sap_code, delsan_comp:delsan_comp};
           $.ajax({
                type: 'POST',
                url: assets+'php/company/updateCompany.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data){
                   self.dtCompany.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                   autoDrpDown.cacheOptComp.splice(0,1); //Clear cache option, if update company name.
                   promptMSG('success-update','Company',null,null,true,true);
                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ $btn.button('reset'); }

            });
    },
    add: function(){ //Add new Record
          var $btn     = $("button[type='submit']");
          var company  = $("#txtEditCompany").val();
          var category = $("#txtEditCategory").val();
          var address  = $("#txtEditAddress").val();
          var branch   = ($("#slctCompanyBranch").chosen().val() ? $("#slctCompanyBranch").chosen().val().toString() : '');
          var location  = ($("#slctCompanyLocation").chosen().val() ? $("#slctCompanyLocation").chosen().val().toString() : '');
          var contactno = $("#txtContactNo").val();
          var sap_code  = $("#txtSapCode").val();
          var delsan_comp= $("input[name='delsanCompany']:checked").val();
          // var client_service =  $("#slctClientTypeService option:selected").val();
          var accmngr   = $("#slctClientMngr").chosen().val();
          var status    = $("#slctStatus option:selected").val();
          var user_id   = Cookies.get('user_id');
          var last_visit = $("#txtLastVisit").val();
          var data      = {company:company, category:category, address:address, location:location, branch: removeDblQuote(branch), contactno: contactno, accmngr: accmngr, status:status, 
                            user_id: user_id, last_visit: last_visit, sap_code:sap_code, delsan_comp:delsan_comp};
          $.ajax({
                type: 'POST',
                url: assets+'php/company/addCompany.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $("#dt-head-search input[type='text']").val(''); $btn.button('loading'); }, //Empty the search fields. 
                success: function(data, xhr, status){
                    self.dtCompany.dtInstance.ajax.reload(null, false); //.page('last'); // Reload the data in DataTable and go to last page.
                    promptMSG('success-add','Company',null,null,true,true);
                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ resetForm("#frmCompany"); $("#slctCompanyBranch, #slctClientMngr").val(0).trigger('chosen:updated'); $btn.button('reset'); }

            });
    },

    actions: function(){
                $("table#dtCompany").on('click','button, a',function (e) {
                    e.preventDefault();

                    var inst = $(this);
                    var button_label = inst.text().toLowerCase();

                    //Highlight row selected.
                    if ( !inst.closest('tr').hasClass('selected') ) {  
                        self.dtCompany.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }
                    //Show modal edit
                    if (button_label == 'edit') {
                        var idcompany = $(this).data('comp');
                        self.dtCompany.modalShow(idcompany);
                    }
                    //Show modal machine list.
                    if ($(inst[0]).hasClass('btnViewPrinter')) {
                        var idcompany = inst.data('comp');
                        var company_name = decodeURIComponent(inst.data('compname'));
                        var branches  = inst.data('branch');
                        // var status    = inst.data('status');
                         dtMachine.render(idcompany, company_name, branches); 
                    }
                    //Show modal MIF activity logs.
                    if ($(inst[0]).hasClass('viewMifLogs')) {
                        var idcompany = inst.data('comp');
                         self.dtCompany.modal_mif_logs(idcompany)
                    }
                    //Search button
                    if(button_label == "search"){
                        self.dtCompany.dtInstance.ajax.reload(null, true);
                        // var branch = Cookies.get('location');
                        // self.dtCompany.render(branch); 
                    }
                     //Reset button
                    if(button_label =="reset"){
                        $("#dt-head-search input[type='text'], #search-company-delsan").val('');  //
                        $("#search-company-branch, #search-company-accmngr, #search-company-location").val(0).trigger('chosen:updated'); //reset
                        self.dtCompany.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                    }
                     //Google Map
                     if ($(inst[0]).is('#modalMap')) { 
                        var address_column = inst.text();
                        self.dtCompany.view_map_by_address(address_column);
                     }
                     if ($(inst[0]).is('#modalSapDetails')) { 
                        var sap_code = inst.text();
                        self.dtCompany.view_sap_details(sap_code);
                     }
                } );
        return this;
    },
    modal_mif_logs: function(idcompany){
        $("#displayViewMifLogs").load(pages+'company/logs.html',function(){
            $("#modalMifLogs").modal('show');
               self.dtCompany.dataTable_mif_logs(idcompany);
        });
        return this;
    },
    dataTable_mif_logs: function(idcompany){
           var $btn = $("#btnSearchMifLogs");
                this.dtInstanceLogs = $('#dtMifLogs').DataTable( { //Table logs is using Server-side processing to avoid loading all datas.
                            "dom" : "<'search-toolbar'>lrtip",
                            "autoWidth" : false,
                            "processing": true,
                            "serverSide": true,
                            "ordering": false,
                            "destroy": true,
                            "responsive": true,
                            "ajax": {
                                "url": assets+'php/company/mifLogs.php',
                                "type": "POST",
                                "dataSrc": "records",
                                "beforeSend" : function() { $btn.button('loading'); },
                                 data: function(d){
                                         d.company_id = idcompany || 0;
                                         d.search = { 'value' : $("#txtSearchLogs").val() || null } ;
                                       }
                            },
                            "columns": [
                                { "data": null },
                                { "data": "serialnumber" },
                                { "data": "fullname" },
                                { "data": "updated_at" },
                                { "data": null },
                                { "data": null }
                            ],
                            "columnDefs": [
                                {
                                    "targets": 0,
                                    "render": function ( data, type, row, meta ) {
                                       return meta.row + 1;
                                    }
                                },{
                                    "targets": 4,
                                    "render": function ( data, type, row, meta ) {
                                        var badge_color = '';
                                        var action = data.action;
                                        if(action == 'CREATE'){
                                            badge_color = 'badge-blue';
                                        }
                                        else if(action == 'UPDATE'){
                                            badge_color = 'badge-green';
                                        }
                                        else if(action == 'REMOVE'){
                                            badge_color = 'badge-red';
                                        }
                                        else{ badge_color; }
                                        return "<span class='badge "+badge_color+"'>" + action + "</span>";
                                    }
                                },{
                                    "targets": 5,
                                    "render": function ( data, type, row, meta ) {
                                        var reason = data.reason;
                                         if(reason != ''){
                                           return '<a href="#" style="color: #c34838" data-toggle="popover" title="Reason" data-placement="right" data-content="'+ reason +'" data-trigger="focus">' + 
                                              '<i class="fa fa-comment"></i></a>';
                                          }
                                        return '';
                                    }
                                }
                            ],
                            "drawCallback": function(){
                                 $('[data-toggle="popover"]').popover().on('click',function(e){
                                    e.preventDefault();
                                 });//Initialize pop-over 
                            }
                    });
                    $("div.search-toolbar").html("<div class='pull-right'><input type='search' id='txtSearchLogs' placeholder='Search' style='margin-right:10px'/>" + 
                        "<a href='#' class='btn btn-flat btn-xs btn-primary' id='btnSearchMifLogs'><i class='fa fa-search' title='Search'></i></a></div>"); //Custom search toolbar
                            $("#btnSearchMifLogs").click(function(e){
                                e.preventDefault();
                                    self.dtCompany.dtInstanceLogs.ajax.reload();                                   
                            });
        return this;
    },
    view_map_by_address: function(address){
        // $("#modalMap").modal('show');
        $("#modalMap").on('shown.bs.modal',function(){
                $(this).find(".modal-body").html('<div><iframe width="570" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q='+address+'&key=AIzaSyBGYTiq91KR14P14yQJAzIioEbJAl8Y9pQ" allowfullscreen></iframe></div>');
                
                //Make Google Maps responsive in smaller screen devices.
                var $parent_elem_iframe = $(this).find('iframe').closest('div'); //Get the width of parent div element from iframe.
                $(window).on('resize',function(){ //Change the iframe width base $parent_elem_iframe variable.
                      var parent_width = $parent_elem_iframe.width();
                          $(this).find('iframe').width(parent_width);
                }.bind($(this)));
        });
        return this;
    },
    view_sap_details: function(sap_code){
        //Code for sap full details.
         if(sap_code !=  '---'){
          $.ajax({
                type: 'GET',
                url : assets+'php/misc/sap_details.php',
                data: { action: 'all', sap_code: sap_code},
                dataType: 'json',
                success: function(data){
                    var sap = data.aaData;
                        if(sap.length > 0 ){
                            $("#sap_code").text(sap[0].sap_code);                     
                            $("#sap_company").text(sap[0].company_name);                     
                            $("#sap_category").text(sap[0].client_category);                     
                            $("#sap_address").text(sap[0].address);                     
                            $("#sap_location").text(sap[0].location);                     
                            $("#sap_contact").text(sap[0].contact_no);                     
                            $("#sap_acct_mngr").text(sap[0].account_mngr); 
                            $(".sap-message").hide();
                        }
                        else{
                            $(".sap-val").text('---');
                            $(".sap-message").show();
                            // alert("SAP Code not exist already.");
                        }                                     
                }, 
                error: function(data,xhr,status){ alert('Something went wrong!') }
             });
        }
        else{
            alert('Empty SAP Code.');
        }
    },
    countMachines: function(location){
            var loc = (location ? location : '');
            var countMachine = setInterval(function(){// Auto refresh every 10 seconds.
                 $.ajax({
                    type: 'GET',
                    url : assets+'php/misc/countmachines.php',
                    data: { branch: location},
                    dataType: 'json',
                    beforeSend: function(){ $(".mif-info-box h3.total-mif").fadeTo('fast',0.33); },
                    success: function(data){
                        $(".mif-info-box .inner h3.total-mif").text(data[0]);   
                        $(".mif-info-box .inner ul li h4.total-client-active").text('ACTIVE: ' + data[1]);  
                        $(".mif-info-box .inner ul li h4.total-client-blocked").text('BLOCKED: ' + data[2]);   
                    }, 
                    error: function(data,xhr,status){ },
                    complete: function(){ 
                        $(".mif-info-box, .mif-info-box h3.total-mif").fadeTo('slow',1);
                     }
                 });

                if(window.location.hash.slice(2) != 'current'){
                      window.clearInterval(countMachine);
                    }
            },20000);
        return this;
    },
    countInOutMachine: function(){ //IN PROGRESS
         var  dateFrom = $("#date-from").val();
         var  dateTo   = $("#date-to").val();
            $.ajax({
                type: 'GET',
                url : assets+'php/misc/count_in_out_machines.php',
                data: { dateFrom:dateFrom, dateTo:dateTo },
                dataType: 'json',
                success: function(data){
                    $("#total-in a").text(data[0]);  
                    $("#total-out a").text(data[1]);                      
                }, 
                error: function(data,xhr,status){ alert('Something went wrong!'); },
             });

    },
    viewInOutMachine: function(elem){
            var _thisElem = elem;
            var _this = this;
                if(_thisElem){
                    var title = _thisElem.getAttribute('data-type').toUpperCase() + ' Machines ';
                    $("#modalInOut .modal-title").text(title); //Change modal title.                              
                    _this.dtInstanceInOut = $('#dtInOut').DataTable({
                                // "initComplete": function(){
                                //                         autoDrpDownInvnt.getType("#search-hq-type");//Search Dropdown
                                //                         autoDrpDown.getBrandName("#search-hq-brand")
                                //                                     .getCategory("#search-hq-category");

                                //                 },
                                "dom" : "Blrtip",
                                "ordering": false,
                                "autoWidth" : false,
                                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                                "pageLength": 15,
                                "serverSide": true,
                                "processing": true,
                                "language": {
                                                "processing": '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',                        
                                                "infoEmpty": 'No entries to show'
                                },
                                "destroy": true,
                                "responsive": true,
                                "buttons": [
                                            {
                                                extend: "excel",
                                                className: 'btn-excel-inout hidden-xs',
                                                exportOptions: { columns: [1,2,3,4,5] },
                                                filename: title + getTodayDate()
                                            },
                                           {
                                                extend: "print",
                                                exportOptions: { columns: [0,1,2,3,4,5] },
                                                // autoPrint: false,
                                                className: 'btn-print-inout hidden-xs',
                                                customize: function(win){
                                                    var elem = $(win.document.body);
                                                    elem.find('h1').remove();
                                                    elem.prepend("<h4>"+ title +"</h4>"); 

                                                }
                                            },
                                            // {
                                            //     text: 'Open Search Filter',
                                            //     className: 'btn-search-inout',
                                            //     action: function ( e, dt, node, config ) {
                                            //         $("#dthead-search-inout").slideToggle('fast',function(){
                                            //             if($(this).is(':visible')){
                                            //                 node[0].innerText = 'Close Search Filter';
                                            //             }else{
                                            //                node[0].innerText = 'Open Search Filter';
                                            //                 $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //                                                          
                                            //                 self.dtCompany.dtInstanceInOut.ajax.reload(null, true);
                                            //             }
                                            //         });
                                            //     }
                                            // }
                                ],
                                "ajax": {
                                    "url": assets+'php/misc/listInOutMachines.php',
                                    "type": "POST",
                                    "dataSrc": "records",
                                     data: function(d){                                         
                                            d.serialnumber = $("#search-inout-serial").val() || '';
                                            d.brand     = $("#search-inout-brand option:selected").val() || '';
                                            d.model     = $("#search-inout-model").val() || '';
                                            d.company   = $("#search-inout-company").val() || '';
                                            d.type      = _thisElem.getAttribute('data-type');

                                            d.dateFrom = $("#date-from").val() || '';
                                            d.dateTo   = $("#date-to").val() || '';                                    
                                         }
                                },     
                                "columns": [
                                    { "data": null},
                                    { "data": "serialnumber"},
                                    { "data": "brand_name"},
                                    { "data": "model"},
                                    { "data": "company_name"},
                                    { "data": "date" }
                                    
                                ],
                                "columnDefs": [
                                    {
                                        "targets": 0,
                                        "render": function ( data, type, row, meta ) {
                                           return meta.row + 1;
                                        }
                                    }
                                ],
                                "preDrawCallback": function(settings){
                                   $(".btn-excel-inout, .btn-print-inout").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                                   $(".btn-print-inout").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                                   $(".btn-excel-inout").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
                                }
                        });
              
                }
        return this;
    }


};
