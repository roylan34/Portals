//Archive
var dtArchiveReservation = {
    dtInstance: null,
    selectedBranch: null,
    pageDetails: function () {
        $(".content-header h1").text("Machine Inventory");
        $(".content-header h1").append("<small>Archive</small>");
        return this;
    },
    render: function () {
        this.dtInstance = $('#dtArchiveReservation').DataTable({
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
                    extend: "excel",
                    className: 'btn-excel-inventory hidden-xs',
                    exportOptions: { columns: [1, 2, 3, 4, 5, 6] },
                    filename: 'Inventory Reservation ' + getTodayDate()
                },
                {
                    extend: "print",
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] },
                    className: 'btn-print-inventory hidden-xs',
                    customize: function (win) {
                        var elem = $(win.document.body);
                        elem.find('h1').remove();
                        elem.prepend("<h4>Inventory Reservation</h4>");

                    }
                },
                {
                    text: 'Open Search Filter',
                    className: 'btn-search-inventory',
                    action: function (e, dt, node, config) {
                        $(".dthead-search-reserve").slideToggle('fast', function () {
                            if ($(this).is(':visible')) {
                                node[0].innerText = 'Close Search Filter';
                            } else {
                                node[0].innerText = 'Open Search Filter';
                                $(".dthead-search-reserve input[type='text']").val('');  //		                                                  
                                dtArchiveReservation.dtInstance.ajax.reload(null, true);
                            }
                        });
                    }
                }
            ],
            "ajax": {
                "url": assets + 'php/inventory/getReservation.php',
                "type": "POST",
                "dataSrc": "records",
                data: function (d) {
                    delete d.columns;
                    d.serial_no = $(".dthead-search-reserve tr:visible .search-reserve-serial").val();
                    d.brand = $(".dthead-search-reserve tr:visible .search-reserve-brand").val();
                    d.model = $(".dthead-search-reserve tr:visible .search-reserve-model").val();
                    d.acct_mngr = $(".dthead-search-reserve tr:visible .search-reserve-acct").val();
                    d.comp = $(".dthead-search-reserve tr:visible .search-reserve-comp").val();
                    d.date_reserved = $(".dthead-search-reserve tr:visible .search-reserve-date").val();
                    d.branch = $(".dthead-search-reserve tr:visible .search-reserve-branch").val();
                    d.action_view = 'archive';
                }
            },
            "columns": [
                {
                    "data": null, "width": "20px", "render": function (data, type, row, meta) {
                        return meta.row + 1;
                    }
                },
                { "data": "serial_number" },
                {
                    "data": function (data) {
                        return data.id_brand || '';
                    }
                },
                {
                    "data": function (data) {
                        return data.model || '';
                    }
                },
                { "data": "acct_mngr" },
                { "data": "company_name" },
                { "data": "date_reserved" },
                {
                    "data": null, render: function (data) {
                        var badge = "";
                        if (data.status == "REMOVE") {
                            badge = "red";
                        }
                        if (data.status == "CLOSE") {
                            badge = "green";
                        }

                        return "<span class='badge badge-" + badge + "'>" + data.status + "</span>";

                    }
                },
                { "data": "created_at" },
                { "data": "branch_name" }
            ],
            "preDrawCallback": function (settings) {
                $(".btn-excel-inventory, .btn-print-inventory, .btn-search-inventory, .btn-reserve").removeClass("dt-button").addClass("btn btn-primary btn-flat btn-sm").css({ "margin-bottom": "0.5em", "margin-right": "0.5em" });
                $(".btn-print-inventory").text('').html("<i class='glyphicon glyphicon-print'></i>").attr('title', 'Print');
                $(".btn-excel-inventory").text('').html("<i class='fa fa-file-excel-o'></i>").attr('title', 'Export to Excel');
            }
        });
        return this;
    },
    actions: function () {
        $("#dtArchiveReservation").on('click', 'button', function (e) {
            e.preventDefault();
            var inst = $(this);
            var button_label = inst.text().toLowerCase();

            //Highlight row selected.
            if (!inst.closest('tr').hasClass('selected')) {
                self.dtArchiveReservation.dtInstance.$('tr.selected').removeClass('selected');
                inst.closest('tr').addClass('selected');
            }
            //Search button
            if (button_label == "search") {
                self.dtArchiveReservation.dtInstance.ajax.reload(null, true);
            }
            //Reset button
            else if (button_label == "reset") {
                $(".dthead-search-reserve input[type='text']").val('');  //Clear all values;
                self.dtArchiveReservation.dtInstance.ajax.reload(null, true); //Reload DT when closing filter search.
            }

        });
        return this;
    },

};