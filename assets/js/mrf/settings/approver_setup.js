var dtMrfApprover = {
    dtInstance: {},
    pageDetails: function(){
                $(".content-header h1").text("MRF");
                $(".content-header h1").append("<small>Settings</small>");
            return this;
      },
    render: function(){ 
                this.dtInstance = $("#dtMrfApprover").DataTable({
                    "dom"       : 'fBlrtip', 
                    "autoWidth" : false,
                    "responsive": true,
                    "pageLength": 10,
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                     "oLanguage": {
                                    "bProcessing": true,
                                    "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                                    "sInfoEmpty": 'No entries to show'
                                },
                    "bDestroy"  : true,                                          //destroy existing datatable
                    "bStateSave": true,                                          //save the pagination #, ordering, show records # and etc
                    "ordering" : false,
                        "ajax" : {
                                    "url"  : assets+"php/mrf/settings/approver_setup.php",
                                    "type" : "GET",
                                    "data": { action: 'view-all' }                         
                      },
                        "buttons": [
                                {
                                    text: '<i class="fa fa-refresh" aria-hidden="true"></i>',
                                    tag: 'a',
                                    className: 'btn-refresh-approver',
                                    action: function ( e, dt, node, config ) {
                                        self.dtMrfApprover.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                                        autoDrpDownMrf.cacheOptAccountMrf.splice(0,1); //Clear cache account.
                                    }
                                }
                        ],
                    "columns"  : [
                                { data:  null, render: function( data, type, full, meta ){
                                        return "<span class='text-center'>" + data.branch_name + "</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                      var first_approver = data["1st_approver"];
                                       return "<span class='text-center'>" + first_approver + "</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                      var second_approver = data["2nd_approver"];
                                      var second_approver_2 = data["2nd_approver_2"];
                                       return "<span class='text-center'>" + second_approver +"<br>"+ second_approver_2 +"</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                      var third_approver = data["3rd_approver"];
                                       return "<span class='text-center'>" + third_approver + "</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                      var fourth_approver = data["4th_approver"];
                                      var fourth_approver_2 = data["4th_approver_2"];
                                        return "<span class='text-center'>" + fourth_approver +"<br>"+ fourth_approver_2 +"</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                      var releaseby_approver = data["releaseby_approver"];
                                        return "<span class='text-center'>" + releaseby_approver +"</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                      var fifth_approver = data["5th_approver"];
                                      var fifth_approver_2 = data["5th_approver_2"];
                                        return "<span class='text-center'>" + fifth_approver +"<br>"+ fifth_approver_2 +"</span>";
                                    }
                                },
                                { data:  null, render: function( data, type, full, meta ){
                                      return "<button class='btn btn-xs btn-success btn-flat btnUpdateMrfApprover' data-mrf-approver='"+data.id+"' data-toggle='modal' data-target='#modalFormMrfSettingsApprover'>Update</button>";
                                    }
                                }
                     ],
                     "columnDefs": [
                                { responsivePriority: 1, target: 0},
                     ],
                     "preDrawCallback": function(settings){
                           $(".btn-refresh-approver").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-xs").css({"margin-bottom":"0.5em","margin-right":"0.5em"});
                    },
                    "deferRender": true
                });
        return this;
    },
    modalShow: function(id_branch){ 
              $("#displayFormMrfEntry").load(pages+'mrf/settings/form-approver.html',function(data,status,xhr){

                autoDrpDownMrf.getAccountHasMrf("#slct1stApprover",1); //Executive
                autoDrpDownMrf.getAccountHasMrf("#slct2ndApprover",1); //Executive
                autoDrpDownMrf.getAccountHasMrf("#slct2ndApprover_2",1); //Executive
                autoDrpDownMrf.getAccountHasMrf("#slct3rdApprover",5); //Engineering Allocation
                autoDrpDownMrf.getAccountHasMrf("#slctReleaseApprover",5); //Engineering Release
                autoDrpDownMrf.getAccountHasMrf("#slct4thApprover",6); //Accounting
                autoDrpDownMrf.getAccountHasMrf("#slct4thApprover_2",6); //Accounting 2
                autoDrpDownMrf.getAccountHasMrf("#slct5thApprover",7); //Logistics
                 autoDrpDownMrf.getAccountHasMrf("#slct5thApprover_2",7); //Logistics 2

                 $('#modalFormMrfSettingsApprover').on('hidden.bs.modal', function () {
                    $(this).find("input").parent('.col-sm-5').removeClass('has-error has-success')
                    $(this).find("em").remove();
                    $(this).find("#frmSettingMrfApprover input:hidden").val('');
                    $(this).find("#frmSettingMrfApprover").trigger('reset');
                 });

             });
          return this;
    },
    getData: function(id){
            if(id != ''){
                 var $btn = $("button[type='submit']");
                $.ajax({
                    type: 'GET',
                    url : assets+'php/mrf/settings/approver_setup.php',
                    data: {action:'view-id', id_setup: id},
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        $.each(data.aaData,function(key,val){
                            $("#hdnIdMrfSettingsApprover").val(val.id);
                            $("#hdnIdMrfSettingsApproverBranch").val(val.id_branch);
                            $("#lblMrfSettingApproverBranch").text(val.branch_name);
                            $("#slct1stApprover").val(val['1st_approver']);                                   
                            $("#slct2ndApprover").val(val['2nd_approver']);
                            $("#slct2ndApprover_2").val(val['2nd_approver_2']);                                                                      
                            $("#slct3rdApprover").val(val['3rd_approver']);                                   
                            $("#slct4thApprover").val(val['4th_approver']);
                            $("#slct4thApprover_2").val(val['4th_approver_2']);                                    
                            $("#slctReleaseApprover").val(val['releaseby_approver']);                                    
                            $("#slct5thApprover").val(val['5th_approver']);
                            $("#slct5thApprover_2").val(val['5th_approver_2']);                                     
                      
                        }); 
                    },
                    error: function(data,xhr,status){ alert('ID Machine not exist.'); },
                    complete: function(){ $btn.button('reset'); }
                 });
            }
            else{ 
                alert('ID is empty.');
            }
    },
    update: function(){
            var $btn     = $("button[type='submit']");
            var id           = $("#hdnIdMrfSettingsApprover").val();
            var approver_1  = $("#slct1stApprover option:selected").val();
            var approver_2  = $("#slct2ndApprover option:selected").val();
            var approver_2_2  = $("#slct2ndApprover_2 option:selected").val();
            var approver_3  = $("#slct3rdApprover option:selected").val();
            var approver_4  = $("#slct4thApprover option:selected").val();
            var approver_4_2  = $("#slct4thApprover_2 option:selected").val();
            var approver_release  = $("#slctReleaseApprover option:selected").val();
            var approver_5  = $("#slct5thApprover option:selected").val();
            var approver_5_2  = $("#slct5thApprover_2 option:selected").val();
            var id_user = Cookies.get('user_id');
            var branch  =  $("#hdnIdMrfSettingsApproverBranch").val();

               $.ajax({
                    type: 'POST',
                    url : assets+'php/mrf/settings/approver_setup.php',
                    data: {action:'update', id_setup: id, id_user:id_user, branch:branch, approver_1: approver_1, approver_2:approver_2, approver_2_2:approver_2_2, approver_3:approver_3,approver_4:approver_4, approver_4_2:approver_4_2, approver_5:approver_5, approver_5_2:approver_5_2, approver_release:approver_release },
                    dataType: 'json',
                    beforeSend: function(){ $btn.button('loading'); },
                    success: function(data){
                        self.dtMrfApprover.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                        autoDrpDownMrf.cacheOptAccountMrf.splice(0,1); //Clear cache account.                         
                    },
                    error: function(data,xhr,status){ alert("Something went wrong."); },
                    complete: function(){ $btn.button('reset'); }
                 });
    },
    actions: function(){ //Show Add/Update Form
          $("table#dtMrfApprover").on('click', 'button', function () {
                    var inst = $(this);
                    if ( !inst.closest('tr').hasClass('selected') ) {  //Highlight row selected.
                        self.dtMrfApprover.dtInstance.$('tr.selected').removeClass('selected');
                        inst.closest('tr').addClass('selected');
                    }

                    //Show modal update
                    if (inst.hasClass('btnUpdateMrfApprover')) {
                        var id = $(this).data('mrf-approver');
                        self.dtMrfApprover.getData(id);
                    }
                } );

          $("#addInventoryBranch").click(function(e){
                self.dtMrfApprover.modalShow();
          });
           return this;
    },
};
