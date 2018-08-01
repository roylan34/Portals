var reportInvntBnRfTable = {
	pageDetails: function(branch){
   			$(".content-header h1").text("Machine Inventory");
  			$(".content-header h1").append("<small>Reports</small>");
  			self.reportInvntBnRfTable.drop_down_branch(branch);
  		return this;
	 },
	drop_down_branch: function(branch){
      	if(branch == 1){ // 1 = list of all branches.
          autoDrpDownInvnt.getBranch("#reports-invnt-stocks",null,[1],2);
          $("#reports-invnt-stocks").change(function(){
          		var inst = $(this);
          		self.reportInvntBnRfTable.table_brand_stock(inst.val());
          });
        }
        else{
          $("#dropdwn-report-stocks").remove();
        }
	},
	table_brand_stock: function(branch){
		var view='';
		var defaultBranch = $("#reports-invnt-stocks option:selected").val(); //get the 2nd option value as default branch value.
		var id_branch = (branch == 1 ? defaultBranch : branch); 
		$.ajax({
			type: "GET",
			url: assets+"php/inventory/reports/brand-stocks.php",
			cache: false,
			data: { id_branch : id_branch},
			dataType: 'json',
			success: function (data, status, xhr) {
						if(data.length != 0){
							var i = 0;
							$.each(data, function(brand_key, result) {
									view+='<div class="col-lg-3 col-md-6 '+( i % 4 === 0 ? "clearFix": "" )+'">';
										view+='<div class="panel panel-orange" id="panelReportStocks'+brand_key+'">';
											view+='<div class="panel-heading">';
												view+='<div class="row">';
													view+='<div class="col-xs-3">';
														view+='<i class="fa fa-print fa-2x"></i>';
													view+='</div>';
												view+='<div class="col-xs-9 text-right">';
												view+='<div class="huge"></div>';
												view+='<div class="text-left"><h4>'+brand_key+'';
												   // view+='<button type="button" class="btn btn-default btn-xs glyphicon glyphicon-print reportPrint" id="btnReportStocks'+brand_key+'" onclick=printReport(this,"#reportStocks'+brand_key+'"); title="Print"></button>';
												view+='</h4></div>';
														view+='</div>';
													view+='</div>';
											view+='</div>';
											view+='<div id="reportStocks'+brand_key+'" class="table-responsive">';
											view += '<table class="table table-bordered table-custom-bordered thead-inverse" id="tableStocks'+brand_key+'">';
											view += '<thead>';
											view += '<tr>';
											view += '<th>Model</th>';
											view += '<th>BN</th>';
											view += '<th>RF</th>';
											view += '</tr>';
											view += '</thead>';
											view += '<tbody>';
												$.each(result, function(cat_type_key, _result) {
													view += '<tr><th colspan="3">'+ cat_type_key + '</th></tr>';

													$.each(_result, function(data_key, __result) {
														view += '<tr>'
														view += '<td>'+ __result.model_name+ '</td>';
														view += '<td>'+ __result.bn+ '</td>';
														view += '<td>'+ __result.rf+ '</td>';
														view += '</tr>';
													});
												});
											view += '</tbody>';
											view += '</table>';
											view+='</div>';
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
					$("#report-brand-stock").html(view);
								
			}
		});
		return this;
	}
};