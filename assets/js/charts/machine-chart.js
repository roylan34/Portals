var machineCharts = {
    brandDataOpt: [],
    dtInstance: {},
    dtInstanceLoc: {},
    pageDetails: function () {
        $(".content-header h1").text("Machine in Field");
        $(".content-header h1").append("<small>Home</small>");
        return this;
    },
    brands: function () {
        var dataOpt = [];
        var update_brand = null;
        $.getJSON(assets + "php/charts/machine-charts.php", { type_chart: 'brands' }, function (data) {
            $.each(data.aaData, function (key, val) {
                dataOpt.push({ y: parseInt(val.total_brands), label: val.brand_name, indexLabel: formatNumber(val.total_brands), id_brand: val.id_brand });
            });
        }).done(function () {
            var options = { //Better to construct options first and then pass it as a parameter
                // theme: "theme2",
                animationEnabled: true,
                // colorSet:  "customColorSet1",
                title: {
                    text: "Summary MIF Brands",
                    culture: "es"
                },
                axisY: {
                    gridThickness: 1,
                    interval: 2000
                },
                axisX: {
                    labelFormatter: function (e) {
                        return (e.label == null ? 'empty brand name' : e.label);
                    },
                    labelFontColor: '#00a65a',
                    interval: 1,
                    labelAngle: 0  //Fixes some label hidden.
                },
                data: [
                    {
                        click: function (e) {
                            //Code here pop-up. 
                            var id_brand = e.dataPoint.id_brand || 0;
                            self.machineCharts.showModels(id_brand, e.dataPoint.label);
                        },
                        type: "column", //change it to line, area, bar, pie, etc
                        color: "#23BFAA",
                        fillOpacity: .9,
                        dataPoints: dataOpt,
                        indexLabelFontColor: "#dd4b39"

                    }
                ]
            };

            $("#chartBrands").ready(function () {
                $("#chartBrands").CanvasJSChart(options);//Render Chart.
                $("button[type='button']").click(function () { //Auto Refresh.
                    var on_off = $(this);
                    if (on_off.data('toggle') == 'on') {
                        update_brand = setInterval(function () {
                            self.machineCharts.brands();
                        }, 5000);
                        on_off.addClass('active');
                        $('.real-off').removeClass('active');
                    }
                    else {
                        window.clearInterval(update_brand);
                        on_off.addClass('active');
                        $('.real-on').removeClass('active');
                    }
                });
            });
        });


        return this;

    },
    showModels: function (idBrand, brand_name) {
        $("#displayModelChart").load(pages + 'charts/model.html', function () {
            $("#modalChartModel").modal('show');
            autoDrpDown.getBrandName("#slctChartBrand");

            $("#modalChartModel").find('.modal-title').text(brand_name);
            self.machineCharts.renderModels(idBrand);

            $("#slctChartBrand").change(function () {//Option dropdown Brand.
                id_brand = $(this).val() || 0;
                brand_text = (id_brand != 0 ? $(this).find('option:selected').text() : 'w/o brand name');
                $("#modalChartModel").find('.modal-title').text(brand_text);
                self.machineCharts.renderModels(id_brand);

            });

        });
    },
    renderModels: function (idBrand) {
        this.dtInstance = $("#dtChartModel").DataTable({
            "dom": 'flrtip',
            "autoWidth": false,
            "responsive": true,
            "pageLength": 10,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "oLanguage": {
                "bProcessing": true,
                "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                "sInfoEmpty": 'No entries to show'
            },
            "bDestroy": true,                                          //destroy existing datatable
            "bStateSave": true,                                          //save the pagination #, ordering, show records # and etc
            "ordering": false,
            "ajax": {
                "url": assets + "php/charts/machine-charts.php",
                "type": "GET",
                "data": { type_chart: 'models', idBrand: idBrand }
            },
            "columns": [
                {
                    data: null, render: function (data, type, row, meta) {
                        return meta.row + 1; //DataTable autoId for sorting.
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<span class='text-center'>" + data.model + "</span>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        var total_machine = data.total_machine || 0;
                        return "<span class='text-center'>" + total_machine + "</span>";
                    }
                }
            ],
            "columnDefs": [
                { responsivePriority: 1, target: 0 }
            ],
            "deferRender": true,
            "footerCallback": function (tfoot, data, start, end, display) {
                var api = this.api();
                var total_machine = api.column(2).data(); //Total over all pages

                var total = 0;
                $.each(total_machine, function (key, val) {
                    if (val['total_machine'] != null) {
                        total += parseInt(val['total_machine']);
                    }
                });

                $(api.column(2).footer()).html('Overall Total: ' + formatNumber(total));

            }
        });
        return this;
    },
    location: function () {
        this.dtInstanceLoc = $("#chartlocation").DataTable({
            "dom": 'flrtip',
            "autoWidth": false,
            "responsive": true,
            "pageLength": 10,
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            "oLanguage": {
                "bProcessing": true,
                "sLoadingRecords": '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Please wait - loading...</span>',
                "sInfoEmpty": 'No entries to show'
            },
            "bDestroy": true,                                          //destroy existing datatable
            "bStateSave": true,                                          //save the pagination #, ordering, show records # and etc
            "ordering": false,
            "ajax": {
                "url": assets + "php/charts/machine-charts.php",
                "type": "GET",
                "data": { type_chart: 'location' }
            },
            "columns": [
                {
                    data: null, render: function (data, type, row, meta) {
                        return meta.row + 1; //DataTable autoId for sorting.
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        return "<span class='text-center'>" + (data.branch_name != null ? data.branch_name : 'empty location') + "</span>";
                    }
                },
                {
                    data: null, render: function (data, type, full, meta) {
                        var total_machine_location = data.total_machine_location || 0;
                        return "<span class='text-center badge'>" + formatNumber(total_machine_location) + "</span>";
                    }
                }
            ],
            "columnDefs": [
                { responsivePriority: 1, target: 0 }
            ],
            "deferRender": true,
            "footerCallback": function (tfoot, data, start, end, display) {
                var api = this.api();
                var total_machine = api.column(2).data(); //Total over all pages

                var total = 0;
                $.each(total_machine, function (key, val) {
                    if (val['total_machine_location'] != null) {
                        total += parseInt(val['total_machine_location']);
                    }
                });

                $(api.column(2).footer()).html('Overall Total: ' + formatNumber(total));

            }
        });
        return this;
    }

};