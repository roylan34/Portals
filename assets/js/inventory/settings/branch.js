var dtInventoryBranch = {
    dtInstance: {},
    render: function(){ 
                this.dtInstance = $("#dtInventoryBranch").DataTable({
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
                                    "url"  : assets+"php/inventory/settings/branch.php",
                                    "type" : "GET",
                                    "data": { action: 'view-all' }                         
                      },
                    "columns"  : [
                                { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                        return "<span class='text-center'>" + data.branch_name + "</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                       if(data.id != 1) // Exclude the  1 = ALL.
                                            return "<button class='btn btn-xs btn-success btn-flat btnUpdateInvntBranch' data-invnt-branch='"+data.id+"'>Update</button>";
                                        return '';
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
    modalShow: function(id_branch){ 
              $("#displayFormInvntEntry").load(pages+'inventory/settings/form-branch.html',function(data,status,xhr){
                 $(this).find('#modalFormInvntBranch').modal('show');

                    if(id_branch != null){
                        $(this).find(".modal-title").text('Update Branch');
                         var $btn = $("button[type='submit']");
                        $.ajax({
                            type: 'GET',
                            url : assets+'php/inventory/settings/branch.php',
                            data: {action:'view-id', id_branch: id_branch},
                            dataType: 'json',
                            beforeSend: function(){ $btn.button('loading'); },
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    $("#hdnIdInvntBranch").val(val.id);
                                    $("#hdnOldInvntBranchName, #txtInvntSettingBranch").val(val.branch_name);                                    
                                }); 
                            },
                            error: function(data,xhr,status){ promptMSG('warning','ID Machine not exist.'); },
                            complete: function(){ $btn.button('reset'); }
                         });
                    }
                    else{ 
                        $(this).find(".modal-title").text('Add Branch');
                    }
             });
    },
    update: function(){
            var $btn     = $("button[type='submit']");
            var id           = $("#hdnIdInvntBranch").val();
            var branchname   = $("#txtInvntSettingBranch").val();
            var data   = {action:'update', id_branch: id, branchname: branchname};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/inventory/settings/branch.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        self.dtInventoryBranch.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                            autoDrpDownInvnt.cacheOptBranch.splice(0,1); //Clear cache branch.
                            
                    },
                    error: function(data,xhr,status){ alert(xhr + status); },
                    complete: function(){ $btn.button('reset'); }
                 });
    },
    add: function(){
            var $btn     = $("button[type='submit']");
            var id         = $("#hdnIdInvntBranch").val();
            var branchname = $("#txtInvntSettingBranch").val();
            var data = {action:'add', branchname: branchname};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/inventory/settings/branch.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        self.dtInventoryBranch.dtInstance.ajax.reload(null, false).page('last'); // Reload the data in DataTable.
                             autoDrpDownInvnt.cacheOptBranch.splice(0,1); //Clear cache branch.
                           
                    },
                    error: function(data,xhr,status){ alert(xhr + status); },
                    complete: function(){ resetForm("#frmSettingInvntBranch"); $btn.button('reset'); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $("table#dtInventoryBranch").on('click', 'button', function () {
                    var inst = $(this);
                    if ( !inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                        self.dtInventoryBranch.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Show modal update
                    if (inst.hasClass('btnUpdateInvntBranch')) {
                        var id_branch = $(this).data('invnt-branch');
                        self.dtInventoryBranch.modalShow(id_branch);
                    }
                } );

          $("#addInventoryBranch").click(function(e){
                self.dtInventoryBranch.modalShow();
          });
           return this;
    },
};
