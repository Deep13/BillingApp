sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library",],
    function (Controller, JSONModel, MessageBox, Button, List, StandardListItem, mobileLibrary) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.Order", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("Order")
                    .attachPatternMatched(this._handleRouteMatched, this);


            },
            reset: function () {
                this.getView().byId("rate").setValue(0);
                this.getView().byId("order_id").setValue('');
                this.getView().byId("cash").setValue(0);
                this.getView().byId("cheque").setValue(0);
                this.getView().byId("upi").setValue(0);
                this.getView().byId("card").setValue(0);
                this.getView().byId("bank").setValue(0);
                this.getView().byId("amount").setValue(0);
                this.getView().byId("totamount").setText(0);
                this.getView().byId("addt").setValue('');
                this.getView().byId("chequeno").setValue('');
                this.getView().byId("upidetails").setValue('');
                this.getView().byId("apprcode").setValue('');
                this.getView().byId("oldgold").setValue(0);
            },
            clearAll: function () {
                this.getView().byId("cheque").setValue(0);
                this.getView().byId("upi").setValue(0);
                this.getView().byId("card").setValue(0);
                this.getView().byId("bank").setValue(0);
            },
            _handleRouteMatched: function (oEvent) {
                var date = new Date();
                this.reset();
                var that = this;
                var host = this.getHost();
                var jModel = new sap.ui.model.json.JSONModel({ currentDate: date });
                this.getView().setModel(jModel);
                var pId = oEvent.getParameter('arguments').purchase_id;
                if (parseInt(pId) > 0) {
                    this.getView().byId('oldgoldBox').setVisible(true);
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getPurchaseById",
                            data: JSON.stringify({
                                purchase_id: pId
                            })
                        },
                        success: function (dataClient) {
                            try {
                                if (dataClient) {
                                    var aDataId = JSON.parse(dataClient);
                                    // var jModel = sap.ui.model.json.JSONModel(aDataId[0]);
                                    // that.getView().setModel(jModel, "purchaseModel");
                                    that.getView().byId('oldgold').setValue(aDataId[0].total_amount);
                                    that.calVal();
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
                }
                else {
                    that.getView().byId('oldgold').setValue(0);
                    this.getView().byId('oldgoldBox').setVisible(false);

                }
                this.getView().getModel().setProperty('/purchase_id', pId)
                var data = this.getUserLog();

                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {
                    this.getView().byId("salesman").setSelectedKey(data.id);

                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getLatestVoucher",
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = 1;
                                if (dataClient) {
                                    aDataId = JSON.parse(dataClient);
                                    aDataId = aDataId[0]['max(id)'];
                                    aDataId++;
                                }
                                that.getView().getModel().setProperty('/voucher', aDataId)
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
                    this.getView().getModel().refresh(true);
                    var rate_default = that.getOwnerComponent().getModel("SellerModel")?.getProperty("/gold_rate");
                    var jModelB = new sap.ui.model.json.JSONModel({ rate: rate_default });
                    this.getView().setModel(jModelB, "buyer")
                }

            },

            calVal: function () {
                var old = this.getView().byId('oldgold').getValue();
                var adamount = this.getView().byId('amount').getValue();
                this.getView().byId('totamount').setText(parseFloat(old) + parseFloat(adamount));
                this.getView().byId('cash').setValue(parseFloat(old) + parseFloat(adamount));
                this.clearAll();
            },

            adjustBal: function () {
                var amount = this.getView().byId("totamount").getText();
                if (amount) {
                    var card = this.getView().byId("card").getValue();
                    if (!card) {
                        card = 0;
                    }
                    var cheque = this.getView().byId("cheque").getValue();
                    if (!cheque) {
                        cheque = 0;
                    }
                    var upi = this.getView().byId("upi").getValue();
                    if (!upi) {
                        upi = 0;
                    }
                    var bank = this.getView().byId("bank").getValue();
                    if (!bank) {
                        bank = 0;
                    }
                    var bal = parseFloat(amount) - (parseFloat(card) + parseFloat(upi) + parseFloat(cheque) + parseFloat(bank));
                    this.getView().byId("cash").setValue(bal)
                }
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
                                    that.getView().getModel("buyer").setData(aDataId)
                                }
                                else {
                                    that.getView().getModel("buyer").setData({ contact_number: cn })
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

            onSave: function () {
                sap.ui.core.BusyIndicator.show();
                var that = this;
                var host = this.getHost();
                var buyerDetails = this.getView().getModel("buyer").getData();
                if (!buyerDetails.id) {
                    this.saveBuyer();
                }
                var om_type = this.getView().byId("om_type").getSelectedKey();
                var purity = this.getView().byId("purity").getSelectedItem()?.getText();
                var rate = this.getView().byId("rate").getValue();
                var order_id = this.getView().byId("order_id").getValue();
                var order_date = this.getView().byId("order_date").getDateValue().toISOString().split('T')[0];
                var salesman = this.getView().byId("salesman").getSelectedItem()?.getText();
                var cash = this.getView().byId("cash").getValue();
                var cheque = this.getView().byId("cheque").getValue();
                var upi = this.getView().byId("upi").getValue();
                var card = this.getView().byId("card").getValue();
                var bank = this.getView().byId("bank").getValue();
                var amount = this.getView().byId("amount").getValue();
                var total_amount = this.getView().byId("totamount").getText();
                var addt = this.getView().byId("addt").getValue();
                var chequeno = this.getView().byId("chequeno").getValue();
                var upidetails = this.getView().byId("upidetails").getValue();
                var apprcode = this.getView().byId("apprcode").getValue();
                var oldgold = this.getView().byId("oldgold").getValue();
                var purchase_id = this.getView().getModel().getProperty("/purchase_id");
                if (purchase_id == 0) {
                    oldgold = 0;
                    purchase_id = null;
                }
                var bankdetails = this.getView().byId("bankdetails").getValue();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "insertOrder",
                        data: JSON.stringify({
                            order_id: order_id,
                            contact_number: buyerDetails.contact_number,
                            customer_name: buyerDetails.name,
                            id_type: buyerDetails.id_type,
                            card_number: buyerDetails.id_value,
                            address: buyerDetails.address,
                            state: buyerDetails.state,
                            state_code: buyerDetails.state_code,
                            order_date: order_date,
                            gst_number: buyerDetails.gst_number,
                            city_pin: buyerDetails.pincode,
                            notes: addt,
                            total_amount: total_amount,
                            adv_amount: amount,
                            type: om_type,
                            purity: purity,
                            rate: rate,
                            created_by: salesman,
                            cash: cash,
                            cheque: cheque,
                            upi: upi,
                            card: card,
                            bank: bank,
                            chequeno: chequeno,
                            upidetails: upidetails,
                            apprcode: apprcode,
                            bankdetails: bankdetails,
                            old_gold_amount: oldgold,
                            purchase_id: purchase_id,
                        }),
                    },
                    success: function (dataClient) {
                        sap.ui.core.BusyIndicator.hide();
                        console.log(dataClient);
                        $.ajax({
                            url: host,
                            type: "POST",
                            data: {
                                method: "insertVoucher",
                                data: JSON.stringify({
                                    order_id: order_id,
                                    amount: amount,
                                    voucher_date: order_date,
                                    rate: rate,
                                }),
                            },
                            success: function (dataClient) {
                                sap.ui.core.BusyIndicator.hide();
                                console.log(dataClient);
                                MessageBox.success("Succesfully Order created", {
                                    actions: [MessageBox.Action.OK],
                                    onClose: function (sAction) {
                                        that.oRouter.navTo('Main')
                                    }
                                });
                            },
                            error: function (request, error) {
                                console.log('Error');
                                sap.ui.core.BusyIndicator.hide();
                            },
                        });
                        // MessageBox.success("Succesfully Order created");


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
                this.oRouter.navTo("OrderList");
            },

        });
    }
);
