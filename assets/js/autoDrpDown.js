// MIF
var autoDrpDown = {
	cacheOptComp: [],
	cacheOptCompInst: null,
	cacheOptBranch: [],
	cacheOptBranchInst: null,
	cacheOptBranchOne: [],
	cacheOptBranchOneInst: null,
	cacheOptClient: [],
	cacheOptClientInst: null,
	cacheOptAssignMngr: [],
	cacheOptAssignMngrInst: null,
	cacheOptRemoveMachine: [],
	cacheOptRemoveMachineInst: null,
	cacheOptBrands: [],
	cacheOptBrandsInst: null,
	cacheOptCategory: [],
	cacheOptSapCompany: [],
	getBranchName: function(selectedBranch,selectorTarget,excludeBranch){
		var elem = selectorTarget;
		$.ajax({
				type: 'GET',
				dataType: 'json',
				url: assets+'php/misc/locations.php',
				success: function(data){
					var opt = '';
						$.each(data.aaData, function(i, val){
							if(val.id != parseInt(excludeBranch) && val.status == 1)
								opt += "<option value='"+ val.id +"' "+ (parseInt(selectedBranch) == val.id ? "selected" : '')+"> "+val.branch_name +"</option>";	
						});
					$(elem).html(opt);	
				},
				complete: function(){
					$(elem).chosen({no_results_text: "No records found.",width: "100%", search_contains:true});
				}
			});
		return this;

	},
	getBranchNameOne: function(elem,pwidth,excludeBranch,isReverse){
		var disabled = false;
	    var cwidth = "100%";
			if(self.autoDrpDown.cacheOptBranchOne.length != 0){
				cwidth = pwidth;
				optBranch = '';
				$.each(self.autoDrpDown.cacheOptBranchOne[0], function(i, val){
					if(isReverse == true){
						if(jQuery.inArray(parseInt(i), excludeBranch) > -1){
							optBranch += val;
						}
					}else{
						if(jQuery.inArray(parseInt(i), excludeBranch) == -1){
							optBranch += val;
						}
					}
				});
				$(elem).html(optBranch);
				self.autoDrpDown.cacheOptBranchOneInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});	

			}
			else {
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/locations.php',
					async: false,
					success: function(data){
						var optBranch = ['<option value="">---</option>'];
							$.each(data.aaData, function(i, val){
								if(isReverse == true){
									if(jQuery.inArray(parseInt(val.id), excludeBranch) > -1 && val.status == 1){
										// optBranch[0] = '<option value="">---</option>';
										optBranch[val.id] = "<option value='"+ val.id +"'> "+val.branch_name +"</option>";	
									}
								}else{
									if(jQuery.inArray(parseInt(val.id), excludeBranch) == -1 && val.status == 1){
										// optBranch[0] = '<option value="">---</option>';
										optBranch[val.id] = "<option value='"+ val.id +"'> "+val.branch_name +"</option>";	
									}
								}
							});
							$(elem).html(optBranch);
							self.autoDrpDown.cacheOptBranchOne.push(optBranch);
					},
					complete: function(){
						cwidth = pwidth;
						self.autoDrpDown.cacheOptBranchOneInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});
					}
				});
	     }
	   return this;
	},
	getBranchNameMulti: function(elem,pwidth,excludeBranch,isExludeBranch){
		// var disabled = false;
		var cwidth = "100%";
			if(self.autoDrpDown.cacheOptBranch.length != 0){
				cwidth = pwidth;
				$(elem).html(self.autoDrpDown.cacheOptBranch[0]);
				self.autoDrpDown.cacheOptBranchInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});	
			}
			else {
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/locations.php',
					async: false,
					success: function(data){
						var optBranch = '';
							$.each(data.aaData, function(i, val){
								if(isExludeBranch == true){
									var view_branches = convertArrStrToInt(excludeBranch);	
									if(excludeBranch == '1'){
										if(jQuery.inArray(parseInt(val.id), view_branches) == -1 && val.status == 1){
											optBranch += "<option value='"+ val.id +"'> "+val.branch_name +"</option>";									
										}
									}else{							
										if(jQuery.inArray(parseInt(val.id), view_branches) > -1 && val.status == 1){
											optBranch += "<option value='"+ val.id +"'> "+val.branch_name +"</option>";									
										}
									}
								}
								else{
										optBranch += "<option value='"+ val.id +"'> "+val.branch_name +"</option>";		
								}

							});
							$(elem).html(optBranch);
							self.autoDrpDown.cacheOptBranch.push(optBranch);
					},
					complete: function(){
						cwidth = pwidth;
						self.autoDrpDown.cacheOptBranchInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});
					}
				});
	     }
	   return this;
	},
	getAllCompany: function(elem,pwidth){
			var disabled = false;
			var cwidth = "100%";
			if(self.autoDrpDown.cacheOptComp.length != 0){
				cwidth = pwidth;
				$(elem).html(self.autoDrpDown.cacheOptComp[0]);
				self.autoDrpDown.cacheOptCompInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});
			}
			else {
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/companylist.php',
					async: false,
					success: function(data){
						var opt = '<option value>---</option>';
							$.each(data, function(i, val){
									opt += "<option value='"+ val.id +"'> "+val.company_name +"</option>";	
							});
							$(elem).html(opt);
							self.autoDrpDown.cacheOptComp.push(opt);	
					},
					complete: function(){
						cwidth = pwidth;
						self.autoDrpDown.cacheOptCompInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});
					}
				});
	     }
	   return this;
	},
	getClientName: function(elem,pwidth){
			var disabled = false;
			var cwidth = "100%";
			if(self.autoDrpDown.cacheOptClient.length != 0){
				cwidth = pwidth;
				$(elem).html(self.autoDrpDown.cacheOptClient[0]);
				self.autoDrpDown.cacheOptClientInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});
			}
			else {
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/accountsDetails.php',
					async: false,
					data: {action: 'account_manager'},
					success: function(data){
						var optClient = "<option value=''>---</option>";
							$.each(data.aaData, function(i, val){
									optClient += "<option value='"+ val.id +"'> "+val.fullname+"</option>";	
							});
							$(elem).html(optClient);
							self.autoDrpDown.cacheOptClient.push(optClient);	
					},
					complete: function(){
						cwidth = pwidth;
						self.autoDrpDown.cacheOptClientInst = $(elem).chosen({no_results_text: "No records found.",width: cwidth,search_contains:true});
					}
				});
	     }
	     return this;
	},
	getAssignAccountManager: function(elem){
			var disabled = false;
			if(self.autoDrpDown.cacheOptAssignMngr.length != 0){
				$(elem).html(self.autoDrpDown.cacheOptAssignMngr[0]);
				self.autoDrpDown.cacheOptAssignMngrInst = $(elem).chosen({no_results_text: "No records found.",width: "100%",search_contains:true});
			}
			else {
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/accountsDetails.php',
					async: false,
					data: {action: 'account_manager_assign'},
					success: function(data){
						var optClient = "<option value=''>---</option>";
							$.each(data.aaData, function(i, val){
									optClient += "<option value='"+ val.id +"'> "+val.fullname+"</option>";	
							});
							$(elem).html(optClient);
							self.autoDrpDown.cacheOptAssignMngr.push(optClient);	
					},
					complete: function(){
						self.autoDrpDown.cacheOptAssignMngrInst = $(elem).chosen({no_results_text: "No records found.",width:"100%",search_contains:true});
					}
				});
	     }
	     return this;
	},
	getMachineStatus: function(elem){
			if(self.autoDrpDown.cacheOptRemoveMachine.length != 0){
				$(elem).html(self.autoDrpDown.cacheOptRemoveMachine[0].join(""));
			}
			else {
				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/machinestatus.php',
					async: false,
					success: function(data){
						var optStatus = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optStatus[0] = "<option value=''>---Please select a status---</option>";
										optStatus[i+1] = "<option value='"+ val.id +"' data-action="+val.set_default+"> "+val.status_name+"</option>";	
								});
							}else{
								optStatus[0] = "<option value=''>---No records found---</option>";
							}
							$(elem).html(optStatus.join(""));
							self.autoDrpDown.cacheOptRemoveMachine.push(optStatus);	
					}
				});
	     }
	     return this;
	},
	getBrandName: function(elem,usePlugin){
			if(self.autoDrpDown.cacheOptBrands.length != 0){
				$(elem).html(self.autoDrpDown.cacheOptBrands[0].join(""));
				if(usePlugin === true || usePlugin != null){
					$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
				}
			}
			else {				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/brands.php',
					async: false,
					success: function(data){
						var optBrand = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optBrand[0] = "<option value=''>---Brand---</option>";
										optBrand[i+1] = "<option value='"+ val.id +"'>"+val.brand_name+"</option>";	
								});
							}else{
								optBrand[0] = "<option value=''>---No records found---</option>";
							}
							$(elem).html(optBrand.join(""));
							self.autoDrpDown.cacheOptBrands.push(optBrand);	
					},
					complete: function(){
						if(usePlugin === true || usePlugin != null){
							$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
						}
					}
				});
	     }
	     return this;
	},
	getTonerModel: function(elem){
	  return $.ajax({
				type: 'GET',
				dataType: 'json',
				url: assets+'php/settings/tonerModel.php',
				data: {action: 'view-model'},
				async: false,
				success: function(data){
					var opt = '';
						$.each(data.aaData, function(i, val){
								opt += "<option value='"+ val.model +"'> "+val.model+"</option>";	
						});
					$(elem).html(opt);	
				},
				complete: function(){
					$(elem).chosen({no_results_text: "No records found.",width: "100%", search_contains:true});
				}
			});
	},
	getCategory: function(elem,usePlugin){
			if(self.autoDrpDown.cacheOptCategory.length != 0){
				$(elem).html(self.autoDrpDown.cacheOptCategory[0].join(""));
				if(usePlugin === true || usePlugin != null){
					$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
				}
			}
			else {				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/category.php',
					async: false,
					success: function(data){
						var optType = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optType[0] = "<option value=''>---Category---</option>";
										optType[i+1] = "<option value='"+ val.id +"'>"+val.cat_name+"</option>";	
								});
							}else{
								optType[0] = "<option value=''>---No records found---</option>";
							}
							$(elem).html(optType.join(""));
							self.autoDrpDown.cacheOptCategory.push(optType);	
					},
					complete: function(){
						if(usePlugin === true || usePlugin != null){
							$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
						}
					}
				});
	     }
	     return this;
	},
	getSapCompany: function(elem,usePlugin){
			if(self.autoDrpDown.cacheOptSapCompany.length != 0){
				$(elem).html(self.autoDrpDown.cacheOptSapCompany[0].join(""));
				if(usePlugin === true || usePlugin != null){
					$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
				}
			}
			else {				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/sap_details.php',
					data: {action: 'company_name' },
					async: false,
					success: function(data){
						var optSap = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optSap[0] = "<option value=''>---</option>";
										optSap[i+1] = "<option value='"+ val.sap_code +"'>"+val.company_name+"</option>";	
								});
							}else{
								optSap[0] = "<option value=''>---No records found---</option>";
							}
							$(elem).html(optSap.join(""));
							self.autoDrpDown.cacheOptSapCompany.push(optSap);	
					},
					complete: function(){
						if(usePlugin === true || usePlugin != null){
							$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
						}
					}
				});
	     }
	     return this;
	}
};


//Inventory
var autoDrpDownInvnt = {
	cacheOptType: [],
	cacheOptCon: [],
	cacheOptBranch: [],
	cacheOptStatus: {'IN': null, 'OUT': null },
	cacheOptModel: [],
	getModelByBrand: function(elem,usePlugin){
			if(self.autoDrpDownInvnt.cacheOptModel.length != 0){
				$(elem).html(self.autoDrpDownInvnt.cacheOptModel[0].join(""));
				if(usePlugin === true || usePlugin != null){
					$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
				}
			}
			else {				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/inventory_misc.php',
					data: { action: 'models' },
					async: false,
					success: function(data){
						var optModel = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optModel[0] = "<option value=''>---Model---</option>";
										optModel[i+1] = "<option value='"+ val.id +"' data-cat-type="+val.id_category +","+val.id_type+">"+val.model_name+"</option>";	
								});
							}else{
								optModel[0] = "<option value=''>---No records found---</option>";
							}
							$(elem).html(optModel.join(""));
							self.autoDrpDownInvnt.cacheOptModel.push(optModel);	
					},
					complete: function(){
						if(usePlugin === true || usePlugin != null){
							$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
						}
					}
				});
	     }
	     return this;
	},
	getType: function(elem,usePlugin){
			if(self.autoDrpDownInvnt.cacheOptType.length != 0){
				$(elem).html(self.autoDrpDownInvnt.cacheOptType[0].join(""));
				if(usePlugin === true || usePlugin != null){
					$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
				}
			}
			else {				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/inventory_misc.php',
					data: { action: 'type' },
					async: false,
					success: function(data){
						var optType = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optType[0] = "<option value=''>---Type---</option>";
										optType[i+1] = "<option value='"+ val.id +"'>"+val.type_name+"</option>";	
								});
							}else{
								optType[0] = "<option value=''>---No records found---</option>";
							}
							$(elem).html(optType.join(""));
							self.autoDrpDownInvnt.cacheOptType.push(optType);	
					},
					complete: function(){
						if(usePlugin === true || usePlugin != null){
							$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
						}
					}
				});
	     }
	     return this;
	},
	getCondition: function(elem,usePlugin){
			if(self.autoDrpDownInvnt.cacheOptCon.length != 0){
				$(elem).html(self.autoDrpDownInvnt.cacheOptCon[0].join(""));
				if(usePlugin === true || usePlugin != null){
					$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
				}
			}
			else {				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/inventory_misc.php',
					data: { action: 'condition' },
					async: false,
					success: function(data){
						var optCon = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optCon[0] = "<option value=''>---BN/RF---</option>";
										optCon[i+1] = "<option value='"+ val.id +"'>"+val.acronym_name+ " (" + val.acronym_name_def + ")"+ "</option>";	
								});
							}else{
								optCon[0] = "<option value=''>---No records found---</option>";
							}
							$(elem).html(optCon.join(""));
							self.autoDrpDownInvnt.cacheOptCon.push(optCon);	
					},
					complete: function(){
						if(usePlugin === true || usePlugin != null){
							$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
						}
					}
				});
	     }
	     return this;
	},
	getBranch: function(elem,usePlugin,excludeBranch,preSelected){
				if(self.autoDrpDownInvnt.cacheOptBranch.length > 0){
					$(elem).html(self.autoDrpDownInvnt.cacheOptBranch[0].join(""));
					if(usePlugin === true || usePlugin != null){
						$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
					}
				}
				else {				
		         $.ajax({
						type: 'GET',
						dataType: 'json',
						url: assets+'php/misc/inventory_misc.php',
						data: { action: 'branch' },
						async: false,
						success: function(data){
							var optBranch = [];
							    if(data.aaData.length > 0 ){
							    	$.each(data.aaData, function(i, val){
										optBranch[0] = "<option value='' hidden>---Branch---</option>";
											optBranch[i+1] = "<option value='"+ val.id +"' "+ (val.id == preSelected ? 'selected' : '')+">"+val.branch_name+ "</option>";
									});

								}else{
									optBranch[0] = "<option value=''>---No records found---</option>";
								}
								$(elem).html(optBranch.join(""));
								self.autoDrpDownInvnt.cacheOptBranch.push(optBranch);	
						},
						complete: function(){
							if(usePlugin === true || usePlugin != null){
								$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
							}
						}
					});
		     }
				if(excludeBranch != null ){ //Excluding branch.
					var arr_model = excludeBranch;
					var i = 0;
						for (i = 0; i < arr_model.length; i++) {
							$(elem).find("option[value='"+arr_model[i]+"']").hide();
						}
				}
	     return this;
	},
	getStatus: function(elem,status_type){
			if(self.autoDrpDownInvnt.cacheOptStatus.IN != null && status_type == 'IN'){
				$(elem).html(self.autoDrpDownInvnt.cacheOptStatus.IN.join(" "));
			}
			else if (self.autoDrpDownInvnt.cacheOptStatus.OUT != null  && status_type == 'OUT'){
				 $(elem).html(self.autoDrpDownInvnt.cacheOptStatus.OUT.join(" "));
			}
			else {				
	         $.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/misc/inventory_misc.php',
					data: { action: 'status', status_type: status_type },
					async: false,
					success: function(data){
						var optStatus = [];
						    if(data.aaData.length > 0 ){
								$.each(data.aaData, function(i, val){
									optStatus[0] = "<option value=''>---Status---</option>";
										optStatus[i+1] = "<option value='"+ val.id +"'>"+val.status_name+ "</option>";
										
								});
							}else{
								optStatus[0] = "<option value=''>---No records found---</option>";
							}

							$(elem).html(optStatus.join("")); //render the element options.
							if(status_type == 'IN'){ //cache the elements options.
								self.autoDrpDownInvnt.cacheOptStatus.IN = optStatus;
							}
							else{
								self.autoDrpDownInvnt.cacheOptStatus.OUT = optStatus;
							}	
					}
				});
	     }
	     return this;
	}

};

//MRF

var autoDrpDownMrf = {
	cacheOptBranch: [],
	cacheOptAccountMrf: null,
	cacheOptAccountMrfInst: null,
	cacheOptAccountType: null,
	getBranch: function(elem,usePlugin,excludeBranch,preSelected,isReverse,include_all){
				//if(self.autoDrpDownMrf.cacheOptBranch.length > 0){
					// var optBranch = '';
					// $.each(self.autoDrpDownMrf.cacheOptBranch[0], function(i, val){
					// 	if(isReverse == true){
					// 		if(jQuery.inArray(parseInt(i), excludeBranch) > -1 && excludeBranch != null){
					// 			optBranch += val;
					// 		}
					// 	}else{
					// 		if(jQuery.inArray(parseInt(i), excludeBranch) == -1  && excludeBranch != null){
					// 			optBranch += val;
					// 		}
					// 	}
					// });
					
					// $(elem).html(optBranch);
					// if(usePlugin === true && usePlugin != null){
					// 	$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
					// }
				//}
				//else {				
		         $.ajax({
						type: 'GET',
						dataType: 'json',
						url: assets+'php/misc/inventory_misc.php',
						data: { action: 'branch' },
						async: false,
						success: function(data){
							var _optBranch = [];
							var _optBranchAll = [];
							    if(data.aaData.length > 0 ){
							    	_optBranch[0] = "<option value='' disabled>---Branch---</option>";
							    	$.each(data.aaData, function(i, val){
							    		
									    if(isReverse == true){
											if(jQuery.inArray(parseInt(val.id), excludeBranch) > -1 && excludeBranch != null){
												if(include_all == true){
													_optBranchAll.push(val.id);
													_optBranch[1] = "<option value='"+ _optBranchAll.join(',') +"'>ALL</option>";
												}
												
												_optBranch[_optBranch.length+1] = "<option value='"+ val.id +"' "+ (val.id == preSelected && preSelected != null ? 'selected' : '')+">"+val.branch_name+ "</option>";																							
											}

										}else{
											if(jQuery.inArray(parseInt(val.id), excludeBranch) == -1 && excludeBranch != null){
												_optBranch[_optBranch.length+1] = "<option value='"+ val.id +"' "+ (val.id == preSelected && preSelected != null ? 'selected' : '')+">"+val.branch_name+ "</option>";
											}
										}
									});

								}
								else{
									_optBranch[0] = "<option value=''>---No records found---</option>";
								}

								$(elem).html(_optBranch.join(""));
								self.autoDrpDownMrf.cacheOptBranch.push(_optBranch);	
						},
						complete: function(){
							if(usePlugin === true && usePlugin != null){
								$(elem).chosen({no_results_text: "No records found.", width: '100%', search_contains:true});
							}
						}
					});
		    // }

				// if(excludeBranch != null ){ //Excluding branch.
				// 	var arr_model = excludeBranch;
				// 	var i = 0;
				// 		for (i = 0; i < arr_model.length; i++) {
				// 			$(elem).find("option[value='"+arr_model[i]+"']").hide();
				// 		}
				// }

	     return this;
	},
	getAccountHasMrf: function(elem,id_account_type){
			if(this.cacheOptAccountMrf == null){
	         	$.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/mrf/misc/getAccountHasMrfAccess.php',
					async: false,
					success: function(data){
						var optAccMrf = [];
						    optAccMrf[0] = "<option value=''>---</option>";
							$.each(data.aaData, function(i, val){
									optAccMrf.push("<option value='"+ val.id +"' data-account-type='"+val.account_type+"'> "+val.fullname+"</option>");	
							});
							self.autoDrpDownMrf.cacheOptAccountMrf = optAccMrf;	
					}
				});
	     	}
	     	 //Remove option not equal to @id_account_type and show names is equal.
	     	  $(elem).html("<option value='' data-account-type='"+id_account_type+"'>---</option>" + this.cacheOptAccountMrf.join("")).find("option:not([data-account-type='"+id_account_type+"'])").remove();

	},
	getAccountDept: function(elem){
			if(this.cacheOptAccountType == null){
	         	$.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/mrf/misc/getAccountTypeByFlag.php',
					async: false,
					success: function(data){
						var optDept = [];
						var optElem = "";
							$.each(data, function(i, val){
								$.each(val,function(_i, _val){
									optElem += "<option value="+_val.id+" data-group="+i+" data-group-mif="+_val.mif_flag+">"+_val.dept+"</option>";
								});
								// optElem += "</optgroup>";									
							});
							 optDept.push(optElem);	
							 self.autoDrpDownMrf.cacheOptAccountType = optDept;	
					}
				});
	     	}
	     	  //Render elements.
	     	  $(elem).html("<option value=''>---</option>" + this.cacheOptAccountType.join(""));

	},
};


// var autoDrpDownPM = {
// 	   cacheOptPM: [],
// 		getTechnician: function(elem,branch){
// 			if(this.cacheOptPM.length == 0){
// 	         	$.ajax({
// 					type: 'GET',
// 					dataType: 'json',
// 					url: assets+'php/pm/misc/getTechnician.php',
// 					async: false,
// 					data: { branch: branch },
// 					success: function(data){
// 						var optTech = [];
// 							$.each(data.aaData, function(i, val){
// 									optTech.push("<option value='"+ val.id +"'> "+val.technician+"</option>");	
// 							});
// 							self.autoDrpDownPM.cacheOptPM = optTech;	
// 					}
// 				});
// 	     	}
// 	     	  //Render elements.
// 	     	  $(elem).html("<option value=''>---</option>" + this.cacheOptPM.join(""));

// 	},
// };


var autoDrpDownPM = {
	   cacheOptPM: {  },
		getTechnician: function(elem,branch){
			var storeOpt = {
				set : function(_branch, optElem){
					if(_branch != undefined && optElem != undefined){
						if( !self.autoDrpDownPM.cacheOptPM.hasOwnProperty(_branch) ){
							 self.autoDrpDownPM.cacheOptPM[_branch] = optElem;

						}											
					}						
				},
				get: function(_branch){
					if( self.autoDrpDownPM.cacheOptPM.hasOwnProperty(_branch) )
						return self.autoDrpDownPM.cacheOptPM[_branch];
					else
						return null;
				}
			};


			if(!self.autoDrpDownPM.cacheOptPM.hasOwnProperty(branch)){
	         	$.ajax({
					type: 'GET',
					dataType: 'json',
					url: assets+'php/pm/misc/getTechnician.php',
					async: false,
					data: { branch: branch },
					success: function(data){
						var optTech = [];
							$.each(data.aaData, function(i, val){
								optTech.push("<option value='"+ val.id +"'> "+val.technician+"</option>");	
							});
							storeOpt.set(branch, optTech);	
					}
				});
	     	}
	     	  //Render elements.
	     	  var opts = ( storeOpt.get(branch) !== null ? storeOpt.get(branch).join("") : '' );
	     	  	  $(elem).html("<option value=''>---</option>" + opts);

	},
};

