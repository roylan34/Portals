var baseApp = '/machine/';  // base app url.
var pages = baseApp+'pages/'; // base pages
var assets = baseApp+'assets/';
var win = window;

$(document).ready(function(){
	$('body').find('div#modal-container').append(
								 '<div id="displayFormCompany"></div>',
								  '<div id="displayMap"></div>',
								 '<div id="displayViewMachine"></div>',
								 '<div id="displayViewMifLogs"></div>',
								 '<div id="displayFormArchiveMachine"></div>',
								 '<div id="displayLogin"></div>',
								 '<div id="displayFilterMachine"></div>',
								 '<div id="displayFormMachine"></div>',
								 '<div id="displayFormAccount"></div>',
								 '<div id="displayFormAccClient"></div>',
								 '<div id="displayFormStatus"></div>',
								 '<div id="displayFormBrand"></div>',
								 '<div id="displayFormTonerModel"></div>',
								 '<div id="displayFormInvntEntry"></div>',
								 '<div id="displayFormInvntInOutMachine"></div>',
								 '<div id="displayViewInvntLogs"></div>',
								 '<div id="displayFormMrfEntry"></div>',
								 '<div id="displayViewStepDetails"></div>',
								 '<div id="displayComments"></div>',
								 '<div id="displaySettings"></div>',
								 '<div id="displayFormBranch"></div>',
								 '<div id="displayModelChart"></div>',
								 '<div id="displayFormSchedule"></div>',
								 '<div id="displayPMList"></div>',
								 '<div id="displayRemoveMachine"></div>',
								 '<div id="displayFormPM"></div>',
								 '<div id="displaySalesHistory"></div>',
								 '<div id="displaySalesDetails"></div>',
								 '<div id="displayPmHistory"></div>',
								 '<div id="displayFormReservation"></div>',
								 '<div class="displayPromptMSG"></div>');

  var mifPages = {
	 isLogged: 0,
	 app_module : null,
	 branch     : null,
	 user_role   : null,
	 companies  : null,
	 user_type  : null,
	 user_mrf_flag : null,
	 abortAjaxDataTable: function(){
		if (typeof $ !== "undefined" && $.fn.dataTable) {
			 var all_settings = $($.fn.dataTable.tables()).DataTable().settings();
			 for (var i = 0, settings; (settings = all_settings[i]); ++i) {
				  if (settings.jqXHR)
						settings.jqXHR.abort();         
			 }
		}
	 },
	 redirect: function(route,module, appmodule){
		var navigateTo = function(route, app_module){
		  for(var key in app_module){
			  if(key == 'app_mif' && app_module[key] == 1){
				 route.setRoute('/mif/dashboard');
				 break;
			  }
			  if(key == 'app_invnt' && app_module[key] == 1){
				route.setRoute('/inventory/dashboard');
				break;
			  }
			  if(key == 'app_mrf' && app_module[key] == 1){
				route.setRoute('/mrf/current');
				break;
			  }
			  if(key == 'app_pm' && app_module[key] == 1){
				route.setRoute('/pm/current');
				break;
			  }
		  }
		};

		  if(appmodule != null){
			 var nav_url = window.location.hash.slice(2);
			 var blocklist_url 	= {
				 					'User'	: ['account/company','account/manager','mif/settings','inventory/settings', 'mrf/settings', 'pm/settings', 'reports/sap-sales-summary'],
				 					'Admin'	: ['account/company','account/manager'],
				 					'Sysadmin' : []
			 					}; //Block accessing url base of user role.
			 var blocked_url 	= blocklist_url[this.user_role].filter(function(url){
					 				return url == nav_url;
				  				});
					if( (this.user_role == 'User' || this.user_role == 'Admin') && blocked_url.length > 0){
						navigateTo(route,appmodule);
						return false;
					}
					else{
					  	if(module =='mif' && appmodule.app_mif == 0){
						 	navigateTo(route,appmodule);
						 	return false;
					  	}
					  	if(module =='inventory' && appmodule.app_invnt == 0){
						 	navigateTo(route,appmodule);
						 	return false;
					  	}
					  	if(module =='mrf' && appmodule.app_mrf == 0){
						  	navigateTo(route,appmodule);
						 	return false;
					  	}
					  	if(module =='pm' && appmodule.app_pm == 0){
						 	navigateTo(route,appmodule);
						 	return false;
					  	}
					}
		  }else{
			 	route.setRoute('/login');
			 	return false;
		  }
	 },
	 route: function(){
		var route    = window.location.hash.slice(2) || null;
			 var sections = $('.view');
			 var section;
			 var default_route = ''; //Change inventory dashboard to default dashboard.
				if(route == 'inventory/dashboard'){
				  default_route = 'dashboard';
				}
				else if(route == 'mrf/current'){
				  default_route = 'mrf/current';
				}
				else if(route == 'pm/current'){
				  default_route = 'pm/current';
				}
				else{
				  default_route = route;
				}

				$('.page-home').attr('data-route',default_route);
				section = sections.filter("[data-route=\"" + default_route + "\"]");
				if (section.length) {
					 sections.empty();
				}
	 },
	 login: function(route){
		$(".page-login").load(pages+'login/index.html',function(){
		  $( "#frmLogin" ).submit(function( e ) {
				 e.preventDefault();
				  $("body").removeClass('modal-open'); //Remove existing modal open.
					login(route);

			 });
		});
		return this;
	 },
	 dashboard: function(fullname,user_role, appmodule){ //Load dashboard template.
		var app_module = appmodule;
		  $(".page-home").load(pages+'index.html',function(){
			 var views = $(this);
				$(".view #include-navigation").load(baseApp+'pages/dashboard/navigation.html',function(){
					views.find(".navbar-custom-menu ul >li p.info").text(fullname);
					views.find(".navbar-custom-menu ul >li p").append("<small>"+user_role+"</small>");
				});
			 $(".view #include-left-sidebar").load(baseApp+'pages/dashboard/left-sidebar.html',function(){
				 views.find(".user .info p").text(fullname);

					// Reports SAP - Sales Summary
					var allowed_user_type = [1,2,3,4]; //Executive, Sales, Relation Officer, Technical
					if(allowed_user_type.indexOf(parseInt(jwt.get('user_type'))) == -1){ // -1 not found
					    views.find("ul.sidebar-menu li#reports-sap-sales-summary").remove();
					}

				  if( user_role == "User"){
						views.find("ul.sidebar-menu li#sidebar-accounts, ul.sidebar-menu li#sidebar-settings").remove();
					 if(app_module.app_mif == 0){
						views.find("ul.sidebar-menu li#home-mif, ul.sidebar-menu li#current-mif, ul.sidebar-menu li#archive-machine").remove(); //Remove sub-menu of MIF
					 }
					 if( app_module.app_pm == 0){
						views.find("ul.sidebar-menu li#current-pm, ul.sidebar-menu li#archive-pm").remove(); //Remove sub-menu of PM
					 }                 
					 if( app_module.app_invnt == 0){
						views.find("ul.sidebar-menu li#home-inventory, ul.sidebar-menu li#current-inventory, ul.sidebar-menu li#archive-inventory, ul.sidebar-menu li#reports-bn-rf, ul.sidebar-menu li#reports-sap-ho, ul.sidebar-menu li#reports-sap-issuance, ul.sidebar-menu li#reports-status").remove(); //Remove sub-menu of Inventory
					 }
					 if( app_module.app_mrf == 0){
						views.find("ul.sidebar-menu li#current-mrf, ul.sidebar-menu li#archive-mrf").remove(); //Remove sub-menu of MRF
					 }

				  }
				  else if( user_role == "Admin"){
						views.find("ul.sidebar-menu li#sidebar-accounts").remove();
					 if(app_module.app_mif == 0){
						views.find("ul.sidebar-menu li#home-mif, ul.sidebar-menu li#current-mif, ul.sidebar-menu li#archive-machine, ul.sidebar-menu li#settings-mif, ul.sidebar-menu li#reports-sap-sales-summary").remove(); //Remove sub-menu of MIF
					 }
					 if( app_module.app_pm == 0){
						views.find("ul.sidebar-menu li#current-pm, ul.sidebar-menu li#archive-pm").remove(); //Remove sub-menu of PM
					 }                   
					 if( app_module.app_invnt == 0){
						views.find("ul.sidebar-menu li#home-inventory, ul.sidebar-menu li#current-inventory, ul.sidebar-menu li#archive-inventory, ul.sidebar-menu li#settings-inventory, ul.sidebar-menu li#reports-bn-rf, ul.sidebar-menu li#reports-sap-ho, ul.sidebar-menu li#reports-sap-issuance, ul.sidebar-menu li#reports-status").remove(); //Remove sub-menu of Inventory
					 }
					 if( app_module.app_mrf == 0){
						views.find("ul.sidebar-menu li#current-mrf, ul.sidebar-menu li#archive-mrf, ul.sidebar-menu li#settings-mrf").remove(); //Remove sub-menu of MRF
					 }     
				  }
				  else if( user_role == "Sysadmin"){
					 if(app_module.app_mif == 0){
						views.find("ul.sidebar-menu li#home-mif, ul.sidebar-menu li#current-mif, ul.sidebar-menu li#archive-machine, ul.sidebar-menu li#settings-mif, ul.sidebar-menu li#reports-sap-sales-summary").remove(); //Remove sub-menu of MIF
					 }
					 if( app_module.app_pm == 0){
						views.find("ul.sidebar-menu li#current-pm, ul.sidebar-menu li#archive-pm").remove(); //Remove sub-menu of PM
					 }                   
					 if( app_module.app_invnt == 0){
						views.find("ul.sidebar-menu li#home-inventory, ul.sidebar-menu li#current-inventory, ul.sidebar-menu li#archive-inventory, ul.sidebar-menu li#settings-inventory, ul.sidebar-menu li#reports-bn-rf, ul.sidebar-menu li#reports-sap-ho, ul.sidebar-menu li#reports-sap-issuance, ul.sidebar-menu li#reports-status").remove(); //Remove sub-menu of Inventory
					 }
					 if( app_module.app_mrf == 0){
						views.find("ul.sidebar-menu li#current-mrf, ul.sidebar-menu li#archive-mrf, ul.sidebar-menu li#settings-mrf").remove(); //Remove sub-menu of MRF
					 }     
				  }
				  else { /*return false;*/  views.find(".sidebar-menu").remove(); }
			 });
			 $(".view #include-footer").load(baseApp+'pages/dashboard/footer.html');
		  });

		return this;
	 },
	 mif_dashboard: function(){
		  $(".view-content").load(pages+'mif-home.html',function(data,status){
		  if(status == 'success'){
			 machineCharts.pageDetails().brands().location();
		  }
		});
		return this;
	 },
	 mif_maps: function(){
		  $(".view-content").load(pages+'mif-maps.html',function(data,status){
		  if(status == 'success'){
			 $(".content").addClass('r-content'); //Add class .r-content to override the .content style
			  mifMaps.pageDetails().initMap();
		  }
		});
		return this;
	 },
	 current_mif: function(location,user_mif_flag, app_action){
		var _self = this;
		if(user_mif_flag == 'view' && app_action == 'r'){
		// if(jQuery.inArray(parseInt(user_type),[2,3]) > -1){ // 2 = Sales, 3 = Relation Officer
		  $(".view-content").load(pages+'client-dashboard/index.html',function(data,status,xhr){
			 dtClientCompany.pageDetails().render().actions();
			 dtFilterMachine.showModal("sales");

		  });
		}
		else{
		  $(".view-content").load(pages+'company/index.html',function(data, status){
			 dtCompany.pageDetails().render(location).countMachines(location).actions();
			 dtFilterMachine.showModal("admin");
		  });
		}

		
		return this;
	 },
	 archive_machine : function(location){
		$(".view-content").load(pages+'archive/index.html',function(data, status){
		  if(status == 'success'){
			 dtArchiveMachine.pageDetails().render().actions().modalShowArchiveMachine();
			 dtArchiveCompany.render(location).actions();
		  }
		});
		return this;
	 },
	 accounts: function(account_page){
		if(account_page == 'company'){
		  $(".view-content").load(pages+'accounts/company.html',function(data, status){
			 if(status == 'success'){
				dtAccounts.pageDetails().render().actions();
			 }
		  });
		}
		  if(account_page == 'manager'){
		  $(".view-content").load(pages+'accounts/client.html',function(data, status){
			 if(status == 'success'){
				dtAccClient.pageDetails().render().actions();
			 }
		  });
		}
	 },
	 settings: function(){
		$(".view-content").load(pages+'settings/index.html',function(data, status){
		  if(status == 'success'){
			 dtBranch.pageDetails().render().actions();
			 dtStatus.render().actions();
			 dtBrand.render().actions();
			 dtSapCustomer.render();
			 dtModels.pageDetails().render().actions();
		  }
		});
	 },
	 dashboard_inventory: function(){
		var _self = this;
		 $('.view-content').load(pages+'inventory/home.html',function(data,status,xhr){
		  if(status =='success'){
			 machineInventoryCharts.pageDetails().brands();
		  }
		  
		});
	 },
	 current_inventory: function(){
		var _self = this;
		$('.view-content').load(pages+'inventory/current/index.html',function(data,status){
		  if(status =='success'){
			  dtCurrentInventory.pageDetails()
			  .selectBranch(_self.app_module.app_invnt, _self.branch)
			  .render(_self.app_module.app_invnt, _self.branch, _self.user_role)
			  .modalShow()
			  .modalShowOutMachine()
			  .actions(_self.branch, _self.user_role);
		  }
		});
	 },
	 current_hq_inventory: function(){
		var _self = this;
		$('.view-content').load(pages+'inventory/current/index-hq.html',function(data,status){
		  if(status =='success'){
			  dtCurrentInvtHq.pageDetails().modalViewReservation().render().actions();
		  }
		});
	 },
	current_reservation: function(){
		var _self = this;
		$('.view-content').load(pages+'inventory/current/reservation.html',function(data,status){
		  if(status =='success'){
			  dtCurrentInvtReservation.pageDetails().render().actions();
		  }
		});
	 },
	 current_hq_issuances: function(){
		var _self = this;
		$('.view-content').load(pages+'inventory/current/index-issuances.html',function(data,status){
		  if(status =='success'){
			  dtCurrentInvtIssuances.pageDetails().render().actions();
		  }
		});
	 },
	 archive_inventory: function(){
		var _self = this;
		$('.view-content').load(pages+'inventory/archive/index.html',function(data,status){
		  if(status =='success'){
			 dtArchiveInventory.pageDetails()
			  .selectBranch(_self.app_module.app_invnt, _self.branch)
			  .render(_self.app_module.app_invnt, _self.branch, _self.user_role)
			  .modalShowInMachine()
			  .actions();
		  }
		});
	 },
	archive_reservation: function(){
		var _self = this;
		$('.view-content').load(pages+'inventory/archive/reservation.html',function(data,status){
		  if(status =='success'){
		  		dtArchiveReservation.pageDetails().render();
		  }
		});
	 },
	 settings_inventory: function(){
		$('.view-content').load(pages+'inventory/settings/index.html',function(data,status){
		  if(status =='success'){
			 dtModels.pageDetails().render().actions();
			 dtStatusInventory.render().actions();
			 dtInventoryBranch.render().actions();
		  }
		});
	 },
	 reports: function(report_page){
		var _self = this;
		// if(report_page == 'bn-rf-stock'){
		//   $('.view-content').load(pages+'inventory/reports/bn-rf-stock.html',function(data,status){
		//     if(status =='success'){
		//       reportInvntBnRfTable.pageDetails(_self.branch).table_brand_stock(_self.branch);
						
		//     }
		//   });
		// }
		if(report_page == 'in-out-stock'){
		  $('.view-content').load(pages+'inventory/reports/in-out-stock.html',function(data,status){
			 if(status =='success'){
				reportInvntInOutTable.pageDetails(_self.branch).table_in_out_stock(_self.branch);
						
			 }
		  });
		}
		else if(report_page == 'sap-stock-ho'){
		  $('.view-content').load(pages+'inventory/reports/all-stocks.html',function(data,status){
			 if(status =='success'){
				// reportInvntSapStocks.pageDetails().table_sap_stock();
				reportInvntAlltocks.pageDetails().table_all_stock();
						
			 }
		  });
		}
		else if(report_page == 'machine-deliveries'){
		  $('.view-content').load(pages+'inventory/reports/machine-deliveries.html',function(data,status){
			 if(status =='success'){
				reportInvntMachineDeliver.pageDetails().table_sap_issuances();
						
			 }
		  });
		}
		else if(report_page == 'machine-receipts'){
		  $('.view-content').load(pages+'inventory/reports/machine-receipts.html',function(data,status){
			 if(status =='success'){
				reportInvntReceipts.pageDetails().table_receipts();
						
			 }
		  });
		}
		 else if(report_page == 'sap-sales-summary'){
		  $('.view-content').load(pages+'company/reports/sales-summary.html',function(data,status){
			 if(status =='success'){
				  reportSalesPerAccount.pageDetails().table_sales_summary().action();
						
			 }
		  });
		}
		// else if(report_page == 'sap-details'){
		//   $('.view-content').load(pages+'company/reports/sales-details.html',function(data,status){
		//     if(status =='success'){
		//         reportSalesDetails.pageDetails().dataTable().actions();
						
		//     }
		//   });
		// }
		else{ }
	 },
	 current_mrf: function(){
		var _self = this;
		$('.view-content').load(pages+'mrf/current/index.html',function(data,status){
		  if(status =='success'){
			 dtCurrentMrf.pageDetails().selectBranch(_self.user_mrf_flag).render(_self.app_module.app_mrf, _self.user_role, _self.user_mrf_flag).modalShow(_self.user_mrf_flag).actions();

		  }
		});
	 },
	 archive_mrf: function(){
		var _self = this;
		$('.view-content').load(pages+'mrf/archive/index.html',function(data,status){
		  if(status =='success'){
			 dtArchiveMrf.pageDetails().modalShow()
			 .selectBranch(_self.user_mrf_flag).render().actions();
		  }
		});
	 },
	 settings_mrf: function(){
		$('.view-content').load(pages+'mrf/settings/index.html',function(data,status){
		  if(status =='success'){
			 dtMrfApprover.pageDetails().render().modalShow().actions();
			 dtInventoryBranch.render().actions();
		  }
		});
	 },
	 current_pm: function(){
		var _self = this;
		$('.view-content').load(pages+'pm/current/index.html',function(data,status){
		  if(status =='success'){         
			 dtCurrentSched.pageDetails()
			 .selectBranch()
			 .render()
			 .modalShow()
			 .actions(); 
		  }
		});
	 },
	 archive_pm: function(){
		var _self = this;
		$('.view-content').load(pages+'pm/archive/index.html',function(data,status){
		  if(status =='success'){         
			 dtArchiveSched.pageDetails()
			 .selectBranch()
			 .render()
			 .modalShow()
			 .actions();
		  }
		});
	 },
	 settings_pm: function(){
		$('.view-content').load(pages+'pm/settings/index.html',function(data,status){
		  if(status =='success'){
				dtToner.render().actions();
		  }
		});
	 },
};


  var mifRoutes = { //Routes of different pages.
	 '/login': { 
		before: function(){       
			var user_id = jwt.get('user_id');
				if(user_id != null || parseInt(user_id) > 0){
				  this.setRoute('/mif/dashboard');
				  return false;
				}
		},
		on: function(){
			mifPages.login(this);
		},
		 after: function(){
		  // mifPages.route();
		}
	 },
	 '/mif': { //MIF
		':/dashboard': { //MIF
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'mif',appmodule);
		  },
		  on: function(){
			 window.setTimeout(function(){
				mifPages.mif_dashboard();
			 },1000);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			  },500);
		  }
		},
		':/maps': { //MIF
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'mif',appmodule);
		  },
		  on: function(){
			 window.setTimeout(function(){
				mifPages.mif_maps();
			 },1000);
		  },
		  after: function(){
				$(".content").removeClass('r-content');
		  }
		},
		':/current': {
			 before: function(){ 
			 	var appmodule = jwt.get('app_module'); 
				 	 return mifPages.redirect(this,'mif',appmodule);
			 },
			 on: function(){
			  var location = jwt.get('location');
			  var app_action = jwt.get('app_module_action');
			  var user_mif_flag = jwt.get('user_mif_flag');
				 window.setTimeout(function(){
				  mifPages.current_mif(location, user_mif_flag, app_action.action_mif);
				 },500);
			 },
			 'after': function(){
				window.setTimeout(function(){
				  mifPages.abortAjaxDataTable();
				 },500);
			 }
		  },
		':/archive': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'mif',appmodule);
		  },
		  on: function(){
			 var location = jwt.get('location');
			  window.setTimeout(function(){
				mifPages.archive_machine(location);
			  },500);
			 
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			  },500);
		  }
		},
		':/settings': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'mif',appmodule);
		  },
		  on: function(){
			 window.setTimeout(function(){
				mifPages.settings();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			  },500);
		  }
		}
	 },
	 '/account/:account_page': {
		before: function(){ 
		  var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'',appmodule);
		},
		on: function(account_page){
		  window.setTimeout(function(){
			 mifPages.accounts(account_page);
		  },500);
		},
		'after': function(){
		  window.setTimeout(function(){
			 mifPages.abortAjaxDataTable();
			},500);
		}
	 },
	 '/inventory':{ //Inventory
		':/dashboard': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
		  },
		  on: function(){
				window.setTimeout(function(){
				mifPages.dashboard_inventory();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/current': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
		  },
		  on: function(){
				window.setTimeout(function(){
				mifPages.current_inventory();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/current-ho': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
		  },
		  on: function(){
				window.setTimeout(function(){
				mifPages.current_hq_inventory();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},      
		':/reservation': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
		  },
		  on: function(){
				window.setTimeout(function(){
				mifPages.current_reservation();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/archive': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
		  },
		  on: function(){
			  window.setTimeout(function(){
				mifPages.archive_inventory();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/archive-reservation': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
		  },
		  on: function(){
			  window.setTimeout(function(){
				mifPages.archive_reservation();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/settings':{
		  before: function(){ 
				  var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
		  },
		  on: function(){
			 window.setTimeout(function(){
				mifPages.settings_inventory();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
	 },
	 '/mrf':{ //MRF
		':/current': {
		  // '?((\w?).*)': { 
		  // '/((\w?).*)': { // Optional paramaters, Note: instead whitespace use '---'.
		  // '\/((\w?)|-)+\s*': { 
			 before: function(){ 
				var appmodule = jwt.get('app_module'); 
				  return mifPages.redirect(this,'mrf',appmodule);
			 },
			 on: function(){ //param Id
				  window.setTimeout(function(){
				  mifPages.current_mrf();
				},500);
			 },
			 'after': function(){
				window.setTimeout(function(){
				  mifPages.abortAjaxDataTable();
				},500);
			 }
			// }
		},
		':/archive': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'mrf',appmodule);
		  },
		  on: function(){
				window.setTimeout(function(){
				mifPages.archive_mrf();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/settings':{
		  before: function(){ 
				  var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'mrf',appmodule);
		  },
		  on: function(){
			 window.setTimeout(function(){
				mifPages.settings_mrf();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
	 },
	  '/pm':{ //Preventive Maintenance
		':/current': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'pm',appmodule);
		  },
		  on: function(){
				window.setTimeout(function(){
				mifPages.current_pm();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/archive': {
		  before: function(){ 
			 var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'pm',appmodule);
		  },
		  on: function(){
				window.setTimeout(function(){
				mifPages.archive_pm();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/settings':{
		  before: function(){ 
				  var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'pm',appmodule);
		  },
		  on: function(){
			 window.setTimeout(function(){
				mifPages.settings_pm();
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
	 },
	 '/reports':{
		// ':/bn-rf-stock':{
		//   before: function(){ 
		//         var appmodule = jwt.get('app_module'); 
		//       return mifPages.redirect(this,'inventory',appmodule);
		//     },
		//   on: function(report_page){
		//     window.setTimeout(function(){
		//       mifPages.reports('bn-rf-stock');
		//     },500);
		//   },
		//   'after': function(){
		//     window.setTimeout(function(){
		//       mifPages.abortAjaxDataTable();
		//     },500);
		//   }
		// },
		':/in-out-stock':{
		  before: function(){ 
				  var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
			 },
		  on: function(report_page){
			 window.setTimeout(function(){
				mifPages.reports('in-out-stock');
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/all-stocks':{
		  before: function(){ 
				  var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
			 },
		  on: function(report_page){
			 window.setTimeout(function(){
				mifPages.reports('sap-stock-ho');
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/machine-deliveries':{
		  before: function(){ 
				  var appmodule = jwt.get('app_module'); 
				return mifPages.redirect(this,'inventory',appmodule);
			 },
		  on: function(report_page){
			 window.setTimeout(function(){
				mifPages.reports('machine-deliveries');
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		':/machine-receipts':{
		  before: function(){ 
				var appmodule = jwt.get('app_module'); 
					return mifPages.redirect(this,'inventory',appmodule);
			 },
		  on: function(report_page){
			 window.setTimeout(function(){
				mifPages.reports('machine-receipts');
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		},
		 ':/sap-sales-summary':{
		  before: function(){ 
			var allowed_user_type = [1,2,3,4]; //Executive, Sales, Relation Officer, Techinical
				if(allowed_user_type.indexOf(parseInt(jwt.get('user_type'))) > -1){ // -1 not found
				    return true;
				}
				return false;				 
			 },
		  on: function(report_page){
			 window.setTimeout(function(){
				mifPages.reports('sap-sales-summary');
			 },500);
		  },
		  'after': function(){
			 window.setTimeout(function(){
				mifPages.abortAjaxDataTable();
			 },500);
		  }
		}
	 }
  };

	 var mifRouter = Router(mifRoutes);
	 
			mifRouter.configure({
				async: false,
				strict: false,
				before: function(){ //Check if user is already authenticated.
				  var auth = jwt.get('user_id');
				  if(!auth){
					 // $("div.page-home").empty();
					 this.setRoute('/login');
				  }
				  else{

				  if($("#theme .wrapper").length == 0){ //Check if dashboard already render.
						  var fullname    = jwt.get('fullname');
						  var user_role   = (jwt.get('user_role')   ? jwt.get('user_role')  : jwt.get('position') );
						  var app_module  = (jwt.get('app_module')  ? jwt.get('app_module') : null);
						  var branch      = jwt.get('branch');
						  var companies   = jwt.get('companies');
						  var user_type   = jwt.get('user_type');
						  var user_mrf_flag   = jwt.get('user_mrf_flag');
						  mifPages.app_module = app_module; //Add new properties object.
						  mifPages.branch     = branch;
						  mifPages.user_role  = user_role;
						  mifPages.companies  = companies;
						  mifPages.user_type  = user_type;
						  mifPages.user_mrf_flag = user_mrf_flag;
						  mifPages.route();
						  mifPages.dashboard(fullname, user_role, app_module);
						  
						  scrollTop(); //Auto scroll to top.
						}
				  }
				
			 },
			 notfound: function(){ alert('404 PAGE NOT FOUND!'); }
		});


		mifRouter.init(['/login']);

});

