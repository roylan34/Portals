var reportInvntInOutTable = {
	pageDetails: function(branch){
   			$(".content-header h1").text("Machine Inventory");
  			$(".content-header h1").append("<small>Reports</small>");
  			self.reportInvntInOutTable.drop_down_branch(branch);
  		return this;
	 },
	drop_down_branch: function(branch){
      	if(branch == 1){ // 1 = list of all branches.
          autoDrpDownInvnt.getBranch("#slctreports-in-out",null,[1],2);
          $("#slctreports-in-out").change(function(){
          		var inst = $(this);
          		self.reportInvntInOutTable.table_in_out_stock(inst.val());
          });
        }
        else{
          $("#dropdwn-in-out-stocks").remove();
        }
        return this;
	},
	table_in_out_stock: function(branch){
		var view='';
		var defaultBranch =  $("#slctreports-in-out option:selected").val(); //get the 2nd option value as default branch value.
		var id_branch = (branch == 1 ? defaultBranch : branch); 
		$.ajax({
			type: "GET",
			url: assets+"php/inventory/reports/in-out-stocks.php",
			cache: false,
			data: { id_branch : id_branch},
			dataType: 'json',
			success: function (data, status, xhr) {
						if(data.length != 0){
							var i = 0;
							$.each(data, function(_brand_key, _result) {
									view+='<div class="col-lg-3 col-md-3 col-md-6 '+( i % 4 === 0 ? "clearFix": "" )+'">';
										view+='<div class="panel panel-orange" id="panelReportInOutStocks'+_brand_key+'">';
											view+='<div class="panel-heading">';
												view+='<div class="row">';
													view+='<div class="col-xs-3">';
														view+='<i class="fa fa-print fa-2x"></i>';
													view+='</div>';
												view+='<div class="col-xs-9 text-right">';
												view+='<div class="huge"></div>';
												view+='<div class="text-left"><h4>'+_brand_key+'';
												view+='</h4></div>';
														view+='</div>';
													view+='</div>';
											view+='</div>';
											view+='<div id="reportInOutStocks'+_brand_key+'" class="table-responsive">';
											view += '<table class="table table-bordered table-custom-bordered thead-inverse" id="tableInOutStocks'+_brand_key+'">';
											view += '<thead>';
											view += '<tr>';
											view += '<th>Model</th>';
											view += '<th>Total IN</th>';
											view += '<th>Total OUT</th>';
											view += '<th>Over all Total</th>';
											view += '</tr>';
											view += '</thead>';
											view += '<tbody>';
											 $.each(_result, function(brand_key, result) {
												view += '<tr>'
												view += '<td>'+ result.model_name+ '</td>';
												view += '<td>'+ result.total_in+ '</td>';
												view += '<td>'+ result.total_out+ '</td>';
												view += '<td>'+ result.over_all_total+ '</td>';
												view += '</tr>';
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
					$("#report-in-out-stock").html(view);
								
			}
		});
		return this;
	}
};