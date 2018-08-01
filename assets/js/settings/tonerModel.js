var dtToner = {
    dtInstance: {},
	render: function(){
		 this.dtInstance = $("#dtToner").DataTable({
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
			                    "url"  : assets+"php/settings/tonerModel.php",
			                    "type" : "GET",
                                "data": {action: 'view-all' }                    		 
                  },
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.toner_code + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                   return "<span class='text-center'>" + data.type + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                   return "<span class='text-left'>" + data.model + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    return "<button class='btn btn-xs btn-success btn-flat btnUpdateToner' data-tonerid='"+data.id+"'>Update</button>";
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, width:"20%", target: 1},
                            { targets:3, className: "none"}
                 ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                            $(".dt-button-addtoner").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                }
        });
        return this;
    },
    modalShow: function(toner){ 
              $("#displayFormTonerModel").load(pages+'settings/form-toner-model.html',function(data,status,xhr){
                 $('#modalFormToner').modal('show');
                  var $toner_view = $(this);

                  $.when( autoDrpDown.getTonerModel("#slctSettingsModel") ) //Execute the .then callback function when ajax requests are successful, or fail.
                   .done(function(x){
                         if(toner != ''){
                                $toner_view.find(".modal-title").text('Update Toner Model');
                                $.ajax({
                                    type: 'GET',
                                    url : assets+'php/settings/tonerModel.php',
                                    data: {action:'view-id', toner: toner},
                                    dataType: 'json',
                                    success: function(data){
                                        $.each(data.aaData,function(key,val){
                                            $("#hdnTonerId").val(val.id);
                                            $("#txtSettingsToner").val(val.toner_code);
                                            $("#hdnOldToner").val(val.toner_code); 
                                            $("#slctSettingsModel").val(( val.model == null ? null : val.model.split(","))).trigger('chosen:updated');
                                            $("#hdnOldModel").val(val.model);
                                            $("#slctSettingsType").val(val.type);                                           
                                        }); 
                                    },
                                    error: function(data,xhr,status){ }
                                 });
                            }
                            else{
                                $toner_view.find("h4.modal-title").text('Add Toner Model');
                            }
                   });
                   
             });
    },
    update: function(){
            var tonerid= $("#hdnTonerId").val();
            var toner  = $("#txtSettingsToner").val();
            var model  = ($("#slctSettingsModel").chosen().val() ? $("#slctSettingsModel").chosen().val().toString() : '');
            var old_model = $("#hdnOldModel").val();
            var type   = $("#slctSettingsType option:selected").val();
            var data   = {action:'update', tonerid:tonerid, toner: toner, model: model, type: type, old_model: old_model};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/tonerModel.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtToner.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                    },
                    error: function(data,xhr,status){ console.log(xhr + status); }
                 });
    },
    add: function(){
            var toner  = $("#txtSettingsToner").val();
            var model  = ($("#slctSettingsModel").chosen().val() ? $("#slctSettingsModel").chosen().val().toString() : '');
            var type   = $("#slctSettingsType option:selected").val();
            var data   = {action:'add', toner: toner, model: model, type: type};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/settings/tonerModel.php',
                    data: data,
                    dataType: 'json',
                    success: function(data){
                        self.dtToner.dtInstance.ajax.reload(null, false).page('last'); // Reload the data in DataTable.
                    },
                    error: function(data,xhr,status){ console.log(xhr + status); },
                    complete: function(){ $("#txtSettingsToner").val(''); $("#slctSettingsModel").val(0).trigger('chosen:updated'); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $(".box-toner").on('click', 'button', function () {
                    var inst = $(this);
                    if ( inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                         // $(this).closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtToner.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    if (inst.text() == 'Update') { //Show modal update
                        var toner = $(this).data('tonerid');
                        self.dtToner.modalShow(toner);
                    }else{
                         self.dtToner.modalShow(''); //Show modal add
                    }
            });

           return this;
    },

};