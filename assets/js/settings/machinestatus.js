var dtStatus = {
    dtInstance: {},
	render: function(){
		 this.dtInstance = $("#dtStatus").DataTable({
                "dom"       : 'flrtip', 
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 10,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                 "oLanguage": {
	                            "bProcessing": true,
	                            "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
	                            "sInfoEmpty": 'No entries to show'
	                        },
                "bDestroy"  : true,                                          //destroy existing datatable
                "bStateSave": true,                                          //save the pagination #, ordering, show records # and etc
                "ordering" : false,
                    "ajax" : {
			                    "url"  : assets+"php/misc/machinestatus.php",
			                    "type" : "GET"                    		 
                  },
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                    return meta.row + 1; //DataTable autoId for sorting.
                                }       
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    return "<span class='text-center'>" + data.status_name + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    return "<button class='btn btn-xs btn-success btn-flat btnUpdateStatus' data-status='"+data.id+"'>Update</button>";
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, width:"20%", target: 1}
                 ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                            $(".dt-button-addStatus").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                }
        });
        return this;
    },
    modalShow: function(idstatus){ 
              $("#displayFormStatus").load(pages+'settings/form-machine-status.html',function(data,status,xhr){
                 $('#modalFormStatus').modal('show');
                    if(idstatus != null){
                        $(this).find(".modal-title").text('Update Status');
                        $.ajax({
                            type: 'GET',
                            url : assets+'php/settings/machineStatus.php',
                            data: {action:'view-id', id: idstatus},
                            dataType: 'json',
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    $("#hdnIdStatus").val(val.id);
                                    $("#txtSettingStatus").val(val.status_name); 
                                    $("#hdnOldStatus").val(val.status_name);
                                    $("input[name='optradioStatus'][value="+val.set_default+"]").prop('checked',true);                                             
                                }); 
                            },
                            error: function(data,xhr,status){ }
                         });
                    }
                    else{ 
                        $(this).find(".modal-title").text('Add Status');
                    }
             });
    },
    update: function(){
            var id     = $("#hdnIdStatus").val();
            var status_name   = $("#txtSettingStatus").val();
            var status_action = $("input[name='optradioStatus']:checked").val();
            var data   = {action:'update', id: id, status_name: status_name, status_action:status_action};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/machineStatus.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtStatus.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                         autoDrpDown.cacheOptRemoveMachine.splice(0,1);//Clear cache branch.
                    },
                    error: function(data,xhr,status){ console.log(xhr + status); },
                 });
    },
    add: function(){
            var status_name   = $("#txtSettingStatus").val();
            var status_action = $("input[name='optradioStatus']:checked").val();
            var data   = {action:'add', status_name: status_name, status_action:status_action};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/machineStatus.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtStatus.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                         autoDrpDown.cacheOptRemoveMachine.splice(0,1);//Clear cache branch.
                    },
                    error: function(data,xhr,status){ resetForm("#frmSettingStatus"); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $("table#dtStatus").on('click', 'button', function (e) {
                   // e.preventDefault();
                    var inst = $(this);
                    if ( inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                         // $(this).closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtStatus.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }
                    //Show modal update
                    if($(inst[0]).hasClass('btnUpdateStatus')){
                        var idstatus = $(this).data('status');
                        self.dtStatus.modalShow(idstatus);
                    }

                } );

          $("#addStatus").click(function(e){
                self.dtStatus.modalShow();
          });
           return this;
    },

};