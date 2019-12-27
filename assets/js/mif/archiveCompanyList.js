var dtArchiveCompany = {
    dtInstance: {},
    dtInstanceLogs: null,
    btn: $("button[type='submit']"),
    render: function (paramBranch) {
        // document.title = "MIF"; // Change the title tag.
        this.dtInstance = $("#dtArchiveCompany").DataTable({
            "dom": 'Blrtip',
            "autoWidth": false,
            "responsive": true,
            "pageLength": 25,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "language": {
                "processing": '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                "infoEmpty": 'No entries to show'
            },
            "processing": true,
            "serverSide": true,
            "bDestroy": true,                                             //destroy existing datatable
            // // "bFilter"   : false,                                         //disable the global filtering
            // "bStateSave": true,                                          //save the pagination #, ordering, show records # and etc
            "ordering": false,
            "ajax": {
                "url": assets + "php/company/getCompanyList.php",
                "type": "POST",
                "dataSrc": "records",
                beforeSend: function () { $(".dt-buttons a").addClass('disabled'); },
                "data": function (d) {
                    var search_branch = $("#search-archive-branch").chosen().val();
                    d.company = $("#search-archive-companyname").val();
                    d.category = $("#search-archive-category").val();
                    d.s_branch = (paramBranch == 1 ? search_branch : (search_branch ? search_branch : paramBranch));
                    d.accmngr = $("#search-archive-accmngr").chosen().val();
                    d.s_location = $("#search-archive-location").chosen().val();

                    d.action_view = "archive_company";
                    d.branch = (paramBranch == '1' ? null : paramBranch);
                },
                complete: function () { $(".dt-buttons a").removeClass('disabled'); }
            },
            "buttons": [
                {
                    extend: "excel",
                    className: 'dt-company-excel hidden-xs',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                        stripNewlines: false
                        // format: {
                        //     body: function ( data, column, row ) {
                        //         return column === 5 ?
                        //             data.replace(/<br\s*\/?>/ig, "\r\n"):
                        //             data;
                        //     } 
                        // }
                    },
                    filename: 'Archive Company ' + getTodayDate()
                },
                {
                    extend: "print",
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        format: {
                            body: function (data, column, row) {
                                return column === 5 ?
                                    data.replace(/<br\s*\/?>/gi, '"' + "\r\n" + '"') :
                                    data;
                            }
                        }
                    },
                    // autoPrint: false,
                    className: 'dt-company-print hidden-xs',
                    customize: function (win) {
                        $(win.document.body).find(".dt-column-branches").css('max-height', '0px !important');
                    }
                },
                {
                    text: 'Open Search Filter',
                    className: 'dt-button-search',
                    action: function (e, dt, node, config) {
                        $("#dt-head-search").slideToggle('fast', function () {
                            if ($(this).is(':visible')) {
                                node[0].innerText = 'Close Search Filter';
                            } else {
                                node[0].innerText = 'Open Search Filter';
                                $("#dt-head-search input[type='text']").val('');  //
                                $("#search-company-branch, #search-company-accmngr, #search-company-location").val(0).trigger('chosen:updated'); //reset
                                self.dtArchiveCompany.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
                            }
                        });
                    }
                }
            ],
            "columns": [
                {
                    data: null, render: function (data, type, row, meta) {
                        return meta.row + 1; //DataTable autoId for sorting.
                    }
                },
                {
                    data: null, render: function (data, type, row, meta) {
                        var sap_code = data.sap_code || null;
                        if (sap_code != null) {
                            return "<span class='text-center'><a href='#' title='View SAP Details' id='modalSapDetails'>" + sap_code + "</a></span>";
                        } else {
                            return '---';
                        }
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        var badge_color = '';
                        var comp = data.delsan_company;
                        if (comp == 'dosc') {
                            badge_color = 'green';
                        }
                        else if (comp == 'dbic') {
                            badge_color = 'blue';
                        }
                        else { badge_color; }
                        return "<span class='badge badge-" + badge_color + "'>" + comp.toUpperCase() + "</span>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<span class=''>" + data.company_name + "</span>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<span class='text-center'>" + data.client_category + "</span>";
                    }
                },
                // { data:  null, "width": "20%", render: function( data, type, full, meta ){
                //         return "<span class='text-center'><a href='#' title='View Map' id='modalMap' data-toggle='modal' data-target='#modalMap'>" + data.address + "</a></span>"; 
                //     }
                // },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<div class='text-left dt-column-branches'>" + isEmpty(data.main_location) + "</div>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<div class='text-left dt-column-branches'>" + isEmpty(data.branches) + "</div>";
                    }
                },
                // { data:  null, render: function( data, type, full, meta ){
                //     return "<span class='text-center'>" + isEmpty(data.contact_no) + "</span>";
                //     }
                // },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<span class='text-center'>" + isEmpty(data.account_mngr_name) + "</span>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<span class='text-left' style='color:#dd4b39'> BLOCKED </span>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<span class='text-center'>" + isEmpty(data.date_last_visit) + "</span>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        var action_edit = jwt.get('app_module_action');
                        if (action_edit && action_edit.action_mif == "wr") {
                            return "<button class='btn btn-xs btn-success btn-flat btnEditComp' data-comp='" + data.id + "'>Retrieve</button>";
                        }
                        return '';
                    }
                },
            ],
            "columnDefs": [
                { responsivePriority: 1, target: 0 },
                { responsivePriority: 2, target: 1 }

            ],
            "deferRender": true,
            "preDrawCallback": function (settings) {
                $(".dt-button-search, .dt-company-excel, .dt-company-print, .dt-button-add").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({ "margin-bottom": "0.5em", "margin-right": "0.5em" });
                $(".dt-company-print").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title', 'Print');
                $(".dt-company-excel").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title', 'Export to Excel');
            }

        });
        return this;
    },
    modalShow: function (idcompany) { //Show form modal.
        $("#displayFormCompany").load(pages + 'archive/retrieve-company.html', function (data, status, xhr) {
            $('#modalArchiveCompanyList').modal('show');
            var user_branch = jwt.get('location');
            autoDrpDown.getBranchNameMulti("#slctCompanyBranch", "100%", user_branch, true);
            autoDrpDown.getBranchNameMulti("#slctCompanyLocation", "100%", user_branch, true);
            autoDrpDown.getClientName("#slctClientMngr", "100%");
            autoDrpDown.getSapCompany("#txtSapCompany", true);

            if (idcompany != null) {
                var $btn = $("button[type='submit']");
                $.ajax({
                    type: 'GET',
                    url: assets + 'php/company/getCompanyById.php',
                    data: { idcompany: idcompany },
                    dataType: 'json',
                    beforeSend: function () { $btn.button('loading'); },
                    success: function (data) {
                        var res_data = data.aaData[0];
                        $("#hdnIdCompany").val(res_data.id);
                        $("#txtEditCompany").val(res_data.company_name);
                        $("#txtSapCode").val(res_data.sap_code);
                        $("#txtSapCompany").val(res_data.sap_code).trigger('chosen:updated');
                        $("#OldhdnEditCompany").val(res_data.company_name);
                        $("#txtEditCategory").val(res_data.client_category);
                        $("#txtEditAddress").val(res_data.address);
                        $("#txtContactNo").val(res_data.contact_no);
                        $("input[name='delsanCompany'][value='" + res_data.delsan_company + "']").prop('checked', true);
                        $("#OldhdnClientMngr").val(res_data.id_client_mngr);
                        $("#slctClientMngr").val(res_data.id_client_mngr).trigger('chosen:updated');
                        $("#slctCompanyBranch").val((res_data.id_branches == null ? null : res_data.id_branches.split(","))).trigger('chosen:updated');
                        $("#slctCompanyLocation").val((res_data.main_location == null ? null : res_data.main_location)).trigger('chosen:updated');
                        $("#OldIdBranches").val(res_data.id_branches);
                        $("#slctStatus").val(res_data.status);
                        $("#txtLastVisit").val(res_data.date_last_visit);
                    },
                    error: function (data, xhr, status) { promptMSG('warning', 'ID Machine not exist.'); },
                    complete: function () { $btn.button('reset'); }
                });
            }
        });
    },
    retrieve: function () { //Retrieve.
        var $btn = $("button[type='submit']");
        var id = $("#hdnIdCompany").val();
        var company = $("#txtEditCompany").val();
        var category = $("#txtEditCategory").val();
        var address = $("#txtEditAddress").val();
        var branch = ($("#slctCompanyBranch").chosen().val() ? $("#slctCompanyBranch").chosen().val().toString() : '');
        var location = ($("#slctCompanyLocation").chosen().val() ? $("#slctCompanyLocation").chosen().val().toString() : '');
        var contactno = $("#txtContactNo").val();
        var sap_code = $("#txtSapCode").val();
        var delsan_comp = $("input[name='delsanCompany']:checked").val();
        // var client_service =  $("#slctClientTypeService option:selected").val();
        var accmngr = $("#slctClientMngr").chosen().val();
        var oldaccmngr = $("#OldhdnClientMngr").val();
        var oldbranch = $("#OldIdBranches").val();
        var status = $("#slctStatus option:selected").val();
        var user_id = jwt.get('user_id');
        var last_visit = $("#txtLastVisit").val();
        var data = {
            idcompany: id, company: company, category: category, address: address, location: location, branch: branch, contactno: contactno, accmngr: accmngr,
            oldaccmngr: oldaccmngr, oldbranch: oldbranch, status: status, user_id: user_id, last_visit: last_visit, sap_code: sap_code, delsan_comp: delsan_comp
        };
        $.ajax({
            type: 'POST',
            url: assets + 'php/company/updateCompany.php',
            data: data,
            dataType: 'json',
            beforeSend: function () { $btn.button('loading'); },
            success: function (data) {
                self.dtArchiveCompany.dtInstance.ajax.reload(null, false); // Reload the data in DataTable.
                autoDrpDown.cacheOptComp.splice(0, 1); //Clear cache option, if update company name.
                promptMSG('success-update', 'Company', null, null, true, true);
            },
            error: function (xhr, status) { alert(xhr + status); },
            complete: function () { $btn.button('reset'); }

        });
    },
    actions: function () {
        $("table#dtArchiveCompany").on('click', 'button, a', function (e) {
            e.preventDefault();

            var inst = $(this);
            var button_label = inst.text().toLowerCase();

            //Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                self.dtArchiveCompany.dtInstance.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            //Show modal edit
            if (button_label == 'retrieve') {
                var idcompany = $(this).data('comp');
                self.dtArchiveCompany.modalShow(idcompany);

            }

            //Search button
            if (button_label == "search") {
                self.dtArchiveCompany.dtInstance.ajax.reload(null, true);
                // var branch = jwt.get('location');
                // self.dtArchiveCompany.render(branch); 
            }
            //Reset button
            if (button_label == "reset") {
                $("#dt-head-search input[type='text']").val('');  //
                $("#search-archive-branch, #search-archive-accmngr, #search-archive-location").val(0).trigger('chosen:updated'); //reset
                self.dtArchiveCompany.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
            }
        });
        return this;
    },
};
