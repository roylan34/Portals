var dtArchiveSched = {
    dtInstance: {},
    pageDetails: function(){
                $(".content-header h1").text("Preventive Maintenance");
                $(".content-header h1").append("<small>Archive</small>");
            return this;
    },
    render: function(){ 
        // document.title = "MIF"; // Change the title tag.
        this.dtInstance = $("#dtArchiveSched").DataTable({
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
                    "url"  : assets+"php/pm/getScheduleList.php",
                    "type" : "POST",
                    "dataSrc": "records",
                    beforeSend: function(){ $(".dt-buttons a").addClass('disabled'); }, 
                    "data" : function(d){
                        
                            d.action = "archive";
                            d.pm_number    = $("#search-archive-sched-pmnumber").val() || '';
                            d.company_name = $("#search-archive-sched-company").val() || '';
                            d.sched_date   = $("#search-archive-sched-schedule").val() || '';
                            d.technician   = $("#search-archive-sched-technician").val() || '';
                            d.branch       = Cookies.get('branch_pm');
                            d.pm_type      = Cookies.get('pm_type');
                            d.userid       = Cookies.get('user_id');
                    },
                    complete: function(){ $(".dt-buttons a").removeClass('disabled'); }
                  },
                 "buttons": [
                                {
                                    text: '<i class="fa fa-refresh" aria-hidden="true" title="Refresh"></i>',
                                    tag: 'a',
                                    className: 'btn-archive-refresh-pm',
                                    action: function ( e, dt, node, config ) {
                                        self.dtArchiveSched.dtInstance.ajax.reload(null, true);
                                    }
                                },
                                {
                                    extend: "print",
                                    exportOptions: { columns: [0,1,2,3,4,5,6] },
                                    // autoPrint: false,
                                    className: 'dt-archive-sched-print hidden-xs',
                                    customize: function(win){
                                        var elem = $(win.document.body);
                                            elem.find('h1').remove();
                                            elem.prepend("<h4>Preventive Maintenance <small>schedule list</small></h4>"); 
                                    }
                                },
                                {
                                    text: 'Open Search Filter',
                                    className: 'dt-archive-button-schedsearch',
                                    action: function ( e, dt, node, config ) {
                                        $("#dt-head-archive-schedsearch").slideToggle('fast',function(){
                                            if($(this).is(':visible')){
                                                node[0].innerText = 'Close Search Filter';
                                            }else{
                                               node[0].innerText = 'Open Search Filter';
                                               $("#dt-head-archive-schedsearch input[type='text']").val('');  //
                                                //self.dtArchiveSched.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
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
                                return "<span class=''>" + data.pm_number + "</span>";
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.company_name + "</span>"; 
                                }
                            },
                            { data: null,  render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.schedule_date + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                var technician =  data.technician || '';
                                return "<span class='text-center'>" + technician + "</span>"; 
                                }
                            },      
                            { data:  null, render: function( data, type, full, meta ){
                                return "<span class='text-center'>" + data.date_entered + "</span>"; 
                                }
                            },
                            { data:  null, render: function( data, type, full, meta ){
                                    var badge_color = '';
                                    var status = data.status.toUpperCase() || '';
                                            if(status == 'CLOSE'){
                                                badge_color = 'badge-green';
                                                status = 'CLOSE PM';
                                            }
                                            else if(status == 'CANCEL'){
                                                badge_color = 'badge-orange';                                               
                                            }
                                            else
                                            { badge_color; }

                                    return "<span class='badge "+badge_color+"'>" + status + "</span>";
                                }
                            },                            
                            { data:  null, render: function( data, type, full, meta ){
                                  var action_pm = JSON.parse(Cookies.get('app_module_action'));
                                    if(action_pm && action_pm.action_pm == "wr"){
                                        return "<button class='btn btn-xs btn-success btn-flat btnPM' data-pmnumber='"+data.pm_number+"' data-comp-id='"+data.company_id+"' data-toggle='modal' data-target='#modalArchivePMList'>PM</button>";
                                    }
                                    return '';
                                }
                            },
                         
                 ],
                 "columnDefs": [
                        { responsivePriority: 1, target: 0},

                 ],
                "deferRender": true,
                "preDrawCallback": function(settings){
                        $(".dt-archive-button-schedsearch, .dt-archive-sched-print, .btn-archive-refresh-pm").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                        $(".dt-archive-sched-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title','Print');
                }
       
        });
        return this;
    },
    modalShow: function(){ //Show form modal.
        $("#displayPMList").load(pages+'pm/archive/pm.html',function(){
            dtArchivePM.actions();
            
            //When Hidden PM modal.
            $('#modalArchivePMList').on('hidden.bs.modal', function() { //Reset form when modal hidden     
                $(this).find("input[type='hidden']").val('');        
            });

        });

        return this;
    },
    actions: function(){
                $("table#dtArchiveSched").on('click','button, a',function (e) {
                    e.preventDefault();

                    var inst = $(this);
                    var button_label = inst.text().toLowerCase();

                    //Highlight row selected.
                    if ( !inst.closest('tr').hasClass('selected') ) {  
                        self.dtArchiveSched.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }
                    if (button_label == 'pm') {
                        var idcompany_pm = $(this).data('comp-id');
                        var pmnumber = $(this).data('pmnumber');
                           dtArchivePM.render(pmnumber, idcompany_pm);
                    }
                    //Search button
                    if(button_label == "search"){
                        self.dtArchiveSched.dtInstance.ajax.reload(null, true);
                    }
                     //Reset button
                    if(button_label =="reset"){
                        $("#dt-head-archive-schedsearch input[type='text']").val('');  //
                        self.dtArchiveSched.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                    }
                } );
        return this;
    }

};
