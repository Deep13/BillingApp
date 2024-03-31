sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library",],
    function (Controller, JSONModel, Dialog, Button, List, StandardListItem, mobileLibrary) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.Identification", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("Identification")
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
                        method: "getIdentificationType",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            that.getView().byId('tableHeader').setText(`Identification (${aData.length})`)
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
                if (!this.oDefaultDialog) {

                    this.oDefaultDialog = new Dialog({
                        title: "Create Identification",
                        content: [new sap.m.VBox({
                            items: [new sap.m.Label({ text: 'Identification' }), new sap.m.Input({ id: 'item' })]
                        }).addStyleClass("sapUiMediumMargin")],
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Save",
                            press: function () {
                                this.saveItem();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Close",
                            press: function () {
                                this.oDefaultDialog.close();
                                this.oDefaultDialog.destroy();
                                this.oDefaultDialog = undefined;
                            }.bind(this)
                        })
                    });
                    this.oDefaultDialog.addStyleClass('sapUiResponsivePadding');
                    // to get access to the controller's model
                    this.getView().addDependent(this.oDefaultDialog);
                }

                this.oDefaultDialog.open();
            },
            saveItem: function () {
                sap.ui.core.BusyIndicator.show();
                var item = sap.ui.getCore().byId('item').getValue();
                var that = this;
                var host = this.getHost();
                this.oDefaultDialog.close();
                this.oDefaultDialog.destroy();
                this.oDefaultDialog = undefined;
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "insertIdentificationType",
                        data: JSON.stringify({ item: item }),
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
                var item = sap.ui.getCore().byId('item').getValue();
                var that = this;
                var host = this.getHost();
                this.oDefaultDialog.close();
                that.oDefaultDialog.destroy();
                this.oDefaultDialog = undefined;
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "updateIdentificationType",
                        data: JSON.stringify({ id: selectData.id, item: item, }),
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
                if (!that.oDefaultDialog) {

                    that.oDefaultDialog = new Dialog({
                        title: "Edit Identification",
                        content: [new sap.m.VBox({
                            items: [new sap.m.Label({ text: 'Identification' }), new sap.m.Input({ id: 'item', value: selectData.item })]
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
                this.oDefaultDialog.open();

            },
            onpressBack: function (oEvent) {
                this.oRouter.navTo("Main");
            },

        });
    }
);
