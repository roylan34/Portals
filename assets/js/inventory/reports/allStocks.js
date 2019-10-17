var reportInvntAlltocks = {
	pageDetails: function(branch){
   			$(".content-header h1").text("Machine Inventory");
  			$(".content-header h1").append("<small>Reports</small>");
  		return this;
	 },
	// table_all_stock_v1: function(branch){
	// 	var view='';
	// 	$.ajax({
	// 		type: "GET",
	// 		url: assets+"php/inventory/reports/all-stocks.php",
	// 		cache: false,
	// 		dataType: 'json',
	// 		success: function (data, status, xhr) {
	// 					if(data.length != 0){
	// 						var i = 0;
	// 						$.each(data, function(branch_key, _result) {
	// 								view+='<div class="col-lg-2 col-md-4 '+( i % 6 === 0 ? "clearFix": "" )+'">';
	// 									view+='<div class="panel panel-orange" id="panelReportStocks'+branch_key+'">';
	// 										view+='<div class="panel-heading">';
	// 											view+='<div class="row">';
	// 											view+='<div class="text-center"><h5><strong>'+branch_key+'';
	// 											   // view+='<button type="button" class="btn btn-default btn-xs glyphicon glyphicon-print reportPrint" id="btnReportStocks'+brand_key+'" onclick=printReport(this,"#reportStocks'+brand_key+'"); title="Print"></button>';
	// 											view+='</strong></h5></div>';
	// 												view+='</div>';
	// 										view+='</div>';
	// 									$.each(_result, function(brand_key, __result) {
	// 										view+='<div id="reportStocks'+brand_key+'" class="table-responsive">';
	// 											view += '<table class="table table-all-stocks table-bordered table-custom-bordered thead-inverse-two" id="tableStocks'+brand_key+'">';
	// 											view += '<thead>';
	// 											view += '<tr>';
	// 											view += '<th colspan="3">'+brand_key+'</th>';
	// 											view += '</tr>';
	// 											view += '<tr>';
	// 											view += '<th>Model</th>';
	// 											view += '<th>BN</th>';
	// 											view += '<th>RF</th>';
	// 											// view += '<th>Total</th>';
	// 											view += '</tr>';
	// 											view += '</thead>';
	// 											view += '<tbody>';
	// 												$.each(__result, function (brand_key, result) {
	// 													view += '<tr>';
	// 													view += '<td>' + result.model + '</td>';
	// 													view += '<td>' + result.total_bn + '</td>';
	// 													view += '<td>' + result.total_rf + '</td>';
	// 													// view += '<td>' + result.total_model + '</td>';
	// 													view += '</tr>';
	// 												});
	// 											view += '</tbody>';
	// 											view += '</table>';
	// 										view+='</div>';
	// 									});
	// 									view+='</div>';
	// 								view+='</div>';		
	// 							i++;											
	// 						});
	// 					}
	// 					else{
	// 						view = "<h5 class='text-center'>No data available in the table</h5>";
	// 					}
	// 		}, 
	tableFixedHeader: function (cb){
		var thead_fixed_container = document.querySelector("#table_head_all_stocks table");
		//If element not found,  invoke the callback and turn off the event listener resize.
		if(thead_fixed_container != null){
		  	if(cb !== undefined){
			  	cb.call(this, thead_fixed_container);
			  	return;
			  }

		  var thead_fixed_branch 	= thead_fixed_container.querySelectorAll("tr:first-child th[rowspan]");
		  var thead_fixed_bnrf   	= thead_fixed_container.querySelectorAll("tr:nth-child(2) th");
		  var tbody_container    	= document.querySelector("#table_body_all_stocks table");
		  var tbody    				= tbody_container.querySelectorAll("tbody tr:not([data-brand])");
		  var thead_widths    	 = [];

		  //Set px width of TABLE container base on TABLE FIXED width
		  tbody_container.style.width = thead_fixed_container.offsetWidth+'px';
		  //THEAD Branch
		  foreach(thead_fixed_branch, function(val, key){
		    thead_widths.push(val.offsetWidth); //save the th width.
		      
		      //Iterate tr
		      foreach(tbody, function(tb_val, tb_key){
		        //Set td widths
		        foreach(tb_val.querySelectorAll('td'), function(v,k){
		          if(k <= 2){
		            v.style.width = thead_widths[k]+"px";
		          }
		          return;
		        });
		      }); 
		  });
		  //THEAD Bn/Rf
		  foreach(thead_fixed_bnrf, function(val, key){
		    thead_widths.push(val.offsetWidth); //save the th width.
		      
		      //Iterate tr
		      foreach(tbody, function(tb_val, tb_key){
		        //Set td widths
		        foreach(tb_val.querySelectorAll('td'), function(v,k){
		          if(k > 2){
		            v.style.width = thead_widths[k]+"px";
		          }
		          return;
		        });
		      }); 
		  });
		}

	},
	table_all_stock: function(branch){
		var view='';
		$.ajax({
			type: "GET",
			url: assets+"php/inventory/reports/all-stocks.php",
			cache: false,
			dataType: 'json',
			success: function (data, status, xhr) {
				var seq_num = 0;
						if(data.length != 0){
							// var i = 0;
							var thead = ['Model', 'Total BN', 'Total RF', 'Makati', 'Cebu', 'Davao','Bacolod','Boracay','Pampanga','Cagayan','Ilo-ilo','Bicol'];

								//view+='<div id="reportStocks" class="table-responsive">';
									view +=  '<div id="table_head_all_stocks">';
									view += '<table class="table table-bordered table-custom-bordered thead-inverse-two">';
									view += '<thead>';
									view += '<tr>';
									foreach(thead, function(item, idx){
										if(idx <= 2)
											view += '<th '+(idx == 0 ? 'style="width:15%"' : "")+' rowspan="2">'+item+'</th>';
										else
											view += '<th colspan="2">'+item+'</th>';
									});
									view += '</tr>';
									foreach(thead, function(item, idx){
										if(idx > 2){

											view += '<th>BN</th>';
											view += '<th>RF</th>';
										}
										
									});
									view += '</thead>';
									view += '</table>';
									view +=  '</div>';
									view +=  '<div id="table_body_all_stocks">';
									view += '<table class="table">';
									view += '<tbody>';
										$.each(data, function(brand_key, brand_val) {
											view += '<tr data-brand="'+brand_key+'" style="border-top: 2px solid #d4d4d4;">';
											view += '<td colspan="'+( thead.length * 2 + 2 )+'" style="font-weight:700">' + brand_key + '</td>';
											view += '</tr>';
											$.each(brand_val, function(model_key, model_val) {

												var sum_bn = model_val.total.bn.reduce(function(total, amount ) { 
													 return parseInt(total) + parseInt(amount)
												});
												var sum_rf =model_val.total.rf.reduce(function(total, amount ) { 
													 return parseInt(total) + parseInt(amount);
												});
												view += '<tr>';
												view += '<td >'+ model_key +'</td>';
												view += '<td >' + (sum_bn > 0 ? sum_bn : "") + '</td>';
												view += '<td >' + (sum_rf > 0 ? sum_rf : "") + '</td>';
												
												thead.map(function(cur, idx){
													if(idx > 2){
														view += '<td>' +  (model_val.total.hasOwnProperty(cur.toUpperCase()) && model_val.total[cur.toUpperCase()].hasOwnProperty('bn') && model_val.total[cur.toUpperCase()].bn > 0 ? model_val.total[cur.toUpperCase()].bn  : "") + '</td>';
														view += '<td>' +  (model_val.total.hasOwnProperty(cur.toUpperCase()) && model_val.total[cur.toUpperCase()].hasOwnProperty('rf') && model_val.total[cur.toUpperCase()].rf > 0 ? model_val.total[cur.toUpperCase()].rf  : "") + '</td>';
														
													}																																									
												})

												view += '</tr>';
											});
										});
									view += '</tbody>';
									view += '</table>';
									view += '</div>';
								//view+='</div>';
										
						}
						else{
							view = "<h5 class='text-center'>No data available in the table</h5>";
						}
			}, 
			complete: function(data, status){
				if(status === 'success'){
					$("#report_all_stock").html(view);
						self.reportInvntAlltocks.tableFixedHeader();

						$(window).on('resize', function(e){
					        self.reportInvntAlltocks.tableFixedHeader(function(e){
					        	if(!e){
					        		$(window).off('resize');
					        	}
					        });
					    });					  	
				}	
			}	

		}); //end ajax
		return this;
	}
};