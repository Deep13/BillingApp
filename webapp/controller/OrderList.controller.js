sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/Input", "sap/m/Label", "sap/m/library", "sap/m/MessageBox", "sap/m/HBox",],
    function (Controller, JSONModel, Dialog, Button, Input, Label, mobileLibrary, MessageBox, HBox) {
        "use strict";
        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;
        return Controller.extend("Billing.Billing.controller.OrderList", {

            /**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf RecieptApp.RecieptApp.view.ClientPayment
             */

            onInit: function () {
                this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this.oRouter
                    .getRoute("OrderList")
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
                    this.pId = oEvent.getParameter('arguments').order_id;
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
                        method: "getOrders",
                    },
                    success: function (dataClient) {
                        try {
                            var aData = JSON.parse(dataClient);
                            that.getView().byId('tableHeader').setText(`Orders (${aData.length})`)
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
                this.oRouter.navTo("Order", {
                    purchase_id: 0
                });

            },
            handleLinkPress: function (oEvent) {
                var id = oEvent.getSource().getBindingContext().getObject().order_id;
                this.oRouter.navTo('VoucherList', {
                    order_id: id
                })
            },
            onPressDeposit: async function (oEvent) {
                var orderId = oEvent.getSource().getBindingContext().getObject().order_id;
                var order_date = new Date().toISOString().split('T')[0];
                var default_rate = await localStorage.getItem("gold_rate");
                this.rate = default_rate;
                var that = this;
                var host = this.getHost();
                this.deposit = { cash: 0, card: 0, bank: 0, upi: 0, cheque: 0, oldgold: 0 };
                if (!this.oSubmitDialog) {
                    this.oSubmitDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        contentWidth: "500px",
                        content: [
                            new Label({
                                text: "Enter Gold rate",
                                labelFor: "goldRate"
                            }),
                            new Input("goldRate", {
                                width: "100%",
                                value: default_rate,
                                placeholder: "Add rate",
                                liveChange: function (oEvent) {
                                    var sText = oEvent.getParameter("value");
                                    this.rate = sText;
                                }.bind(this)
                            }),
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
                                var total = parseFloat(sText.oldgold) + parseFloat(sText.cash) + parseFloat(sText.card) + parseFloat(sText.bank) + parseFloat(sText.upi) + parseFloat(sText.cheque);
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
                                                rate: that.rate,
                                                order_id: orderId,
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
                                                oldgold: sText.oldgold,
                                                voucher_date: order_date,
                                            }),
                                        },
                                        success: function (dataClient) {
                                            sap.ui.core.BusyIndicator.hide();
                                            console.log(dataClient);
                                            var id = JSON.parse(dataClient)[1];
                                            MessageBox.success("Succesfully deposited", {
                                                actions: ["Print", "Close"],
                                                emphasizedAction: "Print",
                                                onClose: function (sAction) {
                                                    if (sAction == "Print") {
                                                        that.onVoucherPrint(id);
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
                                        },
                                    });
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
            onPressNav: function (oEvent) {
                var id = oEvent.getSource().getBindingContext().getObject().order_id;
                this.oRouter.navTo("OrderView", {
                    order_id: id
                })
            },
            dueStatusText: function (due) {
                if (parseFloat(due) > 0) {
                    return 'Due';
                }
                return 'Completed'
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
                var id = oEvent.getSource().getBindingContext().getObject().order_id;
                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getOrderWithVoucher",
                        data: JSON.stringify({
                            order_id: id
                        })
                    },
                    success: function (dataClient) {
                        try {
                            var aDataDetail = JSON.parse(dataClient);
                            aDataDetail = aDataDetail[0];
                            that.generateInvoiceBill(aDataDetail);
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
            onVoucherPrint: function (id) {

                var that = this;
                var host = this.getHost();
                $.ajax({
                    url: host,
                    type: "POST",
                    data: {
                        method: "getVoucherWithOrder",
                        data: JSON.stringify({
                            voucher_id: id
                        })
                    },
                    success: function (dataClient) {
                        try {
                            var aDataDetail = JSON.parse(dataClient);
                            aDataDetail = aDataDetail[0];
                            that.generateVoucherBill(aDataDetail);
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
                                                    <td class="text-center">${data.adv_amount}</td>
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
            filterTable: function () {
                var value = this.getView().byId("productInput").getValue();
                var oTable = this.byId("idTable"),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                var oFilter = new sap.ui.model.Filter("order_id", "Contains", value,);
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
                });
                aUpper.push("Rupees Only")

                return aUpper.join(" ");
            },
        });
    },
)
