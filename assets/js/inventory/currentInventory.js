//Current
var dtCurrentInventory = {
	  dtInstance: null,
	  selectedBranch: null,
	  pageDetails: function(){
	  			$(".content-header h1").text("Machine Inventory");
	  			$(".content-header h1").append("<small>Current</small>");
	  		return this;
	  },
      render: function(app_invnt,branch,user_role){
      				// document.title = "Inventory"; // Change the title tag.
	                this.dtInstance = $('#dtCurrentInventory').DataTable({
	                	        "initComplete": function(){
	                	        						autoDrpDownInvnt.getType("#search-invnt-type")//Search Dropdown
																		.getCondition("#search-invnt-bnrf");
														autoDrpDown.getBrandName("#search-invnt-brand")
																	.getCategory("#search-invnt-category");

	                	        				},
	                            "dom" : "Bl<'dropdown-bulk col-md-3 col-xs-12'>rtip",
	                            "ordering": false,
	                            "autoWidth" : false,
	                            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
	                            "pageLength": 25,
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
			                                    exportOptions: { columns: [1,2,3,4,5,6,7,8] },
			                                    filename: 'Current Inventory ' + getTodayDate()
			                                },
			                               {
			                                    extend: "print",
			                                    exportOptions: { columns: [0,1,2,3,4,5,6,7,8] },
			                                    // autoPrint: false,
			                                    className: 'btn-print-inventory hidden-xs',
			                                    customize: function(win){
			                                        var elem = $(win.document.body);
                                            		elem.find('h1').remove();
                                                	elem.prepend("<h4>Machine Inventory Stocks</h4>"); 

			                                    }
                                			},
			                                {
			                                    text: 'Add Machines',
			                                    tag: 'a',
			                                    className: 'btn-add-inventory',
			                                    action: function ( e, dt, node, config ) {
			                                          // self.dtCurrentInventory.modalShow();
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
		                                                    $(".dt-searchfield input[type='text']").val('');  //clear text
		                                                    $(".dt-searchfield select option").val(null); //reset
		                                                    dtCurrentInventory.dtInstance.ajax.reload(null, true);
		                                                }
		                                            });
			                                    }
			                                }
	                            ],
	                            "ajax": {
	                                "url": assets+'php/inventory/inventory.php',
	                                "type": "POST",
	                                 data: function(d){
	                                 		var defaultBranch = $("#current-invnt-branchlist option:selected").val(); //get the 2nd option value as default branch value.
	                                 		d.status_type = 'IN';
	                                 	    d.action = "view-all";
	                                        d.branch = (branch == 1 ? defaultBranch : branch); //if branch is 1 = ALL, set default value to 2 = MNL else get cookies branch.
	                                     }
	                            },	   
	                            "columns": [
	                            	{ "data": null},
	                                { "data": null},
	                                { "data": "serialnumber"},
	                                { "data": "brand_name"},
	                                { "data": "model"},
	                                { "data": "cat_name"},
	                                { "data": "type_name" },
	                                { "data": "location" },
	                                { "data": "date_entered" },
	                                { "data": null },
	                                { "data": null, "width": '30px'},
	                                { "data": null, "width": '30px'},
	                                { "data": null, "width": '30px'}
	                            ],
	                            "columnDefs": [
	                            	{
	                                    "targets": 0,
	                                     'render': function (data, type, full, meta){
									             return '<input class="chk-sn" type="checkbox" name="id[]" value="' 
									                + $('<div/>').text(data.id).html() + '">';
									      }
	                                },
	                                {
	                                    "targets": 1,
	                                    "render": function ( data, type, row, meta ) {
	                                       return meta.row + 1;
	                                    }
	                                },
	                                {
	                                    "targets": 9,
	                                    "render": function ( data, type, row, meta ) {
	                                    	var cond = (data.acronym_name == "BNC" ? data.acronym_name_def : data.acronym_name );
	                                		return cond;
	                                    }
	                                },
	                                {
	                                    "targets": 10,
	                                    "render": function ( data, type, row, meta ) {
	                                       return '<a href="#" title="EDIT MACHINE" data-toggle="modal" data-target="#modalFormCurrentInvnt" class="btn btn-success btn-flat btn-xs btn-edit-inventory" data-id-invnt="'+data.id+'">EDIT</a>';
	                                    }
	                                },
	                                {
	                                    "targets": 11,
	                                    "render": function ( data, type, row, meta ) {
	                                       return '<a href="#" title="OUT MACHINE" data-toggle="modal" data-target="#modalFormOutMachine" class="btn btn-warning btn-flat btn-xs btn-out-inventory" data-id-invnt="'+data.id+'">OUT</a>';;
	                                    }
	                                },
	                                {
	                                	"targets": 12,
	                                	"render": function(data){
  											return '<a title="STATUS LOGS" class="btn btn-xs btn-default-logs btn-flat viewInvntStatusLogs" data-id-invnt="'+data.id+'"><i class="fa fa-clock-o"></i></a>';
	                                	}
	                                }
	                            ],
	                            "preDrawCallback": function(settings){
		                           $(".btn-search-inventory, .btn-excel-inventory, .btn-print-inventory, .btn-add-inventory").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
		                           $(".btn-print-inventory").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
		                           $(".btn-excel-inventory").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
				                },
	                             "fnDrawCallback": function(){
	                            	$(".btn-add-inventory").attr('data-toggle','modal');
									$(".btn-add-inventory").attr('data-target','#modalFormCurrentInvnt');
									
		                            var action = JSON.parse(Cookies.get('app_module_action'));
			                            if(action == null){
			                                $(".btn-add-inventory, .btn-edit-inventory, .viewInvntStatusLogs, .btn-out-inventory, .btn-in-inventory, .btn-bulk").remove();
			                            }
			                            else{
			                                if(action.action_invnt == "r")
			                                    $(".btn-add-inventory, .btn-edit-inventory, .viewInvntStatusLogs, .btn-out-inventory, .btn-in-inventory, .btn-bulk").remove();
			                            }
			                            
	                            }
	                    });
							
							//Handle Select All.
							$("#select_all").on('click',function(){
								var rows = dtCurrentInventory.dtInstance.rows({ 'search': 'applied' }).nodes();
      							var isChecked = $('input[type="checkbox"]', rows).prop('checked', this.checked);
      											if($(this).is(':checked')) //Add background color for select all.
      												$(isChecked).parent('td').addClass('chkboxes-background');
      											else
      												$(isChecked).parent('td').removeClass('chkboxes-background');
							});

							//Handle Bulk Options.
							$("div.dt-buttons").prepend('<div class="dropdown btn-bulk" style="display:inline; margin-right:0.5em; vertical-align:bottom"><button style="vertical-align:top;" class="btn btn-primary btn-flat btn-sm dropdown-toggle" type="button" data-toggle="dropdown">Bulk Action ' +
							    '<span class="caret"></span></button>'+
								   '<ul class="dropdown-menu bulk-action">'+
								      '<li><a href="#" class="bulk-action-out">OUT MACHINE</a></li>'+
								    '</ul></div>');

							dtCurrentInventory.dtInstance.on('click','input[type="checkbox"]',function(e){ //Add background color for single checkbox
						         var _self = $(this);
						         	 _self.closest('td').toggleClass('chkboxes-background');

						    });

							 // this.dtInstance.button( '.btn-add-inventory' )
							 //    .nodes()
							 //    .attr('data-toggle','modal')
							 //    .attr('data-target','#modalFormCurrentInvnt');
	        return this;               
    },
    selectBranch: function(app_invnt,branch){
			if(app_invnt == 1 && branch == 1){ //Display only if app_module is inventory and branch  is 1 = "ALL".
				$("div.current-invnt-branches").html('<label>Branch: <select id="current-invnt-branchlist" style="padding:2px 4px"></select></label> '); // DOM Dropdown Branch. 
					autoDrpDownInvnt.getBranch("#current-invnt-branchlist",null,[1],2);

				$("select#current-invnt-branchlist").change(function(){
				   	dtCurrentInventory.dtInstance.ajax.reload();
				});
	    	}
    	return this;
    },
    modalShow: function(){
    	$("#displayFormInvntEntry").load(pages+'inventory/current/form.html',function(){
			self.dtCurrentInventory.addMultipleInput();//Add multiple input serialnumber.

			autoDrpDownInvnt.getType("#slctCurInvntType")//Entry dropdown 
				.getCondition("#slctCurInvntBnRf")
				.getBranch("#slctCurInvntBranch",null,[1]) // Check error occurred, showing ALL option if switching to a page Account.
				.getModelByBrand("#slctCurInvntModel",true);

			autoDrpDown.getAllCompany('#slctCurInvntCompany',"100%")
						.getBrandName('#slctCurInvntBrands')
						.getCategory('#slctCurInvntCategory');

			self.dtCurrentInventory.showModelByBrand()
									   .autoFillCatType();

			 $(this).find('#modalFormCurrentInvnt').on('hidden.bs.modal', function() { //Reset form when modal hidden
			      $(this).find("#frmCurrentInvnt").trigger('reset');
			      $(this).find("#frmCurrentInvnt input:hidden").val('');
			      $(this).find("#slctCurInvntModel").prop('disabled',true).val(0).trigger('chosen:updated');
			      $(this).find("input, select").parents('.col-sm-6').removeClass('has-error has-success');
			      $(this).find("input, select ").next('em').hide();
			      $('.delete-sn',$(".container-multiple-sn")).trigger('click'); //When modal hidden delete automatically multiple S/N input fields.
			  });
    	});
    	return this;
    },
    add: function(){
    	 var $btn     = $("button[type='submit']");
		 var serialnum = $('input[name="txtCurInvntSerial"]').map(function(){ if($(this).val() != ''){ return $(this).val() }; }).get().join(',');
		 var brand 	   = $("#slctCurInvntBrands option:selected").val();
		 var model     = $("#slctCurInvntModel").chosen().val();
		 var type      = $("#slctCurInvntType option:selected").val();
		 var bnrf      = $("#slctCurInvntBnRf option:selected").val();
		 var loc  	   = $("#txtCurInvntLocation").val();
		 var branch    = $("#slctCurInvntBranch option:selected").val();
		 var category  = $("#slctCurInvntCategory option:selected").val();
		 var data = {action:'add', serialnum: serialnum, brand: brand, model: model, type: type, bnrf: bnrf, location: loc, branch: branch, category: category };
		 	$.ajax({
                type: 'POST',
                url: assets+'php/inventory/inventory.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); }, //Empty the search fields. 
                success: function(data, xhr, status){
                	 if(data.aaData == "success"){
                	 	self.dtCurrentInventory.dtInstance.ajax.reload(null, false); //.page('last'); // Reload the data in DataTable and go to last page.
                    	promptMSG('success-add','Machine',null,null,true,true);
                	 }else{
                	 	promptMSG('warning',data.aaData,null,null,false,null);	
                	 }
                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(data,xhr){
                	if(data.responseJSON.aaData == "success"){
                 		// resetForm("#frmCurrentInvnt"); 
                 		$("#frmCurrentInvnt select").not('select#slctCurInvntBranch').val(null); 
                 		$("#frmCurrentInvnt input[type='text']").val(''); 
                 		$("#slctCurInvntModel").val(0).trigger('chosen:updated');
                 	}
                 	$btn.button('reset'); 
                }

            });
		return this;
    },
    update: function(id){
    	 var $btn     = $("button[type='submit']");
		 var serialnum = $(".txtCurInvntSerial").val();
		 var brand 	   = $("#slctCurInvntBrands option:selected").val();
		 var model     = $("#slctCurInvntModel").chosen().val();
		 var type      = $("#slctCurInvntType option:selected").val();
		 var bnrf      = $("#slctCurInvntBnRf option:selected").val();
		 var loc  	   = $("#txtCurInvntLocation").val();
		 var branch    = $("#slctCurInvntBranch option:selected").val();
		 var category  = $("#slctCurInvntCategory option:selected").val();
		 var data = {action:'update', id_machine:id, serialnum: serialnum, brand: brand, model: model, type: type, bnrf: bnrf, location: loc, branch: branch, category: category };
   	 			if (id != ''){
			 		$.ajax({
		                type: 'POST',
		                url: assets+'php/inventory/inventory.php',
		                data: data,
		                dataType: 'json',
		                beforeSend: function(){ $btn.button('loading'); },
		                success: function(data, xhr, status){
		                   self.dtCurrentInventory.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
		                   promptMSG('success-update','Machine',null,null,true,true);
	                	},
	                	error: function(xhr,status){ alert(xhr + status); },
	                 	complete: function(){ $btn.button('reset'); }
	            });
			}
			else { alert('ID is empty'); }
   	 	return this;
    },
    getData: function(id){
    	 	if (id != ''){
    	 		 var $btn = $("button[type='submit']");

			 	$.ajax({
	                type: 'POST',
	                url: assets+'php/inventory/inventory.php',
	                data: {action: 'view-id', id_machine:id},
	                dataType: 'json',
	                beforeSend: function(){ $btn.button('loading'); },
	                success: function(data, xhr, status){
	                	$.each(data.aaData, function(i,val){
	                		 $("#hdnCurInvntId").val(val.id);
	                		 $(".txtCurInvntSerial").val(val.serialnumber);
	                		 $("#hdnOldCurInvntSerial").val(val.serialnumber);
							 $("#slctCurInvntBrands").val(val.id_brand).trigger('change');
							 $("#slctCurInvntModel").val(val.model).trigger('chosen:updated');
							 $("#slctCurInvntCategory").val(val.id_category);
							 $("#slctCurInvntType").val(val.id_type);
							 $("#slctCurInvntBnRf").val(val.id_condition);
						 	 $("#txtCurInvntLocation").val(val.location);
							 $("#slctCurInvntBranch").val(val.id_branch);
							 $("#txtCurInvntDateEntered").text(val.date_entered);
	                	});
	                },
	                error: function(xhr,status){ alert(xhr + status); },
	                complete: function(){ 
	                		$btn.button('reset');  
	                		$("#slctCurInvntModel").prop('disabled',false).trigger('chosen:updated'); //Remove disabled model if EDIT action. 
	            		}
	            });
			}
			else { alert('ID is empty'); }
		return this;
    },
    modalShowOutMachine: function(){
        $("#displayFormInvntInOutMachine").load(pages+'inventory/current/form-out.html',function(status){
                autoDrpDownInvnt.getStatus("#slctCurInvntStatus","OUT")
                				.getBranch("#slctCurInvntOutBranch",null,[1]);//Entry out dropdown
                autoDrpDown.getAllCompany("#slctCurInvntCompany","100%")
                		   .getBranchNameOne("#slctCurInvntLocation","100%",[1]);

                 self.dtCurrentInventory.showLocationByComp();
                 $("#txtCurInvntDateOut").inputmask();//Datemask2 mm/dd/yyyy
        });
        return this;
    },
    outMachine: function(idmachine){
            var $btn     = $("button[type='submit']");
            var id       = $("#hdnInvntOutId").val();
            var status   = $("#slctCurInvntStatus option:selected").val();           
            var company  = $("#slctCurInvntCompany").chosen().val();
            var date 	 = $("#txtCurInvntDateOut").val();
            var remarks  = $("#txtCurInvntRemarks").val();
            var client_loc  = $("#slctCurInvntLocation").chosen().val();
            var id_user   	= Cookies.get('user_id');
            var branch   	= $("#slctCurInvntOutBranch option:selected").val();
            var data = { action:'update_out', id_machine:id, status:status, company: company, date: date, remarks: remarks, client_location: client_loc, id_user:id_user, branch:branch} 

            $.ajax({
                type: 'POST',
                url: assets+'php/inventory/inventory.php',
                data: data,
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data, xhr, status){
                    self.dtCurrentInventory.dtInstance.ajax.reload(function(){
                        promptMSG('remove','Machine',null,null,false);
                        $('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
                            $('#modalFormOutMachine').modal('hide');
                       });
                    }, true); // Reload the data in DataTable and go to last page.

                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ $btn.button('reset'); }
            }); 
    },
    showLocationByComp: function(){
    	     //Dynamically show the location base of client name selected along with the location itself.
			  $("#slctCurInvntCompany").change(function(){
			   		var select_comp = $(this).chosen().val() || null;
			   		if(select_comp != null){
			   			$.ajax({
			   				type: 'GET',
			   				dataType: 'json',
			   				url: assets+'php/misc/inventory_misc.php',
			   				data: { action: 'client_location_by_company', id_company: select_comp },
			   				beforeSend: function(){ 
			   					$("#slctCurInvntLocation").val(0).trigger('chosen:updated'); //Disabled and reset the value.
			   					$("#slctCurInvntLocation option").hide().trigger('chosen:updated'); 
			   				},
			   				success: function(data){
			   					if(data.aaData[0]){
			   					var arr_comp = convertArrStrToInt(data.aaData[0].id_branches);
			   					var i = 0;
			   						for (i = 0; i < arr_comp.length; i++) {
			   							$("#slctCurInvntLocation").prop('disabled',false).trigger('chosen:updated');
			   							$("#slctCurInvntLocation option[value='"+arr_comp[i]+"']").show().trigger('chosen:updated');
			   						}
			   					}
			   				},
			   				error: function(xhr,status){ alert(xhr + status); }
			   			});        		   			
			   		}else{
			   			$("#slctCurInvntLocation").prop('disabled',true).val(0).trigger('chosen:updated');
			   		}
			   });
    },
    showModelByBrand: function(){
    	     //Dynamically show the list of model by brand selected.
			  $("#slctCurInvntBrands").change(function(){
			   		var select_brand = $(this).val() || null;
			   		if(select_brand != null){
			   			$.ajax({
			   				type: 'GET',
			   				dataType: 'json',
			   				url: assets+'php/misc/inventory_misc.php',
			   				data: { action: 'model_by_brand', id_brand: select_brand },
			   				beforeSend: function(){ 
			   					$("#slctCurInvntModel").val(0).trigger('chosen:updated'); //Disabled and reset the value.
			   					$("#slctCurInvntModel option").hide().trigger('chosen:updated'); 
			   					$("#slctCurInvntCategory,#slctCurInvntType").val(''); // Clear category and type.
			   				},
			   				success: function(data){
			   					if(data.aaData[0].id_model != null ){
				   					var arr_brand = convertArrStrToInt(data.aaData[0].id_model);
				   					var i = 0;
				   						for (i = 0; i < arr_brand.length; i++) {
				   							$("#slctCurInvntModel").prop('disabled',false).trigger('chosen:updated');
				   							$("#slctCurInvntModel option[value='"+arr_brand[i]+"']").show().trigger('chosen:updated');
				   						}
			   					}
			   				},
			   				error: function(xhr,status){ alert(xhr + status); }
			   			});              		   			
			   		}else{
			   			$("#slctCurInvntModel").prop('disabled',true).val(0).trigger('chosen:updated');
			   		}
			   });
			return this;
    },
    autoFillCatType: function(){
    	     //Automatically fill the dropdown Category and Type base in model selected.
			    $("#slctCurInvntModel").change(function(){
  					var data_val = convertArrStrToInt($(this).find('option:selected').data('cat-type'));
  						if(data_val != null){
  							$("#slctCurInvntCategory").val(data_val[0]); //data_val[0] = Category
  							$("#slctCurInvntType").val(data_val[1]);     //data_val[1] = Type
  						}
  						else {
  							$("#slctCurInvntCategory,#slctCurInvntType").val(''); // Clear category and type.
  						}
				});
		   return this;
    },
    actions: function(pbranch,puser_role){
    	$("#currentInventoryList").on('click','a.btn-edit-inventory, a.btn-add-inventory, a.btn-out-inventory, button.dt-invnt-refresh, a.viewInvntStatusLogs, a.bulk-action-out',function(e) {
    		e.preventDefault();
    		    var inst = $(this);
    		    //Highlight row selected.
      			if ( !inst.closest('tr').hasClass('selected') ) {  
                    self.dtCurrentInventory.dtInstance.$('tr.selected').removeClass('selected');
                    inst.closest('tr').addClass('selected');
                }

                if( pbranch != 1){ // Disable dropdown branch.
					$("#slctCurInvntBranch").prop('disabled',true).val(pbranch);
				}	

                //Actions
	    	   	if ($(inst[0]).hasClass('btn-add-inventory')) { //Add
	    	   		$("#modalFormCurrentInvnt .modal-title").text('Add Machine');
					$("#modalFormCurrentInvnt #txtCurInvntDateEntered").text(getTodayDate());
					$("#add-multiple-sn").show();// Show icon plus for multiple S/N		    	   				    	   	 
	    	   	 }
    	   	 	else if ($(inst[0]).hasClass('btn-edit-inventory')) { //Edit
    	   	 		 var id_machine = $(inst[0]).data('id-invnt') || '';
   	 					self.dtCurrentInventory.getData(id_machine);
	    	   	 		$("#modalFormCurrentInvnt .modal-title").text('Edit Machine');
	    	   	 		$("#add-multiple-sn").hide();  //Hide icon plus in multiple S/N		
   	 	    	   
		   	 	}
		   	 	else if ($(inst[0]).hasClass('btn-out-inventory')) { // Out
    	   	 		var id_machine = $(inst[0]).data('id-invnt') || '';
		 			  $("#modalFormOutMachine .modal-title").text('Out Machine');
		              $("#hdnInvntOutId").val(id_machine);
   	 	    	   
		   	 	}   		   	 	
		   	 	else if ($(inst[0]).hasClass('dt-invnt-refresh')) { // Refresh
		   	 		 $(".dt-searchfield input[type='text']").val('');  //Clear text
    	   	 		 var branch = Cookies.get('branch');
    	   	 		 var app_module = JSON.parse(Cookies.get('app_module'));
   	 					 self.dtCurrentInventory.render(app_module.invnt,branch);   	 	    	   
		   	 	}                  
                else if ($(inst[0]).hasClass('viewInvntStatusLogs')) { //Show modal activity logs.
                        var id_machine = inst.data('id-invnt');
                         	dtInvntLogs.showModal(id_machine)
                }
                else if ($(inst[0]).hasClass('bulk-action-out')){ //Bulk OUT Machine
                	var ids = self.dtCurrentInventory.getMultipleIds() || '';
                	if(ids == ''){
                		promptMSG('custom','Please select IDs # in the checkboxes.',"<i class='fa fa-warning'></i>",null,false,false);
                	}else{
	                	$('#modalFormOutMachine').modal('show');
	                	$("#modalFormOutMachine .modal-title").text('Bulk Out Machine');
	                	$("#hdnInvntOutId").val(ids);
	                }
                }
		   	 	else
		   	 	{ return false; }      	   	 		   	   	 
	    	   		
  
    	});
    	return this;  
    	  
    },
    getMultipleIds: function(){ //Get the multiple row selected IDs # if there is option selected.
    		var rows = dtCurrentInventory.dtInstance.rows({ 'search': 'applied' }).nodes();
		 	var checkedVals = $('input[type="checkbox"]:checked', rows).map(function() {
			    return this.value;
			}).get();

		return checkedVals.join(",");
    },
    addMultipleInput: function(){
    	  //Adds new field of serialnumber.
			  var container = $(".container-multiple-sn");
			  var max_sn = 2;
			  $("#add-multiple-sn a").click(function(e){
			    e.preventDefault();
			    if(max_sn <= 10){
			         $(container).append('<div class="input-group">'+
			            '<input type="text" class="form-control txtCurInvntSerial" name="txtCurInvntSerial" placeholder="S/N '+max_sn+'"/>'+
			            '<span class="input-group-btn">'+
			                '<button class="btn btn-danger btn-xs delete-sn" type="button">x</button>'+
			           '</span></div>').focus();
			         max_sn++;
			       }
			       else{
			           alert('Maximum of ten(10) Serials can input.');
			       }
			   });
			  $(container).on('click','.delete-sn',function(e){
			    e.preventDefault();
			        $(this).closest('div.input-group').remove();
			        max_sn--;
			  });

			  $.extend( $.validator.prototype, { //Hack the core of jQuery validator plugin in this page only.
			      checkForm: function () {
			      this.prepareForm();
			      for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
			        if (this.findByName(elements[i].name).length != undefined && this.findByName(elements[i].name).length > 1) {
			            for (var cnt = 0; cnt < this.findByName(elements[i].name).length; cnt++) {
			            this.check(this.findByName(elements[i].name)[cnt]);
			          }
			        } 
			        else {
			            this.check(elements[i]);
			        }
			      }
			          return this.valid();
			      }
			});
		return this;
	}
};