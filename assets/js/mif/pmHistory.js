var dtPmHistory = {
    dtInstance: null,
    dtRenderedDom: null,
    render: function(mif_id){
         //PM History template
        $("#displayPmHistory").load(pages+'machine/modal/pm-history.html', function(){
            $('#modalPmHistory').modal('show');
            self.dtPmHistory.dataTable(mif_id);

            //When modal hide add classname modal-open in body element.
            $("#modalPmHistory").on("hidden.bs.modal",function(){
                $("body").addClass('modal-open');
            })
        });


       
        return this;
    },
    dataTable: function(mif_id){
           var $btn = $("#btnSearchPmHistory");
                this.dtInstance = $('#dtPmHistory').DataTable( { //Table logs is using Server-side processing to avoid loading all datas.
                            "dom" : "<'search-toolbar'>lrtip",
                            "autoWidth" : false,
                            "processing": true,
                            "serverSide": true,
                            "ordering": false,
                            "destroy": true,
                            "ajax": {
                                "url": assets+'php/machine/pmHistory.php',
                                "type": "POST",
                                "dataSrc": "records",
                                "beforeSend" : function() { $btn.button('loading'); },
                                 data: function(d){
                                         d.mif_id = mif_id || 0;
                                         d.search = { 'value' : $("#txtSearchLogs").val() || null } ;
                                       }
                            },
                            "columns": [
                                { "data": null, render:function ( data, type, row, meta ) {
                                       return meta.row + 1;
                                } },
                                { "data": null,  render:function ( data, type, row, meta ) {
                                       return data.company_name;
                                }},
                                { "data": null, render:function ( data, type, row, meta ) {
                                       return data.schedule_date;
                                }},
                                { "data": null, render:function ( data, type, row, meta ) {
                                       return data.technician;
                                }},
                                { "data": null, render:function ( data, type, row, meta ) {
                                       return data.remarks;
                                }},
                                { "data": null, render:function ( data, type, row, meta ) {
                                       return data.page_count;
                                }},
                                { "data": null, render:function ( data, type, row, meta ) {
                                       return data.time_in;
                                }},
                                { "data": null, render:function ( data, type, row, meta ) {
                                       return data.time_out;
                                }}
                            ],
                            
                    });
                    $("div.search-toolbar").html("<div class='pull-right'><input type='search' id='txtSearchLogs' placeholder='Search' style='margin-right:10px'/>" + 
                        "<button class='btn btn-flat btn-xs btn-primary' id='btnSearchPmHistory'><i class='fa fa-search' title='Search'></i></button></div>"); //Custom search toolbar
                            $("#btnSearchPmHistory").on('click',function(e){
                                e.preventDefault();
                                    self.dtPmHistory.dtInstance.ajax.reload();                                   
                            });
        return this;
    },
    actions: function(){
                $("table#dtPmHistory").on('click','button',function (e) {
                    e.preventDefault();

                    var inst = $(this);
                    var button_label = inst.text().toLowerCase();

                    //Highlight row selected.
                    if ( !inst.closest('tr').hasClass('selected') ) {  
                        self.dtPmHistory.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Search button
                    if(button_label == "search"){
                        self.dtPmHistory.dtInstance.ajax.reload(null, true);
                    }
                     //Reset button
                   else if(button_label =="reset"){
                        $(".dt-headsearch input[type='text']").val('');  //
                        self.dtPmHistory.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                    }
                   
                     
                } );
        return this;
    },
}