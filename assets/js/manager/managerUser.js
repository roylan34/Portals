var dtClientCompany = {
    dtInstance: {},
    pageDetails: function(){
                $(".content-header h1").text("Machine in Field");
                $(".content-header h1").append("<small>Home</small>");
            return this;
    },
    render: function(companyHandle){ 
      this.dtInstance = $("#dtClientCompany").DataTable({
                "dom"       : 'fBlrtip', 
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 25,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                 "oLanguage": {
                            "bProcessing": true,
                            "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                            "sInfoEmpty": 'No entries to show'
                        },
                "bDestroy"  : true,                                             //destroy existing datatable
                "ordering" : false,
                    "ajax" : {
                    "url"  : assets+"php/company/getCompanyList.php",
                    "type" : "POST",
                    "data" : function(d){
                            // d.company   = $("#search-company-companyname").val();
                            // d.address   = $("#search-company-address").val();
                            // d.branch    = $("#search-company-branch").val();
                            d.client_company_own = companyHandle; //Param for listing of company.
                            d.action_view = "account_manager";
                            d.status = 1;
                    }
                  },
                 "buttons": [
                                {
                                    text: '<i class="fa fa-refresh" title="Refresh"></li>',
                                    className: '',
                                    action: function ( e, dt, node, config ) {
                                           self.dtClientCompany.dtInstance.ajax.reload(null, false);
                                    }
                                }
                            ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class=''>" + data.company_name + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    if(data.number_of_machines != null){
                                        return "<span class='text-center'>" + data.number_of_machines + "</span>"; 
                                    }
                                    return 0;
                                }
                            },
                            { data:  null, "width": "30%", render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.address + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<div class='text-center dt-column-branches'>" + isEmpty(data.branches) + "</div>";
                                }
                            },
                            { data:  null, class: 'text-right', render: function( data, type, full, meta ){
                                return '<button class="btn btn-xs btn-success btn-flat btnSapCode" data-sapcode="'+data.sap_code+'">Sales</button>';
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return '<button class="btn btn-xs btn-success btn-flat btnViewPrinter" data-comp="'+data.id+'" data-compname="'+encodeURIComponent(data.company_name)+'" data-status="'+data.status+'" '+(data.status == 0 ? 'disabled' : '')+'><i class="fa fa-list"></i></button>';
                                }
                            }
                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, target: 1}
                 ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                           $(".dt-button-search, .dt-company-print").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                           $(".dt-company-print").text('').html("<i class='glyphicon glyphicon-print'></i>");
                },
                "footerCallback": function( tfoot, data, start, end, display ) {
                        var api = this.api();
                             
                            // Get over all pages
                            var pageTotal = api
                                .column( 2 )
                                .data();
                            
                            //Total over all pages
                            var res_pagetotal =0;
                            $.each(pageTotal,function(key,val){
                                if(val['number_of_machines'] != null){
                                    res_pagetotal += parseInt(val['number_of_machines']);
                                }
                            });

                            // Update footer
                            $( api.column( 2 ).footer() ).html(
                                'Total Machine: '+ formatNumber(res_pagetotal) +' (Total Client: '+ data.length+')'
                            ).css('font-size','13px');                         
                    }
        });
        return this;
    },
    actions: function(){
                $("table#dtClientCompany").on('click', 'button', function () {
                    var inst = $(this);
                    if ( inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                         // $(this).closest('tr').removeClass('selected');
                    }
                    else {
                        self.dtClientCompany.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    if($(inst[0]).hasClass('btnViewPrinter')) {
                        var idcompany = inst.data('comp');
                        var branch    = inst.data('branch');
                        var company_name  = decodeURIComponent(inst.data('compname'));
                            self.dtMachine.render(idcompany, company_name);  
                    }
                    else if($(inst[0]).hasClass('btnSapCode')) {
                        var sapcode = inst.data('sapcode');
                            dtSalesHistory.render(sapcode);
                    }
                    else{}

                } );
        return this;
    }
};
