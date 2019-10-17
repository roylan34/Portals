var reportSalesPerAccount = {
	dtInstance: {},
	dtInstance2: {},
	pageDetails: function(){
   			$(".content-header h1").text("Sales");
  			$(".content-header h1").append("<small>Report</small>");
  			self.reportSalesPerAccount.drop_down_sales();
  		return this;
	 },
	drop_down_sales: function(){
      autoDrpDown.getlistYear("#select-year-sales");
      $("#select-month-sales, #select-year-sales").on('change',function(){
      		self.reportSalesPerAccount.table_sales_summary();
      });

	},
	table_sales_summary: function(){
		var view='';
		var selectedMonth = $("#select-month-sales option:selected").val(); //get the 2nd option value as default branch value.
		var selectedYear  = $("#select-year-sales option:selected").val(); //get the 2nd option value as default branch value.
		$.ajax({
			type: "GET",
			url: assets+"php/company/sapSalesSummary.php",
			cache: false,
			data: {action:"sales-summary", month: selectedMonth, year : selectedYear, user_id: jwt.get('user_id'), user_type: jwt.get('user_type')},
			dataType: 'json',
			success: function (data, status, xhr) {
						if(data.length > 0){
							var i = 1;
								$.each(data, function(employ_key, employ) {
									
									view += '<tr>';
									view += '<td>'+ (i++) + '</td>';
									view += '<td>'+ employ.acc_manager+ '</td>';
									view += '<td>'+ employ.mtd_gross+ '</td>';
									view += '<td>'+ employ.mtd_vat+ '</td>';
									if(employ.id == 1){
										view += '<td><a href="#" class="view-month-sales" data-doc-year="'+employ.doc_year+'">'+ employ.mtd_net+ '</a></td>';
									}else{
										view += '<td>'+ employ.mtd_net+ '</td>';
									}
									view += '<td>'+ employ.ytd_gross+ '</td>';
									view += '<td>'+ employ.ytd_vat+ '</td>';
									if(employ.id == 1){
										view += '<td><a href="#" class="view-year-sales">'+ employ.ytd_net+ '</a></td>';
									}else{
										view += '<td>'+ employ.ytd_net+ '</td>';
									}
									view += '</tr>';
								});
						}
						else{
							view = "<tr><td colspan='8'><h5 class='text-center'>No data available in the table</h5></td></tr>";
						}
			}, 
			complete: function(data){
					$("#reportSales > tbody").html(view);
								
			}
		});
		return this;
	},
	get_composition_month: function(acc, docYear){
		var selectedMonth = $("#select-month-sales option:selected").val(); //get the 2nd option value as default branch value.
		var selectedYear  = $("#select-year-sales option:selected").val(); 

		$("#modalSalesMonth .modal-title").text(acc+" - "+selectedMonth.toUpperCase()+" "+docYear);
		this.dtInstance = $("#dtViewSalesMonth").DataTable({
                "dom"       : 'fBlrtip', 
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
			                    "url": assets+"php/company/sapSalesSummary.php",
			                    "type" : "GET",
                                "data": {action:"month", month: selectedMonth, year: selectedYear, acc_manager:acc}            		 
                  },
                 "buttons":[
                 		{
                            extend: "excelHtml5",
                            exportOptions: { columns: [1,2,3,4,5,6,7],
                                stripNewlines: false
                             },
                            text: "<i class='fa fa-file-excel-o'></i>",
                            titleAttr: 'Export to Excel',
                            className: 'dt-summary-excel',
                            filename: 'Sales Details ' + selectedMonth.toUpperCase()+"-"+docYear
                        }
                 ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                    }       
                            },
                            { data:  "company"},
                            { data:  "customer"},
                            { data:  "doc_date"},
                            { data:  "doc_num"},
                            { data:  "gross", class: "text-right"},
                            { data:  "vat", class: "text-right"},
                            { data:  "net", class: "text-right"},

                 ],
                "deferRender": true,
                // "preDrawCallback": function(settings){
                //            $(".dt-summary-excel").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-right":"0.5em"});
                // }
        });
		return this;
	},
	get_composition_year: function(acc){
		var selectedYear  = $("#select-year-sales option:selected").val(); 

		$("#modalSalesYear .modal-title").text(acc+" - YTD "+selectedYear);
		this.dtInstance2 = $("#dtViewSalesYear").DataTable({
                "dom"       : 'fBlrtip', 
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
			                    "url": assets+"php/company/sapSalesSummary.php",
			                    "type" : "GET",
                                "data": {action:"year", year: selectedYear, acc_manager:acc}            		 
                  },
                "buttons":[
                 		{
                            extend: "excelHtml5",
                            exportOptions: { columns: [1,2,3,4,5,6,7,8,9,10,11,12,13],
                                stripNewlines: false
                             },
                            text: "<i class='fa fa-file-excel-o'></i>",
                            titleAttr: 'Export to Excel',
                            className: 'dt-summary-details-excel',
                            filename: 'YTD Sales ' + selectedYear
                        }
                 ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                    return meta.row + 1; //DataTable autoId for sorting.
                                }       
                            },
                            { data:  "customer"},
                            { data:  "nov",  class: "text-right"},
                            { data:  "_dec", class: "text-right"},
                            { data:  "jan", class: "text-right"},
                            { data:  "feb", class: "text-right"},
                            { data:  "mar", class: "text-right"},
                            { data:  "apr", class: "text-right"},
                            { data:  "may", class: "text-right"},
                            { data:  "jun", class: "text-right"},
                            { data:  "jul", class: "text-right"},
                            { data:  "aug", class: "text-right"},
                            { data:  "sep", class: "text-right"},
                            { data:  "_oct", class: "text-right"}

                 ],
                "deferRender": true
        });
		return this;
	},
	exportExcelRow: function(pmonth, pyear){
		 var year  = pmonth || '';
		 var month = pyear || '';
			if(year != '' && month !=''){
			    var urlExcel = window.location.origin + window.location.pathname + 'assets/php/company/excelSalesSummary.php?year='+pyear+'&month='+pmonth+'&user_type='+jwt.get('user_type')+'&user_id='+jwt.get('user_id');
			       	window.open(urlExcel, '_blank');			     
			}
			else{
				alert("Year and Month");
			}

		return this;
	},
	action: function(){
		$("#container-SapSalesSummary").on('click', 'a.view-month-sales, a.view-year-sales, a.btn-export-summary', function(e){
			e.preventDefault();

		        var inst = $(this);
		        var acc = $(this).closest('tr').find("td:nth-child(2)").text();

	            //Highlight row selected.
	            if ( !inst.closest('tr').hasClass('selected') ) {  
	                $("#reportSales tr.selected").removeClass('selected');
	                inst.closest('tr').addClass('selected');
	            }

				if(inst.hasClass('view-month-sales')){
					$("#modalSalesMonth").modal('show');
					var doc_year = inst.data('doc-year');
					self.reportSalesPerAccount.get_composition_month(acc, doc_year);
				}

				if(inst.hasClass('view-year-sales')){
					$("#modalSalesYear").modal('show');
					self.reportSalesPerAccount.get_composition_year(acc);
				}
				if(inst.hasClass('btn-export-summary')){
					var selectedMonth = $("#select-month-sales option:selected").val();
					var selectedYear  = $("#select-year-sales option:selected").val(); 
					self.reportSalesPerAccount.exportExcelRow(selectedMonth, selectedYear);
				}
	
		});
	return this;
	}
};