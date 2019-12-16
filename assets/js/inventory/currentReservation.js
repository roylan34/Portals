//Current
var dtCurrentInvtReservation = {
	dtInstance: null,
	selectedBranch: null,
	pageDetails: function(){
	  			$(".content-header h1").text("Machine Inventory");
	  			$(".content-header h1").append("<small>Current</small>");
	  		return this;
	},
	modalShow: function(id){
	    	$("#displayFormReservation").load(pages+'inventory/current/form-reservation.html',function(){
	    		$("#modalFormCurrentRsrv").modal('show');
				autoDrpDown.getAllCompany('#slctCurRsrvComp',"100%");
				autoDrpDown.getClientName("#slctCurRsrvAcctMngr","100%");
				autoDrpDownInvnt.getBranch("#slctRsrvBranch",null,[1])
				self.dtCurrentInvtReservation.addMultipleInput();

				var branch = jwt.get('branch');
				if( branch != 1){ // Disable dropdown branch.s
					$("#slctRsrvBranch").prop('disabled',true).val(branch);
				}

				if(id){
    	   	 		 $(this).find("#modalFormCurrentRsrv .modal-title").text('Edit Reservation');
    	   	 		 $(this).find("#add-multiple-sn").remove();
    	   	 		self.dtCurrentInvtReservation.getData(id);
				}else{
					$(this).find("#modalFormCurrentRsrv .modal-title").text('Add Reservation');
                    $(this).find("#modalFormCurrentRsrv #txtCurRsrvDateEntered").text(getTodayDate());
				}

	    	});
	    	return this;
	},
    render: function(){
      				// document.title = "Inventory"; // Change the title tag.
	                this.dtInstance = $('#dtCurrentInvtReservation').DataTable({
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
			                                    exportOptions: { columns: [1,2,3,4,5,6] },
			                                    filename: 'Inventory Reservation ' + getTodayDate()
			                                },
			                               {
			                                    extend: "print",
			                                    exportOptions: { columns: [0,1,2,3,4,5,6] },
			                                    // autoPrint: false,
			                                    className: 'btn-print-inventory hidden-xs',
			                                    customize: function(win){
			                                        var elem = $(win.document.body);
                                            		elem.find('h1').remove();
                                                	elem.prepend("<h4>Inventory Reservation</h4>"); 

			                                    }
                                			},
                                			{
			                                    text: 'Add New Reservation',
			                                    className: 'btn-add-reserve',
			                                    action: function ( e, dt, node, config ) {
			                                    	self.dtCurrentInvtReservation.modalShow();
			                                    }
			                                },
			                                {
			                                    text: 'Open Search Filter',
			                                    className: 'btn-search-inventory',
			                                    action: function ( e, dt, node, config ) {
		                                            $(".dthead-search-reserve").slideToggle('fast',function(){
		                                                if($(this).is(':visible')){
		                                                    node[0].innerText = 'Close Search Filter';
		                                                }else{
		                                                   node[0].innerText = 'Open Search Filter';
		                                                    $(".dthead-search-reserve input[type='text']").val('');  //		                                                  
		                                                    dtCurrentInvtReservation.dtInstance.ajax.reload(null, true);
		                                                }
		                                            });
			                                    }
			                                }
	                            ],
	                            "ajax": {
	                                "url": assets+'php/inventory/getReservation.php',
	                                "type": "POST",
	                                "dataSrc": "records",
	                                 data: function(d){
	                                 		delete d.columns;	                                		
	                                 		d.serial_no 	= $(".dthead-search-reserve tr:visible .search-reserve-serial").val();
	                                 		d.acct_mngr 	= $(".dthead-search-reserve tr:visible .search-reserve-acct").val();   
	                                 		d.comp 			= $(".dthead-search-reserve tr:visible .search-reserve-comp").val();   
	                                 		d.date_reserved	= $(".dthead-search-reserve tr:visible .search-reserve-date").val();   
	                                 		d.branch		= $(".dthead-search-reserve tr:visible .search-reserve-branch").val();   
	                                 		d.action_view 	= 'current';                       	  
	                                     }
	                            },	   
	                            "columns": [
	                            	{ "data": null, "width": "20px", "render": function ( data, type, row, meta ) {
	                                       return meta.row + 1;
	                                    }
	                                },
	                                { "data": "serial_number"},
	                                { "data": "acct_mngr"},
	                                { "data": "company_name"},
	                                { "data": "date_reserved"},
	                                { "data": null, render: function(data){
	                                		var aging = (intVal(data.aging) < 0 ? 0 : intVal(data.aging));
	                                		var badge_color = '';
	                                			if(aging > 30){
	                                				badge_color += 'red badge-pulse';
	                                			}
	                                			else if(aging == 0){
	                                				badge_color += 'green';
	                                			}
	                                			else if(aging <= 30){
	                                				badge_color += 'orange';
	                                			}
	                                		return "<span class='badge badge-"+badge_color+"'>" + aging + "</span>";
		                                }
		                            },
		                            { "data": "created_at"},
		                            { "data": "branch_name"},
	                            	{ "data":  null, render: function( data, type, full, meta ){
		                                var action_elem = '';
		                                var user_branch = jwt.get('branch');
		                                	if(data.id_branch == user_branch || user_branch == 1 ){ //Have access to all branches.
		                                        action_elem += '<div class="dropdown text-center btn-action-reserve">';
		                                        action_elem += '<button class="btn btn-success dropdown-toggle btn-sm" type="button" data-toggle="dropdown">Actions'
		                                                        +' <span class="caret"></span></button>'
		                                                          +'<ul class="dropdown-menu dropdown-menu-right dropdown-menu-machine">'
		                                                          	+ '<li><a href="#" class="btnEdit" data-id='+data.id+' title="Edit" data-aging="'+data.aging+'"><i class="fa fa-pencil-square" aria-hidden="true"></i>EDIT</a></li>'
		                                                            + '<li><a href="#" class="btnRemove" data-id='+data.id+' data-status="remove" title="Remove Reservation" data-aging="'+data.aging+'"><i class="fa fa-trash" aria-hidden="true"></i>REMOVE</a></li>'
		                                                            + '<li><a href="#" class="btnClose" data-id='+data.id+' data-status="close" title="Close Reservation" data-aging="'+data.aging+'"><i class="fa fa-window-close" aria-hidden="true"></i>CLOSE</a></li>'
		                                                    	  +'</ul></div>';
		                                    }		                                                       
		                                    return action_elem;
		                                }
		                            },
	                            ],
	                            "preDrawCallback": function(settings){
		                           	$(".btn-excel-inventory, .btn-print-inventory, .btn-search-inventory, .btn-add-reserve").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
		                           	$(".btn-print-inventory").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
		                           	$(".btn-excel-inventory").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title','Export to Excel');
				                },
				                "fnDrawCallback": function () {
									var api = this.api();

									var action = jwt.get('app_module_action');
									if (action == null) {
										$('.btn-action-reserve, .btn-add-reserve').remove();
									}
									else {
										if (action.action_invnt == "r")
											$('.btn-action-reserve, .btn-add-reserve').remove();
									}


								}
	                    });
	        return this;               
    },
    getData: function(id){
	 	if(id != ''){
	 		var $btn = $("button[type='submit']");
		 	$.ajax({
                type: 'POST',
                url: assets+'php/inventory/reservation.php',
                data: {action: 'view-id', id_reserve:id},
                dataType: 'json',
                beforeSend: function(){ $btn.button('loading'); },
                success: function(data, xhr, status){
                	$.each(data.aaData, function(i,val){
                		 $("#hdnCurRsrvId").val(val.id);
                		 $("#txtCurRsrvSerial").val(val.serial_number);
                		 $("#hdnCurRsrvOldSn").val(val.serial_number);
                		 $("#txtCurRsrvDateReserve").val(val.date_reserved);
						 $("#slctCurRsrvAcctMngr").val(val.id_acc_mngr).trigger('chosen:updated');
						 $("#slctCurRsrvComp").val(val.id_company).trigger('chosen:updated');
						 $("#txtCurRsrvDateEntered").text(val.created_at);
						 $("#slctRsrvBranch").val(val.branch);
                	});
                },
                error: function(xhr,status){ alert(xhr + status); },
                complete: function(){ 
                		$btn.button('reset');  
                		$("#slctCurInvntModel").prop('disabled',false).trigger('chosen:updated'); //Remove disabled model if EDIT action. 
            	}
            });
		}
		else 
		{ 
			alert('ID is empty');
		}
		return this;
    },
    add: function(){
		 var $btn     = $("button[type='submit']");
		 var serialnum     	= $('input[name="txtCurRsrvSerial"]').map(function(){ if($(this).val() != ''){ return $(this).val().toString() }; }).get().join(',')
		 var acct_mgnr 		= $("#slctCurRsrvAcctMngr").chosen().val();
		 var comp			= $("#slctCurRsrvComp").chosen().val();
		 var date_reserved 	= $("#txtCurRsrvDateReserve").val();
		 var create_by		= jwt.get('user_id');
		 var branch         = $("#slctRsrvBranch option:selected").val();
		 var data = {action:'add', serialnum: serialnum, acct_mgnr: acct_mgnr, comp: comp, date_reserved: date_reserved, create_by:create_by, branch:branch };
		 	$.ajax({
	            type: 'POST',
	            url: assets+'php/inventory/reservation.php',
	            data: data,
	            dataType: 'json',
	            beforeSend: function(){ $btn.button('loading'); }, //Empty the search fields. 
	            success: function(data, xhr, status){
	            	 if(data.aaData == "success"){
	            	 	self.dtCurrentInvtReservation.dtInstance.ajax.reload(null, false); //.page('last'); // Reload the data in DataTable and go to last page.
	                	promptMSG('success-add','Reservation',null,null,true,true);
	            	 }else{
	            	 	promptMSG('warning',data.aaData,null,null,false,null);	
	            	 }
	            },
	            error: function(xhr, status){ alert(xhr + status); },
	            complete: function(data, xhr){
	            	if(data.responseJSON.aaData == "success"){
	             		$("#frmCurrentRsrv input[type='text']").val(''); 
	             		$("#slctCurRsrvAcctMngr, #slctCurRsrvComp").val(0).trigger('chosen:updated');
	             	}
	             	$btn.button('reset'); 
	            }

	        });
		return this;
    },
    update: function(id){
    	 var $btn     = $("button[type='submit']");
		 var id_reserve    	= $("#hdnCurRsrvId").val();
		 var serialnum     	= $("#txtCurRsrvSerial").val();
		 var serialnum_old  = $("#hdnCurRsrvOldSn").val();
		 var acct_mgnr 		= $("#slctCurRsrvAcctMngr").chosen().val();
		 var comp			= $("#slctCurRsrvComp").chosen().val();
		 var date_reserved 	= $("#txtCurRsrvDateReserve").val();
		 var create_by		= jwt.get('user_id');
		 var branch         = $("#slctRsrvBranch option:selected").val();
		 var data = {action:'update', id_reserve:id_reserve, serialnum: serialnum, acct_mgnr: acct_mgnr, comp: comp, date_reserved: date_reserved, create_by:create_by, sn_old: serialnum_old, branch:branch };
   	 			if (id != ''){
			 		$.ajax({
		                type: 'POST',
		                url: assets+'php/inventory/reservation.php',
		                data: data,
		                dataType: 'json',
		                beforeSend: function(){ $btn.button('loading'); },
		                success: function(data, xhr, status){
		                    if(data.aaData == "success"){
			            	 	self.dtCurrentInvtReservation.dtInstance.ajax.reload(null, false); //.page('last'); // Reload the data in DataTable and go to last page.
			                	promptMSG('success-update','Reservation',null,null,true,true);
			            	}else{
			            	 	promptMSG('warning',data.aaData,null,null,false,null);	
			            	}
	                	},
	                	error: function(xhr,status){ alert(xhr + status); },
	                 	complete: function(){ $btn.button('reset'); }
	            });
			}
			else { alert('ID is empty'); }
   	 	return this;
    },
    updateStatus: function(id, status){
    	 var $btn     = $("button[type='submit']");
		 var data = { action:'update_status', id_reserve:id, status: status};
   	 			if (id != ''){
					promptMSG("custom", "Are you sure you want to <strong>" + status + " reservation</strong>?", "Confirmation", "yn", false, false, function () {
						$.ajax({
			                type: 'POST',
			                url: assets+'php/inventory/reservation.php',
			                data: data,
			                dataType: 'json',
			                success: function(data){
			                   	self.dtCurrentInvtReservation.dtInstance.ajax.reload(function(){
		                        	promptMSG('remove','Reservation',null,false, true);
		                        	$('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
		                           	 	$('.modal').modal('hide');
		                            	$('.modal-backdrop').remove();
		                       		});
			                    }, true); // Reload the data in DataTable and go to last page.
		                	},
		                	error: function(xhr,status){ alert(xhr + status); },
		                 	complete: function(){ $btn.button('reset'); }
		            	});

					});
			}
			else { alert('ID is empty'); }
   	 	return this;
    },
    addMultipleInput: function(){
    	  	//Adds new field of serialnumber.
			var container = $(".container-multiple-sn");
			var max_sn = 2;
			  $("#add-multiple-sn a").click(function(e){
			    e.preventDefault();
			    if(max_sn <= 10){
			         $(container).append('<div class="input-group">'+
			            '<input type="text" class="form-control txtCurRsrvSerial" name="txtCurRsrvSerial" placeholder="S/N '+max_sn+'"/>'+
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
			        $(this).closest('div.input-group').fadeOut(function(){
			        	$(this).remove();
			        });
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
	},
	checkAging: function(aging, id, defaultAction){
		if(aging > 30){
			var confr = confirm('This reservation is exceeded in 30 days aging. \n Please click the OK to update the Date needed if reservation is still valid?');
			if(confr){
				self.dtCurrentInvtReservation.modalShow(id);
			}
			else{
				defaultAction();
			}
		}
		else{
			defaultAction();
		}
		return this;
	},
    actions: function(){
    	$("#dtCurrentInvtReservation").on('click','button, a',function(e) {
    		e.preventDefault();
    		    var inst = $(this);
    		    var button_label = inst.text().toLowerCase();

		        //Highlight row selected.
                if(!inst.closest('tr').hasClass('selected') ) {  
                    self.dtCurrentInvtReservation.dtInstance.$('tr.selected').removeClass('selected');
                    inst.closest('tr').addClass('selected');
                }
                //Search button
                if(button_label == "search"){
                    self.dtCurrentInvtReservation.dtInstance.ajax.reload(null, true);
                }
                //Reset button
                else if(button_label =="reset"){
	                $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //Clear all values;
	                self.dtCurrentInvtReservation.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                }
                else if ($(inst[0]).hasClass('btnEdit')) { //Edit
    	   	 		var id = $(inst[0]).data('id') || '';
    	   	 		var aging = $(inst[0]).data('aging') || '';
    	   	 		   	self.dtCurrentInvtReservation.checkAging( aging, id, function(){ 
    	   	 		   		self.dtCurrentInvtReservation.modalShow(id) 
    	   	 		   	});
		   	 	}
		   	 	else if ($(inst[0]).hasClass('btnRemove')) { //Remove
    	   	 		var id 		= $(inst[0]).data('id') || '';
    	   	 		var status 	= $(inst[0]).data('status') || '';
    	   	 		var aging 	= $(inst[0]).data('aging') || '';
    	   	 		 	self.dtCurrentInvtReservation.checkAging(aging, id, function(){
    	   	 		 		self.dtCurrentInvtReservation.updateStatus(id, status);
    	   	 		 	});
		   	 	}
		   	 	else if ($(inst[0]).hasClass('btnClose')) { //Close
    	   	 		var id 		= $(inst[0]).data('id') || '';
    	   	 		var status 	= $(inst[0]).data('status') || '';
    	   	 		var aging 	= $(inst[0]).data('aging') || '';
    	   	 			self.dtCurrentInvtReservation.checkAging(aging, id, function(){
	    	   	 		 	self.dtCurrentInvtReservation.updateStatus(id, status);
	    	   	 		 });
		   	 	}
            });
    	return this;    	 
    },

};