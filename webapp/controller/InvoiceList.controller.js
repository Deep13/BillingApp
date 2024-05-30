sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/Input", "sap/m/Label", "sap/m/List", "sap/m/StandardListItem", "sap/m/library", "sap/m/MessageBox", "sap/m/HBox"],
    function (Controller, JSONModel, Dialog, Button, Input, Label, List, StandardListItem, mobileLibrary, MessageBox, HBox) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;
        return Controller.extend("Billing.Billing.controller.InvoiceList", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */
            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("InvoiceList")
                    .attachPatternMatched(this._handleRouteMatched, this);


            },
            _handleRouteMatched: function (oEvent) {
                var data = this.getUserLog();
                if (!data) {
                    // alert('user logged in');
                    this.oRouter.navTo("");
                }
                else {
                    this.refreshData();
                    this.pId = oEvent.getParameter('arguments').invoice_id;
                    if (this.pId == "null") {
                        this.getView().byId("productInput").setValue("");
                    }
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
                        method: "getInvoices",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            that.getView().byId('tableHeader').setText(`Invoices (${aData.length})`)
                            var jData = new sap.ui.model.json.JSONModel({ results: aData });
                            that.getView().setModel(jData);
                        }
                        catch (e) {
                            console.log("Something went wrong", e)
                        }
                    },
                    error: function (request, error) {
                        console.log('Error')
                    }
                });
            },
            onAdd: function () {
                this.oRouter.navTo("Buyer");
            },
            onEditInvoice: function (oEvent) {
                var invoice = oEvent.getSource().getBindingContext().getObject();
                var date1 = new Date(invoice.invoice_date); // First date
                var date2 = new Date(); // Second date

                // Calculate the difference in milliseconds
                var differenceMs = date2 - date1;

                // Convert milliseconds to days
                var differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

                // if (differenceDays > 10) {
                //     MessageBox.error("Sorry the invoice has crossed the editable period")
                // }
                // else {
                this.oRouter.navTo("BuyerEdit", {
                    invoice_id: invoice.invoice_id
                })
                // }

            },

            onPressDeposit: async function (oEvent) {
                var invoice_detail = oEvent.getSource().getBindingContext().getObject();
                var invoice_id = oEvent.getSource().getBindingContext().getObject().invoice_id;
                var due = oEvent.getSource().getBindingContext().getObject().due;
                var order_date = new Date().toISOString().split('T')[0];

                var that = this;
                var host = this.getHost();
                this.deposit = { cash: 0, card: 0, bank: 0, upi: 0, cheque: 0, carddetails: "", chequedetails: "", upidetails: "", bankdetails: "" };
                if (!this.oSubmitDialog) {
                    this.oSubmitDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Due remaining (" + due + ")",
                        contentWidth: "500px",
                        content: [
                            new Label({
                                text: "Enter Cash amount",
                                labelFor: "submissionNote"
                            }),
                            new Input("submissionNote", {
                                width: "100%",
                                placeholder: "Add amount (required)",
                                liveChange: function (oEvent) {
                                    var sText = oEvent.getParameter("value");
                                    this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                    this.deposit.cash = sText;
                                }.bind(this)
                            }),
                            new Label({
                                text: "Enter Card amount",
                                labelFor: "submissionNotecard"
                            }),
                            new HBox({
                                justifyContent: "SpaceBetween",
                                items: [new Input("submissionNotecard", {
                                    placeholder: "Add amount (required)",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.card = sText;
                                    }.bind(this)
                                }), new Input("submissionNotecardDeatils", {
                                    width: "250px",
                                    placeholder: "Approval Code",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.carddetails = sText;
                                    }.bind(this)
                                })]
                            }),
                            new Label({
                                text: "Enter Bank amount",
                                labelFor: "submissionNotebank"
                            }),
                            new HBox({
                                justifyContent: "SpaceBetween",
                                items: [new Input("submissionNotebank", {
                                    width: "100%",
                                    placeholder: "Add amount (required)",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.bank = sText;
                                    }.bind(this)
                                }), new Input("submissionNotebankDeatils", {
                                    width: "250px",
                                    placeholder: "Bank Details",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.bankdetails = sText;
                                    }.bind(this)
                                })]
                            }),

                            new Label({
                                text: "Enter Cheque amount",
                                labelFor: "submissionNotecheque"
                            }),

                            new HBox({
                                justifyContent: "SpaceBetween",
                                items: [new Input("submissionNotecheque", {
                                    width: "100%",
                                    placeholder: "Add amount (required)",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.cheque = sText;
                                    }.bind(this)
                                }), new Input("submissionNotechequeDeatils", {
                                    width: "250px",
                                    placeholder: "Cheque Number",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.chequedetails = sText;
                                    }.bind(this)
                                })]
                            }),
                            new Label({
                                text: "Enter Upi amount",
                                labelFor: "submissionNoteupi"
                            }),

                            new HBox({
                                justifyContent: "SpaceBetween",
                                items: [new Input("submissionNoteupi", {
                                    width: "100%",
                                    placeholder: "Add amount (required)",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.upi = sText;
                                    }.bind(this)
                                }), new Input("submissionNoteupiDeatils", {
                                    width: "250px",
                                    placeholder: "UPI Details",
                                    liveChange: function (oEvent) {
                                        var sText = oEvent.getParameter("value");
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        this.deposit.upidetails = sText;
                                    }.bind(this)
                                })]
                            }),
                        ],
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Submit",
                            enabled: false,
                            press: function (oEvent) {
                                var sText = this.deposit;
                                var total = parseFloat(sText.cash) + parseFloat(sText.card) + parseFloat(sText.bank) + parseFloat(sText.upi) + parseFloat(sText.cheque);
                                if (parseFloat(total) <= parseFloat(due)) {
                                    this.oSubmitDialog.destroy();
                                    this.oSubmitDialog = undefined;
                                    if (sText) {
                                        sap.ui.core.BusyIndicator.show();
                                        $.ajax({
                                            url: host,
                                            type: "POST",
                                            data: {
                                                method: "insertVoucher",
                                                data: JSON.stringify({
                                                    rate: "",
                                                    order_id: "",
                                                    amount: total,
                                                    cash: sText.cash,
                                                    card: sText.card,
                                                    apprcode: sText.carddetails,
                                                    chequeno: sText.chequedetails,
                                                    cheque: sText.cheque,
                                                    bank_details: sText.bankdetails,
                                                    bank: sText.bank,
                                                    upi: sText.upi,
                                                    upidetails: sText.upidetails,
                                                    oldgold: "",
                                                    voucher_date: order_date,
                                                    purchase_id: "",
                                                    invoice_id: invoice_id
                                                }),
                                            },
                                            success: function (dataClient) {
                                                sap.ui.core.BusyIndicator.hide();
                                                console.log(dataClient);
                                                var id = JSON.parse(dataClient)[1];
                                                var balance = parseFloat(due) - parseFloat(total);
                                                $.ajax({
                                                    url: host,
                                                    type: "POST",
                                                    data: {
                                                        method: "updateDue",
                                                        data: JSON.stringify({
                                                            balance: balance,
                                                            id: invoice_id,
                                                        }),
                                                    },
                                                    success: function (dataClient) {
                                                        sap.ui.core.BusyIndicator.hide();
                                                        console.log(dataClient);


                                                    },
                                                    error: function (request, error) {
                                                        console.log('Error');
                                                        sap.ui.core.BusyIndicator.hide();
                                                    },
                                                });
                                                var textMsg = ""
                                                if (total == due) {
                                                    textMsg = "Succesfully cleared";
                                                }
                                                else {
                                                    textMsg = "Succesfully deposited";
                                                }
                                                MessageBox.success(textMsg, {
                                                    actions: ["Print", "Close"],
                                                    emphasizedAction: "Print",
                                                    onClose: function (sAction) {
                                                        if (sAction == "Print") {
                                                            that.generateVoucherBill({
                                                                voucher_id: 54,
                                                                amount: total,
                                                                invoice_detail: invoice_detail,
                                                                voucher_date: order_date,
                                                                cash: sText.cash,
                                                                card: sText.card,
                                                                bank: sText.bank,
                                                                upi: sText.upi,
                                                                cheque: sText.cheque,
                                                                chequeno: sText.chequedetails,
                                                                apprcode: sText.carddetails,
                                                                bank_details: sText.bankdetails,
                                                                upidetails: sText.upidetails
                                                            });
                                                        }
                                                        else {
                                                            that.refreshData();
                                                        }
                                                    }
                                                });


                                            },
                                            error: function (request, error) {
                                                console.log('Error');
                                                sap.ui.core.BusyIndicator.hide();
                                                MessageBox.error("Error occured")
                                            },
                                        });
                                    }
                                }
                                else {
                                    MessageBox.error("Amount should be less than the due amount")
                                }


                            }.bind(this)
                        }),
                        endButton: new Button({
                            text: "Cancel",
                            press: function () {
                                this.oSubmitDialog.destroy();
                                this.oSubmitDialog = undefined;
                            }.bind(this)
                        })
                    });
                }
                this.oSubmitDialog.addStyleClass("marginTopLabel")
                this.oSubmitDialog.open();

            },
            generateVoucherBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                console.log(data);

                sap.ui.core.BusyIndicator.hide();
                // Open a new popup window
                var printContent = this.getHTMLContentVocuher(data);

                const popupWindow = window.open('', "_blank", 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);
                popupWindow.document.close();

                // Trigger the print action in the new window
                popupWindow.print();

            },
            getHTMLContentVocuher: function (data) {
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.amount))
                return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
            <title>Jewellery House</title>
        
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
                            ">DUE PAYMENT - VOUCHER</div>
                                </div>
                                <div class="inv-header-right">
                                </div>
                            </div>
                            <div class="invoice-address">
                                <div class="invoice-to">
                                    <span>Invoice To:</span>
                                    <div class="inv-to-address">
                                       ${data.invoice_detail.customer_name}<br>
                                       ${data.invoice_detail.address}<br>
                                       ${data.invoice_detail.gst_number}<br>
                                       ${data.invoice_detail.contact_number}
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
                                            <td>Invoice No.</td>
                                            <td style="text-align:left">: ${data.invoice_detail.invoice_id}</td>
                                        </tr>
                                        <tr>
                                            <td>Voucher No.</td>
                                            <td style="text-align:left">: ${data.voucher_id}</td>
                                        </tr>
                                        <tr>
                                            <td>Voucher Date</td>
                                            <td style="text-align:left">: ${data.voucher_date}</td>
                                        </tr>
                                        <tr>
                                            <td>SM CODE</td>
                                            <td style="text-align:left">: ${data.invoice_detail.created_by}</td>
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
                                                <th class="table_width_1 text-center">AMOUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td class="">DUE PAYMENT</td>
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
                           <td>: ${data.cheque}${data.chequeno ? ` (${data.chequeno})` : ''}</td>
                       </tr>
                       <tr>
                           <td>CARD</td>
                           <td>: ${data.card}${data.apprcode ? ` Approval Code: ${data.apprcode}` : ''}</td>
                       </tr>
                       <tr>
                           <td>UPI</td>
                           <td>: ${data.upi}${data.upidetails ? ` (${data.upidetails})` : ''}</td>
                       </tr>
                       <tr>
                           <td>BANK TRF</td>
                           <td>: ${data.bank}${data.bank_details ? ` (${data.bank_details})` : ''}</td>
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
            handleLinkPress: function (oEvent) {
                var id = oEvent.getSource().getBindingContext().getObject().invoice_id;
                this.oRouter.navTo('VoucherList', {
                    order_id: id
                })
            },
            dueStatusText: function (due) {
                if (parseFloat(due) > 0) {
                    return 'Due';
                }
                return 'Completed'
            },
            dueStatusHighlight: function (due) {
                if (parseFloat(due) > 0) {
                    return 'Error';
                }
                return 'None'
            },
            dueStatus: function (due) {
                if (parseFloat(due) > 0) {
                    return 'Error';
                }
                return 'Success'
            },
            onpressBack: function (oEvent) {
                this.oRouter.navTo("Main");
            },
            onPressPrint: function (oEvent) {
                var id = oEvent.getSource().getBindingContext().getObject().invoice_id;
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
                                        that.generateBill({
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
                                            order_id: aData.order_id,
                                            order_date: aData.order_date,
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
            generateBill: function (data) {
                var that = this;
                var host = this.getHost();
                sap.ui.core.BusyIndicator.show();
                console.log(data);
                var inWords = this.convertNumberToWordsIndianSystem(parseInt(data.total_amount))
                sap.ui.core.BusyIndicator.hide();
                // Open a new popup window
                var printContent = `<!DOCTYPE html>
                                            <html lang="en">
                                            
                                            <head>
                                                <meta charset="utf-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
                                                <title>Jewellery House</title>
                                            
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
                                                                    font-size: 15px;
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
                                                                        <table>
                                                                        <tr>
                                                                            <td>Name</td>
                                                                            <td style="text-align:left">: ${data.customer_name}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Address</td>
                                                                            <td style="text-align:left">: ${data.address}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>GST Number</td>
                                                                            <td style="text-align:left">: ${data.gst_number}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>Contact Number</td>
                                                                            <td style="text-align:left">: ${data.contact_number}</td>
                                                                        </tr>
                                                                    </table>
                                                                        </div>`;
                if (data.order_id) {
                    printContent += `<table style="border-top: 1px solid #96979b54;
                                                                        margin-top: 10px;">
                                                                                <tr style="height:10px"></tr>
                                                                                <tr>
                                                                                    <td style="color: #2c3038;
                                                                                    font-weight: 700;
                                                                                    font-size: 12px;
                                                                                    margin-left: 8px;">ORDER NO</td>
                                                                                    <td style="text-align:left">: ${data.order_id}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td style="color: #2c3038;
                                                                                    font-weight: 700;
                                                                                    font-size: 12px;
                                                                                    margin-left: 8px;">ORDER DATE</td>
                                                                                    <td style="text-align:left">: ${data.order_date}</td>
                                                                                </tr>
                                                                            </table>`;
                }
                printContent += `</div>
                                                                    <div class="invoice-to">
                                            
                                                                    </div>
                                                                    <div class="company-details">
                                                                        <span></span>
                                                                        <div class="inv-to-address">
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
                                                                        <table style="border:1px solid black">
                                                                            <thead>
                                                                                <tr style="border-bottom:1px solid black">
                                                                                    <th class="table_width_1">SL. NO</th>
                                                                                    <th class="table_width_2">Item</th>
                                                                                    <th class="table_width_1">HSN</th>
                                                                                    <th class="table_width_1 text-center">PCS</th>
                                                                                    <th class="table_width_1 text-center">GROSS W.T.(Gms)</th>
                                                                                    <th class="table_width_1 text-center">NET W.T.(Gms)</th>
                                                                                    <th class="table_width_1 text-center">VALUE</th>
                                                                                    <th class="table_width_1 text-center">MAKING</th>
                                                                                    <th class="table_width_1 text-center">STONE WT.(Gms)</th>
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
                    amount: 0
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
                    total.amount += parseFloat(value.amount);
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
                for (var i = 0; i < (10 - data.productDetails.length); i++) {
                    printContent += `<tr style='border-bottom:0px'>
                <th class="table_width_1"></th>
                <th class="table_width_2"></th>
                <th class="table_width_1"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
                <th class="table_width_1 text-center"></th>
            </tr>`
                }
                printContent += `<tr style="border-top:1px solid black">
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
                <th class="table_width_1 text-center">${total.amount}</th>
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
html2pdf(staticContent,{ filename: "Advance-voucher:"+${data.invoice_id} });
}
</script>
                       
                       </html>`;

                const popupWindow = window.open('', '_blank', 'width=1200,height=900');
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
            filterTable: function () {
                var value = this.getView().byId("productInput").getValue();
                var oTable = this.byId("idTable"),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                var oFilter = new sap.ui.model.Filter("invoice_id", "Contains", value,);
                aFilters.push(oFilter);

                // apply filter settings
                oBinding.filter(aFilters);
            },
            onChange: function () {

                if (this.pId !== "null") {

                    this.getView().byId("productInput").setValue(this.pId);
                    this.pId = "null";
                    this.getView().byId("productInput").fireSubmit();

                }
            }



        });
    }
);
