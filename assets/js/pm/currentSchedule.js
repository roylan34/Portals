var dtCurrentSched = {
    dtInstance: {},
    pageDetails: function(){
                $(".content-header h1").text("Preventive Maintenance");
                $(".content-header h1").append("<small>Current</small>");
            return this;
    },
    render: function(){ 
        // document.title = "MIF"; // Change the title tag.
        this.dtInstance = $("#dtCurrentSched").DataTable({
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
                    "url"  : assets+"php/pm/getScheduleList.php",
                    "type" : "POST",
                    "dataSrc": "records",
                    beforeSend: function(){ $(".dt-buttons a").addClass('disabled'); }, 
                    "data" : function(d){
                        
                            d.action = "current";
                            d.pm_number    = $("#search-sched-pmnumber").val() || '';
                            d.company_name = $("#search-sched-company").val() || '';
                            d.sched_date   = $("#search-sched-schedule").val() || '';
                            d.technician   = $("#search-sched-technician").val() || '';
                            d.branch       = Cookies.get('branch_pm');
                            d.pm_type      = Cookies.get('pm_type');
                            d.userid       = Cookies.get('user_id');
                    },
                    complete: function(){ $(".dt-buttons a").removeClass('disabled'); }
                  },
                 "buttons": [
                                {
                                    text: '<i class="fa fa-refresh" aria-hidden="true" title="Refresh"></i>',
                                    tag: 'a',
                                    className: 'btn-refresh-pm',
                                    action: function ( e, dt, node, config ) {
                                        self.dtCurrentSched.dtInstance.ajax.reload(null, true);
                                    }
                                },
                                {
                                    extend: "print",
                                    exportOptions: { columns: [0,1,2,3,4,5,6] },
                                    // autoPrint: false,
                                    className: 'dt-sched-print hidden-xs',
                                    customize: function(win){
                                          var elem = $(win.document.body);
                                            elem.find('h1').remove();
                                            elem.prepend("<h4>Preventive Maintenance <small>schedule list</small></h4>"); 
                                    }
                                },
                                {
                                    text: 'Add Schedule',
                                    className: 'btn btn-primary btn-flat btn-sm dt-button-add',
                                    action: function ( e, dt, node, config ) {
                                        $("#modalFormCurrentSched .modal-title").text('Add'); 
                                        $("#modalFormCurrentSched #sched-date-entered").text(getTodayDateStandard());                                       
                                    }
                                },
                                {
                                    text: 'Open Search Filter',
                                    className: 'dt-button-schedsearch',
                                    action: function ( e, dt, node, config ) {
                                        $("#dt-head-schedsearch").slideToggle('fast',function(){
                                            if($(this).is(':visible')){
                                                node[0].innerText = 'Close Search Filter';
                                            }else{
                                               node[0].innerText = 'Open Search Filter';
                                               $("#dt-head-schedsearch input[type='text']").val('');  //
                                               //self.dtCurrentSched.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
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
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class=''>" + data.pm_number + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.company_name + "</span>"; 
                                }
                            },
                            { data: null,  render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.schedule_date + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var technician = data.technician || '';
                                return "<span class='text-center'>" + technician + "</span>"; 
                                }
                            },      
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.date_entered + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    var badge_color = '';
                                    var status = data.status.toUpperCase() || '';
                                            if(status == 'DONE'){
                                                // badge_color = 'badge-blue';
                                                status = 'PM DONE';
                                            }
                                            else if(status == 'PENDING'){
                                                badge_color = "badge-red";
                                            }
                                            else if(status == 'IN-PROGRESS'){
                                                badge_color = 'badge-orange';                                               
                                            }
                                            else
                                            { badge_color; }

                                    return "<span class='badge "+badge_color+"'>" + status + "</span>";
                                }
                            },                            
                            { data:  null, render: function( data, type, full, meta ){
                                var action_edit = JSON.parse(Cookies.get('app_module_action'));
                                var pm_type = Cookies.get('pm_type');
                                    if(action_edit && action_edit.action_pm == "wr" && pm_type.toLowerCase() == 'controller'){
                                        return "<button class='btn btn-xs btn-success btn-flat btnEditPM' data-id='"+data.id+"' data-pmnumber='"+data.pm_number+"' data-toggle='modal' data-target='#modalFormCurrentSched'>Edit</button>";
                                    }
                                    return '';
                                }
                            }, 
                            { data:  null, render: function( data, type, full, meta ){
                                  var action_pm = JSON.parse(Cookies.get('app_module_action'));
                                    if(action_pm && action_pm.action_pm == "wr"){
                                        return "<button class='btn btn-xs btn-success btn-flat btnPM' data-pmnumber='"+data.pm_number+"' data-comp-id='"+data.company_id+"' data-toggle='modal' data-target='#modalCurrentPMList'>PM</button>";
                                    }
                                    return '';
                                }
                            },
                         
                 ],
                 "columnDefs": [
                        { responsivePriority: 1, target: 0},

                 ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                        $(".dt-button-schedsearch, .dt-sched-print, .dt-button-add, .btn-refresh-pm").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                        $(".dt-sched-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                },
                "fnDrawCallback": function(){
                    //Remove add button if pm_type is Technician.
                    var pm_type = Cookies.get('pm_type');
                        if(pm_type == '' || pm_type.toLowerCase() == 'technician'){
                            this.api().buttons('.dt-button-add').nodes().remove();
                            $("#btnAddPm").remove();
                        }else{
                            this.api().button('.dt-button-add').nodes().attr({
                                'data-toggle': 'modal', 
                                'data-target': '#modalFormCurrentSched'
                            });
                        }
                }
       
        });
        return this;
    },
    modalShow: function(){ //Show form modal.

        $("#displayFormSchedule").load(pages+'pm/current/form.html',function(){
            autoDrpDown.getAllCompany("#sched-company","100%");   //Auto populated dropdown Company
            self.dtCurrentSched.update_cancel().update_close();

            //Hide Schedule modal
            $(this).find('#modalFormCurrentSched').on('hidden.bs.modal', function() { //Reset form when modal hidden
                $('body').addClass('modal-open');      

                resetForm("#frmCurrentSched"); 
                $("#sched-company").val(0).trigger('chosen:updated'); 
                $("#sched-number").text('...');     
                $(this).find("#frmCurrentSched input[type='hidden']").val('');        
            });
        });

        $("#displayPMList").load(pages+'pm/current/pm.html',function(){
            dtCurrentPM.actions().actionsAddPm(); //Actions

            //When Hidden PM modal.
            $('#modalCurrentPMList').on('hidden.bs.modal', function() { //Reset form when modal hidden     
                $(this).find("input[type='hidden']").val('');        
            });

            $('#modalHeaderAddPm').on('hidden.bs.modal', function() { //Reset form when modal hidden     
                $(this).find("input[type='hidden']").val('');
                $('body').addClass('modal-open');          
            });
        });

        $("#displayFormPM").load(pages+'pm/current/form-pm.html',function(){

        });
        return this;
    },
    getDataSched: function(id_pm){
            if(id_pm != null){
                 $(this).find(".modal-title").text('Edit');
                 var $btn = $("button[type='submit']");
                 $.ajax({
                    type: 'GET',
                    url : assets+'php/pm/schedule.php',
                    data: {action: 'view-id', id_pm: id_pm},
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        var res_data = data.aaData[0];                             
                            $("#hdnCurSchedId").val(res_data.id);
                            $("#hdnCurSchedPmNum").val(res_data.pm_number);
                            $("#sched-number").text(res_data.pm_number);
                            $("#sched-company").val(res_data.company_id).trigger('chosen:updated');
                            $("#sched-schedule").val(res_data.schedule_date);
                            $("#sched-technician").val(res_data.technician);
                            $("#sched-date-entered").text(res_data.date_entered);
                            $("#sched-contact-name").val(res_data.contact_name);
                            $("#sched-contact-num").val(res_data.contact_number);
                            $("#sched-contact-email").val(res_data.email_address);
                            $("#sched-contact-dept").val( res_data.department);    
                    },
                    error: function(data,xhr,status){ promptMSG('warning','ID Schedule not exist.'); },
                    complete: function(){ $btn.button('reset'); }
                 });
            } 
    },
    edit: function(id){ //Edit record by company id.
          var $btn     = $("button[type='submit']");
          var company       = ($("#sched-company").chosen().val() ? $("#sched-company").chosen().val().toString() : '');
          var sched_date    = $("#sched-schedule").val();
          var technician    = $("#sched-technician").val();        
          var contact_name  = $("#sched-contact-name").val();
          var contact_no    = $("#sched-contact-num").val();
          var contact_email = $("#sched-contact-email").val();
          var contact_dept  = $("#sched-contact-dept").val();
          var data      = {action:'edit', id_pm:id, company:company, sched_date:sched_date, technician:technician, contact_name:contact_name, contact_no: contact_no, email: contact_email,
                            department: contact_dept};
           $.ajax({
                type: 'POST',
                url: assets+'php/pm/schedule.php',
                data: data,
                dataType: 'json',
                // beforeSend: function(){ $btn.button('loading'); },
                success: function(data){
                   self.dtCurrentSched.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                   promptMSG('success-update','Schedule',null,null,true,true);
                },
                error: function(xhr,status){ alert("Something went wrong!"); },
                // complete: function(){ $btn.button('reset'); }

            });
    },
    add: function(){ //Add new Record
          var $btn     = $("button[type='submit']");
          var company       = ($("#sched-company").chosen().val() ? $("#sched-company").chosen().val().toString() : '');
          var sched_date    = $("#sched-schedule").val();
          var technician    = $("#sched-technician").val();        
          var contact_name  = $("#sched-contact-name").val();
          var contact_no    = $("#sched-contact-num").val();
          var contact_email = $("#sched-contact-email").val();
          var contact_dept  = $("#sched-contact-dept").val();
          var user_id       = Cookies.get('user_id');
          var branch        = Cookies.get('branch_pm');
          var data      = {action:'add', company:company, sched_date:sched_date, technician:technician, contact_name:contact_name, contact_no: contact_no, email: contact_email,
                            department: contact_dept, user_id: user_id, branch:branch};
          $.ajax({
                type: 'POST',
                url: assets+'php/pm/schedule.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); }, //Empty the search fields. 
                success: function(data, xhr, status){
                    self.dtCurrentSched.dtInstance.ajax.reload(null, false); //.page('last'); // Reload the data in DataTable and go to last page.
                    promptMSG('success-add','Schedule',null,null,true,true);
                },
                error: function(xhr,status){ alert("Something went wrong!"); },
                complete: function(){ resetForm("#frmCurrentSched"); $("#sched-company").val(0).trigger('chosen:updated'); $btn.button('reset'); $("#sched-number").text('...'); }

            });
    },
    update_cancel: function(){
        $("#btn_cancel_sched").click(function(){
            var btn_label = $(this);

             promptMSG("custom","Are you sure you want to <strong>"+btn_label.text()+"</strong>?","Confirmation","yn",false,true,function(){
                var id_pm     = $("#hdnCurSchedId").val() || '';
                var pm_number = $("#hdnCurSchedPmNum").val() || '';
                    if(id_pm != ''){
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            data: {action: 'update_cancel', id_pm: id_pm, pmnumber:pm_number },
                            url: assets + 'php/pm/schedule.php',
                            async: false,
                            beforeSend: function(){ 
                                $("#modalFormCurrentSched").modal("hide");
                                $(".mif-modalPromptMSG").modal("hide");  
                            },
                            success: function(data,xhr){
                                setTimeout(function(){
                                     if(data.aaData.result == 'true'){
                                        promptMSG("success-custom",data.aaData.message);
                                        self.dtCurrentSched.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                                     }else{
                                        promptMSG("custom",data.aaData.message,"Warning!");
                                     }
                                },300);

                            },
                            
                        });
                    }
                    else{
                        alert('ID form is empty.');
                    }

             });                        
        });

        return this;
    },
    update_close: function(){
        $("#btn_close_pm").click(function(){
            var btn_label = $(this);

             promptMSG("custom","Are you sure you want to <strong>"+btn_label.text()+"</strong>?","Confirmation","yn",false,true,function(){
                var id_pm     = $("#hdnCurSchedId").val() || '';
                var pm_number = $("#hdnCurSchedPmNum").val() || '';
                    if(id_pm != ''){
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            data: {action: 'update_close', id_pm: id_pm, pmnumber:pm_number },
                            url: assets + 'php/pm/schedule.php',
                            async: false,
                            beforeSend: function(){ 
                                $("#modalFormCurrentSched").modal("hide");
                                $(".mif-modalPromptMSG").modal("hide");  
                            },
                            success: function(data,xhr){
                                setTimeout(function(){
                                     if(data.aaData.result == 'true'){
                                        promptMSG("success-custom",data.aaData.message);
                                        self.dtCurrentSched.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                                     }else{
                                        promptMSG("custom",data.aaData.message,"Warning!");
                                     }
                                },300);

                            },
                            
                        });
                    }
                    else{
                        alert('ID form is empty.');
                    }

             });                        
        });

        return this;
    },        
    actions: function(){
                $("table#dtCurrentSched").on('click','button, a',function (e) {
                    e.preventDefault();

                    var inst = $(this);
                    var button_label = inst.text().toLowerCase();

                    //Highlight row selected.
                    if ( !inst.closest('tr').hasClass('selected') ) {  
                        self.dtCurrentSched.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }
                    //Show modal edit
                    if (button_label == 'edit') {
                        var sched_idcompany = $(this).data('id');
                        var sched_pmnumber = $(this).data('pmnumber');
                        self.dtCurrentSched.getDataSched(sched_idcompany, sched_pmnumber);
                    }
                    if (button_label == 'pm') {
                        var idcompany_pm = $(this).data('comp-id');
                        var pmnumber = $(this).data('pmnumber');
                        self.dtCurrentPM.render(pmnumber, idcompany_pm);
                    }
                    //Search button
                    if(button_label == "search"){
                        self.dtCurrentSched.dtInstance.ajax.reload(null, true);
                    }
                     //Reset button
                    if(button_label =="reset"){
                        $("#dt-head-schedsearch input[type='text']").val('');  //
                        self.dtCurrentSched.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                    }
                } );
        return this;
    }

};
