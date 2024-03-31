sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/library",],
    function (Controller, JSONModel, MessageBox, Button, List, StandardListItem, mobileLibrary) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        return Controller.extend("Billing.Billing.controller.Buyer", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                var that = this;
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("Buyer")
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
                    this.getView().byId("salesman").setSelectedKey(data.id)
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
                    var jModelID = new sap.ui.model.json.JSONModel({ results: [{}] });
                    that.getView().setModel(jModelID, "Products")
                    var date = new Date();
                    var jModel = new sap.ui.model.json.JSONModel({ currentDate: date });
                    this.getView().setModel(jModel);
                    var jModelB = new sap.ui.model.json.JSONModel({});
                    this.getView().setModel(jModelB, "buyer")
                }

            },

            getHM: function (oEvent) {
                var selected = this.getView().byId("om_type").getSelectedKey();
                var ahm = this.hmData.filter(val => val.om_id == selected);
                if (ahm && ahm.length > 0) {
                    this.selectedHM = ahm[0].item;
                    var products = this.getView().getModel("Products").getProperty("/results");
                    products.map(value => {
                        value.hmcharge = ahm[0].item;
                    });
                    this.getView().getModel("Products").refresh(true);
                    this.calValue();
                }
                else {
                    this.selectedHM = 0;
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
            onInputCode: function (oEvent) {
                var omcode = oEvent.getSource().getValue();
                var index = oEvent.getSource().getBindingContext("Products").getPath().split("/results/")[1];
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
                            var products = that.getView().getModel("Products").getProperty("/results");
                            products[index] = temp[0];
                            products[index].hmcharge = that.selectedHM;
                            products[index].making = 0;
                            products[index].st_val = 0;
                            that.getView().getModel("Products").refresh(true)
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

            calValue: function () {
                var rate = this.getView().byId('rate').getValue();
                rate = parseFloat(rate);
                if (!(rate > 0)) {
                    rate = 0;
                }
                var products = this.getView().getModel("Products").getProperty("/results");
                products.map(value => {
                    value.value = parseFloat(value.net_wt) * rate;
                    value.amount = (parseFloat(value.net_wt) * rate) + parseFloat(value.making ? value.making : 0) + parseFloat(value.hmcharge ? value.hmcharge : 0);
                });
                this.getView().getModel("Products").refresh(true);
                this.calAddt();
            },
            calAddt: function () {
                var products = this.getView().getModel("Products").getProperty("/results");
                var gstM = this.getView().getModel("gstModel").getData();
                var totalVal = 0;
                var adv = this.getView().byId("adv").getValue();
                if (!adv) {
                    adv = 0
                }
                products.map(value => {
                    totalVal += parseFloat(value.amount);
                });
                if (totalVal && totalVal > 0) {
                    var gst = (totalVal * (parseFloat(gstM.cgst) / 100)).toFixed(2);
                    gst = parseFloat(gst);
                    var nontax = this.getView().byId("nontax").getValue();
                    if (!nontax) {
                        nontax = 0
                    }
                    else {
                        nontax = parseFloat(nontax)
                    }
                    this.getView().byId("taxamount").setText(totalVal);
                    this.getView().byId("cgst").setText(gst);
                    this.getView().byId("sgst").setText(gst);
                    this.getView().byId("taxafamount").setText(gst + gst + totalVal);
                    this.getView().byId("amount").setValue((gst + gst + nontax + totalVal - adv).toFixed(2));
                    this.getView().byId("cash").setValue((gst + gst + nontax + totalVal - adv).toFixed(2));
                }
                else {
                    this.getView().byId("taxamount").setText(0);
                    this.getView().byId("cgst").setText(0);
                    this.getView().byId("sgst").setText(0);
                    this.getView().byId("taxafamount").setText(0);
                    this.getView().byId("amount").setValue(0);
                    this.getView().byId("nontax").setValue(0);
                    this.getView().byId("cash").setValue(0);

                }
                this.onresetPayment();
            },

            calDue: function () {
                var amount = this.getView().byId("amount").getValue();
                var cash = this.getView().byId("cash").getValue();
                var cheque = this.getView().byId("cheque").getValue();
                var upi = this.getView().byId("upi").getValue();
                var card = this.getView().byId("card").getValue();
                var bank = this.getView().byId("bank").getValue();

                var due = (parseFloat(amount) - (parseFloat(cash) + parseFloat(cheque) + parseFloat(upi) + parseFloat(card) + parseFloat(bank)));

                this.getView().byId("due").setValue(due);
            },
            changeAmount: function () {
                var amount = this.getView().byId("amount").getValue();
                amount = parseFloat(amount);
                var adv = this.getView().byId("adv").getValue();
                var nontax = this.getView().byId("nontax").getValue();
                if (!adv) {
                    adv = 0
                }
                if (!nontax) {
                    nontax = 0
                }
                else {
                    nontax = parseFloat(nontax)
                }
                var products = this.getView().getModel("Products").getProperty("/results");
                var gstM = this.getView().getModel("gstModel").getData();
                var totalVal = 0;
                products.map(value => {
                    totalVal += parseFloat(value.amount);
                });
                var gst = (totalVal * (parseFloat(gstM.cgst) / 100)).toFixed(2);
                gst = parseFloat(gst);
                totalVal = totalVal + gst + gst + nontax - adv;
                if (totalVal && totalVal > 0 && totalVal > amount) {
                    this.getView().byId("discount").setText((totalVal - amount).toFixed(2));
                }
                else {
                    this.getView().byId("discount").setText(0)
                }
                this.onresetPayment();
            },
            addnontax: function () {

            },
            onresetPayment: function () {
                var amount = this.getView().byId("amount").getValue();
                this.getView().byId("cash").setValue(amount);
                this.getView().byId("cheque").setValue(0);
                this.getView().byId("upi").setValue(0);
                this.getView().byId("card").setValue(0);
                this.getView().byId("bank").setValue(0);
                this.getView().byId("due").setValue(0);
            },
            onAdd: function () {
                var products = this.getView().getModel("Products").getProperty("/results");
                if (products.length > 0) {
                    if (products[products.length - 1].om_code) {
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
                var host = this.getHost();
                var buyerDetails = this.getView().getModel("buyer").getData();
                if (!buyerDetails.id) {
                    this.saveBuyer();
                }
                var productDetails = this.getView().getModel("Products").getProperty("/results");
                var om_type = this.getView().byId("om_type").getSelectedItem()?.getText();
                var purity = this.getView().byId("purity").getSelectedItem()?.getText();
                var rate = this.getView().byId("rate").getValue();
                var invoice_date = this.getView().byId("invoice_date").getDateValue().toISOString().split('T')[0];
                var salesman = this.getView().byId("salesman").getSelectedItem()?.getText();
                var cash = this.getView().byId("cash").getValue();
                var cheque = this.getView().byId("cheque").getValue();
                var upi = this.getView().byId("upi").getValue();
                var card = this.getView().byId("card").getValue();
                var bank = this.getView().byId("bank").getValue();
                var chequeno = this.getView().byId("chequeno").getValue();
                var upidetails = this.getView().byId("upidetails").getValue();
                var apprcode = this.getView().byId("apprcode").getValue();
                var bankdetails = this.getView().byId("bankdetails").getValue();
                var due = this.getView().byId("due").getValue();
                var addt = this.getView().byId("addt").getValue();
                var cgst = this.getView().byId("cgst").getText();
                var sgst = this.getView().byId("sgst").getText();
                var discount = this.getView().byId("discount").getText();
                var amount = this.getView().byId("amount").getValue();
                var nontax = this.getView().byId("nontax").getValue();
                var taxamount = this.getView().byId("taxamount").getText();
                var taxafamount = this.getView().byId("taxafamount").getText();
                var adv = this.getView().byId("adv").getValue();
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
                            adv: adv
                        }),
                    },
                    success: function (dataClient) {
                        console.log(dataClient);
                        if (dataClient.indexOf('Insertion successful') !== -1) {
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
                                    that.updateStock(productDetails);
                                    if (buyerDetails.gst_number) {
                                        MessageBox.confirm("Succesfully Updated", {
                                            actions: ["Generate E-Bill", "Print", "Close"],
                                            emphasizedAction: "Print",
                                            onClose: function (sAction) {
                                                if (sAction == "Generate E-Bill") {
                                                    that.generateBill({
                                                        invoice_id: invoice_id,
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
                                                        productDetails: productDetails,
                                                        taxamount: taxamount,
                                                        taxafamount: taxafamount,
                                                        adv: adv
                                                    });
                                                }
                                                else if (sAction == "Print") {
                                                    that.onPrintInvoice({
                                                        invoice_id: invoice_id,
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
                                                        productDetails: productDetails,
                                                        taxamount: taxamount,
                                                        taxafamount: taxafamount,
                                                        adv: adv
                                                    });
                                                }
                                                else {
                                                    that.oRouter.navTo("InvoiceList");
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        MessageBox.confirm("Succesfully Updated", {
                                            actions: ["Print", "Close"],
                                            emphasizedAction: "Print",
                                            onClose: function (sAction) {
                                                if (sAction == "Print") {
                                                    that.onPrintInvoice({
                                                        invoice_id: invoice_id,
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
                                                        productDetails: productDetails,
                                                        taxamount: taxamount,
                                                        taxafamount: taxafamount,
                                                        adv: adv
                                                    });
                                                }
                                                else {
                                                    that.oRouter.navTo("InvoiceList");
                                                }
                                            }
                                        }
                                        );
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

                        }

                    },
                    error: function (request, error) {
                        console.log('Error');
                        MessageBox.error("Submition failed.");
                        sap.ui.core.BusyIndicator.hide();
                    },
                });
            },
            onPrintInvoice: function (data) {
                var that = this;
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
                    
                        <!-- Main CSS -->
                        <link rel="stylesheet" href="./assets/css/style.css">
                    </head>
                    
                    <body>
                        <div class="main-wrapper">
                            <div class="container">
                                <div class="invoice-wrapper download_section">
                                    <div class="inv-content">
                                        <div class="invoice-header">
                                            <div class="inv-header-left">
                                            <div class="invoice-title">TAX INVOICE</div>
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

                data.productDetails.map((value, index) => {
                    printContent += `<tr>
                                                        <td>${index + 1}</td>
                                                        <td class="">${value.orm_desc}</td>
                                                        <td class="table-description">${value.huid}</td>
                                                        <td class="text-center">${value.qty}</td>
                                                        <td class="text-center">${value.gross_wt}</td>
                                                        <td class="text-center">${value.net_wt}</td>
                                                        <td class="text-center">${value.value}</td>
                                                        <td class="text-center">${value.making}</td>
                                                        <td class="text-center">${value.stone_wt}</td>
                                                        <td class="text-center">${value.st_val}</td>
                                                        <td class="text-center">${value.hmcharge}</td>
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
                                </div>
                            </div>
                        </div>
                        <div class="file-link">
                            <button class="download_btn download-link">
                                <i class="feather-download-cloud me-1"></i> <span>Download</span>
                            </button>
                            <a href="javascript:window.print()" class="print-link">
                                <i class="feather-printer"></i> <span class="">Print</span>
                            </a>
                        </div>
                    </div>
                    </div>
                    </body>

                    </html>`;

                const popupWindow = window.open('', '_blank', 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);
                that.oRouter.navTo("InvoiceList");

            },
            getOrder: function () {
                var that = this;
                var host = this.getHost();
                var order_id = this.getView().byId('order_id').getValue();
                if (order_id) {
                    sap.ui.core.BusyIndicator.show();
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "getOrderByNumberBuyer",
                            data: JSON.stringify({ order_id: order_id }),
                        },
                        success: function (dataClient) {
                            try {
                                var aDataId = JSON.parse(dataClient);
                                console.log(aDataId);
                                sap.ui.core.BusyIndicator.hide();
                                if (aDataId.order_id) {
                                    that.getView().getModel("buyer").setData(aDataId);
                                    that.getView().byId("purity").setSelectedKey(aDataId.purity);
                                    that.getView().byId("om_type").setSelectedKey(aDataId.type);
                                    that.getView().byId("rate").setValue(aDataId.rate);
                                    that.getView().byId("adv").setValue(aDataId.total_combined_amount);
                                    that.getView().byId("cash").setValue(aDataId.total_combined_amount);
                                }
                                else {
                                    that.getView().getModel("buyer").setData({})
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
            saveBuyer: function () {
                var buyerDetails = this.getView().getModel("buyer").getData();
            },
            updateStock: function (productDetails) {
                var that = this;
                var host = this.getHost();
                var aStocks = [];
            },
            generateBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                console.log(data);
                // var amountAfTax = parseFloat(data.taxamount) + parseFloat(data.cgst) + parseFloat(data.sgst);
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
                                        data: JSON.stringify({ token: aDataId.access_token, ...data }),
                                    },
                                    success: function (dataClient) {
                                        try {
                                            var aDataId = JSON.parse(dataClient).results.message;
                                            if (!aDataId) {
                                                sap.ui.core.BusyIndicator.hide();
                                                alert(JSON.parse(dataClient).results.errorMessage);
                                            }
                                            else {
                                                that.insertGstAck({ ...aDataId, invoice_id: data.invoice_id });
                                                console.log(aDataId);
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
                                            
                                                <!-- Main CSS -->
                                                <link rel="stylesheet" href="./assets/css/style.css">
                                            </head>
                                            
                                            <body>
                                                <div class="main-wrapper">
                                                    <div class="container">
                                                        <div class="invoice-wrapper download_section">
                                                            <div class="inv-content">
                                                                <div class="invoice-header">
                                                                    <div class="inv-header-left">
                                                                    <div class="invoice-title">TAX INVOICE</div>
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

                                                data.productDetails.map((value, index) => {
                                                    printContent += `<tr>
                                                    <td>${index + 1}</td>
                                                    <td class="">${value.orm_desc}</td>
                                                    <td class="table-description">${value.huid}</td>
                                                    <td class="text-center">${value.qty}</td>
                                                    <td class="text-center">${value.gross_wt}</td>
                                                    <td class="text-center">${value.net_wt}</td>
                                                    <td class="text-center">${value.value}</td>
                                                    <td class="text-center">${value.making}</td>
                                                    <td class="text-center">${value.stone_wt}</td>
                                                    <td class="text-center">${value.st_val}</td>
                                                    <td class="text-center">${value.hmcharge}</td>
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
                                           </div>
                       
                                           <div class="bank-details">
                                               <div class="account-info">
                                                   <span
                                                       class="bank-title">IRN:${aDataId.Irn}</span>
                                                   <span
                                                       class="bank-title">AckNo:${aDataId.AckNo}</span>
                                                   <span
                                                       class="bank-title">Status:${aDataId.Status}</span>
                       
                                               </div>
                                               <div class="company-sign">
                                                   <img width="100"
                                                       src=${aDataId.QRCodeUrl}
                                                       alt="">
                                               </div>
                                           </div>
                                       </div>
                                   </div>
                                   <div class="file-link">
                                       <button class="download_btn download-link">
                                           <i class="feather-download-cloud me-1"></i> <span>Download</span>
                                       </button>
                                       <a href="javascript:window.print()" class="print-link">
                                           <i class="feather-printer"></i> <span class="">Print</span>
                                       </a>
                                   </div>
                               </div>
                           </div>
                       </body>
                       
                       </html>`;

                                                const popupWindow = window.open('', '_blank', 'width=800,height=900');
                                                // Render the PopupContent component inside the popup window
                                                popupWindow.document.write(printContent);
                                                that.oRouter.navTo("InvoiceList");
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
            },
            insertGstAck: function (data) {
                var that = this;
                var host = this.getHost();
                if (data) {
                    $.ajax({
                        url: host,
                        type: "POST",
                        data: {
                            method: "insertGstAckRecord",
                            data: JSON.stringify({
                                Irn: data.Irn,
                                AckNo: data.AckNo,
                                AckDt: data.AckDt,
                                QRCodeUrl: data.QRCodeUrl,
                                EinvoicePdf: data.EinvoicePdf,
                                Status: data.Status,
                                invoice_id: data.invoice_id,
                            }),
                        },
                        success: function (dataClient) {
                            try {

                            }
                            catch (e) {
                                // alert("Something went wrong", e.Error);
                                // sap.ui.core.BusyIndicator.hide();
                            }
                        },
                        error: function (request, error) {
                            console.log('Error');
                            // sap.ui.core.BusyIndicator.hide();
                        }
                    });
                }
            },
            onpressBack: function (oEvent) {
                this.oRouter.navTo("InvoiceList");
            },

        });
    }
);
