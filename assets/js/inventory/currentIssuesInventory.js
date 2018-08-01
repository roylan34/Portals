//Current
var dtCurrentInvtIssuances = {
	  dtInstance: null,
	  selectedBranch: null,
	  pageDetails: function(){
	  			$(".content-header h1").text("Machine Inventory");
	  			$(".content-header h1").append("<small>Current</small>");
	  		return this;
	  },
      render: function(){
      				// document.title = "Inventory"; // Change the title tag.
	                this.dtInstance = $('#dtCurrentInvtIssuances').DataTable({
	                            "dom" : "Blrtip",
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
			                                    exportOptions: { columns: [1,2,3,4,5,6,7] },
			                                    filename: 'Current HQ Inventory ' + getTodayDate()
			                                },
			                               {
			                                    extend: "print",
			                                    exportOptions: { columns: [0,1,2,3,4,5,6,7] },
			                                    // autoPrint: false,
			                                    className: 'btn-print-inventory hidden-xs',
			                                    customize: function(win){
			                                        var elem = $(win.document.body);
                                            		elem.find('h1').remove();
                                                	elem.prepend("<h4>Machine Issues</h4>"); 

			                                    }
                                			},
			                                {
			                                    text: 'Open Search Filter',
			                                    className: 'btn-search-inventory',
			                                    action: function ( e, dt, node, config ) {
		                                            $("#dthead-search-invnt-issuances").slideToggle('fast',function(){
		                                                if($(this).is(':visible')){
		                                                    node[0].innerText = 'Close Search Filter';
		                                                }else{
		                                                   node[0].innerText = 'Open Search Filter';
		                                                    $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //		                                                  
		                                                    dtCurrentInvtIssuances.dtInstance.ajax.reload(null, true);
		                                                }
		                                            });
			                                    }
			                                }
	                            ],
	                            "ajax": {
	                                "url": assets+'php/inventory/sapIssuances.php',
	                                "type": "POST",
	                                "dataSrc": "records",
	                                 data: function(d){	 
	                                 		d.company_name 	= $("#search-hq-company").val() || '';                                		
	                                 		d.ref 			= $("#search-hq-ref ").val() || '';                                		
	                                 		d.date 			= $("#search-hq-date").val() || '';
	                                 		d.item 			= $("#search-hq-item").val() || '';
	                                 		d.descrip 		= $("#search-hq-descrip").val() || '';
	                                 		d.serial 		= $("#search-hq-issue-serial").val() || '';
	                                 		d.trans 		= $("#search-hq-transfer ").val() || '';                                	  
	                                     }
	                            },	   
	                            "columns": [
	                            	{ "data": null},
	                                { "data": "company_name"},
	                                { "data": "ref_no"},
	                                { "data": "doc_date"},
	                                { "data": "item_code"},
	                                { "data": "description"},
	                                { "data": "serial"},
	                                { "data": "trans_type"}
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
    	$("#dthead-search-invnt-issuances").on('click','button, a',function(e) {
    		e.preventDefault();
    		    var inst = $(this);
    		    var button_label = inst.text().toLowerCase();

                //Search button
                if(button_label == "search"){
                    self.dtCurrentInvtIssuances.dtInstance.ajax.reload(null, true);
                }
                //Reset button
                if(button_label =="reset"){
	                $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //Clear all values;
	                self.dtCurrentInvtIssuances.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                } 
    	});
    	return this;    	 
    },

};