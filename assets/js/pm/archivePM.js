var dtArchivePM = { //For development
    dtInstance: {},
    render: function(pmNumber, companyId){ 
        this.dtInstance = $("#dtArchivePM").DataTable({
                "dom"       : 'Blrtip', 
                "autoWidth" : false,
                "responsive": true,
                "pageLength": 25,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                "language": {
                            "processing": '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                            "infoEmpty": 'No entries to show'
                        },
                "processing": true,
                "serverSide": true,
                "bDestroy"  : true,                                             //destroy existing datatable
                "ordering" : false,
                    "ajax" : {
                    "url"  : assets+"php/pm/getPMList.php",
                    "type" : "POST",
                    "dataSrc": "records",
                    beforeSend: function(){ $(".dt-buttons a").addClass('disabled'); }, 
                    "data" : function(d){                       
                            d.action = "archive";
                            d.pm_number  = pmNumber;
                            d.company_id = companyId;
                            d.serialnumber = $("#search-archive-pm-serial").val() || ''; 
                            d.brand = $("#search-archive-pm-brand").val() || '';   
                            d.model = $("#search-archive-pm-model").val() || '';                            
                            d.location   = $("#search-archive-pm-loc").val() || '';                            
                            d.department = $("#search-archive-pm-dept").val() || '';                            
                    },
                    complete: function(data){ $(".dt-buttons a").removeClass('disabled'); }
                  },
                 "buttons": [
                                {
                                    text: '<i class="fa fa-refresh" aria-hidden="true" title="Refresh"></i>',
                                    tag: 'a',
                                    className: 'btn-archive-refresh-pm',
                                    action: function ( e, dt, node, config ) {
                                        self.dtArchivePM.dtInstance.ajax.reload(null, true);
                                    }
                                },
                                {
                                    extend: "print",
                                    exportOptions: { columns: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] },
                                    // autoPrint: false,
                                    className: 'dt-archive-pm-print hidden-xs',
                                    customize: function(win){
                                         var elem = $(win.document.body);
                                            elem.find('h1').remove();
                                            elem.prepend("<h4>Preventive Maintenance</h4>"); 
                                    }
                                },
                                {
                                    text: 'Open Search Filter',
                                    className: 'dt-button-archive-pmsearch',
                                    action: function ( e, dt, node, config ) {
                                        $("#dt-head-search").slideToggle('fast',function(){
                                            if($(this).is(':visible')){
                                                node[0].innerText = 'Close Search Filter';
                                            }else{
                                               node[0].innerText = 'Open Search Filter';
                                               $("#dt-head-search input[type='text']").val('');  //
                                               // $("#search-company-branch, #search-company-accmngr, #search-company-location").val(0).trigger('chosen:updated'); //reset
                                                //self.dtArchivePM.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                                            }
                                        });
                                    }
                                }
                            ],
                "columns"  : [
                            { data: null, render: function (data, type, row, meta) {
                                        return meta.row + 1; //DataTable autoId for sorting.
                                }       
                            },
                            { data: null, render: function( data, type, full, meta ){
                                return "<span class=''>" + data.serialnumber + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.brand_name + "</span>"; 
                                }
                            },
                            { data: null,  render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.model + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.location_area + "</span>"; 
                                }
                            },      
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.department + "</span>"; 
                                }
                            },    
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.no_of_user + "</span>"; 
                                }
                            },                         
                            { data:  null, render: function( data, type, full, meta ){
                                var date_installed = (data.date_installed != '0000-00-00' && data.date_installed != null ? data.date_installed : '');
                                return "<span class='text-center'>" + date_installed + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.unit_owned + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                var manufac_date = (data.manufacture_date != '0000-00-00' && data.manufacture_date != null ? data.manufacture_date : '');
                                return "<span class='text-center'>" + manufac_date + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.remarks + "</span>"; 
                                }
                            }, 
                             { data:  null, render: function( data, type, full, meta ){
                                var page_count = data.page_count || '';
                                return "<span class='text-center'>" + page_count + "</span>"; 
                                }
                            }, 
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.toner_use + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var time_in = (data.time_in != '0000-00-00 00:00:00' && data.time_in != null ? data.time_in : '');
                                return "<span class='text-center'>" + time_in + "</span>"; 
                                }
                            },   
                            { data:  null, render: function( data, type, full, meta ){
                                 var time_out = (data.time_out != '0000-00-00 00:00:00' && data.time_out != null ? data.time_out : '');
                                return "<span class='text-center'>" + time_out + "</span>"; 
                                }
                            },                              
                         
                 ],
                 "columnDefs": [
                        { responsivePriority: 1, target: 1},

                 ],
                "deferRender": true,
                "fnCreatedRow": function( row, data ) {
                        $('td:eq(10)',row).addClass('border-left');                                  
                },
                "preDrawCallback": function(settings){
                        $(".dt-button-archive-pmsearch, .dt-archive-pm-print, .btn-archive-refresh-pm").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                        $(".dt-archive-pm-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                }
       
        });
        return this;
    },
    actions: function(){
                $("#modalArchivePMList").on('click','button, a',function (e) {
                    e.preventDefault();

                    var inst = $(this);
                    var button_label = inst.text().toLowerCase();

                    //Search button
                    if(button_label == "search"){
                        self.dtArchivePM.dtInstance.ajax.reload(null, true);
                    }
                     //Reset button
                    if(button_label =="reset"){
                        $("#dt-head-search input[type='text']").val('');  //
                        self.dtArchivePM.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                    }
                } );
        return this;
    },

};
