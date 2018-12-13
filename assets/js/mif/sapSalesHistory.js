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
                            d.company = $("#search-sales-company").val() || '';
                            d.acc_manager = $("#search-sales-acctmngr").val() || '';
                            d.fiscal_year = $("#search-sales-year").val() || '';
                            d.month = $("#search-sales-month").val() || '';

                    }
                  },
                  "buttons": [
                                {
                                    extend: "excel",
                                    className: 'dt-company-excel hidden-xs',
                                    exportOptions: {columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15 ]},
                                    filename: 'Sales History ' + getTodayDate()
                                },
                                {
                                    extend: 'print',
                                    exportOptions: { columns: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]},
                                    className: 'dt-machine-print hidden-xs',
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
                                return "<span class='text-left'>" + isEmpty(data.company_name) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.acc_manager) + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.fiscal_year) + "</span>"; 
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.month) + "</span>"; 
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.doc_num) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.doc_date) + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.baseref) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.customer_po) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.item_code) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.description) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + data.quantity + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.pricevat) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.vat) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.gross) + "</span>";
                                }
                            },
                            { data:  null,  render: function( data, type, full, meta ){
                                return "<span class='text-left'>" + isEmpty(data.net) + "</span>";
                                }
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
                    var total = api.context[0].json.totalSales;

                        // Update footer
                        var totalStyle ={'border-left':'1px solid #000','border-bottom':'1px solid #000'};
                        $( api.column( 12 ).footer() ).html('Overall Total:').css(totalStyle);
                        $( api.column( 13 ).footer() ).html(total.total_vat).css(totalStyle);
                        $( api.column( 14 ).footer() ).html(total.total_gross).css(totalStyle);
                        $( api.column( 15 ).footer() ).html(total.total_net).css({'border-left':'1px solid #000','border-bottom':'1px solid #000','border-right':'1px solid #000'});
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
                        console.log('clicked');
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