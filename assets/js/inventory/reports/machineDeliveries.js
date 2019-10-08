var reportInvntMachineDeliver = {
	pageDetails: function (branch) {
		$(".content-header h1").text("Machine Inventory");
		$(".content-header h1").append("<small>Reports</small>");
		return this;
	},
	table_sap_issuances: function (date) {
		var view = '';
		$.ajax({
			type: "GET",
			url: assets + "php/inventory/reports/sap-issuances.php",
			cache: false,
			dataType: 'json',
			data: {date: date},
			success: function (data, status, xhr) {
				if (data.length != 0) {
					var i = 0;
					$.each(data, function (_brand_key, _result) {
						view += '<div class="col-lg-3 col-md-3 col-md-6 ' + (i % 4 === 0 ? "clearFix" : "") + '">';
						view += '<div class="panel panel-orange" id="panelReportInOutStocks' + _brand_key + '">';
						view += '<div class="panel-heading">';
						view += '<div class="row">';
						view += '<div class="col-xs-3">';
						view += '<i class="fa fa-print fa-2x"></i>';
						view += '</div>';
						view += '<div class="col-xs-9 text-right">';
						view += '<div class="huge"></div>';
						view += '<div class="text-left"><h4>' + _brand_key + '';
						view += '</h4></div>';
						view += '</div>';
						view += '</div>';
						view += '</div>';
						view += '<div id="reportInOutStocks' + _brand_key + '" class="table-responsive">';
						view += '<table class="table table-bordered table-custom-bordered thead-inverse" id="tableInOutStocks' + _brand_key + '">';
						view += '<thead>';
						view += '<tr>';
						view += '<th>Model</th>';
						view += '<th>Total</th>';
						view += '</tr>';
						view += '</thead>';
						view += '<tbody>';
						$.each(_result, function (brand_key, result) {
							view += '<tr>'
							view += '<td>' + result.model + '</td>';
							view += '<td>' + result.total_model + '</td>';
							view += '</tr>';
						});
						view += '</tbody>';
						view += '</table>';
						view += '</div>';
						view += '</div>';
						view += '</div>';
						i++;
					});
				}
				else {
					view = "<h5 class='text-center'>No data available in the table</h5>";
				}
			},
			complete: function (data) {
				$("#report-sap-issuances").html(view);

			}
		});
		return this;
	}
};