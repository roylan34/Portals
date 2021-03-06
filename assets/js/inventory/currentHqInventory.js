//Current
var dtCurrentInvtHq = {
    dtInstance: null,
    selectedBranch: null,
    pageDetails: function () {
        $(".content-header h1").text("Machine Inventory");
        $(".content-header h1").append("<small>Current</small>");
        return this;
    },
    render: function () {
        // document.title = "Inventory"; // Change the title tag.
        this.dtInstance = $('#dtCurrentInvtHq').DataTable({
            "dom": "Bl<'dropdown-bulk col-md-3 col-xs-12'>rtip",
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
                    extend: "excel",
                    className: 'btn-excel-inventory hidden-xs',
                    exportOptions: { columns: [1, 2, 3, 4, 5] },
                    filename: 'SAP - BN Stocks HO ' + getTodayDate()
                },
                {
                    extend: "print",
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5] },
                    // autoPrint: false,
                    className: 'btn-print-inventory hidden-xs',
                    customize: function (win) {
                        var elem = $(win.document.body);
                        elem.find('h1').remove();
                        elem.prepend("<h4>SAP - BN Stocks HO</h4>");

                    }
                },
                {
                    text: 'Open Search Filter',
                    className: 'btn-search-inventory',
                    action: function (e, dt, node, config) {
                        $(".dthead-search-invnt-hq").slideToggle('fast', function () {
                            if ($(this).is(':visible')) {
                                node[0].innerText = 'Close Search Filter';
                            } else {
                                node[0].innerText = 'Open Search Filter';
                                $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //		                                                  
                                dtCurrentInvtHq.dtInstance.ajax.reload(null, true);
                            }
                        });
                    }
                }
            ],
            "ajax": {
                "url": assets + 'php/inventory/sapHQInventory.php',
                "type": "POST",
                "dataSrc": "records",
                data: function (d) {
                    d.serialnumber = $(".search-hq-serial").filter(':visible').val() || '';
                    d.brand = $(".search-hq-brand").filter(':visible').val() || '';
                    d.model = $(".search-hq-model").filter(':visible').val() || '';
                    d.location = $(".search-hq-location").filter(':visible').val() || '';
                    d.date = $(".search-hq-date").filter(':visible').val() || '';
                }
            },
            "columns": [
                {
                    "data": null, "width": "20px", "render": function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                { "data": "serialnumber", "width": "160px" },
                { "data": "brand", "width": "160px" },
                {
                    "data": null, "width": "160px", render: function (data) {
                        var model = data.model || "---";
                        return model;
                    }
                },
                {
                    "data": null, "width": "160px", render: function (data) {
                        var location = data.location || "---";
                        return location;
                    }
                },
                {
                    "data": null, "width": "160px", render: function (data) {
                        var date_entered = data.date_entered || "---";
                        return date_entered;
                    }
                },
                {
                    "data": null, "width": "160px", render: function (data) {
                        return "<a href='#' class='btnViewReservation' title='View Reservation Details' data-id-reservation='" + data.id_reservation + "'>" + data.label + "</a>";
                    }
                }
            ],
            "preDrawCallback": function (settings) {
                $(".btn-excel-inventory, .btn-print-inventory, .btn-search-inventory").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({ "margin-bottom": "0.5em", "margin-right": "0.5em" });
                $(".btn-print-inventory").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title', 'Print');
                $(".btn-excel-inventory").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title', 'Export to Excel');
            }
        });
        return this;
    },
    modalViewReservation: function () {
        $("#displayFormReservation").load(pages + 'inventory/current/view-reservation.html', function () {
            $(this).find("#modalViewReservation").on('hidden.bs.modal', function () {
                $(this).find(".tbl-view-reservation tbody").empty();
            })
        });
        return this;
    },
    handleViewReservation: function (id) {

        if (id && id != "") {
            $.ajax({
                type: 'POST',
                url: assets + 'php/inventory/viewReservationDetails.php',
                data: { id_reservation: id },
                dataType: 'json',
                success: function (data, xhr, status) {
                    var details = data.aaData[0];
                    var elem_td = '<tr><td>' + details.serial_number + '</td>' +
                        '<td>' + details.acct_mngr + '</td>' +
                        '<td>' + details.company_name + '</td>' +
                        '<td>' + details.date_reserved + '</td>' +
                        '<td>' + details.created_at + '</td></tr>';

                    $(".tbl-view-reservation tbody").append(elem_td);
                    $("#modalViewReservation").modal('show');
                },
                error: function (xhr, status) { alert(xhr + status); },

            });
        }

    },
    actions: function () {

        $("#dtCurrentInvtHq").on('click', 'button, a', function (e) {
            e.preventDefault();
            var inst = $(this);
            var button_label = inst.text().toLowerCase();

            //Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                self.dtCurrentInvtHq.dtInstance.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            //Search button
            if (button_label == "search") {
                self.dtCurrentInvtHq.dtInstance.ajax.reload(null, true);
            }
            //Reset button
            if (button_label == "reset") {
                $(".dt-head-search input[type='text'], .dt-head-search select").val('');  //Clear all values;
                self.dtCurrentInvtHq.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
            }
            //View Reservation
            if (button_label == "reserved") {
                var id = inst.data('id-reservation');
                self.dtCurrentInvtHq.handleViewReservation(id);
            }
        });
        return this;
    },

};