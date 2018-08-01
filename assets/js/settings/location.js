var dtBranch = {
    dtInstance: {},
    pageDetails: function(){
                $(".content-header h1").text("Machine in Field");
                $(".content-header h1").append("<small>Settings</small>");
            return this;
    },
	render: function(){
		 this.dtInstance = $("#dtBranch").DataTable({
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
			                    "url"  : assets+"php/misc/locations.php",
			                    "type" : "GET"                    		 
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
                                        if(data.status == 1)
                                            return "<span class='text-left'> Active </span>";
                                        else 
                                            return "<span class='text-left' style='color:#dd4b39'> Inactive </span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    if(data.id != 1)//The "ALL" value is hardcoded. And must be parallel in table tbl_location if want to change.  
                                        return "<button class='btn btn-xs btn-success btn-flat btnUpdateBranch' data-branch='"+data.id+"'>Update</button>";
                                    return '';
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, width:"20%", target: 1}
                 ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                            $(".dt-button-addbranch").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                }
        });
        return this;
    },
    modalShow: function(idbranch){ 
              $("#displayFormBranch").load(pages+'settings/form-branch.html',function(data,status,xhr){
                 $('#modalFormBranch').modal('show');
                    if(idbranch != null){
                        $(this).find(".modal-title").text('Update Location');
                        $.ajax({
                            type: 'GET',
                            url : assets+'php/settings/location.php',
                            data: {action:'view', idbranch: idbranch},
                            dataType: 'json',
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    $("#hdnId").val(val.id);
                                    $("#txtSettingsBranch").val(val.branch_name); 
                                    $("#hdnOldBranch").val(val.branch_name);
                                    $("#slctLocationStatus").val(val.status);                                             
                                }); 
                            },
                            error: function(data,xhr,status){ }
                         });
                    }
                    else{ 
                        $(this).find(".modal-title").text('Add Location');
                    }
             });
    },
    update: function(){
            var id     = $("#hdnId").val();
            var branch = $("#txtSettingsBranch").val();
            var status = $("#slctLocationStatus option:selected").val();
            var data   = {action:'update', idbranch: id, branchname: branch, status: status};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/location.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtBranch.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                         autoDrpDown.cacheOptBranch.splice(0,1);//Clear cache branch.
                         autoDrpDown.cacheOptBranchOne.splice(0,1);
                    },
                    error: function(data,xhr,status){ alert(xhr + status); }
                 });
    },
    add: function(){
            var branch = $("#txtSettingsBranch").val();
            var status = $("#slctLocationStatus option:selected").val();
            var data   = {action:'add', branchname: branch, status: status};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/location.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtBranch.dtInstance.ajax.reload(null, false).page('last'); // Reload the data in DataTable.
                         autoDrpDown.cacheOptBranch.splice(0,1);//Clear cache branch.
                         autoDrpDown.cacheOptBranchOne.splice(0,1);
                    },
                    error: function(data,xhr,status){ alert(xhr + status); },
                    complete: function(){ resetForm("#frmSettingsBranch"); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $("table#dtBranch").on('click', 'button', function () {
                    var inst = $(this);
                    if ( inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                         // $(this).closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtBranch.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Show modal update
                    if (inst.text() == 'Update') {
                        var idbranch = $(this).data('branch');
                        self.dtBranch.modalShow(idbranch);
                    }
                } );

          $("#addBranch").click(function(e){
                self.dtBranch.modalShow();
          });
           return this;
    },

};