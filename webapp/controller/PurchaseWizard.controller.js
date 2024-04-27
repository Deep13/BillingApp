sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library", "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator", "sap/m/Dialog"],
    function (Controller, JSONModel, MessageBox, Button, List, StandardListItem, mobileLibrary, Filter, FilterOperator, Dialog) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.PurchaseWizard", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this._wizard = this.byId("ShoppingCartWizard");
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("PurchaseWizard")
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
            _handleRouteMatched: async function () {
                this.grandTotal = 0;
                this._wizard.discardProgress(this._wizard.getSteps()[0]);
                this._wizard.goToStep(this.byId("PurchaseStep"));
                var data = this.getUserLog();
                var that = this;
                var host = this.getHost();
                this._wizard.invalidateStep(this.byId("PurchaseStep"));
                this.getView().byId("om_type").setSelectedKey("");
                this.getView().byId("purity").setSelectedKey("");
                this.getView().byId("rate").setValue("");
                this.getView().byId("salesman").setSelectedKey("");

                this.getView().byId("cheque").setValue("");
                this.getView().byId("adjo").setValue("");

                this.getView().byId("adjp").setValue("");
                this.getView().byId("chequeno").setValue("");
                this.getView().byId("adjonumber").setValue("");

                this.getView().byId("adjpnumber").setValue("");
                this.getView().byId("addt").setValue("");
                this.getView().byId("addt").getValue();
                this.getView().byId("amount").setText("0");

                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {

                    var rate_default = await localStorage.getItem("gold_rate");
                    this.getView().byId("rate").setValue(rate_default);

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
            changeID: function (oEvent) {
                this.getView().byId("id_val").setValue("");
                var selected = oEvent.getParameter("selectedItem").getKey();
                if (selected == "N/A") {
                    this.getView().byId("id_val").setEnabled(false);
                }
                else {
                    this.getView().byId("id_val").setEnabled(true);
                }
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
                    this.getView().byId("amount").setText(totalVal);
                }
                else {
                    this.getView().byId("amount").setText(0);
                    this.getView().byId("cheque").setValue(0);

                }
                this.onresetPayment();
            },




            onresetPayment: function () {
                var amount = this.getView().byId("amount").getText();
                this.getView().byId("cheque").setValue(amount);
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
            onAddInvoice: function () {
                var products = this.getView().getModel("InvoiceModel").getProperty("/results");
                if (products.length > 0) {
                    if (products[products.length - 1].orm_desc) {
                        products.push([]);
                        this.getView().getModel("InvoiceModel").refresh(true)
                    }
                }
                else {
                    products.push([]);
                    this.getView().getModel("InvoiceModel").refresh(true)
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
                            that.checkValidStep();
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
                    // var cheque = this.getView().byId("cheque").getValue();
                    // if (!cheque) {
                    //     cheque = 0;
                    // }
                    var adjo = this.getView().byId("adjo").getValue();
                    if (!adjo) {
                        adjo = 0;
                    }
                    var adjp = this.getView().byId("adjp").getValue();
                    if (!adjp) {
                        adjp = 0;
                    }
                    var cash = this.getView().byId("cash").getValue();
                    if (!cash) {
                        cash = 0;
                    }
                    var bal = parseFloat(amount) - (parseFloat(adjo) + parseFloat(adjp) + parseFloat(cash));
                    this.getView().byId("cheque").setValue(bal)
                }
                this.checkValidStep();
            },
            goToPaymentStep: function () {
                this.isnewOrder = false;
                var that = this;
                var host = this.getHost();
                var adjo = this.getView().byId("adjo").getValue();
                var adjonumber = this.getView().byId("adjonumber").getValue();
                var adjp = this.getView().byId("adjp").getValue();
                var adjpnumber = this.getView().byId("adjpnumber").getValue();
                if (adjo && adjonumber) {
                    this.byId("PurchaseStep").setNextStep(this.getView().byId("createOrderStep"));
                    this.getView().byId("order_order_id").setValue(adjonumber);
                    this.getView().byId("order_om_type").setSelectedKey(this.getView().byId("om_type").getSelectedKey());
                    this.getView().byId("order_purity").setSelectedKey(this.getView().byId("purity").getSelectedKey());
                    this.getView().byId("order_rate").setValue(this.getView().byId("rate").getValue());
                    this.getView().byId("order_oldgold").setValue(this.getView().byId("adjo").getValue());
                    this.getView().byId("order_totamount").setText(this.getView().byId("adjo").getValue());
                    // this.getView().byId("order_cash").setValue(this.getView().byId("adjo").getValue());

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
                                that.getView().byId("order_voucher_id").setText("Voucher Number: " + aDataId);
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
                            method: "checkfororderid",
                            data: JSON.stringify({
                                order_id: adjonumber
                            })
                        },
                        success: function (dataClient) {
                            try {
                                if (dataClient) {
                                    var aDataId = JSON.parse(dataClient);
                                    if (aDataId[0] && aDataId[0].order_exists > 0) {
                                        that.isnewOrder = false;
                                    }
                                    else {
                                        that.isnewOrder = true;

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


                    return true;
                }
                else if (adjp && adjpnumber) {
                    this.getView().byId("invoice_om_type").setSelectedKey(this.getView().byId("om_type").getSelectedKey());
                    this.getView().byId("invoice_purity").setSelectedKey(this.getView().byId("purity").getSelectedKey());
                    this.getView().byId("invoice_rate").setValue(this.getView().byId("rate").getValue());
                    this.getView().byId("invoice_adv").setValue(this.getView().byId("adjp").getValue());
                    var jModelID = new sap.ui.model.json.JSONModel({ results: [{}] });
                    this.getView().setModel(jModelID, "InvoiceModel");
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getHmCharge",
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = JSON.parse(dataClient);
                                that.hmData = aDataId;
                            }
                            catch (e) {
                                alert("Something went wrong", e)
                            }
                        },
                        error: function (request, error) {
                            console.log('Error')
                        }
                    });
                    this.byId("PurchaseStep").setNextStep(this.getView().byId("createInvoiceStep"));
                    return true;
                }
                else {
                    this.byId("PurchaseStep").setNextStep(this.getView().byId("DeliveryTypeStep"));
                }


            },
            onpressBack: function (oEvent) {
                this.oRouter.navTo("PurchaseList");
            },
            checkValidStep: function () {
                this._wizard.discardProgress(this.byId("PurchaseStep"));
                var cheque = this.getView().byId("cheque").getValue();
                if (cheque == 0) {
                    this.getView().byId("chequeno").setValue("-");
                }
                var chequeno = this.getView().byId("chequeno").getValue();
                var adjo = this.getView().byId("adjo").getValue();
                var adjonumber = this.getView().byId("adjonumber").getValue();
                var adjp = this.getView().byId("adjp").getValue();
                var adjpnumber = this.getView().byId("adjpnumber").getValue();

                if ((cheque && !chequeno) || (adjo && !adjonumber) || (adjp && !adjpnumber)) {
                    // If any of the specified conditions are met, return false

                    this._wizard.invalidateStep(this.byId("PurchaseStep"));
                    return false;
                } else if (!(cheque || adjo || adjp)) {
                    // If none of cheque, adjo, or adjp have a value, return false
                    this._wizard.invalidateStep(this.byId("PurchaseStep"));
                    return false;
                } else {
                    // All conditions are met, return true
                    this._wizard.validateStep(this.byId("PurchaseStep"));
                }


            },
            handleWizardCancel: function () {
                this._handleMessageBoxOpen("Are you sure you want to cancel your purchase?", "warning");
            },
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            // this._navBackToList();
                        }
                    }.bind(this)
                });
            },
            onSavePurchase: function () {

                var that = this;
                var host = this.getHost();
                var buyerDetails = this.getView().getModel("buyer").getData();
                // if (!buyerDetails.id) {
                //     this.saveBuyer();
                // }
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
                var cgst = 0;
                var sgst = 0;
                var amount = this.getView().byId("amount").getText();
                var taxamount = 0;
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
                                    if (adjp && adjpnumber && buyerDetails.gst_number) {
                                        MessageBox.confirm("Succesfully Updated", {
                                            actions: ["Generate E-Bill", "Proceed"],
                                            emphasizedAction: "Proceed",
                                            onClose: function (sAction) {
                                                if (sAction == "Proceed") {
                                                    that.successPrint();
                                                }
                                                else if (sAction == "Generate E-Bill") {
                                                    that.generateBill();
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        that.successPrint();
                                    }
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

            generateBill: function () {

                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                var id = this.getView().byId("adjpnumber").getValue();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getFullInvoice",
                        data: JSON.stringify({
                            invoice_id: id
                        })
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            aData = aData[0]
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getInvoiceDetail",
                                    data: JSON.stringify({
                                        invoice_id: id
                                    })
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataDetail = JSON.parse(dataClient);
                                        aData.productDetails = aDataDetail;
                                        $.ajax({
                                            url: host,
                                            type: "POST",
                                            data: {
                                                method: "generateInvoiceToken",
                                            },
                                            success: function (dataClient) {
                                                try {
                                                    var aDataId = JSON.parse(dataClient);
                                                    console.log(aDataId);
                                                    if (aDataId.access_token) {
                                                        $.ajax({
                                                            url: host,
                                                            type: "POST",
                                                            data: {
                                                                method: "generateInvoice",
                                                                data: JSON.stringify({ token: aDataId.access_token, ...aData }),
                                                            },
                                                            success: function (dataClient) {
                                                                try {
                                                                    var aDataId = JSON.parse(dataClient).results.message;
                                                                    if (!aDataId) {
                                                                        sap.ui.core.BusyIndicator.hide();
                                                                        alert(JSON.parse(dataClient).results.errorMessage);
                                                                    }
                                                                    else {
                                                                        // that.insertGstAck({ ...aDataId, invoice_id: data.invoice_id });
                                                                        $.ajax({
                                                                            url: host,
                                                                            type: "POST",
                                                                            data: {
                                                                                method: "insertGstAckRecord",
                                                                                data: JSON.stringify({
                                                                                    Irn: aDataId.Irn,
                                                                                    AckNo: aDataId.AckNo,
                                                                                    AckDt: aDataId.AckDt,
                                                                                    QRCodeUrl: aDataId.QRCodeUrl,
                                                                                    EinvoicePdf: aDataId.EinvoicePdf,
                                                                                    Status: aDataId.Status,
                                                                                    invoice_id: id,
                                                                                }),
                                                                            },
                                                                            success: function (dataClient) {
                                                                                try {
                                                                                    that.successPrint();
                                                                                }
                                                                                catch (e) {
                                                                                    console.log("Something went wrong", e.Error);
                                                                                    sap.ui.core.BusyIndicator.hide();
                                                                                }
                                                                            },
                                                                            error: function (request, error) {
                                                                                console.log('Error');
                                                                                sap.ui.core.BusyIndicator.hide();
                                                                            }
                                                                        });
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
                                    catch (e) {
                                        alert("Something went wrong", e);
                                        sap.ui.core.BusyIndicator.hide();

                                    }
                                },
                                error: function (request, error) {
                                    console.log('Error');
                                    sap.ui.core.BusyIndicator.hide();
                                }
                            });
                        }
                        catch (e) {
                            alert("Something went wrong", e);
                            sap.ui.core.BusyIndicator.hide();
                        }
                    },
                    error: function (request, error) {
                        console.log('Error');
                        sap.ui.core.BusyIndicator.hide();
                    }
                });


            },

            successPrint: function () {
                var that = this;
                var adjo = this.getView().byId("adjo").getValue();
                var adjonumber = this.getView().byId("adjonumber").getValue();
                var adjp = this.getView().byId("adjp").getValue();
                var adjpnumber = this.getView().byId("adjpnumber").getValue();
                var aButton = [new sap.m.Button({
                    text: "Print Purchase Slip",
                    width: "100%",
                    type: "Success",
                    press: function () {
                        that.printPurchase()
                    }
                })]
                if (adjo && adjonumber) {
                    aButton.push(new sap.m.Button({
                        text: "Print Order Slip",
                        width: "100%",
                        type: "Success",
                        press: function () {
                            if (that.isnewOrder) {
                                that.printOrder(adjonumber)
                            }
                            else {
                                var voucher_id = that.getView().byId("order_voucher_id").getText();
                                that.printVoucher(voucher_id)
                            }

                        }
                    }))
                }
                if (adjp && adjpnumber) {
                    aButton.push(new sap.m.Button({
                        text: "Print Invoice Slip",
                        width: "100%",
                        type: "Success",
                        press: function () {
                            that.printInvoice()
                        }
                    }))
                }
                if (!that.oDefaultDialog) {

                    that.oDefaultDialog = new Dialog({
                        title: "Operation Successful",
                        content: [new sap.m.VBox({
                            items: aButton
                        }).addStyleClass("sapUiMediumMargin")],
                        endButton: new Button({
                            text: "Close",
                            press: function () {
                                that.oDefaultDialog.close();
                                that.oDefaultDialog.destroy();
                                that.oDefaultDialog = undefined;
                                that.oRouter.navTo("PurchaseList");
                            }.bind(that)
                        })
                    });
                    that.oDefaultDialog.addStyleClass('sapUiResponsivePadding');
                    // to get access to the controller's model
                    that.getView().addDependent(that.oDefaultDialog);
                }

                that.oDefaultDialog.open();
            },
            printPurchase: function () {
                var id = this.getView().byId("order_id").getValue();
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getPurchaseById",
                        data: JSON.stringify({
                            purchase_id: id
                        })
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            aData = aData[0];
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getPurchaseDetailsById",
                                    data: JSON.stringify({
                                        purchase_id: id
                                    })
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataDetail = JSON.parse(dataClient);
                                        aData.productDetails = aDataDetail;
                                        that.generatePurchaseBill(aData);
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
            generatePurchaseBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                console.log(data);

                sap.ui.core.BusyIndicator.hide();
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.total_amount))

                // Open a new popup window
                var printContent = `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
                    <title>Manikanchan Jewellery House</title>
                
                    <!-- Bootstrap CSS -->
                    <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
                
                    <!-- Fearther CSS -->
                    <link rel="stylesheet" href="./assets/css/feather.css">
                
                    <!-- Fontawesome CSS -->
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/fontawesome.min.css">
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/all.min.css">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
                    <!-- Main CSS -->
                    <link rel="stylesheet" href="./assets/css/style.css">
                </head>
                
                <body>
                    <div class="main-wrapper">
                        <div class="container">
                            <div class="invoice-wrapper download_section" id="download_section">
                                <div class="inv-content">
                                    <div class="invoice-header">
                                        <div class="inv-header-left">
                                        <div style="
                                        font-size: 24px;
                                        font-weight: 700;
                                        color: #2c3038;
                                    ">PURCHASE MEMO</div>
                                        </div>
                                        <div class="inv-header-right">
                                            <div class="inv-details">
                                                <div class="inv-date">
                                                    Date: <span>${data.purchase_date}</span>
                                                </div>
                                                <div class="inv-date">
                                                   Memo No: <span>${data.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="invoice-address">
                                        <div class="invoice-to">
                                            <span>Invoice To:</span>
                                            <div class="inv-to-address">
                                               ${data.customer_name}<br>
                                               ${data.address}<br>
                                               ${data.gst_number}<br>
                                               ${data.contact_number}
                                            </div>
                                        </div>
                                        <div class="invoice-to">
                
                                        </div>
                                        <div class="company-details">
                                            <span></span>
                                            <div>
                                                <br />
                                                <table>
                                                    <tr>
                                                        <td>ORN.TYPE</td>
                                                        <td style="text-align:left">: ${data.type}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>PURITY</td>
                                                        <td style="text-align:left">: ${data.purity}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>RATE PER GRAM</td>
                                                        <td style="text-align:left">: ${data.rate}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>SM CODE</td>
                                                        <td style="text-align:left">: ${data.created_by}</td>
                                                    </tr>
                                                </table>
                                            </div>
                
                                        </div>
                                    </div>
                                    <div class="invoice-table">
                                        <div class="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th class="table_width_1">SL. NO</th>
                                                        <th class="table_width_2">Item</th>
                                                        <th class="table_width_1 text-center">PCS</th>
                                                        <th class="table_width_1 text-center">GROSS W.T.(Gms)</th>
                                                        <th class="table_width_1 text-center">NET W.T.(Gms)</th>
                                                        <th class="table_width_1 text-center">AMOUNT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>`;

                data.productDetails.map((value, index) => {
                    printContent += `<tr>
                        <td>${index + 1}</td>
                        <td class="">${value.orm_desc}</td>
                        <td class="text-center">${value.qty}</td>
                        <td class="text-center">${value.gross_wt}</td>
                        <td class="text-center">${value.net_wt}</td>
                        <td class="text-center">${value.amount}</td>
                    </tr>`;
                });

                printContent += ` </tbody>
                       </table>
                   </div>
               </div>
               <div class="invoice-table-footer" style="align-items: baseline;">
                   <div class="table-footer-left" >
                       <span>MODE OF PAYMENT</span>
                       <br/>
                       <table>
                       <tbody>
                           <tr>
                               <td>CASH</td>
                               <td>: ${data.cash}</td>
                           </tr>
                           <tr>
                               <td>CHEQUE</td>
                               <td>: ${data.cheque}${data.chequeno ? ` (${data.chequeno})` : ''}</td>
                           </tr>
                           <tr>
                               <td>TAX INVOICE ADJ.</td>
                               <td>: ${data.adjp}${data.adjpnumber ? ` (TAX INVOICE NO:- ${data.adjpnumber})` : ''}</td>
                           </tr>
                           <tr>
                               <td>ORDER ADJ. </td>
                               <td>: ${data.adjo}${data.adjonumber ? ` (ORDER NO:- ${data.adjonumber})` : ''}</td>
                           </tr>
                       </tbody>
                   </table>
                   <br/>
                   <div>
                   <span style="padding:10px 0px;font-weight:bold;color:black">${inWords}</span>
                   </div>
                   </div>
                   <div class="text-end table-footer-right">
                   <table class="totalamt-table">
                   <tbody>
                       <tr>
                           <td>Total</td>
                           <td>${data.total_amount}</td>
                       </tr>
                   </tbody>
               </table>
                   </div>
               </div>
               `;
                printContent += `  </div>
       </div>
       <div class="file-link">
                            <button class="download_btn download-link" onclick="downloadPDF()">
                                <i class="feather-download-cloud me-1"></i> <span>Download</span>
                            </button>
                            <a href="#" id="printLink" class="print-link">
                                <i class="feather-printer"></i> <span class="">Print</span>
                            </a>
                        </div>
   </div>
</div>
</body>
<script>
var printLink = document.getElementById('printLink');

// Add a click event listener to the link
printLink.addEventListener('click', function(event) {
// Prevent the default link behavior
event.preventDefault();

// Trigger the print action
window.print();
});

function downloadPDF() {
// Get the element containing the static content
var staticContent = document.getElementById('download_section');

// Use html2pdf to generate and download the PDF
html2pdf(staticContent,{ filename: "Purchase Memo:"+${data.id} });
}
</script>

</html>`;

                const popupWindow = window.open('', "_blank", 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);
                popupWindow.document.close();

                // Trigger the print action in the new window
                popupWindow.print();

            },

            // Order functions -------------------------------------------------------------------------------------------------------------

            reset: function () {
                this.getView().byId("order_rate").setValue(0);
                this.getView().byId("order_order_id").setValue('');
                this.getView().byId("order_cash").setValue(0);
                this.getView().byId("order_cheque").setValue(0);
                this.getView().byId("order_upi").setValue(0);
                this.getView().byId("order_card").setValue(0);
                this.getView().byId("order_bank").setValue(0);
                // this.getView().byId("order_amount").setValue(0);
                this.getView().byId("order_totamount").setText(0);
                this.getView().byId("order_addt").setValue('');
                this.getView().byId("order_chequeno").setValue('');
                this.getView().byId("order_upidetails").setValue('');
                this.getView().byId("order_apprcode").setValue('');
                this.getView().byId("order_oldgold").setValue(0);
            },
            clearAll: function () {
                this.getView().byId("order_cheque").setValue(0);
                this.getView().byId("order_upi").setValue(0);
                this.getView().byId("order_card").setValue(0);
                this.getView().byId("order_bank").setValue(0);
            },
            calVal: function () {
                var old = this.getView().byId('order_oldgold').getValue();
                var cash = this.getView().byId("order_cash").getValue();
                var cheque = this.getView().byId("order_cheque").getValue();
                var upi = this.getView().byId("order_upi").getValue();
                var card = this.getView().byId("order_card").getValue();
                var bank = this.getView().byId("order_bank").getValue();
                var adamount = parseFloat(cash) + parseFloat(cheque) + parseFloat(upi) + parseFloat(card) + parseFloat(bank);
                this.getView().byId('order_totamount').setText(parseFloat(old) + parseFloat(adamount));
            },
            adjustBal: function () {
                var amount = this.getView().byId("order_amount").getValue();
                if (amount) {
                    var card = this.getView().byId("order_card").getValue();
                    if (!card) {
                        card = 0;
                    }
                    var cheque = this.getView().byId("order_cheque").getValue();
                    if (!cheque) {
                        cheque = 0;
                    }
                    var upi = this.getView().byId("order_upi").getValue();
                    if (!upi) {
                        upi = 0;
                    }
                    var bank = this.getView().byId("order_bank").getValue();
                    if (!bank) {
                        bank = 0;
                    }
                    var bal = parseFloat(amount) - (parseFloat(card) + parseFloat(upi) + parseFloat(cheque) + parseFloat(bank));
                    this.getView().byId("order_cash").setValue(bal)
                }
            },
            checkOrderStep: function () {

            },
            goToOrderStep: function () {
                var that = this;
                var host = this.getHost();
                var adjp = this.getView().byId("adjp").getValue();
                var adjpnumber = this.getView().byId("adjpnumber").getValue();
                if (adjp && adjpnumber) {
                    this.getView().byId("invoice_om_type").setSelectedKey(this.getView().byId("om_type").getSelectedKey());
                    this.getView().byId("invoice_purity").setSelectedKey(this.getView().byId("purity").getSelectedKey());
                    this.getView().byId("invoice_rate").setValue(this.getView().byId("rate").getValue());
                    this.getView().byId("invoice_adv").setValue(this.getView().byId("adjp").getValue());
                    var jModelID = new sap.ui.model.json.JSONModel({ results: [{}] });
                    this.getView().setModel(jModelID, "InvoiceModel");
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getHmCharge",
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = JSON.parse(dataClient);
                                that.hmData = aDataId;
                            }
                            catch (e) {
                                alert("Something went wrong", e)
                            }
                        },
                        error: function (request, error) {
                            console.log('Error')
                        }
                    });
                    this.byId("createOrderStep").setNextStep(this.getView().byId("createInvoiceStep"));
                    return true;
                }
                else {
                    this.byId("createOrderStep").setNextStep(this.getView().byId("DeliveryTypeStep"));
                }


            },
            completedHandler: function () {
                sap.ui.core.BusyIndicator.show();
                var adjo = this.getView().byId("adjo").getValue();
                var adjonumber = this.getView().byId("adjonumber").getValue();
                var adjp = this.getView().byId("adjp").getValue();
                var adjpnumber = this.getView().byId("adjpnumber").getValue();
                if (adjo && adjonumber) {
                    this.insertOrder();
                }
                else if (adjp && adjpnumber) {
                    this.insertInvoice();
                }
                else {
                    this.onSavePurchase()
                }

            },

            insertOrder: function () {
                var that = this;
                var host = this.getHost();
                var buyerDetails = this.getView().getModel("buyer").getData();
                // if (!buyerDetails.id) {
                //     this.saveBuyer();
                // }
                var om_type = this.getView().byId("order_om_type").getSelectedKey();
                var purity = this.getView().byId("order_purity").getSelectedItem()?.getText();
                var rate = this.getView().byId("order_rate").getValue();
                var order_id = this.getView().byId("order_order_id").getValue();
                var purchase_id = this.getView().byId("order_id").getValue();
                var order_date = this.getView().byId("invoice_date").getDateValue().toISOString().split('T')[0];
                var salesman = this.getView().byId("salesman").getSelectedItem()?.getText();
                var cash = this.getView().byId("order_cash").getValue();
                var cheque = this.getView().byId("order_cheque").getValue();
                var upi = this.getView().byId("order_upi").getValue();
                var card = this.getView().byId("order_card").getValue();
                var bank = this.getView().byId("order_bank").getValue();
                // var amount = this.getView().byId("order_amount").getValue();
                var total_amount = this.getView().byId("order_totamount").getText();
                var addt = this.getView().byId("order_addt").getValue();
                var chequeno = this.getView().byId("order_chequeno").getValue();
                var upidetails = this.getView().byId("order_upidetails").getValue();
                var apprcode = this.getView().byId("order_apprcode").getValue();
                var oldgold = this.getView().byId("order_oldgold").getValue();
                var bankdetails = this.getView().byId("order_bankdetails").getValue();
                var order_payload = {
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
                    adv_amount: total_amount,
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
                }
                if (this.isnewOrder) {
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "insertOrder",
                            data: JSON.stringify(order_payload),
                        },
                        success: function (dataClient) {
                            // sap.ui.core.BusyIndicator.hide();
                            var adjp = that.getView().byId("adjp").getValue();
                            var adjpnumber = that.getView().byId("adjpnumber").getValue();
                            if (adjp && adjpnumber) {
                                that.insertInvoice();
                            }
                            else {
                                that.onSavePurchase();
                            }
                            console.log(dataClient);
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "insertVoucher",
                                    data: JSON.stringify({
                                        order_id: order_id,
                                        amount: total_amount,
                                        voucher_date: order_date,
                                        rate: rate,
                                        cash: cash,
                                        card: card,
                                        cheque: cheque,
                                        bank: bank,
                                        upi: upi,
                                        oldgold: oldgold,
                                        apprcode: apprcode,
                                        chequeno: chequeno,
                                        bank_details: bankdetails,
                                        upidetails: upidetails,
                                    }),
                                },
                                success: function (dataClient) {
                                    sap.ui.core.BusyIndicator.hide();
                                    console.log(dataClient);
                                    // MessageBox.success("Succesfully Order created", {
                                    //     actions: [MessageBox.Action.OK],
                                    //     onClose: function (sAction) {
                                    //         that.oRouter.navTo('Main')
                                    //     }
                                    // });
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
                }
                else {
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "insertVoucher",
                            data: JSON.stringify({
                                order_id: order_id,
                                amount: total_amount,
                                voucher_date: order_date,
                                rate: rate,
                                cash: cash,
                                card: card,
                                cheque: cheque,
                                bank: bank,
                                upi: upi,
                                oldgold: oldgold,
                            }),
                        },
                        success: function (dataClient) {
                            sap.ui.core.BusyIndicator.hide();
                            console.log(dataClient);
                            var adjp = that.getView().byId("adjp").getValue();
                            var adjpnumber = that.getView().byId("adjpnumber").getValue();
                            if (adjp && adjpnumber) {
                                that.insertInvoice();
                            }
                            else {
                                that.onSavePurchase();
                            }
                        },
                        error: function (request, error) {
                            console.log('Error');
                            sap.ui.core.BusyIndicator.hide();
                        },
                    });
                }
            },

            printOrder: function (oId) {
                var that = this;
                var host = this.getHost();
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
                                    that.generateOrderBill(aDataId);
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

            },

            printVoucher: function (oId) {
                var that = this;
                var host = this.getHost();
                var voucherId = oId.split(": ")[1];
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getVoucherWithOrder",
                        data: JSON.stringify({
                            voucher_id: voucherId
                        })
                    },
                    success: function (dataClient) {
                        try {
                            if (dataClient) {
                                var aDataId = JSON.parse(dataClient);
                                if (aDataId) {
                                    that.generateVoucherBill(aDataId);
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

            },
            generateOrderBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                console.log(data);

                sap.ui.core.BusyIndicator.hide();
                // Open a new popup window
                var printContent = this.getHTMLContent(data);

                const popupWindow = window.open('', "_blank", 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);
                popupWindow.document.close();

                // Trigger the print action in the new window
                popupWindow.print();

            },

            generateVoucherBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                console.log(data);

                sap.ui.core.BusyIndicator.hide();
                // Open a new popup window
                var printContent = this.getHTMLContentVoucher(data[0]);

                const popupWindow = window.open('', "_blank", 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);
                popupWindow.document.close();

                // Trigger the print action in the new window
                popupWindow.print();

            },
            getHTMLContentVoucher: function (data) {
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.amount))

                return `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
                    <title>Manikanchan Jewellery House</title>
                
                    <!-- Bootstrap CSS -->
                    <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
                
                    <!-- Fearther CSS -->
                    <link rel="stylesheet" href="./assets/css/feather.css">
                
                    <!-- Fontawesome CSS -->
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/fontawesome.min.css">
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/all.min.css">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
                
                    <!-- Main CSS -->
                    <link rel="stylesheet" href="./assets/css/style.css">
                </head>
                
                <body id="main-body">
                    <div class="main-wrapper">
                        <div class="container">
                            <div class="invoice-wrapper download_section" id="download_section">
                                <div class="inv-content">
                                    <div class="invoice-header">
                                        <div class="inv-header-left">
                                        <div style="
                                        font-size: 24px;
                                        font-weight: 700;
                                        color: #2c3038;
                                    ">ADVANCE - VOUCHER</div>
                                        </div>
                                        <div class="inv-header-right">
                                        </div>
                                    </div>
                                    <div class="invoice-address">
                                        <div class="invoice-to">
                                            <span>Invoice To:</span>
                                            <div class="inv-to-address">
                                               ${data.name}<br>
                                               ${data.address}<br>
                                               ${data.gst_number}<br>
                                               ${data.contact_number}
                                            </div>
                                        </div>
                                        <div class="invoice-to">
                
                                        </div>
                                        <div class="company-details">
                                        <span></span>
                                        <div>
                                            <br />
                                            <table>
                                                <tr>
                                                    <td>Order No.</td>
                                                    <td style="text-align:left">: ${data.order_id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Voucher No.</td>
                                                    <td style="text-align:left">: ${data.id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Voucher Date</td>
                                                    <td style="text-align:left">: ${data.voucher_date}</td>
                                                </tr>
                                                <tr>
                                                    <td>SM CODE</td>
                                                    <td style="text-align:left">: ${data.created_by}</td>
                                                </tr>
                                            </table>
                                        </div>
            
                                    </div>
                                    </div>
                                    <div class="invoice-table">
                                        <div class="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th class="table_width_2">Item</th>
                                                        <th class="table_width_1">HSN</th>
                                                        <th class="table_width_1 text-center">AMOUNT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td class="">${data.type}</td>
                                                    <td class="table-description">${data.HSN}</td>
                                                    <td class="text-center">${data.amount}</td>
                                                </tr>
                                                 </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="invoice-table-footer" style="
                                display: flex;
                                align-items: flex-start;
                            ">
                                    <div class="table-footer-left">
                                    <span>MODE OF PAYMENT</span>
                                    <br/>
                                    <table>
                                    <tbody>
                                        <tr>
                                            <td>CASH</td>
                                            <td>: ${data.cash}</td>
                                        </tr>
                                        <tr>
                                            <td>CHEQUE</td>
                                            <td>: ${data.cheque}</td>
                                        </tr>
                                        <tr>
                                            <td>CARD</td>
                                            <td>: ${data.card}</td>
                                        </tr>
                                        <tr>
                                            <td>UPI</td>
                                            <td>: ${data.upi}</td>
                                        </tr>
                                        <tr>
                                            <td>BANK TRF</td>
                                            <td>: ${data.bank}</td>
                                        </tr>
                                        <tr>
                                        <td>OLD GOLD ADJ</td>
                                        <td>: ${data.oldgold}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <br/>
                                <div>
                                <span style="padding:10px 0px;font-weight:bold;color:black">${inWords}</span>
                                </div>
                                    </div>
                                    <div class="table-footer-right">
                                        <table class="totalamt-table">
                                            <tbody>
                                                <tr>
                                                    <td>Total:</td>
                                                    <td>${data.amount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                </div>
                        </div>
                        <div class="file-link">
                            <button class="download_btn download-link" onclick="downloadPDF()">
                                <i class="feather-download-cloud me-1"></i> <span>Download</span>
                            </button>
                            <a href="#" id="printLink" class="print-link">
                                <i class="feather-printer"></i> <span class="">Print</span>
                            </a>
                        </div>
                    </div>
                    </div>
                    </body>
                    <script>
                    var printLink = document.getElementById('printLink');

                    // Add a click event listener to the link
                    printLink.addEventListener('click', function(event) {
                    // Prevent the default link behavior
                    event.preventDefault();

                    // Trigger the print action
                    window.print();
                    });

                    function downloadPDF() {
                    // Get the element containing the static content
                    var staticContent = document.getElementById('download_section');

                    // Use html2pdf to generate and download the PDF
                    html2pdf(staticContent,{ filename: "Advance-voucher:"+${data.order_id} });
                    }
                    </script>
                    </html>`;
            },

            getHTMLContent: function (data) {
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.total_amount))
                return `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
                    <title>Manikanchan Jewellery House</title>
                
                    <!-- Bootstrap CSS -->
                    <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
                
                    <!-- Fearther CSS -->
                    <link rel="stylesheet" href="./assets/css/feather.css">
                
                    <!-- Fontawesome CSS -->
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/fontawesome.min.css">
                    <link rel="stylesheet" href="./assets/plugins/fontawesome/css/all.min.css">
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
                
                    <!-- Main CSS -->
                    <link rel="stylesheet" href="./assets/css/style.css">
                </head>
                
                <body id="main-body">
                    <div class="main-wrapper">
                        <div class="container">
                            <div class="invoice-wrapper download_section" id="download_section">
                                <div class="inv-content">
                                    <div class="invoice-header">
                                        <div class="inv-header-left">
                                        <div style="
                                        font-size: 24px;
                                        font-weight: 700;
                                        color: #2c3038;
                                    ">ADVANCE - VOUCHER</div>
                                        </div>
                                        <div class="inv-header-right">
                                        </div>
                                    </div>
                                    <div class="invoice-address">
                                        <div class="invoice-to">
                                            <span>Invoice To:</span>
                                            <div class="inv-to-address">
                                               ${data.name}<br>
                                               ${data.address}<br>
                                               ${data.gst_number}<br>
                                               ${data.contact_number}
                                            </div>
                                        </div>
                                        <div class="invoice-to">
                
                                        </div>
                                        <div class="company-details">
                                        <span></span>
                                        <div>
                                            <br />
                                            <table>
                                                <tr>
                                                    <td>Order No.</td>
                                                    <td style="text-align:left">: ${data.order_id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Voucher No.</td>
                                                    <td style="text-align:left">: ${data.id}</td>
                                                </tr>
                                                <tr>
                                                    <td>Voucher Date</td>
                                                    <td style="text-align:left">: ${data.order_date}</td>
                                                </tr>
                                                <tr>
                                                    <td>SM CODE</td>
                                                    <td style="text-align:left">: ${data.created_by}</td>
                                                </tr>
                                            </table>
                                        </div>
            
                                    </div>
                                    </div>
                                    <div class="invoice-table">
                                        <div class="table-responsive">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th class="table_width_2">Item</th>
                                                        <th class="table_width_1">HSN</th>
                                                        <th class="table_width_1 text-center">AMOUNT</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td class="">${data.type}</td>
                                                    <td class="table-description">${data.HSN}</td>
                                                    <td class="text-center">${data.total_amount}</td>
                                                </tr>
                                                 </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="invoice-table-footer" style="
                                display: flex;
                                align-items: flex-start;
                            ">
                                    <div class="table-footer-left">
                                    <span>MODE OF PAYMENT</span>
                                    <br/>
                                    <table>
                                    <tbody>
                                        <tr>
                                            <td>CASH</td>
                                            <td>: ${data.cash}</td>
                                        </tr>
                                        <tr>
                                            <td>CHEQUE</td>
                                            <td>: ${data.cheque}${data.chequeno ? ` (${data.chequeno})` : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>CARD</td>
                                            <td>: ${data.card}${data.apprcode ? ` Approval Code: ${data.apprcode})` : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>UPI</td>
                                            <td>: ${data.upi}${data.upidetails ? ` (${data.upidetails})` : ''}</td>
                                        </tr>
                                        <tr>
                                            <td>BANK TRF</td>
                                            <td>: ${data.bank}${data.bankdetails ? ` (${data.bankdetails})` : ''}</td>
                                        </tr>
                                        <tr>
                                        <td>OLD GOLD ADJ</td>
                                        <td>: ${data.old_gold_amount}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <br/>
                                <div>
                                <span style="padding:10px 0px;font-weight:bold;color:black">${inWords}</span>
                                </div>
                                    </div>
                                    <div class="table-footer-right">
                                        <table class="totalamt-table">
                                            <tbody>
                                                <tr>
                                                    <td>Total:</td>
                                                    <td>${data.total_amount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                </div>
                        </div>
                        <div class="file-link">
                            <button class="download_btn download-link" onclick="downloadPDF()">
                                <i class="feather-download-cloud me-1"></i> <span>Download</span>
                            </button>
                            <a href="#" id="printLink" class="print-link">
                                <i class="feather-printer"></i> <span class="">Print</span>
                            </a>
                        </div>
                    </div>
                    </div>
                    </body>
                    <script>
                    var printLink = document.getElementById('printLink');

                    // Add a click event listener to the link
                    printLink.addEventListener('click', function(event) {
                    // Prevent the default link behavior
                    event.preventDefault();

                    // Trigger the print action
                    window.print();
                    });

                    function downloadPDF() {
                    // Get the element containing the static content
                    var staticContent = document.getElementById('download_section');

                    // Use html2pdf to generate and download the PDF
                    html2pdf(staticContent,{ filename: "Advance-voucher:"+${data.order_id} });
                    }
                    </script>
                    </html>`;
            },
            // Invoice function -----------------------------------------------------------------------------------------------------------------------------
            insertInvoice: function () {
                var that = this;
                var host = this.getHost();
                var buyerDetails = this.getView().getModel("buyer").getData();
                // if (!buyerDetails.id) {
                //     this.saveBuyer();
                // }
                var productDetails = this.getView().getModel("InvoiceModel").getProperty("/results");
                var om_type = this.getView().byId("invoice_om_type").getSelectedItem()?.getText();
                var purity = this.getView().byId("invoice_purity").getSelectedItem()?.getText();
                var rate = this.getView().byId("invoice_rate").getValue();
                var invoice_date = this.getView().byId("invoice_date").getDateValue().toISOString().split('T')[0];
                var salesman = this.getView().byId("salesman").getSelectedItem()?.getText();
                var cash = this.getView().byId("invoice_cash").getValue();
                var cheque = this.getView().byId("invoice_cheque").getValue();
                var upi = this.getView().byId("invoice_upi").getValue();
                var card = this.getView().byId("invoice_card").getValue();
                var bank = this.getView().byId("invoice_bank").getValue();
                var chequeno = this.getView().byId("invoice_chequeno").getValue();
                var upidetails = this.getView().byId("invoice_upidetails").getValue();
                var apprcode = this.getView().byId("invoice_apprcode").getValue();
                var bankdetails = this.getView().byId("invoice_bankdetails").getValue();
                var due = this.getView().byId("invoice_due").getValue();
                var addt = this.getView().byId("invoice_addt").getValue();
                var cgst = this.getView().byId("invoice_cgst").getText();
                var sgst = this.getView().byId("invoice_sgst").getText();
                var discount = this.getView().byId("invoice_discount").getText();
                var amount = this.getView().byId("invoice_amount").getValue();
                var nontax = this.getView().byId("invoice_nontax").getValue();
                var taxamount = this.getView().byId("invoice_taxamount").getText();
                var taxafamount = this.getView().byId("invoice_taxafamount").getText();
                var adv = this.getView().byId("invoice_adv").getValue();
                var purchase_id = this.getView().byId("order_id").getValue();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "insertInvoice",
                        data: JSON.stringify({
                            contact_number: buyerDetails.contact_number,
                            customer_name: buyerDetails.name,
                            id_type: buyerDetails.id_type,
                            card_number: buyerDetails.id_value,
                            address: buyerDetails.address,
                            state: buyerDetails.state,
                            invoice_date: invoice_date,
                            gst_number: buyerDetails.gst_number,
                            city_pin: buyerDetails.pincode,
                            notes: addt,
                            discounted_price: discount,
                            cgst: cgst,
                            sgst: sgst,
                            nontax: nontax,
                            total_amount: amount,
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
                            due: due,
                            taxamount: taxamount,
                            taxafamount: taxafamount,
                            adv: adv,
                            order_id: "",
                            order_date: '0000-00-00',
                            old_gold_amount: adv,
                            purchase_id: purchase_id,
                        }),
                    },
                    success: function (dataClient) {
                        console.log(dataClient);
                        if (dataClient.indexOf('Insertion successful') !== -1) {
                            that.onSavePurchase();
                            var invoice_id = JSON.parse(dataClient)[1];
                            var reqData = JSON.stringify({
                                invoice_id: invoice_id,
                                data: productDetails,

                            });
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "insertInvoiceDetails",
                                    data: reqData,
                                },
                                success: function (dataClient) {
                                    console.log(dataClient);
                                    sap.ui.core.BusyIndicator.hide();
                                },
                                error: function (request, error) {
                                    MessageBox.error("Submition failed.");
                                    console.log('Error');
                                    sap.ui.core.BusyIndicator.hide();
                                },
                            });
                        }
                        else {

                        }

                    },
                    error: function (request, error) {
                        console.log('Error');
                        MessageBox.error("Submition failed.");
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },
            onInputCode: function (oEvent) {
                var omcode = oEvent.getSource().getValue();
                var index = oEvent.getSource().getBindingContext("InvoiceModel").getPath().split("/results/")[1];
                index = parseInt(index)
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getStockByORMCODE",
                        data: JSON.stringify({ omcode: omcode }),
                    },
                    success: function (dataClient) {
                        try {
                            // var temp = [...tableItems];
                            var temp = JSON.parse(dataClient);
                            var products = that.getView().getModel("InvoiceModel").getProperty("/results");
                            products[index] = temp[0];
                            products[index].hmcharge = that.selectedHM;
                            products[index].making = 0;
                            products[index].st_val = 0;
                            that.getView().getModel("InvoiceModel").refresh(true)
                            that.getHM();
                            // temp[index].hmcharge = HMCharge;
                            // temp[index].value = (parseFloat(temp[index].net_wt) * parseFloat(invoiceData.rate ? invoiceData.rate : 1));
                            // temp[index].amount = (parseFloat(temp[index].net_wt) * parseFloat(invoiceData.rate ? invoiceData.rate : 1)) + parseFloat(HMCharge);

                            // setTableItems([...temp])
                        } catch (e) {
                            console.log(e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                    }
                });
            },
            getHM: function (oEvent) {
                var selected = this.getView().byId("invoice_om_type").getSelectedKey();
                var ahm = this.hmData.filter(val => val.om_id == selected);
                if (ahm && ahm.length > 0) {
                    this.selectedHM = ahm[0].item;
                    var products = this.getView().getModel("InvoiceModel").getProperty("/results");
                    products.map(value => {
                        value.hmcharge = ahm[0].item;
                    });
                    this.getView().getModel("InvoiceModel").refresh(true);
                    this.calValueInvoice();
                }
                else {
                    this.selectedHM = 0;
                }
            },
            calValueInvoice: function () {
                var rate = this.getView().byId('invoice_rate').getValue();
                rate = parseFloat(rate);
                if (!(rate > 0)) {
                    rate = 0;
                }
                var products = this.getView().getModel("InvoiceModel").getProperty("/results");
                products.map(value => {
                    value.value = parseFloat(value.net_wt) * rate;
                    value.amount = (parseFloat(value.net_wt) * rate) + parseFloat(value.making ? value.making : 0) + parseFloat(value.hmcharge ? value.hmcharge : 0);
                });
                this.getView().getModel("InvoiceModel").refresh(true);
                this.getView().byId("invoice_discount").setText(0);
                this.getView().byId("roundoff").setText(0);
                this.grandTotal = 0;
                this.calAddtInvoice();
            },
            calAddtInvoice: function () {
                var products = this.getView().getModel("InvoiceModel").getProperty("/results");
                var gstM = this.getView().getModel("gstModel").getData();
                var totalVal = 0;
                var adv = this.getView().byId("invoice_adv").getValue();
                if (!adv) {
                    adv = 0
                }
                else {
                    adv = parseFloat(adv)
                }
                products.map(value => {
                    totalVal += parseFloat(value.amount);
                });
                if (totalVal && totalVal > 0) {

                    var nontax = this.getView().byId("invoice_nontax").getValue();
                    var discount = this.getView().byId("invoice_discount").getText();
                    if (!discount) {
                        discount = 0
                    }
                    else {
                        discount = parseFloat(discount)
                    }
                    if (!nontax) {
                        nontax = 0
                    }
                    else {
                        nontax = parseFloat(nontax)
                    }
                    this.getView().byId("totamount").setText(totalVal);
                    this.getView().byId("invoice_discount").setText(discount);
                    this.getView().byId("invoice_taxamount").setText(totalVal - (adv + discount));
                    var taxamount = totalVal - (adv + discount);
                    var gst = (taxamount * (parseFloat(gstM.cgst) / 100)).toFixed(2);
                    gst = parseFloat(gst);
                    this.getView().byId("invoice_cgst").setText(gst);
                    this.getView().byId("invoice_sgst").setText(gst);
                    var taxafamount = gst + gst + (totalVal - (adv + discount));
                    this.getView().byId("invoice_taxafamount").setText(taxafamount);
                    var totalAmount = nontax + taxafamount;
                    if (this.grandTotal > totalAmount) {
                        var roundoff = this.grandTotal - totalAmount;
                    }
                    else {
                        var roundoff = 0;
                    }
                    roundoff = roundoff.toFixed(2);
                    roundoff = parseFloat(roundoff)
                    this.getView().byId("roundoff").setText(roundoff);
                    this.getView().byId("invoice_amount").setValue((totalAmount + roundoff).toFixed(2));
                    this.grandTotal = (totalAmount + roundoff).toFixed(2);

                    this.getView().byId("invoice_cash").setValue((totalAmount + roundoff).toFixed(2));
                }
                else {
                    this.getView().byId("invoice_taxamount").setText(0);
                    this.getView().byId("invoice_cgst").setText(0);
                    this.getView().byId("invoice_sgst").setText(0);
                    this.getView().byId("invoice_taxafamount").setText(0);
                    this.getView().byId("invoice_amount").setValue(0);
                    this.getView().byId("invoice_nontax").setValue(0);
                    this.getView().byId("invoice_cash").setValue(0);

                }
                this.onresetPaymentInvoice();
            },
            onresetPaymentInvoice: function () {
                // var amount = this.getView().byId("invoice_amount").getValue();
                // this.getView().byId("invoice_cash").setValue(amount);
                this.getView().byId("invoice_cheque").setValue(0);
                this.getView().byId("invoice_upi").setValue(0);
                this.getView().byId("invoice_card").setValue(0);
                this.getView().byId("invoice_bank").setValue(0);
                this.getView().byId("invoice_due").setValue(0);
            },
            onPressRemove: function (oEvent) {
                var index = oEvent.getSource().getBindingContext("InvoiceModel").getPath().split("/results/")[1];
                index = parseInt(index);
                var products = this.getView().getModel("InvoiceModel").getProperty("/results");
                products.splice(index, 1);
                this.getView().getModel("InvoiceModel").refresh(true);
                this.calValueInvoice();

            },
            changeAmountInvoice: function () {
                var amount = this.getView().byId("invoice_amount").getValue();
                amount = parseFloat(amount);
                // var adv = this.getView().byId("invoice_adv").getValue();
                // var nontax = this.getView().byId("invoice_nontax").getValue();
                // if (!adv) {
                //     adv = 0
                // }
                // if (!nontax) {
                //     nontax = 0
                // }
                // else {
                //     nontax = parseFloat(nontax)
                // }
                // var products = this.getView().getModel("InvoiceModel").getProperty("/results");
                // var gstM = this.getView().getModel("gstModel").getData();
                // var totalVal = 0;
                // products.map(value => {
                //     totalVal += parseFloat(value.amount);
                // });
                // var gst = (totalVal * (parseFloat(gstM.cgst) / 100)).toFixed(2);
                // gst = parseFloat(gst);
                // totalVal = totalVal + gst + gst + nontax - adv;
                var discount = this.grandTotal - amount;
                // if (totalVal && totalVal > 0 && totalVal > amount) {
                //     this.getView().byId("invoice_discount").setText((totalVal - amount).toFixed(2));
                // }
                // else {
                //     this.getView().byId("invoice_discount").setText(0)
                // }
                this.getView().byId("invoice_discount").setText(discount);
                this.grandTotal = amount;
                this.calAddtInvoice();
                this.onresetPaymentInvoice();
            },
            calDueInvoice: function () {
                var amount = this.getView().byId("invoice_amount").getValue();
                var cash = this.getView().byId("invoice_cash").getValue();
                var cheque = this.getView().byId("invoice_cheque").getValue();
                var upi = this.getView().byId("invoice_upi").getValue();
                var card = this.getView().byId("invoice_card").getValue();
                var bank = this.getView().byId("invoice_bank").getValue();

                var due = (parseFloat(amount) - (parseFloat(cash) + parseFloat(cheque) + parseFloat(upi) + parseFloat(card) + parseFloat(bank)));

                this.getView().byId("invoice_due").setValue(due);
            },

            printInvoice: function () {
                var id = this.getView().byId("adjpnumber").getValue();
                var that = this;
                var host = this.getHost();
                // this.schema = []
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getFullInvoice",
                        data: JSON.stringify({
                            invoice_id: id
                        })
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            aData = aData[0]
                            $.ajax({
                                url: host,
                                type: "POST",
                                data: {
                                    method: "getInvoiceDetail",
                                    data: JSON.stringify({
                                        invoice_id: id
                                    })
                                },
                                success: function (dataClient) {
                                    try {
                                        var aDataDetail = JSON.parse(dataClient);
                                        that.generateInvoiceBill({
                                            invoice_id: aData.invoice_id,
                                            contact_number: aData.contact_number,
                                            customer_name: aData.customer_name,
                                            id_type: aData.id_type,
                                            card_number: aData.card_number,
                                            address: aData.address,
                                            state: aData.state,
                                            invoice_date: aData.invoice_date,
                                            gst_number: aData.gst_number,
                                            city_pin: aData.city_pin,
                                            notes: aData.notes,
                                            discounted_price: aData.discounted_price,
                                            cgst: aData.cgst,
                                            sgst: aData.sgst,
                                            nontax: aData.nontax,
                                            total_amount: aData.total_amount,
                                            type: aData.type,
                                            purity: aData.purity,
                                            rate: aData.rate,
                                            created_by: aData.created_by,
                                            cash: aData.cash,
                                            cheque: aData.cheque,
                                            upi: aData.upi,
                                            card: aData.card,
                                            bank: aData.bank,
                                            chequeno: aData.chequeno,
                                            upidetails: aData.upidetails,
                                            apprcode: aData.apprcode,
                                            bankdetails: aData.bankdetails,
                                            due: aData.due,
                                            productDetails: aDataDetail,
                                            taxamount: aData.taxamount,
                                            taxafamount: aData.taxafamount,
                                            adv: aData.adv,
                                            // adv: aData.adv,
                                            Irn: aData.irn,
                                            AckNo: aData.ack,
                                            Status: aData.status,
                                            QRCodeUrl: aData.qrurl,

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
            generateInvoiceBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.total_amount))
                sap.ui.core.BusyIndicator.hide();
                // Open a new popup window
                var printContent = `<!DOCTYPE html>
                                            <html lang="en">
                                            
                                            <head>
                                                <meta charset="utf-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
                                                <title>Manikanchan Jewellery House</title>
                                            
                                                <!-- Bootstrap CSS -->
                                                <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
                                            
                                                <!-- Fearther CSS -->
                                                <link rel="stylesheet" href="./assets/css/feather.css">
                                            
                                                <!-- Fontawesome CSS -->
                                                <link rel="stylesheet" href="./assets/plugins/fontawesome/css/fontawesome.min.css">
                                                <link rel="stylesheet" href="./assets/plugins/fontawesome/css/all.min.css">
                                                <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
                                                <!-- Main CSS -->
                                                <link rel="stylesheet" href="./assets/css/style.css">
                                            </head>
                                            
                                            <body>
                                                <div class="main-wrapper">
                                                    <div class="container">
                                                        <div class="invoice-wrapper download_section" id="download_section">
                                                            <div class="inv-content">
                                                                <div class="invoice-header">
                                                                    <div class="inv-header-left">
                                                                    <div style="
                                                                    font-size: 24px;
                                                                    font-weight: 700;
                                                                    color: #2c3038;
                                                                ">TAX INVOICE</div>
                                                                    </div>
                                                                    <div class="inv-header-right">
                                                                        <div class="inv-details">
                                                                            <div class="inv-date">
                                                                                Date: <span>${data.invoice_date}</span>
                                                                            </div>
                                                                            <div class="inv-date">
                                                                                Invoice No: <span>${data.invoice_id}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="invoice-address">
                                                                    <div class="invoice-to">
                                                                        <span>Invoice To:</span>
                                                                        <div class="inv-to-address">
                                                                           ${data.customer_name}<br>
                                                                           ${data.address}<br>
                                                                           ${data.gst_number}<br>
                                                                           ${data.contact_number}
                                                                        </div>
                                                                    </div>
                                                                    <div class="invoice-to">
                                            
                                                                    </div>
                                                                    <div class="company-details">
                                                                        <span></span>
                                                                        <div>
                                                                            <br />
                                                                            <table>
                                                                                <tr>
                                                                                    <td>ORN.TYPE</td>
                                                                                    <td style="text-align:left">: ${data.type}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>PURITY</td>
                                                                                    <td style="text-align:left">: ${data.purity}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>RATE PER GRAM</td>
                                                                                    <td style="text-align:left">: ${data.rate}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>SM CODE</td>
                                                                                    <td style="text-align:left">: ${data.created_by}</td>
                                                                                </tr>
                                                                            </table>
                                                                        </div>
                                            
                                                                    </div>
                                                                </div>
                                                                <div class="invoice-table">
                                                                    <div class="table-responsive">
                                                                        <table>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th class="table_width_1">SL. NO</th>
                                                                                    <th class="table_width_2">Item</th>
                                                                                    <th class="table_width_1">HSN</th>
                                                                                    <th class="table_width_1 text-center">PCS</th>
                                                                                    <th class="table_width_1 text-center">GROSS W.T.(Gms)</th>
                                                                                    <th class="table_width_1 text-center">NET W.T.(Gms)</th>
                                                                                    <th class="table_width_1 text-center">VALUE</th>
                                                                                    <th class="table_width_1 text-center">MAKING</th>
                                                                                    <th class="table_width_1 text-center">STONE WT.</th>
                                                                                    <th class="table_width_1 text-center">STONE VALUE</th>
                                                                                    <th class="table_width_1 text-center">HM CHARGE</th>
                                                                                    <th class="table_width_1 text-center">AMOUNT</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>`;

                var total = {
                    pcs: 0,
                    gross: 0,
                    net: 0,
                    value: 0,
                    making: 0,
                    stone: 0,
                    stval: 0,
                    hm: 0,
                };
                data.productDetails.map((value, index) => {
                    total.pcs += parseFloat(value.qty);
                    total.gross += parseFloat(value.gross_wt);
                    total.net += parseFloat(value.net_wt);
                    total.value += parseFloat(value.value);
                    total.making += parseFloat(value.making);
                    total.stone += parseFloat(value.stone_wt);
                    total.stval += parseFloat(value.st_value);
                    total.hm += parseFloat(value.hm_charge);
                    printContent += `<tr>
                                                                                <td>${index + 1}</td>
                                                                                <td class="">${value.orm_desc} (${value.huid})</td>
                                                                                <td class="table-description">${value.HSN}</td>
                                                                                <td class="text-center">${value.qty}</td>
                                                                                <td class="text-center">${value.gross_wt}</td>
                                                                                <td class="text-center">${value.net_wt}</td>
                                                                                <td class="text-center">${value.value}</td>
                                                                                <td class="text-center">${value.making}</td>
                                                                                <td class="text-center">${value.stone_wt}</td>
                                                                                <td class="text-center">${value.st_value}</td>
                                                                                <td class="text-center">${value.hm_charge}</td>
                                                                                <td class="text-center">${value.amount}</td>
                                                                            </tr>`;
                });

                printContent += `<tr>
                                                                            <th class="table_width_1">Total</th>
                                                                            <th class="table_width_2"></th>
                                                                            <th class="table_width_1"></th>
                                                                            <th class="table_width_1 text-center">${total.pcs}</th>
                                                                            <th class="table_width_1 text-center">${total.gross}</th>
                                                                            <th class="table_width_1 text-center">${total.net}</th>
                                                                            <th class="table_width_1 text-center">${total.value}</th>
                                                                            <th class="table_width_1 text-center">${total.making}</th>
                                                                            <th class="table_width_1 text-center">${total.stone}</th>
                                                                            <th class="table_width_1 text-center">${total.stval}</th>
                                                                            <th class="table_width_1 text-center">${total.hm}</th>
                                                                            <th class="table_width_1 text-center"></th>
                                                                        </tr> </tbody>
                                                   </table>
                                               </div>
                                           </div>
                                           <div class="invoice-table-footer" style="align-items: baseline;">
                                               <div class="table-footer-left" >
                                                   <span>MODE OF PAYMENT</span>
                                                   <br/>
                                                   <table>
                                                   <tbody>
                                                       <tr>
                                                           <td>CASH</td>
                                                           <td>:${data.cash}</td>
                                                       </tr>
                                                       <tr>
                                                           <td>CHEQUE</td>
                                                           <td>:${data.cheque}${data.chequeno ? ` (${data.chequeno})` : ''}</td>
                                                       </tr>
                                                       <tr>
                                                           <td>CARD</td>
                                                           <td>:${data.card}${data.apprcode ? ` Approval Code: ${data.apprcode})` : ''}</td>
                                                       </tr>
                                                       <tr>
                                                           <td>BANK TRF</td>
                                                           <td>:${data.bank}${data.bankdetails ? ` (${data.bankdetails})` : ''}</td>
                                                       </tr>
                                                       <tr>
                                                           <td>DUE</td>
                                                           <td>:${data.due}</td>
                                                       </tr>
                                                   </tbody>
                                               </table>
                                               </div>
                                               <div class="text-end table-footer-right">
                                                   <table>
                                                       <tbody>
                                                           <tr>
                                                               <td>Taxable Amount</td>
                                                               <td>${data.taxamount}</td>
                                                           </tr>
                                                           <tr>
                                                               <td>CGST</td>
                                                               <td>${data.cgst}</td>
                                                           </tr>
                                                           <tr>
                                                                <td>SGST</td>
                                                                <td>${data.sgst}</td>
                                                           </tr>
                                                           <tr>
                                                                <td>Amount after Tax</td>
                                                                <td>${data.taxafamount}</td>
                                                           </tr>
                                                           <tr>
                                                                <td>Non Taxable Item</td>
                                                                <td>${data.nontax}</td>
                                                           </tr>
                                                           <tr>
                                                                <td>Advance Less</td>
                                                                <td>${data.adv}</td>
                                                           </tr>
                                                           <tr>
                                                                <td>Discount</td>
                                                                <td>${data.discounted_price}</td>
                                                           </tr>
                                                       </tbody>
                                                   </table>
                                               </div>
                                           </div>
                                           <div class="invoice-table-footer">
                                           <div class="table-footer-left">
                                           <span style="font-weight:bold;color:black">${inWords}</span>
                                           </div>
                                               <div class="table-footer-right">
                                                   <table class="totalamt-table">
                                                       <tbody>
                                                           <tr>
                                                               <td>Total</td>
                                                               <td>${data.total_amount}</td>
                                                           </tr>
                                                       </tbody>
                                                   </table>
                                               </div>
                                           </div>`;


                if (data.irn) {
                    printContent += ` <div class="bank-details">
                <div class="account-info">
                    <span
                        class="bank-title">IRN:${data.Irn}</span>
                    <span
                        class="bank-title">AckNo:${data.AckNo}</span>
                    <span
                        class="bank-title">Status:${data.Status}</span>

                </div>
                <div class="company-sign">
                    <img width="100"
                        src=${data.QRCodeUrl}
                        alt="">
                </div>
            </div>`;
                }


                printContent += `  </div>
                                   </div>
                                   <div class="file-link">
                                   <button class="download_btn download-link" onclick="downloadPDF()">
                                       <i class="feather-download-cloud me-1"></i> <span>Download</span>
                                   </button>
                                   <a href="#" id="printLink" class="print-link">
                                       <i class="feather-printer"></i> <span class="">Print</span>
                                   </a>
                               </div>
                               </div>
                           </div>
                       </body>
                       <script>
                       var printLink = document.getElementById('printLink');
   
                       // Add a click event listener to the link
                       printLink.addEventListener('click', function(event) {
                       // Prevent the default link behavior
                       event.preventDefault();
   
                       // Trigger the print action
                       window.print();
                       });
   
                       function downloadPDF() {
                       // Get the element containing the static content
                       var staticContent = document.getElementById('download_section');
   
                       // Use html2pdf to generate and download the PDF
                       html2pdf(staticContent,{ filename: "Tax Invoice:"+${data.invoice_id} });
                       }
                       </script>
                       
                       </html>`;

                const popupWindow = window.open('', '_blank', 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);

            },
            convertToIndianWords: function (number) {
                var that = this;
                const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
                const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
                const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

                function convertThousands(num) {
                    const quotient = Math.floor(num / 1000);
                    const remainder = num % 1000;

                    let result = "";
                    if (quotient > 0) {
                        result += that.convertToIndianWords(quotient) + " thousand ";
                    }

                    if (remainder > 0) {
                        result += convertHundreds(remainder);
                    }

                    return result.trim();
                }

                function convertHundreds(num) {
                    if (num >= 100) {
                        const remainder = num % 100;
                        if (remainder !== 0) {
                            return words[Math.floor(num / 100)] + " hundred " + convertTens(remainder);
                        } else {
                            return words[Math.floor(num / 100)] + " hundred";
                        }
                    } else {
                        return convertTens(num);
                    }
                }

                function convertTens(num) {
                    if (num < 10) {
                        return words[num];
                    } else if (num >= 11 && num <= 19) {
                        return teens[num - 10];
                    } else {
                        return tens[Math.floor(num / 10)] + " " + words[num % 10];
                    }
                }

                if (number === 0) {
                    return "zero";
                } else if (number < 1000) {
                    return convertHundreds(number);
                } else {
                    return convertThousands(number);
                }
            },

            convertNumberToWordsIndianSystem: function (number) {
                const lakh = 100000;

                if (number < 0 || isNaN(number) || !Number.isInteger(number)) {
                    return "Invalid input";
                }

                if (number === 0) {
                    return "zero";
                }

                let result = "";

                // Convert lakh part
                const lakhPart = Math.floor(number / lakh);
                if (lakhPart > 0) {
                    result += this.convertToIndianWords(lakhPart) + " lakh ";
                }

                // Convert remaining part
                const remainingPart = number % lakh;
                if (remainingPart > 0) {
                    result += this.convertToIndianWords(remainingPart);
                }
                result = result.trim();
                var aResult = result.split(" ");
                var aUpper = [];
                aResult.map(val => {
                    aUpper.push(val[0].toUpperCase() + val.substr(1));
                })
                aUpper.push("Rupees Only");
                return aUpper.join(" ");
            },
        });
    }
);
