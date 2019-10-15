var dtSalesHistory = {
    dtInstance: null,
    dtRenderedDom: null,
	render: function(sapCode){
        $("#displaySalesHistory").load(pages+'company/sap-sales-history.html',function(){
            $("#modalSalesHistory").modal('show');
            self.dtSalesHistory.dataTable(sapCode).actions();
        }); 
        return this; 
	},
    dataTable: function(sapCode){
        this.dtInstance = $("#dtSalesHistory").DataTable({
                "dom"     : 'Blrtip',
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 10,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                 "oLanguage": {
                                "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                                "sInfoEmpty": 'No entries to show'
                            },
                "processing": true,
                "serverSide": true,
                "bDestroy"  : true,     
                "ordering"  : false,
                    "ajax" : {
                    "url"  : assets+"php/company/sapSalesHistory.php",
                    "type" : "POST",
                    "dataSrc": "records",
                    "data" : function(d){
                            delete d.columns;
                            d.sap_code = sapCode;
                            d.doc_from = $("#search-doc-from").val() || '';
                            d.doc_to = $("#search-doc-to").val() || '';
                            

                    }
                  },
                  "buttons": [
                                {
                                    extend: "excel",
                                    className: 'dt-company-excel hidden-xs',
                                    exportOptions: {columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
                                    filename: 'Sales History ' + getTodayDate()
                                },
                                {
                                    extend: 'print',
                                    exportOptions: { columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]},
                                    className: 'dt-machine-print hidden-xs',
                                    footer: true,
                                    // autoPrint: false, // For debugging
                                    customize: function ( win ) {
                                            var elem = $(win.document.body);
                                                elem.find('h1').remove();
                                                elem.prepend("<h4>SAP Sales History</h4>");
                                       
                                    }
                                },
                                {
                                    text: 'Open Search Filter',
                                    className: 'dt-button-machinesearch',
                                    action: function ( e, dt, node, config ) {
                                            $(".dt-headsearch").slideToggle('fast',function(){
                                                if($(this).is(':visible')){
                                                    node[0].innerText = 'Close Search Filter';
                                                }else{
                                                   node[0].innerText = 'Open Search Filter';
                                                     $(".dt-head-headsearch input[type='text'], select").val(''); 
                                                     self.dtSalesHistory.dtInstance.ajax.reload(null, true);
                                                }
                                            });
                                                   
                                    }
                                }
                ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1;
                                    }       
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return isEmpty(data.acc_manager);
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return isEmpty(data.fiscal_year); 
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return isEmpty(data.month); 
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return isEmpty(data.doc_num);
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return  isEmpty(data.doc_date);
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return isEmpty(data.baseref);
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return isEmpty(data.customer_po);
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return isEmpty(data.item_code);
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return isEmpty(data.description);
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return  "<div class='text-center'>"+data.quantity +"</div>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<div class='text-center'>"+isEmpty(data.pricevat)+"</div>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return  "<div class='text-right'>"+isEmpty(data.gross)+"</div>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<div class='text-right'>"+isEmpty(data.vat)+"</div>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<div class='text-right'>"+isEmpty(data.net)+"</div>";
                                }
                            },

                 ],
                  columnDefs: [ 
                    {
                        className: 'min-mobile  ',
                        targets:   0
                    },
                    {
                        className: 'min-mobile text-right',
                        targets:   12
                    },
                    {
                        className: 'min-mobile',
                        targets:   13
                    },
                    {
                        className: 'min-mobile text-right',
                        targets:   14
                    },
                ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                       $(".dt-company-excel, .dt-button-machinesearch, .dt-machine-print").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                       $(".dt-machine-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                       $(".dt-company-excel").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
                },
                "footerCallback": function(tfoot, data, start, end, display){
                    var api   = this.api();
                    var overall = api.context[0].json.totalSales;

                     var totalNet = data.reduce( function(e,f){
                        return intVal(e) + intVal(f.net);
                    }, 0 );

                    var footer = api.table().footer();
                    var footerTrOne = $(footer).children()[0];
                    var footerTrTwo = $(footer).children()[1];

                    //Page total
                    $(footerTrOne).find('td:eq(14)').html(formatNumber(toDecimal(totalNet)));

                    //Over all total
                    $(footerTrTwo).find('td:eq(14)').html(overall.total_net);

                }

            }); 
        
            return this;                              
    },
    actions: function(){
                $("table#dtSalesHistory").on('click','button',function (e) {
                    e.preventDefault();

                    var inst = $(this);
                    var button_label = inst.text().toLowerCase();

                    //Highlight row selected.
                    if ( !inst.closest('tr').hasClass('selected') ) {  
                        self.dtSalesHistory.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Search button
                    if(button_label == "search"){
                        self.dtSalesHistory.dtInstance.ajax.reload(null, true);
                    }
                     //Reset button
                   else if(button_label =="reset"){
                        $(".dt-headsearch input[type='text']").val('');  //
                        self.dtSalesHistory.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                    }
                   
                     
                } );
        return this;
    },
}