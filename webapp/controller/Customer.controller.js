sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library",],
    function (Controller, JSONModel, Dialog, Button, List, StandardListItem, mobileLibrary) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.Customer", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("Customer")
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
                        method: "getCustomers",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            that.getView().byId('tableHeader').setText(`Customers (${aData.length})`)
                            var jData = new sap.ui.model.json.JSONModel({ results: aData });
                            that.getView().setModel(jData);
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
                        method: "getStateCode",
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
                            });
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getIdentificationType",
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataId = JSON.parse(dataClient);
                                        var selectItemsId = [];
                                        aDataId.forEach(val => {
                                            selectItemsId.push(new sap.ui.core.Item({
                                                text: val.item,
                                                key: val.id
                                            }))
                                        })
                                        if (!that.oDefaultDialog) {

                                            that.oDefaultDialog = new Dialog({
                                                title: "Create Customer",
                                                content: [new sap.m.VBox({
                                                    items: [new sap.m.HBox({
                                                        items: [new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'Contact Number' }), new sap.m.Input({
                                                                id: 'contact_number'
                                                            })]
                                                        }),
                                                        new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'Address' }), new sap.m.Input({
                                                                id: 'address'
                                                            })]
                                                        }).addStyleClass('sapUiMediumMarginBegin')]
                                                    }),
                                                    new sap.m.HBox({
                                                        items: [new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'Name' }), new sap.m.Input({
                                                                id: 'name'
                                                            })]
                                                        }),
                                                        new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'GST Number' }), new sap.m.Input({
                                                                id: 'gst'
                                                            })]
                                                        }).addStyleClass('sapUiMediumMarginBegin')]
                                                    }),
                                                    new sap.m.HBox({
                                                        items: [
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'Id Type' }), new sap.m.Select({
                                                                    forceSelection: false,
                                                                    id: 'id_type',
                                                                    width: '100%',
                                                                    items: selectItemsId
                                                                })]
                                                            }),
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'Id Value' }), new sap.m.Input({
                                                                    id: 'id_value'
                                                                })]
                                                            }).addStyleClass('sapUiMediumMarginBegin')]
                                                    }),
                                                    new sap.m.HBox({
                                                        items: [
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'State' }), new sap.m.Select({
                                                                    forceSelection: false,
                                                                    id: 'state',
                                                                    width: '100%',
                                                                    items: selectItems
                                                                })]
                                                            }),
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'PIN code' }), new sap.m.Input({
                                                                    id: 'pin'
                                                                })]
                                                            }).addStyleClass('sapUiMediumMarginBegin')]
                                                    })]
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
                            });
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
            saveItem: function () {
                sap.ui.core.BusyIndicator.show();
                var contact_number = sap.ui.getCore().byId('contact_number').getValue();
                var address = sap.ui.getCore().byId('address').getValue();
                var name = sap.ui.getCore().byId('name').getValue();
                var id_type = sap.ui.getCore().byId('id_type').getSelectedItem().getText();
                var id_value = sap.ui.getCore().byId('id_value').getValue();
                var gst_number = sap.ui.getCore().byId('gst').getValue();
                var state = sap.ui.getCore().byId('state').getSelectedItem().getText();
                var state_code = sap.ui.getCore().byId('state').getSelectedItem().getKey();
                var pincode = sap.ui.getCore().byId('pin').getValue();
                var that = this;
                var host = this.getHost();
                this.oDefaultDialog.close();
                that.oDefaultDialog.destroy();
                this.oDefaultDialog = undefined;
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "insertCustomer",
                        data: JSON.stringify({ contact_number: contact_number, address: address, name: name, id_type: id_type, id_value: id_value, gst_number: gst_number, state: state, pincode: pincode, state_code: state_code }),
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
                var contact_number = sap.ui.getCore().byId('contact_number').getValue();
                var address = sap.ui.getCore().byId('address').getValue();
                var name = sap.ui.getCore().byId('name').getValue();
                var id_type = sap.ui.getCore().byId('id_type').getSelectedItem().getText();
                var id_value = sap.ui.getCore().byId('id_value').getValue();
                var gst_number = sap.ui.getCore().byId('gst').getValue();
                var state = sap.ui.getCore().byId('state').getSelectedItem().getText();
                var state_code = sap.ui.getCore().byId('state').getSelectedItem().getKey();
                var pincode = sap.ui.getCore().byId('pin').getValue();
                var that = this;
                var host = this.getHost();
                this.oDefaultDialog.close();
                that.oDefaultDialog.destroy();
                this.oDefaultDialog = undefined;
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "updateCustomer",
                        data: JSON.stringify({ id: selectData.id, contact_number: contact_number, address: address, name: name, id_type: id_type, id_value: id_value, gst_number: gst_number, state: state, pincode: pincode, state_code: state_code }),
                    },
                    success: function (dataClient) {
                        console.log(dataClient);
                        sap.ui.core.BusyIndicator.hide();
                        that.refreshData();
                    },
                    error: function (request, error) {
                        sap.ui.core.BusyIndicator.hide();
                        console.log('Error')
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
                        method: "getStateCode",
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
                            });
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getIdentificationType",
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataId = JSON.parse(dataClient);
                                        var selectItemsId = [];
                                        aDataId.forEach(val => {
                                            selectItemsId.push(new sap.ui.core.Item({
                                                text: val.item,
                                                key: val.item
                                            }))
                                        })
                                        if (!that.oDefaultDialog) {

                                            that.oDefaultDialog = new Dialog({
                                                title: "Create Customer",
                                                content: [new sap.m.VBox({
                                                    items: [new sap.m.HBox({
                                                        items: [new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'Contact Number' }), new sap.m.Input({
                                                                id: 'contact_number',
                                                                value: selectData.contact_number
                                                            })]
                                                        }),
                                                        new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'Address' }), new sap.m.Input({
                                                                id: 'address',
                                                                value: selectData.address

                                                            })]
                                                        }).addStyleClass('sapUiMediumMarginBegin')]
                                                    }),
                                                    new sap.m.HBox({
                                                        items: [new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'Name' }), new sap.m.Input({
                                                                id: 'name',
                                                                value: selectData.name
                                                            })]
                                                        }),
                                                        new sap.m.VBox({
                                                            width: '200px',
                                                            items: [new sap.m.Label({ text: 'GST Number' }), new sap.m.Input({
                                                                id: 'gst',
                                                                value: selectData.gst_number
                                                            })]
                                                        }).addStyleClass('sapUiMediumMarginBegin')]
                                                    }),
                                                    new sap.m.HBox({
                                                        items: [
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'Id Type' }), new sap.m.Select({
                                                                    forceSelection: false,
                                                                    selectedKey: selectData.id_type,
                                                                    id: 'id_type',
                                                                    width: '100%',
                                                                    items: selectItemsId
                                                                })]
                                                            }),
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'Id Value' }), new sap.m.Input({
                                                                    id: 'id_value',
                                                                    value: selectData.id_value
                                                                })]
                                                            }).addStyleClass('sapUiMediumMarginBegin')]
                                                    }),
                                                    new sap.m.HBox({
                                                        items: [
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'State' }), new sap.m.Select({
                                                                    forceSelection: false,
                                                                    selectedKey: selectData.state_code,
                                                                    id: 'state',
                                                                    width: '100%',
                                                                    items: selectItems
                                                                })]
                                                            }),
                                                            new sap.m.VBox({
                                                                width: '200px',
                                                                items: [new sap.m.Label({ text: 'PIN code' }), new sap.m.Input({
                                                                    id: 'pin',
                                                                    value: selectData.pincode
                                                                })]
                                                            }).addStyleClass('sapUiMediumMarginBegin')]
                                                    })]
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
                            });
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
            onpressBack: function (oEvent) {
                this.oRouter.navTo("Main");
            },

        });
    }
);
