var dtCurrentPM = { //For development
    dtInstance: {},
    dtInstanceAddPm: {},
    detachBtnAdd: null,
    render: function(pmNumber, companyId){ 
        $("#hdnPmNumber").val(pmNumber); //Fill hidden input PM Number 
        $("#hdnPmCompanyId").val(companyId); //Fill hidden input Company Id    
        this.dtInstance = $("#dtCurrentPM").DataTable({
                initComplete: function(settings, json){
                           if (json.enabledMultiSelectAdd == 'false'){//Hide or Show button Add.
                               // self.dtCurrentPM.detachBtnAdd =  $("#btnAddPm").detach();
                                $("#btnAddPm").hide();
                           }
                           else{
                                $("#btnAddPm").show();
                               // if(self.dtCurrentPM.detachBtnAdd != null){
                               //       self.dtCurrentPM.detachBtnAdd.appendTo('#modalCurrentPMList div.modal-footer div');
                               //       self.dtCurrentPM.detachBtnAdd = null;                                  
                               //  }
                                
                           }
                },
                "dom"       : 'Blrtip', 
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 25,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "language": {
                            "processing": '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                            "infoEmpty": 'No entries to show'
                        },
                "processing": true,
                "serverSide": true,
                "bDestroy"  : true,                                             //destroy existing datatable
                "ordering" : false,
                    "ajax" : {
                    "url"  : assets+"php/pm/getPMList.php",
                    "type" : "POST",
                    "dataSrc": "records",
                    beforeSend: function(){ $(".dt-buttons a").addClass('disabled'); }, 
                    "data" : function(d){                       
                            d.action = "current";
                            d.pm_number  = pmNumber;
                            d.company_id = companyId;
                            d.serialnumber = $("#search-pm-serial").val() || ''; 
                            d.brand = $("#search-pm-brand").val() || '';   
                            d.model = $("#search-pm-model").val() || '';                            
                    },
                    complete: function(data){ $(".dt-buttons a").removeClass('disabled'); }
                  },
                 "buttons": [
                                {
                                    text: '<i class="fa fa-refresh" aria-hidden="true" title="Refresh"></i>',
                                    tag: 'a',
                                    className: 'btn-refresh-pm',
                                    action: function ( e, dt, node, config ) {
                                        self.dtCurrentPM.dtInstance.ajax.reload(null, true);
                                    }
                                },
                                {
                                    extend: "print",
                                    exportOptions: { columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
                                    // autoPrint: false,
                                    className: 'dt-pm-print hidden-xs',
                                    customize: function(win){
                                         var elem = $(win.document.body);
                                            elem.find('h1').remove();
                                            elem.prepend("<h4>Preventive Maintenance</h4>"); 
                                    }
                                },
                                {
                                    text: 'Add PM Machine',
                                    tag: 'a',
                                    className: 'btn-header-add-pm',
                                    action: function ( e, dt, node, config ) {
                                      var pmNumber   = $("#hdnPmNumber").val(); //Fill hidden input PM Number 
                                      var company_id = $("#hdnPmCompanyId").val(); //Fill hidden input Company Id    
                                          self.dtCurrentPM.renderAddPm(pmNumber,company_id);
                                    }
                                },
                                {
                                    text: 'Open Search Filter',
                                    className: 'dt-button-pmsearch',
                                    action: function ( e, dt, node, config ) {
                                        $("#dt-head-search").slideToggle('fast',function(){
                                            if($(this).is(':visible')){
                                                node[0].innerText = 'Close Search Filter';
                                            }else{
                                               node[0].innerText = 'Open Search Filter';
                                               $("#dt-head-search input[type='text']").val('');  //
                                               // $("#search-company-branch, #search-company-accmngr, #search-company-location").val(0).trigger('chosen:updated'); //reset
                                                //self.dtCurrentPM.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                                            }
                                        });
                                    }
                                }
                            ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                    return '<input class="chckbox-pm-sn" type="checkbox" name="sn[]" value="' + data.serialnumber + '">';
                                }       
                            }, 
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                }       
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class=''>" + data.serialnumber + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.brand_name + "</span>"; 
                                }
                            },
                            { data: null,  render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.model + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.location_area + "</span>"; 
                                }
                            },      
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.department + "</span>"; 
                                }
                            },    
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.no_of_user + "</span>"; 
                                }
                            },                         
                            { data:  null, render: function( data, type, full, meta ){
                                var date_installed = (data.date_installed != '0000-00-00' && data.date_installed != null ? data.date_installed : '');
                                return "<span class='text-center'>" + date_installed + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.unit_owned + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                var manufac_date = (data.manufacture_date != '0000-00-00' && data.manufacture_date != null ? data.manufacture_date : '');
                                return "<span class='text-center'>" + manufac_date + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.remarks + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                var page_count = data.page_count || '';
                                return "<span class='text-center'>" + page_count + "</span>"; 
                                }
                            }, 
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.toner_use + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var time_in = (data.time_in != '0000-00-00 00:00:00' && data.time_in != null ? data.time_in : '');
                                return "<span class='text-center'>" + time_in + "</span>"; 
                                }
                            },   
                            { data:  null, render: function( data, type, full, meta ){
                                 var time_out = (data.time_out != '0000-00-00 00:00:00' && data.time_out != null ? data.time_out : '');
                                return "<span class='text-center'>" + time_out + "</span>"; 
                                }
                            },                              
                            { data:  null, render: function( data, type, full, meta ){
                                var action_edit = JSON.parse(Cookies.get('app_module_action'));
                                    if(action_edit && action_edit.action_pm == "wr" && data.enabled_update == 'true'){
                                        return "<button class='btn btn-xs btn-success btn-flat btnUpdatePM' data-id='"+data.id+"' data-toggle='modal' data-target='#modalFormCurrentPM'>Update</button>";
                                    }
                                    return '';
                                }
                            }, 
                         
                 ],
                 "columnDefs": [
                        { responsivePriority: 1, target: 1},

                 ],
                "deferRender": true,
                "fnCreatedRow": function( row, data ) { //Add attribute id-company in first td element.
                        // $('td:eq(0)',row).attr( 'data-id-company',data.id);
                        $('td:eq(10)',row).addClass('border-left');                                  
                },
                "preDrawCallback": function(settings){
                        $(".dt-button-pmsearch, .dt-pm-print, .dt-button-add, .btn-refresh-pm, .btn-header-add-pm").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                        $(".dt-pm-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                },
                "fnDrawCallback": function(){
                         //Remove add button if pm_type is Technician.
                        var pm_type = Cookies.get('pm_type');
                        if(pm_type == '' || pm_type.toLowerCase() == 'technician'){
                            this.api().buttons('.btn-header-add-pm').remove();
                        }else{
                            this.api().button('.btn-header-add-pm').nodes().attr({
                                'data-toggle': 'modal', 
                                'data-target': '#modalHeaderAddPm'
                            });

                        }
                }
       
        });

                 //Handle Select All.
                $("#select-all-row").on('click',function(){
                    var rows = dtCurrentPM.dtInstance.rows({ 'search': 'applied' }).nodes();
                    var isChecked = $('input[type="checkbox"]', rows).prop('checked', this.checked);
                        if($(this).is(':checked')) //Add background color for select all.
                            $(isChecked).parent('td').addClass('chkboxes-background');
                        else
                            $(isChecked).parent('td').removeClass('chkboxes-background');
                });
                //Add background color for single checkbox
                dtCurrentPM.dtInstance.on('click','input[type="checkbox"]',function(e){ 
                     var _self = $(this);
                         _self.closest('td').toggleClass('chkboxes-background');

                });
        return this;
    },
    renderAddPm: function(pmNumber, companyId){ 
        $("#hdnAddPmNumber").val(pmNumber); //Fill hidden input PM Number 
        $("#hdnAddPmCompanyId").val(companyId); //Fill hidden input Company Id    
        this.dtInstanceAddPm = $("#dtCurrentHeaderAddPm").DataTable({
                "dom"       : 'lrtip', 
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 25,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "language": {
                            "processing": '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                            "infoEmpty": 'No entries to show'
                        },
                "processing": true,
                "serverSide": true,
                "bDestroy"  : true,                                             //destroy existing datatable
                "ordering" : false,
                    "ajax" : {
                    "url"  : assets+"php/pm/getPMList.php",
                    "type" : "POST",
                    "dataSrc": "records",
                    beforeSend: function(){ $(".dt-buttons a").addClass('disabled'); }, 
                    "data" : function(d){                       
                            d.action = "current-header";
                            d.pm_number  = pmNumber;
                            d.company_id = companyId;                      
                    },
                    complete: function(data){ $(".dt-buttons a").removeClass('disabled'); }
                  },
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                    return '<input class="chckbox-header-pm-sn" type="checkbox" name="sn[]" value="' + data.serialnumber + '">';
                                }       
                            }, 
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                }       
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class=''>" + data.serialnumber + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.brand_name + "</span>"; 
                                }
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.model + "</span>"; 
                                }
                            },                                                
                 ],
                 "columnDefs": [
                        { responsivePriority: 1, target: 1},

                 ],
                "deferRender": true,       
        });

                 //Handle Select All.
                $("#header-select-all-row").on('click',function(){
                    var rows = dtCurrentPM.dtInstanceAddPm.rows({ 'search': 'applied' }).nodes();
                    var isChecked = $('input[type="checkbox"]', rows).prop('checked', this.checked);
                        if($(this).is(':checked')) //Add background color for select all.
                            $(isChecked).parent('td').addClass('chkboxes-background');
                        else
                            $(isChecked).parent('td').removeClass('chkboxes-background');
                });
                //Add background color for single checkbox
                dtCurrentPM.dtInstanceAddPm.on('click','input[type="checkbox"]',function(e){ 
                     var _self = $(this);
                         _self.closest('td').toggleClass('chkboxes-background');

                });
        return this;
    },
    modalShow: function(){

    },
    getDataPM: function(pm_id){
            if(pm_id != null){
                 var $btn = $("button[type='submit']");
                 $.ajax({
                    type: 'GET',
                    url : assets+'php/pm/pm.php',
                    data: {action: 'view-id', pm_id: pm_id},
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        var res = data.aaData[0]; 
                            $("#hdnCurPMId").val(res.id);
                            $("#hdnCurSchedPmNum2").val(res.pm_number);
                            $("#pm-serialnum").val(res.serialnumber);
                            $("#pm-brand").val(res.brand_name);
                            $("#pm-model").val(res.model);                            
                            $("#pm-remarks").val(res.remarks);
                            $("#pm-page").val(res.page_count);
                            $("#pm-toner").val(res.toner_use); 
                            if (res.manufacture_date != "0000-00-00" && res.manufacture_date != null ) {
                                $("#pm-manufacture").val(res.manufacture_date);
                            }else{
                                $("#pm-manufacture").val('');
                            }

                            if (res.time_in != "0000-00-00 00:00:00" && res.time_in != null) {
                                $("#pm-date-in").datetimepicker('setDate', dateFormat(Date.parse(res.time_in),'mm/dd/yyyy h:MM TT'));
                            }else{
                                $("#pm-date-in").datetimepicker('setDate', '');
                            }
                         
                            if (res.time_out != "0000-00-00 00:00:00" && res.time_out != null) {
                                $("#pm-date-out").datetimepicker('setDate', dateFormat(Date.parse(res.time_out),'mm/dd/yyyy h:MM TT'));
                            }else{
                                $("#pm-date-out").datetimepicker('setDate', '');
                            }
                    },
                    error: function(data,xhr,status){ promptMSG('warning','ID PM not exist.'); },
                    complete: function(){ $btn.button('reset'); }
                 });
            } 
    },
    add: function(){
        var pmnumber    = $("#hdnPmNumber").val() || '';
        var company_id  = $("#hdnPmCompanyId").val() || '';

        if(pmnumber != '' && company_id != ''){
             var $btn      = $("button");
             var serialnum = self.dtCurrentPM.getMultipleSerial('dtInstance','.chckbox-pm-sn');
             var data = {action:'add', serialnum: serialnum, pmnumber: pmnumber, company_id:company_id };

                $.ajax({
                    type: 'POST',
                    url: assets+'php/pm/pm.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); }, //Empty the search fields. 
                    success: function(data, xhr, status){
                         if(data.aaData == "success"){                           
                            self.dtCurrentPM.dtInstance.ajax.reload(function(){
                                dtCurrentSched.dtInstance.ajax.reload(null, false);
                            }, false); //.page('last'); // Reload the data in DataTable and go to last page.
                             promptMSG('success-add','PM Machines',null,null,true,true);                           
                         }
                    },
                    error: function(xhr,status){ alert(xhr + status); },
                    complete: function(data,xhr){
                        $btn.button('reset'); 
                    }

                });
            }else{
                alert('PM number is empty.');
            }
        return this;
    },
    addPM: function(){
        var pmnumber    = $("#hdnAddPmNumber").val() || '';
        var company_id  = $("#hdnAddPmCompanyId").val() || '';

        if(pmnumber != '' && company_id != ''){
             var $btn      = $("button");
             var serialnum = self.dtCurrentPM.getMultipleSerial('dtInstanceAddPm','.chckbox-header-pm-sn');
             var data = {action:'add', serialnum: serialnum, pmnumber: pmnumber, company_id:company_id };
                $.ajax({
                    type: 'POST',
                    url: assets+'php/pm/pm.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); }, //Empty the search fields. 
                    success: function(data, xhr, status){
                         if(data.aaData == "success"){
                            self.dtCurrentPM.dtInstanceAddPm.ajax.reload(null, false); //.page('last'); // Reload the data in DataTable and go to last page.
                            self.dtCurrentPM.dtInstance.ajax.reload(null, false);
                            promptMSG('success-add','PM Machines',null,null,true,true);
                         }
                    },
                    error: function(xhr,status){ alert(xhr + status); },
                    complete: function(data,xhr){
                        $btn.button('reset'); 
                    }

                });
            }else{
                alert('PM number is empty.');
            }
        return this;
    },
    update: function(pm_id){ //Edit record by company id.
        if(pm_id != null){
              var $btn     = $("button[type='submit']");
              var manufacture = $("#pm-manufacture").val();
              var remarks     = $("#pm-remarks").val();
              var page        = $("#pm-page").val();
              var toner       = $("#pm-toner").val();
              var pm_number   = $("#hdnCurSchedPmNum2").val();
              var time_in     = ($("#pm-date-in").datetimepicker('getDate') ? dateFormat($("#pm-date-in").datetimepicker('getDate'), 'yyyy-mm-dd HH:MM') : "");
              var time_out    = ($("#pm-date-out").datetimepicker('getDate') ? dateFormat($("#pm-date-out").datetimepicker('getDate'), 'yyyy-mm-dd HH:MM') : "");

              var data        = {action:'update', pm_id:pm_id, manufacture:manufacture, remarks:remarks, page:page, toner:toner, time_in: time_in, time_out: time_out, pmnumber:pm_number};
               $.ajax({
                    type: 'POST',
                    url: assets+'php/pm/pm.php',
                    data: data,
                    dataType: 'json',
                    // beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                       self.dtCurrentPM.dtInstance.ajax.reload(function(){
                            dtCurrentSched.dtInstance.ajax.reload(null, false);
                       }, false); // Reload the data in DataTable.
                       promptMSG('success-update','PM Machine',null,null,true,true);
                    },
                    error: function(xhr,status){ alert("Something went wrong!"); },
                    // complete: function(){ $btn.button('reset'); }

                });
        }
        else{
            alert('ID PM is empty.');
        }
    },
    getMultipleSerial: function(dataTableInst, checkBoxElem){ //Get the multiple row selected IDs # if there is option selected.
            var rows = dtCurrentPM[dataTableInst].rows({ 'search': 'applied' }).nodes();
            var checkedVals = $(checkBoxElem+':checked', rows).map(function() {
                return this.value;
            }).get();

        return checkedVals.join('","');
    },
    actions: function(){
                $("#modalCurrentPMList").on('click','button, a',function (e) {
                    e.preventDefault();

                    var inst = $(this);
                    var button_label = inst.text().toLowerCase();

                    //Highlight row selected.
                    if ( !inst.closest('tr').hasClass('selected') ) {  
                        self.dtCurrentPM.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }
                    //Show modal update
                    if (button_label == 'update') {
                        var idpm = $(this).data('id');
                        self.dtCurrentPM.getDataPM(idpm);
                    }
                    //Search button
                    if(button_label == "search"){
                        self.dtCurrentPM.dtInstance.ajax.reload(null, true);
                    }
                    //Add button
                     if(button_label == "add"){
                        self.dtCurrentPM.add();
                    }
                     //Reset button
                    if(button_label =="reset"){
                        $("#dt-head-search input[type='text']").val('');  //
                        self.dtCurrentPM.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                    }
                } );
        return this;
    },
    actionsAddPm: function(){
                $("#modalHeaderAddPm").on('click','#btn-header-pm-save',function (e) {
                    e.preventDefault();
                        self.dtCurrentPM.addPM();
                        self.dtCurrentPM.dtInstanceAddPm.ajax.reload(null, true); //Reload DT when closing filter search.                    
                } );
        return this;
    }

};
