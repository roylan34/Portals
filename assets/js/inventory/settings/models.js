var dtModels = {
    dtInstance: {},
    pageDetails: function(){
                $(".content-header h1").text("Machine Inventory");
                $(".content-header h1").append("<small>Settings</small>");
            return this;
    },
    render: function(paramBranch){ 
                var $btn = $("#btnSearchModel");
                this.dtInstance = $('#dtModel').DataTable( { //Table logs is using Server-side processing to avoid loading all datas.
                            "dom" : "<'search-toolbar'>lrtip",
                            "processing": true,
                            "serverSide": true,
                            "ordering": false,
                            "destroy": true,
                            "responsive": true,
                            "autoWidth": false,
                            "ajax": {
                                "url": assets+'php/inventory/settings/models.php',
                                "type": "POST",
                                "dataSrc": "records",
                                "beforeSend" : function() { $btn.button('loading'); },
                                 data: function(d){
                                         d.action = 'view-all';
                                         d.search = { 'value' : $("#txtSearchModel").val() || null } ;
                                       }
                            },
                            "columns": [
                                { "data": null },
                                { "data": "brand_name" },
                                { "data": "model_name" },
                                { "data": "cat_name" },
                                { "data": "type_name" },
                                { "data": null }
                            ],
                            "columnDefs": [
                                {
                                    "targets": 0,
                                    "render": function ( data, type, row, meta ) {
                                       return meta.row + 1;
                                    }
                                },
                                {
                                    "targets": 5,
                                    "render": function ( data, type, row, meta ) {
                                        return "<button class='btn btn-xs btn-success btn-flat btnUpdateModel' data-model='"+data.id+"'>Update</button>";
                                    }
                                }
                            ],
                            "drawCallback": function(){
                                 $('[data-toggle="popover"]').popover().on('click',function(e){
                                    e.preventDefault();
                                 });//Initialize pop-over 
                            }
                    });
                    $("div.search-toolbar").html("<div class='pull-right'><input type='search' id='txtSearchModel' placeholder='Search' style='margin-right:10px'/>" + 
                        "<a href='#' class='btn btn-flat btn-xs btn-primary' id='btnSearchModel'><i class='fa fa-search' title='Search'></i></a></div>"); //Custom search toolbar
                            $("#btnSearchModel").click(function(e){
                                e.preventDefault();
                                    self.dtModels.dtInstance.ajax.reload();                                   
                            });
        return this;
    },
    modalShow: function(id_model){ 
              $("#displayFormInvntEntry").load(pages+'inventory/settings/form-model.html',function(data,status,xhr){
                 $(this).find('#modalFormModel').modal('show');
                    autoDrpDownInvnt.getType("#slctSettingInvntType"); //Auto dropdown list.
                    autoDrpDown.getCategory('#slctSettingInvntCategory')
                               .getBrandName("#slctSettingInvntBrand");

                    if(id_model != null){
                        $(this).find(".modal-title").text('Update Model');
                         var $btn = $("button[type='submit']");
                        $.ajax({
                            type: 'GET',
                            url : assets+'php/inventory/settings/models.php',
                            data: {action:'view-id', id_model: id_model},
                            dataType: 'json',
                            beforeSend: function(){ $btn.button('loading'); },
                            success: function(data){
                                $.each(data.aaData,function(key,val){
                                    $("#hdnIdModel").val(val.id);
                                    $("#slctSettingInvntBrand").val(val.id_brand); 
                                    $("#hdnOldModel, #txtSettingInvntModel").val(val.model_name);
                                    $("#slctSettingInvntCategory").val(val.id_category);
                                    $("#slctSettingInvntType").val(val.id_type);                                                
                                }); 
                            },
                            error: function(data,xhr,status){ promptMSG('warning','ID Machine not exist.'); },
                            complete: function(){ $btn.button('reset'); }
                         });
                    }
                    else{ 
                        $(this).find(".modal-title").text('Add Model');
                    }
             });
    },
    update: function(){
            var $btn     = $("button[type='submit']");
            var id      = $("#hdnIdModel").val();
            var brand   = $("#slctSettingInvntBrand option:selected").val();
            var model   = $("#txtSettingInvntModel").val();
            var cat     = $("#slctSettingInvntCategory option:selected").val();
            var type    = $("#slctSettingInvntType option:selected").val();
            var data   = {action:'update', id_model: id, id_brand: brand, model_name: model, id_category: cat, id_type: type};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/inventory/settings/models.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        self.dtModels.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                         autoDrpDownInvnt.cacheOptModel.splice(0,1);//Clear cache model.
                    },
                    error: function(data,xhr,status){ alert(xhr + status); },
                    complete: function(){ $btn.button('reset'); }
                 });
    },
    add: function(){
            var $btn    = $("button[type='submit']");
            var id      = $("#hdnIdModel").val();
            var brand   = $("#slctSettingInvntBrand option:selected").val();
            var model   = $("#txtSettingInvntModel").val();
            var cat     = $("#slctSettingInvntCategory option:selected").val();
            var type    = $("#slctSettingInvntType option:selected").val();
            var data   = {action:'add', id_model: id, id_brand: brand, model_name: model, id_category: cat, id_type: type};
               $.ajax({
                    type: 'POST',
                    url : assets+'php/inventory/settings/models.php',
                    data: data,
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        self.dtModels.dtInstance.ajax.reload(null, false).page('last'); // Reload the data in DataTable.
                         autoDrpDownInvnt.cacheOptModel.splice(0,1);//Clear cache model.
                    },
                    error: function(data,xhr,status){ alert(xhr + status); },
                    complete: function(){ resetForm("#frmSettingModel"); $btn.button('reset'); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $("table#dtModel").on('click', 'button', function () {
                    var inst = $(this);
                    if ( !inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                        self.dtModels.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Show modal update
                    if (inst.hasClass('btnUpdateModel')) {
                        var id_model = $(this).data('model');
                        self.dtModels.modalShow(id_model);
                    }
                } );

          $("#addModels").click(function(e){
                self.dtModels.modalShow();
          });
           return this;
    },
};
