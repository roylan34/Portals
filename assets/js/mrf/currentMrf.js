//Current
var dtCurrentMrf = {
	dtInstance: null,
	selectedBranch: null,
	tableValuesDeleteS1: [],
	tableValuesDeleteS2: [],
	tableValuesDeleteToner: [],
	pageDetails: function () {
		$(".content-header h1").text("MRF");
		$(".content-header h1").append("<small>Current</small>");
		return this;
	},
	tableAddRow: function (paramObj) {

		/*
		* @param - {string} paramObj.elemTable
		* @param - {string} paramObj.elemBtnAdd
		* @param - {int}    paramObj.cellNumPosBtnDelete
	* @param - {string} paramObj.elemBtnDelete
	* @param - {array}  paramObj.inputIdName
		*/
		if (typeof paramObj != 'object' && paramObj == null && paramObj == undefined) {
			console.error('Argument must be object and non-empty.');
			return false;
		}
		//var row_add_start = 2; 
		$(paramObj.elemBtnAdd).click(function (e) { //Event handler to add a table row.
			var table = document.getElementById(paramObj.elemTable);
			var table_body = table.querySelector("tbody");
			var table_body_row = table_body.rows.length + 1; //Get the total table tbody rows.
			var table_cell = table.rows[0].cells.length; //Get the total table cell.

			if (($(table_body).find("[data-row-num^='parentRow']").length + 1) <= 5) { // Count tr length has classname begin with parentRow.
				var tr = table_body.insertRow(-1); //Insert a new table row at the last.
				//tr.id 	  = "parentRow-"+(randomNum()); //Insert tr classname.
				tr.setAttribute('data-row-num', 'parentRow-' + randomNum());

				var trSubSerial = table_body.insertRow(-1); //Insert a new Serial table row at the last.
				trSubSerial.className = "subRowSerial"; //Insert sub tr.

				var trSub = table_body.insertRow(-1); //Insert a new Toner table row at the last.
				trSub.className = "subRow"; //Insert sub tr.

				var i = 0;
				var idElem = '';
				var attr = '';

				for (i; i < table_cell; i++) {
					cell = tr.insertCell(i);

					if (paramObj.customCell != undefined && paramObj.customCell != null) {
						if (i == paramObj.customCell[i].cellNo && paramObj.customCell[i].elem == 'default') {
							idElem = paramObj.customCell[i].idElem;
							attr = paramObj.customCell[i].attr;
							cell.innerHTML = '<input type="text" class="mrf-material ' + idElem + '" id= "' + idElem + '" name= "' + idElem + '" ' + attr + ' />';
						}
						else {

							if (paramObj.customCell[i].elem != undefined && paramObj.customCell[i].elem instanceof Function) {
								cell.innerHTML = paramObj.customCell[i].elem(table_body_row);
							}
							if (paramObj.customCell[i].elem != undefined && typeof paramObj.customCell[i].elem == 'string') {
								cell.innerHTML = paramObj.customCell[i].elem;

							}
							if (paramObj.customCell[i].callBack != undefined && paramObj.customCell[i].callBack instanceof Function) {
								paramObj.customCell[i].callBack(paramObj.customCell[i].idElem);

							}

						}
					}
				}
				// row_add_start++;
			} else {
				alert('Maximum of five(5) rows can add.');
			}
		});

		$('#' + paramObj.elemTable).on('click', '.delete_row', function (e) { //Event handler to delete a table row.
			e.preventDefault();
			//$(this).closest('tr').remove();		
			var tr = $(this).closest('tr');
			var trRowNum = tr.attr('data-row-num');

			tr.fadeOut(400, function () {
				if (paramObj.deleleteSubRow == true) {
					$("#" + paramObj.elemTable + " tbody tr[data-row-num^='" + (trRowNum) + "']").nextAll(":lt(2)").fadeOut(400, function () {
						$(this).remove();
					}); //Delete next two sub tr.
				}
				$(this).remove();
			});
			//row_add_start--;

		});
		return this;
	},
	render: function (app_mrf, user_role, user_mrf_flag) {
		// document.title = "MRF"; // Change the title tag.

		this.dtInstance = $('#dtCurrentMrf').DataTable({
			"dom": "Blrtip",
			"ordering": false,
			"autoWidth": false,
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
					text: '<i class="fa fa-refresh" aria-hidden="true"></i>',
					tag: 'a',
					className: 'btn-refresh-mrf',
					action: function (e, dt, node, config) {
						self.dtCurrentMrf.dtInstance.ajax.reload(null, true);
					}
				},
				{
					text: 'Add Request Form',
					tag: 'a',
					className: 'btn-add-mrf',
					action: function (e, dt, node, config) {
						$("#modalFormCurrentMrf .modal-title").text('Add Machine Request');
						$("#modalFormCurrentMrf #dateRequest").val(getTodayDateStandard());
						$("#btn_cancel, #download").hide(); //Hide button Cancel request if Adding entry.
						$("table tbody tr").each(function () {//Remove tr attributes in Step form 1 and 2.
							$(this).removeAttr("data-mrf-s1 data-mrf-s2");
						});
						$("#tbl_frm_component_1 tbody").append('<tr class="subRowSerial first-subRow"></tr><tr class="subRow first-subRow"></tr>');
					}
				},
				{
					text: 'Open Search Filter',
					className: 'btn-search-mrf',
					action: function (e, dt, node, config) {
						$("#dthead-search-mrf").slideToggle('fast', function () {
							if ($(this).is(':visible')) {
								node[0].innerText = 'Close Search Filter';
							} else {
								node[0].innerText = 'Open Search Filter';
								$("#dt-head-search input[type='text'], #search-for-approver").val('');  //Clear all values.		                                               
								dtCurrentMrf.dtInstance.ajax.reload(null, true);
							}
						});
					}
				}
			],
			"ajax": {
				"url": assets + 'php/mrf/getMachineRequestList.php',
				"type": "GET",
				"dataSrc": "records",
				data: function (d) {
					delete d.columns;
					d.form_no = $("#search-mrf-formno").val() || '';
					d.company = $("#search-mrf-company").val() || '';
					d.date_requested = $("#search-mrf-dateRequest").val() || '';
					d.requested_by = $("#search-mrf-requestedBy").val() || '';
					d.status = $("#search-for-approver option:selected").val() || '';

					d.action_view = "current";
					d.id_user = Cookies.get('user_id');
					d.id_branch = $("#current-mrf-branchlist option:selected").val();
				}
			},
			"columns": [
				{
					data: null, render: function (data, type, row, meta) {
						return meta.row + 1; //DataTable autoId for sorting.
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						return "<span class='text-center'>" + data.form_no + "</span>";
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						return "<span class='text-center'>" + data.company_name + "</span>";
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						var dateTimeSplit = data.date_requested.split(" ");
						var dataTS = "";
						if (dateTimeSplit[1] == "00:00:00") //Display date only if time is empty.
							dataTS = dateTimeSplit[0];
						else
							dataTS = data.date_requested;

						return "<span class='text-center'>" + dataTS + "</span>";
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						return "<span class='text-center'>" + data.requested_by + "</span>";
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						return "<span class='text-center'>" + data.branch_name + "</span>";
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						return "<span class='badge badge-orange'>" + data.age + "</span>";
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						var status = "";
						status = data.status_approval.split("|");
						return "<span class='badge " + status[1] + "'>" + status[0] + "</span>";
					}
				},
				{
					data: null, render: function (data, type, full, meta) {
						var buttons = "";
						var user_mrf_flag = Cookies.get("user_mrf_flag");
						var status = data.status_approval.split("|") || null;

						var EXEC_ID = [1, 43]; //Executive user id
						var idUserFrom = (data.id_user_from != null ? convertArrStrToInt(data.id_user_from) : null);
						var buttonColor = "";

						if (data.no_received_message > 0 && idUserFrom != null && (idUserFrom.indexOf(EXEC_ID[0]) >= 0 || idUserFrom.indexOf(EXEC_ID[1]) >= 0)) { //indexOf, return -1 if not found else return index value.
							buttonColor = 'btn-danger'; // If comments from executive.

						} else if (data.no_received_message > 0 && idUserFrom != null && (idUserFrom.indexOf(EXEC_ID[0]) == -1 || idUserFrom.indexOf(EXEC_ID[1]) == -1)) {
							buttonColor = 'btn-warning';// If comments not from executive.
						}
						else {
							buttonColor = 'btn-info'; //Default for empty comments.
						}

						if (user_mrf_flag == "requestor" && (status[0] == "APPROVER-1" || status[0] == "APPROVER-2")) {
							buttons += '<div class="col-md-4"><a title="Edit Request" class="btn btn-success btn-xs btn-flat btn-edit-mrf" data-mrf="' + data.id + '"" data-toggle="modal" data-target="#modalFormCurrentMrf">EDIT</a></div>';
							buttons += '<div class="col-md-4"><button title="Comments" class="btn ' + buttonColor + ' btn-xs btn-flat btn-comment-mrf" data-mrf="' + data.id + '"" data-toggle="modal" data-target="#modalComments">COMMENTS</button></div>';

						}
						if (user_mrf_flag == "approver" || (user_mrf_flag == "requestor" && (status[0] == "ENGINEERING" || status[0] == 'ACCOUNTING' || status[0] == 'LOGISTICS'))) {
							buttons += '<div class="col-md-4"><a title="View Request" class="btn btn-info btn-xs btn-flat btn-view-mrf" data-mrf="' + data.id + '"" data-toggle="modal" data-target="#modalFormCurrentViewMrf">VIEW</a></div>';
						}

						return buttons;
					}
				}
			],
			"columnDefs": [
				{ responsivePriority: 1, target: 0 },
				{ responsivePriority: 2, target: 1 }
			],
			"preDrawCallback": function (settings) {
				$(".btn-search-mrf, .btn-add-mrf, .btn-refresh-mrf").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({ "margin-bottom": "0.5em", "margin-right": "0.5em" });
			},
			"fnDrawCallback": function () {
				var api = this.api();
				$(".btn-add-mrf").attr('data-toggle', 'modal');
				$(".btn-add-mrf").attr('data-target', '#modalFormCurrentMrf');

				if (user_mrf_flag == "approver" || user_mrf_flag == "preparer") { //Approver and preparer can't use the add button.
					$(".btn-add-mrf").remove();
				}

				var action = JSON.parse(Cookies.get('app_module_action'));
				if (action == null) {
					$('.btn-edit-mrf, .btn-comment-mrf, .btn-add-mrf').remove();
				}
				else {
					if (action.action_mrf == "r")
						$('.btn-edit-mrf, .btn-comment-mrf, .btn-add-mrf').remove();
				}


			}
		});
		//Adding attribute in refresh button.
		this.dtInstance.button('.btn-refresh-mrf')
			.nodes()
			.attr('title', 'Refresh');

		return this;
	},
	modalShow: function (mrf_flag) {
		//Modal data entry form.
		if (mrf_flag == 'requestor') {
			$("#displayFormMrfEntry").load(pages + 'mrf/current/form.html', function () {
				//Dynamically adding rows.
				var tableComponent1 = {
					elemTable: 'tbl_frm_component_1', elemBtnAdd: '#btn_add_row_s1', deleleteSubRow: true,
					customCell: [
						{ cellNo: 0, elem: '<input type="text" id="s1_quantity" disabled="disabled" class="s1_quantity mrf-material frm-s1 not-full-width" name="s1_quantity"/>' },
						{
							cellNo: 1,
							elem: function () { //custom elem brand
								if (autoDrpDown.cacheOptBrands.length != 0) {
									return $('<select id="s1_brand"  class="form-control s1_brand frm-s1 chosen-select" data-s1-brand-row="' + arguments[0] + '" name="s1_brand"></select>').html(autoDrpDown.cacheOptBrands[0].join(""))[0].outerHTML;
								}
							},
							callBack: function () { //apply plugin
								if (autoDrpDown.cacheOptBrands.length != 0) {
									$(arguments[0]).chosen({ no_results_text: "No records found.", width: '100%', search_contains: true });
									self.dtCurrentMrf.showModelByBrand(".s1_brand", "s1-brand-row", ".s1_model_row_");
								}
							}, idElem: '.s1_brand'
						},
						{
							cellNo: 1,
							elem: function () { //custom elem model
								if (autoDrpDownInvnt.cacheOptModel.length != 0) {
									return $('<select id="s1_id_model"  class="mrf-material s1_id_model frm-s1 chosen-select s1_model_row_' + arguments[0] + '" name="s1_id_model"></select>').html(autoDrpDownInvnt.cacheOptModel[0].join(""))[0].outerHTML;
								}
							},
							callBack: function () { //apply plugin
								if (autoDrpDownInvnt.cacheOptModel.length != 0) {
									$(arguments[0]).chosen({ no_results_text: "No records found.", width: '100%', search_contains: true });
								}
							}, idElem: '.s1_id_model'
						},
						{ cellNo: 3, elem: '<select id="s1_bn_rf" class="mrf-material s1_bn_rf frm-s1" name="s1_bn_rf"><option value="">---</option><option value="1">Brand New (BN)</option><option value="2">Refurbished (RF)</option></select>' },
						{ cellNo: 4, elem: 'default', idElem: 's1_accessories' },
						{
							cellNo: 5, elem: '<button type="button" onClick="dtCurrentMrf.getTrIndexSerial(this)" class="btn btn-flat btn-success btn-xs btn_s1_add_toner" title="Add Serial Number" data-toggle="modal" data-target="#modalS1Serial">+</button>' +
								'<input type="hidden" id="s1_serialnum" class="s1_serialnum mrf-material frm-s1 validate-hidden-text" name="s1_serialnum" value=""/> '
						},
						{
							cellNo: 6, elem: '<button type="button" onClick="dtCurrentMrf.getTrIndex(this)" class="btn btn-flat btn-success btn-xs btn_s1_add_toner" title="Add Toner" data-toggle="modal" data-target="#modalS1Toner">+</button>' +
								'<input type="hidden" id="s1_toner" class="s1_toner validate-hidden-text" name="s1_toner" value=""/> '
						},
						{ cellNo: 7, elem: '<button type="button" title="Delete" class="btn btn-flat btn-danger btn-xs delete_row ">X</button>' }
					]
				};
				var tableComponent1Toner = {
					elemTable: 'tbl_frm_s1_toner', elemBtnAdd: '#btn_add_row_s1_toner',
					customCell: [
						{ cellNo: 0, elem: '<input type="text" class="mrf-material s1_toner_qty" name="s1_toner_qty" onkeyup="dtCurrentMrf.autoComputeTonerTotal(this)">' },
						{ cellNo: 1, elem: '<select  class="mrf-material frm-s1 s1_toner_monocolor" name="s1_toner_monocolor"><option value="">---</option><option value="1">Mono</option><option value="2">Color</option></select>' },
						{ cellNo: 2, elem: '<input type="text" class="mrf-material s1_toner_model"  name="s1_toner_model">' },
						{ cellNo: 3, elem: '<input type="text" class="mrf-material s1_toner_price" name="s1_toner_price" onkeyup="dtCurrentMrf.autoComputeTonerTotal(this)">' },
						{ cellNo: 4, elem: '<input type="text" class="mrf-material s1_toner_yield" name="s1_toner_yield">' },
						{ cellNo: 5, elem: '<input type="text" class="mrf-material s1_toner_total" name="s1_toner_total" disabled="disabled">' },
						{ cellNo: 6, elem: '<select class="mrf-material frm-s1 s1_toner_type" name="s1_toner_type"><option value="">---</option><option value="1">Outright</option><option value="2">Meter Reading</option><option value="3">Fixed Monthly</option></select>' },
						{ cellNo: 7, elem: 'default', idElem: 's1_toner_rate' },
						{ cellNo: 8, elem: '<button type="button" title="Delete" class="btn btn-flat btn-danger btn-xs delete_row ">X</button>' }
					]
				};
				var tableComponent2 = {
					elemTable: 'tbl_frm_component_2', elemBtnAdd: '#btn_add_row_s2',
					customCell: [
						{
							cellNo: 0,
							elem: function () { //custom elem brand
								if (autoDrpDown.cacheOptBrands.length != 0) {
									return $('<select id="s2_id_brand"  class="form-control s2_id_brand frm-s1 chosen-select" data-s2-brand-row="' + arguments[0] + '" name="s2_id_brand"></select>').html(autoDrpDown.cacheOptBrands[0].join(""))[0].outerHTML;
								}
							},
							callBack: function () { //apply plugin
								if (autoDrpDown.cacheOptBrands.length != 0) {
									$(arguments[0]).chosen({ no_results_text: "No records found.", width: '100%', search_contains: true });
									self.dtCurrentMrf.showModelByBrand(".s2_id_brand", "s2-brand-row", ".s2_model_row_");
								}
							}, idElem: '.s2_id_brand'
						},
						{
							cellNo: 1,
							elem: function () { //custom elem model
								if (autoDrpDownInvnt.cacheOptModel.length != 0) {
									return $('<select id="s2_id_model"  class="mrf-material s2_id_model frm-s1 chosen-select s2_model_row_' + arguments[0] + '" name="s2_id_model"></select>').html(autoDrpDownInvnt.cacheOptModel[0].join(""))[0].outerHTML;
								}
							},
							callBack: function () { //apply plugin
								if (autoDrpDownInvnt.cacheOptModel.length != 0) {
									$(arguments[0]).chosen({ no_results_text: "No records found.", width: '100%', search_contains: true });
								}
							}, idElem: '.s2_id_model'
						},
						{ cellNo: 2, elem: 'default', idElem: 's2_serialnum' },
						{ cellNo: 3, elem: 'default', idElem: 's2_contact_p' },
						{ cellNo: 4, elem: 'default', idElem: 's2_dept_branch' },
						{ cellNo: 5, elem: '<button type="button" title="Delete" class="btn btn-flat btn-danger btn-xs delete_row ">X</button>' }
					]
				};
				self.dtCurrentMrf.tableAddRow(tableComponent1);
				self.dtCurrentMrf.tableAddRow(tableComponent1Toner);
				self.dtCurrentMrf.tableAddRow(tableComponent2);

				self.dtCurrentMrf.autoComplete().update_cancel(); //show autocomplete dropdown and cancelling request.
				self.dtCurrentMrf.showModelByBrand(".s1_brand", "s1-brand-row", ".s1_model_row_");
				self.dtCurrentMrf.showModelByBrand(".s2_id_brand", "s2-brand-row", ".s2_model_row_");

				self.dtCurrentMrf.getTableRowDeleteId({ elemTable: "#tbl_frm_component_1", attrTr: "mrf-s1" });
				self.dtCurrentMrf.getTableRowDeleteId({ elemTable: "#tbl_frm_component_2", attrTr: "mrf-s2" });
				self.dtCurrentMrf.getTableRowDeleteId({ elemTable: "#tbl_frm_s1_toner", attrTr: "mrf-s1-toner" });

				$(this).find("#dateDelivery").inputmask();
				//Step 2 radio button demo/rental and others.
				$(".radioBtn-group-c2").on('change', function () {
					if ($(this).val() == 3) {
						$("#txtDemoRental").prop('disabled', false).focus();
					}
					else {
						$("#txtDemoRental").val('').prop('disabled', true);
					}

					if ($(this).val() == 4) {
						$("#txtOthers").prop('disabled', false).focus();
					}
					else {
						$("#txtOthers").val('').prop('disabled', true);
					}


				});

				//When modal shown has callback functions.
				//	$(this).find('#modalFormCurrentMrf').on('shown.bs.modal', function() { 
				autoDrpDown.getBrandName('#s1_brand', true);
				autoDrpDownInvnt.getModelByBrand("#s1_id_model", true);
				autoDrpDown.getBrandName('#s2_id_brand', true);
				autoDrpDownInvnt.getModelByBrand("#s2_id_model", true);
				autoDrpDownMrf.getBranch("#slctBranchRequest", false, convertArrStrToInt(Cookies.get('branch_mrf')), null, true, false);
				// });

				//Reset form when modal hidden
				$(this).find('#modalFormCurrentMrf').on('hidden.bs.modal', function () {
					$(this).find("#frmCurrentMrf").trigger('reset');
					$(this).find("#frmCurrentMrf input[type='hidden']").val('');
					$(this).find("#txtCompany").attr('data-value', 0);//Reset attribute value to zero.  
					$(this).find("#s1_brand, #s1_id_model, #s2_id_brand, #s2_id_model").val('').trigger('chosen:updated');
					$(this).find("input, select").parents('.col-sm-6').removeClass('has-error has-success');
					$(this).find("em.help-block").remove();
					$(this).find("#tbl_frm_component_1 tbody tr, #tbl_frm_component_2 tbody tr").not('.not-tr').remove();
					$(this).find("#tbl_frm_component_1 tbody tr.first-subRow").empty();
					// $('.delete_row').trigger('click'); //When modal hidden delete automatically rows can be deleted.
					navigateForm(0, true); //Back to first step in Request Form.

					$("#tbl_frm_component_1, #tbl_frm_component_2, #tbl_frm_s1_toner").removeData('del-id');//Clear the arbitrary table values.
					$("#tbl_frm_component_1 tbody tr").eq(0).removeData('toner-values');
					self.dtCurrentMrf.tableValuesDeleteS1.length = 0;
					self.dtCurrentMrf.tableValuesDeleteS2.length = 0;
					self.dtCurrentMrf.tableValuesDeleteToner.length = 0;

					$("#slctBranchRequest").prop('disabled', false);//show branch dropdown. 
					$(this).find("#form-code").text('');
					$(this).find(".pre-list-attachment, .post-list-attachment").html('');
				});

				//Reset Toner form when modal hidden.
				$(this).find('#modalS1Toner').on('hidden.bs.modal', function () {
					$('body').addClass('modal-open');
					$(this).find("#frmS1Toner").trigger('reset');
					$(this).find("#frmS1Toner input[type='hidden']").val('');
					$(this).find("em.help-block").remove();
					$(this).find("#tbl_frm_s1_toner tbody tr").eq(0).removeAttr('data-mrf-s1-toner');
					$("#tbl_frm_s1_toner tbody tr").remove();
					$(this).find("#frmS1Toner #grandTotal").text('----');

				});

				//Reset Serial form when modal hidden.
				$(this).find('#modalS1Serial').on('hidden.bs.modal', function () {
					$('body').addClass('modal-open');
					$(this).find("#frmS1Serial").trigger('reset');
					$(this).find("#frmS1Serial input[type='hidden']").val('');
					$(this).find("#frmS1Serial #newSerialFields").empty();
				});
			});
		}

		//Modal View machine request form.
		//if(mrf_flag == 'approver'){
		$("#displayViewStepDetails").load(pages + 'mrf/current/view-request-form.html', function () {

			//Hide View Modal
			$(this).find('#modalFormCurrentViewMrf').on('hidden.bs.modal', function () { //Reset form when modal hidden
				$(this).find("#frmCurrentViewMrf").trigger('reset');
				$(this).find("#frmCurrentViewMrf input[type='hidden'], #frmViewAttachment input[type='hidden']").val('');
				$("#tbl_view_frm_component_1 tbody tr, #tbl_view_frm_component_2 tbody tr").not('.view-loader').remove();
				$("#tab-form-approve table tfoot, #tab-form-approve table > tfoot button").hide();
				$(this).find(".view-pre-list-attachment").html('');
			});
			//Hide Toner modal
			$(this).find('#modalS1ViewToner').on('hidden.bs.modal', function () { //Reset form when modal hidden
				$('body').addClass('modal-open');
				$("#tbl_view_s1_toner tbody tr").remove();
				//$(".view-step-2 .radioBtn-group-c2").prop('checked',false); IN PROGRESS
			});
		});
		//}

		//Modal Comments.
		$("#displayComments").load(pages + 'mrf/current/comments.html', function () {
			// var intervalComments = null;

			$(this).find('#modalComments').on('shown.bs.modal', function () { //Reset form when modal hidden
				var id_user = Cookies.get('user_id');
				var id_mrf = $("#hdnIdMRF").val();
				// intervalComments = setInterval(function () { //Auto Refresh messages.
					comment.display(id_mrf, id_user);
				// }, 5000);
				// comment.stopAutoRefresh(); //Refresh messages.
			});
			//Hide View Modal
			$(this).find('#modalComments').on('hidden.bs.modal', function () { //Reset form when modal hidden
				$(this).find("#frmComment").trigger('reset');
				$(this).find("#frmComment input[type='hidden']").val('');
				$(".comment-box").empty();
				// clearInterval(intervalComments);

				if ($("#modalFormCurrentViewMrf").is(':visible')) {//Check if View Request modal still visible and addClass.
					$("body").addClass('modal-open');
				}


			});
		});

		return this;
	},
	selectBranch: function (user_mrf_flag, branch) { //Display dropdown branch in request form and page.
		var drpdownBranch = null;
		if (user_mrf_flag == "approver" || user_mrf_flag == "preparer" || user_mrf_flag == "requestor,preparer") { //Display only if user is approver or preparer.
			var branch_approver = function (iduser) {
				var result;
				$.ajax({
					type: 'POST',
					url: assets + 'php/mrf/misc/getBranchApprover.php',
					data: { id_user: iduser },
					async: false,
					success: function (data) {
						result = data.aaData[0].id_branch;
						//console.log(result);
					}
				});
				return (result ? convertArrStrToInt(result.split(",")) : null);
			}

			drpdownBranch = branch_approver(Cookies.get("user_id"));
		}
		else {
			drpdownBranch = convertArrStrToInt(Cookies.get("branch_mrf").split(","));
		}

		autoDrpDownMrf.getBranch("#current-mrf-branchlist", false, drpdownBranch, null, true, true);

		$("select#current-mrf-branchlist").change(function () {
			dtCurrentMrf.dtInstance.ajax.reload();
		});

		return this;
	},
	add: function (callBackNavigateForm) { // IN-PROGRESS, attachment
		var $btn = $(".btn_submit, .btn_next");

		var s1_row_data = getTableRowValue({ elemTable: "#tbl_frm_component_1", selectorInput: "input, select", trAttr: 'mrf-s1', inputElem: [{ name: "s1_quantity", getValueByChosen: false }, { name: "s1_brand", getValueByChosen: true }, { name: "s1_id_model", getValueByChosen: true }, { name: "s1_bn_rf", getValueByChosen: false }, { name: "s1_serialnum", getValueByChosen: false }, { name: "s1_accessories", getValueByChosen: false }] });
		var s1_row_toner_data = getTableRowArbitraryValue({ elemTable: "#tbl_frm_component_1", trAttrToner: "toner-values" });
		var s2_row_data = getTableRowValue({ elemTable: "#tbl_frm_component_2", selectorInput: "input, select", trAttr: 'mrf-s2', inputElem: [{ name: "s2_id_brand", getValueByChosen: true }, { name: "s2_id_model", getValueByChosen: true }, { name: "s2_serialnum", getValueByChosen: false }, { name: "s2_contact_p", getValueByChosen: false }, { name: "s2_dept_branch", getValueByChosen: false }] });

		var s2_radio_id = $(".radioBtn-group-c2:checked").val() || 0;
		var s2_radio_nodays = $("#txtDemoRental").val() || 0;
		var s2_radio_others = $("#txtOthers").val() || '';
		var s3_id_purpose = $(".radioBtn-group-c3:checked").val() || 0;

		var form_no = $("#form-code").text();
		var date_request = $("#dateRequest").val();
		var id_company = $("#txtCompany").attr('data-value');
		var ship_to = $("#txtShipTo").val();
		var bill_to = $("#txtBillTo").val();
		var contact_p = $("#txtContactPerson").val();
		var dept = $("#txtDepartment").val();
		var tel_no = $("#txtTelNo").val();
		var id_user = Cookies.get("user_id");
		var branch = Cookies.get("branch_mrf");
		var email = Cookies.get("email");
		var fullname = Cookies.get("fullname");
		var files = $("#attachment")[0].files;



		fileUpload.upload(files, { action: "add_files" }, function () { //File attachment with callback inserting data.

			var status = arguments[0].attachment_status || '';
			var message = arguments[0].attachment_message || '';

			if (status == 'true') {
				var attachment_name = arguments[0].attachment_uploaded || '';

				var data = {
					action: 'add', s1_row_data: s1_row_data.insert, s1_row_toner_data: s1_row_toner_data, s2_row_data: removeEmptyObjectInArray(s2_row_data.insert, "s2_id_brand"), s2_radio_id: s2_radio_id, form_no: form_no,
					email: email, fullname: fullname, s2_radio_nodays: s2_radio_nodays, s2_radio_others: s2_radio_others, s3_id_purpose: s3_id_purpose, date_request: date_request, id_company: id_company,
					ship_to: ship_to, bill_to: bill_to, contact_p: contact_p, dept: dept, tel_no: tel_no, id_user_requestor: id_user, branch: branch, attachment_name: attachment_name
				};
				$.ajax({
					type: 'POST',
					url: assets + 'php/mrf/mrf.php',
					data: data,
					dataType: 'json',
					beforeSend: function () { $btn.button('loading'); }, //Empty the search fields. 
					success: function (data, xhr, status) {
						if (data.aaData[0] == "success") {
							promptMSG('success-add', 'Machine Request', null, null, true, true);
							callBackNavigateForm();//callback function that go back to the step 1 in form.
							self.dtCurrentMrf.dtInstance.ajax.reload(null, false); //.page('last'); // Reload the data in DataTable and go to last page.
						}
					},
					error: function (xhr, status) { alert("Something went wrong!"); },
					complete: function (data, xhr) {
						$btn.button('reset');
					}
				});
			}
			else {
				alert(message);
			}


		});

		return this;
	},
	update: function (id, callBackAction) { // IN PROGRESS, attachment
		var $btn = $("button[type='submit'], .btn_cancel, .btn_next");
		var id_mrf = $("#hdnIdCurrentMrf").val();
		var s1_row_data = getTableRowValue({ getTrTonerAttr: true, elemTable: "#tbl_frm_component_1", selectorInput: "input, select", trAttr: 'mrf-s1', inputElem: [{ name: "s1_bn_rf", getValueByChosen: false }, { name: "s1_quantity", getValueByChosen: false }, { name: "s1_brand", getValueByChosen: true }, { name: "s1_id_model", getValueByChosen: true }, { name: "s1_serialnum", getValueByChosen: false }, { name: "s1_accessories", getValueByChosen: false }] });
		var s2_row_data = getTableRowValue({ elemTable: "#tbl_frm_component_2", selectorInput: "input, select", trAttr: 'mrf-s2', inputElem: [{ name: "s2_id_brand", getValueByChosen: true }, { name: "s2_id_model", getValueByChosen: true }, { name: "s2_serialnum", getValueByChosen: false }, { name: "s2_contact_p", getValueByChosen: false }, { name: "s2_dept_branch", getValueByChosen: false }] }, "s2_serialnum");

		var s1_row_toner_del_data = $("#tbl_frm_s1_toner").data('del-id'); //Get attach ids of deleting row.
		var s1_row_del_data = $("#tbl_frm_component_1").data('del-id'); //Get attach ids of deleting row.
		var s2_row_del_data = $("#tbl_frm_component_2").data('del-id'); //Get attach ids of deleting row.

		var s2_radio_id = $(".radioBtn-group-c2:checked").val() || 0;
		var s2_radio_nodays = $("#txtDemoRental").val() || 0;
		var s2_radio_others = $("#txtOthers").val() || '';
		var s3_id_purpose = $(".radioBtn-group-c3:checked").val() || 0;

		var id_company = $("#txtCompany").attr('data-value');
		var ship_to = $("#txtShipTo").val();
		var bill_to = $("#txtBillTo").val();
		var contact_p = $("#txtContactPerson").val();
		var dept = $("#txtDepartment").val();
		var tel_no = $("#txtTelNo").val();
		var files = $("#attachment")[0].files;
		var file_name = $(".hdnAttachmentName").val() || '';

		fileUpload.upload(files, { action: "update_files", file_name: file_name }, function () { //File attachment with callback updating data.

			var status = arguments[0].attachment_status || '';
			var message = arguments[0].attachment_message || '';

			if (status == 'true') {
				var attachment_name = arguments[0].attachment_uploaded || file_name; // if no existing directory create new then if existing retain the directory name.

				var data = {
					action: 'update', id_mrf: id_mrf, s1_row_data: s1_row_data, s1_row_del_data: s1_row_del_data,
					s2_row_data: s2_row_data, s2_row_del_data: s2_row_del_data, s1_row_toner_del_data: s1_row_toner_del_data, s2_radio_id: s2_radio_id,
					s2_radio_nodays: s2_radio_nodays, s2_radio_others: s2_radio_others, id_company: id_company, ship_to: ship_to, bill_to: bill_to, s3_id_purpose: s3_id_purpose, contact_p: contact_p, dept: dept, tel_no: tel_no, attachment_name: attachment_name
				};
				if (id != '') {
					$.ajax({
						type: 'POST',
						url: assets + 'php/mrf/mrf.php',
						data: data,
						dataType: 'json',
						beforeSend: function () { $btn.button('loading'); },
						success: function (data, xhr, status) {
							promptMSG('success-update', 'Machine Request', null, null, true, true);
							callBackAction();
							self.dtCurrentMrf.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
						},
						error: function (xhr, status) { alert("Something went wrong!"); },
						complete: function () { $btn.button('reset'); }
					});
				}
				else { alert('ID is empty'); }
			}
			else {
				alert(message);
			}
		});

		return this;
	},
	getData: function (id, clearTableBody) { //FOR DEVELOPMENT in Step Form 3 and 4.
		if (id != '' && id != undefined) {
			var $btn = $("#btn_add_row_s1, #btn_next, .btn_submit, #btn_cancel"); //Disabled button first.
			var step_one = "", step_two = "";

			$.ajax({
				type: 'POST',
				url: assets + 'php/mrf/mrf.php',
				data: { action: 'view-id', id_mrf: id },
				dataType: 'json',
				cache: false,
				// async: false,
				beforeSend: function () {
					$btn.button('loading');
					if (clearTableBody == true && clearTableBody != undefined) {
						// step_one =" ";
						// step_two =" ";
						$("#tbl_frm_component_1 tbody tr, #tbl_frm_component_2 tbody tr").not(".not-tr").remove();
						$("#tbl_frm_component_1 input, #tbl_frm_component_2 input").not(':hidden').val('');
					}
				},
				success: function (data, xhr, status) {
					var fetch_data = data.aaData[0];
					var opt_brand = function (selectedBrand) {
						var opt = '';
						//adding attr selected in Brand
						$.each(autoDrpDown.cacheOptBrands[0], function (k, val) {
							if ($(val).attr("value") == selectedBrand) {
								opt += $(val).attr('selected', 'selected')[0].outerHTML;
							}
							opt += val;
						});
						return opt;
					};

					var opt_model = function (selectedModel) {
						var opt = '';
						//adding attr selected in Model
						$.each(autoDrpDownInvnt.cacheOptModel[0], function (k, val) {
							if ($(val).attr("value") == selectedModel) {
								opt += $(val).attr('selected', 'selected')[0].outerHTML;
							}
							opt += val;
						});
						return opt;
					};

					$("#hdnIdCurrentMrf").val(fetch_data.id); //Hidden main ID
					$(".hdnAttachmentName").val(fetch_data.attachment); //Hidden attachment name
					$(".form-no #form-code").text(fetch_data.form_no); //form_no
					$(".post-list-attachment").html(fileUpload.postListFiles(fetch_data.attachment, true)); //Display files.

					//Step 1 Form	
					$.each(fetch_data.res_row_data_s1, function (i, val) { //IN PROGRESS Display Serials.
						if (i == 0) {
							$("#tbl_frm_component_1 tbody tr").eq(0).attr('data-mrf-s1', val.id);
							$("#s1_quantity").val(val.s1_quantity);
							$("#s1_brand").val(val.s1_id_brand).trigger('chosen:updated');
							$("#s1_id_model").val(val.s1_id_model).trigger('chosen:updated');
							$("#s1_bn_rf").val(val.s1_bn_rf);
							$("#s1_serialnum").val(val.s1_serialnum);
							$("#s1_accessories").val(val.s1_accessories);
						} else {
							step_one += "<tr data-mrf-s1=" + val.id + " data-row-num='parentRow-" + (randomNum()) + "'>";
							step_one += '<td><input type="text" id="s1_quantity" disabled="disabled" class="s1_quantity mrf-material frm-s1 not-full-width" value="' + val.s1_quantity + '" name="s1_quantity" style="width: 50px" /></td>' +
								'<td><select id="s1_brand" class="s1_brand frm-s1 chosen-select" name="s1_brand" data-s1-brand-row=' + (i + 1) + '>' + opt_brand(val.s1_id_brand) + '</select></td>' +
								'<td><select id="s1_id_model" class="s1_id_model frm-s1 chosen-select s1_model_row_' + (i + 1) + '" name="s1_id_model" >' + opt_model(val.s1_id_model) + '</select></td>' +
								'<td><select id="s1_bn_rf" class="mrf-material s1_bn_rf frm-s1" name="s1_bn_rf">' +
								'<option value="">---</option>' +
								'<option value="1" ' + (val.s1_bn_rf == 1 ? "selected" : "") + '>Brand New (BN)</option>' +
								'<option value="2" ' + (val.s1_bn_rf == 2 ? "selected" : "") + '>Refurbished (RF)</option>' +
								'</select></td>' +
								'<td><input type="text" class="mrf-material" id="s1_accessories" name="s1_accessories" value="' + val.s1_accessories + '"></td>' +
								'<td><button type="button" onClick="dtCurrentMrf.getTrIndexSerial(this)" class="btn btn-flat btn-success btn-xs btn_s1_add_toner" title="Add Serial Number" data-toggle="modal" data-target="#modalS1Serial">+</button>' +
								'<input type="hidden" id="s1_serialnum" class="s1_serialnum mrf-material frm-s1 validate-hidden-text" name="s1_serialnum" value="' + val.s1_serialnum + '"/> ' +
								'</td>' +
								'<td><button type="button" onClick="dtCurrentMrf.getTrIndex(this)" class="btn btn-flat btn-success btn-xs btn_s1_add_toner" title="Add Toner" data-toggle="modal" data-target="#modalS1Toner">+</button>' +
								'<input type="hidden" id="s1_toner" class="s1_toner validate-hidden-text" name="s1_toner" value=""/></td>' +
								'<td><button type="button" title="Delete" class="btn btn-flat btn-danger btn-xs delete_row">X</button></td>';
							step_one += '</tr>';

						}

						//Render sub Table Serials.
						step_one += '<tr class="subRowSerial">';
						step_one += self.dtCurrentMrf.buildSubRowSerial((val.s1_serialnum ? val.s1_serialnum.split(",") : 0));
						step_one += '</tr>';

						//Render sub table Toner.
						step_one += "<tr class='subRow'><td colspan='8'><table class='subTableStyle'><thead><tr><th colspan='8'>Toner</th></tr><tr><th>Quantity</th><th>Mono/Colored</th><th>Toner Model</th><th>Unit Price</th><th>Yield</th><th>Total</th><th>Type</th><th>Rate</th></tr></thead><tbody>";
						if (fetch_data.res_row_data_s1_toner != null) {

							$.each(fetch_data.res_row_data_s1_toner_sub[val.id], function (i, val) {
								step_one += '<tr>';
								step_one += '<td>' + val.s1_toner_qty + '</td>' +
									'<td>' + val.type_name + '</td>' +
									'<td>' + val.s1_toner_model + '</td>' +
									'<td>' + val.s1_toner_price + '</td>' +
									'<td>' + val.s1_toner_yield + '</td>' +
									'<td>' + val.s1_toner_total + '</td>' +
									'<td class="capitalizeText">' + val.s1_billing_type + '</td>' +
									'<td>' + val.s1_toner_rate + '</td>';
								step_one += '</tr>';
							});
						}
						step_one += "</tbody></table></td></tr>";
					});


					var tbl_one = document.querySelector("#tbl_frm_component_1 tbody tr.not-tr");
					tbl_one.insertAdjacentHTML("afterend", step_one);
					// $("#tbl_frm_component_1 tbody").append(step_one);
					// self.dtCurrentMrf.showModelByBrand(".s1_brand","s1-brand-row",".s1_model_row_");


					var trMergeUpdateInsertText = [];
					//Step 1 Toner - attaching arbitrary data in each TR. //HAVE BUG for fixing.
					$.each(fetch_data.res_row_data_s1_toner, function (i, val) {
						var getTableValues = { update: {}, insert: [] };

						$("#tbl_frm_component_1 tbody tr").each(function (iElem, valElem) {
							var trId = $(this).attr('data-mrf-s1');

							if (i == trId) {
								getTableValues.update = val;
								$(this).data('toner-values', getTableValues);
								$(this).find('.s1_toner').val((!jQuery.isEmptyObject(val) ? 1 : ''));
							}
						});

					});

					//Step 2 Form 
					if (fetch_data.res_row_data_s2.length > 0) {
						$.each(fetch_data.res_row_data_s2, function (i, val) {
							if (i == 0) {
								$("#tbl_frm_component_2 tbody tr").eq(0).attr('data-mrf-s2', val.s2_id);
								$(".s2_id_brand").val(val.s2_id_brand).trigger('chosen:updated');
								$(".s2_id_model").val(val.s2_id_model).trigger('chosen:updated');
								$(".s2_serialnum").val(val.s2_serialnum);
								$(".s2_contact_p").val(val.s2_contact_p);
								$(".s2_dept_branch").val(val.s2_dept_branch);
							} else {
								step_two += "<tr data-mrf-s2=" + val.s2_id + " data-row-num='parentRow-" + (randomNum()) + "'>";
								step_two += '<td><select id="s2_id_brand" class="s2_id_brand frm-s1 chosen-select" name="s2_id_brand" data-s2-brand-row=' + (i + 1) + '>' + opt_brand(val.s2_id_brand) + '</select></td>' +
									'<td><select id="s2_id_model" class="s2_id_model frm-s1 chosen-select s2_model_row_' + (i + 1) + '" name="s2_id_model">' + opt_model(val.s2_id_model) + '</select></td>' +
									'<td><input type="text" class="mrf-material" id="s2_serialnum" name="s2_serialnum" value="' + val.s2_serialnum + '"></td>' +
									'<td><input type="text" class="mrf-material" id="s2_contact_p" name="s2_contact_p" value="' + val.s2_contact_p + '"></td>' +
									'<td><input type="text" class="mrf-material" id="s2_dept_branch" name="s2_dept_branch" value="' + val.s2_dept_branch + '"></td>' +
									'<td><button type="button" title="Delete" class="btn btn-flat btn-danger btn-xs delete_row">X</button></td>';
								step_two += "</tr>";
							}
						});
						var tbl_two = document.querySelector("#tbl_frm_component_2 tbody tr.not-tr");
						tbl_two.insertAdjacentHTML("afterend", step_two);
						// $("#tbl_frm_component_2 tbody").append(step_two);
						// self.dtCurrentMrf.showModelByBrand(".s2_id_brand","s2-brand-row",".s2_model_row_");

					}
					//Step 2 radio button
					var s2_radio_id = fetch_data.s2_radio_id;
					if (s2_radio_id > 0) { //Get only the first value of s2_radio_id.
						$(".form-component-2 .section-one input[type=radio][value='" + s2_radio_id + "'").prop('checked', true);
						if (parseInt(fetch_data.s2_radio_nodays, 10) > 0 && s2_radio_id == 3) {
							$("#txtDemoRental").val(fetch_data.s2_radio_nodays).prop('disabled', false);
						}
						else {
							$("#txtDemoRental").prop('disabled', true);
						}

						if (fetch_data.s2_radio_others != '' && s2_radio_id == 4) {
							$("#txtOthers").val(fetch_data.s2_radio_others).prop('disabled', false);
						}
						else {
							$("#txtOthers").prop('disabled', true);
						}
					}
					//Step 2 Form
					if (fetch_data.s3_id_purpose > 0) {
						$(".form-component-2 .section-two input[type=radio][value='" + fetch_data.s3_id_purpose + "'").prop('checked', true);
					}

					//Step 3 Form
					$("#dateRequest").val(fetch_data.date_requested);
					$("#txtCompany").val(fetch_data.company_name).attr('data-value', fetch_data.id_company);
					$("#txtShipTo").val(fetch_data.ship_to);
					$("#txtBillTo").val(fetch_data.bill_to);
					$("#txtContactPerson").val(fetch_data.contact_person);
					$("#txtDepartment").val(fetch_data.department);
					$("#txtTelNo").val(fetch_data.tel_no);
					$("#slctBranchRequest").val(fetch_data.id_branch).prop('disabled', true);

					//Attachment 
					// if(fetch_data.attachment != ""){
					// 	$("#download").show();
					// 	$("#download-message-error").hide();
					// }else{
					// 	$("#download-message-error").show();
					// 	$("#download").hide();
					// }
				},
				error: function (xhr, status) { alert("Something went wrong!"); },
				complete: function () {
					self.dtCurrentMrf.autoComplete(); //Execute the auto-suggest.

					$(".s1_brand, .s1_id_model, .s2_id_brand, .s2_id_model").chosen({ no_results_text: "No records found.", width: '100%', search_contains: true });
					$btn.button('reset');
				}
			});
		}
		else { alert('ID is empty'); }
		return this;
	},
	showModelByBrand: function (elemBrand, attrBrandRow, elemModelRow) {
		//Dynamically show the list of model by brand selected.
		$(elemBrand).change(function () {
			var select_brand = $(this).val() || null;
			var brand_row = $(this).data(attrBrandRow);
			var model_row = elemModelRow + brand_row;

			if (select_brand != null) {
				$.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets + 'php/misc/inventory_misc.php',
					data: { action: 'model_by_brand', id_brand: select_brand },
					beforeSend: function () {
						$(model_row).val(0).trigger('chosen:updated'); //Disabled and reset the value.
						// $(model_row +" option").hide().trigger('chosen:updated'); 
						// $(model_row).val(''); // Clear category and type.
					},
					success: function (data) {
						$(model_row + " option").hide().trigger('chosen:updated');
						if (data.aaData[0].id_model != null) {
							var arr_brand = convertArrStrToInt(data.aaData[0].id_model);
							var i = 0;
							for (i = 0; i < arr_brand.length; i++) {
								$(model_row).prop('disabled', false).trigger('chosen:updated');
								$(model_row + " option[value='" + arr_brand[i] + "']").show().trigger('chosen:updated');
							}
						}
					},
					error: function (xhr, status) { alert(xhr + status); }
				});
			} else {
				$(model_row).prop('disabled', true).val(0).trigger('chosen:updated');
			}
		});
		return this;
	},
	autoComplete: function () {
		$("#txtCompany").autocomplete({
			dropdownWidth: '100%',
			appendMethod: 'replace',
			valid: function () {
				return true;
			},
			source: [
				function (qs, add) {
					if (qs != '') {
						$.getJSON(assets + "php/mrf/misc/getCompanyList.php?search=notall&company_name=" + encodeURIComponent(qs), function (resp) {
							add(resp);
							//    if(resp[0].company_name == "NOT FOUND!"){
							//    	$("#txtCompany").attr('data-value',resp[0].id);
							// }
						});
					}
					return null;
				}
			],
			getTitle: function (item) {
				return item.company_name;
			},
			getValue: function (item) {
				return item.company_name;
			},
		}).on('selected.xdsoft', function (e, data) {
			$(this).attr('data-value', data.id); //Attach company id in the input field.
			$("#txtShipTo").val(data.address);
			$("#txtBillTo").val(data.address);
		});


		$(window).on('resize', function () { //Back to original state of width.
			$(".form-component-3 .xdsoft_autocomplete ").css({ 'width': '100%' });
		});

		return this;
	},
	actions: function () {
		$("#currentMrfList").on('click', 'button, a', function (e) {
			e.preventDefault();
			var inst = $(this);
			var button_label = inst.text().toLowerCase();

			//Highlight row selected.
			if (!inst.closest('tr').hasClass('selected')) {
				self.dtCurrentMrf.dtInstance.$('tr.selected').removeClass('selected');
				inst.closest('tr').addClass('selected');
			}
			//Search button
			if (button_label == "search") {
				self.dtCurrentMrf.dtInstance.ajax.reload(null, true);
			}
			//Reset button
			if (button_label == "reset") {
				$("#dthead-search-mrf input[type='text'], #search-for-approver").val('');  //Clear all values;
				self.dtCurrentMrf.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
			}
			//Edit button  //FOR DEVELOPMENT.
			if (button_label == "edit") {
				$("#modalFormCurrentMrf .modal-title").text('Edit Machine Request');
				$("#btn_cancel, #download").show(); //Show button Cancel request if Editing entry.
				var idmrf = $(this).data('mrf');
				self.dtCurrentMrf.getData(idmrf);
			}
			//View Button
			if (button_label == "view") {
				var idview = $(this).data('mrf');
				self.dtCurrentMrf.getDataViewRequestForm(idview);
			}
			//Comments Button
			if (button_label == "comments") {
				var id_mrf = $(this).data('mrf');
				var id_user = Cookies.get('user_id');
				$("#hdnIdMRF").val(id_mrf);
				comment.display(id_mrf, id_user);
			}

		});
		return this;
	},
	g_form_no: function () {
		var form_no = '';
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: assets + 'php/mrf/misc/generateFormNo.php',
			async: false,
			cache: false,
			success: function (data, status, xhr) {
				form_no = data[0];
			},
			error: function () {
				alert("Something went wrong!");
			}
		});
		return form_no;
	},
	getTableRowDeleteId: function (objData) {
		var $self = this;
		var i = 0;
		$(objData.elemTable).on('click', '.delete_row', function (e) { //Event handler to delete a table row.
			e.preventDefault();

			//Attach arbitrary deleted Ids in this element.  
			var attrTr = objData.attrTr || '';
			var delete_id = $(this).closest('tr').data(attrTr);


			if (objData.elemTable == "#tbl_frm_component_1") {
				if (delete_id != '' && delete_id != undefined) {
					$self.tableValuesDeleteS1.push(delete_id);
				}
				$(objData.elemTable).data('del-id', $self.tableValuesDeleteS1);//Attach arbitrary data in this table element.
			}
			if (objData.elemTable == "#tbl_frm_component_2") {
				if (delete_id != '' && delete_id != undefined) {
					$self.tableValuesDeleteS2.push(delete_id);
				}
				$(objData.elemTable).data('del-id', $self.tableValuesDeleteS2);//Attach arbitrary data in this table element.
			}
			if (objData.elemTable == "#tbl_frm_s1_toner") {
				if (delete_id != '' && delete_id != undefined) {
					$self.tableValuesDeleteToner.push(delete_id);
				}
				$(objData.elemTable).data('del-id', $self.tableValuesDeleteToner);//Attach arbitrary data in this table element.
			}
		});

		return this;
	},
	getDataViewRequestForm: function (id) {
		if (id != '' && id != undefined) {
			var step_one, step_two;
			var no_data = "<tr ><td colspan='6'><div class='text-center'><span class='label label-info text-center'>No data available in table.</span></div></td></tr>";
			var app_action = JSON.parse(Cookies.get('app_module_action'));
			var id_user_logged = Cookies.get("user_id");
			var user_type = Cookies.get('user_type');
			$.ajax({
				type: 'POST',
				url: assets + 'php/mrf/mrf.php',
				data: { action: 'view-toner-details', id_mrf: id, id_user: id_user_logged },
				dataType: 'json',
				cache: false,
				// async: false,
				beforeSend: function () {
					step_one = " ";
					step_two = " ";
					$(".view-loader").show();
				},
				success: function (data, xhr, status) {
					var view_data = data.aaData[0];

					$(".hdnAttachmentName").val(view_data.attachment);
					$(".post-list-attachment").html(fileUpload.postListFiles(view_data.attachment, true)); //Display files.
					$("#hdnIdCurrentViewMrf").val(view_data.id); //Hidden main ID
					$("#hdnIdBranchCurrentViewMrf").val(view_data.id_branch); //Hidden main ID branch
					$(".form-no #form-code").text(view_data.form_no); //form_no
					$("#requestedBy span").text(view_data.requested_by);

					//Step 1 Form	
					var qty;
					if (view_data.res_row_data_s1.length > 0) {
						$.each(view_data.res_row_data_s1, function (i, val) {

							qty = (val.s1_quantity > 0 ? val.s1_quantity : val.s1_serialnum.split(',').length);
							step_one += '<tr data-mrf-s1=' + val.id + ' class="parentRow" data-toner-values=' + (view_data.res_row_data_s1_toner[val.id] ? encodeURIComponent(JSON.stringify(view_data.res_row_data_s1_toner[val.id])) : "") + '>';
							step_one += '<td rowspan="3" class="first">' + (i + 1) + '</td>' +
								'<td>' + qty + '</td>' +
								'<td>' + val.brand_name + '</td>' +
								'<td>' + val.model_name + '</td>' +
								'<td>' + val.bn_rf + '</td>' +
								'<td>' + val.s1_accessories + '</td>';
							step_one += '</tr>';

							//Render sub Table Serials.
							step_one += '<tr class="subRowSerial">';
							step_one += self.dtCurrentMrf.buildSubRowSerial((val.s1_serialnum ? val.s1_serialnum.split(",") : 0));
							step_one += '</tr>';

							//Render sub table Toner.
							step_one += "<tr><td colspan='8'><table class='subTableStyle'><thead><tr><th colspan='8'>Toner</th></tr><tr><th>Quantity</th><th>Mono/Colored</th><th>Toner Model</th><th>Unit Price</th><th>Yield</th><th>Total</th><th>Type</th><th>Rate</th></tr></thead><tbody>";
							if (view_data.res_row_data_s1_toner_sub != null) {

								$.each(view_data.res_row_data_s1_toner_sub[val.id], function (i, val) {
									step_one += '<tr>';
									step_one += '<td>' + val.s1_toner_qty + '</td>' +
										'<td>' + val.type_name + '</td>' +
										'<td>' + val.s1_toner_model + '</td>' +
										'<td>' + val.s1_toner_price + '</td>' +
										'<td>' + val.s1_toner_yield + '</td>' +
										'<td>' + val.s1_toner_total + '</td>' +
										'<td class="capitalizeText">' + val.s1_billing_type + '</td>' +
										'<td>' + val.s1_toner_rate + '</td>';
									step_one += '</tr>';
								});
							} else {

								step_one += '<tr>';
								step_one += '<td colspan="8"><div class="text-center"><span class="label label-info">No data available in table.</span></div></td>';
								step_one += '</tr>';
							}
							step_one += "</tbody></table></td></tr>";
						});

					} else {
						step_one += no_data;
					}
					$("#tbl_view_frm_component_1 tbody").append(step_one);

					//Step 2 Form 
					var view_s2_radio = view_data.s2_radio_id;
					if (view_s2_radio > 0) { //Get only the first value of s2_radio_id.
						$(".view-step-2 input[type=radio][value='" + view_s2_radio + "']").prop('checked', true);
						if (view_data.s2_radio_nodays > 0 && view_s2_radio == 3) {
							$("#no_of_days").text(view_data.s2_radio_nodays).show();
						} else {
							$("#no_of_days").hide();
						}

						if (view_data.s2_radio_others != '' && view_s2_radio == 4) {
							$("#view_others").text(view_data.s2_radio_others).show();
						} else {
							$("#view_others").hide();
						}
					}
					if (view_data.res_row_data_s2.length > 0) {
						$.each(view_data.res_row_data_s2, function (i, val) {
							step_two += "<tr>";
							step_two += '<td>' + val.brand_name + '</td>' +
								'<td>' + val.model_name + '</td>' +
								'<td>' + val.s2_serialnum + '</td>' +
								'<td>' + val.s2_contact_p + '</td>' +
								'<td>' + val.s2_dept_branch + '</td>';
							step_two += "</tr>";
						});

					} else {
						step_two += no_data;
					}
					$("#tbl_view_frm_component_2 tbody").append(step_two);

					//Step 3 Form
					if (view_data.s3_id_purpose > 0) {
						$(".view-step-3 input[type=radio][value='" + view_data.s3_id_purpose + "']").prop('checked', true);
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
					$.each(view_data.is_approver[0], function (i, val) {
						if (val == id_user_logged && app_action.action_mrf == "wr") {
							$("#tab-form-approve table .tfoot_" + i).show();
							$("#tab-form-approve table tfoot button[name=" + i + "]").show();
							$("#modalFormCurrentViewMrf .modal-footer button[name=" + i + "]").show();
						}
						else {
							//$("#tab-form-approve table .tfoot_"+i).hide();
							$("#tab-form-approve table tfoot button[name=" + i + "]").hide();
							$("#modalFormCurrentViewMrf .modal-footer button[name=" + i + "]").hide();
						}
					});

					//Display name of user already approved.
					if (view_data.user_approved.length > 0) {
						var tfoot_selector = [];
						$.each(view_data.user_approved, function (i, val) {

							if (val["1st_approver"] != "") // push value that has a name.
								tfoot_selector.push("#tab-form-approve table > tfoot button[name=1st_approver]");
							if (val["2nd_approver"] != "")
								tfoot_selector.push("#tab-form-approve table > tfoot button[name=2nd_approver], #tab-form-approve table > tfoot button[name=2nd_approver_2], #details_approver_2_btn button[name=2nd_approver], #details_approver_2_btn button[name=2nd_approver_2]");
							if (val["3rd_approver"] != "")
								tfoot_selector.push("#tab-form-approve table > tfoot button[name=3rd_approver]");
							if (val["4th_approver"] != "")
								tfoot_selector.push("#tab-form-approve table > tfoot button[name=4th_approver], #tab-form-approve table > tfoot button[name=4th_approver_2]");
							if (val["5th_approver"] != "")
								tfoot_selector.push("#tab-form-approve table > tfoot button[name=5th_approver], #tab-form-approve table > tfoot button[name=5th_approver_2]");

							if (val["4th_approver"] != "" && user_type == 6) // 6 = accounting, Show/edit button edit
								$("#btn_edit_acc").show();
							else
								$("#btn_edit_acc").hide();

							$("#1st_approve_name").text(val["1st_approver"]);
							$("#1st_approve_date").text(val["1st_date"]);
							$("#2nd_approve_name").text(val["2nd_approver"]);
							$("#2nd_approve_date").text(val["2nd_date"]);
							$("#3rd_approve_name").text(val["3rd_approver"]);
							$("#3rd_approve_date").text(val["3rd_date"]);
							$("#4th_approve_name").text(val["4th_approver"]);
							$("#4th_approve_date").text(val["4th_date"]);
							$("#4th_dr_number").val(val["4th_dr_number"]);
							$("#4th_edr_number").val(val["4th_edr_number"]);
							$("#4th_inv_number").val(val["4th_inv_number"]);
							$("#5th_approve_name").text(val["5th_approver"]);
							$("#5th_approve_date").text(val["5th_date"]);
							$("#5th_delivery_date").val(val["5th_delivery_date"])
						});

						if (tfoot_selector.length > 0)//Hide buttons elements already approved
							$(tfoot_selector.join(",")).hide();
					}

					//Show/Hide upload attachment if not executive.
					if (user_type > 1 || app_action.action_mrf == "r") {
						$(".view-attachment-upload-container, .remove-attachment").remove();
					}

					//Display editing SerialNumber if user type is Engineering.
					var edit_sn = "";
					if (view_data.res_row_data_s1.length > 0 && user_type == 5 && app_action.action_mrf == "wr") { // 5 = Engineering
						$.each(view_data.res_row_data_s1, function (i, val) {
							var serial = val.s1_serialnum.split(",");

							edit_sn += "<tr data-id-edit-sn=" + val.id + ">";
							edit_sn += '<td>' + serial.length + '</td>' +
								'<td>' + val.brand_name + '</td>' +
								'<td>' + val.model_name + '</td>' +
								'<td>' + val.bn_rf + '</td>';

							edit_sn += '<td data-row="serial">';
							$.each(serial, function (_i, _val) {
								edit_sn += '<input type="text" class="mrf-material frm-s1 s1_serialnum" name="s1_serialnum" value="' + _val + '">';
							});
							edit_sn += '</td>';

							edit_sn += "</tr>";

						});
					} else {
						edit_sn += no_data;
					}
					$("#edit-table-sn tbody").html(edit_sn);

					if (user_type == 5) { // 5 = Engineering, if not equal to 5 not display edit form sn.
						$(".container-edit-sn").show();
					}
					else {
						$(".container-edit-sn").hide();
					}

					// History
					var history = "";
					if (view_data.res_history.length > 0) {
						$.each(view_data.res_history, function (i, val) {
							history += '<div class="history-list">' +
								'<p><span class="col-md-2 clear-left">Remarks: </span><span class="badge badge-' + (val.remarks == 'returned' ? 'green' : 'orange') + ' history-remarks">' + val.remarks + '</span></p>' +
								'<p><span class="col-md-2 clear-left">DateTime: </span><span class="history-date">' + val.date_created + '</span></p>' +
								'<p><span class="col-md-2 clear-left">S/N: </span><span class=" history-sn">' + val.serial_num + '</span></p></div>';
						});
					}
					else {
						history = "<div style='text-align:center'>No data available.</div>";
					}
					$(".history").html(history);

					//Comments
					if (app_action.action_mrf == 'r') {
						$(".btn-current-comment-mrf").remove();
					} else {
						var EXEC_ID = [1, 43]; //Executive user id
						var no_received_message = view_data.res_comments[0].no_received_message;
						var idUserFrom = (view_data.res_comments[0].user_from != 0 ? convertArrStrToInt(view_data.res_comments[0].user_from) : 0);
						var buttonColor = "";
						if (no_received_message > 0 && idUserFrom != 0 && (idUserFrom.indexOf(EXEC_ID[0]) >= 0 || idUserFrom.indexOf(EXEC_ID[1]) >= 0)) { //indexOf, return -1 if not found else return index value.
							buttonColor = 'btn-danger'; // If comment from executive.

						} else if (no_received_message > 0 && idUserFrom != 0 && (idUserFrom.indexOf(EXEC_ID[0]) == -1 || idUserFrom.indexOf(EXEC_ID[1]) == -1)) {
							buttonColor = 'btn-warning';// If comment not from executive.
						}
						else {
							buttonColor = 'btn-info'; //Default for empty comments.
						}
						$(".btn-current-comment-mrf").removeClass('btn-info btn-danger btn-warning').addClass(buttonColor);
					}

				},
				complete: function () { $(".view-loader").hide(); },
				error: function (xhr, status) { alert("Something went wrong!"); }
			});
		}
		else { alert('ID is empty'); }
		return this;
	},
	updateAttachmentViewRequestForm: function (btnElem) {
		// var $btn     = $("button[type='submit']");
		var files = $("#attachment-view")[0].files;
		var id_mrf = $("#hdnIdCurrentViewMrf").val() || '';
		var file_name = $(".hdnAttachmentName").val() || '';
		if (files.length > 0) {
			btnElem.button('loading'); //disabled button upload.  			    			
			fileUpload.upload(files, { action: "update_files", file_name: file_name }, function () { //File attachment with callback updating data.
				var status = arguments[0].attachment_status || '';
				var message = arguments[0].attachment_message || '';

				if (status == 'true') {

					var attachment_name = arguments[0].attachment_uploaded || '';
					var data = { action: 'update_view_request', id_mrf: id_mrf, attachment_name: attachment_name };

					if (id_mrf != '') {

						$.ajax({
							type: 'POST',
							url: assets + 'php/mrf/mrf.php',
							data: data,
							dataType: 'json',
							success: function (data, xhr, status) {
								resetForm("#frmViewAttachment");
								promptMSG('success-update', 'Machine Request', null, null, true, true);
								$(".hdnAttachmentName").val(attachment_name);
								$(".post-list-attachment").html(fileUpload.postListFiles(attachment_name, true));
							},
							error: function (xhr, status) { alert("Something went wrong!"); },
							complete: function () { btnElem.button('reset'); }
						});
					}
					else { alert('ID is empty'); }
				}
				else {
					alert(message);
				}
			});
		}
		else {
			promptMSG('warning', 'No files selected.');
			$('.mif-modalPromptMSG').on('hidden.bs.modal', function () {//Hide modal Remove Machine.
				$("body").addClass('modal-open');
			});

		}
		return false;
	},
	update_status: function (_thisElem) { //Approve and Disapprove
		var _this = $(_thisElem);
		var id_status = _this.data('id-status');
		var btn_label = _this.text() || '';
		var field_name = _this.attr('name');
		var dr_number = $("#4th_dr_number").val();
		var edr_number = $("#4th_edr_number").val();
		var inv_number = $("#4th_inv_number").val();
		var delivery_date = $("#5th_delivery_date").val();
		var received_by = $("#5th_received_by").val();
		var delivered_by = $("#5th_delivered_by").val();
		var form_no = $("#form-code").text();
		var radio_btn_s2 = $(".radioBtn-group-c2:checked").val();
		if (radio_btn_s2 == 2) { //Trap the previous entry if has (2) value which necessarily update to specific option.
			promptMSG("warning", "Sorry, can\'t Disapprove/Approve request. Please ask requestor to update machine is <strong>FOR UPGRADE or REPLACE</strong> unit.", '', null, false, true);
			return false;
		}
		if ((field_name == '4th_approver' || field_name == '4th_approver_2') && !dr_number) { //Validate if 4th approver not fill the DR number there is prompt message.
			alert('DR Number is required');
			return false;
		}
		if ((field_name == '5th_approver' || field_name == '5th_approver_2') && (!delivery_date || !received_by || !delivered_by)) { //Validate if 4th approver not fill the DR number there is prompt message.
			alert('Delivery Date/ Received by/ Delivered by is required.');
			return false;
		}
		promptMSG("custom", "Are you sure you want to <strong>" + _this.text() + "</strong> this request?", "Confirmation", "yn", false, true, function () {
			var id_user_logged = Cookies.get('user_id');
			var id_mrf = $("#hdnIdCurrentViewMrf").val();
			var branch = $("#hdnIdBranchCurrentViewMrf").val();
			var $btn = $('button[name*="approver"]');
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: { action: 'update_status', id_user_logged: id_user_logged, id_mrf: id_mrf, branch: branch, id_status: id_status, field_name: field_name, dr_number: dr_number, edr_number: edr_number, inv_number: inv_number, delivery_date: delivery_date, form_no: form_no, received_by: received_by, delivered_by: delivered_by },
				url: assets + 'php/mrf/mrf.php',
				beforeSend: function () {
					$btn.button('loading');
					$(".mif-modalPromptMSG").modal('hide');
				},
				success: function (data, xhr) {
					setTimeout(function () {
						if (data.aaData.result == 'true') {
							promptMSG("success-custom", "Machine Request has been successfully <strong>" + btn_label + "</strong>", '', null, false, true);
							$('.mif-modalPromptMSG').on('click', 'button', function () {//Hide modal Remove Machine.
								$('#modalFormCurrentViewMrf').modal('hide');
							});
							self.dtCurrentMrf.getDataViewRequestForm(id_mrf); // Refresh the View Details Form.
							self.dtCurrentMrf.dtInstance.ajax.reload(null, true); //Refresh the page
						} else {
							promptMSG("custom", data.aaData.message, "Warning!", null, false, true);
						}
					}, 300);
				},
				complete: function () {
					$btn.button('reset');
				}
			});

		});

		return this;
	},
	edit_engr: function (id_mrf, elemBtn) {
		var row_data_sn = { update: {} };

		//Get the table row data through loop.
		$("#edit-table-sn tbody tr").each(function (i, $val) {
			var snArr = {};
			var id = $(this).closest('tr').attr('data-id-edit-sn');
			var snStr = $(this).find("td[data-row^='serial'] input[name='s1_serialnum']").map(
				function () {
					if ($(this).val() != '') {
						return $(this).val()
					}
				}).get().join(',');

			snArr["s1_serialnum"] = snStr;
			row_data_sn.update[id] = snArr;
		});

		if (Object.keys(row_data_sn.update).length > 0) {

			var id_mrf = id_mrf;
			var $btn = $(elemBtn);
			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: { action: 'edit_approve_data', action_approver: 'engr', id_mrf: id_mrf, row_data_sn: row_data_sn },
				url: assets + 'php/mrf/mrf.php',
				beforeSend: function () {
					$btn.button('loading');
				},
				success: function (data, xhr) {
					promptMSG('success-update', 'Serial Number', null, null, true, true);
				},
				complete: function () {
					$btn.button('reset');
				}
			});
		}
		else {
			alert("Something went wrong.");
		}


		return this;
	},
	edit_acc: function (id_mrf, elemBtn) {
		var id_mrf = id_mrf;
		var dr_num = $("#4th_dr_number").val();
		if (!dr_num) {
			alert('DR Number is required');
			return false;
		}
		var edr_num = $("#4th_edr_number").val();
		var inv_num = $("#4th_inv_number").val();
		var $btn = $(elemBtn);
		$.ajax({
			type: 'POST',
			dataType: 'json',
			data: { action: 'edit_approve_data', action_approver: 'acc', id_mrf: id_mrf, dr_num: dr_num, edr_num: edr_num, inv_num: inv_num },
			url: assets + 'php/mrf/mrf.php',
			beforeSend: function () {
				$btn.button('loading');
			},
			success: function (data, xhr) {
				promptMSG('success-update', 'DR #/ EDR #/ INV #', null, null, true, true);
			},
			complete: function () {
				$btn.button('reset');
			}
		});

		return this;
	},
	update_cancel: function () {
		$("#btn_cancel").click(function () {
			var btn_label = $(this).val() || '';

			promptMSG("custom", "Are you sure you want to <strong>" + btn_label + "</strong>?", "Confirmation", "yn", false, true, function () {
				var id_mrf = $("#hdnIdCurrentMrf").val() || '';
				if (id_mrf != '') {
					$.ajax({
						type: 'POST',
						dataType: 'json',
						data: { action: 'update_cancel', id_mrf: id_mrf },
						url: assets + 'php/mrf/mrf.php',
						async: false,
						beforeSend: function () {
							$("#modalFormCurrentMrf").modal("hide");
							$(".mif-modalPromptMSG").modal("hide");
						},
						success: function (data, xhr) {
							setTimeout(function () {
								if (data.aaData.result == 'true') {
									promptMSG("success-custom", data.aaData.message);
									self.dtCurrentMrf.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
								} else {
									promptMSG("custom", data.aaData.message, "Warning!");
								}
							}, 300);

						},

					});
				}
				else {
					alert('ID form is empty.');
				}

			});
		});

		return this;
	},
	attachTableTonerData: function (id) { //HAVE BUG for fixing.
		var ids = id;
		// ids = parseInt(ids);
		// var row_index = null;
		var s1_row_toner_data = getTableRowValue({
			elemTable: "#tbl_frm_s1_toner", trAttr: 'mrf-s1-toner', selectorInput: "input, select", inputElem: [{ name: "s1_toner_qty", getValueByChosen: false },
			{ name: "s1_toner_monocolor", getValueByChosen: false }, { name: "s1_toner_model", getValueByChosen: false }, { name: "s1_toner_price", getValueByChosen: false }, { name: "s1_toner_yield", getValueByChosen: false },
			{ name: "s1_toner_total", getValueByChosen: false }, { name: "s1_toner_type", getValueByChosen: false }, { name: "s1_toner_rate", getValueByChosen: false }]
		});
		var s1_row_toner_text = getTableRowText({
			elemTable: "#tbl_frm_s1_toner", trAttr: 'mrf-s1-toner', selectorInput: "input, select", inputElem: [{ name: "s1_toner_qty", getValueByChosen: false },
			{ name: "s1_toner_monocolor", getValueByChosen: false }, { name: "s1_toner_model", getValueByChosen: false }, { name: "s1_toner_price", getValueByChosen: false }, { name: "s1_toner_yield", getValueByChosen: false },
			{ name: "s1_toner_total", getValueByChosen: false }, { name: "s1_toner_type", getValueByChosen: false }, { name: "s1_toner_rate", getValueByChosen: false }]
		});
		//Set Hidden toner value to 1 if not empty.
		if (s1_row_toner_data.insert.length > 0 || !jQuery.isEmptyObject(s1_row_toner_data.update)) {
			$("#tbl_frm_component_1 tbody tr[data-row-num^='" + ids + "'] .s1_toner").val(1);
		}
		else {
			$("#tbl_frm_component_1 tbody tr[data-row-num^='" + ids + "'] .s1_toner").val('');
		}
		//Attaching the table toner data in step 1 Table TR as arbitrary data.
		$("#tbl_frm_component_1 tbody tr[data-row-num^='" + ids + "']").data('toner-values', s1_row_toner_data);

		var trMergeUpdateInsertText = [];
		//Merged two objects in array.
		if (!jQuery.isEmptyObject(s1_row_toner_text.update)) {
			$.each(s1_row_toner_text.update, function (i, valUp) {
				trMergeUpdateInsertText.push(valUp);
			});
		}
		if (s1_row_toner_text.insert.length > 0) {
			$.each(s1_row_toner_text.insert, function (i, valIn) {
				trMergeUpdateInsertText.push(valIn);
			});
		}

		$("#tbl_frm_component_1 tbody tr[data-row-num^='" + ids + "']").next('tr').next('.subRow').html(self.dtCurrentMrf.buildSubRow(["Quantity", "Mono/Colored", "Toner Model", "Unit Price", "Yield", "Total", "Type", "Rate"], trMergeUpdateInsertText, 'Toner'));
		return this;
	},
	buildSubRow: function (tblColumns, tblData, tblName) {
		var colName = tblColumns;
		var data = tblData;
		if (data != null) {
			var subTable = document.createElement("table");
			var thead = document.createElement("thead");
			var tbody = document.createElement("tbody");
			var headRow = document.createElement("tr");
			var headRowspan = document.createElement("tr");
			var thspan = document.createElement("th");
			// var tfoot  = document.createElement('tfoot');
			subTable.className = "subTableStyle";
			colName.forEach(function (el) {
				var th = document.createElement("th");
				th.appendChild(document.createTextNode(el));
				headRow.appendChild(th);

			});
			thspan.appendChild(document.createTextNode(tblName));
			thspan.setAttribute('colspan', colName.length);

			headRowspan.appendChild(thspan);
			thead.appendChild(headRowspan);

			thead.appendChild(headRow);

			subTable.appendChild(thead);
			data.forEach(function (el) {
				var tr = document.createElement("tr");
				for (var o in el) {
					var td = document.createElement("td");
					var txt = document.createTextNode(el[o]);
					td.appendChild(txt)
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			});
			subTable.appendChild(tbody);  //FOR DEVELOPMENT
			return ("<td colspan='8'><div>" + subTable.outerHTML + "</div></td>");
		}
		return '';
	},
	getTrIndex: function (_thisElem) { //Get TR index from table Step 1 to save in table toner hidden field.
		var trTonerElem = " ";
		var trTonerVal = null;
		var tr = $(_thisElem).closest("tr");
		var dataRowNum = $(_thisElem).closest("tr").attr('data-row-num');
		var trMergeUpdateInsertKey = [];

		trTonerVal = tr.data('toner-values');
		trTonerElem = " ";
		$("#hdnTrIndexToner").val(dataRowNum); //Get tr index.

		if (trTonerVal != undefined && trTonerVal != null) {
			//Merged two objects in array.
			$.each(trTonerVal.update, function (i, valUp) {
				trMergeUpdateInsertKey.push(valUp);
			});

			$.each(trTonerVal.insert, function (i, valIn) {
				trMergeUpdateInsertKey.push(valIn);
			});

			$.each(trMergeUpdateInsertKey, function (i, val) {
				var id = (val.id == undefined || val.id == '' ? '' : val.id);

				trTonerElem += '<tr data-mrf-s1-toner="' + id + '" data-row-num="parentRow">';
				trTonerElem += '<td><input type="text" class="mrf-material s1_toner_qty" name="s1_toner_qty" value="' + val.s1_toner_qty + '" onkeyup="dtCurrentMrf.autoComputeTonerTotal(this)"></td>' +
					'<td><select class="mrf-material frm-s1" name="s1_toner_monocolor">' +
					'<option value="">---</option>' +
					'<option value="1" ' + (val.s1_toner_monocolor == 1 ? "selected" : "") + '>Mono</option>' +
					'<option value="2" ' + (val.s1_toner_monocolor == 2 ? "selected" : "") + '>Color</option>' +
					'</select></td>' +
					'<td><input type="text" class="mrf-material s1_toner_model"  name="s1_toner_model" value="' + val.s1_toner_model + '" ></td>' +
					'<td><input type="text" class="mrf-material s1_toner_price"  name="s1_toner_price" value="' + val.s1_toner_price + '" onkeyup="dtCurrentMrf.autoComputeTonerTotal(this)"></td>' +
					'<td><input type="text" class="mrf-material s1_toner_yield"  name="s1_toner_yield" value="' + val.s1_toner_yield + '"></td>' +
					'<td><input type="text" class="mrf-material s1_toner_total"  name="s1_toner_total" value="' + val.s1_toner_total + '" disabled="disabled"></td>' +
					'<td><select class="mrf-material frm-s1 s1_toner_type" name="s1_toner_type">' +
					'<option value="">---</option>' +
					'<option value="1" ' + (val.s1_toner_type == 1 ? "selected" : "") + '>Outright</option>' +
					'<option value="2" ' + (val.s1_toner_type == 2 ? "selected" : "") + '>Meter Reading</option>' +
					'<option value="3" ' + (val.s1_toner_type == 3 ? "selected" : "") + '>Fixed Monthly</option>' +
					'</select></td>' +
					'<td><input type="text" class="mrf-material s1_toner_rate" name="s1_toner_rate" value="' + val.s1_toner_rate + '"></td>' +
					'<td><button type="button" title="Delete" class="btn btn-flat btn-danger btn-xs delete_row">X</button></td>';
				trTonerElem += '</tr>';
			});
			$("#tbl_frm_s1_toner tbody").append(trTonerElem);

		}

		return this;
	},
	getTonerDetails: function (_thisElem) { //Get Toner details of each tr.
		var trTonerElem = " ";
		var trTonerVal = null;
		var tr = $(_thisElem).closest("tr");

		trTonerVal = decodeURIComponent(tr.data('toner-values'));
		trTonerElem = " ";

		if (trTonerVal != undefined && trTonerVal != null && trTonerVal != '') {
			$.each(JSON.parse(trTonerVal), function (i, val) {
				trTonerElem += '<tr>';
				trTonerElem += '<td>' + val["s1_toner_qty"] + '</td>' +
					'<td>' + val["type_name"] + '</td>' +
					'<td>' + val["s1_toner_model"] + '</td>' +
					'<td>' + val["s1_toner_price"] + '</td>' +
					'<td>' + val["s1_toner_yield"] + '</td>' +
					'<td>' + val["s1_toner_total"] + '</td>' +
					'<td>' + val["s1_billing_type"] + '</td>' +
					'<td>' + val["s1_toner_rate"] + '</td>';
				trTonerElem += '</tr>';
			});
		}
		else {
			trTonerElem += "<tr ><td colspan='6'><div class='text-center'><span class='label label-info text-center'>No data available in table.</span></div></td></tr>";
		}
		$("#tbl_view_s1_toner tbody").html(trTonerElem);

		return this;
	},
	addFieldsSerial: function () { //Generate fields of serialnumbers. //IN PROGRESS - not properly working

		$('#add').on('click', function () {
			var newFields = $('div#newSerialFields').children('div');
			//var newFields_length = newFields.children('div').length;
			var qty = $("#qty").val() || 0;
			if (qty + 1) {
				if (qty > newFields.length) {
					addFields(qty, newFields);
				} else {
					removeFields(qty, newFields);
				}
			}
		});

		function addFields(qty, newFields) {
			var i = 0;
			for (i = newFields.length; i < qty; i++) {
				$('<div><label>' + (i + 1) + '</label>. <input type="text" class="s1_serial" name="s1_serial"/></div>').appendTo("#newSerialFields");
			}
		}

		function removeFields(qty, newFields) {
			var removeField = newFields.slice(qty).remove();
			newFields = newFields.not(removeField);
		}


		return this;
	},
	getTrIndexSerial: function (_thisElem) {  //IN PROGRESS - not properly working
		var trSerialElem = " ";
		var tr = $(_thisElem).closest("tr").attr('data-row-num');
		var trSerialVal = $("#tbl_frm_component_1 tbody tr[data-row-num^='" + tr + "'] #s1_serialnum").val();
		var trQtyVal = $("#tbl_frm_component_1 tbody tr[data-row-num^='" + tr + "'] #s1_quantity").val();
		$("#hdnTrIndexSN").val(tr); //Set tr index.
		$("#qty").val(trQtyVal); //Set qty.
		if (trSerialVal) {
			//code, if serial fields has value display list.
			var sn_arr = trSerialVal.split(',');
			for (key in sn_arr) {
				trSerialElem += '<div><label>' + (parseInt(key) + 1) + '</label>. <input type="text" class="s1_serial" name="s1_serial" value=' + sn_arr[key] + '></div>';
			}
			$("#frmS1Serial #newSerialFields").html(trSerialElem);

		}
	},
	getTrIndexViewSerial: function (_thisElem) {  //IN PROGRESS - not properly working
		var trSerialElem = " ";
		var tr = $(_thisElem).closest("tr").attr('data-row-num');
		var trSerialVal = $("#tbl_view_frm_component_1 tbody tr[data-row-num^='" + tr + "'] #s1_serialnum").val();
		if (trSerialVal) {
			//code, if serial fields has value display list.
			var sn_arr = trSerialVal.split(',');
			trSerialElem += "<ul class='list-style-none'>";
			for (key in sn_arr) {
				trSerialElem += '<li>' + sn_arr[key] + '</li>';
			}
			trSerialElem += "</ul>";
			$("#frmViewSerial .newFields").html(trSerialElem);

		}
	},
	saveSerialNumber: function (trIndex) { //IN PROGRESS - not properly working
		var sn = getMultipleValue(".s1_serial");
		var qty = $("#qty").val();
		$("#tbl_frm_component_1 tbody tr[data-row-num^='" + trIndex + "'] .s1_serialnum").val(sn);
		$("#tbl_frm_component_1 tbody tr[data-row-num^='" + trIndex + "'] .s1_quantity").val((sn ? sn.split(",").length : 0));

		//Display sub table serialnumbers.
		$("#tbl_frm_component_1 tbody tr[data-row-num^='" + trIndex + "']").next('tr.subRowSerial').html(self.dtCurrentMrf.buildSubRowSerial((sn ? sn.split(",") : 0)));
	},
	buildSubRowSerial: function (tblData) {
		var data = tblData; //array values must one-level dimension.

		if (tblData.length > 0) {
			var result = [],
				row,
				colLength = 5,
				i = 0;

			//loop through items and push each item to a row array that gets pushed to the final result
			for (i = 0, j = data.length; i < j; i++) {
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
			th.setAttribute('colspan', colLength);
			headRow.appendChild(th);
			thead.appendChild(headRow);

			subTable.appendChild(thead);
			result.forEach(function (el, idx) {
				var tr = document.createElement('tr');
				for (var i in el) {
					var td = document.createElement('td');
					var txt = document.createTextNode(el[i]);
					td.appendChild(txt);
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			});
			subTable.appendChild(tbody);

			return ("<td colspan='8'><div>" + subTable.outerHTML + "</div></td>");
		}
		return '';
	},
	autoComputeTonerTotal: function (elem) {
		/*
		* Formula: quantity * unit_price = total
		*/
		var $elem = $(elem);
		var tr = $elem.closest("tr");

		var field_multiplier = ['s1_toner_qty', 's1_toner_price'];
		var item_remove = field_multiplier.indexOf($elem.attr('name'));
		field_multiplier.splice(item_remove, 1);

		var val = $("#tbl_frm_s1_toner tbody tr:eq(" + tr.index() + ") input[name='" + field_multiplier + "']").val() || 0;
		$("#tbl_frm_s1_toner tbody tr:eq(" + tr.index() + ") .s1_toner_total").val((val * $elem.val()));

		//Compute the grand total by sum up all total.
		var total = $('.s1_toner_total').map(
			function () {
				if ($(this).val() != '') {
					return parseInt($(this).val());
				}
			}).get();

		var grand_total = total.reduce(function (total, num) {
			return total + num;
		});
		$("#grandTotal").text((grand_total > 0 ? formatNumber(grand_total) : '----'));


	}



};