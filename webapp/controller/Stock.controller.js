sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library",],
    function (Controller, JSONModel, Dialog, Button, List, StandardListItem, mobileLibrary) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.Stock", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("Stock")
                    .attachPatternMatched(this._handleRouteMatched, this);


            },
            _handleRouteMatched: function () {
                var data = this.getUserLog();
                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {
                    this.refreshData();
                }

            },
            refreshData: function () {
                var that = this;
                var host = this.getHost();
                // this.schema = []
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getStocks",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            that.getView().byId('tableHeader').setText(`Stocks (${aData.length})`)
                            var jData = new sap.ui.model.json.JSONModel({ results: aData });
                            that.getView().setModel(jData);
                            that.stockData = aData;
                        }
                        catch (e) {
                            alert("Something went wrong", e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                    }
                });
            },
            onAdd: function () {
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getOrnamentType",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            var selectItems = [];
                            aData.forEach(val => {
                                selectItems.push(new sap.ui.core.Item({
                                    text: val.item,
                                    key: val.id
                                }))
                            })
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getOrnament",
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataOrm = JSON.parse(dataClient);
                                        var selectItemsOrm = [];
                                        aDataOrm.forEach(val => {
                                            selectItemsOrm.push(new sap.ui.core.Item({
                                                text: val.item,
                                                key: val.id
                                            }))
                                        })

                                        $.ajax({
                                            url: host,
                                            type: "POST",
                                            data: {
                                                method: "getPurity",
                                            },
                                            success: function (dataClient) {
                                                try {
                                                    var aDataPurity = JSON.parse(dataClient);
                                                    var selectItemsPurity = [];
                                                    aDataPurity.forEach(val => {
                                                        selectItemsPurity.push(new sap.ui.core.Item({
                                                            text: val.item,
                                                            key: val.id
                                                        }))
                                                    })

                                                    if (!that.oDefaultDialog) {

                                                        that.oDefaultDialog = new Dialog({
                                                            title: "Create Stock",
                                                            content: [new sap.m.VBox({
                                                                items: [new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Ornament Type' }), new sap.m.Select({
                                                                            forceSelection: false,
                                                                            id: 'omtype',
                                                                            width: '100%',
                                                                            items: selectItems
                                                                        })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Ornament' }), new sap.m.Select({
                                                                            forceSelection: false,
                                                                            id: 'om',
                                                                            width: '100%',
                                                                            items: selectItemsOrm,
                                                                            change: function (oevent) {
                                                                                var selctKey = oevent.getParameter('selectedItem').getKey();
                                                                                var select = aDataOrm.filter(val => val.id == selctKey);
                                                                                var lastIndex = that.stockData.filter(val => val.orm_desc == select[0].item);
                                                                                var nextIndex;
                                                                                if (lastIndex.length > 0) {
                                                                                    var currIndex = lastIndex[lastIndex.length - 1].om_code.split(select[0].suffix);
                                                                                    currIndex = parseInt(currIndex[1]) + 1;
                                                                                    nextIndex = select[0].suffix + currIndex;

                                                                                }
                                                                                else {
                                                                                    nextIndex = select[0].suffix + '1';
                                                                                }
                                                                                sap.ui.getCore().byId('omcode').setValue(nextIndex)
                                                                            }.bind(this)
                                                                        })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }), new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Om Code' }), new sap.m.Input({ id: 'omcode', editable: false })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Purity' }), new sap.m.Select({
                                                                            forceSelection: false,
                                                                            id: 'purity',
                                                                            width: '100%',
                                                                            items: selectItemsPurity
                                                                        })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }),
                                                                new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Gross wt' }), new sap.m.Input({ id: 'gross' })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Net wt' }), new sap.m.Input({ id: 'net' })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }),
                                                                new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Stone wt' }), new sap.m.Input({ id: 'stone' })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Quantity' }), new sap.m.Input({ id: 'qty' })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }),
                                                                new sap.m.Label({ text: 'HUID' }), new sap.m.Input({ id: 'huid' })

                                                                ]
                                                            }).addStyleClass("sapUiMediumMargin")],
                                                            beginButton: new Button({
                                                                type: ButtonType.Emphasized,
                                                                text: "Save",
                                                                press: function () {
                                                                    that.saveItem();
                                                                }.bind(that)
                                                            }),
                                                            endButton: new Button({
                                                                text: "Close",
                                                                press: function () {
                                                                    that.oDefaultDialog.close();
                                                                    that.oDefaultDialog.destroy();
                                                                    that.oDefaultDialog = undefined;
                                                                }.bind(that)
                                                            })
                                                        });
                                                        that.oDefaultDialog.addStyleClass('sapUiResponsivePadding');
                                                        // to get access to the controller's model
                                                        that.getView().addDependent(that.oDefaultDialog);
                                                    }

                                                    that.oDefaultDialog.open();
                                                }
                                                catch (e) {
                                                    alert("Something went wrong", e)
                                                }
                                            },
                                            error: function (request, error) {
                                                console.log('Error')
                                            }
                                        })
                                    }
                                    catch (e) {
                                        alert("Something went wrong", e)
                                    }
                                },
                                error: function (request, error) {
                                    console.log('Error')
                                }
                            })
                        }
                        catch (e) {
                            alert("Something went wrong", e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                    }
                })

            },
            soldStatusHighlight: function (sold) {
                if (parseFloat(sold) === 0) {
                    return 'None';
                }
                return 'Error'
            },
            soldButton: function (sold) {
                if (parseFloat(sold) === 0) {
                    return true;
                }
                return false
            },
            saveItem: function () {
                sap.ui.core.BusyIndicator.show();
                var om_type = sap.ui.getCore().byId('omtype').getSelectedItem().getText();
                var orm_desc = sap.ui.getCore().byId('om').getSelectedItem().getText();
                var om_code = sap.ui.getCore().byId('omcode').getValue();
                var purity = sap.ui.getCore().byId('purity').getSelectedItem().getText();
                var gross_wt = sap.ui.getCore().byId('gross').getValue();
                var net_wt = sap.ui.getCore().byId('net').getValue();
                var stone_wt = sap.ui.getCore().byId('stone').getValue();
                var qty = sap.ui.getCore().byId('qty').getValue();
                var huid = sap.ui.getCore().byId('huid').getValue();
                var that = this;
                var host = this.getHost();
                this.oDefaultDialog.close();
                that.oDefaultDialog.destroy();
                this.oDefaultDialog = undefined;
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "insertStock",
                        data: JSON.stringify({ om_type: om_type, orm_desc: orm_desc, om_code: om_code, purity: purity, gross_wt: gross_wt, net_wt: net_wt, stone_wt: stone_wt, qty: qty, huid: huid }),
                    },
                    success: function (dataClient) {
                        console.log(dataClient);
                        sap.ui.core.BusyIndicator.hide();
                        that.refreshData();
                    },
                    error: function (request, error) {
                        console.log('Error');
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },

            editItem: function (selectData) {
                sap.ui.core.BusyIndicator.show();
                var om_type = sap.ui.getCore().byId('omtype').getSelectedItem().getText();
                var orm_desc = sap.ui.getCore().byId('om').getSelectedItem().getText();
                var om_code = sap.ui.getCore().byId('omcode').getValue();
                var purity = sap.ui.getCore().byId('purity').getSelectedItem().getText();
                var gross_wt = sap.ui.getCore().byId('gross').getValue();
                var net_wt = sap.ui.getCore().byId('net').getValue();
                var stone_wt = sap.ui.getCore().byId('stone').getValue();
                var qty = sap.ui.getCore().byId('qty').getValue();
                var huid = sap.ui.getCore().byId('huid').getValue();
                var that = this;
                var host = this.getHost();
                this.oDefaultDialog.close();
                that.oDefaultDialog.destroy();
                this.oDefaultDialog = undefined;
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "updateStock",
                        data: JSON.stringify({ id: selectData.id, om_type: om_type, orm_desc: orm_desc, om_code: om_code, purity: purity, gross_wt: gross_wt, net_wt: net_wt, stone_wt: stone_wt, qty: qty, huid: huid }),
                    },
                    success: function (dataClient) {
                        console.log(dataClient);
                        sap.ui.core.BusyIndicator.hide();
                        that.refreshData();
                    },
                    error: function (request, error) {
                        console.log('Error');
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },


            onPressEdit: function (oEvent) {
                var selectData = oEvent.getSource().getBindingContext().getObject();
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getOrnamentType",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            var selectItems = [];
                            aData.forEach(val => {
                                selectItems.push(new sap.ui.core.Item({
                                    text: val.item,
                                    key: val.item
                                }))
                            })
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getOrnament",
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataOrm = JSON.parse(dataClient);
                                        var selectItemsOrm = [];
                                        aDataOrm.forEach(val => {
                                            selectItemsOrm.push(new sap.ui.core.Item({
                                                text: val.item,
                                                key: val.item
                                            }))
                                        })

                                        $.ajax({
                                            url: host,
                                            type: "POST",
                                            data: {
                                                method: "getPurity",
                                            },
                                            success: function (dataClient) {
                                                try {
                                                    var aDataPurity = JSON.parse(dataClient);
                                                    var selectItemsPurity = [];
                                                    aDataPurity.forEach(val => {
                                                        selectItemsPurity.push(new sap.ui.core.Item({
                                                            text: val.item,
                                                            key: val.item
                                                        }))
                                                    })

                                                    if (!that.oDefaultDialog) {

                                                        that.oDefaultDialog = new Dialog({
                                                            title: "Create Stock",
                                                            content: [new sap.m.VBox({
                                                                items: [new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Ornament Type' }), new sap.m.Select({
                                                                            forceSelection: false,
                                                                            selectedKey: selectData.om_type,
                                                                            id: 'omtype',
                                                                            width: '100%',
                                                                            items: selectItems
                                                                        })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Ornament' }), new sap.m.Select({
                                                                            forceSelection: false,
                                                                            editable: false,
                                                                            id: 'om',
                                                                            width: '100%',
                                                                            items: selectItemsOrm,
                                                                            selectedKey: selectData.orm_desc,
                                                                            change: function (oevent) {
                                                                                var selctKey = oevent.getParameter('selectedItem').getKey();
                                                                                var select = aDataOrm.filter(val => val.item == selctKey);
                                                                                var lastIndex = that.stockData.filter(val => val.orm_desc == select[0].item);
                                                                                var nextIndex;
                                                                                if (lastIndex.length > 0) {
                                                                                    var currIndex = lastIndex[lastIndex.length - 1].om_code.split(select[0].suffix);
                                                                                    currIndex = parseInt(currIndex[1]) + 1;
                                                                                    nextIndex = select[0].suffix + currIndex;

                                                                                }
                                                                                else {
                                                                                    nextIndex = select[0].suffix + '1';
                                                                                }
                                                                                sap.ui.getCore().byId('omcode').setValue(nextIndex)
                                                                            }.bind(this)
                                                                        })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }), new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Om Code' }), new sap.m.Input({
                                                                            id: 'omcode',
                                                                            value: selectData.om_code, editable: false
                                                                        })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Purity' }), new sap.m.Select({
                                                                            forceSelection: false,
                                                                            id: 'purity',
                                                                            width: '100%',
                                                                            items: selectItemsPurity,
                                                                            selectedKey: selectData.purity,
                                                                        })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }),
                                                                new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Gross wt' }), new sap.m.Input({ id: 'gross', value: selectData.gross_wt })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Net wt' }), new sap.m.Input({ id: 'net', value: selectData.net_wt })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }),
                                                                new sap.m.HBox({
                                                                    items: [new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Stone wt' }), new sap.m.Input({ id: 'stone', value: selectData.stone_wt })]
                                                                    }),
                                                                    new sap.m.VBox({
                                                                        width: '200px',
                                                                        items: [new sap.m.Label({ text: 'Quantity' }), new sap.m.Input({ id: 'qty', value: selectData.qty })]
                                                                    }).addStyleClass('sapUiMediumMarginBegin')]
                                                                }),
                                                                new sap.m.Label({ text: 'HUID' }), new sap.m.Input({ id: 'huid', value: selectData.huid })

                                                                ]
                                                            }).addStyleClass("sapUiMediumMargin")],
                                                            beginButton: new Button({
                                                                type: ButtonType.Emphasized,
                                                                text: "Save",
                                                                press: function () {
                                                                    that.editItem(selectData);
                                                                }.bind(that)
                                                            }),
                                                            endButton: new Button({
                                                                text: "Close",
                                                                press: function () {
                                                                    that.oDefaultDialog.close();
                                                                    that.oDefaultDialog.destroy();
                                                                    that.oDefaultDialog = undefined;
                                                                }.bind(that)
                                                            })
                                                        });
                                                        that.oDefaultDialog.addStyleClass('sapUiResponsivePadding');
                                                        // to get access to the controller's model
                                                        that.getView().addDependent(that.oDefaultDialog);
                                                    }

                                                    that.oDefaultDialog.open();
                                                }
                                                catch (e) {
                                                    alert("Something went wrong", e)
                                                }
                                            },
                                            error: function (request, error) {
                                                console.log('Error')
                                            }
                                        })
                                    }
                                    catch (e) {
                                        alert("Something went wrong", e)
                                    }
                                },
                                error: function (request, error) {
                                    console.log('Error')
                                }
                            })
                        }
                        catch (e) {
                            alert("Something went wrong", e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                    }
                })
            },
            onpressBack: function (oEvent) {
                this.oRouter.navTo("Main");
            },

        });
    }
);
