var dtStatusInventory = {
    dtInstance: {},
    render: function(){ 
                this.dtInstance = $("#dtInventoryStatus").DataTable({
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
                                    "url"  : assets+"php/inventory/settings/status.php",
                                    "type" : "GET",
                                    "data": { action: 'view-all' }                         
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
                                        return "<span class='text-center'>" + data.status_type + "</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                        return "<button class='btn btn-xs btn-success btn-flat btnUpdateInvntStatus' data-invnt-status='"+data.id+"'>Update</button>";
                                    }
                                }
                     ],
                     "columnDefs": [
                                { responsivePriority: 1, target: 0},
                     ],
                    "deferRender": true
                });
        return this;
    },
    modalShow: function(id_status){ 
              $("#displayFormInvntEntry").load(pages+'inventory/settings/form-status.html',function(data,status,xhr){
                 $(this).find('#modalFormInvntStatus').modal('show');

                    if(id_status != null){
                        $(this).find(".modal-title").text('Update Status');
                         var $btn = $("button[type='submit']");
                        $.ajax({
                            type: 'GET',
                            url : assets+'php/inventory/settings/status.php',
                            data: {action:'view-id', id_status: id_status},
                            dataType: 'json',
                            beforeSend: function(){ $btn.button('loading'); },
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    $("#hdnIdInvntStatus").val(val.id);
                                    $("#hdnOldInvntStatus, #txtInvntSettingStatus").val(val.status_name); 
                                    $("input[name='optradioInvntStatus'][value="+val.status_type+"]").prop('checked',true);                                            
                                }); 
                            },
                            error: function(data,xhr,status){ promptMSG('warning','ID Machine not exist.'); },
                            complete: function(){ $btn.button('reset'); }
                         });
                    }
                    else{ 
                        $(this).find(".modal-title").text('Add Status');
                    }
             });
    },
    update: function(){
            var $btn     = $("button[type='submit']");
            var id          = $("#hdnIdInvntStatus").val();
            var status_name = $("#txtInvntSettingStatus").val();
            var status_type = $("input[name='optradioInvntStatus']:checked").val();
            var data   = {action:'update', id_status: id, status_name: status_name, status_type:status_type};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/inventory/settings/status.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        self.dtStatusInventory.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                         if(autoDrpDownInvnt.cacheOptStatus.IN != null ){
                            autoDrpDownInvnt.cacheOptStatus.IN = null; //Clear cache status.
                        }
                        if(autoDrpDownInvnt.cacheOptStatus.OUT != null ){
                            autoDrpDownInvnt.cacheOptStatus.OUT = null; //Clear cache status.
                        }
                    },
                    error: function(data,xhr,status){ alert(xhr + status); },
                    complete: function(){ $btn.button('reset'); }
                 });
    },
    add: function(){
            var $btn     = $("button[type='submit']");
            var status_name   = $("#txtInvntSettingStatus").val();
            var status_type   = $("input[name='optradioInvntStatus']:checked").val();
            var data   = {action:'add', status_name: status_name, status_type:status_type};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/inventory/settings/status.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        self.dtStatusInventory.dtInstance.ajax.reload(null, false).page('last'); // Reload the data in DataTable.
                        if(autoDrpDownInvnt.cacheOptStatus.IN != null ){
                            autoDrpDownInvnt.cacheOptStatus.IN = null; //Clear cache status.
                        }
                        if(autoDrpDownInvnt.cacheOptStatus.OUT != null ){
                            autoDrpDownInvnt.cacheOptStatus.OUT = null; //Clear cache status.
                        }
                    },
                    error: function(data,xhr,status){ alert(xhr + status); },
                    complete: function(){ resetForm("#frmSettingInvntStatus"); $btn.button('reset'); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $("table#dtInventoryStatus").on('click', 'button', function () {
                    var inst = $(this);
                    if ( !inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                        self.dtStatusInventory.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Show modal update
                    if (inst.hasClass('btnUpdateInvntStatus')) {
                        var id_status = $(this).data('invnt-status');
                        self.dtStatusInventory.modalShow(id_status);
                    }
                } );

          $("#addInventoryStatus").click(function(e){
                self.dtStatusInventory.modalShow();
          });
           return this;
    },
};
