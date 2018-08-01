 //Status logs IN/OUT for Current and Archive respectively.
 var dtInvntLogs = {
        dtInstanceLogs: null,
        render: function(id_machine){
                var $btn = $("#btnSearchMifLogs");
                this.dtInstanceLogs = $('#dtInvntLogs').DataTable( { //Table logs is using Server-side processing to avoid loading all datas.
                            "dom" : "<'search-toolbar'>lrtip",
                            "processing": true,
                            "serverSide": true,
                            "ordering": false,
                            "destroy": true,
                            "responsive": true,
                            "ajax": {
                                "url": assets+'php/inventory/inventoryLogs.php',
                                "type": "POST",
                                "dataSrc": "records",
                                "beforeSend" : function() { $btn.button('loading'); },
                                 data: function(d){
                                         d.id_machine = id_machine;
                                         d.search = { 'value' : $("#txtSearchLogs").val() || null } ;
                                       }
                            },
                            "columns": [
                                { "data": null },
                                { "data": "fullname" },
                                { "data": "date_in_out" },
                                { "data": "company_name" },
                                { "data": null },
                                { "data": null } //Remarks
                            ],
                            "columnDefs": [
                                {
                                    "targets": 0,
                                    "render": function ( data, type, row, meta ) {
                                       return meta.row + 1;
                                    }
                                },
                                {
                                    "targets": 4,
                                    "render": function ( data, type, row, meta ) {
                                        var s_name = data.status_name;
                                        var s_type = data.status_type;
                                         if(s_name != ''){
                                           return '<span>'+s_name+ ' <strong>('+ s_type +')</strong></span>';
                                          }
                                        return '';
                                    }
                                },
                                {
                                    "targets": 5,
                                    "render": function ( data, type, row, meta ) {
                                        var remarks = data.remarks;
                                         if(remarks != ''){
                                           return '<a href="#" style="color: #c34838" data-toggle="popover" title="Remarks" data-placement="right" data-content="'+ remarks + '" data-trigger="focus">' + 
                                              '<i class="fa fa-comment"></i></a>';
                                          }
                                        return '';
                                    }
                                }
                            ],
                            "drawCallback": function(){
                                 $('[data-toggle="popover"]').popover().on('click',function(e){
                                    e.preventDefault();
                                 });//Initialize pop-over 
                            }
                    });
                    $("div.search-toolbar").html("<div class='pull-right'><input type='search' id='txtSearchLogs' placeholder='Search' style='margin-right:10px'/>" + 
                        "<a href='#' class='btn btn-flat btn-xs btn-primary' id='btnSearchMifLogs'><i class='fa fa-search' title='Search'></i></a></div>"); //Custom search toolbar
                            $("#btnSearchMifLogs").click(function(e){
                                e.preventDefault();
                                    self.dtInvntLogs.dtInstanceLogs.ajax.reload();                                   
                            });
        return this;
    },
    showModal: function(id_machine){ 
        $("#displayViewInvntLogs").load(pages+'inventory/current/logs.html',function(){
            $("#modalInvntLogs").modal('show');
               self.dtInvntLogs.render(id_machine);
        });
        return this;
    }
};