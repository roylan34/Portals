
var machineInventoryCharts = {
    brandDataOpt: [],
    dtInstance: {},
    dtInstanceLoc: {},
    pageDetails: function () {
        $(".content-header h1").text("Machine Inventory");
        $(".content-header h1").append("<small>Home</small>");
        return this;
    },
    brands: function () {
        var dataOpt = {
            bn: [],
            rf: []
        };
        $.getJSON(assets + "php/inventory/inventory-chart.php", { type_chart: 'brands' }, function (data) {
            $.each(data.aaData, function (key, val) {//Loop BN
                dataOpt.bn.push({ y: parseInt(val.bn), label: val.brand_name, id_brand: val.id_brand });
                dataOpt.rf.push({ y: parseInt(val.rf), label: val.brand_name, id_brand: val.id_brand });
            });
        }).done(function () {
            var options = {
                animationEnabled: true,
                title: {
                    text: "Summary Inventory Brand"
                },
                axisY: {
                    gridThickness: 1,
                },
                axisX: {
                    labelFontColor: '#00a65a',
                },
                data: [
                    {
                        click: function (e) {
                            //Code here pop-up. 
                            var id_brand = e.dataPoint.id_brand || 0;
                            self.machineInventoryCharts.showModels(id_brand, e.dataPoint.label);
                        },
                        type: "stackedColumn",
                        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y} machines",
                        name: "BN (Brand New)",
                        showInLegend: "true",
                        dataPoints: dataOpt.bn,
                        fillOpacity: .9,
                    }, {
                        click: function (e) {
                            //Code here pop-up. 
                            var id_brand = e.dataPoint.id_brand || 0;
                            self.machineInventoryCharts.showModels(id_brand, e.dataPoint.label);
                        },
                        type: "stackedColumn",
                        toolTipContent: "{label}<br/><span style='\"'color: {color};'\"'><strong>{name}</strong></span>: {y} machines",
                        name: "RF (Refurbish)",
                        showInLegend: "true",
                        indexLabel: "#total",
                        indexLabelPlacement: "outside",
                        indexLabelFontColor: "#dd4b39",
                        dataPoints: dataOpt.rf,
                        fillOpacity: .9,
                    }
                ]
            };

            $("#chartInventoryBrands").ready(function () {
                $("#chartInventoryBrands").CanvasJSChart(options);//Render Chart. 
            });


        });
        return this;
    },
    showModels: function (idBrand, brand_name) {
        $("#displayModelChart").load(pages + 'inventory/charts/model.html', function () {
            $("#modalInvntChartModel").modal('show');
            autoDrpDown.getBrandName("#slctInvntChartBrand");

            $("#modalInvntChartModel").find('.modal-title').html(brand_name + " <small style='color:#c0dac0'>stocks</small>");
            self.machineInventoryCharts.renderModels(idBrand);

            $("#slctInvntChartBrand").change(function () {//Option dropdown Brand.
                id_brand = $(this).val() || 0;
                brand_text = (id_brand != 0 ? $(this).find('option:selected').text() : 'w/o brand name');
                $("#modalInvntChartModel").find('.modal-title').html(brand_text + " <small style='color:#c0dac0'>stocks</small>");
                self.machineInventoryCharts.renderModels(id_brand);

            });

        });
    },
    renderModels: function (idBrand) {
        this.dtInstance = $("#dtInvntChartModel").DataTable({
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
                "url": assets + "php/inventory/inventory-chart.php",
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
                        return "<span class='text-center'>" + data.model_name + "</span>";
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
    }

};
