var dtSapCustomer = {
    dtInstance: {},
	render: function(){
		 this.dtInstance = $("#dtSapCustomer").DataTable({
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
                "ordering" : false,
                    "ajax" : {
			                    "url"  : assets+"php/settings/sap_master_details.php",
			                    "type" : "GET",
                                "data": {action: 'view-all' }                    		 
                  },
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var sap_code = data.sap_code || '---';
                                return "<span class='text-center'>" + sap_code + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var company = data.company_name || '---';
                                return "<span class='text-center'>" + company + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var location = data.location || '---';
                                return "<span class='text-center'>" + location + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var address = data.address || '---';
                                return "<span class='text-center'>" + address + "</span>";
                                }
                            },

                 ],
                 "columnDefs": [
                            { responsivePriority: 1, target: 0},
                            { responsivePriority: 2, width:"20%", target: 1}
                 ],
                "deferRender": true,
        });
        return this;
    }

};