//Current
var dtCurrentInvtHq = {
	  dtInstance: null,
	  selectedBranch: null,
	  pageDetails: function(){
	  			$(".content-header h1").text("Machine Inventory");
	  			$(".content-header h1").append("<small>Current</small>");
	  		return this;
	  },
      render: function(){
      				// document.title = "Inventory"; // Change the title tag.
	                this.dtInstance = $('#dtCurrentInvtHq').DataTable({
	                	        "initComplete": function(){
	                	        						autoDrpDownInvnt.getType("#search-hq-type");//Search Dropdown
														autoDrpDown.getBrandName("#search-hq-brand")
																	.getCategory("#search-hq-category");

	                	        				},
	                            "dom" : "Bl<'dropdown-bulk col-md-3 col-xs-12'>rtip",
	                            "ordering": false,
	                            "autoWidth" : false,
	                            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
	                            "pageLength": 25,
	                            "serverSide": true,
	                            "processing": true,
	                            "language": {
					                            "processing": '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',					    
					                            "infoEmpty": 'No entries to show'
		                        },
	                            "destroy": true,
	                            "responsive": true,
	                            "buttons": [
	                                        {
			                                    extend: "excel",
			                                    className: 'btn-excel-inventory hidden-xs',
			                                    exportOptions: { columns: [1,2,3,4,5] },
			                                    filename: 'Current HQ Inventory ' + getTodayDate()
			                                },
			                               {
			                                    extend: "print",
			                                    exportOptions: { columns: [0,1,2,3,4,5,6] },
			                                    // autoPrint: false,
			                                    className: 'btn-print-inventory hidden-xs',
			                                    customize: function(win){
			                                        var elem = $(win.document.body);
                                            		elem.find('h1').remove();
                                                	elem.prepend("<h4>Machine HQ Inventory Stocks</h4>"); 

			                                    }
                                			},
			                                {
			                                    text: 'Open Search Filter',
			                                    className: 'btn-search-inventory',
			                                    action: function ( e, dt, node, config ) {
		                                            $("#dthead-search-invnt-hq").slideToggle('fast',function(){
		                                                if($(this).is(':visible')){
		                                                    node[0].innerText = 'Close Search Filter';
		                                                }else{
		                                                   node[0].innerText = 'Open Search Filter';
		                                                    $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //		                                                  
		                                                    dtCurrentInvtHq.dtInstance.ajax.reload(null, true);
		                                                }
		                                            });
			                                    }
			                                }
	                            ],
	                            "ajax": {
	                                "url": assets+'php/inventory/sapHQInventory.php',
	                                "type": "POST",
	                                "dataSrc": "records",
	                                 data: function(d){	                                 		
	                                 		d.serialnumber = $("#search-hq-serial").val() || '';
	                                 		d.brand = $("#search-hq-brand option:selected").val() || '';
	                                 		d.model = $("#search-hq-model").val() || '';
	                                 		d.category = $("#search-hq-category option:selected").val() || '';
	                                 		d.type = $("#search-hq-type option:selected").val() || '';                                	  
	                                     }
	                            },	   
	                            "columns": [
	                            	{ "data": null},
	                                { "data": "serialnumber"},
	                                { "data": "brand_name"},
	                                { "data": null, render: function(data){
	                                		var model = data.model_name || "- No Manufacturer ";
	                                		return model;
	                                	}
	                            	},
	                                { "data": null, render: function(data){
	                                		var cat = data.cat_name || "---";
	                                		return cat;
	                                	}
	                                },
	                                { "data": null, render: function(data){
	                                		var type = data.type_name || "---";
	                                		return type;
	                                	}
	                            	}
	                            ],
	                            "columnDefs": [
	                                {
	                                    "targets": 0,
	                                    "render": function ( data, type, row, meta ) {
	                                       return meta.row + 1;
	                                    }
	                                }
	                            ],
	                            "preDrawCallback": function(settings){
		                           $(".btn-excel-inventory, .btn-print-inventory, .btn-search-inventory").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
		                           $(".btn-print-inventory").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
		                           $(".btn-excel-inventory").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
				                }
	                    });
	        return this;               
    },
    actions: function(){
    	$("#dthead-search-invnt-hq").on('click','button, a',function(e) {
    		e.preventDefault();
    		    var inst = $(this);
    		    var button_label = inst.text().toLowerCase();

                //Search button
                if(button_label == "search"){
                    self.dtCurrentInvtHq.dtInstance.ajax.reload(null, true);
                }
                //Reset button
                if(button_label =="reset"){
	                $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //Clear all values;
	                self.dtCurrentInvtHq.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                } 
    	});
    	return this;    	 
    },

};