sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library",],
    function (Controller, JSONModel, MessageBox, Button, List, StandardListItem, mobileLibrary) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.OrderView", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("OrderView")
                    .attachPatternMatched(this._handleRouteMatched, this);


            },
            reset: function () {
                var rate = this.getView().byId("rate").setValue(0);
                var order_id = this.getView().byId("order_id").setValue('');
                var cash = this.getView().byId("cash").setValue(0);
                var cheque = this.getView().byId("cheque").setValue(0);
                var upi = this.getView().byId("upi").setValue(0);
                var card = this.getView().byId("card").setValue(0);
                var bank = this.getView().byId("bank").setValue(0);
                var amount = this.getView().byId("amount").setValue(0);
                var total_amount = this.getView().byId("totamount").setText(0);
                var addt = this.getView().byId("addt").setValue('');
                var chequeno = this.getView().byId("chequeno").setValue('');
                var upidetails = this.getView().byId("upidetails").setValue('');
                var apprcode = this.getView().byId("apprcode").setValue('');
                var oldgold = this.getView().byId("oldgold").setValue(0);
            },
            _handleRouteMatched: function (oEvent) {
                // var date = new Date();
                // this.reset();
                var that = this;
                var host = this.getHost();


                var data = this.getUserLog();

                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {
                    var oId = oEvent.getParameter('arguments').order_id;
                    if (oId) {
                        $.ajax({
                            url: host,
                            type: "POST",
                            data: {
                                method: "getOrderByNumber",
                                data: JSON.stringify({
                                    order_id: oId
                                })
                            },
                            success: function (dataClient) {
                                try {
                                    if (dataClient) {
                                        var aDataId = JSON.parse(dataClient);
                                        if (aDataId) {
                                            var jModel = new sap.ui.model.json.JSONModel(aDataId);
                                            that.getView().setModel(jModel, "orderModel");
                                            if (aDataId.status == 1) {
                                                var jModel = new sap.ui.model.json.JSONModel({ editable: true });

                                            }
                                            else {
                                                var jModel = new sap.ui.model.json.JSONModel({ editable: false });
                                            }
                                            that.getView().setModel(jModel, "defaultModel");
                                        }
                                        else {
                                            var jModel = new sap.ui.model.json.JSONModel({});
                                            that.getView().setModel(jModel, "orderModel");
                                        }
                                    }

                                }
                                catch (e) {
                                    alert("Something went wrong", e)
                                }
                            },
                            error: function (request, error) {
                                console.log('Error')
                            }
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
                                    aDataId.push({ id: '0', item: 'N/A' })
                                    var jModelID = new sap.ui.model.json.JSONModel({ results: aDataId });
                                    that.getView().setModel(jModelID, "idModel")
                                }
                                catch (e) {
                                    alert("Something went wrong", e)
                                }
                            },
                            error: function (request, error) {
                                console.log('Error')
                            }
                        });
                        $.ajax({
                            url: host,
                            type: "POST",
                            data: {
                                method: "getStateCode",
                            },
                            success: function (dataClient) {
                                try {
                                    var aDataId = JSON.parse(dataClient);
                                    var jModelID = new sap.ui.model.json.JSONModel({ results: aDataId });
                                    that.getView().setModel(jModelID, "stateModel")
                                }
                                catch (e) {
                                    alert("Something went wrong", e)
                                }
                            },
                            error: function (request, error) {
                                console.log('Error')
                            }
                        });
                        $.ajax({
                            url: host,
                            type: "POST",
                            data: {
                                method: "getOrnamentType",
                            },
                            success: function (dataClient) {
                                try {
                                    var aDataId = JSON.parse(dataClient);
                                    var jModelID = new sap.ui.model.json.JSONModel({ results: aDataId });
                                    that.getView().setModel(jModelID, "omtypeModel")
                                }
                                catch (e) {
                                    alert("Something went wrong", e)
                                }
                            },
                            error: function (request, error) {
                                console.log('Error')
                            }
                        });
                        $.ajax({
                            url: host,
                            type: "POST",
                            data: {
                                method: "getPurity",
                            },
                            success: function (dataClient) {
                                try {
                                    var aDataId = JSON.parse(dataClient);
                                    var jModelID = new sap.ui.model.json.JSONModel({ results: aDataId });
                                    that.getView().setModel(jModelID, "purityModel")
                                }
                                catch (e) {
                                    alert("Something went wrong", e)
                                }
                            },
                            error: function (request, error) {
                                console.log('Error')
                            }
                        });


                        $.ajax({
                            url: host,
                            type: "POST",
                            data: {
                                method: "getSalesman",
                            },
                            success: function (dataClient) {
                                try {
                                    var aDataId = JSON.parse(dataClient);
                                    var jModelID = new sap.ui.model.json.JSONModel({ results: aDataId });
                                    that.getView().setModel(jModelID, "salesModel")
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
                    else {
                        this.oRouter.navTo("");
                    }
                }
            },

            calVal: function () {
                var old = this.getView().byId('oldgold').getValue();
                var adamount = this.getView().byId('amount').getValue();
                this.getView().byId('totamount').setText(parseFloat(old) + parseFloat(adamount));
            },

            onContactNumber: function () {
                var that = this;
                var host = this.getHost();
                var cn = this.getView().byId('contact').getValue();
                if (cn) {
                    sap.ui.core.BusyIndicator.show();
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getCustomerByContact",
                            data: JSON.stringify({ contact_number: cn }),
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = JSON.parse(dataClient);
                                console.log(aDataId);
                                sap.ui.core.BusyIndicator.hide();
                                if (aDataId.id) {
                                    var custData = that.getView().getModel("orderModel").getData()
                                    custData.address = aDataId.address;
                                    custData.contact_number = aDataId.contact_number;
                                    custData.gst_number = aDataId.gst_number;
                                    custData.id = aDataId.id;
                                    custData.id_type = aDataId.id_type;
                                    custData.id_value = aDataId.id_value;
                                    custData.name = aDataId.name;
                                    custData.pincode = aDataId.pincode;
                                    custData.state = aDataId.state;
                                    custData.state_code = aDataId.state_code;
                                    that.getView().getModel("orderModel").setData(custData);
                                }
                                else {
                                    var custData = that.getView().getModel("orderModel").getData()
                                    custData.address = "";
                                    custData.contact_number = cn;
                                    custData.gst_number = "";
                                    custData.id = "";
                                    custData.id_type = "N/A";
                                    custData.id_value = "";
                                    custData.name = "";
                                    custData.pincode = "";
                                    custData.state = "";
                                    custData.state_code = "";
                                    that.getView().getModel("orderModel").setData(custData);

                                }
                            }
                            catch (e) {
                                alert("Something went wrong", e.Error);
                                sap.ui.core.BusyIndicator.hide();
                            }
                        },
                        error: function (request, error) {
                            console.log('Error');
                            sap.ui.core.BusyIndicator.hide();
                        }
                    });
                }
            },
            onTabPress: function (oEvent) {
                oEvent.getSource().onsapfocusleave = function (e) {
                    e.srcControl.fireSubmit();
                }
            },
            onSave: function () {
                sap.ui.core.BusyIndicator.show();
                var that = this;
                var host = this.getHost();
                var data = that.getView().getModel("orderModel").getData();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "updateOrders",
                        data: JSON.stringify(data),
                    },
                    success: function (dataClient) {
                        sap.ui.core.BusyIndicator.hide();
                        console.log(dataClient);
                        MessageBox.success("Succesfully Order Updated", {
                            actions: [MessageBox.Action.OK],
                            onClose: function (sAction) {
                                that.oRouter.navTo('OrderList', {
                                    order_id: "null"
                                })
                            }
                        });

                    },
                    error: function (request, error) {
                        console.log('Error');
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },

            saveBuyer: function () {
                var buyerDetails = this.getView().getModel("buyer").getData();
            },

            onpressBack: function (oEvent) {
                this.oRouter.navTo("OrderList", {
                    order_id: "null"
                });
            },

        });
    }
);
