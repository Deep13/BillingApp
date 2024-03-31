sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library", "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",],
    function (Controller, JSONModel, MessageBox, Button, List, StandardListItem, mobileLibrary, Filter, FilterOperator) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.Purchase", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                var that = this;
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("Purchase")
                    .attachPatternMatched(this._handleRouteMatched, this);

                function doc_keyUp(e) {

                    // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
                    if (e.ctrlKey && e.code === 'KeyA') {
                        // call your function to do the thing
                        that.onAdd();
                    }
                }
                // register the handler 
                document.addEventListener('keyup', doc_keyUp, false);


            },
            _handleRouteMatched: function () {
                var data = this.getUserLog();
                var that = this;
                var host = this.getHost();
                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {
                    if (that.getOwnerComponent().getModel("SellerModel")) {

                        var rate_default = that.getOwnerComponent().getModel("SellerModel").getProperty("/gold_rate");
                        this.getView().byId("rate").setValue(rate_default);
                    }
                    this.getView().byId("salesman").setSelectedKey(data.id);
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getLatestMemo",
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = 1;
                                if (dataClient) {
                                    aDataId = JSON.parse(dataClient);
                                    aDataId = aDataId[0]['max(id)'];
                                    aDataId++;
                                }
                                that.getView().getModel().setProperty('/memo_number', aDataId)
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
                            method: "getGstEntry",
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = JSON.parse(dataClient);
                                that.gst = parseFloat(aDataId[0].value);
                                var jModelID = new sap.ui.model.json.JSONModel({ cgst: (that.gst / 2).toFixed(2), sgst: (that.gst / 2).toFixed(2) });
                                that.getView().setModel(jModelID, "gstModel")
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

                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getStocks",
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = JSON.parse(dataClient);
                                var jModelID = new sap.ui.model.json.JSONModel({ results: aDataId });
                                that.getView().setModel(jModelID, "stocksModel")
                            }
                            catch (e) {
                                alert("Something went wrong", e)
                            }
                        },
                        error: function (request, error) {
                            console.log('Error')
                        }
                    });
                    var jModelID = new sap.ui.model.json.JSONModel({ results: [{}] });
                    that.getView().setModel(jModelID, "Products")
                    var date = new Date();
                    var jModel = new sap.ui.model.json.JSONModel({ currentDate: date });
                    this.getView().setModel(jModel);
                    var jModelB = new sap.ui.model.json.JSONModel({});
                    this.getView().setModel(jModelB, "buyer")
                }

            },
            onSuggest: function (oEvent) {
                var sTerm = oEvent.getParameter("suggestValue");
                var aFilters = [];
                if (sTerm) {
                    aFilters.push(new Filter("orm_desc", FilterOperator.StartsWith, sTerm));
                }

                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
            },
            onSelected: function (oEvent) {
                var om_code = oEvent.getParameter('selectedItem').getBindingContext('stocksModel').getObject().om_code;
                oEvent.getSource().getBindingContext('Products').getObject().om_code = om_code;
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


            calValue: function () {
                var rate = this.getView().byId('rate').getValue();
                rate = parseFloat(rate);
                if (!(rate > 0)) {
                    rate = 0;
                }
                var products = this.getView().getModel("Products").getProperty("/results");
                products.map(value => {
                    value.amount = ((parseFloat(value.net_wt) ? parseFloat(value.net_wt) : 0) * rate);
                });
                this.getView().getModel("Products").refresh(true);
                this.calAddt();
            },
            calAddt: function () {
                var products = this.getView().getModel("Products").getProperty("/results");
                var gstM = this.getView().getModel("gstModel").getData();
                var totalVal = 0;
                products.map(value => {
                    totalVal += parseFloat(value.amount);
                });
                if (totalVal && totalVal > 0) {
                    var gst = (totalVal * (parseFloat(gstM.cgst) / 100)).toFixed(2);
                    gst = parseFloat(gst);
                    this.getView().byId("cgst").setText(gst);
                    this.getView().byId("sgst").setText(gst);
                    this.getView().byId("taxamount").setText(totalVal);
                    this.getView().byId("amount").setText(gst + gst + totalVal);
                }
                else {
                    this.getView().byId("cgst").setText(0);
                    this.getView().byId("sgst").setText(0);
                    this.getView().byId("taxamount").setText(0);
                    this.getView().byId("amount").setText(0);
                    this.getView().byId("cash").setValue(0);

                }
                this.onresetPayment();
            },


            onresetPayment: function () {
                var amount = this.getView().byId("amount").getText();
                this.getView().byId("cash").setValue(amount);
                this.getView().byId("cheque").setValue(0);
                // this.getView().byId("adjo").setValue(0);
                // this.getView().byId("card").setValue(0);
                // this.getView().byId("adjp").setValue(0);
            },
            onAdd: function () {
                var products = this.getView().getModel("Products").getProperty("/results");
                if (products.length > 0) {
                    if (products[products.length - 1].orm_desc) {
                        products.push([]);
                        this.getView().getModel("Products").refresh(true)
                    }
                }
                else {
                    products.push([]);
                    this.getView().getModel("Products").refresh(true)
                }


            },
            onPressRemove: function (oEvent) {
                var index = oEvent.getSource().getBindingContext("Products").getPath().split("/results/")[1];
                index = parseInt(index);
                var products = this.getView().getModel("Products").getProperty("/results");
                products.splice(index, 1);
                this.getView().getModel("Products").refresh(true);
                this.calValue();

            },
            onSave: function () {
                var that = this;
                MessageBox.confirm("Succesfully Updated.", {
                    actions: ["Order", "Print", MessageBox.Action.CLOSE],
                    emphasizedAction: "Print",
                    onClose: function (sAction) {
                        if (sAction == "Order") {
                            that.oRouter.navTo('Order', {
                                purchase_id: 4
                            });
                        }
                        else {
                            that.oRouter.navTo('Main')
                        }
                    }
                });
            },
            onSave1: function () {
                var that = this;
                var host = this.getHost();
                var buyerDetails = this.getView().getModel("buyer").getData();
                if (!buyerDetails.id) {
                    this.saveBuyer();
                }
                var productDetails = this.getView().getModel("Products").getProperty("/results");
                var om_type = this.getView().byId("om_type").getSelectedItem()?.getText();
                var purity = this.getView().byId("purity").getSelectedItem()?.getText();
                var rate = this.getView().byId("rate").getValue();
                var purchase_date = this.getView().byId("invoice_date").getDateValue().toISOString().split('T')[0];
                var salesman = this.getView().byId("salesman").getSelectedItem()?.getText();
                var cash = this.getView().byId("cash").getValue();
                var cheque = this.getView().byId("cheque").getValue();
                var adjo = this.getView().byId("adjo").getValue();
                var card = 0;
                var adjp = this.getView().byId("adjp").getValue();
                var chequeno = this.getView().byId("chequeno").getValue();
                var adjonumber = this.getView().byId("adjonumber").getValue();
                var apprcode = 0;
                var adjpnumber = this.getView().byId("adjpnumber").getValue();
                var addt = this.getView().byId("addt").getValue();
                var cgst = this.getView().byId("cgst").getText();
                var sgst = this.getView().byId("sgst").getText();
                var amount = this.getView().byId("amount").getText();
                var taxamount = this.getView().byId("taxamount").getText();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "insertPurchase",
                        data: JSON.stringify({
                            contact_number: buyerDetails.contact_number,
                            customer_name: buyerDetails.name,
                            id_type: buyerDetails.id_type,
                            card_number: buyerDetails.id_value,
                            address: buyerDetails.address,
                            state: buyerDetails.state,
                            purchase_date: purchase_date,
                            gst_number: buyerDetails.gst_number,
                            city_pin: buyerDetails.pincode,
                            others: addt,
                            cgst: cgst,
                            sgst: sgst,
                            taxamount: taxamount,
                            total_amount: amount,
                            type: om_type,
                            purity: purity,
                            rate: rate,
                            created_by: salesman,
                            cash: cash,
                            cheque: cheque,
                            adjo: adjo,
                            card: card,
                            adjp: adjp,
                            chequeno: chequeno,
                            adjonumber: adjonumber,
                            apprcode: apprcode,
                            adjpnumber: adjpnumber,
                        }),
                    },
                    success: function (dataClient) {
                        console.log(dataClient);
                        if (dataClient.indexOf('Insertion successful') !== -1) {
                            var purchase_id = JSON.parse(dataClient)[1];
                            var reqData = JSON.stringify({
                                purchase_id: purchase_id,
                                data: productDetails,

                            });

                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "insertPurchaseDetails",
                                    data: reqData,
                                },
                                success: function (dataClient) {
                                    console.log(dataClient);
                                    sap.ui.core.BusyIndicator.hide();
                                    MessageBox.confirm("Succesfully Updated. Do you want to Print?", {
                                        actions: ["Go to order", MessageBox.Action.CANCEL],
                                        emphasizedAction: "Go to order",
                                        onClose: function (sAction) {
                                            if (sAction == "Go to order") {

                                            }
                                            else {
                                                that.oRouter.navTo('Main')
                                            }
                                        }
                                    });
                                },
                                error: function (request, error) {
                                    MessageBox.error("Submition failed.");
                                    console.log('Error');
                                    sap.ui.core.BusyIndicator.hide();
                                },
                            });
                        }
                        else {
                            alert("Error in adding data")
                        }

                    },
                    error: function (request, error) {
                        console.log('Error');
                        MessageBox.error("Submition failed.");
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },
            getInvoiceNumber: function () {
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getLatestInvoice",
                    },
                    success: function (dataClient) {
                        try {
                            var aDataId = 1;
                            if (dataClient) {
                                aDataId = JSON.parse(dataClient);
                                aDataId = aDataId[0]['max(invoice_id)'];
                                aDataId++;
                            }
                            that.getView().byId("adjpnumber").setValue(aDataId);
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
            adjustCheque: function () {
                var amount = this.getView().byId("amount").getText();
                if (amount) {
                    var cheque = this.getView().byId("cheque").getValue();
                    if (!cheque) {
                        cheque = 0;
                    }
                    var adjo = this.getView().byId("adjo").getValue();
                    if (!adjo) {
                        adjo = 0;
                    }
                    var adjp = this.getView().byId("adjp").getValue();
                    if (!adjp) {
                        adjp = 0;
                    }
                    var bal = parseFloat(amount) - (parseFloat(adjo) + parseFloat(adjp) + parseFloat(cheque));
                    this.getView().byId("cash").setValue(bal)
                }
            },
            saveBuyer: function () {
                var buyerDetails = this.getView().getModel("buyer").getData();
            },
            onpressBack: function (oEvent) {
                this.oRouter.navTo("Main");
            },

        });
    }
);
