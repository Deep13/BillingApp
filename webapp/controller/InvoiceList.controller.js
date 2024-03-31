sap.ui.define(
    ["../controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/Dialog", "sap/m/Button", "sap/m/Input", "sap/m/Label", "sap/m/List", "sap/m/StandardListItem", "sap/m/library", "sap/m/MessageBox"],
    function (Controller, JSONModel, Dialog, Button, Input, Label, List, StandardListItem, mobileLibrary, MessageBox) {
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
            onPressDeposit: function (oEvent) {
                var orderId = oEvent.getSource().getBindingContext().getObject().invoice_id;
                var due = oEvent.getSource().getBindingContext().getObject().due;
                var order_date = new Date().toISOString().split('T')[0];
                var that = this;
                var host = this.getHost();
                if (!this.oSubmitDialog) {
                    this.oSubmitDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Confirm",
                        content: [
                            new Label({
                                text: "Due remaining (" + due + ")",
                                labelFor: "submissionNote"
                            }),
                            new Input("submissionNote", {
                                width: "100%",
                                placeholder: "Deposit amount (required)",
                                submit: function (oEvent) {
                                    var sText = this.deposit;
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
                                                    order_id: orderId,
                                                    amount: sText,
                                                    voucher_date: order_date,
                                                }),
                                            },
                                            success: function (dataClient) {
                                                // if (sText != due) {
                                                var balance = parseFloat(due) - parseFloat(sText);
                                                $.ajax({
                                                    url: host,
                                                    type: "POST",
                                                    data: {
                                                        method: "updateDue",
                                                        data: JSON.stringify({
                                                            balance: balance,
                                                            id: orderId,
                                                        }),
                                                    },
                                                    success: function (dataClient) {
                                                        sap.ui.core.BusyIndicator.hide();
                                                        console.log(dataClient);
                                                        that.refreshData();
                                                        if (sText == due) {
                                                            MessageBox.success("Succesfully cleared");
                                                        }
                                                        else {
                                                            MessageBox.success("Succesfully deposited");
                                                        }

                                                    },
                                                    error: function (request, error) {
                                                        console.log('Error');
                                                        sap.ui.core.BusyIndicator.hide();
                                                    },
                                                });
                                                // }
                                                // else {
                                                //     sap.ui.core.BusyIndicator.hide();
                                                //     console.log(dataClient);
                                                //     MessageBox.success("Succesfully cleared");
                                                // }
                                            },
                                            error: function (request, error) {
                                                console.log('Error');
                                                sap.ui.core.BusyIndicator.hide();
                                            },
                                        });
                                    }
                                }.bind(this),
                                liveChange: function (oEvent) {
                                    var sText = oEvent.getParameter("value");

                                    this.deposit = sText;
                                    if (parseFloat(sText) <= parseFloat(due)) {
                                        this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                                        oEvent.getSource().setValueState("None");
                                        oEvent.getSource().setValueStateText("");
                                    }
                                    else {
                                        this.oSubmitDialog.getBeginButton().setEnabled(false);
                                        oEvent.getSource().setValueState("Error");
                                        oEvent.getSource().setValueStateText("Amount is greater than Due");
                                    }
                                }.bind(this)
                            })
                        ],
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Submit",
                            enabled: false,
                            press: function (oEvent) {
                                var sText = this.deposit;
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
                                                order_id: orderId,
                                                amount: sText,
                                                voucher_date: order_date,
                                            }),
                                        },
                                        success: function (dataClient) {
                                            // if (sText != due) {
                                            var balance = parseFloat(due) - parseFloat(sText);
                                            $.ajax({
                                                url: host,
                                                type: "POST",
                                                data: {
                                                    method: "updateDue",
                                                    data: JSON.stringify({
                                                        balance: balance,
                                                        id: orderId,
                                                    }),
                                                },
                                                success: function (dataClient) {
                                                    sap.ui.core.BusyIndicator.hide();
                                                    console.log(dataClient);
                                                    that.refreshData();
                                                    if (sText == due) {
                                                        MessageBox.success("Succesfully cleared");
                                                    }
                                                    else {
                                                        MessageBox.success("Succesfully deposited");
                                                    }
                                                },
                                                error: function (request, error) {
                                                    console.log('Error');
                                                    sap.ui.core.BusyIndicator.hide();
                                                },
                                            });
                                            // }
                                            // else {
                                            //     sap.ui.core.BusyIndicator.hide();
                                            //     console.log(dataClient);
                                            //     MessageBox.success("Succesfully cleared");
                                            // }
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

                this.oSubmitDialog.open();
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
                                                    <td class="text-center">${value.st_value}</td>
                                                    <td class="text-center">${value.hm_charge}</td>
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

                const popupWindow = window.open('', '_blank', 'width=800,height=900');
                // Render the PopupContent component inside the popup window
                popupWindow.document.write(printContent);

            },


        });
    }
);
