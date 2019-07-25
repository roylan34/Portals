//Archive
var dtArchiveInventory = {
	  dtInstance: null,
	  selectedBranch: null,
	   pageDetails: function(){
	   			$(".content-header h1").text("Machine Inventory");
	  			$(".content-header h1").append("<small>Archive</small>");
	  		return this;
	  },
      render: function(app_invnt,branch,user_role){
      				// document.title = "Inventory"; // Change the title tag.
	                this.dtInstance = $('#dtArchiveInventory').DataTable({ //Table logs is using Server-side processing to avoid loading all datas.
	                	        "initComplete": function(){
	                	        						autoDrpDownInvnt.getType("#search-invnt-type")
															.getCondition("#search-invnt-bnrf");
														autoDrpDown.getBrandName("#search-invnt-brand")
																	.getCategory("#search-invnt-category");
														
	                	        				},
	                            "dom" : "Bl<'dropdown-branch col-md-3 col-xs-12'>rtip",
	                            "ordering": false,
	                            "autoWidth" : false,
	                            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
	                            "language": {
					                            "processing": true,
					                            "loadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
					                            "infoEmpty": 'No entries to show'
		                        },
	                            "destroy": true,
	                            "responsive": true,
	                            "buttons": [
	                                        {
			                                    extend: "excel",
			                                    className: 'btn-excel-inventory hidden-xs',
			                                    exportOptions: { columns: [1,2,3,4,5,6,7] },
			                                    filename: 'Archive Inventory ' + getTodayDate()
			                                },
			                               {
			                                    extend: "print",
			                                    exportOptions: { columns: [0,1,2,3,4,5,6,7] },
			                                    // autoPrint: false,
			                                    className: 'btn-print-inventory hidden-xs',
			                                    customize: function(win){
			                                         var elem = $(win.document.body);
                                            		elem.find('h1').remove();
                                                	elem.prepend("<h4>Machine Archive Stocks</h4>"); 

			                                    }
                                			},
			                                {
			                                    text: 'Open Search Filter',
			                                    className: 'btn-search-inventory',
			                                    action: function ( e, dt, node, config ) {
		                                            $("#dthead-search-invnt").slideToggle('fast',function(){
		                                                if($(this).is(':visible')){
		                                                    node[0].innerText = 'Close Search Filter';
		                                                }else{
		                                                   node[0].innerText = 'Open Search Filter';
		                                                    // $("#dt-head-search input[type='text']").val('');  //
		                                                    // $("#search-company-branch, #search-company-accmngr").val(0).trigger('chosen:updated'); //reset
		                                                    dtArchiveInventory.dtInstance.ajax.reload(null, true);
		                                                }
		                                            });
			                                    }
			                                }
	                            ],
	                            "ajax": {
	                                "url": assets+'php/inventory/inventory.php',
	                                "type": "POST",
	                                 data: function(d){
	                                 		var defaultBranch = $("#archive-invnt-branchlist option:selected").val(); //get the 2nd option value as default branch value.

	                                 		d.status_type = "OUT";
	                                 	    d.action = "view-all";
	                                 	    d.branch = (branch == 1 ? defaultBranch : branch); //if branch is 1 = ALL, set default value to 2 = MNL else get cookies branch.
	                                     }
	                            },	   
	                            "columns": [
	                                { "data": null},
	                                { "data": "serialnumber"},
	                                { "data": "brand_name"},
	                                { "data": "model"},
	                                { "data": "cat_name"},
	                                { "data": "type_name" },
	                                { "data": "location" },
	                                { "data": "company_name" },
	                                { "data": "date_entered" },
	                                { "data": "acronym_name" },
	                                { "data": null, "width": '30px'},
	                                { "data": null, "width": '30px'}
	                            ],
	                            "columnDefs": [
	                                {
	                                    "targets": 0,
	                                    "render": function ( data, type, row, meta ) {
	                                       return meta.row + 1;
	                                    }
	                                },
	                                {
	                                    "targets": 10,
	                                    "render": function ( data, type, row, meta ) {
	                                       return '<a href="#" title="IN MACHINE" data-toggle="modal" data-target="#modalFormInMachine" class="btn btn-success btn-flat btn-xs btn-in-inventory" data-id-machine="'+data.id+'" data-id-company="'+data.id_company+'">IN</a>';;
	                                    }
	                                },
	                                {
	                                	"targets": 11,
	                                	"render": function(data){
  											return '<a title="STATUS LOGS" class="btn btn-xs btn-default-logs btn-flat viewInvntStatusLogs" data-id-machine-logs="'+data.id+'"><i class="fa fa-clock-o"></i></a>';
	                                	}
	                                }
	                            ],
	                             "fnDrawCallback": function(oSettings){				                           
				                     var action = jwt.get('app_module_action');
			                            if(action == null){
			                                 $(".viewInvntStatusLogs, .btn-in-inventory").remove();
			                            }
			                            else{
			                                if(action.action_invnt == "r")
			                                    $(".viewInvntStatusLogs, .btn-in-inventory").remove();
			                            }
			                          return false;
				                },
	                            "preDrawCallback": function(settings){
		                           $(".btn-search-inventory, .btn-excel-inventory, .btn-print-inventory").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
		                           $(".btn-print-inventory").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
		                           $(".btn-excel-inventory").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
				                }
	                    });
	        return this;               
    },
    selectBranch: function(app_invnt,branch){
			if(app_invnt == 1 && branch == 1){ //Display only if app_module is inventory and branch is 1 = "ALL".
				$("div.archive-invnt-branches").html('<label>Branch: <select id="archive-invnt-branchlist" style="padding:2px 4px"></select></label> '); // DOM Dropdown Branch. 
					autoDrpDownInvnt.getBranch("#archive-invnt-branchlist",null,[1],2); // 2 = Makati branch set as default.

				$("select#archive-invnt-branchlist").change(function(){
				   	dtArchiveInventory.dtInstance.ajax.reload();
				});
	    	}
    	return this;
    },
    modalShowInMachine: function(){
        $("#displayFormInvntInOutMachine").load(pages+'inventory/archive/form-in.html',function(status){
                autoDrpDownInvnt.getStatus("#slctArchInvntStatus","IN");
                // autoDrpDown.getAllCompany("#slctArchInvntCompany","100%");
                 $("#txtArchInvntDateIn").inputmask();//Datemask2 mm/dd/yyyy
        });
        return this;
    },
    inMachine: function(idmachine){//For development
            var $btn     = $("button[type='submit']");
            var id       = $("#hdnInvntInId").val();
            var status   = $("#slctArchInvntStatus option:selected").val();
            var company  = $("#hdnInvntInCompanyId").val();
            var date 	 = $("#txtArchInvntDateIn").val();
            var remarks  = $("#txtArchInvntRemarks").val();
            var serialnum=$("#hdnInvntInSerial").val();
            var id_user   = jwt.get('user_id');
            var data = { action:'update_in', id_machine:id, status:status, company: company, date: date, remarks: remarks, id_user:id_user, serialnum:serialnum} 

            $.ajax({
                type: 'POST',
                url: assets+'php/inventory/inventory.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data, xhr, status){
                    self.dtArchiveInventory.dtInstance.ajax.reload(function(){
                        promptMSG('success-retrieve','Machine',null,null,false);
                        $('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
                            $('#modalFormInMachine').modal('hide');
                       });
                    }, true); // Reload the data in DataTable and go to last page.

                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ $btn.button('reset'); }
            }); 
    },
    getCompanyName: function(id_machine){
    	 	if (id_machine != ''){
    	 		 var $btn = $("button[type='submit']");

			 	$.ajax({
	                type: 'POST',
	                url: assets+'php/inventory/inventory.php',
	                data: {action: 'get-company-name', id_machine:id_machine},
	                dataType: 'json',
	                beforeSend: function(){ $btn.button('loading'); },
	                success: function(data, xhr, status){
	                	$.each(data.aaData, function(i,val){
	                		 $("#hdnInvntInCompanyId").val(val.id);
	                		 $("#slctArchInvntCompany").text(val.company_name);
	                		 $("#hdnInvntInSerial").val(val.serialnumber);
	                	});
	                },
	                error: function(xhr,status){ alert(xhr + status); },
	                complete: function(){ 
	                		$btn.button('reset');  
	            		}
	            });
			}
			else { alert('ID is empty'); }
		return this;
    },
    actions: function(){
    	$("#archiveInventoryList").on('click','a.btn-in-inventory, button.dt-invnt-refresh, a.viewInvntStatusLogs',function(e) {
    		e.preventDefault();
    		    var inst = $(this);
    		    //Highlight row selected.
      			if ( !inst.closest('tr').hasClass('selected') ) {  
                    self.dtArchiveInventory.dtInstance.$('tr.selected').removeClass('selected');
                    inst.closest('tr').addClass('selected');
                }

                //Actions
		   	 	if ($(inst[0]).hasClass('btn-in-inventory')) { // IN
    	   	 		 var id_machine = $(inst[0]).data('id-machine') || '';
   	 					              $("#hdnInvntInId").val(id_machine);
   	 					              self.dtArchiveInventory.getCompanyName(id_machine);
   	 	    	   
		   	 	}   		   	 	
		   	 	else if ($(inst[0]).hasClass('dt-invnt-refresh')) { // Refresh
    	   	 		 var branch = jwt.get('branch');
    	   	 		 var app_module = jwt.get('app_module');
   	 					 self.dtArchiveInventory.render(app_module.invnt,branch);   	 	    	   
		   	 	}
                else if ($(inst[0]).hasClass('viewInvntStatusLogs')) { //Show modal MIF activity logs.
                        var id_machine = inst.data('id-machine-logs');
                         	dtInvntLogs.showModal(id_machine)
                }
		   	 	else{ return false; }      	   	 		   	   	 
	    	   		
  
    	});
    	return this;  
    	  
    }
};