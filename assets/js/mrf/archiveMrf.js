//Archive
var dtArchiveMrf = {
	  dtInstance: null,
	  pageDetails: function(){
	  			$(".content-header h1").text("MRF");
	  			$(".content-header h1").append("<small>Archive</small>");
	  		return this;
	  },
      render: function(app_mrf,user_role){
      				// document.title = "MRF"; // Change the title tag.
	                this.dtInstance = $('#dtArchiveMrf').DataTable({
	                            "dom" : "Blrtip",
	                            "ordering": false,
	                            "autoWidth" : false,
	                            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
	                            //"pageLength": 25,
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
			                                    text: '<i class="fa fa-refresh" aria-hidden="true"></i>',
			                                    tag: 'a',
			                                    className: 'btn-refresh-mrf',
			                                    action: function ( e, dt, node, config ) {
			                                         self.dtArchiveMrf.dtInstance.ajax.reload(null, true);
			                                    }
			                                },
			                                {
			                                    text: 'Open Search Filter',
			                                    className: 'btn-search-archivemrf',
			                                    action: function ( e, dt, node, config ) {
		                                            $("#dthead-search-archivemrf").slideToggle('fast',function(){
		                                                if($(this).is(':visible')){
		                                                    node[0].innerText = 'Close Search Filter';
		                                                }else{
		                                                   node[0].innerText = 'Open Search Filter';
		                                                    $("#dt-head-search input[type='text']").val('');  //Clear all values.
		                                                    self.dtArchiveMrf.dtInstance.ajax.reload(null, true);
		                                                }
		                                            });
			                                    }
			                                }
	                            	],
	                             "ajax": {
	                                "url": assets+'php/mrf/getMachineRequestList.php',
	                                "type": "GET",
	                                "dataSrc": "records",
	                                 data: function(d){
	                                 		d.form_no 	  = $("#search-mrf-formno").val() || '';
	                                 		d.company 	  = $("#search-mrf-company").val() || '';
	                                 		d.date_requested = $("#search-mrf-dateRequest").val() || '';
	                                 		d.date_delivery = $("#search-mrf-dateDelivery").val() || '';
	                                 		d.status = $("#search-mrf-status option:selected").val() || '';
	                                 		d.date_status = $("#search-mrf-date").val() || '';

	                                 	    d.action_view = "archive";
	                                 	    d.id_user = Cookies.get('user_id');	  
	                                 	    d.id_branch = $("#archive-mrf-branchlist option:selected").val();              
	                                     }
	                            },	
			                    "columns"  : [
		                            { data: null, render: function (data, type, row, meta) {
		                                    return meta.row + 1; //DataTable autoId for sorting.
		                                }       
		                            },
		                            { data: null, render: function( data, type, full, meta ){
		                                return "<input class='hidden-form-no' type='hidden' name='form_no[]' value='" + data.id + "'><span class='text-center'>" + data.form_no + "</span>";
		                                }
		                            },
		                            { data:  null, render: function( data, type, full, meta ){
		                                return "<span class='text-center'>" + data.company_name + "</span>"; 
		                                }
		                            },
		                            { data:  null, render: function( data, type, full, meta ){
		                                return "<span class='text-center'>" + data.date_requested + "</span>"; 
		                                }
		                            },
		                            { data:  null ,render: function( data, type, full, meta ){
		                                return "<span class='text-center'>" + data.delivery_date + "</span>"; 
		                                }
		                            },
		                            { data:  null ,render: function( data, type, full, meta ){
		                                return "<span class='text-center'>" + data.requested_by + "</span>"; 
		                                }
		                            },
		                            { data:  null ,render: function( data, type, full, meta ){
		                                return "<span class='text-center'>" + data.branch_name + "</span>"; 
		                                }
		                            },		                            
		                            { data:  null, render: function( data, type, full, meta ){
		                               	var badge_color = '';
                                        var status = data.status.toUpperCase() || '';
	                                        if(status == 'COMPLETE'){
	                                            badge_color = 'badge-blue';
	                                            status = 'APPROVED';
	                                        }
	                                        else if(status == 'DISAPPROVED'){
	                                            badge_color = "badge-red";
	                                        }
	                                        else if(status == 'CANCELLED'){
	                                            badge_color = 'badge-orange';	                                            
	                                        }
	                                        else
	                                        { badge_color; }

                                        	return "<span class='badge "+badge_color+"'>" + status + "</span>";
		                                }
		                            },
		                            { data:  null ,render: function( data, type, full, meta ){
		                                	return '<a title="View Request" class="btn btn-info btn-xs btn-flat btn-view-mrf" data-mrf="'+data.id+'"" data-toggle="modal" data-target="#modalFormArchiveViewMrf">VIEW</a>'; 
		                                }
		                            },	
								 	/*{ data:  null ,render: function( data, type, full, meta ){
	                           		   	var EXEC_ID = [1,43]; //Executuve user id
	                               	   	var idUserFrom = (data.id_user_from != null ? convertArrStrToInt(data.id_user_from) : null);
	                               	   	var buttonColor = "";
	                               	
		                                 	if(data.no_received_message > 0 && idUserFrom != null && (idUserFrom.indexOf(EXEC_ID[0]) >= 0  || idUserFrom.indexOf(EXEC_ID[1]) >=0 ) ){ //indexOf, return -1 if not found else return index value.
		                               	    	buttonColor = 'btn-danger';

		                               	    }else if(data.no_received_message > 0 && idUserFrom != null && (idUserFrom.indexOf(EXEC_ID[0]) == -1 || idUserFrom.indexOf(EXEC_ID[1]) == -1 ) ){
		                               	    	buttonColor = 'btn-warning';
		                               	    }
		                               	    else{
		                               	    	buttonColor = 'btn-info';
		                               	    }

		                               	    return '<button title="Comments" class="btn '+buttonColor+' btn-xs btn-flat btn-comment-mrf" data-mrf="'+data.id+'"" data-toggle="modal" data-target="#modalArchiveComments">COMMENTS</button>'; 
		                                }
		                            }*/
				                 ],
				                 "columnDefs": [
				                        { responsivePriority: 1, target: 0},
				                        { responsivePriority: 2, target: 1}
				                 ],
				                 "preDrawCallback": function(settings){
		                           		$(".btn-search-archivemrf, .btn-refresh-mrf").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
				                },
				                "fnDrawCallback": function(){
					                 this.api().button('.btn-refresh-mrf' )
									  .nodes()
									  .attr('title','Refresh');	
						        }
	                    });	
		
							// Export Excel.
							 $("div.dt-buttons").prepend('<div class="dropdown" style="display:inline; margin-right:0.5em; vertical-align:bottom"><button style="vertical-align:top;" class="btn btn-primary btn-flat btn-sm dropdown-toggle" type="button" data-toggle="dropdown">Export Excel ' +
							    '<span class="caret"></span></button>'+
								   '<ul class="dropdown-menu dropdown-menu-left custom-export-excel">'+
								      '<li><a href="#" class="export-machine-delivered">Machine Delivered (APPROVED)</a></li>'+
								    '</ul></div>');					
	        return this;               
    },
    modalShow: function(){
    	//Modal View machine request form.
	    $("#displayViewStepDetails").load(pages+'mrf/archive/view-request-form.html',function(){
	    		//Hide View Modal
				$(this).find('#modalFormArchiveViewMrf').on('hidden.bs.modal', function() { //Reset form when modal hidden
				      $(this).find("#frmCurrentViewMrf").trigger('reset');
				      $(this).find("#frmCurrentViewMrf input[type='hidden'], #frmViewAttachment input[type='hidden']").val('');
				      $(this).find("#tbl_view_frm_component_1 tbody tr, #tbl_view_frm_component_2 tbody tr").not('.view-loader').remove();
				      $(this).find("#tab-form-approve table tfoot, #tab-form-approve table > tfoot button").hide();
				});
				//Hide Toner modal
				$(this).find('#modalArchiveViewToner').on('hidden.bs.modal', function() { //Reset form when modal hidden
					  $('body').addClass('modal-open');
				      $("#tbl_view_s1_toner tbody tr").remove();
				      //$(".view-step-2 .radioBtn-group-c2").prop('checked',false); IN PROGRESS
				});
	    });
	    return this;
    },
    selectBranch: function(user_mrf_flag,branch){ //Display only branch where to assigned.
    	  	var drpdownBranch = null;
			if(user_mrf_flag == "approver" || user_mrf_flag == "preparer" || user_mrf_flag =="requestor,preparer"){ //Display only if user is approver or preparer.
				 var branch_approver = function(iduser){
				 	var result;
				 		$.ajax({
					 		type: 'POST',
							url: assets+'php/mrf/misc/getBranchApprover.php',
							data: {id_user: iduser },
							async: false,
							success:function(data){
								result = data.aaData[0].id_branch;
								//console.log(result);
							}
					 	});
					 	return (result ? convertArrStrToInt(result.split(",")) : null);
				 }
				 
				drpdownBranch = branch_approver(Cookies.get("user_id"));	
	    	}
	    	else{
	    		drpdownBranch = convertArrStrToInt(Cookies.get("branch_mrf").split(","));
	    	}
			
				autoDrpDownMrf.getBranch("#archive-mrf-branchlist",false,drpdownBranch,null,true,true);
					 
				$("select#archive-mrf-branchlist").change(function(){
				   	dtArchiveMrf.dtInstance.ajax.reload();
				});
    	return this;
    },
    getDataViewRequestForm: function(id){
    	    if (id != '' && id != undefined){
    	 		 var step_one, step_two;
    	 		 var id_user_logged = Cookies.get("user_id");
    	 		 var app_action = JSON.parse(Cookies.get('app_module_action'));
			 	$.ajax({
	                type: 'POST',
	                url: assets+'php/mrf/mrf.php',
	                data: {action: 'view-toner-details', id_mrf:id, id_user: id_user_logged},
	                dataType: 'json',
	                cache: false,
	                // async: false,
	                beforeSend: function(){ 
	                	    step_one =" ";
	                	    step_two =" ";
	                	    $(".view-loader").show();	   	                		
	                },
	                success: function(data, xhr, status){
	              		var view_data = data.aaData[0];

	              		var no_data = "<tr ><td colspan='6'><div class='text-center'><span class='label label-info text-center'>No data available in table.</span></div></td></tr>";

	              		// $(".hdnAttachmentName").val(view_data.attachment);
	              		$(".post-list-attachment").html(fileUpload.postListFiles(view_data.attachment,false)); //Display files.
	              		$("#hdnIdCurrentViewMrf").val(view_data.id); //Hidden main ID
	              		$("#hdnIdBranchCurrentViewMrf").val(view_data.id_branch); //Hidden main ID branch
	              		$(".form-no #form-code").text(view_data.form_no); //form_no
	              		$("#requestedBy span").text(view_data.requested_by);

	              		//Step 1 Form	
	              		var qty = 0;
	              		if(view_data.res_row_data_s1.length > 0 ){
		                	$.each(view_data.res_row_data_s1, function(i,val){
		                		qty = (val.s1_quantity > 0 ? val.s1_quantity : val.s1_serialnum.split(',').length) ;

	                		 	step_one += '<tr data-mrf-s1='+val.id+' class="parentRow">';
	                			step_one += '<td rowspan="3" class="first">'+(i+1)+'</td>'+
	                				'<td>'+ qty +'</td>' + 
	                				'<td>'+val.brand_name+'</td>' + 
	                		        '<td>'+val.model_name+'</td>' + 
	                		        '<td>'+val.bn_rf+'</td>' + 
					         		'<td>'+val.s1_accessories+'</td>';
					         	step_one += '</tr>';

					         	//Render sub Table Serials.
					         	step_one += '<tr class="subRowSerial">';
					         	step_one += self.dtArchiveMrf.buildSubRowSerial( (val.s1_serialnum  ? val.s1_serialnum.split(",") : 0) );
					         	step_one += '</tr>';

					         	//Render sub table Toner.
					         	step_one += "<tr><td colspan='8'><table class='subTableStyle'><thead><tr><th colspan='8'>Toner</th></tr><tr><th>Quantity</th><th>Mono/Colored</th><th>Toner Model</th><th>Unit Price</th><th>Yield</th><th>Total</th><th>Type</th><th>Rate</th></tr></thead><tbody>";
					         	if(view_data.res_row_data_s1_toner[val.id]){
						         	 $.each(view_data.res_row_data_s1_toner[val.id], function(i,val){
							        	step_one += '<tr>';
							        	step_one += '<td>'+val.s1_toner_qty+'</td>' + 
					                		        '<td>'+val.type_name+'</td>' + 
					                		        '<td>'+val.s1_toner_model+'</td>' + 
									         		'<td>'+val.s1_toner_price+'</td>'+
									         		'<td>'+val.s1_toner_yield+'</td>'+
									         		'<td>'+val.s1_toner_total+'</td>'+
									         		'<td>'+val.s1_billing_type+'</td>'+
									         		'<td>'+val.s1_toner_rate+'</td>';					      	
							        	step_one += '</tr>';					                			
			                		});
						         	
					         	}else{
					         	 	step_one += '<tr>';
					         	 	step_one += '<td colspan="8"><div class="text-center"><span class="label label-info">No data available in table.</span></div></td>';
									step_one += '</tr>';	
					         	 }
					         	step_one += "</tbody></table></td></tr>";
		                	});
	                	
		                }else{
		                	step_one += no_data;
		                }
	                	$("#tbl_view_frm_component_1 tbody").append(step_one);

	                	//Step 2 Form 
	                	var view_s2_radio = view_data.s2_radio_id;
	                	var view_radio_others = view_data.s2_radio_others.toLowerCase() || "";

	                	if( (view_s2_radio == 3 && view_data.s2_radio_nodays > 0) || (view_s2_radio == 4 && view_radio_others == "service unit") ){ //Show only Recall button if Demo or Others with service unit.
	                		if(Cookies.get('user_id') == view_data.id_user_requestor)
	                			$(".recall_demo").show();
	                		else
	                			$(".recall_demo").hide();
	                	}
	                	else{
	                		$(".recall_demo").hide();
	                	}


                		if(view_s2_radio > 0){ //Get only the first value of s2_radio_id.
	                		$(".view-step-2 input[type=radio][value='"+view_s2_radio+"'").prop('checked',true);
	                		if(view_data.s2_radio_nodays > 0 && view_s2_radio == 3){
	                			$("#no_of_days").text(view_data.s2_radio_nodays).show();	
	                		}else{
		                		$("#no_of_days").hide();
		                	}

		                	if(view_data.s2_radio_others != '' && view_s2_radio == 4){
	                			$("#view_others").text(view_data.s2_radio_others).show();	
	                		}else{
		                		$("#view_others").hide();
		                	}
	                	}
	                	if(view_data.res_row_data_s2.length > 0 ){
		                	$.each(view_data.res_row_data_s2, function(i,val){
	                		 	step_two += "<tr>";
	                			step_two +='<td>'+val.brand_name+'</td>' + 
	                		        '<td>'+val.model_name+'</td>' + 
	                		        '<td>'+val.s2_serialnum+'</td>' + 
					         		'<td>'+val.s2_contact_p+'</td>' + 
					         		'<td>'+val.s2_dept_branch+'</td>';
					         	step_two += "</tr>";
		                	});

		                }else{
		                	step_two += no_data;
		                }
	                	$("#tbl_view_frm_component_2 tbody").append(step_two);

	                	//Step 3 Form
	                	if(view_data.s3_id_purpose > 0){
	                		$(".view-step-3 input[type=radio][value='"+view_data.s3_id_purpose+"'").prop('checked',true);
	                	}

	                	//Step 4 Form
	                	$(".view-step-4 #dateRequest").text(view_data.date_requested);
	                	$(".view-step-4 #dateDelivery").text(view_data.date_delivery);
	                	$(".view-step-4 #txtCompany").text(view_data.company_name);
	                	$(".view-step-4 #txtShipTo").text(view_data.ship_to);
	                	$(".view-step-4 #txtBillTo").text(view_data.bill_to);
	                	$(".view-step-4 #txtContactPerson").text(view_data.contact_person);
	                	$(".view-step-4 #txtDepartment").text(view_data.department);
	                	$(".view-step-4 #txtTelNo").text(view_data.tel_no);

	                	//Approver form
	                	//Show button disapprove/approver if current user logged-in is assigned as approver.
	                	var id_user_logged = Cookies.get("user_id");
	                	var user_type = Cookies.get('user_type');
	                	 $.each(view_data.is_approver[0],function(i,val){
	  						
	                	 	  if(val == id_user_logged){
	                	 	  	$("#tab-form-approve table .tfoot_"+i).show();
	                	 	  	$("#tab-form-approve table tfoot button[name="+i+"]").show();

	                	 	  	if(user_type == 5){ // 5 = Engineering, if not equal to 5 not display edit form sn.
	                	 	  		$(".container-edit-sn").show();
	                	 	  	}
	                	 	  	else{
	                	 	  		$(".container-edit-sn").hide();
	                	 	  	}
	                	 	  }
	                	 	  else{
	                	 	 	 //$("#tab-form-approve table .tfoot_"+i).hide();
	                	 	  	 $("#tab-form-approve table tfoot button[name="+i+"]").hide();
	                	 	 }	
	                	 });

	                	//Display name of user already approved.
	                	 if(view_data.user_approved.length > 0 ){
	                	 	var tfoot_selector = [];
	                	 	$.each(view_data.user_approved, function(i, val){
	                	 		
	                	 		if(val["1st_approver"] != "") // push value that has a name.
	                	 			tfoot_selector.push("#tab-form-approve table > tfoot button[name=1st_approver]");
	                	 		if(val["2nd_approver"] != "")
	                	 			tfoot_selector.push("#tab-form-approve table > tfoot button[name=2nd_approver], #tab-form-approve table > tfoot button[name=2nd_approver_2]");
	                	 		if(val["3rd_approver"] != "")
	                	 			tfoot_selector.push("#tab-form-approve table > tfoot button[name=3rd_approver]");
								if(val["4th_approver"] != "")
	                	 			tfoot_selector.push("#tab-form-approve table > tfoot button[name=4th_approver]");
								if(val["5th_approver"] != "")
	                	 			tfoot_selector.push("#tab-form-approve table > tfoot button[name=5th_approver]");


	                	 		$("#1st_approve_name").text(val["1st_approver"]);
	                	 		$("#1st_approve_date").text(val["1st_date"] );
	                	 		$("#2nd_approve_name").text(val["2nd_approver"]);
	                	 		$("#2nd_approve_date").text(val["2nd_date"]);
	                	 		$("#3rd_approve_name").text(val["3rd_approver"] );
	                	 		$("#3rd_approve_date").text(val["3rd_date"]);
	                	 		$("#4th_approve_name").text(val["4th_approver"]);
	                	 		$("#4th_approve_date").text(val["4th_date"]);
	                	 		$("#4th_dr_number").val(val["4th_dr_number"]);
	                	 		$("#4th_edr_number").val(val["4th_edr_number"]);	 
	                	 		$("#4th_inv_number").val(val["4th_inv_number"]);		                	 		
	                	 		$("#5th_approve_name").text(val["5th_approver"]);
	                	 		$("#5th_approve_date").text(val["5th_date"]);
	                	 		$("#5th_delivery_date").val(val["5th_delivery_date"])
	                	 		$("#5th_received_by").val(val["5th_received_by"])
	                	 		$("#5th_delivered_by").val(val["5th_delivered_by"])
	                	 	});

	                	 	if(tfoot_selector.length > 0)//Hide buttons elements already approved
	                	 		$(tfoot_selector.join(",")).hide(); 
	                	 }

	                	//Show/Hide upload attachment if not executive.
	                	if(Cookies.get('user_type') > 1)
	                		$(".attachment-upload-container").remove();

	                	//Display editing SerialNumber
	                	var edit_sn = "";
	              		if(view_data.res_row_data_s1.length > 0 ){
		                	$.each(view_data.res_row_data_s1, function(i,val){
	                		 	edit_sn += "<tr data-id-edit-sn="+val.id+">";
	                			edit_sn +='<td>'+val.brand_name+'</td>' + 
	                		        '<td>'+val.model_name+'</td>' + 
					         		'<td><input type="text" class="mrf-material frm-s1 s1_serialnum" name="s1_serialnum" value="'+val.s1_serialnum+'"></td>';
					         	edit_sn += "</tr>";
					         
		                	});
		                }else{
		                	edit_sn += no_data;
		                }
	                	$("#edit-table-sn tbody").html(edit_sn);

	                	// History
	                	var history = "";
	                	if(view_data.res_history.length > 0){
		                	$.each(view_data.res_history,function(i, val){
		                		history +=  '<div class="history-list">'+
	                   				'<p><span class="col-md-2 clear-left">Remarks: </span><span class="badge badge-'+(val.remarks == 'returned' ? 'green' :'orange')+' history-remarks">'+val.remarks+'</span></p>'+
	                    			'<p><span class="col-md-2 clear-left">DateTime: </span><span class="history-date">'+val.date_created+'</span></p>'+
	                    			'<p><span class="col-md-2 clear-left">S/N: </span><span class=" history-sn">'+val.serial_num+'</span></p></div>';
		                	});
		                }
		                else{
		                	history = "<div style='text-align:center'>No data available.</div>";
		                }

	                	 $(".history").html(history);

	                	//Comments
	                	if(app_action.action_mrf == 'r'){
	                		 $(".btn-archive-comment-mrf").remove();
	                	}else{
		                	 var EXEC_ID     = [1,43]; //Executive user id
		                	 var no_received_message = view_data.res_comments[0].no_received_message;
			                 var idUserFrom  = (view_data.res_comments[0].user_from != 0 ? convertArrStrToInt(view_data.res_comments[0].user_from) : 0);
			                 var buttonColor = "";
								if(no_received_message > 0 && idUserFrom != 0 && (idUserFrom.indexOf(EXEC_ID[0]) >= 0  || idUserFrom.indexOf(EXEC_ID[1]) >=0 ) ){ //indexOf, return -1 if not found else return index value.
	                       	    	buttonColor = 'btn-danger'; // If comment from executive.

	                       	    }else if(no_received_message > 0 && idUserFrom != 0 && (idUserFrom.indexOf(EXEC_ID[0]) == -1 || idUserFrom.indexOf(EXEC_ID[1]) == -1 ) ){
	                       	    	buttonColor = 'btn-warning';// If comment not from executive.
	                       	    }
	                       	    else{
	                       	    	buttonColor = 'btn-info'; //Default for empty comments.
	                       	    }
	                       	    $(".btn-archive-comment-mrf").removeClass('btn-info btn-danger btn-warning').addClass(buttonColor);
                       	}
	                },
	                complete: function(){ $(".view-loader").hide();	},
	                error: function(xhr,status){ alert("Something went wrong!"); }
	            });
			}
			else { alert('ID is empty'); }
    	return this;
    },
    getTonerDetails: function(_thisElem){ //Get Toner details of each tr.
    	var trTonerElem =" ";
    	var trTonerVal = null;
		var tr = $(_thisElem).closest("tr");

		   	trTonerVal  = tr.data('toner-values');
		    trTonerElem =" ";
		  
		        if(trTonerVal != undefined && trTonerVal !=null && trTonerVal != ''){
               		$.each(trTonerVal,function(i,val){
                		 	trTonerElem += "<tr>";
                			trTonerElem +='<td>'+val.s1_toner_qty+'</td>' + 
                		        '<td>'+val.type_name+'</td>' + 
				         		'<td>'+val.s1_toner_model+'</td>' + 
				         		'<td>'+val.s1_toner_price+'</td>' + 
				         		'<td>'+val.s1_toner_yield+'</td>';
				         	trTonerElem += "</tr>";
               		});                	
		        }
		        else{
		        	trTonerElem += "<tr ><td colspan='6'><div class='text-center'><span class='label label-info text-center'>No data available in table.</span></div></td></tr>";
		        }
		        $("#tbl_view_s1_toner tbody").append(trTonerElem);
	
		return this;
    },
    exportExcelRow: function(form_no){
		 var formno = form_no || '';
			if(formno != ''){
			    var urlExcel = window.location.origin + window.location.pathname + 'assets/php/mrf/excelArchiveMachine.php?form_no='+form_no;
			       	window.open(urlExcel, '_blank');			     
			}
			else{
				alert("Missing form no.");
			}

		return this;
	},
	recallUnit: function(){

		promptMSG("custom","Are you sure you want to <strong>Recall</strong> this request?","Confirmation","yn",false,true,function(){
			//Verify if form_no is demo unit. Then return message.
			//Reset the approval form to 1st approver.
			//Insert remarks in History tab.
				var id_mrf = $("#hdnIdCurrentViewMrf").val();
    			var $btn   = $('button');
			 	    $.ajax({
			 	    	type: 'POST',
			 	    	dataType: 'json',
			 	    	data: {action: 'recall_unit',  id_mrf: id_mrf },
			 	    	url: assets + 'php/mrf/mrf.php',
			 	    	beforeSend: function(){ 
			 	    		$btn.button('loading');
			 				$(".mif-modalPromptMSG").modal('hide');  
			 	    	},
			 	    	success: function(data,xhr){			 	    		
			 	    		setTimeout(function(){
			 	    			 if(data.result == 'true'){
			 	    		 		promptMSG("success-custom","Machine Request has been successfully <strong>Recall</strong>.</br>Please see at Current page.",'',null,false,true);
						 	    	$('.mif-modalPromptMSG').on('click','button',function(){//Hide modal Remove Machine.
			                            $('#modalFormArchiveViewMrf').modal('hide');
			                       	});
			 	    		 		self.dtArchiveMrf.dtInstance.ajax.reload(null, true); //Refresh the page
			 	    		 	}else{
			 	    		 		promptMSG("custom",data.message,"Warning!",null,false,true);
				 	    		}
			 	    		},300);
			 	    	},
			 	    	complete: function(){
	                		$btn.button('reset');  
	            		}
			 	    });
		});

	},
	 getMultipleFormNo: function(dataTableInst, checkBoxElem){ //Get the multiple row selected IDs # if there is option selected.
            var rows = dtArchiveMrf[dataTableInst].rows({ 'search': 'applied' }).nodes();
            var checkedVals = $(checkBoxElem, rows).map(function() {
                return this.value;
            }).get();

        return checkedVals.join(',');
    },
    actions: function(){
    	$("#archiveMrfList").on('click','button, a',function(e) {
    		e.preventDefault();
    		    var inst = $(this);
    		    var button_label = inst.text().toLowerCase();

    		    //Highlight row selected.
      			if ( !inst.closest('tr').hasClass('selected') ) {  
                    self.dtArchiveMrf.dtInstance.$('tr.selected').removeClass('selected');
                    inst.closest('tr').addClass('selected');
                }
                //Search button
                if(button_label == "search"){
                    self.dtArchiveMrf.dtInstance.ajax.reload(null, true);
                }
                //Reset button
                else if(button_label =="reset"){
	                $("#dthead-search-archivemrf input[type='text'], #dthead-search-archivemrf select").val('');  //Clear all values;
	                self.dtArchiveMrf.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                }
                 //View Button
               else if(button_label == "view"){
                	var idview = $(this).data('mrf');
                		self.dtArchiveMrf.getDataViewRequestForm(idview);
                }
                //Comments Button
                // else if(button_label == "comments"){
                // 	var id_mrf = $(this).data('mrf');
                // 	var id_user = Cookies.get('user_id');
                // 		comment.display(id_mrf, id_user);
                // } 
                //Export Excel
                else if ( inst.hasClass('export-machine-delivered') ) {  
                	var form_no = self.dtArchiveMrf.getMultipleFormNo('dtInstance','.hidden-form-no');
                		self.dtArchiveMrf.exportExcelRow(form_no);
                } 
                else{ }

	 			    	 		   	   	     	   		
    	});
    	return this;    	 
    },
     buildSubRowSerial: function(tblData){
		  var data = tblData; //array values must one-level dimension.

		  if(tblData.length > 0){
			  var result = [],
			        row,
			        colLength = 5,
			        i = 0;
			    	
			    //loop through items and push each item to a row array that gets pushed to the final result
			    for ( i = 0, j = data.length; i < j; i++) {
			        if (i % colLength === 0) {
			            if (row) {
			              result.push(row);   
			            }
			            row = [];
			        }
			        row.push(data[i]);
			    }
			    
			    //push the final row  
			    if (row) {
			        result.push(row);
			    }

			    //Build table serial;
			    var subTable = document.createElement('table')
			    var tbody = document.createElement('tbody');
			    var thead = document.createElement('thead');
			    var th = document.createElement('th');
			    var headRow = document.createElement("tr");

				subTable.className = "subTableStyle";
				th.appendChild(document.createTextNode('Serial Numbers'));
				th.setAttribute('colspan',colLength);
				headRow.appendChild(th);
				thead.appendChild(headRow);

				subTable.appendChild(thead);
			    result.forEach(function(el,idx){
			    	var tr = document.createElement('tr');
			    	for(var i in el){
			    		var td = document.createElement('td');
			    		var txt = document.createTextNode(el[i]);
			    		td.appendChild(txt);
			    		tr.appendChild(td);
			    	}
			    	tbody.appendChild(tr);
			    });
			    subTable.appendChild(tbody);
				return ("<td colspan='8'><div>"+subTable.outerHTML+"</div></td>");
			}
		return '';
	}


};