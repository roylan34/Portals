var reportSalesPerAccount = {
	pageDetails: function(){
   			$(".content-header h1").text("Sales");
  			$(".content-header h1").append("<small>Report</small>");
  			self.reportSalesPerAccount.drop_down_sales();
  		return this;
	 },
	drop_down_sales: function(){

      autoDrpDown.getlistYear("#select-year-sales");
      autoDrpDown.getlistYear("#select-yearly-sales");
      $("#select-month-sales, #select-year-sales").on('change',function(){
      		self.reportSalesPerAccount.table_montly_sales();
      });
      $("#select-yearly-sales").on('change',function(){
      		self.reportSalesPerAccount.table_yearly_sales();
      });
        
	},
	table_montly_sales: function(){
		var view='';
		var selectedMonth = $("#select-month-sales option:selected").val(); //get the 2nd option value as default branch value.
		var selectedYear  = $("#select-year-sales option:selected").val(); //get the 2nd option value as default branch value.
		$.ajax({
			type: "GET",
			url: assets+"php/company/sapSalesPerAccount.php",
			cache: false,
			data: {action:"month", month: selectedMonth, year : selectedYear},
			dataType: 'json',
			success: function (data, status, xhr) {
						if(data.length != 0){
								$.each(data, function(employ_key, employ) {
									view += '<tr>';
									view += '<td>'+ employ.acc_manager+ '</td>';
									view += '<td>'+ employ.t_vat+ '</td>';
									view += '<td>'+ employ.t_gross+ '</td>';
									view += '<td>'+ employ.t_net+ '</td>';
									view += '</tr>';
								});
						}
						else{
							view = "<tr><td colspan='4'><h5 class='text-center'>No data available in the table</h5></td></tr>";
						}
			}, 
			complete: function(data){
					$("#reportMonthlySales > tbody").html(view);
								
			}
		});
		return this;
	},
	table_yearly_sales: function(){
		var view='';
		var selectedYear = $("#select-yearly-sales option:selected").val(); //get the 2nd option value as default branch value.
		$.ajax({
			type: "GET",
			url: assets+"php/company/sapSalesPerAccount.php",
			cache: false,
			data: {action:"year", year : selectedYear},
			dataType: 'json',
			success: function (data, status, xhr) {
						if(data.length != 0){
								$.each(data, function(employ_key, employ) {
									view += '<tr>';
									view += '<td>'+ employ.acc_manager+ '</td>';
									view += '<td>'+ employ.t_vat+ '</td>';
									view += '<td>'+ employ.t_gross+ '</td>';
									view += '<td>'+ employ.t_net+ '</td>';
									view += '</tr>';
								});
						}
						else{
							view = "<tr><td colspan='4'><h5 class='text-center'>No data available in the table</h5></td></tr>";
						}
			}, 
			complete: function(data){
					$("#reportYearlySales > tbody").html(view);
								
			}
		});
		return this;
	}
};