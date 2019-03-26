var reportInvntAlltocks = {
	pageDetails: function(branch){
   			$(".content-header h1").text("Machine Inventory");
  			$(".content-header h1").append("<small>Reports</small>");
  		return this;
	 },
	table_all_stock: function(branch){
		var view='';
		$.ajax({
			type: "GET",
			url: assets+"php/inventory/reports/all-stocks.php",
			cache: false,
			dataType: 'json',
			success: function (data, status, xhr) {
						if(data.length != 0){
							var i = 0;
							$.each(data, function(branch_key, _result) {
									view+='<div class="col-lg-2 col-md-4 '+( i % 6 === 0 ? "clearFix": "" )+'">';
										view+='<div class="panel panel-orange" id="panelReportStocks'+branch_key+'">';
											view+='<div class="panel-heading">';
												view+='<div class="row">';
												view+='<div class="text-center"><h5><strong>'+branch_key+'';
												   // view+='<button type="button" class="btn btn-default btn-xs glyphicon glyphicon-print reportPrint" id="btnReportStocks'+brand_key+'" onclick=printReport(this,"#reportStocks'+brand_key+'"); title="Print"></button>';
												view+='</strong></h5></div>';
													view+='</div>';
											view+='</div>';
										$.each(_result, function(brand_key, __result) {
											view+='<div id="reportStocks'+brand_key+'" class="table-responsive">';
												view += '<table class="table table-all-stocks table-bordered table-custom-bordered thead-inverse-two" id="tableStocks'+brand_key+'">';
												view += '<thead>';
												view += '<tr>';
												view += '<th colspan="2">'+brand_key+'</th>';
												view += '</tr>';
												view += '<tr>';
												view += '<th>Model</th>';
												view += '<th>Total</th>';
												view += '</tr>';
												view += '</thead>';
												view += '<tbody>';
													$.each(__result, function (brand_key, result) {
														view += '<tr>';
														view += '<td>' + result.model + '</td>';
														view += '<td>' + result.total_model + '</td>';
														view += '</tr>';
													});
												view += '</tbody>';
												view += '</table>';
											view+='</div>';
										});
										view+='</div>';
									view+='</div>';		
								i++;											
							});
						}
						else{
							view = "<h5 class='text-center'>No data available in the table</h5>";
						}
			}, 
			complete: function(data){
					$("#report-all-stock").html(view);
								
			}
		});
		return this;
	}
};