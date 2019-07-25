var dtCurrentPM = { //For development
    dtInstance: {},
    dtInstanceAddPm: {},
    detachBtnAdd: null,
    render: function(pmNumber, companyId){ 
        $("#hdnPmNumber").val(pmNumber); //Fill hidden input PM Number 
        $("#hdnPmCompanyId").val(companyId); //Fill hidden input Company Id    
        this.dtInstance = $("#dtCurrentPM").DataTable({
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
                            d.location   = $("#search-pm-loc").val() || '';                            
                            d.department = $("#search-pm-dept").val() || '';                            
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
                                    extend: "excel",
                                    className: 'dt-pm-excel hidden-xs',
                                    exportOptions: { columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
                                        stripNewlines: false
                                     },
                                    filename: 'PM Machine ' + getTodayDate()
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
                                var action_edit = jwt.get('app_module_action');
                                    if(action_edit && action_edit.action_pm == "wr" && data.enabled_update == 'true'){
                                        return "<button class='btn btn-xs btn-success btn-flat btnUpdatePM' data-id='"+data.id+"' data-toggle='modal' data-target='#modalFormCurrentPM'>Update</button>";
                                    }
                                    return '';
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                var action_edit = jwt.get('app_module_action');
                                var pm_type     = jwt.get('pm_type');
                                var action_elem = '';
                                    if(action_edit && action_edit.action_pm == "wr" && data.enabled_update == 'true' && pm_type.toLowerCase() == 'controller'){
                                        action_elem += '<div class="dropdown text-center">';
                                        action_elem += '<button class="btn btn-danger dropdown-toggle btn-xs" type="button" data-toggle="dropdown"><i class="fa fa-trash-o" aria-hidden="true"></i>'
                                                        + '<span class="caret"></span></button>'
                                                        + '<ul class="dropdown-menu">'
                                                        + '<li><a href="#" title="Remove in PM only" class="btnRemovePM" data-id="'+data.id+'">PM</li>'
                                                        + '<li><a href="#" title="Remove both in PM & MIF" class="btnRemovePmMif" data-id="'+data.id+'" data-mif-id="'+data.mif_id+'">PM & MIF</a></li>'
                                                    +'</ul></div>';
                                    }
                                    return action_elem;
                                }
                            }, 
                         
                 ],
                 "columnDefs": [
                        { responsivePriority: 1, target: 1},

                 ],
                "deferRender": true,
                "fnCreatedRow": function( row, data ) { //Add attribute id-company in first td element.
                        $('td:eq(10)',row).addClass('border-left');                                  
                },
                "preDrawCallback": function(settings){
                        $(".dt-button-pmsearch, .dt-pm-print, .dt-button-add, .btn-refresh-pm, .btn-header-add-pm, .dt-pm-excel").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                        $(".dt-pm-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                },
                "fnDrawCallback": function(settings){
                        if(settings.json.enabledMultiSelectAdd == 'false'){//Hide or Show button Add.
                            $("#btnAddPm").hide();
                        }else{
                            $("#btnAddPm").show();                                
                        }
                         //Remove add button if pm_type is Technician.
                        var pm_type = jwt.get('pm_type');
                        var action_edit = jwt.get('app_module_action');
                        if(pm_type == '' || pm_type.toLowerCase() == 'technician' || pm_type.toLowerCase() == 'monitor'){
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
                    error: function(data){ alert('Something went wrong.'); },
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
                // "fnCreatedRow": function( row, data ) { //Add attribute id in first td element.
                //     $(row).attr('id',data.id);                                  
                // },       
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
        $("#displayRemoveMachine").load(pages+'archive/remove-machine.html',function(status){
                $("#modalRemoveMachine .modal-title").attr('data-remove-opt','3');
                autoDrpDown.getMachineStatus("#slctMachineStatus");
        });
        return this;
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
                            $("#hdnCurMifId").val(res.mif_id);
                            $("#hdnCurPMId").val(res.id);
                            $("#hdnCurSchedPmNum2").val(res.pm_number);
                            $("#hdnCurOldToner").val(res.toner_use);
                            $("#pm-serialnum").val(res.serialnumber);
                            $("#pm-brand").val(res.brand);
                            $("#pm-model").val(res.model);                            
                            $("#pm-remarks").val(res.remarks);
                            $("#pm-page").val(res.page_count);
                            $("#pm-toner").val(( res.toner_use == null ? null : res.toner_use.split(","))).trigger('chosen:updated');
                            $("#hdnCurCompId").val(res.company_id); 
                            $("#pm-location").val(res.location_area); 
                            $("#pm-department").val(res.department); 
                            $("#pm-no-user").val(res.no_of_user); 
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
        var pmnumber = $("#hdnPmNumber").val() || '';
        var comp_id  = $("#hdnPmCompanyId").val() || '';
        var serialnum = self.dtCurrentPM.getMultipleSerial('dtInstance','.chckbox-pm-sn');

            if(pmnumber == '' && comp_id == ''){
                alert('PM number is empty.');
                return false;
            }
            if(serialnum.insert.length == 0 && serialnum.update.length == 0){
                alert('Please click the checkboxes (left) in each row.');
                return false;
            }
             var $btn     = $("button");             
             var data = {action:'add', serialnum: serialnum, pmnumber: pmnumber, comp_id:comp_id };

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
          
        return this;
    },
    addPM: function(){
        var pmnumber = $("#hdnAddPmNumber").val() || '';
        var comp_id  = $("#hdnAddPmCompanyId").val() || '';
        var serialnum = self.dtCurrentPM.getMultipleSerial('dtInstanceAddPm','.chckbox-header-pm-sn');
            if(pmnumber == '' && comp_id == ''){
                alert('PM number is empty.');
                return false;
            }
            if(serialnum.insert.length == 0 && serialnum.update.length == 0){
                alert('Please click the checkboxes (left) in each row.');
                return false;
            }    
             var $btn      = $("button");
             var data = {action:'add', serialnum: serialnum, pmnumber: pmnumber, comp_id:comp_id };
                $.ajax({
                    type: 'POST',
                    url: assets+'php/pm/pm.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); }, //Empty the search fields. 
                    success: function(data, xhr, status){
                         if(data.aaData[0] == "success"){
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
        return this;
    },
    update: function(pm_id){ //Edit record by company id.
        if(pm_id != null){
              var $btn     = $("button[type='submit']");
              var manufacture = $("#pm-manufacture").val();
              var remarks     = $("#pm-remarks").val();
              var page        = $("#pm-page").val();
              var toner       = ($("#pm-toner").chosen().val() ? $("#pm-toner").chosen().val().toString() : '');
              var toner_old   = $("#hdnCurOldToner").val(); 
              var pm_number   = $("#hdnCurSchedPmNum2").val();
              var time_in     = ($("#pm-date-in").datetimepicker('getDate') ? dateFormat($("#pm-date-in").datetimepicker('getDate'), 'yyyy-mm-dd HH:MM') : "");
              var time_out    = ($("#pm-date-out").datetimepicker('getDate') ? dateFormat($("#pm-date-out").datetimepicker('getDate'), 'yyyy-mm-dd HH:MM') : "");
              var comp_id     = $("#hdnCurCompId").val();
              var serialnum   = $("#pm-serialnum").val();
              var user_id     = jwt.get('user_id');

              //MIF Sync updates
              var brand     = $("#pm-brand").val();
              var model     = $("#pm-model").val();
              var loc       = $("#pm-location").val();
              var depart    = $("#pm-department").val();
              var no_of_user  = $("#pm-no-user").val();
              var mif_id      = $("#hdnCurMifId").val();

              var data        = {action:'update', brand:brand, model: model, location:loc, department:depart, no_of_user:no_of_user, mif_id:mif_id, pm_id:pm_id, manufacture:manufacture, 
                                remarks:remarks, page:page, toner:toner, time_in: time_in, time_out: time_out, pmnumber:pm_number, comp_id:comp_id, serialnum:serialnum, toner_old: toner_old,
                                user_id:user_id};
               $.ajax({
                    type: 'POST',
                    url: assets+'php/pm/pm.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                       self.dtCurrentPM.dtInstance.ajax.reload(function(){
                            dtCurrentSched.dtInstance.ajax.reload(null, false);
                       }, false); // Reload the data in DataTable.
                       promptMSG('success-update','PM Machine',null,null,true,true);
                      $("#hdnCurOldToner").val(toner);//Replicate the values of toner.
                    },
                    error: function(xhr,status){ alert("Something went wrong!"); },
                });
        }
        else{
            alert('ID PM is empty.');
        }
    },
    getMultipleSerial: function(dataTableInst, checkBoxElem){ //Get the multiple row selected IDs # if there is option selected.
            var array_sn = {update: [], insert: []};         
            var rows = dtCurrentPM[dataTableInst].rows({ 'search': 'applied' }).nodes();
            var checkedVals = $(checkBoxElem+':checked', rows).map(function() {
                // var val = parseInt($(this).closest('tr').attr('id'));
 
                // if(val > 0){                                       
                //     array_sn.update.push(val);
                // }else{
                    array_sn.insert.push(this.value);
                // }
                
            });
            return array_sn;
         // return checkedVals.join('","');
    },
    removeMachine: function(id){
        promptMSG("custom","Are you sure you want to <strong>Remove</strong> <br>this machine in PM?","Confirmation","yn",false,true,function(){
            var pm_id = id || null;
            if(pm_id){
                var $btn   = $('button');
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        data: {action: 'remove-pm',  pm_id: pm_id },
                          url: assets+'php/pm/pm.php',
                        beforeSend: function(){ 
                            $btn.button('loading');
                            $(".mif-modalPromptMSG").modal('hide');  
                        },
                        success: function(data,xhr){                            
                            setTimeout(function(){
                                 if(data.aaData[0] == 'success'){
                                    promptMSG("success-custom","Machine has been successfully <strong>Remove</strong> in PM.",'',null,false,true);
                                    $('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
                                          self.dtCurrentPM.dtInstance.ajax.reload(null, true); //Refresh the page
                                    });
                                  
                                }else{
                                    alert('Something went wrong!');
                                }
                            },300);
                        },
                        complete: function(){
                            $btn.button('reset');  
                        }
                    });
            }
            else{
                alert('Warning! Empty PM ID.');
            }
        });
        return this;
    },
    removeMachineMif: function(id, mif){
            var pm_id = id || null;
            var mif_id = mif || null;

            if(pm_id && mif_id){
                var $btn   = $('button');                  
                var reason   = $("#txtReason").val();
                var status   = $("#slctMachineStatus option:selected").val();
                var status_action = $("#slctMachineStatus option:selected").data('action');
                var user_id       = jwt.get('user_id');

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        data: {action: 'remove-pm-mif',  pm_id: pm_id, mif_id:mif_id, reason:reason, status:status, status_action:status_action, user_id: user_id },
                          url: assets+'php/pm/pm.php',
                        beforeSend: function(){ 
                            $btn.button('loading');
                            $(".mif-modalPromptMSG").modal('hide');  
                        },
                        success: function(data,xhr){                            
                            setTimeout(function(){
                                 if(data.aaData[0] == 'success'){

                                    promptMSG("success-custom","Machine has been successfully <br><strong>Remove</strong> both in PM & MIF.",null,null,false,true);
                                    self.dtCurrentPM.dtInstance.ajax.reload(null, true); //Refresh the page
                                    $('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
                                        $('#modalRemoveMachine').modal('hide');
                                    });
                                  
                                }else{
                                    alert('Something went wrong!');
                                }
                            },300);
                        },
                        complete: function(){
                            resetForm("#frmRemoveMachine");
                            $btn.button('reset');  
                        }
                    });
                    
            }
            else{
                alert('Warning! Empty PM ID.');
            }
        return this;
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
                    if(inst.hasClass('btnRemovePM')){
                        self.dtCurrentPM.removeMachine(inst.data('id'));
                    }
                    if(inst.hasClass('btnRemovePmMif')){
                        var mif_id = inst.data('mif-id');
                        var pm_id = inst.data('id');
                            $("#removehdnId").val(mif_id);
                            $("#removehdnPmId").val(pm_id);
                            $("#modalRemoveMachine").modal('show');
                    }
                } );
        return this;
    },
    actionsAddPm: function(){
                $("#modalHeaderAddPm").on('click','#btn-header-pm-save',function (e) {
                    e.preventDefault();
                        self.dtCurrentPM.addPM();
                        // self.dtCurrentPM.dtInstanceAddPm.ajax.reload(null, true); //Reload DT when closing filter search.                    
                } );
        return this;
    }

};
