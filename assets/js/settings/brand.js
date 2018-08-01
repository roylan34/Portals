var dtBrand = {
    dtInstance: {},
	render: function(){
		 this.dtInstance = $("#dtBrand").DataTable({
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
			                    "url"  : assets+"php/settings/brand.php",
			                    "type" : "GET",
                                "data": {action: 'view-all' }                    		 
                  },
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.brand_name + "</span>";
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
                                    return "<button class='btn btn-xs btn-success btn-flat btnUpdateBrand' data-brand='"+data.id+"'>Update</button>";
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, width:"20%", target: 1}
                 ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                            $(".dt-button-addbrand").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                }
        });
        return this;
    },
    modalShow: function(idbrand){ 
              $("#displayFormBrand").load(pages+'settings/form-brand.html',function(data,status,xhr){
                 $('#modalFormBrand').modal('show');
                    if(idbrand != null){
                        $(this).find(".modal-title").text('Update Brand');
                        $.ajax({
                            type: 'GET',
                            url : assets+'php/settings/brand.php',
                            data: {action:'view', idbrand: idbrand},
                            dataType: 'json',
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    $("#hdnIdBrand").val(val.id);
                                    $("#txtSettingsBrand").val(val.brand_name); 
                                    $("#hdnOldBrand").val(val.brand_name);  
                                    $("#slctBrandStatus").val(val.status);                                           
                                }); 
                            },
                            error: function(data,xhr,status){ }
                         });
                    }
                    else{ 
                        $(this).find(".modal-title").text('Add Brand');
                    }
             });
    },
    update: function(){
            var id     = $("#hdnIdBrand").val();
            var brand  = $("#txtSettingsBrand").val();
            var status = $("#slctBrandStatus option:selected").val();
            var data   = {action:'update', idbrand: id, brandname: brand, status: status};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/brand.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtBrand.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                         autoDrpDown.cacheOptBrands.splice(0,1);//Clear cache branch.
                    },
                    error: function(data,xhr,status){ console.log(xhr + status); }
                 });
    },
    add: function(){
            var brand  = $("#txtSettingsBrand").val();
            var status = $("#slctBrandStatus option:selected").val();
            var data   = {action:'add', brandname: brand, status: status};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/brand.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtBrand.dtInstance.ajax.reload(null, false).page('last'); // Reload the data in DataTable.
                         autoDrpDown.cacheOptBrands.splice(0,1);//Clear cache brand.
                    },
                    error: function(data,xhr,status){ console.log(xhr + status); },
                    complete: function(){ resetForm("#frmSettingsBrand"); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $(".box-brand").on('click', 'button', function () {
                    var inst = $(this);
                    if ( inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                         // $(this).closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtBrand.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    if (inst.text() == 'Update') { //Show modal update
                        var idbrand = $(this).data('brand');
                        self.dtBrand.modalShow(idbrand);
                    }else{
                         self.dtBrand.modalShow(); //Show modal add
                    }
            });

           return this;
    },

};